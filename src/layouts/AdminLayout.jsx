import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
        {/* Logo / Title */}
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-2xl font-extrabold tracking-wide">
            DevTV Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Yönetim Paneli
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="facilitators" label="Facilitators" />
          <NavItem to="sponsors" label="Sponsors" />
          <NavItem to="workshops" label="Workshops" />
          <NavItem to="health" label="Health & System" />
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-400">
          © DevTV Admin Panel
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Admin
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---- Sidebar Item Component ---- */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
        `
      }
    >
      {label}
    </NavLink>
  );
}