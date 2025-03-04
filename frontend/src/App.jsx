import { useState } from "react";

function App() {
    const [files, setFiles] = useState({ transcript_file: null, script_file: null, icp_file: null });
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setFiles(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        if (files.transcript_file) formData.append("transcript_file", files.transcript_file);
        if (files.script_file) formData.append("script_file", files.script_file);
        if (files.icp_file) formData.append("icp_file", files.icp_file);

        const response = await fetch("http://127.0.0.1:8000/generate-test-cases/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            console.error("Error fetching test cases");
            return;
        }

        // Handle the response as a file
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
    };

    return (
        <div>
            <h1>Upload Files to Generate Test Cases</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload Transcript File:
                    <input type="file" name="transcript_file" onChange={handleFileChange} />
                </label>
                <br />
                <label>
                    Upload Call Script File:
                    <input type="file" name="script_file" onChange={handleFileChange} />
                </label>
                <br />
                <label>
                    Upload Customer Profiling (ICP) File:
                    <input type="file" name="icp_file" onChange={handleFileChange} />
                </label>
                <br />
                <button type="submit">Generate Test Cases</button>
            </form>
            {downloadUrl && <a href={downloadUrl} download="test_cases.docx">Download Test Cases</a>}
        </div>
    );
}

export default App;

