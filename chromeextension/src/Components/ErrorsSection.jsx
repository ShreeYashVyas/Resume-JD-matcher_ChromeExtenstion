import SectionTitle from "./SectionTitle";

const severityColor = {
  Critical: "red",
  Warning: "amber",
  Info: "blue",
};

const ErrorsSection = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  const criticalErrors = errors.filter((e) => e.severity === "Critical");
  const otherErrors = errors.filter((e) => e.severity !== "Critical");

  return (
    <>
      {/* Critical Errors */}
      {criticalErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <SectionTitle>
            🚨 Critical Errors ({criticalErrors.length})
          </SectionTitle>

          {criticalErrors.map((e, i) => (
            <div
              key={i}
              className={`mb-2 pb-2 ${
                i < criticalErrors.length - 1
                  ? "border-b border-red-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold text-red-500 bg-red-100 px-2 py-[1px] rounded-full">
                  {e.type}
                </span>
                <span className="text-[9px] text-gray-400">
                  in {e.location}
                </span>
              </div>

              <p className="text-[11px] text-red-800 font-semibold mb-1">
                ❌ {e.error}
              </p>

              <p className="text-[11px] text-gray-700">
                ✅ Fix: {e.fix}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* Warnings & Issues */}
      {otherErrors.length > 0 && (
        <div>
          <SectionTitle>
            ⚠️ Warnings & Issues ({otherErrors.length})
          </SectionTitle>

          {otherErrors.map((e, i) => {
            const color = severityColor[e.severity] || "gray";

            return (
              <div
                key={i}
                className={`border-l-4 border-${color}-500 bg-gray-50 rounded-r-lg p-2.5 mb-2`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className={`text-[9px] font-bold text-${color}-600 bg-${color}-100 px-2 py-[1px] rounded-full`}
                  >
                    {e.severity}
                  </span>

                  <span className="text-gray-300 text-[10px]">·</span>

                  <span className="text-[9px] text-gray-500 bg-gray-200 px-2 py-[1px] rounded-full">
                    {e.type}
                  </span>

                  <span className="text-[9px] text-gray-400">
                    in {e.location}
                  </span>
                </div>

                <p className="text-[11px] text-gray-700 mb-1">
                  ⚠️ {e.error}
                </p>

                <p className="text-[11px] text-gray-500">
                  💡 Fix: {e.fix}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ErrorsSection;