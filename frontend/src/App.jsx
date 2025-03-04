import { useState } from "react";

function App() {
    const [files, setFiles] = useState({ transcript: null, script: null, icp: null });
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setFiles(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        if (files.transcript) formData.append("transcript", files.transcript);
        if (files.script) formData.append("script", files.script);
        if (files.icp) formData.append("icp", files.icp);

        const response = await fetch("http://localhost:8000/generate-test-cases/", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.file_data) {
            const blob = new Blob([new Uint8Array(result.file_data)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        }
    };

    return (
        <div>
            <h1>Upload Files to Generate Test Cases</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload Transcript File:
                    <input type="file" name="transcript" onChange={handleFileChange} />
                </label>
                <br />
                <label>
                    Upload Call Script File:
                    <input type="file" name="script" onChange={handleFileChange} />
                </label>
                <br />
                <label>
                    Upload Customer Profiling (ICP) File:
                    <input type="file" name="icp" onChange={handleFileChange} />
                </label>
                <br />
                <button type="submit">Generate Test Cases</button>
            </form>
            {downloadUrl && <a href={downloadUrl} download="test_cases.docx">Download Test Cases</a>}
        </div>
    );
}

export default App;
 