import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useConfig } from './context/ConfigContext';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NeedList from './pages/NeedList';
import CreateNeed from './pages/CreateNeed';
import AdminDashboard from './pages/AdminDashboard';
import DisasterMap from './pages/DisasterMap';
import Navbar from './components/Navbar';

import { ToastProvider } from './context/ToastContext';

function App() {
    const { config, loading: configLoading } = useConfig();
    const { loading: authLoading } = useAuth();

    if (configLoading || authLoading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    if (!config) return <div>Error: No se pudo cargar la configuración.</div>;

    return (
        <ToastProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar appName={config.general.appName} />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/needs" element={<NeedList />} />
                            <Route path="/needs/new" element={<CreateNeed />} />
                            <Route path="/map" element={<DisasterMap />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    <footer className="bg-gray-800 text-gray-300 text-center py-8 px-4 mt-auto">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="text-sm space-y-4">
                                <h3 className="font-bold text-white text-lg">Sobre esta plataforma</h3>
                                <p className="leading-relaxed text-gray-400">
                                    Esta es una herramienta de código abierto, desarrollada y mantenida por voluntarios, cuyo objetivo es apoyar la coordinación de ayuda en contextos de emergencia.
                                </p>
                                <p className="leading-relaxed text-gray-400 border-l-4 border-yellow-500 pl-4 text-left ml-4">
                                    La información publicada es de carácter referencial y puede cambiar con el tiempo. Para decisiones críticas relacionadas con seguridad, evacuaciones o salud, recomendamos seguir siempre las instrucciones de las autoridades y consultar fuentes oficiales como SENAPRED, CONAF o Carabineros de Chile.
                                </p>
                            </div>
                            <div className="border-t border-gray-700 pt-6 text-xs text-gray-500 flex flex-col items-center gap-2">
                                <span>&copy; {new Date().getFullYear()} {config.general.appName} – {config.general.countryCode}</span>
                                <span className="text-gray-400">Creado con ❤️ por <strong className="text-white">Solange Lisset</strong></span>
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </ToastProvider>
    );
}

export default App;
