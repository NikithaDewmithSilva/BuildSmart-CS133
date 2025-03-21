import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Output.css";
import { supabase } from "../supabase";
import InviteCustomerForm from "./InviteCustomerForm";

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);

  const [showInviteForm, setShowInviteForm] = useState(false); // State for popup
  const [marketPrices, setMarketPrices] = useState(null)
  const [data, setData] = useState(null);
  const [boqs, setBoqs] = useState([]);
  const [boqData, setBoqData] = useState([]);
  const navigate = useNavigate();

  const handleMaterialChart = () => {
    navigate('./material-usage-chart')
  }

const formatTitle = (key) => key.replace(/_/g, " ").replace(" Estimate", " Estimation");

const { id } = useParams();

  useEffect(() => {
    // Fetch the market prices from the JSON file
    fetch("/api/market-prices")
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
      fetch("/api/output")
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

  //Left this part commented because the 404 that occurs when running this couldn't be resolved. 

  // const fetchAllBOQs = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("generated_boq")
  //       .select("*")
  //       .eq("project_id", id);
  
  //     if (error) throw error;
  //     setBoqs(data);
  //   } catch (err) {
  //     console.error("Error fetching BOQs:", err.message);
  //   }
  // };

  //   useEffect(() => {
  //     if (id) {
  //       fetchAllBOQs();
  //     }
  //   }, [id]); 




  // const saveBOQAsPDF = async () => {
  //   const projectId = id;
  //   const cadFileId = "your_cad_file_id";
  //   const boqName = prompt("Enter a name for this BOQ:", "Default BOQ Name");
  
  //   if (!boqName) {
  //     alert("BOQ Name is required!");
  //     return;
  //   }
  
  //   const materials = Object.entries(data || {}).flatMap(([category, items]) =>
  //     Object.entries(items).map(([material, quantity]) => ({
  //       material,
  //       estimated: quantity,
  //       unit: getUnitFromKey(material),
  //     }))
  //   );
  
  //   const boqData = materials.reduce((acc, material) => {
  //     acc[material.material] = {
  //       quantity: material.estimated,
  //       unit: material.unit,
  //       price: "N/A",
  //       cost: "N/A",
  //     };
  //     return acc;
  //   }, {});


  
  //   const payload = {
  //     project_id: projectId,
  //     cad_file_id: cadFileId,
  //     boq_name: boqName,
  //     boq_data: boqData
  //   };

  //   console.log("reached payload")
  
  //   const response = await fetch("/api/boqPdf", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  
  //   const jsondata = await response.json();
  //   if (jsondata.status === "success") {
  //     alert("BOQ PDF saved successfully!");
  //     fetchAllBOQs(); // Refresh the list of BOQs
  //   } else {
  //     alert("Error saving BOQ PDF.");
  //   }
  // }
  


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
              <button className="submit-btn" onClick={handleMaterialChart}>Track in real time</button>
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


