import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope,
    User,
    Mail,
    Phone,
    FileText,
    Upload,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Briefcase,
    GraduationCap,
    Building2,
    Lock,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const DoctorRegister = () => {
    const navigate = useNavigate();
    const { register, verifyOTP } = useAuth();

    const [step, setStep] = useState(1); // 1: Basic, 2: Professional, 3: Documents, 4: OTP
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        specialization: '',
        experience: '',
        hospitalName: '', // Backend expects hospitalName
        hospitalAddress: 'N/A', // Placeholder
        medicalRegistrationNumber: '',
        governmentId: '',
        medicalCertificate: '',
        registrationCertificate: ''
    });
    const [otp, setOtp] = useState('');

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                [field]: reader.result
            }));
            toast.success(`${field.replace(/([A-Z])/g, ' $1')} ready for upload`);
        };
    };

    const handleDoctorRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await register(formData, 'doctor');
            if (res.success) {
                toast.success('HCP Registration initiated. Verification code sent!');
                setStep(4);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOTP({
                email: formData.email,
                otp: otp,
                purpose: 'registration'
            });

            if (res.success) {
                toast.success('Identity verified! Your application is now with the Medical Board.');
                navigate('/login', { state: { role: 'doctor' } });
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "input-field pl-12 bg-white/60 focus:bg-white transition-all";
    const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-6 py-12 overflow-hidden">
            {/* HCP Specific Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary-50/40 to-primary-50/40 -z-10" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary-200/20 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 text-secondary-600">
                        <div className="w-14 h-14 bg-secondary-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-secondary-200">
                            <Stethoscope size={32} />
                        </div>
                        <span className="text-2xl font-heading font-extrabold text-slate-800">
                            Medi<span className="text-secondary-600">Link</span> <span className="text-slate-400 font-light">HCP</span>
                        </span>
                    </Link>
                    <h2 className="text-4xl font-black text-slate-900 mb-2">Partner Application</h2>
                    <div className="flex items-center justify-center gap-3">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                step >= s ? "w-8 bg-secondary-600" : "w-4 bg-slate-200"
                            )} />
                        ))}
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3.5rem] border-white/80 shadow-2xl shadow-secondary-100/30">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="d-step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                                onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Legal Name (As on Degree)</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="text" required placeholder="Dr. Jane Smith" className={inputClasses} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Professional Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="email" required placeholder="jane.smith@hospital.com" className={inputClasses} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="tel" required placeholder="+91 XXXX XXX XXX" className={inputClasses} value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Security Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="password" required placeholder="Minimum 8 characters" className={inputClasses} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn-secondary w-full h-14 rounded-2xl group font-black uppercase text-xs tracking-widest shadow-xl shadow-secondary-100">
                                    Continue to Credentials <ArrowRight size={18} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="d-step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                                onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Specialization</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="text" required placeholder="Cardiology, Neuro, etc." className={inputClasses} value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Experience</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="number" required placeholder="Years" className={inputClasses} value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Primary Practice (Hospital/Clinic)</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="text" required placeholder="e.g. Apollo Hospitals" className={inputClasses} value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>MCI/State Council Registration #</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input type="text" required className={inputClasses} placeholder="Valid Medical Registration ID" value={formData.medicalRegistrationNumber} onChange={e => setFormData({ ...formData, medicalRegistrationNumber: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} type="button" className="btn-outline flex-1 rounded-2xl h-14 font-black text-[10px] uppercase">Back</button>
                                    <button type="submit" className="btn-secondary flex-[2] rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-xl shadow-secondary-100">Upload Documents</button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="d-step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                                onSubmit={handleDoctorRegister} className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <FileUploadField
                                        label="Government ID"
                                        field="governmentId"
                                        uploaded={!!formData.governmentId}
                                        onChange={handleFileChange}
                                    />
                                    <FileUploadField
                                        label="Medical Degree"
                                        field="medicalCertificate"
                                        uploaded={!!formData.medicalCertificate}
                                        onChange={handleFileChange}
                                    />
                                    <FileUploadField
                                        label="Registration Cert"
                                        field="registrationCertificate"
                                        uploaded={!!formData.registrationCertificate}
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} type="button" className="btn-outline flex-1 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest">Back</button>
                                    <button type="submit" disabled={loading} className="btn-secondary flex-[2] rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-xl shadow-secondary-100">
                                        {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : 'Initial Application'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 4 && (
                            <motion.form
                                key="d-step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                onSubmit={handleVerify} className="space-y-10"
                            >
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                                        <ShieldCheck size={44} />
                                    </div>
                                    <p className="text-slate-600 font-medium px-8">
                                        HCP verification code sent to <br />
                                        <span className="text-slate-900 font-black tracking-wider">{formData.mobile}</span>
                                    </p>
                                </div>
                                <input
                                    type="text" required maxLength={6} placeholder="0 0 0 0 0 0"
                                    className="input-field text-center tracking-[0.6em] font-mono text-3xl h-20 bg-white/50 border-2 focus:border-secondary-500 rounded-2xl"
                                    value={otp} onChange={e => setOtp(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" disabled={loading} className="btn-secondary w-full h-16 rounded-2xl shadow-xl shadow-secondary-200 font-black uppercase text-xs tracking-[0.2em]">
                                    {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : 'Complete Verification'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-10 border-t border-slate-100/50 text-center">
                        <p className="text-slate-500 font-medium pb-2 text-sm">
                            Already a verified partner?
                        </p>
                        <Link to="/login" className="text-secondary-600 font-black hover:underline uppercase tracking-[0.2em] text-[10px]">
                            Secure Portal Access
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const FileUploadField = ({ label, field, uploaded, onChange }) => (
    <div className={cn(
        "relative group border-2 border-dashed rounded-[1.5rem] p-5 transition-all",
        uploaded ? "border-green-200 bg-green-50/30" : "border-slate-100 hover:border-secondary-300 bg-white"
    )}>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    uploaded ? "bg-green-100 text-green-600" : "bg-slate-50 text-slate-400 group-hover:text-secondary-500 group-hover:bg-secondary-50"
                )}>
                    {uploaded ? <CheckCircle2 size={24} /> : <Upload size={20} />}
                </div>
                <div>
                    <h5 className="font-black text-slate-800 text-[10px] uppercase tracking-wider">{label}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{uploaded ? 'Ready' : 'JPG/PNG/PDF'}</p>
                </div>
            </div>
            <label className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all",
                uploaded ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-100 text-slate-600 hover:bg-secondary-600 hover:text-white"
            )}>
                {uploaded ? 'Change' : 'Upload'}
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => onChange(e, field)} />
            </label>
        </div>
    </div>
);

export default DoctorRegister;
