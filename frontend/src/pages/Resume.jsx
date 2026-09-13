import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../styles/resume.css";

export default function Resume() {

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);

    function handleBrowse() {

        fileInputRef.current.click();

    }

    function handleFileChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {

            alert("Only PDF files are allowed.");

            return;

        }

        setSelectedFile(file);

    }

    async function handleUpload() {

        if (!selectedFile) {
    
            alert("Please choose a resume.");
    
            return;
    
        }
    
        try {
    
            setLoading(true);
    
            const formData = new FormData();
    
            formData.append("resume", selectedFile);
    
            const response = await api.post(
    
                "/resume/upload",
    
                formData,
    
                {
    
                    headers: {
    
                        "Content-Type": "multipart/form-data"
    
                    }
    
                }
    
            );
    
            alert("Resume Uploaded Successfully!");
    
            navigate("/interview", {
    
                state: {
    
                    resumeId: response.data.resume.id
    
                }
    
            });
    
        }
    
        catch (error) {
    
            console.log(error);
    
            alert("Upload Failed");
    
        }
    
        finally {
    
            setLoading(false);
    
        }
    
    }
    
    return (

        <div className="resume-page">

            <div className="upload-card">

                <h1>

                    Upload Resume

                </h1>

                <p>

                    Upload your latest resume in PDF format.

                </p>

                <div
                    className="upload-box"
                    onClick={handleBrowse}
                >

                    <h2>

                        📄

                    </h2>

                    <h3>

                        Drag & Drop Resume Here

                    </h3>

                    <p>

                        or click to browse

                    </p>

                </div>

                <input

                    ref={fileInputRef}

                    type="file"

                    accept=".pdf"

                    hidden

                    onChange={handleFileChange}

                />

                {

                    selectedFile &&

                    <div className="selected-file">

                        <h3>

                            Selected File

                        </h3>

                        <p>

                            {selectedFile.name}

                        </p>

                    </div>

                }

                <button

                    onClick={handleUpload}

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        "Uploading..."

                        :

                        "Upload Resume"

                    }

                </button>

            </div>

        </div>

    );

}