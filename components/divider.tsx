export default function Divider({ label = "" }) {
  return (
    <div className={`flex items-center justify-center text-center text-xs text-muted-foreground `}>
      <div className="flex-1 border"></div>
      {label && <div className="-mb-[0.1em] px-2 leading-none">{label}</div>}
      <div className="flex-1 border"></div>
    </div>
  )
}
