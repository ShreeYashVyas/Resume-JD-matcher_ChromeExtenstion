const Chip = ({ text, green }) => (
  <span className={`inline-block px-2 py-[2px] rounded-full text-[10px] font-semibold mr-1 mb-1
    ${green 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
    }`}
  >
    {text}
  </span>
);

export default Chip;