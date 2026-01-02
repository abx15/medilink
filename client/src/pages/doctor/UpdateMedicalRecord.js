import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Plus,
    Activity,
    Droplet,
    AlertCircle,
    Calendar,
    ShieldCheck,
    Save,
    Loader2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { cn } from '../../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateMedicalRecord = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patientFromSearch = location.state?.patient;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientId: patientFromSearch?._id || '',
        name: '',
        type: 'disease', // disease, allergy
        severity: 'low',
        diagnosedDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId) return toast.error("Please identify a patient first");

        setLoading(true);
        try {
            const endpoint = formData.type === 'disease'
                ? '/doctor/update-patient-disease'
                : '/doctor/update-patient-allergy';

            const res = await API.post(endpoint, {
                patientId: formData.patientId,
                [formData.type]: {
                    name: formData.name,
                    severity: formData.severity,
                    diagnosedDate: formData.diagnosedDate,
                    isDoctorVerified: true
                }
            });

            if (res.data.success) {
                toast.success(`${formData.type === 'disease' ? 'Disease' : 'Allergy'} updated successfully!`);
                navigate('/doctor/verify-patient');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-10">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Update Patient Record</h1>
                    <p className="text-slate-500">Add verified diagnosis or allergy to patient card</p>
                </header>

                <div className="glass p-10 rounded-[3rem] border-white/60">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Patient Selection (Read Only if from state) */}
                        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Target Patient</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{patientFromSearch?.name || "No Patient Selected"}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{patientFromSearch?.uniqueHealthId || "Search for a patient from the verification portal first."}</p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tight">Record Type</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'disease' })}
                                        className={cn(
                                            "flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all font-bold",
                                            formData.type === 'disease' ? "border-secondary-500 bg-secondary-50 text-secondary-600" : "border-slate-100 text-slate-400"
                                        )}
                                    >
                                        <Activity size={20} /> Disease
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'allergy' })}
                                        className={cn(
                                            "flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all font-bold",
                                            formData.type === 'allergy' ? "border-secondary-500 bg-secondary-50 text-secondary-600" : "border-slate-100 text-slate-400"
                                        )}
                                    >
                                        <Droplet size={20} /> Allergy
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tight">Condition Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Hypertension, Penicillin Allergy..."
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tight">Severity Level</label>
                                <select
                                    className="input-field"
                                    value={formData.severity}
                                    onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                >
                                    <option value="low">Low - Monitor</option>
                                    <option value="medium">Medium - Treatment Required</option>
                                    <option value="high">High - Critical/Emergent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-tight">Diagnosed Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.diagnosedDate}
                                    onChange={e => setFormData({ ...formData, diagnosedDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-outline flex-1"
                            >
                                <X size={20} className="mr-2" /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.patientId}
                                className="btn-secondary flex-[2] shadow-xl shadow-secondary-100"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Save size={20} /> Save Verified Record
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-primary-50 border border-primary-100 p-8 rounded-[3rem] flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-primary-800 mb-2">Immutable & Verified</h4>
                        <p className="text-xs text-primary-700 leading-relaxed font-medium">
                            Records added by you will appear as <strong>Verified</strong> on the patient's card.
                            This information is critical for emergency responders and cannot be altered by the patient.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateMedicalRecord;
