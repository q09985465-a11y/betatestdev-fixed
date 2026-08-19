import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "../routes/AppRoutes";
import "../styles/admin.css";

import { AuthProvider } from "../context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(

<AuthProvider>

<AppRoutes />

</AuthProvider>

);