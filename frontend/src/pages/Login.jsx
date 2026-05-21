import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/autenticacion/login",
        {
          correo,
          password,
        }
      );

      console.log(response.data);

      // Guardar token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Guardar usuario
      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.usuario)
      );

      const rol = response.data.usuario?.rol?.toLowerCase();
      if (rol === "vendedor") {
        navigate("/calendario");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {

      console.log(error);

      alert("Error al iniciar sesión");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={iniciarSesion}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-3 mb-4 rounded-lg"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 mb-4 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Entrar
        </button>

      </form>

    </div>
  );

}