import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Output.css";
import InviteCustomerForm from "./InviteCustomerForm";

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [boqData, setBoqData] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false); // State for popup
  const navigate = useNavigate(); 

  const [data, setData] = useState(null);

  // Fetch JSON data
  useEffect(() => {
    fetch("/output.json") // Adjust path if needed
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  // If data is not loaded, show a loading message
  if (!data) return <p>Loading...</p>;

  const processFile = () => {
    setTimeout(() => {
      setBoqData([
        { description: "Concrete Work", unit: "sqm", quantity: 158.63, rate: 50, amount: 7931.50 },
        { description: "Brick Laying", unit: "sqm", quantity: 225.00, rate: 35, amount: 7875.00 },
        { description: "Roofing", unit: "sqm", quantity: 180.00, rate: 80, amount: 14400.00 },
      ]);
      setFileProcessed(true);
    }, 2000);
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
                <table>
                  <thead>
                    <tr>
                      <th>Materials</th>
                      <th>Price per unit</th>
                      <th>Quantities</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Loop through categories in JSON */}
                    {Object.keys(data).map((category) => (
                      <>
                        {/* Section Headers */}
                        <tr className="table-header-row">
                          <th className="table-header" colSpan="4">{category}</th>
                        </tr>
        
                        {/* Loop through items in each category */}
                        {Object.entries(data[category]).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>
                            <label>
                                <input
                                type="number">
                                </input>
                              </label></td>
                            <td>
                              {value.toLocaleString()}
                            </td>
                            <td>{value.toLocaleString()}</td>
                          </tr>
                        ))}
                      </>
                    ))}
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
            {/* <p className="completion-time">THE ESTIMATED TIME FOR COMPLETION IS:<br /> XX MONTHS</p> */}
            
            <div className="output-buttons">
              <button className="download-btn">Download</button>
              {/* <button className="submit-btn">Submit CAD Design / Blueprint</button> */}
              <button className="customize-btn">Customize the BOQ</button>
              <button className='share-btn' onClick={() => setShowInviteForm(true)}>Share</button>
              <button className="submit-btn">Sumbit another cad</button>
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
}  

export default Output;
