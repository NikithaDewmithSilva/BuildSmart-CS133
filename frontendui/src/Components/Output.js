import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Output.css";
import InviteCustomerForm from "./InviteCustomerForm";

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [boqData, setBoqData] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false); // State for popup
  const [marketPrices, setMarketPrices] = useState(null)
  const [data, setData] = useState(null);
  const navigate = useNavigate();

const formatTitle = (key) => key.replace(/_/g, " ").replace(" Estimate", " Estimation");

  useEffect(() => {
    // Fetch the market prices from the JSON file
    fetch("/marketPrices.json")
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("Market prices loaded:", jsonData);
        setMarketPrices(jsonData); // Update marketPrices with the data from the JSON file
      })
      .catch((error) => {
        console.error("Error loading market prices:", error);
      });

    if (fileProcessed) {
      // Load the output data
      fetch('/output.json')
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
        })
        .catch(error => {
          console.error("Error loading output data:", error);
        });
    }
  }, [fileProcessed]);


  useEffect(() => {
    if (fileProcessed) {
      // Load the output data
      fetch('output.json')
        .then(response => response.json())
        .then(jsonData => {
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

  // Helper function to get price and unit for a material
  // const getMaterialInfo = (materialKey) => {
  //   if (!marketPrices) return { price: "N/A", unit: "N/A" };
    
  //   if (materialKey.toLowerCase().includes("brick")) {
  //     return marketPrices["brick"];
  //   } else if (materialKey.toLowerCase().includes("cement")) {
  //     return marketPrices["Cement - 50Kg bag"];
  //   } else if (materialKey.toLowerCase().includes("sand")) {
  //     return marketPrices["River sand"];
  //   } else if (materialKey.toLowerCase().includes("gravel")) {
  //     return marketPrices["gravel"];
  //   } else if (materialKey.toLowerCase().includes("steel")) {
  //     return marketPrices["steel"];
  //   } else if (materialKey.toLowerCase().includes("primer")) {
  //     return marketPrices["Wall filler Primer external"];
  //   } else if (materialKey.toLowerCase().includes("paint")) {
  //     return marketPrices["Emulsion Paint"];
  //   }else if (materialKey.toLowerCase().includes("Tiles needed (with waste factor)")) {
  //     return marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed"];
  //   }

  // };

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
    }else if (materialKey.includes("Tiles needed (with waste factor)")) {
      return marketPrices["Floor Tile - Homogeneous Porcelain semi - Glazed"];
    }
    
    // Check if material exists in marketPrices
    let material = marketPrices[materialKey];
    if (!material) {
      console.warn(`Material ${materialKey} not found in market prices`);
      return { price: "Price not found", unit: "N/A" };
    }
  
    // Check for price in the found material object
    if (!material.price) {
      console.warn(`Price for ${materialKey} not found in market prices`);
      return { price: "Price not found", unit: "N/A" };
    }
  
    return material;
  };

  // Helper function to calculate the cost
  const calculateCost = (quantity, price) => {
    if (!price || price === "Price not found") return "N/A";
    return (quantity * price).toLocaleString();
  };

  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return num;
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
                  <h4>Note: These prices are given according to the BSR 2024<br></br>Feel free to customize</h4>
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
                                const unit = getUnitFromKey(key) || materialInfo.unit || "";
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
              ${boqData ? boqData.reduce((total, item) => total + item.amount, 0).toFixed(2) : "Processing..."}
            </p>
            
            <div className="output-buttons">
              <button className="download-btn">Download</button>
              <button className="customize-btn">Customize the BOQ</button>
              <button className='share-btn' onClick={() => setShowInviteForm(true)}>Share</button>
              <button className="submit-btn">Submit another cad</button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Show InviteCustomerForm in popup */}
      {showInviteForm && (
        <div className="popup-overlay">
          <InviteCustomerForm onClose={() => setShowInviteForm(false)} />
        </div>
      )}
    </div>
  );
};

export default Output;


