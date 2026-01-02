import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
    Search,
    QrCode,
    User,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
    FileText,
    History,
    Activity,
    Droplet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate, getSeverityColor, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VerifyPatient = () => {
    const [searchType, setSearchType] = useState('healthId'); // healthId, qr
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [medicalRecord, setMedicalRecord] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPatient(null);
        setMedicalRecord(null);

        try {
            const endpoint = searchType === 'healthId' ? `/doctor/patient-search?healthId=${searchValue}` : `/doctor/scan-qr?token=${searchValue}`;
            const res = await API.get(endpoint);

            if (res.data.success) {
                setPatient(res.data.patient);
                setMedicalRecord(res.data.medicalRecord);
                toast.success('Patient data retrieved');
            }
        } catch (error) {
            toast.error(error.message || 'Patient not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-10">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Patient Records Verification</h1>
                    <p className="text-slate-500">Search patient by Health ID or Scan Secure QR</p>
                </header>

                {/* Search Bar */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 max-w-2xl">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                required
                                placeholder={searchType === 'healthId' ? "Enter Health ID (MED-XXXX-XXXX)" : "Paste QR Token"}
                                className="input-field pl-12"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-secondary px-8">
                            {loading ? <Loader2 className="animate-spin" /> : 'Search Records'}
                        </button>
                    </form>
                    <div className="flex gap-4 mt-4 ml-2">
                        <button
                            onClick={() => setSearchType('healthId')}
                            className={cn("text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all", searchType === 'healthId' ? "bg-secondary-100 text-secondary-600" : "text-slate-400 hover:text-slate-600")}
                        >
                            Health ID
                        </button>
                        <button
                            onClick={() => setSearchType('qr')}
                            className={cn("text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all", searchType === 'qr' ? "bg-secondary-100 text-secondary-600" : "text-slate-400 hover:text-slate-600")}
                        >
                            QR Token
                        </button>
                    </div>
                </section>

                <AnimatePresence>
                    {patient && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                        >
                            {/* Patient Profile Summary */}
                            <div className="space-y-8">
                                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase">{patient.name}</h3>
                                            <p className="text-xs text-secondary-400 font-bold">{patient.uniqueHealthId}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Age / Gender</p>
                                            <p className="font-bold">{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} • {patient.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Blood Group</p>
                                            <p className="font-bold text-red-400">{patient.bloodGroup}</p>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Emergency Contact</p>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <p className="font-bold text-sm">{patient.emergencyContact?.name || 'N/A'}</p>
                                            <p className="text-xs text-slate-400">{patient.emergencyContact?.mobile || 'No contact found'}</p>
                                        </div>
                                    </div>
                                </section>

                                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
                                    <h4 className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                                        <AlertCircle size={18} /> Verification Mode
                                    </h4>
                                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                        You are currently viewing private records authorized via {searchType === 'healthId' ? 'Direct ID Search' : 'Secure QR Scan'}.
                                    </p>
                                </div>
                            </div>

                            {/* Medical Records Section */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-2xl font-black text-slate-800">Clinical Data</h3>
                                        <div className="flex gap-4">
                                            <Link
                                                to="/doctor/update-record"
                                                state={{ patient }}
                                                className="text-sm font-bold text-secondary-600 flex items-center gap-2 hover:translate-x-1 transition-transform"
                                            >
                                                <Activity size={16} /> Update Record
                                            </Link>
                                            <Link
                                                to="/doctor/prescribe"
                                                state={{ patient }}
                                                className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:translate-x-1 transition-transform border-l border-slate-100 pl-4"
                                            >
                                                <History size={16} /> Prescribe
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Diseases */}
                                        <section>
                                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                                                <Activity size={16} /> Chronic Conditions
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {medicalRecord?.diseases?.length > 0 ? medicalRecord.diseases.map((d, i) => (
                                                    <PatientDataCard key={i} data={d} />
                                                )) : <p className="text-slate-400 text-sm font-medium italic">No diseases reported.</p>}
                                            </div>
                                        </section>

                                        {/* Allergies */}
                                        <section>
                                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                                                <Droplet size={16} /> Allergies & Reactions
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {medicalRecord?.allergies?.length > 0 ? medicalRecord.allergies.map((a, i) => (
                                                    <PatientDataCard key={i} data={a} isAllergy={true} />
                                                )) : <p className="text-slate-400 text-sm font-medium italic">No allergies reported.</p>}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

const PatientDataCard = ({ data, isAllergy = false }) => (
    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <h5 className="font-bold text-slate-800 uppercase text-sm">{data.name}</h5>
            {data.isDoctorVerified ? (
                <ShieldCheck size={18} className="text-green-500" />
            ) : (
                <AlertCircle size={18} className="text-amber-500" />
            )}
        </div>
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Severity</p>
                <p className={cn("text-xs font-bold uppercase", getSeverityColor(data.severity).split(' ')[1])}>{data.severity}</p>
            </div>
            <p className="text-[10px] font-bold text-slate-400">{formatDate(data.diagnosedDate || data.createdAt)}</p>
        </div>
    </div>
);

export default VerifyPatient;
