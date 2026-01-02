import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Users,
    Search,
    Stethoscope,
    ShieldCheck,
    Clock,
    UserPlus,
    Activity,
    ArrowUpRight,
    ClipboardList,
    Calendar,
    Loader2,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, cn } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        todayScans: 0,
        patientCount: 0,
        recentActions: []
    });

    useEffect(() => {
        // Only fetch if approved
        if (user.approvalStatus === 'approved') {
            fetchDoctorStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchDoctorStats = async () => {
        try {
            // Simplified stats for now
            const res = await API.get('/user/medical-record/timeline');
            setStats(prev => ({
                ...prev,
                recentActions: res.data.timeline.slice(0, 10)
            }));
        } catch (error) {
            console.error('Stats fetch failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    // Handle Unapproved State
    if (user.approvalStatus !== 'approved') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-secondary-100">
                    <div className="w-20 h-20 bg-secondary-50 text-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Verification Pending</h2>
                    <p className="text-slate-500 leading-relaxed mb-10">
                        Welcome, Dr. {user.name}! Your account is currently under review by our medical board.
                        You will receive an email/SMS once approved.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                            <Clock className="text-amber-500" size={24} />
                            <div>
                                <p className="text-xs font-black uppercase text-slate-400">Current Status</p>
                                <p className="font-bold text-slate-700 capitalize">{user.approvalStatus}</p>
                            </div>
                        </div>
                        <button onClick={() => window.location.reload()} className="btn-secondary w-full">Check Status</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="space-y-10">
                <header className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">HCP Console</h1>
                        <p className="text-slate-500 font-medium font-heading uppercase text-xs tracking-widest">Medical Professional Dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/doctor/verify-patient" className="btn bg-slate-900 text-white hover:bg-slate-800 shadow-xl px-8 flex items-center gap-2">
                            <Search size={20} /> Verify Patient Records
                        </Link>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DoctorStat title="Total Patients" value="128" icon={Users} color="purple" trend="+12%" />
                    <DoctorStat title="Pending Checks" value="09" icon={ClipboardList} color="blue" trend="-2" />
                    <DoctorStat title="Emergency Scans" value="24" icon={Activity} color="red" trend="+4" />
                    <DoctorStat title="Verified Today" value="06" icon={ShieldCheck} color="green" trend="Stable" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Recent Patient Actions */}
                    <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-slate-800">Clinical Timeline</h3>
                            <Link to="/doctor/action-history" className="text-secondary-600 font-bold text-sm tracking-tight flex items-center gap-2 hover:translate-x-1 transition-transform">
                                View Full Audit <ArrowUpRight size={18} />
                            </Link>
                        </div>

                        <div className="space-y-8 relative ml-4 border-l-2 border-secondary-50 pl-8">
                            {stats.recentActions.map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute left-[-41px] top-1 w-6 h-6 rounded-lg bg-white border-2 border-secondary-500 flex items-center justify-center text-secondary-500 shadow-sm group-hover:scale-110 transition-transform">
                                        <Activity size={12} />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 uppercase text-sm tracking-tight">{item.action.replace(/_/g, ' ')}</h4>
                                            <p className="text-slate-500 text-sm mt-1">{item.metadata?.details || 'Medical record modified'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">{formatDate(item.timestamp)}</p>
                                            <p className="text-[10px] text-secondary-500 font-bold uppercase mt-1">Confirmed</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.recentActions.length === 0 && (
                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                                    <Stethoscope className="mx-auto text-slate-300 mb-4" size={48} />
                                    <p className="text-slate-500 font-bold">No clinical activity recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Quick Access Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-secondary-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-secondary-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black mb-2">Verified Doctor</h4>
                                <p className="text-secondary-100 text-sm mb-8 opacity-80">You can officially confirm diagnoses and add prescriptions to patient cards.</p>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Reg Number</p>
                                            <p className="font-bold">{user.medicalRegistrationNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                        </div>

                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Upcoming Checks</h4>
                            <div className="space-y-4 text-center py-10">
                                <Calendar className="mx-auto text-slate-200 mb-4" size={40} />
                                <p className="text-slate-400 text-sm font-medium">No scheduled follow-ups today.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const DoctorStat = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
        purple: 'bg-purple-100 text-purple-600',
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
        green: 'bg-green-100 text-green-600'
    };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", colors[color])}>
                <Icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-slate-900">{value}</span>
                <span className={cn("text-xs font-bold", trend.startsWith('+') ? 'text-green-500' : 'text-slate-400')}>{trend}</span>
            </div>
        </div>
    );
};

export default DoctorDashboard;
