import { Link, useNavigate } from "react-router-dom";

export default function LayoutPrincipal({ children }) {

  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );console.log(usuario);

  const cerrarSesion = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    navigate("/");

  };

  // NORMALIZAR ROL

  const rol =
    usuario?.rol?.toLowerCase();

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside className="w-64 bg-[#08122E] text-white p-5 shadow-2xl">

        <h1 className="text-4xl font-black mb-12 leading-tight">
          Sistema
          <br />
          Entregas
        </h1>

        <ul className="space-y-5 text-lg">

          {
            rol === "gerencia" && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-blue-300 transition"
                  >
                    📊 Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    to="/entregas"
                    className="hover:text-blue-300 transition"
                  >
                    📦 Entregas
                  </Link>
                </li>
              </>
            )
          }

          <li>
            <Link
              to="/calendario"
              className="hover:text-blue-300 transition"
            >
              📅 Calendario
            </Link>
          </li>

        </ul>

      </aside>

      {/* CONTENIDO */}

      <div className="flex-1">

        {/* NAVBAR */}

        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Bienvenido
            </p>

            <h2 className="text-3xl font-bold text-gray-800">

              {usuario?.nombre}

              <span
                className={`ml-2 text-lg ${
                  rol === "gerencia"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                (
                  {rol === "gerencia"
                    ? "Gerente"
                    : "Vendedor"}
                )
              </span>

            </h2>

          </div>

          <button
            onClick={cerrarSesion}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-lg transition"
          >
            Cerrar sesión
          </button>

        </header>

        {/* PAGE */}

        <main className="p-6">

          {children}

        </main>

      </div>

    </div>

  );

}