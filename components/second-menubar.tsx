import classNames from "classnames"

export default function SecondMenubar(props) {
  return (
    <div
      className={classNames(
        " bg-white border-r inset-0 w-full lg:w-72 h-screen overflow-y-auto shrink-0 fixed flex flex-col gap-6 p-6 md:relative z-20",
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
