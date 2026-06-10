import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import Nav from './components/Nav';

import Principal    from './pages/Principal';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Ventas       from './pages/Ventas';
import Carrito      from './pages/Carrito';
import Checkout     from './pages/Checkout';
import Nosotros     from './pages/Nosotros';
import Colecciones  from './pages/Colecciones';
import ChatBot      from './pages/ChatBot';
import Admin        from './pages/Admin';
const PrivateRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem('ds_token');
  const user  = JSON.parse(localStorage.getItem('ds_user') || 'null');
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !['admin','vendedor'].includes(user?.role_name)) return <Navigate to="/" replace />;
  return children;
};
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Nav />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#111',
                  color: '#f5f0e8',
                  border: '1px solid rgba(201,168,76,0.25)',
                  fontSize: '0.78rem',
                  fontFamily: 'Montserrat, sans-serif',
                },
                success: { iconTheme: { primary: '#c9a84c', secondary: '#0a0a0a' } },
              }}
            />
            <Routes>
              <Route path="/"             element={<Principal />} />
              <Route path="/login"        element={<Login />} />
              <Route path="/registro"     element={<Register />} />
              <Route path="/ventas"       element={<Ventas />} />
              <Route path="/colecciones"  element={<Colecciones />} />
              <Route path="/nosotros"     element={<Nosotros />} />
              <Route path="/chat"         element={<ChatBot />} />
              <Route path="/carrito"      element={<Carrito />} />
              <Route path="/checkout"     element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/admin"        element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
