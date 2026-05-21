import LayoutPrincipal from "../layouts/LayoutPrincipal";

export default function Dashboard() {

  return (

    <LayoutPrincipal>

      <h1 className="text-3xl font-bold mb-4">
        Dashboard 🚀
      </h1>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">
            Entregas Hoy
          </h2>

          <p className="text-4xl mt-4">
            12
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">
            Pendientes
          </h2>

          <p className="text-4xl mt-4">
            5
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">
            Reprogramadas
          </h2>

          <p className="text-4xl mt-4">
            2
          </p>
        </div>

      </div>

    </LayoutPrincipal>

  );

}