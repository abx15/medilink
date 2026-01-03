import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Stethoscope,
    Plus,
    Activity,
    Zap,
    Clock,
    Users,
    ArrowRight,
    QrCode,
    Menu,
    X
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../../components/layout/Footer';

const Home = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const features = [
        {
            title: "Doctor Management",
            description: "Seamless verification and access control for medical professionals across the system.",
            icon: Stethoscope,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Patient Records",
            description: "Comprehensive digital health history with multi-layer encryption and portable access.",
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Appointment Booking",
            description: "Instant scheduling with real-time availability and smart doctor matching logic.",
            icon: Clock,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "Analytics Dashboard",
            description: "Advanced health data visualization and trend analysis for better medical outcomes.",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50"
        }
    ];

    const stats = [
        { label: "Total Doctors", value: "2,400+", icon: Stethoscope },
        { label: "Total Patients", value: "150k+", icon: Users },
        { label: "Today's Appointments", value: "850+", icon: Clock },
        { label: "Medical Records", value: "1.2M", icon: Shield }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                            <Plus size={26} strokeWidth={3} />
                        </div>
                        <span className="text-2xl font-black text-slate-800 tracking-tight">
                            Medi<span className="text-primary-600">Link</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                        <a href="#stats" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Statistics</a>

                        {/* QR Emergency Scan Button */}
                        <button
                            onClick={() => navigate('/scan')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95"
                        >
                            <QrCode size={18} />
                            <span>Emergency Scan</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 shadow-lg"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <a href="#features" className="block text-sm font-bold text-slate-600 hover:text-slate-900 py-2">Features</a>
                            <a href="#stats" className="block text-sm font-bold text-slate-600 hover:text-slate-900 py-2">Statistics</a>
                            <button
                                onClick={() => navigate('/scan')}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg"
                            >
                                <QrCode size={18} />
                                <span>Emergency Scan</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-black text-primary-600 shadow-sm border border-primary-100 tracking-widest uppercase mb-6">
                                <Shield size={14} /> Security First Architecture
                            </span>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mt-6">
                                Welcome to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600">Healthcare</span>
                                <br />
                                <span className="text-slate-800">System</span>
                            </h1>

                            <p className="mt-8 text-lg sm:text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
                                Experience a seamless medical infrastructure that connects Doctors, Patients, and Administrators with high-performance digital tools and instant health record portability.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                        >
                            <button
                                onClick={() => navigate('/login', { state: { role: 'doctor' } })}
                                className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-[1.25rem] font-bold shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95"
                            >
                                Doctor Login
                            </button>

                            <button
                                onClick={() => navigate('/login', { state: { role: 'admin' } })}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-[1.25rem] font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                            >
                                Admin Login
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="pt-4"
                        >
                            <button
                                onClick={() => navigate('/register')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-[1.25rem] font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                Register Now <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        {/* Health Records Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-16 max-w-md mx-auto"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-[2.5rem] rotate-3 opacity-10" />
                                <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                                                <Plus size={28} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Health Records</h3>
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">End-to-End Encrypted</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {[70, 85, 60].map((width, i) => (
                                                <div key={i} className="h-3 bg-slate-50 rounded-full w-full relative overflow-hidden">
                                                    <motion.div
                                                        className="absolute inset-0 bg-primary-200 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${width}%` }}
                                                        transition={{ duration: 1.5, delay: i * 0.2 }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-primary-600 font-black uppercase text-xs tracking-[0.3em]">Our Ecosystem</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900">Advanced Digital Capabilities</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
                            >
                                <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/20 rounded-full" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-8 border-white/20 rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center space-y-3"
                        >
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-400 mx-auto">
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl lg:text-4xl font-black text-white mb-1">{stat.value}</h4>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="bg-primary-600 rounded-[3rem] p-12 sm:p-16 text-white shadow-2xl shadow-primary-200 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
                                Ready to Modernize Your <br />Medical Experience?
                            </h2>
                            <p className="text-primary-100 mb-10 font-medium text-lg">
                                Join 150,000+ users already using MedLink for secure health management.
                            </p>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-10 py-5 bg-white text-primary-600 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                            >
                                Get Started for Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
