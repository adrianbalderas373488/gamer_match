import { Link } from 'react-router'

export default function NoEncontrado() {
  return (
    <main className="gamermatch flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
      <h1 className="font-display text-8xl leading-none font-bold text-acento">404</h1>
      <p className="text-muted-foreground">Esta página no existe.</p>
      <Link
        to="/juegos"
        className="grid min-h-11 place-items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        Volver a juegos
      </Link>
    </main>
  )
}
