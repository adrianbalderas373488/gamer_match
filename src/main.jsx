import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Login from './components/Login'
import BuscadorJuegos from './components/BuscadorJuegos'
import Jugadores from './components/Jugadores'
import Perfil from './components/Perfil'
import Solicitudes from './components/Solicitudes'
import NoEncontrado from './components/NoEncontrado'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/juegos" replace />} />
        <Route path="login" element={<Login />} />

        {/* Día 2: envolver este Layout con <RutaProtegida /> */}
        <Route element={<Layout />}>
          <Route path="juegos" element={<BuscadorJuegos />} />
          <Route path="jugadores/:rawgId" element={<Jugadores />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="solicitudes" element={<Solicitudes />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
