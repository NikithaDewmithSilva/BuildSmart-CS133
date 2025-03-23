import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Output.css";
import { supabase } from "../supabase";
import InviteCustomerForm from "./InviteCustomerForm";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [marketPrices, setMarketPrices] = useState(null);
  const [data, setData] = useState(null);
  const [boqs, setBoqs] = useState([]);
  const [boqData, setBoqData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMaterialChart = () => {
    navigate('./material-usage-chart')
  }

const formatTitle = (key) => key.replace(/_/g, " ").replace(" Estimate", " Estimation");


  useEffect(() => {
    // Fetch the market prices from the JSON file
    fetch("http://127.0.0.1:5000/api/market-prices")
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("Market prices loaded:", jsonData);
        setMarketPrices(jsonData);
      })
      .catch((error) => {
        console.error("Error loading market prices:", error);
      });

    if (fileProcessed) {
      // Load the output data
      fetch("http://127.0.0.1:5000/api/output")
        .then(response => response.json())
        .then(jsonData => {
          console.log("output data loaded:", jsonData);
          setData(jsonData);
        })
        .catch(error => {
          console.error("Error loading output data:", error);
        });
    }
  }, [fileProcessed]);

  const processFile = () => {
    setTimeout(() => {
      setFileProcessed(true);
    }, 2000);
  };

  const handleDownload = () => {
    // Check if data is available
    if (!data) {
      alert("Please wait for the data to load before downloading.");
      return;
    }
  
    const pdfName = `BOQ_Project_${id}_${new Date().toISOString().slice(0, 10)}.pdf`;
    

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });
    
    pdf.setFontSize(18);
    pdf.text('Bill of Quantities (BOQ)', 15, 15);
    pdf.setFontSize(12);
    pdf.text(`Project ID: ${id}`, 15, 25);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, 32);
    
    const columns = {
      material: { x: 15, width: 80 },
      quantity: { x: 100, width: 40 },
      unit: { x: 145, width: 40 },
      price: { x: 190, width: 40 },
      cost: { x: 235, width: 70 }
    };
    
    const fitTextInColumn = (text, columnWidth) => {
      const charWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
      if (charWidth <= columnWidth) {
        return text;
      }
      
      let maxLength = Math.floor(text.length * (columnWidth / charWidth));
      if (maxLength < 5) maxLength = 5; 
      
      return text.substring(0, maxLength - 3) + '...';
    };
    
    const addTableHeaders = (pdf, y) => {
      pdf.setFont(undefined, 'bold');
      pdf.text("Materials", columns.material.x, y);
      pdf.text("Quantities", columns.quantity.x, y);
      pdf.text("Units", columns.unit.x, y);
      pdf.text("Price per unit", columns.price.x, y);
      pdf.text("Cost", columns.cost.x, y);
      pdf.setFont(undefined, 'normal');
    
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, y + 2, 300, y + 2);
      
      return y + 10;
    };
    
    let y = 45;
    
    Object.keys(data).forEach((category, categoryIndex) => {
      if (y > 180 && categoryIndex > 0) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(14);
      pdf.text(formatTitle(category), 15, y);
      pdf.setFontSize(12);
      y += 10;

      y = addTableHeaders(pdf, y);
      
      Object.entries(data[category] || {}).forEach(([key, value]) => {
        if (y > 200) {
          pdf.addPage();
          y = 20;
          y = addTableHeaders(pdf, y);
        }
        
        const materialInfo = getMaterialInfo(key) || {};
        const unit = materialInfo.unit || "";
        const price = materialInfo.price !== "Price not found" ? materialInfo.price : "N/A";
        const cost = materialInfo.price !== "Price not found" ? calculateCost(value, materialInfo.price) : "N/A";
        
        const materialName = key.charAt(0).toUpperCase() + key.slice(1);
        const fittedMaterialName = fitTextInColumn(materialName, columns.material.width);
        
        const quantityText = formatNumber(value).toString();
        const priceText = price !== "N/A" ? formatNumber(price).toString() : "N/A";
        const costText = cost !== "N/A" ? cost : "N/A";
        
        pdf.text(fittedMaterialName, columns.material.x, y);
        pdf.text(quantityText, columns.quantity.x, y, { align: 'left' });
        pdf.text(unit, columns.unit.x, y);
        pdf.text(priceText, columns.price.x, y, { align: 'left' });
        pdf.text(costText, columns.cost.x, y, { align: 'left' });
        
        
        pdf.setDrawColor(230, 230, 230);
        pdf.line(15, y + 4, 300, y + 4);
        
        y += 12; 
      });
      
      y += 8; 
    });
    
 
    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, y, 285, 15, 'F');
    
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(14);
    pdf.text(`Total Estimated Cost: $${calculateTotalCost()}`, 15, y + 10);
    
    // Save PDF
    pdf.save(pdfName);
  };

  // Function to handle customization of BOQ
