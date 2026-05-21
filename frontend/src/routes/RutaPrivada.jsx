import { Navigate } from "react-router-dom";

export default function RutaPrivada({ children, rolesPermitidos = [] }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rolesPermitidos.length > 0) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = usuario?.rol?.toLowerCase();

    if (!rolesPermitidos.includes(rol)) {
      return <Navigate to="/calendario" replace />;
    }
  }

  return children;

}