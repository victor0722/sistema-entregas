import React from "react";
import ReactDOM from "react-dom/client";
import RutaPrivada from "./routes/RutaPrivada";
import Calendario from "./pages/Calendario";
import Entregas from "./pages/Entregas";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <RutaPrivada rolesPermitidos={["gerencia"]}>
              <Dashboard />
            </RutaPrivada>
          }
        />

        <Route
          path="/calendario"
          element={
            <RutaPrivada>
              <Calendario />
            </RutaPrivada>
          }
        />

        <Route
          path="/entregas"
          element={
            <RutaPrivada rolesPermitidos={["gerencia"]}>
              <Entregas />
            </RutaPrivada>
          }
        />
      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);