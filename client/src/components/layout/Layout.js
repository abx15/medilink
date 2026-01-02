import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    FileText,
    CreditCard,
    QrCode,
    Bell,
    LogOut,
    Menu,
    X,
    Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role, logout } = useAuth();
    const { unreadCount } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { title: 'My Profile', icon: User, path: '/profile' },
        { title: 'Medical History', icon: FileText, path: '/history' },
        { title: 'Health Card', icon: CreditCard, path: '/health-card' },
        { title: 'QR Management', icon: QrCode, path: '/qr-management' },
        { title: 'Notifications', icon: Bell, path: '/notifications', badge: unreadCount },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-100 z-50 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8 flex items-center justify-between">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <Plus size={20} strokeWidth={3} />
                            </div>
                            <span className="text-xl font-heading font-extrabold text-slate-800">
                                Medi<span className="text-primary-600">Link</span>
                            </span>
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group relative",
                                    location.pathname === item.path
                                        ? "bg-primary-50 text-primary-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                )}
                            >
                                <item.icon size={22} className={cn(
                                    location.pathname === item.path ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.title}

                                {item.badge > 0 && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                                        {item.badge}
                                    </span>
                                )}

                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={22} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 hidden md:block">
                    Good Morning, {user?.name?.split(' ')[0]} 👋
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-bold text-slate-800">{user?.name}</span>
                    <span className="text-xs font-medium text-slate-500 capitalize">{user?.role} Portal</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-primary-500 flex items-center justify-center text-primary-600 font-bold overflow-hidden shadow-inner">
                    {user?.name?.charAt(0)}
                </div>
            </div>
        </header>
    );
};

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="lg:ml-72 flex flex-col min-h-screen">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
