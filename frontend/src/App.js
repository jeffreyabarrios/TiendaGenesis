import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/Dashboard';
import ChurrascosPage from './pages/ChurrascosPage';
import DulcesPage from './pages/DulcesPage';
import CombosPage from './pages/CombosPage';
import InventarioPage from './pages/InventarioPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }
          />
          <Route
            path="/churrascos"
            element={
                <PrivateRoute>
                    <ChurrascosPage />
                </PrivateRoute>
            }
          />
          <Route
            path="/dulces"
            element={
                <PrivateRoute>
                    <DulcesPage />
                </PrivateRoute>
            }
          />
          <Route
            path="/combos"
            element={
                <PrivateRoute>
                    <CombosPage />
                </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
                <PrivateRoute>
                    <InventarioPage />
                </PrivateRoute>
            }
          />         
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
