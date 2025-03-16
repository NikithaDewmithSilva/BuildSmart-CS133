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
                      <tr>
                          <th>Materials</th>
                          <th>Price per unit</th>
                          <th>Quantites</th>
                          <th>Cost</th>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Wall Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Bricks Required</td>
                        <td>147,371</td>
                        <td>147,371</td>
                        <td>147,371</td>
                      </tr>
                      <tr>
                        <td>Estimated Cement Required (Bags)</td>
                        <td>15,474.01</td>
                        <td>15,474.01</td>
                        <td>15,474.01</td>
                        </tr>
                      <tr>
                        <td>Estimated Cement Required (kg)</td>
                        <td>773,700.60</td>
                        <td>773,700.60</td>
                        <td>773,700.60</td>
                      </tr>
                      <tr>
                        <td>Estimated Sand Required (kg)</td>
                        <td>1,285,290.54</td>
                        <td>1,285,290.54</td>
                        <td>1,285,290.54</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Foundation Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Concrete Volume (Cubic Meters)</td>
                        <td>1,150.73</td>
                        <td>1,150.73</td>
                        <td>1,150.73</td>
                      </tr>
                      <tr>
                        <td>Estimated Cement Required (Bags)</td>
                        <td>8,055.09</td>
                        <td>8,055.09</td>
                        <td>8,055.09</td>
                      </tr>
                      <tr>
                        <td>Estimated Cement Required (kg)</td>
                        <td>402,754.44</td>
                        <td>402,754.44</td>
                        <td>402,754.44</td>
                      </tr>
                      <tr>
                        <td>Estimated Gravel Required (kg)</td>
                        <td>1,150,726.98</td>
                        <td>1,150,726.98</td>
                        <td>1,150,726.98</td>
                      </tr>
                      <tr>
                        <td>Estimated Sand Required (kg)</td>
                        <td>690,436.19</td>
                        <td>690,436.19</td>
                        <td>690,436.19</td>
                      </tr>
                      <tr>
                        <td>Estimated Steel Required (kg)</td>
                        <td>115,072.70</td>
                        <td>115,072.70</td>
                        <td>115,072.70</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Slab Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Concrete Volume (Cubic Meters)</td>
                        <td>30.96</td>
                        <td>30.96</td>
                        <td>30.96</td>
                      </tr>
                      <tr>
                        <td>Estimated Cement Required (Bags)</td>
                        <td>216.72</td>
                        <td>216.72</td>
                        <td>216.72</td>
                      </tr>
                      <tr>
                        <td>Estimated Cement Required (kg)</td>
                        <td>10,836.00</td>
                        <td>10,836.00</td>
                        <td>10,836.00</td>
                      </tr>
                      <tr>
                        <td>Estimated Gravel Required (kg)</td>
                        <td>30,960.00</td>
                        <td>30,960.00</td>
                        <td>30,960.00</td>
                      </tr>
                      <tr>
                        <td>Estimated Sand Required (kg)</td>
                        <td>18,576.00</td>
                        <td>18,576.00</td>
                        <td>18,576.00</td>
                      </tr>
                      <tr>
                        <td>Estimated Steel Required (kg)</td>
                        <td>2,012.40</td>
                        <td>2,012.40</td>
                        <td>2,012.40</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Plaster Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Number of Plaster Bags (25kg Per Bag)</td>
                        <td>5,052.74</td>
                        <td>5,052.74</td>
                        <td>5,052.74</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Primer Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Amount of Primer (liters)</td>
                        <td>8,421.23</td>
                        <td>8,421.23</td>
                        <td>8,421.23</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Paint Material Estimation</th></tr>
                      <tr>
                        <td>Estimated Amount of Paint (liters)</td>
                        <td>12,631.85</td>
                        <td>12,631.85</td>
                        <td>12,631.85</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Floor Material Estimation</th></tr>
                      <tr>
                        <td>Total Floor (Slab) Area (sq. meters)</td>
                        <td>206.40</td>
                        <td>206.40</td>
                        <td>206.40</td>
                      </tr>
                      <tr>
                        <td>Each Tile Area (sq. meters)</td>
                        <td>0.09</td>
                        <td>0.09</td>
                        <td>0.09</td>
                      </tr>
                      <tr>
                        <td>Tiles Needed (with Waste Factor)</td>
                        <td>2,523</td>
                        <td>2,523</td>
                        <td>2,523</td>
                      </tr>
                      <tr className="table-header-row"><th className="table-header">Summary</th></tr>
                      <tr>
                        <td>Walls</td>
                        <td>203</td>
                        <td>203</td>
                        <td>203</td>
                      </tr>
                      <tr>
                        <td>Total Wall Area (sq. meters)</td>
                        <td>21,053.08</td>
                        <td>21,053.08</td>
                        <td>21,053.08</td>
                      </tr>
                      <tr>
                        <td>Detected Doors</td>
                        <td>4</td>
                        <td>4</td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td>Detected Windows</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                      </tr>
                      <tr>
                        <td>Total Area (sq. meters)</td>
                        <td>27,013.12</td>
                        <td>27,013.12</td>
                        <td>27,013.12</td>
                      </tr>
                      <tr>
                        <td>Foundations</td>
                        <td>87</td>
                        <td>87</td>
                        <td>87</td>
                      </tr>
                      <tr>
                        <td>Total Foundation Area (sq. meters)</td>
                        <td>5,753.63</td>
                        <td>5,753.63</td>
                        <td>5,753.63</td>
                      </tr>
                      <tr>
                        <td>Slabs</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>Total Slab Area (sq. meters)</td>
                        <td>206.40</td>
                        <td>206.40</td>
                        <td>206.40</td>
                      </tr>
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
