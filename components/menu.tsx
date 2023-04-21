import MenuItem from "./menu-item"

export default function Menu({ menus = [] }) {
  return (
    <div className="space-y-1">
      {menus.map((menu) => (
        <MenuItem menu={menu} key={menu.label + menu.url}></MenuItem>
      ))}
    </div>
  )
}