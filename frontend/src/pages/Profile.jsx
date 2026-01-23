import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Award, Heart, Loader, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../context/ConfigContext';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const { config } = useConfig();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = id === currentUser?.id || !id;
    const targetId = id || currentUser?.id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/auth/profile/${targetId}`);
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (targetId) fetchProfile();
    }, [targetId]);

    const getBadge = (count) => {
        if (count >= 15) return { label: 'Héroe de Oro', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <Award size={20} /> };
        if (count >= 5) return { label: 'Colaborador Plata', color: 'text-gray-600', bg: 'bg-gray-100', icon: <Award size={20} /> };
        if (count >= 1) return { label: 'Ayudante Bronce', color: 'text-orange-600', bg: 'bg-orange-100', icon: <Heart size={20} /> };
        return { label: 'Nuevo Miembro', color: 'text-blue-600', bg: 'bg-blue-50', icon: <User size={20} /> };
    };

    if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-red-600" /></div>;
    if (!profile) return <div className="text-center py-20">Usuario no encontrado.</div>;

    const badge = getBadge(profile.helpCount || 0);

    return (
        <div className="container mx-auto px-4 max-w-4xl py-10">
            <Helmet>
                <title>Perfil de {profile.fullName} | {config.general.appName}</title>
            </Helmet>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-red-600 to-red-800"></div>

                <div className="px-8 pb-10">
                    <div className="relative -mt-16 flex items-end gap-6 mb-8">
                        <div className="p-1 bg-white rounded-3xl shadow-lg">
                            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                <User size={64} />
                            </div>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl font-black text-gray-900">{profile.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                    {profile.role === 'VOLUNTEER' ? 'Voluntario' : 'Afectado/Civil'}
                                </span>
                                {profile.role === 'ADMIN' && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                                        <ShieldCheck size={10} /> Administrador
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Stats Column */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Reputación</h3>
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${badge.bg} ${badge.color}`}>
                                    {badge.icon}
                                    <span className="font-bold">{badge.label}</span>
                                </div>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gray-900">{profile.helpCount}</span>
                                    <span className="text-sm text-gray-500 font-bold">ayudas entregadas</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-500 text-sm">
                                    <Calendar size={18} />
                                    <span>Miembro desde {new Date(profile.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges/Achievements Area */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Insignias Comunitarias</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {profile.helpCount >= 1 && (
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                                        <Heart className="mx-auto text-orange-500 mb-2" size={32} />
                                        <p className="text-xs font-bold text-orange-900">Primer Gran Paso</p>
                                        <p className="text-[10px] text-orange-700 mt-1">Has entregado tu primera ayuda.</p>
                                    </div>
                                )}
                                {profile.helpCount >= 10 && (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                                        <ShieldCheck className="mx-auto text-blue-500 mb-2" size={32} />
                                        <p className="text-xs font-bold text-blue-900">Columna Civil</p>
                                        <p className="text-[10px] text-blue-700 mt-1">Has entregado más de 10 ayudas confirmadas.</p>
                                    </div>
                                )}
                                {profile.helpCount === 0 && (
                                    <div className="col-span-full py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 text-sm italic">Comienza a ayudar para ganar insignias y mejorar tu reputación.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
