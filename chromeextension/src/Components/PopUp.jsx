import React, { useState, useRef, useEffect } from "react";

const UploadIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#1F3C88]"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PopUp = () => {
  const [saving, setSaving] = useState(false);
  const [savedName, setSavedName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileRef = useRef(null);

  // Load existing resume from storage
  useEffect(() => {
    chrome.storage.local.get("resume", (data) => {
      if (data.resume) {
        setSavedName(data.resume.name);
      }
    });
  }, []);

  // Handle file selection
  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    setSelectedFile(file);
    setBase64Data(null);
    const reader = new FileReader();
    reader.onload = () => setBase64Data(reader.result);
    reader.readAsDataURL(file);
  };

  /* Drag Events */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files.length > 1) {
      alert("Only one resume allowed.");
      return;
    }
    handleFile(e.dataTransfer.files[0]);
  };

  // Save Resume
const handleSave = async() => {
  if (!selectedFile || !base64Data) return;
try{
  setSaving(true) // show loading
  // Send base64 to backend
  const response = await fetch("http://localhost:9000/extractText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        base64: base64Data // sending PDF
      })
    });

    // Check if response is ok
    if(!response.ok){
      const err = await response.json();
      throw new Error(err.err || "Server error");
    }

// actually use that text
const {text} = await response.json();

// Save to chorme stotage
chrome.storage.local.set(
  {resume:{name:selectedFile.name , resumeText:text}},
  ()=>{
    setSavedName(selectedFile.name);
    setSelectedFile(null);
    setBase64Data(null);
    fileRef.current.value = "";
    setSaving(false);
    console.log("Resume saved successfully");
  }
);
}catch(err){
console.log("Save failed:",err.message);
alert("Failed to save resume. Is the server running?");
setSaving(false);
}
};

  // Remove Resume
  const handleRemove = () => {
    chrome.storage.local.remove("resume", () => {
      setSavedName("");
      setSelectedFile(null);
      setBase64Data(null);
      fileRef.current.value = "";
      console.log("Resume removed successfully");
    });
  };

  return (
    <div className="h-full bg-slate-300 flex items-center justify-center p-2">
      <div className="bg-white w-[320px] rounded-2xl shadow-lg border border-slate-200 p-5 flex flex-col gap-4">
        {/* Title */}
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Resume Upload
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload your resume in PDF format
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && !savedName && fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center px-4 py-6 transition
            ${!selectedFile && !savedName ? "cursor-pointer" : "cursor-default"}
            ${isDragActive ? "border-[#1F3C88] bg-blue-50" : "border-slate-500 hover:border-[#1F3C88] hover:bg-blue-100"}`}
        >
          {/* Empty state */}
          {!selectedFile && !savedName && (
            <>
              <UploadIcon />
              <p className="text-sm text-slate-600 mt-3 font-medium">
                Drag & Drop PDF
              </p>
              <span className="text-xs text-slate-400 mt-1">
                or click to browse
              </span>
            </>
          )}

          {/* File selected */}
          {selectedFile && (
            <div className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <FileIcon />
              <p className="text-sm font-medium text-slate-700 truncate flex-1 text-left">
                {selectedFile.name}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setBase64Data(null);
                  fileRef.current.value = ""; //Reset input so same file can be re-selected
                }}
                className="text-slate-400 hover:text-red-500 transition shrink-0"
              >
                <XIcon />
              </button>
            </div>
          )}

          {/* Saved state  */}
          {savedName && !selectedFile && (
            <div className="w-full flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <FileIcon />
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {savedName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckIcon />
                  <span className="text-xs text-green-500 font-medium">
                    Saved
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-slate-400 hover:text-red-500 transition shrink-0"
              >
                <XIcon />
              </button>
            </div>
          )}
        </div>

        {/*  Save button  */}
        {selectedFile && (
          <button
            onClick={handleSave}
            disabled={saving || !base64Data}
            className="w-full bg-[#1F3C88] text-white py-2.5 rounded-lg text-sm font-semibold
              hover:bg-[#162B63] transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>
        )}

        {/* Replace button */}
        {savedName && !selectedFile && (
          <button
            onClick={() => fileRef.current.click()}
            className="w-full border border-[#1F3C88] bg-blue-50 text-[#1F3C88] py-2.5 rounded-lg text-sm font-semibold
              hover:bg-blue-600  hover:text-white transition"
          >
            Replace Resume
          </button>
        )}
        {/* JD Instruction Sentence */}
        {savedName && !selectedFile && (
          <p className="text-xs text-slate-700 leading-relaxed">
           * Now select the Job Description to continue...
          </p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default PopUp;
