import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Input.css";

const Input = () => {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [file, setFile] = useState(null); // Store the selected file
    // Uploading the CAD Design
    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".dxf")) {
            setFileName(selectedFile.name);
            setIsFileUploaded(true);
            setFile(selectedFile); // Store file for submission
        } else {
            alert("Only .dxf files are allowed!");
            event.target.value = "";
        }
    };

    // Handle file submission to backend
    const handleSubmit = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("cad_file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload_cad", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Server Response:", data);

            // Navigate after successful upload
            navigate("./process");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload the file.");
        }
    };

    // Drag-and-drop functionality
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith(".dxf")) {
            setFileName(droppedFile.name);
            setIsFileUploaded(true);
            setFile(droppedFile); // Store file for submission
        } else {
            alert("Only .dxf files are allowed!");
        }
    };

    // Clear file selection
    const handlePreviewClick = () => {
        setFileName("");
        setIsFileUploaded(false);
        setFile(null); // Clear file state
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
                        <span className="highlight">Ready</span> to start with your <br />
                        <span className="highlight">first steps</span> in the
                        <br />completion of your <br />dream<span className="highlight"> house</span> 
                    </h1>
                    <br /><br /><br />
                    <div className="enter-text-section">
                        <p className="enter-text">
                            <span className="highlight">Enter</span> your <span className="highlight">CAD DESIGN</span> in the <span className="highlight">above box</span>
                        </p>
                        <img src="/input1.svg" alt="arrow" className="input-img" />
                    </div>
                </div>
                <div className="upload-container">
                    <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop}>
                        <div className="upload-placeholder">
                            <img src="/input2.svg" alt="input_logo" className="upload-logo" /><br /><br />
                            <span>DRAG AND DROP YOUR DESIGN HERE OR CLICK TO UPLOAD <br /> (dxf files)</span>
                            <input type="file" accept=".dxf" onChange={handleFileUpload} className="file-input" />
                            {fileName && <p className="file-name">{fileName}</p>}
                        </div>
                    </div>
                    <div className="input-buttons">
                        <button 
                            className={`action-btn ${!isFileUploaded ? "disabled-btn" : ""}`} 
                            onClick={handleSubmit}
                            disabled={!isFileUploaded}
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
