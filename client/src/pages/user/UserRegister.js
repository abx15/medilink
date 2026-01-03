import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, Loader2, CheckCircle2, Calendar, MapPin, Droplet, Lock, ShieldCheck, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserRegister = () => {
    const navigate = useNavigate();
    const { register, verifyOTP, login, resendOTP } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        address: {
            city: '',
            state: ''
        }
    });
    const [otp, setOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setLoading(true);
        try {
            const res = await resendOTP({
                email: formData.email,
                mobile: formData.mobile,
                purpose: 'registration'
            });
            if (res.success) {
                toast.success('Access code re-issued.');
                setResendCooldown(60);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to dispatch code');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        // Simple validation check before proceeding
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.mobile) return toast.warning('Missing vital information');
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await register(formData, 'user');
            if (res.success) {
                toast.success('Registration Initiated.');
                setResendCooldown(60);
                setStep(3);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Network failure during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndLogin = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return toast.warning('6-digit code required');
        setLoading(true);
        try {
            const res = await verifyOTP({
                email: formData.email,
                otp: otp,
                purpose: 'registration'
            });

            if (res.success) {
                const loginRes = await login({
                    email: formData.email,
                    password: formData.password
                }, 'user');

                if (loginRes.success) {
                    toast.success('Identity Activated. Welcome to MedLink.');
                    navigate('/dashboard');
                } else {
                    toast.error('Identity verified, but login failed. Please sign in manually.');
                    navigate('/login');
                }
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: step >= s ? '#0f172a' : '#e2e8f0',
                            scale: step === s ? 1.2 : 1
                        }}
                        className={`w-3 h-3 rounded-full transition-all`}
                    />
                    {s < 3 && (
                        <div className={`w-8 h-[2px] mx-1 ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4 py-12 overflow-hidden overflow-y-auto">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                            <User size={28} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Identity <span className="text-primary-600">Creation</span></h2>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Enrollment Protocol</p>
                        </div>
                    </Link>
                </div>

                <div className="glass-card p-1 sm:p-2 rounded-[3rem] border-white/60 shadow-2xl mx-auto max-w-[540px]">
                    <div className="p-7 sm:p-10">
                        <StepIndicator />

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form
                                    key="step-vitals"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={(e) => { e.preventDefault(); nextStep(); }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-5">
                                        <div className="group">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em]">Legal Identity</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                <input
                                                    type="text" required placeholder="Full Name" className="input-field pl-14"
                                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em]">Contact Vector</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                <input
                                                    type="email" required placeholder="name@email.com" className="input-field pl-14"
                                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em]">Mobile Node</label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                <input
                                                    type="tel" required placeholder="Mobile digits" className="input-field pl-14"
                                                    value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary w-full h-16 rounded-[1.25rem] flex items-center justify-center gap-3 font-bold group shadow-2xl">
                                        Initialize Metrics <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </button>
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form
                                    key="step-attributes"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleInitialSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.15em]">Birth Chronology</label>
                                            <input
                                                type="date" required className="input-field px-4"
                                                value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.15em]">Blood Matrix</label>
                                            <select
                                                required className="input-field px-4"
                                                value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                            >
                                                <option value="">Group</option>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-2 group">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em]">Security Key</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="password" required placeholder="Authentication Password" className="input-field pl-14"
                                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.15em]">Geolocation</label>
                                            <input
                                                type="text" required placeholder="City" className="input-field px-4"
                                                value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.15em]">Gender Identity</label>
                                            <select
                                                required className="input-field px-4"
                                                value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={prevStep} className="btn-outline h-16 w-16 flex items-center justify-center rounded-[1.25rem] bg-slate-50 border-slate-100">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button type="submit" disabled={loading} className="btn-primary h-16 flex-1 rounded-[1.25rem] font-bold group shadow-2xl">
                                            {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : (
                                                <span className="flex items-center justify-center gap-2">Establish Identity <ShieldCheck size={20} /></span>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {step === 3 && (
                                <motion.form
                                    key="step-activate"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleVerifyAndLogin}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                                            <ShieldCheck size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Activate Profile</h3>
                                            <p className="text-slate-500 font-medium text-xs leading-relaxed px-6">
                                                Contact metrics verified. Enter the digital code dispatched to <br />
                                                <span className="text-primary-600 font-bold break-all italic">{formData.mobile || formData.email}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text" required maxLength={6}
                                            placeholder="0 0 0 0 0 0"
                                            className="w-full text-center tracking-[0.8em] font-mono text-3xl h-20 bg-slate-50 border-2 border-slate-100 focus:border-primary-500 rounded-[2rem] outline-none transition-all placeholder:text-slate-200"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <button type="submit" disabled={loading} className="btn-primary w-full h-16 rounded-[1.25rem] font-black text-base shadow-2xl transition-all">
                                            {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : 'Finalize Activation'}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={resendCooldown > 0 || loading}
                                            onClick={handleResendOTP}
                                            className="w-full text-center text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest transition-colors disabled:text-slate-300"
                                        >
                                            {resendCooldown > 0 ? `Re-dispatch logic in ${resendCooldown}s` : 'Request New Access Code'}
                                        </button>
                                    </div>

                                    <button type="button" onClick={() => setStep(2)} className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
                                        Revision metrics
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-400 font-medium text-xs mb-3">Already part of the network?</p>
                            <Link to="/login" className="px-8 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                                Secure Login Protocol
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-10 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">MedLink Identity Enrollment v.2026.1</p>
            </motion.div>
        </div>
    );
};

export default UserRegister;
