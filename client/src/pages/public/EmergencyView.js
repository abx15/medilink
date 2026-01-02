import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Search,
    User,
    Droplet,
    FileWarning,
    Phone,
    CheckCircle2,
    Loader2,
    Lock,
    Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';

const EmergencyView = () => {
    const [qrToken, setQrToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!qrToken) return;

        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/emergency/scan-qr', { token: qrToken });
            if (res.data.success) {
                setPatientData(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired QR token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
            <div className="max-w-2xl mx-auto space-y-10 py-12">
                <header className="text-center">
                    <div className="inline-flex items-center gap-3 bg-red-500/20 text-red-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-red-500/30">
                        <ShieldAlert size={16} /> Emergency Access Portal
                    </div>
                    <h1 className="text-4xl font-black mb-4">Critical Health Data</h1>
                    <p className="text-slate-400 font-medium">Scan QR token to retrieve doctor-verified life-saving information.</p>
                </header>

                {!patientData ? (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl"
                    >
                        <form onSubmit={handleScan} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Input QR Secure Token</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Paste emergency token here..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono text-sm"
                                        value={qrToken}
                                        onChange={(e) => setQrToken(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Retrieve Records <Lock size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}
                    </motion.section>
                ) : (
                    <div className="space-y-8">
                        {/* Patient Summary Card */}
                        <motion.section
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[3rem] p-10 text-slate-900 shadow-2xl overflow-hidden relative"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex gap-6">
                                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                                            <User size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black uppercase leading-tight mb-1">{patientData.name}</h2>
                                            <div className="flex items-center gap-2 text-primary-600 font-black text-xs uppercase tracking-tighter">
                                                <Droplet size={14} className="text-red-500" /> Blood Group: {patientData.bloodGroup}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase">
                                        <CheckCircle2 size={14} /> Verified Data
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Critical Conditions */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <ShieldAlert size={14} className="text-red-500" /> Critical Conditions
                                        </h4>
                                        <div className="space-y-3">
                                            {patientData.verifiedDiseases?.length > 0 ? patientData.verifiedDiseases.map((d, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-200" />
                                                    <span className="font-bold text-sm">{d.name}</span>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-400 font-medium italic">No critical conditions reported.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Severe Allergies */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <FileWarning size={14} className="text-orange-500" /> Severe Allergies
                                        </h4>
                                        <div className="space-y-3">
                                            {patientData.verifiedAllergies?.length > 0 ? patientData.verifiedAllergies.map((a, i) => (
                                                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-200" />
                                                    <span className="font-bold text-sm">{a.name}</span>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-400 font-medium italic">No severe allergies recorded.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="mt-12 pt-10 border-t border-slate-100">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Emergency Contact</p>
                                            <p className="text-xl font-black text-slate-900">{patientData.emergencyContact?.name} • <span className="text-primary-600">{patientData.emergencyContact?.mobile}</span></p>
                                        </div>
                                        <a
                                            href={`tel:${patientData.emergencyContact?.mobile}`}
                                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 transition-transform"
                                        >
                                            <Phone size={18} /> Call Now
                                        </a>
                                    </div>
                                </div>

                                {/* Verified By */}
                                <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                    <Stethoscope size={14} /> Verified by Dr. {patientData.lastVerifiedBy || 'Medical Council Authority'} • {formatDate(patientData.lastVerifiedAt)}
                                </div>
                            </div>
                        </motion.section>

                        <button
                            onClick={() => setPatientData(null)}
                            className="w-full text-center text-slate-500 font-bold uppercase text-xs hover:text-white transition-colors"
                        >
                            Back to Scan
                        </button>
                    </div>
                )}

                <footer className="text-center pt-20 border-t border-white/5 opacity-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">MedLink Secure Critical Infrastructure</p>
                </footer>
            </div>
        </div>
    );
};

export default EmergencyView;
