import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Camera, User as UserIcon } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
    dob: user?.dob || ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', formData);
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile' });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/auth/upload-profile-image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, profile_image: res.data.profile_image });
      setMessage({ type: 'success', text: 'Profile image updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e2e9]">Profile Settings</h1>
          <p className="text-sm text-[#b0b8d1] mt-1">Manage your personal information and account preferences</p>
        </div>
      </div>

      <div className="bg-[#141c24] rounded-2xl border border-[#2d363e]/50 p-6 md:p-8">
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#222b33] border-4 border-[#2d363e] flex items-center justify-center">
                {user?.profile_image ? (
                  <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-[#b0b8d1]" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary text-[#002d6e] rounded-full shadow-lg hover:bg-[#d9e2ff] transition-colors"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="text-center">
              <h3 className="text-[#e2e2e9] font-medium">{user?.username}</h3>
              <p className="text-[#b0b8d1] text-xs">{user?.email}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Full Name</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#c3c6cf] mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-[#2d363e]/50">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-[#002d6e] rounded-xl font-medium hover:bg-[#d9e2ff] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
