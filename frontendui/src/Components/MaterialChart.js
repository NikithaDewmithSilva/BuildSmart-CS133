import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "./MaterialChart.css";

const MaterialChart = () => {
  const [chartUrl, setChartUrl] = useState(null);
  const [chartType, setChartType] = useState("category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [usageData, setUsageData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  const project_id = useParams()

  useEffect(() => {
    // Fetch materials data
    const fetchMaterials = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/materials");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMaterials(data);
        
        // Extract existing usage data
        const extractedUsageData = {};
        Object.keys(data).forEach(category => {
          if (category.endsWith("Usage Tracking")) {
            const baseCategory = category.replace("Usage Tracking", "Material Estimate").trim();
            
            Object.keys(data[category]).forEach(usageKey => {
              if (usageKey.endsWith(" Used")) {
                const material = usageKey.replace(" Used", "");
                if (!extractedUsageData[baseCategory]) {
                  extractedUsageData[baseCategory] = {};
                }
                extractedUsageData[baseCategory][material] = data[category][usageKey];
              }
            });
          }
        });
        
        setUsageData(extractedUsageData);
      } catch (error) {
        console.error("Error fetching materials data:", error);
        setError("Failed to load materials data. Please try again later.");
      }
    };

    // Fetch available material types for chart options
    const fetchMaterialTypes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api//material-types");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMaterialTypes(data.material_types);
      } catch (error) {
        console.error("Error fetching material types:", error);
        // Fallback to default options if API fails
        setMaterialTypes([
          { id: "category", name: "Materials by Category" },
          { id: "cement", name: "Cement Usage" }
        ]);
      }
    };

    fetchMaterials();
    fetchMaterialTypes();

    // Set up Supabase realtime subscription
    const subscription = supabase
      .channel('materials-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'materials_data'
        },
        (payload) => {
          console.log('Supabase realtime update received:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new && payload.new.data) {
              const newData = payload.new.data;
              setMaterials(newData);
              
              // Also update the usage data
              const extractedUsageData = {};
              Object.keys(newData).forEach(category => {
                if (category.endsWith("Usage Tracking")) {
                  const baseCategory = category.replace("Usage Tracking", "Material Estimate").trim();
                  
                  Object.keys(newData[category]).forEach(usageKey => {
                    if (usageKey.endsWith(" Used")) {
                      const material = usageKey.replace(" Used", "");
                      if (!extractedUsageData[baseCategory]) {
                        extractedUsageData[baseCategory] = {};
                      }
                      extractedUsageData[baseCategory][material] = newData[category][usageKey];
                    }
                  });
                }
              });
              
              setUsageData(extractedUsageData);
              
              // Show a notification
              setUpdateSuccess("Data updated from another client");
              setTimeout(() => setUpdateSuccess(""), 3000);
              
              // Force chart refresh
              if (chartUrl) {
                URL.revokeObjectURL(chartUrl);
                setChartUrl(null);
              }
            }
          }
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    // Fetch the chart image from the backend
    const fetchChart = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Add timestamp to URL to prevent caching when data changes
        const timestamp = new Date().getTime();
        const response = await fetch(`http://127.0.0.1:5000/api//material-chart?type=${chartType}&_=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Clean up previous URL to prevent memory leaks
        if (chartUrl) {
          URL.revokeObjectURL(chartUrl);
        }
        
        setChartUrl(url);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart:", error);
        setError("Failed to load chart. Please try again later.");
        setLoading(false);
      }
    };

    if (materials) {
      fetchChart();
    }

    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (chartUrl) {
        URL.revokeObjectURL(chartUrl);
      }
    };
  }, [chartType, materials]); // Re-fetch when chart type or materials data changes

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleUsageChange = (category, material, e) => {
    const value = e.target.value;
    setUsageData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [material]: value !== "" ? parseFloat(value) : ""
      }
    }));
  };

  // Updated to work with Supabase
  const handleUsageUpdate = async (category, material) => {
    setUpdateSuccess("");
    setUpdateError("");
    
    try {
      const usedAmount = usageData[category]?.[material] || 0;
      
      const response = await fetch("http://127.0.0.1:5000/api/update-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          material,
          usedAmount
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUpdateSuccess(`Updated usage for ${material}`);
        setTimeout(() => setUpdateSuccess(""), 3000);
        
        // No need to manually refresh data here as we'll get the update via Supabase realtime
      } else {
        setUpdateError(result.error || "Failed to update usage");
        setTimeout(() => setUpdateError(""), 3000);
      }
    } catch (error) {
      console.error("Error updating usage:", error);
      setUpdateError("Error connecting to server");
      setTimeout(() => setUpdateError(""), 3000);
    }
  };

  // Function to get a nice display title for material categories
  const formatCategoryTitle = (category) => {
    return category.replace(' Material Estimate', '');
  };

  // Function to format values with proper units
  const formatValue = (material, value) => {
    // Add units based on material type
    let formattedValue = typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value;
    
    if (typeof material === 'string') {
      if (material.toLowerCase().includes('volume') || material.toLowerCase().includes('cubic')) {
        formattedValue += ' m³';
      } else if (material.toLowerCase().includes('kg')) {
        formattedValue += ' kg';
      } else if (material.toLowerCase().includes('bags')) {
        formattedValue += ' bags';
      } else if (material.toLowerCase().includes('liters')) {
        formattedValue += ' L';
      }
    }
    
    return formattedValue;
  };

  // Calculate the percentage used
  const calculatePercentageUsed = (category, material) => {
    const estimated = materials[category][material];
    const used = usageData[category]?.[material] || 0;
    if (estimated && estimated > 0) {
      return (used / estimated) * 100;
    }
    return 0;
  };

  // Get color based on usage percentage
  const getPercentageColor = (percentage) => {
    if (percentage < 50) return "var(--usage-low)";
    if (percentage < 75) return "var(--usage-medium)";
    if (percentage < 90) return "var(--usage-high)";
    return "var(--usage-critical)";
  };

  return (
    <div className="material-chart-container">
      <div className="material-chart-header">
        <h2>Construction Material Dashboard</h2>
        
        {updateSuccess && <div className="success-message">{updateSuccess}</div>}
        {updateError && <div className="error-message">{updateError}</div>}
        
        <div className="chart-controls">
          <label htmlFor="chartType">Select Chart Type:</label>
          <select 
            id="chartType" 
            value={chartType} 
            onChange={handleChartTypeChange}
            className="chart-select"
          >
            {materialTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="chart-display-container">
        <div className="chart-display">
          {loading && <div className="loading-spinner-chart">Loading chart...</div>}
          {error && <div className="error-message">{error}</div>}
          
          {chartUrl && !loading && (
            <div className="chart-image-container">
              <img 
                src={chartUrl} 
                alt={`Material Usage Chart - ${chartType}`} 
                className="chart-image"
              />
            </div>
          )}
        </div>
      </div>
      
      {materials && (
        <div className="materials-summary">
          <h3>Materials Tracking</h3>
          <div className="materials-grid">
            {Object.keys(materials)
              .filter(category => category !== "Summary" && !category.endsWith("Usage Tracking"))
              .map(category => (
                <div key={category} className="category-card">
                  <h4>{formatCategoryTitle(category)}</h4>
                  <table className="material-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Estimated</th>
                        <th>Used</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(materials[category]).map(([material, value]) => {
                        const usedValue = usageData[category]?.[material] || "";
                        const percentage = calculatePercentageUsed(category, material);
                        
                        return (
                          <tr key={material}>
                            <td className="material-name">{material}</td>
                            <td className="material-value">{formatValue(material, value)}</td>
                            <td className="material-usage">
                              <div className="usage-input-group">
                                <input
                                  type="number"
                                  min="0"
                                  value={usedValue}
                                  onChange={(e) => handleUsageChange(category, material, e)}
                                  className="usage-input"
                                />
                                <div 
                                  className="usage-percentage" 
                                  style={{ backgroundColor: getPercentageColor(percentage) }}
                                >
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </td>
                            <td className="material-action">
                              <button 
                                onClick={() => handleUsageUpdate(category, material)}
                                className="update-button"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialChart;

