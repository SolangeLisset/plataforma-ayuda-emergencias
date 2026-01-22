import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, Heart, Map, Phone, ChevronDown, ChevronUp, ExternalLink, Info, Home as HomeIcon } from 'lucide-react';

const Home = () => {
    const { config } = useConfig();
    const { emergency } = config;

    const [expandContext, setExpandContext] = useState(false);
    const [openRegion, setOpenRegion] = useState('nuble'); // Default open for MVP

    const toggleRegion = (region) => {
        setOpenRegion(openRegion === region ? null : region);
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* HERO SECTION */}
            <div className="text-center py-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{emergency.name}</h1>
                <p className="text-gray-600 mb-6">{emergency.description}</p>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    <Link to="/needs/new" className="flex flex-col items-center justify-center p-4 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition transform hover:scale-105">
                        <AlertTriangle size={32} className="mb-2" />
                        <span className="font-bold text-lg">Necesito Ayuda</span>
                    </Link>
                    <Link to="/needs" className="flex flex-col items-center justify-center p-4 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition transform hover:scale-105">
                        <Heart size={32} className="mb-2" />
                        <span className="font-bold text-lg">Quiero Ayudar</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY & CONTEXT BLOCK */}
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 mb-8 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                            <Info size={20} /> Resumen de la Emergencia
                        </h2>
                        <p className="text-sm text-orange-900 mt-1">
                            <strong>Afectación:</strong> Regiones de Ñuble, Biobío y La Araucanía.<br />
                            <strong>Estado:</strong> Alerta Roja (Actualizado: Enero 2026).
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setExpandContext(!expandContext)}
                    className="mt-3 text-orange-700 text-sm font-semibold flex items-center gap-1 hover:underline focus:outline-none"
                >
                    {expandContext ? "Ocultar detalles" : "Ver más información y contexto"}
                    {expandContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandContext && (
                    <div className="mt-4 pt-4 border-t border-orange-200 text-sm text-gray-700 space-y-2">
                        <p>Los incendios forestales están afectando múltiples comunas en la zona centro-sur. Se ha decretado Estado de Catástrofe en las regiones de Ñuble, Biobío y La Araucanía.</p>
                        <p>Siga las instrucciones de evacuación (SAE) y manténgase informado por canales oficiales.</p>
                        <a href="https://senapred.cl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2">
                            Fuente Oficial: SENAPRED <ExternalLink size={12} />
                        </a>
                    </div>
                )}
            </div>

            {/* SHELTERS SECTION */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <HomeIcon className="text-blue-600" /> Albergues y Centros de Apoyo
                </h2>

                <div className="space-y-3">
                    {/* Ñuble Accordion */}
                    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={() => toggleRegion('nuble')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700"
                        >
                            <span>Región de Ñuble</span>
                            {openRegion === 'nuble' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {openRegion === 'nuble' && (
                            <div className="p-4 space-y-3 bg-white">
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Ránquil: Escuela Básica de Ñipas</h4>
                                    <p className="text-sm text-gray-600">📍 Manuel Matta 440</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Quillón: Escuela Amanda Chávez</h4>
                                    <p className="text-sm text-gray-600">📍 18 de septiembre 899</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Trehuaco: Liceo Bicentenario</h4>
                                    <p className="text-sm text-gray-600">📍 Gonzalo Urrejola 870</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Biobío Accordion */}
                    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={() => toggleRegion('biobio')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700"
                        >
                            <span>Región del Biobío</span>
                            {openRegion === 'biobio' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {openRegion === 'biobio' && (
                            <div className="p-4 space-y-3 bg-white">
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Concepción: Liceo Domingo Santa María</h4>
                                    <p className="text-sm text-gray-600">📍 Santa María 2350</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Penco: Liceo Pencopolitano</h4>
                                    <p className="text-sm text-gray-600">📍 San Vicente 51</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Penco: Escuela Isla de Pascua</h4>
                                    <p className="text-sm text-gray-600">📍 Heras 485</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Penco: Escuela Patricio Lynch</h4>
                                    <p className="text-sm text-gray-600">📍 Camilo Henríquez N°6</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Penco: Colegio Italia</h4>
                                    <p className="text-sm text-gray-600">📍 Roberto Ovalle 02</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Tomé: Liceo Comercial</h4>
                                    <p className="text-sm text-gray-600">📍 Sgto. Aldea 1050</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Laja: Liceo Héroes de la Concepción</h4>
                                    <p className="text-sm text-gray-600">📍 Baquedano 273</p>
                                </div>
                                <div className="p-3 border rounded bg-gray-50">
                                    <h4 className="font-bold text-gray-800">Talcahuano: Palacio del Deporte</h4>
                                    <p className="text-sm text-gray-600">📍 Arturo Prat 88</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EMERGENCY CONTACTS */}
            <div id="emergency-numbers" className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="text-red-600" /> Teléfonos de Emergencia
                </h2>

                <div className="grid grid-cols-3 gap-3">
                    <a href="tel:131" className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 rounded-xl shadow-sm hover:border-red-500 hover:shadow-md transition group">
                        <span className="text-2xl font-black text-gray-800 group-hover:text-red-600">131</span>
                        <span className="text-xs font-medium text-gray-500 uppercase mt-1">Ambulancia</span>
                    </a>
                    <a href="tel:132" className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 rounded-xl shadow-sm hover:border-red-500 hover:shadow-md transition group">
                        <span className="text-2xl font-black text-gray-800 group-hover:text-red-600">132</span>
                        <span className="text-xs font-medium text-gray-500 uppercase mt-1">Bomberos</span>
                    </a>
                    <a href="tel:133" className="flex flex-col items-center justify-center p-4 bg-white border-2 border-green-100 rounded-xl shadow-sm hover:border-green-500 hover:shadow-md transition group">
                        <span className="text-2xl font-black text-gray-800 group-hover:text-green-600">133</span>
                        <span className="text-xs font-medium text-gray-500 uppercase mt-1">Carabineros</span>
                    </a>
                    <a href="tel:134" className="flex flex-col items-center justify-center p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition group">
                        <span className="text-2xl font-black text-gray-800 group-hover:text-blue-600">134</span>
                        <span className="text-xs font-medium text-gray-500 uppercase mt-1">PDI</span>
                    </a>
                </div>
            </div>

            <div className="text-center mt-12 mb-4">
                <Link to="/map" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                    <Map size={20} />
                    Ver Mapa Interactivo de Ayuda
                </Link>
            </div>
        </div>
    );
};

export default Home;
