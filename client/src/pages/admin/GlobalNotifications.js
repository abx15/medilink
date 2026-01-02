import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Bell,
    Send,
    Users,
    Stethoscope,
    AlertTriangle,
    MessageSquare,
    Mail,
    Smartphone,
    Loader2,
    CheckCircle2,
    Target,
    Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { cn } from '../../utils/helpers';

const GlobalNotifications = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        target: 'all', // all, users, doctors
        channels: {
            app: true,
            email: false,
            sms: false
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/admin/broadcast-notification', {
                title: formData.title,
                message: formData.message,
                role: formData.target,
                channels: Object.keys(formData.channels).filter(k => formData.channels[k])
            });

            if (res.data.success) {
                toast.success('Broadcast sent successfully!');
                setFormData({ ...formData, title: '', message: '' });
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleChannel = (channel) => {
        setFormData({
            ...formData,
            channels: { ...formData.channels, [channel]: !formData.channels[channel] }
        });
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-10">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 font-heading flex items-center gap-3">
                        <Megaphone className="text-primary-600" size={32} />
                        Global Broadcast Center
                    </h1>
                    <p className="text-slate-500 font-medium">Dispatch notifications across the platform ecosystem</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Compose Section */}
                    <div className="lg:col-span-8">
                        <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Notification Content</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Broadcast Title (e.g. System Maintenance)"
                                        className="input-field mb-4"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Write your message here..."
                                        className="input-field resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className="pt-8 border-t border-slate-50">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-5 rounded-[2rem] shadow-xl shadow-primary-100 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                <Send size={20} /> Dispatch Now
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Targeting & Channels */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Target Selection */}
                        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                                <Target size={14} /> Target Audience
                            </h4>
                            <div className="space-y-3">
                                <TargetBtn
                                    label="Global (All Users)"
                                    active={formData.target === 'all'}
                                    onClick={() => setFormData({ ...formData, target: 'all' })}
                                    icon={Users}
                                />
                                <TargetBtn
                                    label="Citizens Only"
                                    active={formData.target === 'user'}
                                    onClick={() => setFormData({ ...formData, target: 'user' })}
                                    icon={Users}
                                />
                                <TargetBtn
                                    label="Medical HCPs Only"
                                    active={formData.target === 'doctor'}
                                    onClick={() => setFormData({ ...formData, target: 'doctor' })}
                                    icon={Stethoscope}
                                />
                            </div>
                        </section>

                        {/* Channel Selection */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Dispatch Channels</h4>
                            <div className="space-y-4">
                                <ChannelSwitch
                                    label="In-App Toast"
                                    active={formData.channels.app}
                                    onClick={() => toggleChannel('app')}
                                    icon={Bell}
                                />
                                <ChannelSwitch
                                    label="Official Email"
                                    active={formData.channels.email}
                                    onClick={() => toggleChannel('email')}
                                    icon={Mail}
                                />
                                <ChannelSwitch
                                    label="Direct SMS"
                                    active={formData.channels.sms}
                                    onClick={() => toggleChannel('sms')}
                                    icon={Smartphone}
                                />
                            </div>
                        </section>

                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex gap-4">
                            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                            <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase">
                                Broadcasts are permanent. Review content carefully before dispatching to system users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const TargetBtn = ({ label, active, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2",
            active ? "bg-white text-slate-900 border-white" : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
        )}
    >
        <div className={cn("p-2 rounded-xl", active ? "bg-primary-100 text-primary-600" : "bg-white/10")}>
            <Icon size={18} />
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
);

const ChannelSwitch = ({ label, active, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2",
            active ? "border-primary-100 bg-primary-50 text-primary-700" : "border-slate-50 bg-slate-50 text-slate-400"
        )}
    >
        <div className="flex items-center gap-4">
            <Icon size={18} />
            <span className="font-bold text-sm">{label}</span>
        </div>
        <div className={cn(
            "w-5 h-5 rounded-md flex items-center justify-center transition-colors",
            active ? "bg-primary-600 text-white" : "bg-slate-200"
        )}>
            {active && <CheckCircle2 size={14} />}
        </div>
    </button>
);

export default GlobalNotifications;
