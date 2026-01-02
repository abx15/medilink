import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Heart,
    CreditCard,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Plus,
    AlertCircle,
    CheckCircle2,
    Calendar,
    QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getSeverityColor, cn } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        healthCard: null,
        records: null,
        timeline: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [cardRes, recordRes, timelineRes] = await Promise.all([
                    API.get('/user/health-card'),
                    API.get('/user/medical-record'),
                    API.get('/user/medical-record/timeline')
                ]);

                setStats({
                    healthCard: cardRes.data.healthCard,
                    records: recordRes.data.medicalRecord,
                    timeline: timelineRes.data.timeline.slice(0, 5) // Last 5 activities
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Welcome Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">Hello, {user.name}!</h2>
                            <p className="text-slate-300 max-w-md mb-8">
                                Your medical dashboard is up to date. You have {stats.records?.diseases?.length || 0} conditions tracked and {stats.records?.allergies?.length || 0} allergies noted.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/history" className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                                    <Plus size={20} /> Add Record
                                </Link>
                                <Link to="/health-card" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors backdrop-blur-md">
                                    View Health Card
                                </Link>
                            </div>
                        </div>

                        {/* Visual background element */}
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Health ID"
                            value={user.uniqueHealthId || 'Pending'}
                            icon={CreditCard}
                            color="blue"
                            status={user.healthCardGenerated ? 'Generated' : 'Not Setup'}
                        />
                        <StatCard
                            title="Records Verified"
                            value={stats.records?.diseases?.filter(d => d.isDoctorVerified).length || 0}
                            icon={ShieldCheck}
                            color="green"
                            status="Doctor Confirmed"
                        />
                    </div>

                    {/* Verified Health Summary */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800">Verified Health Summary</h3>
                            <Link to="/history" className="text-primary-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Full Records <ArrowUpRight size={18} />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {stats.records?.diseases?.filter(d => d.isDoctorVerified).length > 0 ? (
                                stats.records.diseases.filter(d => d.isDoctorVerified).map((d, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{d.name}</h4>
                                                <p className="text-xs text-slate-500">Verified by {d.verifiedBy?.name}</p>
                                            </div>
                                        </div>
                                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", getSeverityColor(d.severity))}>
                                            {d.severity}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <AlertCircle className="mx-auto text-slate-300 mb-4" size={40} />
                                    <p className="text-slate-500 font-medium">No doctor-verified records yet.</p>
                                    <p className="text-xs text-slate-400 mt-1">Get checked by a MedLink certified doctor.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">

                    {/* Health Card Preview */}
                    <section className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-primary-200">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Digital Health ID</span>
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="mb-10">
                            <div className="text-2xl font-black tracking-tighter mb-1 uppercase">
                                {user.uniqueHealthId || 'MED-0000-0000'}
                            </div>
                            <div className="text-xs opacity-70 font-semibold">{user.name}</div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] uppercase opacity-60 font-black">Blood Group</div>
                                <div className="font-black">{user.bloodGroup || 'N/A'}</div>
                            </div>
                            <div className="bg-white p-2 rounded-xl">
                                {stats.healthCard ? (
                                    <img src={stats.healthCard.qrCodeImage} alt="QR" className="w-12 h-12" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <QrCode size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Activity Timeline */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-6 font-heading">Recent Timeline</h3>
                        <div className="space-y-6 relative ml-4 border-l-2 border-slate-50 pl-6">
                            {stats.timeline.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute left-[-33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-primary-500" />
                                    <p className="text-xs font-black text-primary-600 uppercase mb-1">{formatDate(item.timestamp)}</p>
                                    <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{item.action.replace(/_/g, ' ')}</h4>
                                    <p className="text-xs text-slate-500">{item.metadata?.name || item.metadata?.details || 'Medical record update'}</p>
                                </div>
                            ))}
                            {stats.timeline.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-4">No recent activity found.</p>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </Layout>
    );
};

const StatCard = ({ title, value, icon: Icon, color, status }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", colors[color])}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">{title}</p>
                <div className="text-xl font-black text-slate-900 leading-tight mb-1">{value}</div>
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                    <Calendar size={10} /> {status}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
