import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import imageCompression from 'browser-image-compression';

const CreateNeed = () => {
    const { config } = useConfig();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        category: config.categories[0].id,
        description: '',
        region: '',
        commune: '',
        latitude: 0,
        longitude: 0,
        contactName: '',
        contactPhone: '',
        type: 'REQUEST' // REQUEST or OFFER
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // if (!user) block removed to allow guests


    const availableCommunes = config.locations.data.find(r => r.name === formData.region)?.subdivisions || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageToUpload = image;

            if (image) {
                const options = {
                    maxSizeMB: 0.2, // ~200KB
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                };
                try {
                    imageToUpload = await imageCompression(image, options);
                } catch (compressionErr) {
                    console.error('Compression error:', compressionErr);
                    // Fallback to original image if compression fails
                }
            }

            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (imageToUpload) data.append('image', imageToUpload);

            await api.post('/needs', data);
            showToast('Solicitud publicada con éxito', 'success');
            navigate('/needs');
        } catch (err) {
            showToast('Error al crear la solicitud', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">
                {formData.type === 'REQUEST' ? 'Solicitar Ayuda' : 'Ofrecer Ayuda / Logística'} {user ? '' : '(Invitado)'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'REQUEST' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition ${formData.type === 'REQUEST' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Necesito Ayuda
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'OFFER' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition ${formData.type === 'OFFER' ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Quiero Ayudar
                    </button>
                </div>

                {/* Guest Fields - Visible only if not logged in */}
                {!user && (
                    <div className="grid grid-cols-2 gap-4 bg-yellow-50 p-4 rounded border border-yellow-200">
                        <div className="col-span-2 text-sm text-yellow-800 font-medium mb-1">
                            👋 Estás solicitando ayuda como invitado.
                            <br />
                            Solo pediremos la información necesaria para que otras personas puedan ayudarte.
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tu Nombre <span className="text-xs text-gray-500 font-normal">(Puede ser tu nombre o un alias)</span></label>
                            <input type="text" required={!user} className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="Juan Pérez"
                                value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                                type="tel"
                                required={!user}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                placeholder="+56 9 1234 5678"
                                value={formData.contactPhone}
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9+\s-]/g, '');
                                    setFormData({ ...formData, contactPhone: val });
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-1">📱 Este número solo será visible para personas registradas que ofrezcan ayuda.</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Título Breve</label>
                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder={formData.type === 'REQUEST' ? 'Ej: Necesito agua y pañales' : 'Ej: Ofrezco transporte Chillán-Concepción'}
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {config.categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                </div>

                {formData.category === 'PETS' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado de la Mascota</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.petStatus || ''} onChange={e => setFormData({ ...formData, petStatus: e.target.value })}>
                            <option value="">Seleccione...</option>
                            <option value="SEARCHING">Mascota Perdida (Se busca)</option>
                            <option value="FOUND">Mascota Encontrada (Busca dueño)</option>
                            <option value="REUNITED">Reunificada (Caso cerrado)</option>
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Región</label>
                        <select required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value, commune: '' })}>
                            <option value="">Seleccione...</option>
                            {config.locations.data.map(r => (
                                <option key={r.name} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comuna</label>
                        <select required className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.commune} onChange={e => setFormData({ ...formData, commune: e.target.value })}
                            disabled={!formData.region}>
                            <option value="">Seleccione...</option>
                            {availableCommunes.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción Detallada</label>
                    <textarea required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder="Describe brevemente tu situación y qué necesitas. Ejemplo: cantidad aproximada, urgencia o si es para una persona o mascota."
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Foto (Opcional - Recomendado para mascotas)</label>
                    <input type="file" accept="image/*" className="mt-1 block w-full"
                        onChange={e => setImage(e.target.files[0])} />
                </div>

                <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                    ℹ️ Tu solicitud será visible públicamente. No compartas datos sensibles como RUT, dirección exacta o información bancaria en la descripción pública.
                </div>

                <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold transition ${formData.type === 'REQUEST' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                    {loading ? 'Enviando...' : (formData.type === 'REQUEST' ? 'Publicar Solicitud' : 'Publicar Ofrecimiento')}
                </button>
            </form>
        </div>
    );
};

export default CreateNeed;
