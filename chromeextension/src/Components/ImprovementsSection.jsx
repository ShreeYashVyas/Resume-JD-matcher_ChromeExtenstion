import SectionTitle from "./SectionTitle";

/* SVG ICON  */
const ImproveIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width="14"
    height="14"
  >
    <path d="M13 3l4 4h-3v7h-2V7H9l4-4zM5 19h14v2H5v-2z" />
  </svg>
);

const ImprovementsSection = ({ improvements }) => {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div>
      <SectionTitle>
        <div className="flex items-center gap-2">
          <ImproveIcon className="text-green-600" />
          Improvements
        </div>
      </SectionTitle>

      {improvements.map((imp, i) => (
        <div
          key={i}
          className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2 transition-all hover:shadow-sm"
        >
          {/* Section Label */}
          <div className="text-[10px] font-bold text-green-800 uppercase tracking-wide mb-1">
            {imp.section}
          </div>

          {/* Current */}
          <div className="text-[11px] text-red-700 mb-1">
            <span className="font-semibold">Current: </span>
            {imp.current}
          </div>

          {/* Improved */}
          <div className="flex items-start gap-1 text-[11px] text-green-800">
            <ImproveIcon className="text-green-600 mt-[2px]" />
            <div>
              <span className="font-semibold">Improved: </span>
              {imp.improved}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImprovementsSection;