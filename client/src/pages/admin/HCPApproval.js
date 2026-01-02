import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
    CheckCircle2,
    XCircle,
    Eye,
    User,
    FileText,
    Stethoscope,
    ArrowRight,
    Download,
    Loader2,
    AlertCircle,
    Clock,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const HCPApproval = () => {
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const fetchPendingDoctors = async () => {
        try {
            const res = await API.get('/admin/doctors');
            // Filter pending and potentially others for management
            setDoctors(res.data.doctors);
        } catch (error) {
            toast.error('Failed to load doctor applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this medical professional?`)) return;

        setActionLoading(true);
        try {
            const res = await API.patch(`/admin/verify-doctor/${id}`, { status });
            if (res.data.success) {
                toast.success(`HCP ${status}ed successfully`);
                fetchPendingDoctors();
                setSelectedDoctor(null);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    const pendingCount = doctors.filter(d => d.approvalStatus === 'pending').length;

    return (
        <Layout>
            <div className="space-y-10">
                <header>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-black text-slate-900">Credential Verification</h1>
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            {pendingCount} Pending Review
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium">Audit and approve medical professional registrations</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* List of Applications */}
                    <div className="lg:col-span-4 space-y-4">
                        {doctors.map((doctor) => (
                            <button
                                key={doctor._id}
                                onClick={() => setSelectedDoctor(doctor)}
                                className={cn(
                                    "w-full text-left p-6 rounded-[2rem] border-2 transition-all group",
                                    selectedDoctor?._id === doctor._id
                                        ? "border-primary-500 bg-primary-50 ring-4 ring-primary-50"
                                        : "border-slate-100 bg-white hover:border-slate-300"
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                                        doctor.approvalStatus === 'approved' ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                                    )}>
                                        <Stethoscope size={24} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                                        doctor.approvalStatus === 'approved' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {doctor.approvalStatus}
                                    </span>
                                </div>
                                <h4 className="font-black text-slate-800 uppercase tracking-tight mb-1">{doctor.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{doctor.specialization} • {doctor.experience}Y Exp</p>
                                <div className="mt-4 flex items-center text-[10px] font-black text-slate-400 uppercase gap-2">
                                    <Clock size={12} /> Registered {formatDate(doctor.createdAt)}
                                </div>
                            </button>
                        ))}

                        {doctors.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <User className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 font-bold">No applications found.</p>
                            </div>
                        )}
                    </div>

                    {/* Verification Details */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {selectedDoctor ? (
                                <motion.div
                                    key={selectedDoctor._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                                        <div className="flex gap-6">
                                            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                                                <User size={48} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase">{selectedDoctor.name}</h2>
                                                <p className="text-primary-600 font-bold text-lg mb-4">{selectedDoctor.specialization}</p>
                                                <div className="flex gap-4">
                                                    <span className="text-xs font-black text-slate-400 uppercase">Reg: {selectedDoctor.medicalRegistrationNumber}</span>
                                                    <span className="text-xs font-black text-slate-400 uppercase">Hosp: {selectedDoctor.hospital}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedDoctor.approvalStatus === 'pending' && (
                                            <div className="flex gap-4 h-fit">
                                                <button
                                                    onClick={() => handleApproval(selectedDoctor._id, 'rejected')}
                                                    disabled={actionLoading}
                                                    className="btn border-red-100 bg-red-50 text-red-600 hover:bg-red-100 px-6"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(selectedDoctor._id, 'approved')}
                                                    disabled={actionLoading}
                                                    className="btn-primary shadow-xl shadow-primary-100 px-10"
                                                >
                                                    {actionLoading ? <Loader2 className="animate-spin" /> : 'Approve Access'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Document Grid */}
                                    <section>
                                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-8 flex items-center gap-3">
                                            <FileText size={18} /> Credentials & License Documents
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DocCard
                                                title="Govt Identity Proof"
                                                type="AADHAAR / PAN"
                                                url={selectedDoctor.documents?.governmentId}
                                            />
                                            <DocCard
                                                title="Medical Degree"
                                                type="MBBS / MD / MS"
                                                url={selectedDoctor.documents?.medicalCertificate}
                                            />
                                            <DocCard
                                                title="License Document"
                                                type="MCI / STATE REG"
                                                url={selectedDoctor.documents?.registrationCertificate}
                                            />
                                        </div>
                                    </section>

                                    <div className="mt-12 bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex gap-6">
                                        <AlertCircle className="text-amber-600 shrink-0" size={28} />
                                        <div>
                                            <h4 className="font-bold text-amber-900 mb-2">Audit Reminder</h4>
                                            <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                                Please cross-verify the registration number with the National Health Authority database before approval.
                                                Once approved, the doctor will have full access to patient health records.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full min-h-[500px] flex items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                                            <Eye size={40} />
                                        </div>
                                        <p className="text-slate-500 font-bold">Select an application to review details</p>
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

const DocCard = ({ title, type, url }) => (
    <div className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-100 hover:border-primary-100 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h4 className="font-black text-slate-800 text-sm">{title}</h4>
                <p className="text-[10px] text-primary-600 font-bold uppercase">{type}</p>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary-500 transition-colors">
                <FileText size={20} />
            </div>
        </div>

        {url ? (
            <div className="space-y-4">
                <div className="aspect-video bg-white rounded-2xl border border-slate-200 overflow-hidden relative group/img">
                    {url.startsWith('data:image') ? (
                        <img src={url} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <FileText size={32} />
                            <p className="text-[10px] font-bold mt-2">DOCK VIEW NOT AVAILABLE</p>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity gap-4">
                        <a href={url} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-24 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center text-red-400">
                <AlertCircle size={24} />
            </div>
        )}
    </div>
);

export default HCPApproval;
