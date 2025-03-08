import React, { useState } from "react";                        // Commented to get an actual idea of the codes/functions
import { useParams, useNavigate } from "react-router-dom";
import "./Input.css";
                                                  
const Input = () => {

    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");
    const [isFileUploaded, setIsFileUploaded] = useState(false); // The CAD Design upload status

    // Uploading the CAD Design
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith(".dxf")) {
            setFileName(file.name);
            setIsFileUploaded(true); // Enable the Submit button when the CAD Design was uploaded
        } else {
            alert("Only .dxf files are allowed!");
            event.target.value = ""; // Reset the file input
        }
    };

    // Give the access to drag the CAD Design
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Give the access to drop the CAD Design
    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.name.endsWith(".dxf")) {
            setFileName(file.name);
            setIsFileUploaded(true); // Enable the Submit button when the CAD Design was uploaded by drag and dropping
        } else {
            alert("Only .dxf files are allowed!");
        }
    };

    // Delete the CAD Design when the CLEAR button was clicked
    const handlePreviewClick = () => {
        setFileName("");
        setIsFileUploaded(false); // After deleting the CAD Design in the box, disable the SUBMIT button
    };

    return (
        <div className="input-page">
            <div className="header">
            <span className="input-logo">
                BUILD<span className="input-highlight">SMART</span>
            </span>
            <div className="navigation">
            <button className="profile-btn" onClick={() => navigate("/profile")}>PROFILE</button>
            </div>
            </div>
            <div className="content">
                <div className="text-section">
                    <h1>
                        <span className="highlight">READY</span> TO START WITH YOUR <br />
                        <span className="highlight">FIRST STEPS</span> IN THE
                        <br />COMPLETION OF YOUR <br />DREAM<span className="highlight"> HOUSE</span> 
                    </h1>
                    <br /><br /><br />
                    <img src="/input1.svg" alt="arrow" className="input-img" />
                    <p>
                        <span className="highlight">ENTER</span> YOUR <span className="highlight">CAD DESIGN</span> OR <span className="highlight">BLUEPRINT ABOVE</span>
                    </p>
                </div>
                <div className="upload-container">
                    <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop}>
                        <div className="upload-placeholder">
                            <img src="/input2.svg" alt="input_logo" className="upload-logo" /><br /><br />
                            <span>DRAG AND DROP YOUR DESIGN HERE OR CLICK TO UPLOAD</span>
                            <input type="file" accept=".dxf" onChange={handleFileUpload} className="file-input" />
                            {fileName && <p className="file-name">{fileName}</p>}
                        </div>
                    </div>
                    <div className="input-buttons">
                        <button 
                            className={`action-btn ${!isFileUploaded ? "disabled-btn" : ""}`} 
                            onClick={() => navigate("/process")}
                            disabled={!isFileUploaded} // Disable the button when the CAD Design was not there
                        >
                            SUBMIT
                        </button>
                        <button className="action-btn" onClick={handlePreviewClick}>
                            CLEAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Input;