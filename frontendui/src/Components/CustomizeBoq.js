import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import "./CustomizeBoq.css";

const CustomizeBoq = () => {
  const location = useLocation();
  const { marketPrices, data } = location.state || {};
  const [customizedData, setCustomizedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [cementBrand, setCementBrand] = useState("Standard Cement");
  const [paintTypes, setPaintTypes] = useState({});
  const [tileTypes, setTileTypes] = useState({});
  const [summary, setSummary] = useState({
    originalCost: 0,
    customizedCost: 0,
    difference: 0
  });
  const navigate = useNavigate();
  const { id } = useParams();

  // Available options for customization
  const cementOptions = [
    { name: "Standard Cement", price: marketPrices?.["Cement - 50Kg bag"]?.price || 0 },
    { name: "Tokyo Super", price: 1950.00 },
    { name: "Ultratech Cement", price: 2625.00 }
  ];

  const paintOptions = [
    { name: "Standard Emulsion", price: marketPrices?.["Emulsion Paint"]?.price || 0 },
    { name: "Multilac Emulsion", price: 1982.00 },
    { name: "Causeway Emultion Luxury", price: 3050.00 }
  ];

  const tileOptions = [
    { name: "Standard Porcelain", price: marketPrices?.["Floor Tile - Homogeneous Porcelain semi - Glazed"]?.price || 0 },
    { name: "Lanka tiles", price: 200.00 },
    { name: "Mack Floor Tile", price: 310.00 }
  ];

  useEffect(() => {
    if (data) {
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setCustomizedData(JSON.parse(JSON.stringify(data)));
      calculateOriginalCost();
    }
  }, [data, marketPrices]);

  // Calculate the original cost from the data
  const calculateOriginalCost = () => {
    if (!data || !marketPrices) return;
    
    let originalTotal = 0;
    
    Object.keys(data).forEach((category) => {
      Object.entries(data[category] || {}).forEach(([key, value]) => {
        const materialInfo = getMaterialInfo(key);
        if (materialInfo.price && materialInfo.price !== "Price not found") {
          originalTotal += value * materialInfo.price;
        }
      });
    });
    
    setSummary(prev => ({
      ...prev,
      originalCost: originalTotal,
      customizedCost: originalTotal,
      difference: 0
    }));
  };

  // Helper functions for material pricing and formatting
  const getMaterialInfo = (materialKey, customized = false) => {
    if (!marketPrices) return { price: "N/A", unit: "N/A" };

    // For cement, use the selected brand price
    if (materialKey.toLowerCase().includes("cement") && customized) {
      const selectedCement = cementOptions.find(c => c.name === cementBrand);
      return { 
        price: selectedCement?.price || marketPrices["Cement - 50Kg bag"].price, 
        unit: marketPrices["Cement - 50Kg bag"].unit 
      };
    }
    // For paint, use the selected paint price for this specific item
    else if (materialKey.toLowerCase().includes("paint") && customized && paintTypes[materialKey]) {
      const selectedPaint = paintOptions.find(p => p.name === paintTypes[materialKey]);
      return { 
        price: selectedPaint?.price || marketPrices["Emulsion Paint"].price, 
        unit: marketPrices["Emulsion Paint"].unit 
      };
    }
    // For tiles, use the selected tile price for this specific item
    else if (materialKey.includes("Tiles needed (with waste factor)") && customized && tileTypes[materialKey]) {
      const selectedTile = tileOptions.find(t => t.name === tileTypes[materialKey]);
      return { 
        price: selectedTile?.price || marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed"].price, 
        unit: marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed"].unit 
      };
    }
    
    // Default cases - same as original
    if (materialKey.toLowerCase().includes("brick")) {
      return marketPrices["brick"];
    } else if (materialKey.toLowerCase().includes("cement")) {
      return marketPrices["Cement - 50Kg bag"];
    } else if (materialKey.toLowerCase().includes("sand")) {
      return marketPrices["River sand"];
    } else if (materialKey.toLowerCase().includes("gravel")) {
      return marketPrices["gravel"];
    } else if (materialKey.toLowerCase().includes("steel")) {
      return marketPrices["steel"];
    } else if (materialKey.toLowerCase().includes("primer")) {
      return marketPrices["Wall filler Primer external"];
    } else if (materialKey.toLowerCase().includes("paint")) {
      return marketPrices["Emulsion Paint"];
    } else if (materialKey.includes("Tiles needed (with waste factor)")) {
      return marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed"];
    }
    
    // Check if material exists in marketPrices
    let material = marketPrices[materialKey];
    if (!material) {
      return { price: "Price not found", unit: "N/A" };
    }
  
    // Check for price in the found material object
    if (!material.price) {
      return { price: "Price not found", unit: "N/A" };
    }
  
    return material;
  };

  const formatTitle = (key) => key.replace(/_/g, " ").replace(" Estimate", " Estimation");

  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return num;
  };

  const calculateCost = (quantity, price) => {
    if (!price || price === "Price not found") return "N/A";
    return (quantity * price).toLocaleString();
  };

  // Helper function to determine unit from the material key
  const getUnitFromKey = (key) => {
    if (key.toLowerCase().includes("cubic meters")) return "m³";
    if (key.toLowerCase().includes("meters") || key.toLowerCase().includes("area")) return "m²";
    if (key.toLowerCase().includes("kg")) return "kg";
    if (key.toLowerCase().includes("liters")) return "liter";
    if (key.toLowerCase().includes("bags")) return "bags";
    if (key.toLowerCase().includes("tiles")) return "pcs";
    return "";
  };

  // Handle cement brand change
  const handleCementBrandChange = (e) => {
    const newBrand = e.target.value;
    setCementBrand(newBrand);
    
    // Recalculate costs
    calculateCustomizedCost(newBrand, paintTypes, tileTypes);
  };

  // Handle paint type change for a specific item
  const handlePaintTypeChange = (materialKey, value) => {
    const newPaintTypes = { ...paintTypes, [materialKey]: value };
    setPaintTypes(newPaintTypes);
    
    // Recalculate costs
    calculateCustomizedCost(cementBrand, newPaintTypes, tileTypes);
  };

  // Handle tile type change for a specific item
  const handleTileTypeChange = (materialKey, value) => {
    const newTileTypes = { ...tileTypes, [materialKey]: value };
    setTileTypes(newTileTypes);
    
    // Recalculate costs
    calculateCustomizedCost(cementBrand, paintTypes, newTileTypes);
  };

  // Calculate the customized total cost
  const calculateCustomizedCost = (cement, paints, tiles) => {
    if (!data || !marketPrices) return;
    
    let customizedTotal = 0;
    
    Object.keys(data).forEach((category) => {
      Object.entries(data[category] || {}).forEach(([key, value]) => {
        let materialPrice;
        
        // Check cement
        if (key.toLowerCase().includes("cement")) {
          const selectedCement = cementOptions.find(c => c.name === cement);
          materialPrice = selectedCement?.price;
        }
        // Check paint
        else if (key.toLowerCase().includes("paint") && paints[key]) {
          const selectedPaint = paintOptions.find(p => p.name === paints[key]);
          materialPrice = selectedPaint?.price;
        }
        // Check tiles
        else if (key.includes("Tiles needed (with waste factor)") && tiles[key]) {
          const selectedTile = tileOptions.find(t => t.name === tiles[key]);
          materialPrice = selectedTile?.price;
        }
        // Default case
        else {
          const materialInfo = getMaterialInfo(key);
          materialPrice = materialInfo.price !== "Price not found" ? materialInfo.price : 0;
        }
        
        customizedTotal += value * (materialPrice || 0);
      });
    });
    
    setSummary(prev => ({
      ...prev,
      customizedCost: customizedTotal,
      difference: customizedTotal - prev.originalCost
    }));
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      // Create object to save to database
      const customizationData = {
        project_id: id,
        cement_brand: cementBrand,
        paint_types: paintTypes,
        tile_types: tileTypes,
        original_cost: summary.originalCost,
        customized_cost: summary.customizedCost,
        created_at: new Date()
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('customizations')
        .insert([customizationData]);
        
      if (error) throw error;
      
      alert("Customizations saved successfully!");
      navigate(`/output/${id}`);
    } catch (error) {
      console.error("Error saving customizations:", error);
      alert("There was an error saving your customizations.");
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate(`/output/${id}`);
  };

  // Render the material dropdown if it's customizable
  const renderMaterialDropdown = (materialKey, value) => {
    if (materialKey.toLowerCase().includes("cement")) {
      // We're handling cement globally at the top
      return null;
    } else if (materialKey.toLowerCase().includes("paint")) {
      return (
        <select 
          value={paintTypes[materialKey] || paintOptions[0].name} 
          onChange={(e) => handlePaintTypeChange(materialKey, e.target.value)}
          className="material-dropdown"
        >
          {paintOptions.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name} ({formatNumber(option.price)})
            </option>
          ))}
        </select>
      );
    } else if (materialKey.includes("Tiles needed (with waste factor)")) {
      return (
        <select 
          value={tileTypes[materialKey] || tileOptions[0].name} 
          onChange={(e) => handleTileTypeChange(materialKey, e.target.value)}
          className="material-dropdown"
        >
          {tileOptions.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name} ({formatNumber(option.price)})
            </option>
          ))}
        </select>
      );
    }
    return null;
  };

  return (
    <div className="customize-boq-page">
      <div className="customize-header">
        <span className="customize-logo">
          BUILD<span className="customize-highlight">SMART</span>
        </span>
        <h2>Customize Bill of Quantities</h2>
      </div>

      <div className="global-customization">
        <div className="cement-selection">
          <h3>Select Cement Brand</h3>
          <p>This will update all cement-related items in your BOQ</p>
          <select 
            value={cementBrand} 
            onChange={handleCementBrandChange}
            className="global-dropdown"
          >
            {cementOptions.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name} ({formatNumber(option.price)}/bag)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="boq-customization-table">
        <h3>Bill of Quantities Review</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Materials</th>
                <th>Quantities</th>
                <th>Units</th>
                <th>Original Price</th>
                <th>Customized Price</th>
                <th>Customized Cost</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {data && (
                <>
                  {Object.keys(data).map((category) => (
                    <React.Fragment key={category}>
                      <tr className="table-header-row">
                        <td colSpan="7" className="table-header">{formatTitle(category)}</td>
                      </tr>
                      {Object.entries(data[category] || {}).map(([key, value]) => {
                        const originalMaterialInfo = getMaterialInfo(key);
                        const customMaterialInfo = getMaterialInfo(key, true);
                        const unit = getUnitFromKey(key) || originalMaterialInfo.unit || "";
                        
                        const originalPrice = originalMaterialInfo.price !== "Price not found" ? originalMaterialInfo.price : "N/A";
                        const customizedPrice = customMaterialInfo.price !== "Price not found" ? customMaterialInfo.price : "N/A";
                        const customizedCost = customizedPrice !== "N/A" ? calculateCost(value, customizedPrice) : "N/A";
                        
                        const isChanged = originalPrice !== customizedPrice;
                        
                        return (
                          <tr key={key} className={isChanged ? "changed-row" : ""}>
                            <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                            <td>{formatNumber(value)}</td>
                            <td>{unit}</td>
                            <td>{formatNumber(originalPrice)}</td>
                            <td className={isChanged ? "price-changed" : ""}>
                              {formatNumber(customizedPrice)}
                            </td>
                            <td>{customizedCost !== "N/A" ? customizedCost : "N/A"}</td>
                            <td>
                              {renderMaterialDropdown(key, value)}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="customization-summary">
        <h3>Customization Summary</h3>
        <div className="summary-details">
          <p>Original Total Cost: <span className="cost">Rs.{formatNumber(summary.originalCost)}</span></p>
          <p>Customized Total Cost: <span className="cost">Rs.{formatNumber(summary.customizedCost)}</span></p>
          <p>Difference: 
            <span className={`cost ${summary.difference > 0 ? 'increased' : 'decreased'}`}>
              {summary.difference > 0 ? '+' : ''}{formatNumber(summary.difference)}
            </span>
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="save-btn" onClick={handleSave}>Save Customizations</button>
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CustomizeBoq;