import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Stethoscope, Settings, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState(null);

    const roles = [
        {
            id: 'user',
            title: 'Patient Portal',
            description: 'Access your health card, manage records and view medical history.',
            icon: Heart,
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50'
        },
        {
            id: 'doctor',
            title: 'HCP Portal',
            description: 'Verify patient records, add prescriptions and manage patient data.',
            icon: Stethoscope,
            color: 'from-purple-500 to-violet-600',
            bg: 'bg-purple-50'
        },
        {
            id: 'admin',
            title: 'Admin Console',
            description: 'Monitor system health, approve doctors and manage audit logs.',
            icon: Shield,
            color: 'from-slate-700 to-slate-900',
            bg: 'bg-slate-100'
        }
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-100/50 rounded-full blur-[120px] -z-10" />

            {/* Navbar */}
            <nav className="container mx-auto px-6 py-8 flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Plus size={24} strokeWidth={3} />
                    </div>
                    <span className="text-2xl font-heading font-extrabold text-slate-800">
                        Medi<span className="text-primary-600">Link</span>
                    </span>
                </div>
                <button
                    onClick={() => navigate('/emergency')}
                    className="text-slate-600 font-semibold hover:text-primary-600 transition-colors"
                >
                    Emergency Scan
                </button>
            </nav>

            <main className="container mx-auto px-6 pt-12 pb-24">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-bold tracking-wider uppercase mb-6 inline-block">
                            Next-Gen Health Records
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
                            Your Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Identity</span>, Redefined
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Secure, portable digital health records with instant emergency QR access.
                            Built for doctors, designed for patients.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => {
                                navigate('/login', { state: { role: role.id } });
                            }}
                            className={cn(
                                "group cursor-pointer p-8 rounded-[2rem] transition-all duration-500",
                                activeRole === role.id
                                    ? "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-105 border-2 border-primary-100"
                                    : "bg-white border-2 border-slate-50 hover:border-primary-50 shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-8 transition-transform group-hover:scale-110 duration-500 bg-gradient-to-br",
                                role.color
                            )}>
                                <role.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">{role.title}</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                {role.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-4 transition-all duration-300">
                                Enter Portal
                                <Plus size={20} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer Stats */}
            <div className="bg-slate-900 py-12 text-white">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black mb-2">1M+</div>
                        <div className="text-slate-400">Health IDs Issued</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">50k+</div>
                        <div className="text-slate-400">Verified Doctors</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">10ms</div>
                        <div className="text-slate-400">Emergency Access</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">100%</div>
                        <div className="text-slate-400">Secure & Encrypted</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Utility to merge tailwind classes safely
const cn = (...inputs) => {
    return inputs.filter(Boolean).join(' ');
};

export default Home;
