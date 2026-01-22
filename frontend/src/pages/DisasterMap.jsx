import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useConfig } from '../context/ConfigContext';
import api from '../services/api';
import L from 'leaflet';
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

const DisasterMap = () => {
    const { config } = useConfig();
    const [needs, setNeeds] = useState([]);
    const [filteredNeeds, setFilteredNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');

    // Default center (Ñuble/Biobío/Araucanía)
    const defaultCenter = [-37.4697, -72.3537]; // Near Los Ángeles, central to the zone

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
        fetchNeeds();
    }, []);

    useEffect(() => {
        if (!filterCategory) {
            setFilteredNeeds(needs);
        } else {
            setFilteredNeeds(needs.filter(n => n.category === filterCategory));
        }
    }, [filterCategory, needs]);

    if (loading) return <div className="text-center p-10">Cargando mapa...</div>;

    return (
        <div className="h-[calc(100vh-64px)] w-full relative">
            {/* Map Filters Overlay */}
            <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow-lg">
                <select
                    className="p-2 border rounded text-sm min-w-[150px]"
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {config.categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
            </div>

            <MapContainer center={defaultCenter} zoom={8} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredNeeds.map(need => (
                    need.latitude && need.longitude ? (
                        <Marker
                            key={need.id}
                            position={[need.latitude, need.longitude]}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold text-base mb-1">{need.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{need.category}</p>
                                    <p className="text-sm mb-2 leading-tight line-clamp-2">{need.description}</p>
                                    {need.imageUrl && (
                                        <img src={need.imageUrl} alt="Foto" className="w-full h-24 object-cover rounded mb-2" />
                                    )}
                                    <div className="text-xs font-semibold text-blue-600 mb-2">
                                        {need.Donations?.length || 0} Ayudas ofrecidas
                                    </div>
                                    <a href={`/needs`} className="block w-full text-center bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700">
                                        Ver Detalle / Ayudar
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
};

export default DisasterMap;
