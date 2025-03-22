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
    const input = document.querySelector('.material-estimates');
    const pdfName = `BOQ_Project_${id}_${new Date().toISOString().slice(0, 10)}.pdf`;
    
    // Define PDF options
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title and project info to PDF
    pdf.setFontSize(18);
    pdf.text('Bill of Quantities (BOQ)', 15, 15);
    pdf.setFontSize(12);
    pdf.text(`Project ID: ${id}`, 15, 25);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, 32);
    
    // Create an image of the table and add it to the PDF
    html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    }).then(canvas => {
      // Add some space for the header
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit on page while maintaining aspect ratio
      const imgWidth = 270; // A4 landscape width (297mm) minus margins
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Add the image to the PDF, starting at y=40 to leave room for the header
      pdf.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);
      
      // Add footer with total cost
      const totalCost = calculateTotalCost();
      pdf.setFontSize(14);
      pdf.text(`Total Estimated Cost: $${totalCost}`, 15, pdf.internal.pageSize.height - 10);
      
      // Save the PDF
      pdf.save(pdfName);
    });
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
              ${calculateTotalCost()}
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