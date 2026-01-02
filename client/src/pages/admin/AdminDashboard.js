import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Users,
    Stethoscope,
    ShieldAlert,
    Activity,
    TrendingUp,
    ArrowUpRight,
    Search,
    UserCheck,
    AlertTriangle,
    Clock,
    Database,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        pendingApprovals: 0,
        activeCriticals: 0,
        systemHealth: 'Optimal',
        recentActivity: []
    });

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            // In a real app, we'd have a specific admin stats endpoint
            const [usersRes, doctorsRes] = await Promise.all([
                API.get('/admin/users'), // This is an assumption based on existing routes
                API.get('/admin/doctors')
            ]);

            const docs = doctorsRes.data.doctors;
            setStats({
                totalUsers: usersRes.data.users.length,
                totalDoctors: docs.length,
                pendingApprovals: docs.filter(d => d.approvalStatus === 'pending').length,
                activeCriticals: 12, // Dummy for UI
                systemHealth: 'Optimal',
                recentActivity: []
            });
        } catch (error) {
            console.error('Admin stats fetch failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    return (
        <Layout>
            <div className="space-y-10">
                <header className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Central Command</h1>
                        <p className="text-slate-500 font-medium font-heading uppercase text-xs tracking-widest flex items-center gap-2">
                            <Globe size={14} className="text-primary-600" /> Global Health Infrastructure
                        </p>
                    </div>
                </header>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AdminStat title="Registered Citizens" value={stats.totalUsers} icon={Users} color="blue" />
                    <AdminStat title="Medical Partners" value={stats.totalDoctors} icon={Stethoscope} color="purple" />
                    <AdminStat title="Pending Verification" value={stats.pendingApprovals} icon={UserCheck} color="amber" highlight={stats.pendingApprovals > 0} />
                    <AdminStat title="Critical Alerts" value={stats.activeCriticals} icon={ShieldAlert} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* System Monitoring */}
                    <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <Database className="text-primary-600" size={24} />
                                Infrastructure Health
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
                                <Activity size={12} className="animate-pulse" /> Live System
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <HealthMetric label="API Gateway" status="Operational" latency="42ms" />
                            <HealthMetric label="Database Cluster" status="Optimal" latency="12ms" />
                            <HealthMetric label="Notification Node" status="Operational" latency="88ms" />
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Recent System Events</h4>
                            <div className="space-y-4">
                                <SystemEvent type="user" desc="New citizen registration verified" time="2m ago" />
                                <SystemEvent type="doctor" desc="Dr. Sarah Smith requested credential review" time="15m ago" />
                                <SystemEvent type="emergency" desc="Critical record access in Zone 4" time="1h ago" />
                            </div>
                        </div>
                    </section>

                    {/* Quick Controls */}
                    <div className="space-y-8">
                        <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black mb-6">Verification Queue</h4>
                                <p className="text-slate-400 text-sm mb-8">There are <strong>{stats.pendingApprovals}</strong> medical professionals waiting for license verification.</p>
                                <button className="w-full btn-primary bg-white text-slate-900 hover:bg-slate-100 py-4 shadow-xl">
                                    Open Review Queue
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px] rounded-full" />
                        </section>

                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Global Announcements</h4>
                            <div className="space-y-4">
                                <button className="w-full p-4 rounded-3xl bg-primary-50 text-left border-l-4 border-primary-500 hover:bg-primary-100 transition-colors">
                                    <p className="font-bold text-primary-900 text-sm mb-1 uppercase tracking-tight">System Update v2.4</p>
                                    <p className="text-[10px] text-primary-700 font-medium">Coming next week. Security patches included.</p>
                                </button>
                                <button className="w-full text-center py-2 text-xs font-black text-slate-400 uppercase hover:text-primary-600 transition-colors">
                                    Create Announcement
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const AdminStat = ({ title, value, icon: Icon, color, highlight }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600'
    };
    return (
        <div className={cn(
            "bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all hover:shadow-lg",
            highlight ? "border-amber-200 ring-4 ring-amber-50" : "border-slate-100"
        )}>
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
                <Icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-slate-900">{value}</span>
                <TrendingUp size={20} className="text-green-500 mb-1" />
            </div>
        </div>
    );
};

const HealthMetric = ({ label, status, latency }) => (
    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter">{label}</p>
        <div className="flex justify-between items-end">
            <div>
                <p className="font-black text-slate-800">{status}</p>
                <p className="text-[10px] font-bold text-green-500 uppercase">{latency}</p>
            </div>
            <Activity size={20} className="text-secondary-100" strokeWidth={3} />
        </div>
    </div>
);

const SystemEvent = ({ type, desc, time }) => {
    const icons = {
        user: <Users size={14} />,
        doctor: <Stethoscope size={14} />,
        emergency: <AlertTriangle size={14} />
    };
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                    {icons[type]}
                </div>
                <p className="text-sm font-medium text-slate-700">{desc}</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{time}</span>
        </div>
    );
};

export default AdminDashboard;
