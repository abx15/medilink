import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    History,
    Activity,
    PlusCircle,
    CheckCircle2,
    Calendar,
    User,
    ArrowRight,
    Loader2,
    ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const ActionHistory = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await API.get('/doctor/action-history');
            if (res.data.success) {
                setActions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch action history", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Clinical Activity</h1>
                        <p className="text-slate-500 font-medium">History of patient record verifications and prescriptions</p>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center">
                            <History size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Actions</p>
                            <p className="text-xl font-black text-slate-900">{actions.length}</p>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-secondary-500" size={40} />
                    </div>
                ) : actions.length === 0 ? (
                    <div className="glass p-20 rounded-[3rem] text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <ClipboardList size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">No activity yet</h3>
                            <p className="text-slate-500">Your clinical actions will appear here once you start verifying patient records.</p>
                        </div>
                        <Link to="/doctor/verify-patient" className="btn-secondary inline-flex items-center gap-2">
                            <ArrowRight size={18} /> Start Verifying
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {actions.map((action, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={action._id}
                                className="glass p-6 rounded-3xl border-white/60 hover:border-secondary-200 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                            action.type === 'disease' ? "bg-red-50 text-red-500" :
                                                action.type === 'allergy' ? "bg-orange-50 text-orange-500" :
                                                    "bg-blue-50 text-blue-500"
                                        )}>
                                            {action.type === 'disease' ? <Activity size={24} /> :
                                                action.type === 'allergy' ? <PlusCircle size={24} /> :
                                                    <ClipboardList size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{action.type} verified</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{formatDate(action.createdAt)}</span>
                                            </div>
                                            <h4 className="font-black text-slate-800 text-lg">{action.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User size={12} className="text-slate-400" />
                                                <span className="text-xs font-bold text-secondary-600">Patient: {action.patientName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Severity</p>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                                                action.severity === 'high' ? "bg-red-100 text-red-700" :
                                                    action.severity === 'medium' ? "bg-orange-100 text-orange-700" :
                                                        "bg-green-100 text-green-700"
                                            )}>
                                                {action.severity}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>
                                </div>
                                {action.notes && (
                                    <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500 font-medium italic">
                                        "{action.notes}"
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ActionHistory;
