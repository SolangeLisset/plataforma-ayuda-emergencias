import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import OfferHelpModal from '../components/OfferHelpModal';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const NeedList = () => {
    const { config } = useConfig();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [needs, setNeeds] = useState([]);
    const [filters, setFilters] = useState({ region: '', category: '', type: '' });
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
            if (filters.type) params.append('type', filters.type);

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
            showToast('Debes iniciar sesión para ofrecer ayuda.', 'warning');
            return;
        }
        setSelectedNeed(need);
    };


    return (
        <div className="container mx-auto px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Listado de Ayuda</h1>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-0 z-10 sm:relative sm:top-auto">
                <div className="flex flex-col gap-4">
                    {/* Publication Type Selector (Needs/Offers) */}
                    <div className="flex bg-gray-100 p-1 rounded-lg w-full">
                        <button
                            onClick={() => setFilters({ ...filters, type: '' })}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${!filters.type ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, type: 'REQUEST' })}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${filters.type === 'REQUEST' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
                        >
                            Necesidades
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, type: 'OFFER' })}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${filters.type === 'OFFER' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
                        >
                            Ofrecimientos
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Region Select */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Región</label>
                            <select
                                className="w-full bg-gray-50 border-0 text-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition"
                                value={filters.region}
                                onChange={e => setFilters({ ...filters, region: e.target.value })}
                            >
                                <option value="">Todas las regiones</option>
                                {config.locations.data.map(r => (
                                    <option key={r.name} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Horizontal Scroll */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Categoría</label>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                <button
                                    onClick={() => setFilters({ ...filters, category: '' })}
                                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                                        ${!filters.category
                                            ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Todas
                                </button>
                                {config.categories.map(c => {
                                    const isSelected = filters.category === c.id;
                                    const activeClass = {
                                        'red': 'bg-red-600 text-white border-red-600 shadow-sm',
                                        'blue': 'bg-blue-600 text-white border-blue-600 shadow-sm',
                                        'green': 'bg-green-600 text-white border-green-600 shadow-sm',
                                        'orange': 'bg-orange-600 text-white border-orange-600 shadow-sm',
                                        'purple': 'bg-purple-600 text-white border-purple-600 shadow-sm',
                                        'cyan': 'bg-cyan-600 text-white border-cyan-600 shadow-sm',
                                        'gray': 'bg-gray-600 text-white border-gray-600 shadow-sm',
                                    }[c.color] || 'bg-gray-800 text-white';

                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setFilters({ ...filters, category: c.id })}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap
                                                ${isSelected ? activeClass : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {c.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>
            ) : needs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-500 border-2 border-dashed border-gray-200">
                    No hay registros con estos filtros en este momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {needs.map(need => (
                        <div key={need.id} className={`bg-white rounded-xl shadow-sm border-2 p-4 sm:p-5 hover:shadow-md transition flex flex-col ${need.type === 'OFFER' ? 'border-green-100 bg-green-50/5' : 'border-transparent'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-wrap gap-1.5">
                                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest ${need.type === 'OFFER' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                                        {need.type === 'OFFER' ? 'Ofrecimiento' : 'Necesidad'}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest ${{
                                            'red': 'bg-red-100 text-red-800 border-red-200',
                                            'blue': 'bg-blue-100 text-blue-800 border-blue-200',
                                            'green': 'bg-green-100 text-green-800 border-green-200',
                                            'orange': 'bg-orange-100 text-orange-800 border-orange-200',
                                            'purple': 'bg-purple-100 text-purple-800 border-purple-200',
                                            'cyan': 'bg-cyan-100 text-cyan-800 border-cyan-200',
                                            'gray': 'bg-gray-100 text-gray-800 border-gray-200',
                                        }[getCategoryColor(need.category)] || 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {getCategoryLabel(need.category)}
                                    </span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(need.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {need.imageUrl && (
                                <img
                                    src={need.imageUrl}
                                    alt={need.title}
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 shadow-sm"
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

                            {need.status === 'FULFILLED' && need.evidenceUrl && (
                                <div className="mt-2 mb-4 p-2 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                                        <CheckCircle size={12} /> Evidencia de Ayuda Entregada
                                    </p>
                                    <img
                                        src={need.evidenceUrl}
                                        alt="Evidencia"
                                        className="w-full h-32 object-cover rounded shadow-sm border border-white"
                                    />
                                </div>
                            )}

                            <div className="border-t pt-4">
                                {need.status === 'FULFILLED' ? (
                                    <div className="w-full bg-green-100 text-green-800 py-2 rounded font-bold text-center flex items-center justify-center gap-2">
                                        <CheckCircle size={18} /> CASO RESUELTO
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleOfferHelp(need)}
                                        className={`w-full text-white py-2 rounded font-medium transition ${need.type === 'OFFER' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    >
                                        {need.type === 'OFFER' ? 'Contactar / Coordinar' : 'Ofrecer Ayuda'}
                                    </button>
                                )}
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
