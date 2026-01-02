import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Pill,
    Activity,
    Calendar,
    Save,
    Loader2,
    X,
    FileText,
    Clock,
    AlertTriangle,
    Plus,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { cn } from '../../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';

const ManagePrescription = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patientFromSearch = location.state?.patient;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientId: patientFromSearch?._id || '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        startDate: new Date().toISOString().split('T')[0],
        instructions: '',
        isEmergency: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId) return toast.error("Please identify a patient first");

        setLoading(true);
        try {
            const res = await API.post('/doctor/add-prescription', formData);

            if (res.data.success) {
                toast.success("Prescription added successfully!");
                navigate('/doctor/verify-patient');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-10">
                <header className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Digital Prescription</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Issue verified medication orders for the patient</p>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prescribing for</span>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-8 h-8 bg-secondary-100 text-secondary-600 rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                                {patientFromSearch?.name?.charAt(0) || "P"}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">{patientFromSearch?.name || "Anonymous"}</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="glass p-10 rounded-[3rem] border-white/60 space-y-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Medication Name</label>
                                    <div className="relative">
                                        <Pill className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800"
                                            placeholder="e.g. Amoxicillin 500mg"
                                            value={formData.medicationName}
                                            onChange={e => setFormData({ ...formData, medicationName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Dosage</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800"
                                        placeholder="e.g. 1 Tablet"
                                        value={formData.dosage}
                                        onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Frequency</label>
                                    <select
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800 appearance-none"
                                        value={formData.frequency}
                                        onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Frequency</option>
                                        <option value="Once daily (QD)">Once daily (QD)</option>
                                        <option value="Twice daily (BID)">Twice daily (BID)</option>
                                        <option value="Three times daily (TID)">Three times daily (TID)</option>
                                        <option value="Four times daily (QID)">Four times daily (QID)</option>
                                        <option value="As needed (PRN)">As needed (PRN)</option>
                                        <option value="Before meals (AC)">Before meals (AC)</option>
                                        <option value="After meals (PC)">After meals (PC)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Duration</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800"
                                        placeholder="e.g. 7 Days"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Special Instructions</label>
                                    <textarea
                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-800 min-h-[100px]"
                                        placeholder="Add any specific instructions for intake..."
                                        value={formData.instructions}
                                        onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.isEmergency}
                                                onChange={e => setFormData({ ...formData, isEmergency: e.target.checked })}
                                            />
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                                                formData.isEmergency ? "bg-red-500 border-red-500" : "border-slate-200"
                                            )}>
                                                {formData.isEmergency && <Plus size={16} className="text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tight text-slate-600 group-hover:text-red-500 transition-colors">Mark as Emergency Medication</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.patientId}
                                    className="btn-secondary flex-[2] shadow-xl shadow-secondary-200"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Save size={20} /> Issue Prescription
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        {/* Summary View */}
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3 text-secondary-400">
                                    <FileText size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Prescription Mockup</span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Drug</p>
                                        <p className="text-xl font-black">{formData.medicationName || '---'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Dose</p>
                                            <p className="font-bold">{formData.dosage || '---'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">When</p>
                                            <p className="font-bold text-[10px] truncate">{formData.frequency || '---'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                    <Clock size={14} /> Issued on {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Security Warning */}
                        <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] space-y-4">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <h4 className="font-bold text-orange-800">Critical Note</h4>
                            <p className="text-xs text-orange-700 font-medium leading-relaxed">
                                You are about to issue a digital prescription that will be immediately visible to the patient.
                                Ensure dosage and frequency are double-checked for clinical accuracy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePrescription;
