"use client"

const MENU_ITEMS = ["File", "Edit", "View", "Query", "Project", "Tools", "Window", "Help"]

export function MenuBar() {
  return (
    <div className="flex h-[30px] select-none items-center bg-[#2d2d30] pl-2 pr-1">
      {MENU_ITEMS.map((item, index) => (
        <button
          key={item}
          onMouseDown={(e) => e.preventDefault()}
          className={`cursor-pointer py-0.5 text-[12px] text-[#dfdfdf] hover:bg-[#35353b] ${
            index === 0 ? "pl-0 pr-3" : "px-3"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
