import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Output.css";
import InviteCustomerForm from "./InviteCustomerForm";

const Output = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [boqData, setBoqData] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false); // State for popup
  const [marketPrices, setMarketPrices] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // Fetch JSON data
  useEffect(() => {
    // Fetch the output.json data
    fetch("/output.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));

    // Fetch the market prices data
    fetch("/all_products_data.json")
      .then((response) => response.json())
      .then((pricesData) => setMarketPrices(pricesData))
      .catch((error) => console.error("Error loading market prices:", error));
  }, []);

  // If data is not loaded, show a loading message
  if (!data || !marketPrices) return <p>Loading...</p>;

  
  const getPriceForMaterial = (materialKey, materialValue) => {
    let price = "N/A";
    const key = materialKey.toLowerCase();
    
  
    if (key.includes("brick")) {
      const brickPrices = marketPrices.filter(item => 
        item.name.toLowerCase().includes("brick"));
      
      if (brickPrices.length > 0) {
        const cementBrick = brickPrices.find(item => 
          item.name.toLowerCase().includes("cement"));
        if (cementBrick) {
          return cementBrick.price.replace("රු", "");
        }
        return brickPrices[0].price.replace("රු", "");
      }
    } 
    else if (key.includes("cement") && !key.includes("bag")) {
      const cementPrices = marketPrices.filter(item => 
        item.name.toLowerCase().includes("cement") && 
        item.name.toLowerCase().includes("50kg"));
      
      if (cementPrices.length > 0) {
        const inseeCement = cementPrices.find(item => 
          item.name.toLowerCase().includes("insee"));
        if (inseeCement) {
          return inseeCement.price.replace("රු", "");
        }
        return cementPrices[0].price.replace("රු", "");
      }
    }
    else if (key.includes("sand")) {
      const sandPrices = marketPrices.filter(item => 
        item.name.toLowerCase().includes("sand"));
      
      if (sandPrices.length > 0) {
        return sandPrices[0].price.replace("රු", "");
      }
    }
    else if (key.includes("gravel") || key.includes("metal")) {
      const gravelPrices = marketPrices.filter(item => 
        item.name.toLowerCase().includes("metal") || 
        item.name.toLowerCase().includes("gal kudu"));
      
      if (gravelPrices.length > 0) {
        const cheapestMetal = gravelPrices.reduce((prev, curr) => {
          const prevPrice = parseFloat(prev.price.replace("රු", "").replace(",", ""));
          const currPrice = parseFloat(curr.price.replace("රු", "").replace(",", ""));
          return prevPrice < currPrice ? prev : curr;
        });
        return cheapestMetal.price.replace("රු", "");
      }
    }
    else if (key.includes("plaster")) {
      const plasterPrices = marketPrices.filter(item => 
        item.name.toLowerCase().includes("plaster"));
      
      if (plasterPrices.length > 0) {
        return plasterPrices[0].price.replace("රු", "");
      }
    }
    
    return price;
  };


  const calculateCost = (quantity, priceStr) => {
    if (!priceStr) return "";
    const price = parseFloat(priceStr.replace(",", ""));
    return (quantity * price).toLocaleString();
  };

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
                  <h4>Note: This BOQ is made using prices for budget-frinedly brands<br></br>Feel free to customize</h4>
                  
                  <table>
                    <thead>
                      <tr>
                        <th>Materials</th>
                        <th>Quantities</th>
                        <th>Price per unit</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>

                      {Object.keys(data).map((category) => (
                        <React.Fragment key={category}>

                          <tr className="table-header-row">
                            <th className="table-header" colSpan="4">{category}</th>
                          </tr>

                          {Object.entries(data[category]).map(([key, value]) => {
                            const pricePerUnit = getPriceForMaterial(key, value);
                            const totalCost = calculateCost(value, pricePerUnit);
                            
                            return (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value.toLocaleString()}</td>
                                <td>
                                {pricePerUnit}
                                </td>
                                <td>{totalCost}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
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
