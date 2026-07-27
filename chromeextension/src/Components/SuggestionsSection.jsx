import SectionTitle from "./SectionTitle";

/* PRIORITY STYLES */
const priorityStyles = {
  High: {
    border: "border-red-500",
    text: "text-red-600",
    bg: "bg-red-100",
  },
  Medium: {
    border: "border-amber-500",
    text: "text-amber-600",
    bg: "bg-amber-100",
  },
  Low: {
    border: "border-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  default: {
    border: "border-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

/*  SVG ICON */
const SuggestionIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width="14"
    height="14"
  >
    <path d="M12 2a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2zm-2 18h4v2h-4v-2z" />
  </svg>
);

const SuggestionsSection = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div>
      <SectionTitle>
        <div className="flex items-center gap-2">
          <SuggestionIcon className="text-amber-500" />
          Suggestions
        </div>
      </SectionTitle>

      {suggestions.map((s, i) => {
        const styles =
          priorityStyles[s.priority] || priorityStyles.default;

        return (
          <div
            key={i}
            className={`border-l-4 ${styles.border} bg-gray-50 rounded-r-lg p-2.5 mb-2 transition-all hover:shadow-sm`}
          >
            {/* Priority + Category */}
            <div className="flex items-center gap-1 mb-1">
              <span
                className={`text-[9px] font-bold ${styles.text} ${styles.bg} px-2 py-[1px] rounded-full`}
              >
                {s.priority}
              </span>

              <span className="text-gray-300 text-[10px]">·</span>

              <span className="text-[9px] font-semibold text-gray-500 bg-gray-200 px-2 py-[1px] rounded-full">
                {s.category}
              </span>
            </div>

            {/* Suggestion Text */}
            <p className="text-[11px] text-gray-700 leading-relaxed">
              {s.suggestion}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestionsSection;