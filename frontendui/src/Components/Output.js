import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Output.css";
import InviteCustomerForm from "./InviteCustomerForm";

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [boqData, setBoqData] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false); // State for popup
  const navigate = useNavigate(); 

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
          <button className="output-profile-btn">PROFILE</button>
        </div>
  
        <div className="output-content">
          <h2 className="output-title">Here's your bill of quantities for your dream house</h2>
  
          <div className={`boq-table ${fileProcessed ? "processed" : ""}`} onClick={processFile}>
            {fileProcessed ? (
              <table>
                <thead>
                  <tr>
                    <th>Description of Item</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {boqData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.unit}</td>
                      <td>{item.quantity}</td>
                      <td>${item.rate}</td>
                      <td>${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="grand-total-row">
                    <td colSpan="4" className="grand-total-label">Grand Total</td>
                    <td className="grand-total-amount">
                      ${boqData.reduce((total, item) => total + item.amount, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              //           <div className="App">
              //   <h1>Bill of Quantities (BOQ)</h1>

              //   {/* Wall Material Estimate Section */}
              //   <section className="material-estimates">
              //     <h2>Wall Material Estimate</h2>
              //     <table>
              //       <tbody>
              //         <tr>
              //           <td>Estimated Bricks Required</td>
              //           <td>{data.WallMaterialEstimate.EstimatedBricksRequired}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Cement Required (bags)</td>
              //           <td>{data.WallMaterialEstimate.EstimatedCementRequiredBags}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Cement Required (kg)</td>
              //           <td>{data.WallMaterialEstimate.EstimatedCementRequiredKg}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Sand Required (kg)</td>
              //           <td>{data.WallMaterialEstimate.EstimatedSandRequiredKg}</td>
              //         </tr>
              //       </tbody>
              //     </table>
              //   </section>

              //   {/* Foundation Material Estimate Section */}
              //   <section className="material-estimates">
              //     <h2>Foundation Material Estimate</h2>
              //     <table>
              //       <tbody>
              //         <tr>
              //           <td>Estimated Concrete Volume (m³)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedConcreteVolumeM3}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Cement Required (bags)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedCementRequiredBags}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Cement Required (kg)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedCementRequiredKg}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Gravel Required (kg)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedGravelRequiredKg}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Sand Required (kg)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedSandRequiredKg}</td>
              //         </tr>
              //         <tr>
              //           <td>Estimated Steel Required (kg)</td>
              //           <td>{data.FoundationMaterialEstimate.EstimatedSteelRequiredKg}</td>
              //         </tr>
              //       </tbody>
              //     </table>
              //   </section>

              //   {/* Add other sections like Slab, Plaster, Paint, etc. */}

              //   <section className="summary">
              //     <h2>Summary</h2>
              //     <table>
              //       <tbody>
              //         <tr>
              //           <td>Total Walls</td>
              //           <td>{data.Summary.TotalWalls}</td>
              //         </tr>
              //         <tr>
              //           <td>Total Wall Area (m²)</td>
              //           <td>{data.Summary.TotalWallArea}</td>
              //         </tr>
              //         <tr>
              //           <td>Detected Doors</td>
              //           <td>{data.Summary.DetectedDoors}</td>
              //         </tr>
              //         {/* More summary fields */}
              //       </tbody>
              //     </table>
              //   </section>
              // </div>
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
              <button className="submit-btn">Sumbit another cad</button>
              <button onClick={() => setShowInviteForm(true)}>Invite Customer</button>
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
