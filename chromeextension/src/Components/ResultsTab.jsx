import React, { useEffect, useState } from "react";

import Chip from "./Chip";
import ErrorsSection from "./ErrorsSection";
import ImprovementsSection from "./ImprovementsSection";
import MiniBar from "./MiniBar";
import SectionTitle from "./SectionTitle";
import ScoreHeader from "./ScoreHeader";
import SuggestionsSection from "./SuggestionsSection";

const ChartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <line x1="4" y1="20" x2="4" y2="10" />
    <line x1="10" y1="20" x2="10" y2="4" />
    <line x1="16" y1="20" x2="16" y2="14" />
    <line x1="22" y1="20" x2="22" y2="8" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-600"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l2.5 2.5L16 9" />
  </svg>
);

const XCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-600"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);

const SummaryIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
  </svg>
);

const ResultsTab = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    chrome.storage.local.get("lastAnalysis", (data) => {
      if (data.lastAnalysis) setResult(data.lastAnalysis);
    });

    const listener = (changes) => {
      if (changes.lastAnalysis) {
        setResult(changes.lastAnalysis.newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  if (!result) {
    return (
    <div className="h-[400px] overflow-y-scroll flex flex-col gap-3 px-2 py-2 scrollbar-hide">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <p className="text-xs">Select job text → click Check Score</p>
      </div>
    );
  }


  const allMissing = [
    ...(result.missing_keywords?.technical_skills || []),
    ...(result.missing_keywords?.tools || []),
    ...(result.missing_keywords?.soft_skills || []),
    ...(result.missing_keywords?.certifications || []),
    ...(result.missing_keywords?.other || []),
  ];
  
  return (
   <div className="h-[400px] overflow-y-auto hide-scrollbar flex flex-col gap-3 px-2 py-2">
      {/*Score */}
      <ScoreHeader result={result} />

      {/*  Summary */}
      <div className="bg-gray-50 rounded-md p-2">
        <SectionTitle>
          <div className="flex items-center gap-2">
            <SummaryIcon />
            <span>Summary</span>
          </div>
        </SectionTitle>
        <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
          {result.summary}
        </p>
     </div>

      {/*Errors and Warnings */}
      <ErrorsSection errors={result.errors} />

      {/*  Score Breakdown */}
      <div>
        <SectionTitle>
          <ChartIcon />
          <span>Score Breakdown</span>{" "}
        </SectionTitle>
        {Object.entries(result.score_breakdown || {}).map(([key, val]) => (
          <MiniBar key={key} label={key} score={val.score} rating={val.label} />
        ))}
      </div>

      {/* Matched Keywords */}
<div>
  <SectionTitle>
    <div className="flex items-center gap-2">
      <CheckCircleIcon />
      <span>Matched Keywords</span>
    </div>
  </SectionTitle>

<div>
  {(result.matched_keywords || []).length > 0 ? (
    result.matched_keywords.map((k, i) => (
      <Chip key={i} text={k} green />
    ))
  ) : (
    <span className="text-[10px] text-gray-400">None matched</span>
  )}
</div>
</div>

      {/* Missing Keywords */}
{allMissing.length > 0 && (
  <div>
    <SectionTitle>
      <div className="flex items-center gap-2">
        <XCircleIcon />
        <span>Missing Keywords</span>
      </div>
    </SectionTitle>

<div>
  {allMissing.map((k, i) => (
    <Chip key={i} text={k} green={false} />
  ))}
</div>
  </div>
)}

      {/*  Improvements */}
      <ImprovementsSection improvements={result.improvements} />

      {/*  Suggestions */}
      <SuggestionsSection suggestions={result.suggestions} />

      {/* Clear */}
      <button
        onClick={() => {
          chrome.storage.local.remove("lastAnalysis");
          setResult(null);
        }}
        className="w-full py-1.5 rounded-md border border-blue-900 bg-blue-600 text-[10px] text-white hover:border-gray-500 hover:bg-blue-900"
      >
        Clear Results
      </button>
    </div>
  );
};

export default ResultsTab;
