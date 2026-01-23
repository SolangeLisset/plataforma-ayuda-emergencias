import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User as UserIcon, MessageSquare } from 'lucide-react';

const Navbar = ({ appName }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-red-600 flex items-center gap-2">
                        {appName}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/needs" className="text-gray-700 hover:text-red-600 font-medium">Necesidades</Link>
                        <Link to="/map" className="text-gray-700 hover:text-red-600 font-medium">Ver Mapa</Link>
                        <Link to="/needs/new" className="text-gray-700 hover:text-red-600 font-medium">Solicitar Ayuda</Link>
                        {user && (
                            <Link to="/inbox" className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-gray-200">
                                <MessageSquare size={18} className="text-red-500" />
                                Mis Mensajes
                            </Link>
                        )}
                        <a href="#emergency-numbers" className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition animate-pulse shadow-lg flex items-center gap-2">
                            🚨 SOS
                        </a>
                        {/* <Link to="/donations" className="text-gray-700 hover:text-red-600 font-medium">Donar</Link> */}

                        {user ? (
                            <div className="flex items-center gap-4 ml-4">
                                <Link to="/profile" className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1.5 p-1 px-2 rounded-lg hover:bg-gray-50 group">
                                    <div className="bg-gray-100 p-1 rounded-md group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                        <UserIcon size={14} />
                                    </div>
                                    {user.fullName}
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors ml-1">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="ml-4 flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded">Ingresar</Link>
                                <Link to="/register" className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700">Registrarse</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 space-y-2">
                    <Link to="/needs" className="block py-2 text-gray-700">Necesidades</Link>
                    <Link to="/map" className="block py-2 text-gray-700">Ver Mapa</Link>
                    <Link to="/needs/new" className="block py-2 text-gray-700">Solicitar Ayuda</Link>
                    {user && (
                        <Link to="/inbox" className="block py-2 text-red-600 font-bold flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <MessageSquare size={18} /> Mis Mensajes
                        </Link>
                    )}
                    <a href="#emergency-numbers" className="block py-2 text-red-600 font-bold flex items-center gap-2">
                        🚨 SOS / Números de Emergencia
                    </a>
                    {user ? (
                        <>
                            <div className="border-t my-2 pt-2">
                                <p className="text-sm text-gray-500 mb-2">{user.fullName}</p>
                                <button onClick={handleLogout} className="text-red-600 w-full text-left">Cerrar Sesión</button>
                            </div>
                        </>
                    ) : (
                        <div className="border-t my-2 pt-2 flex flex-col gap-2">
                            <Link to="/login" className="text-center py-2 border rounded">Ingresar</Link>
                            <Link to="/register" className="text-center py-2 bg-red-600 text-white rounded">Registrarse</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
