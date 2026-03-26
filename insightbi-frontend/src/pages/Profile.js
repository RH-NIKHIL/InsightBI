import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-secondary)' };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await authAPI.updateProfile({ name: formData.name, email: formData.email });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) { setMessage({ type: 'error', text: 'Passwords do not match' }); return; }
    setSaving(true);
    try {
      await authAPI.changePassword(formData.currentPassword, formData.newPassword);
      setFormData(d => ({ ...d, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setMessage({ type: 'success', text: 'Password changed successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <div className="mb-10">
          <span className="section-tag">Account</span>
          <h1 className="section-title">Profile Settings</h1>
        </div>

        {message.text && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} /> : <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />}
            <span className="text-sm" style={{ color: message.type === 'success' ? '#4ade80' : '#fca5a5' }}>{message.text}</span>
          </div>
        )}

        {/* Avatar Section */}
        <div className="card p-8 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)', fontFamily: 'var(--font-heading)' }}>
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{user?.name || 'User'}</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="card p-8 mb-6">
          <h3 className="text-lg mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Personal Information</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field pl-12" />
              </div>
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field pl-12" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /><span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-8">
          <h3 className="text-lg mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" style={labelStyle}>Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input id="currentPassword" type="password" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} className="input-field pl-12" placeholder="••••••••" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="newPassword" style={labelStyle}>New Password</label>
                <input id="newPassword" type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label htmlFor="confirmPassword" style={labelStyle}>Confirm</label>
                <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="input-field" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-secondary flex items-center gap-2">
              <Lock className="w-4 h-4" /><span>{saving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
