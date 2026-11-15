import { Link } from 'react-router'

export default function NoEncontrado() {
  return (
    <div className="gamermatch flex min-h-screen flex-col items-center justify-center gap-4 bg-violet-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-violet-700">404</h1>
      <p>Esta página no existe.</p>
      <Link to="/juegos" className="rounded-md bg-violet-700 px-4 py-2 text-white hover:bg-violet-800">
        Volver a juegos
      </Link>
    </div>
  )
}
