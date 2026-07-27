import CircularScore from "./CircularScore";

const ratingColor = {
   Weak: "#FF2056", 
   Fair: "#FF8904",
    Strong: "#155DFC", 
    Excellent: "#00C950" }; 

const ScoreHeader = ({ result }) => {
  const color = ratingColor[result.overall_rating] || "#6b7280";

  return (
    <div className="flex items-center gap-4 rounded-xl p-4 border border-slate-200 bg-white shadow-2xl ">
      <CircularScore 
      score={result.overall_score} 
      rating={result.overall_rating} 
      />
      <div>
          {/* Rating label */}
        <div className="text-base font-extrabold mb-1"
        style={{ color }}
        >{result.overall_rating}</div>
          {/* Rating label */}
        <div className="text-xs text-gray-500 mb-2">ATS Match Score</div>
         {/* Match percentage badge */}
        <div className="inline-flex items-center gap-1 rounded-full px-3 py-1"
         style={{ background: `${color}20` }}
        >
          <span className="text-sm font-bold"
          style={{ color }}>
          {result.match_percentage}%</span>
          <span className="text-[10px] text-gray-500">keyword match</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreHeader;