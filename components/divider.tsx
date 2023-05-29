export default function Divider({ label = "" }) {
  return (
    <div className={`flex items-center justify-center text-center text-xs text-gray-400 `}>
      <div className="flex-1 border-t border-gray-300"></div>
      {label && <div className="-mb-[0.1em] px-2 leading-none">{label}</div>}
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  )
}
