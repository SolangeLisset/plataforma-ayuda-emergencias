import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useConfig } from '../context/ConfigContext';
import api from '../services/api';
import L from 'leaflet';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Filter, MapPin, Navigation, Crosshair } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to handle map centering
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const DisasterMap = () => {
    const { config } = useConfig();
    const [needs, setNeeds] = useState([]);
    const [filteredNeeds, setFilteredNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(0); // 0 means all, else km
    const [mapCenter, setMapCenter] = useState([-37.4697, -72.3537]);
    const [zoom, setZoom] = useState(8);

    // Haversine formula for distance
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchNeeds = async () => {
            try {
                const res = await api.get('/needs');
                setNeeds(res.data);
            } catch (err) {
                console.error("Error loading map data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNeeds();
    }, []);

    useEffect(() => {
        let result = needs;

        if (filterCategory) {
            result = result.filter(n => n.category === filterCategory);
        }

        if (userLocation && radius > 0) {
            result = result.filter(n => {
                const d = getDistance(userLocation[0], userLocation[1], n.latitude, n.longitude);
                return d <= radius;
            });
        }

        setFilteredNeeds(result);
    }, [filterCategory, needs, userLocation, radius]);

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(coords);
            setMapCenter(coords);
            setZoom(13);
            setRadius(10); // Default 10km when clicking "Near me"
        }, (err) => {
            alert("No se pudo obtener tu ubicación. Por favor, asegúrate de dar permisos.");
        });
    };

    if (loading) return <div className="text-center p-10">Cargando mapa...</div>;

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
            <Helmet>
                <title>Mapa de Ayuda | {config?.general?.appName || 'Ayuda Civil'}</title>
                <meta name="description" content={`Visualiza en tiempo real los focos de necesidad y puntos de ayuda en ${config?.general?.countryCode || 'Chile'}. Mapa interactivo para coordinación ciudadana.`} />
            </Helmet>
            <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-2 items-center">
                    <select
                        className="p-2 border rounded-lg text-sm min-w-[150px] outline-none focus:ring-2 focus:ring-red-500"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {config.categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>

                    {radius > 0 && (
                        <div className="flex gap-1 items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                            <Navigation size={12} /> Proximidad: {radius}km
                            <button onClick={() => setRadius(0)} className="ml-1 hover:text-blue-900">×</button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleNearMe}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition"
                >
                    <Crosshair size={18} /> Cerca de mí
                </button>
            </div>

            <div className="flex-grow rounded-xl overflow-hidden shadow-inner border border-gray-200 relative">
                <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={mapCenter} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={L.divIcon({
                                className: 'custom-div-icon',
                                html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
                                iconSize: [16, 16],
                                iconAnchor: [8, 8]
                            })}
                        >
                            <Popup>Tu ubicación actual</Popup>
                        </Marker>
                    )}

                    {filteredNeeds.map(need => (
                        need.latitude && need.longitude ? (
                            <Marker
                                key={need.id}
                                position={[need.latitude, need.longitude]}
                            >
                                <Popup>
                                    <div className="min-w-[200px]">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${need.type === 'OFFER' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                                {need.type === 'OFFER' ? 'Ofrecimiento' : 'Necesidad'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">{need.category}</span>
                                        </div>
                                        <h3 className="font-bold text-base mb-1">{need.title}</h3>
                                        <p className="text-sm mb-2 leading-tight line-clamp-2">{need.description}</p>
                                        {need.imageUrl && (
                                            <img src={need.imageUrl} alt="Foto" className="w-full h-24 object-cover rounded mb-2" />
                                        )}
                                        <div className="text-xs font-semibold text-blue-600 mb-3 flex items-center gap-1">
                                            <CheckCircle size={12} /> {need.Donations?.length || 0} Ayudas ofrecidas
                                        </div>
                                        <a href={`/needs`} className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition">
                                            Ver Detalle / Ayudar
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ) : null
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default DisasterMap;
