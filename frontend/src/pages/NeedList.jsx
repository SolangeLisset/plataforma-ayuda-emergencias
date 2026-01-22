import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import OfferHelpModal from '../components/OfferHelpModal';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

const NeedList = () => {
    const { config } = useConfig();
    const { user } = useAuth();
    const [needs, setNeeds] = useState([]);
    const [filters, setFilters] = useState({ region: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [selectedNeed, setSelectedNeed] = useState(null);

    useEffect(() => {
        fetchNeeds();
    }, [filters]);

    const fetchNeeds = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.region) params.append('region', filters.region);
            if (filters.category) params.append('category', filters.category);

            const res = await api.get(`/needs?${params.toString()}`);
            setNeeds(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryLabel = (catCode) => {
        return config.categories.find(c => c.id === catCode)?.label || catCode;
    };

    const getCategoryColor = (catCode) => {
        return config.categories.find(c => c.id === catCode)?.color || 'gray';
    };

    const handleOfferHelp = (need) => {
        if (!user) {
            alert('Debes iniciar sesión para ofrecer ayuda.');
            return;
        }
        setSelectedNeed(need);
    };


    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Listado de Necesidades</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
                <select
                    className="border p-2 rounded"
                    value={filters.region}
                    onChange={e => setFilters({ ...filters, region: e.target.value })}
                >
                    <option value="">Todas las regiones</option>
                    {config.locations.data.map(r => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}
                >
                    <option value="">Todas las categorías</option>
                    {config.categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : needs.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No hay necesidades registradas con estos filtros.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {needs.map(need => (
                        <div key={need.id} className="bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-${getCategoryColor(need.category)}-100 text-${getCategoryColor(need.category)}-800`}>
                                    {getCategoryLabel(need.category)}
                                </span>
                                {need.isVerified && (
                                    <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 ml-2 flex items-center gap-1">
                                        <CheckCircle size={12} /> Verificada
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                                    <Calendar size={12} /> {new Date(need.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {need.imageUrl && (
                                <img
                                    src={need.imageUrl}
                                    alt={need.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{need.title}</h3>
                            {need.petStatus && (
                                <span className={`inline-block mb-2 px-2 py-0.5 rounded text-xs font-bold text-white ${need.petStatus === 'SEARCHING' ? 'bg-red-500' :
                                        need.petStatus === 'FOUND' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}>
                                    {need.petStatus === 'SEARCHING' ? '🔍 BUSCANDO DUEÑO' :
                                        need.petStatus === 'FOUND' ? '🏠 BUSCANDO MASCOTA' : '❤️ REUNIFICADO'}
                                </span>
                            )}
                            <p className="text-gray-600 mb-4 line-clamp-3">{need.description}</p>

                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                {need.commune}, {need.region}
                            </div>

                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => {
                                        const text = `Ayuda necesaria: ${need.title} en ${need.commune}. Revisa más en: ${window.location.origin}`;
                                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition text-sm"
                                >
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: need.title,
                                                text: need.description,
                                                url: window.location.href
                                            });
                                        } else {
                                            alert('Tu navegador no soporta compartir nativo.');
                                        }
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition text-sm"
                                >
                                    Compartir
                                </button>
                            </div>

                            <div className="flex items-center text-indigo-600 text-sm mb-4 font-medium">
                                <CheckCircle size={16} className="mr-1" />
                                {need.Donations?.length || 0} ofertas de ayuda
                            </div>

                            <div className="border-t pt-4">
                                <button
                                    onClick={() => handleOfferHelp(need)}
                                    className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
                                >
                                    Ofrecer Ayuda
                                </button>
                            </div>
                        </div>
                    ))
                    }
                </div >
            )}
            {
                selectedNeed && (
                    <OfferHelpModal
                        need={selectedNeed}
                        onClose={() => setSelectedNeed(null)}
                        onSuccess={() => {
                            setSelectedNeed(null);
                            fetchNeeds(); // Refresh to show new donation count
                        }}
                    />
                )
            }
        </div >
    );
};

export default NeedList;
