export default function SecondMenubar(props) {
  return (
    <div
      className={
        `fixed md:relative bg-white border-r inset-0 w-full shrink-0 z-10 p-6 flex flex-col gap-6 h-screen ` +
          props.className || ""
      }
    >
      {props.children}
    </div>
  )
}
