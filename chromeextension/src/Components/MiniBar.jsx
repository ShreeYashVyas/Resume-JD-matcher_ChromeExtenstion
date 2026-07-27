const ratingStyles = {
  Weak: {
    text: "text-red-500",
    bg: "bg-red-500",
  },
  Fair: {
    text: "text-amber-500",
    bg: "bg-amber-500",
  },
  Strong: {
    text: "text-blue-500",
    bg: "bg-blue-500",
  },
  Excellent: {
    text: "text-emerald-500",
    bg: "bg-emerald-500",
  },
  default: {
    text: "text-gray-500",
    bg: "bg-gray-500",
  },
};

const MiniBar = ({ label, score, rating }) => {
  const styles = ratingStyles[rating] || ratingStyles.default;

  return (
    <div className="mb-2">
      {/* Label + Score */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-gray-500 capitalize">
          {label.replace(/_/g, " ")}
        </span>

        <span className={`text-[11px] font-bold ${styles.text}`}>
          {score}
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${styles.bg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default MiniBar;