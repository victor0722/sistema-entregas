import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";

import interactionPlugin from "@fullcalendar/interaction";

import LayoutPrincipal from "../layouts/LayoutPrincipal";

import api from "../services/api";

export default function Calendario() {

  //////////////////////////////////////////////////////
  // STATES
  //////////////////////////////////////////////////////

  const [eventos, setEventos] = useState([]);

  const [mostrarModal, setMostrarModal] =
    useState(false);
    const [
  mostrarDetalleEntrega,
  setMostrarDetalleEntrega
] = useState(false);

  const [
    mostrarModalReprogramacion,
    setMostrarModalReprogramacion
  ] = useState(false);

  const [fechaSeleccionada,
    setFechaSeleccionada] =
    useState("");

  const [titulo, setTitulo] =
    useState("");

  const [cliente, setCliente] =
    useState("");

  const [unidad, setUnidad] =
    useState("");

  const [hora, setHora] =
    useState("");

  const [
    entregaSeleccionada,
    setEntregaSeleccionada
  ] = useState(null);

  const [
    propuestaFecha,
    setPropuestaFecha
  ] = useState("");

  const [
    propuestaHora,
    setPropuestaHora
  ] = useState("");

  const [
    mostrarPropuesta,
    setMostrarPropuesta
  ] = useState(false);

  const [
    mensajeError,
    setMensajeError
  ] = useState("");

  const [
    tituloError,
    setTituloError
  ] = useState("");

  const [
    mensajeExito,
    setMensajeExito
  ] = useState("");

  const [
    tituloExito,
    setTituloExito
  ] = useState("");

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const rol = usuario?.rol;

  //////////////////////////////////////////////////////
  // FORMATEAR FECHA
  //////////////////////////////////////////////////////

  const formatearFecha = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha)
      .toLocaleDateString(
        "es-MX",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

  };

  //////////////////////////////////////////////////////
  // OBTENER ENTREGAS
  //////////////////////////////////////////////////////

  const obtenerEntregas = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await api.get(
          "/entregas",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const eventosFormateados =
        response.data.map(
          (entrega) => {

            let fechaEvento = entrega.fecha;
let horaEvento = entrega.hora;

// SOLO cambiar si YA aceptó la reprogramación

if (
  entrega.estado === "reprogramada"
) {

  fechaEvento =
    entrega.fecha;

  horaEvento =
    entrega.hora;

}

            const fechaFormateada =
              new Date(fechaEvento)
                .toISOString()
                .split("T")[0];

            const horaFormateada =
              String(horaEvento)
                .substring(0,8);

            return {

  id: entrega.id,

  title:
    `${horaFormateada.slice(0,5)} | ${entrega.titulo}
    ${
      entrega.estado === "reprogramada"
        ? " 🔄 Reprogramada"
      : entrega.estado === "reprogramada_aceptada"
        ? " ✅ Reprogramación aceptada"
      : entrega.estado === "entregada"
        ? " 🚗 Entregada"
      : entrega.estado === "aprobada"
        ? " ✅ Aprobada"
      : " ⏳ Pendiente"
    }`,

  start:
    `${fechaFormateada}T${horaFormateada}`,

backgroundColor:
  entrega.estado === "aprobada"
    ? "#22c55e"
  : entrega.estado === "reprogramada"
    ? "#facc15"
  : entrega.estado === "entregada"
    ? "#3b82f6"
  : "#6b7280",

 borderColor:
  entrega.estado === "aprobada"
    ? "#22c55e"
  : entrega.estado === "reprogramada"
    ? "#facc15"
  : entrega.estado === "entregada"
    ? "#3b82f6"
  : "#6b7280",

  textColor: "#ffffff",

  extendedProps: {
    ...entrega,
  },

};

          }
        );

      setEventos(
        eventosFormateados
      );

    } catch (error) {

      console.log(error);

    }

  };

  //////////////////////////////////////////////////////
  // SELECCIONAR FECHA
  //////////////////////////////////////////////////////

  const seleccionarFecha = (info) => {

    setMensajeError("");
    setTituloError("");

    // FECHA ACTUAL

    const hoy = new Date();

    hoy.setHours(0,0,0,0);

    // FECHA MÍNIMA

    const fechaMinima =
      new Date(hoy);

    fechaMinima.setDate(
      fechaMinima.getDate() + 2
    );

    // FECHA CLICK

    const fechaClick =
      new Date(
        info.dateStr + "T00:00:00"
      );

    fechaClick.setHours(0,0,0,0);

    // VALIDAR

    if (
      fechaClick.getTime() <
      fechaMinima.getTime()
    ) {

      setTituloError(
        "Anticipación requerida 🚫"
      );

      setMensajeError(
        "Las entregas deben agendarse con mínimo 48 horas de anticipación."
      );

      setTimeout(() => {

        setMensajeError("");
        setTituloError("");

      }, 4000);

      return;
    }

    // ABRIR MODAL

    setFechaSeleccionada(
      info.dateStr
    );

    setMostrarModal(true);

  };

  //////////////////////////////////////////////////////
  // CLICK EVENTO
  //////////////////////////////////////////////////////

  const abrirDetalleEntrega = (info) => {

  const entrega =
    info.event.extendedProps;

  //////////////////////////////////////////////////////
  // VENDEDOR
  //////////////////////////////////////////////////////

  if (
    rol === "vendedor" &&
    entrega.estado === "reprogramada"
  ) {

    setEntregaSeleccionada(
      entrega
    );

    setMostrarModalReprogramacion(
      true
    );

    return;

  }

  //////////////////////////////////////////////////////
  // GERENTE
  //////////////////////////////////////////////////////

  setEntregaSeleccionada(entrega);

  setMostrarDetalleEntrega(true);

};

  //////////////////////////////////////////////////////
  // CREAR ENTREGA
  //////////////////////////////////////////////////////

  //////////////////////////////////////////////////////
