import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', role: 'AFFECTED' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Error al registrar. Intente nuevamente.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" required className="mt-1 block w-full border p-2 rounded"
                        value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" required className="mt-1 block w-full border p-2 rounded"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="text" className="mt-1 block w-full border p-2 rounded"
                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Soy principalmente:</label>
                    <select className="mt-1 block w-full border p-2 rounded"
                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="AFFECTED">Afectado (Necesito ayuda)</option>
                        <option value="VOLUNTEER">Voluntario</option>
                        <option value="DONOR">Donante</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" required className="mt-1 block w-full border p-2 rounded"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
