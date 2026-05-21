import { useEffect, useState } from "react";

import LayoutPrincipal from "../layouts/LayoutPrincipal";

import api from "../services/api";

export default function Entregas() {

  const [entregas, setEntregas] =
    useState([]);

  const [mensajeExito, setMensajeExito] =
    useState("");

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [entregaSeleccionada, setEntregaSeleccionada] =
    useState(null);

  const [nuevaFecha, setNuevaFecha] =
    useState("");

  const [nuevaHora, setNuevaHora] =
    useState("");

  const [motivo, setMotivo] =
    useState("");

  // OBTENER ENTREGAS

  const obtenerEntregas = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/entregas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEntregas(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // CAMBIAR ESTATUS

  const cambiarEstatus = async (
    id,
    estatus
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await api.put(
        `/entregas/${id}`,
        { estatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      obtenerEntregas();

      setMensajeExito(
        `Entrega ${estatus} correctamente 🚀`
      );

      setTimeout(() => {

        setMensajeExito("");

      }, 3000);

    } catch (error) {

      console.log(error);

    }

  };

  // ABRIR MODAL REPROGRAMACIÓN

  const abrirModalReprogramacion = (
    entrega
  ) => {

    setEntregaSeleccionada(entrega);

    setMostrarModal(true);

  };

  // GUARDAR REPROGRAMACIÓN

  const guardarReprogramacion =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        await api.put(
          `/entregas/reprogramar/${entregaSeleccionada.id}`,
          {
            nueva_fecha: nuevaFecha,
            nueva_hora: nuevaHora,
            motivo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMostrarModal(false);

        setNuevaFecha("");
        setNuevaHora("");
        setMotivo("");

        obtenerEntregas();

        setMensajeExito(
          "Entrega reprogramada 🚀"
        );

        setTimeout(() => {

          setMensajeExito("");

        }, 3000);

      } catch (error) {

        console.log(error);

      }

    };

  // COLOR ESTADO

  const colorEstado = (estado) => {

    switch (estado) {

      case "aprobada":
        return "bg-green-100 text-green-700";

      case "reprogramada":
        return "bg-yellow-100 text-yellow-700";

      case "entregada":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-orange-100 text-orange-700";

    }

  };

  // FORMATEAR FECHA

  const formatearFecha = (fecha) => {

    const [anio, mes, dia] =
      fecha.slice(0, 10).split("-");

    return `${dia}/${mes}/${anio}`;

  };

  // CARGAR DATOS

  useEffect(() => {

    obtenerEntregas();

  }, []);

  return (

    <LayoutPrincipal>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold text-gray-800">

          Gestión de Entregas 🚗

        </h1>

      </div>

      {/* ALERTA */}

      {
        mensajeExito && (

          <div className="mb-5 bg-green-500 text-white px-5 py-4 rounded-2xl shadow-lg">

            {mensajeExito}

          </div>

        )
      }

      {/* TABLA */}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-900 text-white">

            <tr>

              <th className="p-5 text-left">
                Cliente
              </th>

              <th className="p-5 text-left">
                Unidad
              </th>

              <th className="p-5 text-left">
                Fecha
              </th>

              <th className="p-5 text-left">
                Hora
              </th>

              <th className="p-5 text-left">
                Estado
              </th>

              <th className="p-5 text-center">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {
              entregas.map((entrega) => (

                <tr
                  key={entrega.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-5 font-semibold">

                    {entrega.cliente}

                  </td>

                  <td className="p-5">

                    {entrega.unidad}

                  </td>

                  <td className="p-5">

                    {formatearFecha(
                      entrega.fecha
                    )}

                  </td>

                  <td className="p-5">

                    {entrega.hora}

                  </td>

                  <td className="p-5">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${colorEstado(
                        entrega.estatus
                      )}`}
                    >
                      {entrega.estatus}
                    </span>

                  </td>

                  <td className="p-5">

                    <div className="flex gap-2 justify-center">

                      {/* APROBAR */}

                      <button
                        onClick={() =>
                          cambiarEstatus(
                            entrega.id,
                            "aprobada"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow"
                      >
                        Aprobar
                      </button>

                      {/* REPROGRAMAR */}

                      <button
                        onClick={() =>
                          abrirModalReprogramacion(
                            entrega
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow"
                      >
                        Reprogramar
                      </button>

                      {/* ENTREGADA */}

                      <button
                        onClick={() =>
                          cambiarEstatus(
                            entrega.id,
                            "entregada"
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
                      >
                        Entregada
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

      {/* MODAL REPROGRAMACIÓN */}

      {
        mostrarModal && (

          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">

              <h2 className="text-3xl font-bold mb-5">

                Reprogramar Entrega 🚗

              </h2>

              <div className="space-y-4">

                {/* FECHA */}

                <div>

                  <label className="block mb-1 font-semibold">

                    Nueva Fecha

                  </label>

                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) =>
                      setNuevaFecha(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

                {/* HORA */}

                <div>

                  <label className="block mb-1 font-semibold">

                    Nueva Hora

                  </label>

                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={(e) =>
                      setNuevaHora(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

                {/* MOTIVO */}

                <div>

                  <label className="block mb-1 font-semibold">

                    Motivo

                  </label>

                  <textarea
                    value={motivo}
                    onChange={(e) =>
                      setMotivo(
                        e.target.value
                      )
                    }
                    className="w-full border p-3 rounded-xl"
                    rows="4"
                    placeholder="Motivo de la reprogramación..."
                  />

                </div>

              </div>

              {/* BOTONES */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setMostrarModal(false)
                  }
                  className="bg-gray-300 px-5 py-2 rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  onClick={guardarReprogramacion}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl"
                >
                  Guardar
                </button>

              </div>

            </div>

          </div>

        )
      }

    </LayoutPrincipal>

  );

}