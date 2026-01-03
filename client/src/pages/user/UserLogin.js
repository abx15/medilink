import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, User, Stethoscope, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, requestLoginOTP, loginWithOTP, resendOTP } = useAuth();

    const [role, setRole] = useState(location.state?.role || 'user');
    const [loginMethod, setLoginMethod] = useState('password');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(formData, role);
            if (res.success) {
                toast.success('Identity Verified. Welcome back.');
                const path = role === 'admin' ? '/admin/dashboard' :
                    role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
                navigate(path);
            } else if (res.requiresOTP) {
                toast.info('Verification Required.');
                setResendCooldown(60);
                setStep(2);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Authentication error. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await requestLoginOTP({
                email: formData.email,
                role
            });
            if (res.success) {
                toast.success('Access code dispatched.');
                setResendCooldown(60);
                setStep(2);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to dispatch code');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setLoading(true);
        try {
            const res = await resendOTP({
                email: formData.email,
                purpose: 'login'
            });
            if (res.success) {
                toast.success('New access code sent.');
                setResendCooldown(60);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Network error during dispatch');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return toast.warning('6-digit code required');
        setLoading(true);
        try {
            const res = await loginWithOTP({
                email: formData.email,
                otp,
                role
            });
            if (res.success) {
                toast.success('Access Authorized.');
                const path = role === 'admin' ? '/admin/dashboard' :
                    role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
                navigate(path);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to verify code');
        } finally {
            setLoading(false);
        }
    };

    const roleConfigs = {
        user: { icon: User, label: 'Patient', color: 'primary' },
        doctor: { icon: Stethoscope, label: 'Doctor', color: 'blue' },
        admin: { icon: Shield, label: 'Admin', color: 'indigo' }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4 py-12 overflow-hidden overflow-y-auto">
            {/* Ambient Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[100px] -z-10"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[100px] -z-10"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-200 group-hover:scale-105 transition-transform">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Med<span className="text-primary-600">Link</span></h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Identity Gateway</p>
                        </div>
                    </Link>
                </div>

                <div className="glass-card p-1 sm:p-2 rounded-[2.5rem] border-white/60 shadow-2xl relative overflow-hidden">
                    {/* Inner Content Wrapper to apply padding while maintaining glass effect */}
                    <div className="p-7 sm:p-10">
                        {/* Role Switcher */}
                        <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl mb-8 border border-white/40">
                            {Object.entries(roleConfigs).map(([r, config]) => {
                                const Icon = config.icon;
                                const isActive = role === r;
                                return (
                                    <button
                                        key={r}
                                        onClick={() => { setRole(r); setStep(1); }}
                                        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 rounded-xl transition-all relative ${isActive ? 'bg-white text-primary-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{config.label}</span>
                                        {isActive && (
                                            <motion.div layoutId="role-indicator" className="absolute -top-1 w-1 h-1 bg-primary-600 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="input-stage"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                >
                                    <form onSubmit={loginMethod === 'password' ? handlePasswordLogin : handleRequestOTP} className="space-y-6">
                                        <div className="space-y-5">
                                            <div className="group">
                                                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em] group-focus-within:text-primary-600 transition-colors">Digital Identity</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                    <input
                                                        type="text" required
                                                        placeholder="Email or Mobile"
                                                        className="input-field pl-14"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {loginMethod === 'password' && (
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-[0.2em] group-focus-within:text-primary-600 transition-colors">Access Key</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                                        <input
                                                            type="password" required
                                                            placeholder="••••••••"
                                                            className="input-field pl-14"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-5 pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full h-16 rounded-[1.25rem] text-sm font-bold tracking-tight overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 font-black italic" />
                                                {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : (
                                                    <span className="flex items-center justify-center gap-3">
                                                        {loginMethod === 'password' ? 'Authorize Access' : 'Dispatch Access Code'}
                                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </button>

                                            <div className="relative flex items-center py-1">
                                                <div className="flex-grow border-t border-slate-200/60"></div>
                                                <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Auth Mode</span>
                                                <div className="flex-grow border-t border-slate-200/60"></div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                                                className="btn-outline w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                                            >
                                                {loginMethod === 'password' ? 'Verify via Digital Code' : 'Access via Password'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp-stage"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-primary-100/50 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-5 shadow-inner border border-white/60">
                                            <ShieldCheck size={36} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Verification</h3>
                                        <p className="text-slate-500 font-medium text-xs mt-2 leading-relaxed px-4">
                                            We've dispatched a 6-digit code to <br />
                                            <span className="text-primary-600 font-bold break-all">{formData.email}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleOTPLogin} className="space-y-6">
                                        <div className="relative">
                                            <input
                                                type="text" required maxLength={6}
                                                placeholder="0 0 0 0 0 0"
                                                className="w-full text-center tracking-[0.8em] font-mono text-3xl h-20 bg-slate-50 border-2 border-slate-100 focus:border-primary-500 rounded-[1.5rem] outline-none transition-all placeholder:text-slate-200"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                autoFocus
                                            />
                                            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem] shadow-inner opacity-40"></div>
                                        </div>

                                        <div className="space-y-4">
                                            <button type="submit" disabled={loading} className="btn-primary w-full h-16 rounded-[1.25rem] font-black text-base transition-all active:scale-95 shadow-2xl">
                                                {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : 'Finalize Authorization'}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={resendCooldown > 0 || loading}
                                                onClick={handleResendOTP}
                                                className="w-full text-center text-[10px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest transition-colors disabled:text-slate-300"
                                            >
                                                {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Request New Access Code'}
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full text-center text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest mt-4"
                                        >
                                            Change Credentials
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {role !== 'admin' && (
                            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center">
                                <span className="text-slate-400 font-semibold text-xs mb-3">Don't have a secure identity?</span>
                                <Link
                                    to={role === 'doctor' ? '/doctor/register' : '/register'}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-50 rounded-full text-primary-600 text-[10px] font-black uppercase tracking-widest hover:bg-primary-100 transition-colors"
                                >
                                    Register Account <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Shimmer Effect Decoration */}
                    <div className="absolute top-0 left-0 w-[200%] h-full bg-shimmer animate-shimmer -z-10 opacity-30 pointer-events-none" />
                </div>

                <p className="text-center mt-10 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">MedLink Network Node 14.0.2</p>
            </motion.div>
        </div>
    );
};

export default UserLogin;
