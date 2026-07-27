const ratingColor = { 
  Weak: "#FF2056",
   Fair: "#FF8904", 
   Strong: "#155DFC",
    Excellent: "#00C950"
   };

const CircularScore = ({ score, rating }) => {
  const size = 110;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = ratingColor[rating] || "#6b7280";

  return (
    <div className="relative"
    style={{width:size ,height:size}}  // dynamic size
    >
            <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
         {/* Background Circle */}
          <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
         {/* Progress Circle */}
             <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

      </svg>
      <div  className="absolute inset-0 flex flex-col items-center justify-center">
        <span
        className="text-xl font-extrabold leading-none"
        style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-400 mt-1">/ 100</span>
      </div>
    </div>
  );
};

export default CircularScore; 