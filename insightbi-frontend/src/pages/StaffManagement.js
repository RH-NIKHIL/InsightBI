import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

const StaffManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setIsLoading(true);
      const data = await authAPI.getStaffList();
      setStaffList(data);
    } catch (err) {
      setError('Failed to load staff list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await authAPI.createStaff(name, email, password);
      setSuccess('Staff account created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setShowAddForm(false);
      fetchStaffList();
    } catch (err) {
      setError(err.message || 'Failed to create staff account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Are you sure you want to delete staff account: ${staffName}?`)) {
      return;
    }

    try {
      await authAPI.deleteStaff(staffId);
      setSuccess('Staff account deleted successfully');
      fetchStaffList();
    } catch (err) {
      setError(err.message || 'Failed to delete staff account');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(6, 6, 6, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg transition-all hover:bg-[var(--surface)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            <h1
              className="text-[2.5rem]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}
            >
              Staff Management
            </h1>
          </div>
          <p className="text-[0.9rem]" style={{ color: 'var(--text-secondary)' }}>
            Create and manage staff login accounts for billing operations
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
            <span className="text-sm" style={{ color: '#86efac' }}>{success}</span>
          </div>
        )}

        {/* Add Staff Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary mb-8 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New Staff</span>
          </button>
        )}

        {/* Add Staff Form */}
        {showAddForm && (
          <div
            className="card mb-8 p-6"
            style={{ border: '1px solid var(--border-hover)' }}
          >
            <h2
              className="text-[1.5rem] mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              <UserPlus className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              Add New Staff Account
            </h2>

            <form onSubmit={handleAddStaff} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field pl-12"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field pl-12"
                    placeholder="staff@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-field pl-12 pr-12"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : 'Create Staff Account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setName('');
                    setEmail('');
                    setPassword('');
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        <div className="card">
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2
              className="text-[1.5rem] flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              <Users className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              Current Staff ({staffList.length})
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div
                  className="inline-block w-8 h-8 rounded-full animate-spin mb-4"
                  style={{ border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent)' }}
                />
                <p style={{ color: 'var(--text-secondary)' }}>Loading staff list...</p>
              </div>
            ) : staffList.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No staff accounts yet</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Click "Add New Staff" to create the first account
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 rounded-lg transition-all hover:bg-[var(--surface)]"
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--surface)', color: 'var(--accent)' }}
                      >
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[1.1rem] mb-1" style={{ color: 'var(--text-primary)' }}>
                          {staff.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {staff.email}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Created: {new Date(staff.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
                      className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                      style={{ color: '#ef4444' }}
                      title="Delete staff account"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
