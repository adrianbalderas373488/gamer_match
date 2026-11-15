import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router'
import { escucharSesion } from './store/sesion'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Login from './components/Login'
import BuscadorJuegos from './components/BuscadorJuegos'
import Jugadores from './components/Jugadores'
import Perfil from './components/Perfil'
import Solicitudes from './components/Solicitudes'
import NoEncontrado from './components/NoEncontrado'

escucharSesion()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/juegos" replace />} />
        <Route path="login" element={<Login />} />

        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="juegos" element={<BuscadorJuegos />} />
            <Route path="jugadores/:rawgId" element={<Jugadores />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="solicitudes" element={<Solicitudes />} />
          </Route>
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
