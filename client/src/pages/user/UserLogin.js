import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Lock, ArrowRight, Loader2, CheckCircle2, Shield, Stethoscope, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../services/api';

const UserLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP, login } = useAuth();

    // Determine initial role from navigation state
    const [role, setRole] = useState(location.state?.role || 'user');
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP (if required)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });

    // Update role if changed via UI
    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setStep(1);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login({
                email: formData.email,
                password: formData.password
            }, role);

            if (res.success) {
                toast.success(`Welcome to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal!`);
                const path = role === 'admin' ? '/admin/dashboard' :
                    role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
                navigate(path);
            } else if (res.requiresOTP) {
                toast.info('Verification required. OTP sent to your registered mobile/email.');
                setStep(2);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOTP({
                email: formData.email,
                otp: formData.otp,
                purpose: 'login'
            });

            if (res.success) {
                // Try login again with same credentials, it should pass now
                const loginRes = await login({
                    email: formData.email,
                    password: formData.password
                }, role);

                if (loginRes.success) {
                    toast.success('Identity verified! Welcome back.');
                    const path = role === 'admin' ? '/admin/dashboard' :
                        role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
                    navigate(path);
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

    const roleConfig = {
        user: {
            title: 'Patient Login',
            subtitle: 'Access your digital health card and records',
            icon: UserIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        doctor: {
            title: 'HCP Login',
            subtitle: 'Access patient records and verify health data',
            icon: Stethoscope,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        admin: {
            title: 'Admin Console',
            subtitle: 'Manage system users and health providers',
            icon: Shield,
            color: 'text-slate-700',
            bg: 'bg-slate-100'
        }
    };

    const currentRole = roleConfig[role] || roleConfig.user;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-6 py-12 overflow-hidden">
            {/* Dynamic Background */}
            <AnimatePresence>
                <motion.div
                    key={role}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10"
                >
                    <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 ${role === 'user' ? 'bg-blue-500' : role === 'doctor' ? 'bg-purple-500' : 'bg-slate-500'}`} />
                    <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 ${role === 'user' ? 'bg-indigo-500' : role === 'doctor' ? 'bg-violet-500' : 'bg-slate-800'}`} />
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo & Role Selector */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${role === 'user' ? 'bg-blue-600' : role === 'doctor' ? 'bg-purple-600' : 'bg-slate-800'}`}>
                            <currentRole.icon size={26} />
                        </div>
                        <span className="text-2xl font-heading font-extrabold text-slate-800">
                            Medi<span className={currentRole.color}>Link</span>
                        </span>
                    </Link>

                    <div className="flex justify-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-[300px] mx-auto">
                        {['user', 'doctor', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRoleChange(r)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${role === r
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                        {step === 1 ? currentRole.title : 'Security Check'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {step === 1 ? currentRole.subtitle : `Enter the verification code sent to your account`}
                    </p>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-2xl shadow-slate-200/50">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            className="input-field pl-12 bg-white/50 focus:bg-white"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
                                        Security Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="input-field pl-12 bg-white/50 focus:bg-white"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn-primary w-full h-14 rounded-2xl !text-sm font-bold flex items-center justify-center gap-2 group transition-all ${role === 'doctor' ? 'bg-purple-600 hover:bg-purple-700' : role === 'admin' ? 'bg-slate-900 hover:bg-slate-800' : ''
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Secure Sign In
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleVerifyOTP}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield size={32} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium px-4">
                                        We've sent a 6-digit verification code to your registered device.
                                    </p>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        placeholder="0 0 0 0 0 0"
                                        className="input-field text-center tracking-[0.5em] font-mono text-2xl h-16 bg-white/50"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn-primary w-full h-14 rounded-2xl !text-sm font-bold flex items-center justify-center transition-all ${role === 'doctor' ? 'bg-purple-600' : role === 'admin' ? 'bg-slate-900' : ''
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        'Verify & Authenticate'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-slate-400 hover:text-slate-600 block mx-auto font-bold uppercase tracking-widest"
                                >
                                    Back to Login
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {role !== 'admin' && (
                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-500 font-medium">
                                {role === 'user' ? "Don't have an ID?" : "Not a partner yet?"}{' '}
                                <Link
                                    to={role === 'user' ? "/register" : "/doctor/register"}
                                    className={`font-black hover:underline ${currentRole.color}`}
                                >
                                    {role === 'user' ? "Join MedLink" : "Apply Now"}
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UserLogin;
