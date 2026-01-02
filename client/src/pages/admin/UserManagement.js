import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Shield,
    ShieldAlert,
    Activity,
    Mail,
    Phone,
    Loader2,
    Trash2,
    ArrowRight,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditLogs = async (userId) => {
        try {
            // Placeholder: In real app, we fetch logs for specific user
            const res = await API.get(`/user/medical-record/timeline`);
            setAuditLogs(res.data.timeline.slice(0, 10));
        } catch (error) {
            console.error('Failed to fetch logs');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchAuditLogs(user._id);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.uniqueHealthId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    return (
        <Layout>
            <div className="space-y-10">
                <header className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">User Directory</h1>
                        <p className="text-slate-500 font-medium tracking-tight">System-wide monitoring of {users.length} registered citizens</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* User List Table */}
                    <div className="lg:col-span-8 space-y-6">
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden">
                            <div className="mb-8 relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name or Health ID..."
                                    className="input-field pl-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">
                                            <th className="pb-6 pl-4">Citizen Identity</th>
                                            <th className="pb-6">Contact / Security</th>
                                            <th className="pb-6">Last Activity</th>
                                            <th className="pb-6 pr-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleUserClick(user)}>
                                                <td className="py-6 pl-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-black">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                                                            <p className="text-[10px] font-black text-primary-500">{user.uniqueHealthId}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <p className="text-xs font-bold text-slate-600">{user.mobile}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                                                </td>
                                                <td className="py-6">
                                                    <p className="text-xs font-black text-slate-500">{formatDate(user.updatedAt)}</p>
                                                    <p className="text-[10px] text-green-500 font-bold uppercase">Active</p>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                                                        <MoreVertical size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Detailed User Sidebar & Audit */}
                    <div className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            {selectedUser ? (
                                <motion.div
                                    key={selectedUser._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                                                    <Shield size={32} />
                                                </div>
                                                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                    Verified
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase mb-2">{selectedUser.name}</h3>
                                            <p className="text-slate-400 text-sm mb-10">{selectedUser.uniqueHealthId}</p>

                                            <div className="space-y-4">
                                                <InfoLine icon={Mail} text={selectedUser.email} />
                                                <InfoLine icon={Phone} text={selectedUser.mobile} />
                                                <InfoLine icon={History} text={`Member since ${formatDate(selectedUser.createdAt)}`} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-primary-600/20 blur-[60px] rounded-full" />
                                    </section>

                                    <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                            <Activity size={18} /> Audit Trails
                                        </h4>
                                        <div className="space-y-6 relative ml-3 border-l-2 border-slate-50 pl-6">
                                            {auditLogs.map((log, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute left-[-31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-500" />
                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{log.action.replace(/_/g, ' ')}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-1">{formatDate(log.timestamp)}</p>
                                                </div>
                                            ))}
                                            {auditLogs.length === 0 && <p className="text-xs text-slate-400 italic">No recent logs found.</p>}
                                        </div>
                                        <button className="w-full mt-8 text-center text-xs font-black text-primary-600 uppercase hover:underline">
                                            Download Full Audit CSV
                                        </button>
                                    </section>
                                </motion.div>
                            ) : (
                                <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <div className="text-center p-8">
                                        <Users className="mx-auto text-slate-200 mb-4" size={48} />
                                        <p className="text-slate-400 font-bold">Select a citizen to view security profile & audit logs</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const InfoLine = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-500" />
        <span className="text-sm font-medium text-slate-300">{text}</span>
    </div>
);

export default UserManagement;
