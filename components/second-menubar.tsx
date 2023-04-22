import classNames from "classnames"

export default function SecondMenubar(props) {
  return (
    <div
      className={classNames(
        "fixed md:relative bg-white border-r inset-0 w-full lg:w-72 h-full shrink-0 z-10 p-6 flex flex-col gap-6 min-h-screen",
        props.className || ""
      )}
    >
      {props.children}
    </div>
  )
}
