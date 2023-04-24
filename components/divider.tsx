export default function Divider({ label = "" }) {
  return (
    <div
      className={
        `text-xs text-gray-400 text-center border-t flex items-center justify-center ` +
        (label.length ? "mt-[0.5em]" : "")
      }
    >
      {label && (
        <div className="-mt-[0.5em] leading-none px-2 bg-white">{label}</div>
      )}
    </div>
  )
}
