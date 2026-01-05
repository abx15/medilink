import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import {
    Download,
    ShieldCheck,
    Plus,
    Printer,
    Loader2,
    AlertCircle,
    FileText,
    BadgeCheck,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HealthCard = () => {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState(null);
    const [stats, setStats] = useState(null);
    const cardRef = useRef(null);

    useEffect(() => {
        fetchCardData();
    }, []);

    const fetchCardData = async () => {
        try {
            const [cardRes, statsRes] = await Promise.all([
                API.get('/user/health-card'),
                API.get('/user/medical-record')
            ]);
            setCard(cardRes.data.healthCard);
            setStats(statsRes.data.medicalRecord);
        } catch (error) {
            console.error('Failed to load card data');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!cardRef.current) return;
        const toastId = toast.loading("Generating your high-resolution Health Card...");

        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // Higher scale for better print quality
                useCORS: true,
                backgroundColor: null
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
            pdf.save(`MedLink_HealthCard_${card.userId.uniqueHealthId}.pdf`);
            toast.update(toastId, { render: "Downloaded Successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            toast.update(toastId, { render: "Failed to generate PDF", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleGenerateCard = async () => {
        setLoading(true);
        try {
            const res = await API.post('/user/health-card/generate');
            if (res.data.success) {
                toast.success(res.data.message || 'Health Card Generated!');
                fetchCardData(); // Reload data
            } else {
                toast.error(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate card');
            setLoading(false);
        }
    };

    if (loading) return <Layout><LoadingSpinner size="large" className="min-h-[60vh]" /></Layout>;

    if (!card) return (
        <Layout>
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100 px-6">
                <AlertCircle className="mx-auto text-amber-500 mb-6" size={64} />
                <h2 className="text-3xl font-black text-slate-800 mb-4">Health Card Not Found</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Your digital health card is ready to be generated.
                    Click below to create your unique identity.
                </p>
                <button
                    onClick={handleGenerateCard}
                    className="btn-primary"
                >
                    Generate Health Card
                </button>
            </div>
        </Layout>
    );

    const user = card.userId;

    return (
        <Layout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Digital Health Card</h1>
                        <p className="text-slate-500">Government approved format for instant health retrieval</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={downloadPDF} className="btn-primary flex items-center gap-2 shadow-lg">
                            <Download size={20} /> Download PDF
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* The Card Itself - Aadhaar Style */}
                    <div className="lg:col-span-8 flex justify-center">
                        <div
                            ref={cardRef}
                            className="w-full max-w-[700px] aspect-[1.58/1] bg-white rounded-[2rem] shadow-2xl relative overflow-hidden border border-slate-200"
                        >
                            {/* Card Header (Blue/Saffron Bar) */}
                            <div className="h-6 bg-gradient-to-r from-orange-500 via-white to-green-600 flex items-center justify-center">
                                <span className="text-[10px] font-black tracking-widest text-slate-800">GOVERNMENT OF INDIA • MINISTRY OF HEALTH</span>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Plus size={40} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800 leading-none">MediLink</h2>
                                            <p className="text-xs font-bold text-primary-600">Digital Health Authority</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-green-100 text-green-700 font-black text-[10px] px-3 py-1 rounded-full uppercase border border-green-200">
                                            Verified Account
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-12 gap-8">
                                    {/* Profile Avatar Placeholder */}
                                    <div className="col-span-3">
                                        <div className="aspect-[3/4] bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-slate-300">
                                            <User size={64} />
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="col-span-6 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Full Name</p>
                                            <p className="text-xl font-black text-slate-900 leading-tight uppercase">{user.name}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">DOB</p>
                                                <p className="font-bold text-slate-800">{formatDate(user.dateOfBirth)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Gender</p>
                                                <p className="font-bold text-slate-800 capitalize">{user.gender}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Blood Group</p>
                                                <p className="font-bold text-red-600">{user.bloodGroup || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Issue Date</p>
                                                <p className="font-bold text-slate-800">{formatDate(card.generatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="col-span-3 flex flex-col items-center">
                                        <div className="p-3 bg-white border-4 border-primary-50 rounded-3xl shadow-sm mb-4">
                                            <img src={card.qrCodeImage} alt="QR Code" className="w-24 h-24" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Scan in Emergency</span>
                                    </div>
                                </div>

                                {/* ID Number Bar */}
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div className="text-3xl font-black text-slate-900 tracking-[0.2em]">
                                        {user.uniqueHealthId?.replace(/-/g, ' ')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold max-w-[150px] leading-tight text-right">
                                        THIS CARD IS SECURELY ENCRYPTED AND PROTECTS YOUR PRIVACY
                                    </div>
                                </div>
                            </div>

                            {/* Holo element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rotate-45 translate-x-12 -translate-y-12 rounded-full pointer-events-none" />
                        </div>
                    </div>

                    {/* Instructions & Features */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <BadgeCheck className="text-primary-600" size={24} />
                                Security Features
                            </h3>
                            <ul className="space-y-4">
                                <FeatureItem icon={ShieldCheck} title="Tokenized Access" desc="QR does not store raw data, but a secure temporary token." />
                                <FeatureItem icon={AlertCircle} title="Real-time Revocation" desc="Disable access instantly if you lose your card." />
                                <FeatureItem icon={FileText} title="Verified Data Only" desc="Responders only see doctor-verified critical information." />
                            </ul>
                        </section>

                        <section className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8">
                            <h4 className="font-black text-amber-800 uppercase text-xs mb-4">In Case of Emergency</h4>
                            <p className="text-sm text-amber-700 leading-relaxed font-medium">
                                Show this card to any medical professional. They can scan the QR code to get your life-saving information and emergency contacts without needing your password.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const FeatureItem = ({ icon: Icon, title, desc }) => (
    <li className="flex gap-4">
        <div className="mt-1">
            <Icon size={20} className="text-primary-600" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
    </li>
);

export default HealthCard;