// CREAR ENTREGA
//////////////////////////////////////////////////////

const crearEntrega = async () => {

  // VALIDACIONES

  if (!titulo.trim()) {

    setTituloError("Campo requerido 🚫");
    setMensajeError("Debes escribir un título.");

    return;
  }

  if (!cliente.trim()) {

    setTituloError("Campo requerido 🚫");
    setMensajeError("Debes escribir el cliente.");

    return;
  }

  if (!unidad.trim()) {

    setTituloError("Campo requerido 🚫");
    setMensajeError("Debes escribir la unidad.");

    return;
  }

  if (!hora) {

    setTituloError("Campo requerido 🚫");
    setMensajeError("Debes seleccionar un horario.");

    return;
  }

  try {

    const token =
      localStorage.getItem("token");

    console.log({
      titulo,
      cliente,
      unidad,
      fecha: fechaSeleccionada,
      hora,
      estado: "pendiente",
    });

    const response = await api.post(
      "/entregas",
      {
        titulo: titulo,
        cliente: cliente,
        unidad: unidad,
        fecha: fechaSeleccionada,
        hora: hora,
        estado: "pendiente",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    //////////////////////////////////////////////////////
    // CERRAR MODAL
    //////////////////////////////////////////////////////

    setMostrarModal(false);

    //////////////////////////////////////////////////////
    // LIMPIAR CAMPOS
    //////////////////////////////////////////////////////

    setTitulo("");
    setCliente("");
    setUnidad("");
    setHora("");

    //////////////////////////////////////////////////////
    // RECARGAR CALENDARIO
    //////////////////////////////////////////////////////

    await obtenerEntregas();

    //////////////////////////////////////////////////////
    // ALERTA EXITO
    //////////////////////////////////////////////////////

    setTituloExito(
      "Entrega creada 🚀"
    );

    setMensajeExito(
      "La entrega fue agendada correctamente."
    );

    setTimeout(() => {

      setTituloExito("");
      setMensajeExito("");

    }, 4000);

  } catch (error) {

    console.log("ERROR COMPLETO:");
    console.log(error);

    console.log("RESPUESTA:");
    console.log(error.response);

    console.log("DATA:");
    console.log(error.response?.data);

    const mensaje =
      error.response?.data?.mensaje ||
      error.response?.data?.error ||
      "Error al crear entrega 🚫";

    setTituloError(
      "Error 🚫"
    );

    setMensajeError(
      mensaje
    );

    setTimeout(() => {

      setMensajeError("");
      setTituloError("");

    }, 4000);

  }

};
  //////////////////////////////////////////////////////
  // ACEPTAR REPROGRAMACIÓN
  //////////////////////////////////////////////////////

  const aceptarReprogramacion =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        await api.put(
          `/entregas/aceptar-reprogramacion/${entregaSeleccionada.id}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setMostrarModalReprogramacion(false);

        obtenerEntregas();

        setTituloExito(
          "Reprogramación aceptada ✅"
        );

        setMensajeExito(
          "La entrega fue actualizada correctamente."
        );

      } catch (error) {

        console.log(error);

      }

    };

  //////////////////////////////////////////////////////
  // PROPONER FECHA
  //////////////////////////////////////////////////////

  const enviarNuevaPropuesta =
    async () => {

      
      try {

        const token =
          localStorage.getItem("token");

        await api.put(
          `/entregas/proponer-fecha/${entregaSeleccionada.id}`,
          {
            propuesta_fecha:
              propuestaFecha,

            propuesta_hora:
              propuestaHora,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setMostrarModalReprogramacion(false);

        setMostrarPropuesta(false);

        setPropuestaFecha("");

        setPropuestaHora("");

        obtenerEntregas();

        setTituloExito(
          "Nueva propuesta enviada 🚀"
        );

        setMensajeExito(
          "Gerencia recibirá la nueva fecha."
        );

      } catch (error) {

        console.log(error);

      }

    };


    //////////////////////////////////////////////////////
// APROBAR ENTREGA
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// APROBAR ENTREGA
//////////////////////////////////////////////////////

const aprobarEntrega = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await api.put(

      `/entregas/${entregaSeleccionada.id}`,

      {
        estado: "aprobada",
      },

      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }

    );

    setMostrarDetalleEntrega(false);

    await obtenerEntregas();

    setTituloExito(
      "Entrega aprobada ✅"
    );

    setMensajeExito(
      "La entrega fue aprobada correctamente."
    );

  } catch (error) {

    console.log(error);

  }

};

//////////////////////////////////////////////////////
// MARCAR ENTREGADA
//////////////////////////////////////////////////////

const marcarEntregada = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await api.put(

      `/entregas/${entregaSeleccionada.id}`,

      {
        estado: "entregada",
      },

      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }

    );

    setMostrarDetalleEntrega(false);

    await obtenerEntregas();

    setTituloExito(
      "Entrega completada 🚗"
    );

    setMensajeExito(
      "La unidad fue marcada como entregada."
    );

  } catch (error) {

    console.log(error);

  }

};
//////////////////////////////////////////////////////
// MARCAR COMO ENTREGADA
//////////////////////////////////////////////////////



  //////////////////////////////////////////////////////
  // USE EFFECT
  //////////////////////////////////////////////////////

  useEffect(() => {

    obtenerEntregas();

    const intervalo =
      setInterval(() => {

        obtenerEntregas();

      }, 5000);

    return () =>
      clearInterval(intervalo);

  }, []);

  //////////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////////

  return (

    <LayoutPrincipal>

      <h1 className="text-3xl font-bold mb-6">
        Calendario de Entregas 📅
      </h1>
      {/* AVISO GERENCIA */}

{
  rol === "gerencia" && (

    <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-2xl mb-5">

      <p className="text-sm mt-1">
        Puedes visualizar todas las entregas del sistema.
      </p>

    </div>

  )
}

{/* AVISO VENDEDOR */}

{
  rol === "vendedor" && (

    <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-2xl mb-5">

      <p className="text-sm mt-1">
        Agenda y administra tus entregas.
      </p>

    </div>

  )
}

{/* REGLAS */}

<div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-2xl mb-5 shadow-sm">

  <h2 className="font-bold text-lg mb-1">
    Importante 🚨
  </h2>

  <ul className="list-disc ml-5 space-y-1 text-sm">

    <li>
      Las entregas deben agendarse con mínimo 48 horas de anticipación.
    </li>

    <li>
      Solo se permiten 2 entregas por horario.
    </li>

    <li>
      Horario laboral:
      9:00 AM a 6:00 PM.
    </li>

    <li>
      Horarios disponibles:
      11:00 AM, 1:00 PM, 3:00 PM, 5:00 PM y 6:00 PM.
    </li>

  </ul>

</div>

      <div className="bg-white p-5 rounded-xl shadow">

        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          events={eventos}
          dateClick={seleccionarFecha}
          eventClick={abrirDetalleEntrega}
          selectable={true}
          editable={true}
          dayMaxEvents={true}
          height="80vh"
        />

      </div>

      {/* MODAL CREAR */}

      {/* MODAL CREAR */}

{mostrarModal && (

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-fadeIn">

      {/* HEADER */}

      <div className="flex justify-between items-start mb-8">

        <div>

          <h2 className="text-5xl font-bold text-blue-700">

            Nueva Entrega 📦

          </h2>

          <p className="text-gray-500 mt-2 text-lg">

            Programa una nueva entrega en el calendario.

          </p>

        </div>

        <button
          onClick={() =>
            setMostrarModal(false)
          }
          className="text-4xl text-gray-400 hover:text-red-500 transition"
        >
          ×
        </button>

      </div>

      {/* FORMULARIO */}

      <div className="grid grid-cols-2 gap-4">

        {/* TITULO */}

        <div className="col-span-2">

          <label className="block text-sm font-semibold text-gray-600 mb-2">

            Título

          </label>

          <input
            type="text"
            placeholder="Entrega de unidad"
            value={titulo}
            onChange={(e) =>
              setTitulo(e.target.value)
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          />

        </div>

        {/* CLIENTE */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">

            Cliente

          </label>

          <input
            type="text"
            placeholder="Nombre del cliente"
            value={cliente}
            onChange={(e) =>
              setCliente(e.target.value)
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          />

        </div>

        {/* UNIDAD */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">

            Unidad

          </label>

          <input
            type="text"
            placeholder="Modelo / unidad"
            value={unidad}
            onChange={(e) =>
              setUnidad(e.target.value)
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          />

        </div>

        {/* FECHA */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">

            Fecha seleccionada

          </label>

          <input
            type="text"
            disabled
            value={formatearFecha(
              fechaSeleccionada
            )}
            className="w-full bg-gray-100 border border-gray-300 p-4 rounded-2xl"
          />

        </div>

        {/* HORARIO */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">

            Horario

          </label>

          <select
            value={hora}
            onChange={(e) =>
              setHora(e.target.value)
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          >

            <option value="">
              Selecciona horario
            </option>

            <option value="11:00">
              11:00 AM
            </option>

            <option value="13:00">
              1:00 PM
            </option>

            <option value="15:00">
              3:00 PM
            </option>

            <option value="17:00">
              5:00 PM
            </option>

            <option value="18:00">
              6:00 PM
            </option>

          </select>

        </div>

      </div>

      {/* BOTONES */}

      <div className="flex justify-end gap-3 mt-8">

        <button
          onClick={() =>
            setMostrarModal(false)
          }
          className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-2xl transition"
        >
          Cancelar
        </button>

        <button
          onClick={crearEntrega}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg transition"
        >
          Crear Entrega
        </button>

      </div>

    </div>

  </div>

)}

      {/* MODAL REPROGRAMACIÓN */}

      

    {mostrarModalReprogramacion && (

  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-fadeIn relative">

      {/* BOTON CERRAR */}

      <button
        onClick={() => {
          setMostrarModalReprogramacion(false);
          setMostrarPropuesta(false);
        }}
        className="absolute top-5 right-6 text-4xl text-gray-400 hover:text-red-500 transition"
      >
        ×
      </button>

      {/* HEADER */}

     <div className="mb-6">

  <h2 className="text-4xl font-bold text-yellow-500 mb-2">
    Reprogramación ⚠️
  </h2>

  {
    rol === "vendedor" ? (

      <p className="text-gray-500 text-lg">
        Gerencia solicitó un cambio de fecha para esta entrega.
      </p>

    ) : (

      <p className="text-gray-500 text-lg">
        Propón una nueva fecha y horario para la entrega.
      </p>

    )
  }

</div>

{/* SOLO VENDEDOR */}

{
  rol === "vendedor" && (

    <>

      {/* INFO */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-gray-100 p-4 rounded-2xl">

          <p className="text-sm text-gray-500 mb-1">
            Nueva fecha
          </p>

          <p className="font-bold text-lg">
            {
              formatearFecha(
                entregaSeleccionada?.nueva_fecha
              )
            }
          </p>

        </div>

        <div className="bg-gray-100 p-4 rounded-2xl">

          <p className="text-sm text-gray-500 mb-1">
            Nueva hora
          </p>

          <p className="font-bold text-lg">
            {
              entregaSeleccionada?.nueva_hora?.slice(0,5)
            }
          </p>

        </div>

      </div>

      {/* BOTONES */}

      <div className="flex flex-wrap gap-3">

        <button
          onClick={aceptarReprogramacion}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl transition shadow"
        >
          ✅ Aceptar
        </button>

        <button
          onClick={() =>
            setMostrarPropuesta(
              !mostrarPropuesta
            )
          }
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl transition shadow"
        >
          📅 Proponer Fecha
        </button>

      </div>

    </>

  )
}

{/* PROPUESTA */}

{
  (mostrarPropuesta || rol === "gerencia") && (

    <div className="mt-8 border-t pt-6">

      <h3 className="text-2xl font-bold mb-4 text-blue-600">
        Nueva propuesta 🚀
      </h3>

      <div className="space-y-4">

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Nueva fecha
          </label>

          <input
            type="date"
            value={propuestaFecha}
            onChange={(e) =>
              setPropuestaFecha(
                e.target.value
              )
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Nueva hora
          </label>

          <input
            type="time"
            value={propuestaHora}
            onChange={(e) =>
              setPropuestaHora(
                e.target.value
              )
            }
            className="w-full border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-300 outline-none"
          />

        </div>

        <button
          onClick={enviarNuevaPropuesta}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl w-full transition shadow-lg"
        >
          Enviar propuesta
        </button>

      </div>

    </div>

  )
}
    </div>

  </div>

)}
{/* MODAL DETALLE ENTREGA */}

{
  mostrarDetalleEntrega && entregaSeleccionada && (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative animate-fadeIn">

        {/* CERRAR */}

        <button
          onClick={() =>
            setMostrarDetalleEntrega(false)
          }
          className="absolute top-5 right-6 text-4xl text-gray-400 hover:text-red-500 transition"
        >
          ×
        </button>

        {/* HEADER */}

        <div className="mb-8">

          <h2 className="text-4xl font-bold text-blue-700 mb-2">
            Detalle de Entrega 📦
          </h2>

          <p className="text-gray-500 text-lg">
            Información completa de la entrega.
          </p>

        </div>

        {/* INFORMACION */}

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Título
            </p>

            <p className="font-bold text-lg">
              {entregaSeleccionada.titulo}
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Cliente
            </p>

            <p className="font-bold text-lg">
              {entregaSeleccionada.cliente}
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Unidad
            </p>

            <p className="font-bold text-lg">
              {entregaSeleccionada.unidad}
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Fecha
            </p>

            <p className="font-bold text-lg">
              {
                formatearFecha(
                  entregaSeleccionada.fecha
                )
              }
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Hora
            </p>

            <p className="font-bold text-lg">
              {
                entregaSeleccionada.hora?.slice(0,5)
              }
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">
              Estado
            </p>

            <p className="font-bold text-lg">

              {
                entregaSeleccionada.estado === "pendiente"
                  ? "⏳ Pendiente"
                : entregaSeleccionada.estado === "aprobada"
                  ? "✅ Aprobada"
                : entregaSeleccionada.estado === "entregada"
                  ? "🚗 Entregada"
                : entregaSeleccionada.estado === "reprogramada"
                  ? "🔄 Reprogramada"
                : entregaSeleccionada.estado
              }

            </p>

          </div>

        </div>

        {/* BOTON */}

        {/* BOTONES */}

{/* BOTONES */}

<div className="flex justify-between mt-8 flex-wrap gap-3">

  {
    rol === "gerencia" && (

      <div className="flex gap-3 flex-wrap">

        {
          entregaSeleccionada.estado !==
          "aprobada" && (

            <button
              onClick={aprobarEntrega}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl shadow transition"
            >
              ✅ Aprobar
            </button>

          )
        }

        <button
  onClick={() => {

    setMostrarDetalleEntrega(false);

    setMostrarModalReprogramacion(true);

  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl shadow transition"
>
  🔄 Reprogramar
</button>

        {
          entregaSeleccionada.estado !==
          "entregada" && (

            <button
              onClick={marcarEntregada}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl shadow transition"
            >
              🚗 Entregada
            </button>

          )
        }

      </div>

    )
  }

  <button
    onClick={() =>
      setMostrarDetalleEntrega(false)
    }
    className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-2xl shadow-lg transition"
  >
    Cerrar
  </button>

</div>
      </div>

    </div>

  )
}

      {/* ALERTA ERROR */}

      {
        mensajeError && (

          <div className="fixed top-5 right-5 z-[9999] animate-bounce">

            <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">

              <span className="text-2xl">
                🚫
              </span>

              <div>

                <p className="font-bold">
                  {tituloError}
                </p>

                <p className="text-sm">
                  {mensajeError}
                </p>

              </div>

              <button
                onClick={() => {

                  setMensajeError("");
                  setTituloError("");

                }}
                className="ml-3 text-white text-xl"
              >
                ×
              </button>

            </div>

          </div>

        )
      }

      {/* ALERTA EXITO */}

      {
        mensajeExito && (

          <div className="fixed top-5 left-5 z-[9999] animate-bounce">

            <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">

              <span className="text-2xl">
                ✅
              </span>

              <div>

                <p className="font-bold">
                  {tituloExito}
                </p>

                <p className="text-sm">
                  {mensajeExito}
                </p>

              </div>

              <button
                onClick={() => {

                  setTituloExito("");
                  setMensajeExito("");

                }}
                className="ml-3 text-white text-xl"
              >
                ×
              </button>

            </div>

          </div>

        )
      }

    </LayoutPrincipal>

  );

}