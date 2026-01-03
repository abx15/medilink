import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';
import { ShieldAlert, X, Loader2, Zap, Camera, RefreshCw, Copy, ExternalLink, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QRScanner = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [cameraState, setCameraState] = useState('idle');
    const [hasFlash, setHasFlash] = useState(false);
    const [torchOn, setTorchOn] = useState(false);

    useEffect(() => {
        startScanner();
        return () => stopScanner();
    }, []);

    const startScanner = async () => {
        try {
            setCameraState('requested');
            setError(null);

            const constraints = {
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", true);
                await videoRef.current.play();
                setScanning(true);
                setCameraState('active');

                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities?.() || {};
                setHasFlash(!!capabilities.torch);
            }
        } catch (err) {
            console.error("Lens Initialization Error:", err);
            setCameraState('denied');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Hardware access denied. Please authorize camera permissions in system settings.");
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError("No optical sensor detected on this node.");
            } else {
                setError(`Protocol Error: ${err.message}. Ensure secure HTTPS link.`);
            }
        }
    };

    const stopScanner = () => {
        setScanning(false);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        let animationFrameId;
        const scan = () => {
            if (scanning && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d', { willReadFrequently: true });

                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        handleScanResult(code.data);
                        return;
                    }
                }
                animationFrameId = requestAnimationFrame(scan);
            }
        };

        if (scanning) {
            animationFrameId = requestAnimationFrame(scan);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [scanning]);

    const handleScanResult = (data) => {
        stopScanner();
        toast.success("Identity Detected. Redirecting...");

        if (data.includes('/emergency/')) {
            const pathParts = data.split('/');
            const id = pathParts[pathParts.length - 1].split('?')[0];
            navigate(`/emergency/${id}`);
        } else if (data.startsWith('http')) {
            window.location.href = data;
        } else {
            toast.info(`Raw Signal: ${data}`);
            setScanning(false);
        }
    };

    const toggleTorch = async () => {
        const track = videoRef.current?.srcObject?.getVideoTracks()[0];
        if (track && hasFlash) {
            try {
                const newTorchState = !torchOn;
                await track.applyConstraints({
                    advanced: [{ torch: newTorchState }]
                });
                setTorchOn(newTorchState);
            } catch (err) {
                console.warn("Flash synchronization failed", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
            {/* Header Overlay */}
            <div className="absolute top-10 left-0 w-full px-8 flex items-center justify-between z-30">
                <Link to="/" className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-[1.25rem] flex items-center justify-center text-white/70 border border-white/10 hover:bg-white/10 transition-all">
                    <X size={24} />
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-black tracking-[0.05em] uppercase italic">Identity <span className="text-primary-500">Lens</span></h1>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.4em] mt-1">Bio-Metric Entrance</p>
                </div>
                <button className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-[1.25rem] flex items-center justify-center text-white/40 border border-white/10">
                    <HelpCircle size={24} />
                </button>
            </div>

            {/* Scanner Viewport */}
            <div className="relative w-full max-w-sm aspect-square sm:aspect-[3/4] rounded-[3rem] overflow-hidden bg-slate-950 border-[6px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                {cameraState === 'active' && (
                    <motion.video
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        playsInline
                    />
                )}

                {/* Cybernetic HUD Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
                        {/* Brackets */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary-500 rounded-tl-[2.5rem]" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary-500 rounded-tr-[2.5rem]" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary-500 rounded-bl-[2.5rem]" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary-500 rounded-br-[2.5rem]" />

                        {/* Scanning Vector */}
                        {scanning && (
                            <motion.div
                                animate={{
                                    top: ["5%", "95%", "5%"],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-4 right-4 h-[2px] bg-primary-400 shadow-[0_0_20px_rgba(56,189,248,0.8)] z-30"
                            />
                        )}

                        {/* Center Reticle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white/40 rounded-full" />
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10"
                        >
                            <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-primary-500 shadow-[0_0_10px_#0ea5e9]' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{scanning ? 'Sensors Active' : 'Lens Offline'}</span>
                        </motion.div>
                    </div>
                </div>

                {/* State Screens */}
                <AnimatePresence>
                    {cameraState === 'requested' && (
                        <motion.div
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-30 space-y-6"
                        >
                            <div className="relative">
                                <Loader2 className="animate-spin text-primary-500" size={48} strokeWidth={3} />
                                <div className="absolute inset-0 blur-xl bg-primary-500/20 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Booting Optical Sensors</p>
                                <p className="text-[9px] text-white/20 font-bold mt-2 italic px-10">Initializing secure link protocol...</p>
                            </div>
                        </motion.div>
                    )}

                    {cameraState === 'denied' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-40 p-10 text-center backdrop-blur-2xl"
                        >
                            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                <ShieldAlert size={40} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight mb-3 italic">Hardware Link Refused</h3>
                            <p className="text-white/40 text-xs leading-relaxed mb-8">{error}</p>
                            <button
                                onClick={startScanner}
                                className="w-full h-16 bg-white text-black rounded-[1.25rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
                            >
                                <RefreshCw size={20} /> Re-Connect Sensors
                            </button>
                            <Link to="/" className="mt-6 text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors">Abort Mission</Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Bottom Controls */}
            <div className="mt-12 flex items-center gap-5 z-30">
                {hasFlash && (
                    <button
                        onClick={toggleTorch}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all ${torchOn ? 'bg-yellow-400 border-yellow-400 text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                    >
                        <Zap size={24} fill={torchOn ? "currentColor" : "none"} />
                    </button>
                )}

                <button
                    onClick={() => navigate('/login')}
                    className="h-16 px-10 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
                >
                    Manual Override <ArrowRight size={20} />
                </button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
                <ShieldCheck size={20} className="text-primary-500" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Secure Node: Verified</p>
            </div>

            {/* Background Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default QRScanner;
