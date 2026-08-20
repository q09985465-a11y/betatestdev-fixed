import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-main">

        <Header />



        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}