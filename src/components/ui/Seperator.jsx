export default function Seperator({ text }) {
  return (
    <div className="flex items-center text-center my-2 w-full">
      <div className="flex-1 border-b border-gray-300 dark:border-lightBg mx-[10px]"></div>
      <span className="px-[10px] text-sm text-gray-600">{text}</span>
      <div className="flex-1 border-b border-gray-300 dark:border-lightBg mx-[10px]"></div>
    </div>
  );
}
