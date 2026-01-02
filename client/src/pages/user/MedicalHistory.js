import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Plus,
    Trash2,
    FileUp,
    CheckCircle2,
    AlertCircle,
    Search,
    Activity,
    Droplet,
    FileText,
    Clock,
    ExternalLink,
    ShieldCheck,
    Loader2,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate, getSeverityColor, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MedicalHistory = () => {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [activeTab, setActiveTab] = useState('diseases'); // diseases, allergies, reports
    const [showAddModal, setShowAddModal] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        severity: 'low',
        diagnosedDate: '',
        reaction: '' // for allergies
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRecord();
    }, []);

    const fetchRecord = async () => {
        try {
            const res = await API.get('/user/medical-record');
            setRecord(res.data.medicalRecord);
        } catch (error) {
            toast.error('Failed to load medical history');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const endpoint = activeTab === 'diseases' ? '/user/medical-record/disease' : '/user/medical-record/allergy';
            const res = await API.post(endpoint, formData);
            if (res.data.success) {
                toast.success(`${activeTab === 'diseases' ? 'Disease' : 'Allergy'} added successfully`);
                fetchRecord();
                setShowAddModal(false);
                setFormData({ name: '', severity: 'low', diagnosedDate: '', reaction: '' });
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Convert to base64 for backend (Cloudinary utility expects this or buffer)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            setSubmitting(true);
            try {
                const res = await API.post('/user/medical-record/upload-report', {
                    file: reader.result,
                    reportName: file.name.split('.')[0],
                    category: 'lab_report'
                });
                if (res.data.success) {
                    toast.success('Medical report uploaded successfully');
                    fetchRecord();
                }
            } catch (error) {
                toast.error('Failed to upload report');
            } finally {
                setSubmitting(false);
            }
        };
    };

    const handleDeleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            const res = await API.delete(`/user/medical-record/report/${reportId}`);
            if (res.data.success) {
                toast.success('Report deleted');
                fetchRecord();
            }
        } catch (error) {
            toast.error('Failed to delete report');
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    return (
        <Layout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Medical History</h1>
                        <p className="text-slate-500">Manage your verified data and self-reported conditions</p>
                    </div>
                    <div className="flex gap-4">
                        <label className="btn-secondary cursor-pointer flex items-center gap-2 shadow-lg hover:translate-y-[-2px] transition-all">
                            <FileUp size={20} />
                            {submitting ? 'Uploading...' : 'Upload Report'}
                            <input type="file" className="hidden" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.pdf" />
                        </label>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary flex items-center gap-2 shadow-lg hover:translate-y-[-2px] transition-all"
                        >
                            <Plus size={20} /> Add Record
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
                    {[
                        { id: 'diseases', label: 'Conditions', icon: Activity },
                        { id: 'allergies', label: 'Allergies', icon: Droplet },
                        { id: 'reports', label: 'Reports', icon: FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all",
                                activeTab === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'diseases' && (
                            <motion.div
                                key="diseases" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {record?.diseases?.length > 0 ? record.diseases.map((d, i) => (
                                    <DataCard key={i} data={d} type="disease" />
                                )) : <EmptyState message="No medical conditions reported yet." />}
                            </motion.div>
                        )}

                        {activeTab === 'allergies' && (
                            <motion.div
                                key="allergies" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {record?.allergies?.length > 0 ? record.allergies.map((a, i) => (
                                    <DataCard key={i} data={a} type="allergy" />
                                )) : <EmptyState message="No allergies reported yet." />}
                            </motion.div>
                        )}

                        {activeTab === 'reports' && (
                            <motion.div
                                key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {record?.uploadedReports?.length > 0 ? record.uploadedReports.map((report, i) => (
                                        <div key={i} className="group glass border-slate-100 p-4 rounded-[2rem] relative overflow-hidden">
                                            <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300">
                                                {report.fileType === 'pdf' ? <FileText size={48} /> : <img src={report.url} className="w-full h-full object-cover rounded-2xl" alt="" />}
                                            </div>
                                            <h5 className="font-bold text-slate-800 truncate mb-1">{report.reportName}</h5>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">{formatDate(report.uploadedAt)}</p>

                                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={report.url} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform">
                                                    <ExternalLink size={20} />
                                                </a>
                                                <button onClick={() => handleDeleteReport(report._id)} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : <div className="col-span-full"><EmptyState message="No medical reports uploaded." /></div>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
                            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                                <Plus size={32} className="rotate-45" />
                            </button>
                            <h3 className="text-2xl font-black text-slate-900 mb-8">Add New {activeTab === 'diseases' ? 'Condition' : 'Allergy'}</h3>
                            <form onSubmit={handleAddRecord} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Condition Name</label>
                                    <input
                                        type="text" required className="input-field" placeholder="e.g. Asthma, Diabetes"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Severity</label>
                                        <select
                                            className="input-field" value={formData.severity}
                                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase">{activeTab === 'diseases' ? 'Diagnosed' : 'Last Seen'}</label>
                                        <input
                                            type="date" className="input-field"
                                            value={formData.diagnosedDate} onChange={(e) => setFormData({ ...formData, diagnosedDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {activeTab === 'allergies' && (
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Typical Reaction</label>
                                        <input
                                            type="text" className="input-field" placeholder="e.g. Rashes, Breathing difficulty"
                                            value={formData.reaction} onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                                        />
                                    </div>
                                )}
                                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-primary-200">
                                    {submitting ? <Loader2 className="animate-spin" /> : `Save ${activeTab === 'diseases' ? 'Condition' : 'Allergy'}`}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const DataCard = ({ data, type }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase border", getSeverityColor(data.severity))}>
                {data.severity}
            </div>
            {data.isDoctorVerified ? (
                <div className="text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold border border-green-100">
                    <ShieldCheck size={14} /> VERIFIED
                </div>
            ) : (
                <div className="text-amber-500 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold border border-amber-100">
                    <Clock size={14} /> PENDING
                </div>
            )}
        </div>

        <h4 className="text-xl font-bold text-slate-900 mb-2">{data.name}</h4>

        <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar size={14} className="text-slate-400" />
                {type === 'disease' ? 'Diagnosed: ' : 'Found: '} {formatDate(data.diagnosedDate || data.createdAt)}
            </div>
            {type === 'allergy' && data.reaction && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <AlertCircle size={14} className="text-slate-400" />
                    Reaction: {data.reaction}
                </div>
            )}
        </div>

        {data.isDoctorVerified && data.verifiedBy && (
            <div className="mt-6 pt-4 border-t border-slate-50 text-[10px]">
                <p className="text-slate-400 font-bold uppercase mb-1">Clinic Verification</p>
                <p className="text-slate-700 font-black tracking-tight">{data.verifiedBy.name} • {formatDate(data.verifiedAt)}</p>
            </div>
        )}
    </div>
);

const EmptyState = ({ message }) => (
    <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center w-full">
        <Activity className="mx-auto text-slate-300 mb-4" size={48} />
        <p className="text-slate-500 font-bold">{message}</p>
        <p className="text-xs text-slate-400 mt-1">Use the "Add Record" button above to get started.</p>
    </div>
);

export default MedicalHistory;
