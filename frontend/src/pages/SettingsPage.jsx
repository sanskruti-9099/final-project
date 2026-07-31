import React, { useState, useEffect, useRef } from 'react';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineCamera
} from 'react-icons/hi2';
import profileService from '../services/profileService';
import { useTheme } from '../context/ThemeContext';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function SettingsPage() {
  const { isDark } = useTheme();
  
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    bio: '',
    profile_image: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await profileService.updateProfile({
        full_name: profile.full_name,
        username: profile.username,
        phone: profile.phone,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
        bio: profile.bio
      });
      
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    fetchProfile(); // Reset to original data
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      await profileService.uploadImage(file);
      setSuccess('Profile image updated!');
      fetchProfile(); // Refresh image
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setSaving(false);
    }
  };

  const getProfileImageUrl = () => {
    if (profile.profile_image) {
      // Assuming backend is running on 8000 and proxy is set up or direct URL
      return `http://localhost:8000/uploads/${profile.profile_image}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClasses = `w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none
    ${isDark 
      ? 'bg-surface-900 border-surface-700 text-surface-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-surface-800 disabled:text-surface-500' 
      : 'bg-white border-surface-300 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-surface-100 disabled:text-surface-500'
    }`;

  const labelClasses = "block text-sm font-semibold mb-1.5 text-surface-700 dark:text-surface-300";

  return (
    <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6 px-2 sm:px-4 py-4 pb-12 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white">Profile Settings</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your account details and preferences.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/25"
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
            Edit Profile
          </button>
        )}
      </div>

      {error && <ErrorBanner error={error} />}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
          <HiOutlineCheck className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-surface-850 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
        
        {/* Header / Avatar Section */}
        <div className="relative h-32 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="absolute -bottom-16 left-8 flex items-end gap-5">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-surface-850 bg-surface-200 dark:bg-surface-700 overflow-hidden flex items-center justify-center shadow-lg">
                {getProfileImageUrl() ? (
                  <img src={getProfileImageUrl()} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineUser className="w-12 h-12 text-surface-400" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-surface-900 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg border-2 border-white dark:border-surface-850 cursor-pointer"
                title="Change Avatar"
              >
                <HiOutlineCamera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                {profile.full_name || 'Anonymous User'}
              </h2>
              <p className="text-surface-500 dark:text-surface-400 font-medium">
                @{profile.username || 'username'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 pt-24 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className={labelClasses}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="text-surface-400 w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="full_name"
                  value={profile.full_name || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${inputClasses} pl-10`}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className={labelClasses}>Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 font-semibold">
                  @
                </div>
                <input 
                  type="text" 
                  name="username"
                  value={profile.username || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${inputClasses} pl-10`}
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className={labelClasses}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineEnvelope className="text-surface-400 w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={profile.email || ''} 
                  disabled
                  className={`${inputClasses} pl-10 opacity-75`}
                  title="Email cannot be changed"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClasses}>Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlinePhone className="text-surface-400 w-5 h-5" />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  value={profile.phone || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${inputClasses} pl-10`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={labelClasses}>Gender</label>
              <select 
                name="gender"
                value={profile.gender || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={inputClasses}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className={labelClasses}>Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineCalendar className="text-surface-400 w-5 h-5" />
                </div>
                <input 
                  type="date" 
                  name="date_of_birth"
                  value={profile.date_of_birth || ''} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Bio</label>
              <textarea 
                name="bio"
                value={profile.bio || ''} 
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className={`${inputClasses} resize-none`}
                placeholder="Tell us a little bit about yourself..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-surface-200 dark:border-surface-800">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <HiOutlineCheck className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
