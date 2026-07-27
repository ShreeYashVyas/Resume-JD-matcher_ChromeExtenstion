import { useState } from "react";
import PopUp from "./Components/PopUp";
import ResultsTab from "./Components/ResultsTab";

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const App = () => {
  const [tab, setTab] = useState("resume");

  return (
    <div className="w-[340px]  h-[400px] bg-[#F1F5F9] font-sans flex flex-col ">
      
      {/* Blue Header */}
      <div className="bg-[#1C398E] px-4 pt-4 pb-4 rounded-b-3xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src="/icons/icon96.png"
            alt="icons"
            className="w-14 h-14 rounded-lg shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">Resume JD Matcher</h2>
            <p className="text-xs text-blue-200">Match resume with job descriptions</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 p-1 border border-blue-400 bg-white rounded-xl shadow-sm flex">
          <button
            onClick={() => setTab("resume")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all
              ${tab === "resume" ? "bg-[#1F3C88] text-white shadow" : "text-slate-500 hover:bg-gray-100"}`}
          >
            <FileIcon /> Resume
          </button>
          <button
            onClick={() => setTab("result")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all
              ${tab === "result" ? "bg-[#1F3C88] text-white shadow" : "text-slate-500 hover:bg-gray-100"}`}
          >
            <ChartIcon /> Result
          </button>
        </div>
      </div>

      {/* Tab Content - OUTSIDE the blue header */}
      <div className="p-3">
        {tab === "resume" ? <PopUp /> : <ResultsTab />}
      </div>

    </div>
  );
};

export default App;