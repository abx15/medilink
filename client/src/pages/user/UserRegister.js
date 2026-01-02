import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, Loader2, CheckCircle2, Calendar, MapPin, Droplet, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserRegister = () => {
    const navigate = useNavigate();
    const { register, verifyOTP, login } = useAuth();

    const [step, setStep] = useState(1); // 1: Info, 2: Contacts/Security, 3: OTP
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

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await register(formData, 'user');
            if (res.success) {
                toast.success('Registration success! Check your mobile/email for OTP.');
                setStep(3);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to initiate registration');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOTP({
                email: formData.email,
                otp: otp,
                purpose: 'registration'
            });

            if (res.success) {
                // Now actual login
                const loginRes = await login({
                    email: formData.email,
                    password: formData.password
                }, 'user');

                if (loginRes.success) {
                    toast.success('Account verified! Welcome to MedLink.');
                    navigate('/dashboard');
                } else {
                    toast.error(loginRes.message);
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

    const inputClasses = "input-field pl-12 bg-white/50 focus:bg-white transition-all";
    const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 ml-1 uppercase tracking-[0.15em]";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-6 py-12 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-100/30 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200">
                            <User size={26} />
                        </div>
                        <span className="text-2xl font-heading font-extrabold text-slate-800">
                            Medi<span className="text-primary-600">Link</span>
                        </span>
                    </Link>
                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Health Identity</h2>
                    <div className="flex items-center justify-center gap-4 text-slate-400">
                        <span className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-slate-200'}`} />
                        <span className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />
                        <span className={`h-1.5 w-12 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`} />
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/50">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="reg-step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={(e) => { e.preventDefault(); nextStep(); }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Legal Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="text" required placeholder="Johnathan Doe" className={inputClasses}
                                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Primary Contact</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="tel" required placeholder="+91 XXXX XXX XXX" className={inputClasses}
                                                value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="email" required placeholder="john@medilink.com" className={inputClasses}
                                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary w-full h-14 rounded-2xl group text-sm font-bold shadow-lg shadow-primary-200">
                                    Continue Onboarding <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="reg-step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleInitialSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="date" required className={inputClasses}
                                                value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Blood Group</label>
                                        <div className="relative">
                                            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <select
                                                required className={inputClasses}
                                                value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                            >
                                                <option value="">Select Group</option>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Secure Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="password" required placeholder="Minimum 6 characters" className={inputClasses}
                                                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Current City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="text" required placeholder="e.g. Mumbai" className={inputClasses}
                                                value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Identity Verification</label>
                                        <select
                                            required className="input-field bg-white/50"
                                            value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="btn-outline flex-1 rounded-2xl h-14 font-bold text-xs">Back</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-[2] rounded-2xl h-14 group shadow-lg shadow-primary-200 font-bold text-sm">
                                        {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : <>Initialize Identity <ArrowRight className="ml-2 inline group-hover:translate-x-1 transition-transform" size={18} /></>}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="reg-step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onSubmit={handleVerifyAndLogin}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                                        <ShieldCheck size={44} />
                                    </div>
                                    <p className="text-slate-600 font-medium px-8">
                                        Identity verification code sent to <br />
                                        <span className="text-slate-900 font-black tracking-wider">{formData.mobile}</span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text" required maxLength={6} placeholder="0 0 0 0 0 0"
                                        className="input-field text-center tracking-[0.5em] font-mono text-3xl h-20 bg-white/50 border-2 focus:border-primary-500 rounded-2xl"
                                        value={otp} onChange={(e) => setOtp(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full h-16 rounded-2xl shadow-xl shadow-primary-200 font-bold text-lg">
                                    {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : 'Finalize Verification'}
                                </button>
                                <div className="text-center">
                                    <button type="button" onClick={() => setStep(2)} className="text-xs font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">
                                        Change Details or Resend
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-10 border-t border-slate-100/50 text-center">
                        <p className="text-slate-500 font-medium pb-2">
                            Already have an identity?
                        </p>
                        <Link to="/login" className="text-primary-600 font-black hover:underline uppercase tracking-widest text-xs">
                            Secure Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserRegister;
