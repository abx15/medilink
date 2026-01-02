import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import {
    User,
    MapPin,
    Mail,
    Phone,
    Droplet,
    Calendar,
    ShieldAlert,
    Save,
    Loader2,
    PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { cn } from '../../utils/helpers';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
            city: user.address?.city || '',
            state: user.address?.state || ''
        },
        emergencyContact: {
            name: user.emergencyContact?.name || '',
            mobile: user.emergencyContact?.mobile || '',
            relationship: user.emergencyContact?.relationship || ''
        }
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put('/user/profile', formData);
            if (res.data.success) {
                // Update local storage and context
                localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
                window.location.reload(); // Refresh to sync everything
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmergency = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/user/emergency-contact', formData.emergencyContact);
            if (res.data.success) {
                toast.success('Emergency contact saved');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save emergency contact');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "input-field pl-12";
    const labelClasses = "block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider";

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-12">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
                    <p className="text-slate-500">Manage your medical identity and emergency contacts</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left: General Info & Address */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <User className="text-primary-600" size={24} />
                                Personal Information
                            </h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="text" className={inputClasses} value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Gender</label>
                                        <select
                                            className="input-field" value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Blood Group</label>
                                        <div className="relative">
                                            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <select
                                                className={inputClasses} value={formData.bloodGroup}
                                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                            >
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Home Address (City, State)</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text" className={inputClasses} placeholder="City" value={formData.address.city}
                                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                                />
                                            </div>
                                            <input
                                                type="text" className="input-field" placeholder="State" value={formData.address.state}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg">
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                                    Save Changes
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Right: Emergency Contact */}
                    <div className="space-y-8">
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full">
                            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                <ShieldAlert className="text-red-500" size={24} />
                                SOS Contact
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 font-medium">This person will be displayed on your Health Card for emergency responders.</p>

                            <form onSubmit={handleUpdateEmergency} className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Contact Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text" className={inputClasses} placeholder="Emergency Name"
                                            value={formData.emergencyContact.name}
                                            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Direct Mobile</label>
                                    <div className="relative">
                                        <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="tel" className={inputClasses} placeholder="+91 00000 00000"
                                            value={formData.emergencyContact.mobile}
                                            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, mobile: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Relationship</label>
                                    <input
                                        type="text" className="input-field" placeholder="e.g. Spouse, Parent"
                                        value={formData.emergencyContact.relationship}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn w-full bg-red-500 text-white hover:bg-red-600 shadow-md">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Update SOS'}
                                </button>
                            </form>
                        </section>
                    </div>
                </div>

                {/* Account Security Info (ReadOnly) */}
                <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8">
                    <h4 className="text-sm font-black text-slate-400 uppercase mb-4">Account Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Primary Email</p>
                                <p className="font-bold text-slate-700">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Registered Mobile</p>
                                <p className="font-bold text-slate-700">{user.mobile}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Profile;