const handleCustomize = () => {
  // Make sure we pass both the marketPrices and data as state
  navigate(`/project/${id}/input/process/output/customize`, { 
    state: { 
      marketPrices, 
      data 
    } 
  });
}; 

  // Function to handle submission of another CAD
  const handleSubmitAnother = () => {
    navigate('/upload');
  };

  // Function to handle real-time tracking
  const handleTrackRealTime = () => {
    navigate(`/track/${id}`);
  };

  // Helper functions for material pricing and formatting
  const getMaterialInfo = (materialKey) => {
    if (!marketPrices) return { price: "N/A", unit: "N/A" };

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
    } else if (materialKey.includes("24 x 24 inches")) {
      return marketPrices["Floor Tile - Homogeneous Porcelain semi -Glazed 24\" x 24\""];
    }else if (materialKey.includes("12 x 24 inches")) {
      return marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed 12\" x 24\""];
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

  const calculateCost = (quantity, price) => {
    if (!price || price === "Price not found") return "N/A";
    return (quantity * price).toLocaleString();
  };

  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return num;
  };


  // Calculate total cost for display
  const calculateTotalCost = () => {
    if (!data || !marketPrices) return "Processing...";
    
    let totalCost = 0;
    
    Object.keys(data).forEach((category) => {
      Object.entries(data[category] || {}).forEach(([key, value]) => {
        const materialInfo = getMaterialInfo(key);
        if (materialInfo.price && materialInfo.price !== "Price not found") {
          totalCost += value * materialInfo.price;
        }
      });
    });
    
    return totalCost.toLocaleString();
  };

  return (
    <div className="output-page">
      {/* Background blurs when form is open */}
      <div className={showInviteForm ? "blur-background" : ""}>
        <div className="output-header">
          <span className="output-logo">
            BUILD<span className="output-highlight">SMART</span>
          </span>
        </div>
  
        <div className="output-content">
          <h2 className="output-title">Here's the bill of quantities for your dream house</h2>
  
          <div className={`boq-table ${fileProcessed ? "processed" : ""}`} onClick={processFile}>
            {fileProcessed ? (
              <div className="App">
                <h1>Bill of Quantities (BOQ)</h1>
          
                <section className="material-estimates">
                  <h2>Construction Material Estimation</h2>
                  <h4>Note: These prices are given according to the BSR 2024<br />Feel free to customize</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Materials</th>
                        <th>Quantities</th>
                        <th>Units</th>
                        <th>Price per unit</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                    {data && (
                      <>
                        {Object.keys(data).map((category) => {
                          
                          return (
                            <React.Fragment key={category}>
                              <tr className="table-header-row">
                                <td colSpan="5" className="table-header">{formatTitle(category)}</td>
                              </tr>
                              {Object.entries(data[category] || {}).map(([key, value]) => {
                                const materialInfo = getMaterialInfo(key) || {};
                                const unit = materialInfo.unit || "";
                                const price = materialInfo.price !== "Price not found" ? materialInfo.price : "N/A";
                                const cost = materialInfo.price !== "Price not found" ? calculateCost(value, materialInfo.price) : "N/A";

                                return (
                                  <tr key={key}>
                                    <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                    <td>{formatNumber(value)}</td>
                                    <td>{unit}</td>
                                    <td>{price !== "N/A" ? formatNumber(price) : "N/A"}</td>
                                    <td>{cost !== "N/A" ? cost : "N/A"}</td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}
                    </tbody>
                  </table>
                </section>
              </div>
            ) : (
              <p className="processing-text">Click here to process and display your BOQ</p>
            )}
          </div>
  
          <div className="output-summary">
            <p className="grand-total">
              Your estimated cost is: <br />
              LKR {calculateTotalCost()}
            </p>
            
            <div className="output-buttons">
              <button className="download-btn" onClick={handleDownload}>Download</button>
              <button className="customize-btn" onClick={handleCustomize}>Customize the BOQ</button>
              <button className="share-btn" onClick={() => setShowInviteForm(true)}>Share</button>
              <button className="submit-btn" onClick={handleSubmitAnother}>Submit another CAD</button>
              <button className="submit-btn" onClick={handleMaterialChart}>Track in real time</button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Show InviteCustomerForm in popup */}
      {showInviteForm && (
        <div className="popup-overlay">
          <InviteCustomerForm 
            onClose={() => setShowInviteForm(false)} 
            projectId={id}  // Pass the project ID to the form
          />
        </div>
      )}
    </div>
  );
};

export default Output;