import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    RefreshCw,
    ShieldOff,
    ShieldCheck,
    AlertTriangle,
    QrCode,
    Shield,
    Loader2,
    Clock,
    History,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const QRManagement = () => {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchQRStatus();
    }, []);

    const fetchQRStatus = async () => {
        try {
            const res = await API.get('/user/health-card');
            setCard(res.data.healthCard);
        } catch (error) {
            console.error('Failed to load QR status');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!window.confirm('Regenerating will invalidate your old physical/digital QR code. Continue?')) return;

        setActionLoading(true);
        try {
            const res = await API.post('/user/health-card/regenerate-qr');
            if (res.data.success) {
                setCard(res.data.healthCard);
                toast.success('New QR code generated successfully!');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        const action = card.isActive ? 'disable' : 'enable';
        if (!window.confirm(`Are you sure you want to ${action} your QR access?`)) return;

        setActionLoading(true);
        try {
            const res = await API.patch('/user/health-card/toggle-status');
            if (res.data.success) {
                setCard(res.data.healthCard);
                toast.success(`QR Access ${action}d`);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-12">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">QR Security Management</h1>
                    <p className="text-slate-500">Control who can access your medical records in emergency</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* QR Preview & Status */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className={cn(
                            "relative p-6 rounded-[2.5rem] border-4 mb-8",
                            card.isActive ? "border-primary-100 bg-primary-50/10" : "border-red-100 bg-red-50/10 grayscale"
                        )}>
                            <img src={card.qrCodeImage} alt="QR Code" className="w-48 h-48" />
                            {!card.isActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[2.5rem]">
                                    <ShieldOff className="text-red-500" size={64} />
                                </div>
                            )}
                        </div>

                        <div className="text-center w-full">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase mb-4",
                                card.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {card.isActive ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                                Access is {card.isActive ? 'Active' : 'Disabled'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Current Identity QR</h3>
                            <p className="text-slate-500 text-sm">Last generated: {formatDate(card.generatedAt)}</p>
                        </div>
                    </section>

                    {/* Management Actions */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Shield className="text-primary-600" size={20} />
                                Security Controls
                            </h3>

                            <div className="space-y-4">
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={actionLoading}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                                        card.isActive
                                            ? "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                            : "border-green-100 bg-green-50 text-green-700 hover:bg-green-100"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-xl", card.isActive ? "bg-amber-200/50" : "bg-green-200/50")}>
                                            {card.isActive ? <ShieldOff size={24} /> : <ShieldCheck size={24} />}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase">{card.isActive ? 'Disable Access' : 'Enable Access'}</p>
                                            <p className="text-[10px] opacity-70">Turn off QR scanning instantly</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                    </div>
                                </button>

                                <button
                                    onClick={handleRegenerate}
                                    disabled={actionLoading}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary-200/50 rounded-xl">
                                            <RefreshCw size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase">Regenerate QR</p>
                                            <p className="text-[10px] opacity-70">Invalidate old card, create new identity</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    </div>
                                </button>
                            </div>
                        </section>

                        <section className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-amber-400" size={24} />
                                <h4 className="font-bold">Security Warning</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Regenerating your QR code will mean any physical prints of your old card will no longer work.
                                Always download the latest version after regenerating.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Scan History Placeholder */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <History className="text-slate-400" size={24} />
                            Recent Scan History
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-4">
                                <Clock className="text-slate-300" size={20} />
                                <span className="text-sm font-medium text-slate-500">Scan history is currently private. Enable audit logging in settings for full details.</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default QRManagement;
