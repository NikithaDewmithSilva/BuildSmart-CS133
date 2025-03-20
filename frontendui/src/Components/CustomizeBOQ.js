import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CustomizeBOQ = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { marketPrices, data } = location.state || {};

  const [cementBrand, setCementBrand] = useState("Cement - 50Kg bag");
  const [paintBrand, setPaintBrand] = useState("Emulsion Paint");
  const [tileType, setTileType] = useState("Floor Tile - Homogeneous Porcelain semi - Glazed");

  const [updatedBOQ, setUpdatedBOQ] = useState(data);

  // Update BOQ when user selects new materials
  useEffect(() => {
    if (!data) return;

    let newBOQ = { ...data };

    Object.keys(newBOQ).forEach((category) => {
      Object.entries(newBOQ[category] || {}).forEach(([key, value]) => {
        if (key.toLowerCase().includes("cement")) {
          newBOQ[category][key] = {
            quantity: value,
            unit: "bags",
            price: marketPrices[cementBrand]?.price || "N/A",
          };
        }
        if (key.toLowerCase().includes("paint")) {
          newBOQ[category][key] = {
            quantity: value,
            unit: "liters",
            price: marketPrices[paintBrand]?.price || "N/A",
          };
        }
        if (key.toLowerCase().includes("tiles")) {
          newBOQ[category][key] = {
            quantity: value,
            unit: "pcs",
            price: marketPrices[tileType]?.price || "N/A",
          };
        }
      });
    });

    setUpdatedBOQ(newBOQ);
  }, [cementBrand, paintBrand, tileType, marketPrices, data]);

  return (
    <div>
      <h2>Customize Your BOQ</h2>

      {/* Cement Brand Selection */}
      <label>Select Cement Brand for Your House:</label>
      <select value={cementBrand} onChange={(e) => setCementBrand(e.target.value)}>
        {Object.keys(marketPrices).filter(item => item.toLowerCase().includes("cement")).map((cement) => (
          <option key={cement} value={cement}>{cement}</option>
        ))}
      </select>

      {/* Paint Brand Selection */}
      <label>Select Paint Brand:</label>
      <select value={paintBrand} onChange={(e) => setPaintBrand(e.target.value)}>
        {Object.keys(marketPrices).filter(item => item.toLowerCase().includes("paint")).map((paint) => (
          <option key={paint} value={paint}>{paint}</option>
        ))}
      </select>

      {/* Tile Type Selection */}
      <label>Select Tile Type:</label>
      <select value={tileType} onChange={(e) => setTileType(e.target.value)}>
        {Object.keys(marketPrices).filter(item => item.toLowerCase().includes("tile")).map((tile) => (
          <option key={tile} value={tile}>{tile}</option>
        ))}
      </select>

      {/* Display Updated BOQ */}
      <h3>Updated Bill of Quantities (BOQ)</h3>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price per Unit</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {updatedBOQ && Object.keys(updatedBOQ).map(category => (
            <React.Fragment key={category}>
              <tr>
                <td colSpan="5"><strong>{category}</strong></td>
              </tr>
              {Object.entries(updatedBOQ[category] || {}).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value.quantity}</td>
                  <td>{value.unit}</td>
                  <td>{value.price !== "N/A" ? `$${value.price}` : "N/A"}</td>
                  <td>{value.price !== "N/A" ? `$${(value.quantity * value.price).toFixed(2)}` : "N/A"}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default CustomizeBOQ;
