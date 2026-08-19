import { NavLink } from "react-router-dom";

const menu = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "🏠",
  },
  {
    label: "Productos",
    path: "/admin/products",
    icon: "📦",
  },
  {
    label: "Categorías",
    path: "/admin/categories",
    icon: "🗂️",
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        🐰 BunnyJoy Admin
      </div>

      <nav className="sidebar-menu">

        {menu.map((item) => (
		  <NavLink
			key={item.path}
			to={item.path}
			end={item.path === "/admin"}
			className={({ isActive }) =>
			  isActive ? "sidebar-link active" : "sidebar-link"
			}
		  >
			<span>{item.icon}</span>
			<span>{item.label}</span>
		  </NavLink>
		))}

      </nav>

    </aside>
  );
}