import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Calendar, Heart, Loader2, CheckCircle2, Church, GraduationCap, Briefcase, Plus, X, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Member, MemberRole } from '../types';

const Signup: React.FC = () => {
  const { signup, campuses, addCampus } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Modal State for creating campus
  const [isCreatingCampus, setIsCreatingCampus] = useState(false);
  const [newCampusName, setNewCampusName] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    
    // New Fields
    role: 'Member' as MemberRole,
    parish: '',
    residentPastor: '',
    position: '',
    isBibleStudent: false,
    campus: '',

    street: '',
    city: '',
    state: '',
    zip: '',
    isBaptized: false,
    ministryInterest: 'None',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleCreateCampus = () => {
      if(newCampusName.trim()) {
          addCampus(newCampusName);
          setFormData(prev => ({...prev, campus: newCampusName}));
          setNewCampusName('');
          setIsCreatingCampus(false);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    setSubmitting(true);

    const newMember = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dob,
        
        role: formData.role,
        parish: formData.parish,
        residentPastor: formData.residentPastor,
        position: formData.position,
        isBibleStudent: formData.isBibleStudent,
        campus: formData.isBibleStudent ? formData.campus : undefined,

        address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
        },
        spiritualInfo: {
            isBaptized: formData.isBaptized as boolean,
            ministryInterests: [formData.ministryInterest]
        },
        emergencyContact: {
            name: formData.emergencyName,
            phone: formData.emergencyPhone,
            relation: formData.emergencyRelation
        },
        password: formData.password
    };

    try {
        await signup(newMember);
        navigate('/portal');
    } catch (err: any) {
        console.error(err);
        const code = err.code || '';
        let message = 'Failed to create account. Please try again.';
        if (code === 'auth/email-already-in-use') {
          message = 'An account with this email already exists. Please sign in instead.';
        } else if (code === 'auth/invalid-email') {
          message = 'Please enter a valid email address.';
        } else if (code === 'auth/weak-password') {
          message = 'Your password is too weak. Please choose a stronger password (at least 6 characters).';
        } else if (code === 'auth/network-request-failed') {
          message = 'Network error. Please check your internet connection.';
        }
        alert(message);
    } finally {
        setSubmitting(false);
    }
  };

  const roles: MemberRole[] = ['Member', 'Partner', 'Leader', 'Pastor'];

  const roleDescriptions: Record<MemberRole, string> = {
    'Member': "I consider CBA my home church and attend services locally.",
    'Partner': "I follow the ministry online, live elsewhere, and support the vision.",
    'Leader': "I serve in a ministry department (e.g., Usher, Choir) or lead a group.",
    'Pastor': "I am an ordained minister or pastor serving within the ministry."
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl px-4 animate-fade-in-up">
        
        <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-church-900 mb-3">Join Our Family</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
                "For just as the body is one and has many members... so it is with Christ."
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Membership Category */}
            <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-church-100 p-2 rounded-lg text-church-600"><Church size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Membership Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                   {roles.map((r) => (
                       <button
                         key={r}
                         type="button"
                         onClick={() => setFormData(prev => ({...prev, role: r}))}
                         className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
                             formData.role === r 
                             ? 'bg-church-600 text-white border-church-600 shadow-md transform scale-105' 
                             : 'bg-white text-gray-600 border-gray-200 hover:border-church-300'
                         }`}
                       >
                           {r}
                       </button>
                   ))}
                </div>
                
                {/* Dynamic Description Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in transition-all">
                    <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 mt-0.5 flex-shrink-0">
                        <Info size={16} />
                    </div>
                    <div>
                        <p className="text-blue-900 font-bold text-sm mb-0.5">{formData.role}</p>
                        <p className="text-blue-700 text-sm leading-relaxed">{roleDescriptions[formData.role]}</p>
                    </div>
                </div>
            </div>

            {/* Account Credentials */}
            <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Lock size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Account Credentials</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" placeholder="(555) 123-4567" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" placeholder="••••••••" />
                    </div>
                </div>
            </div>

            {/* Personal & Church Information */}
            <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><User size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Personal & Church Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                        </div>
                    </div>
                    
                    {/* Church Info */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Parish (Branch) *</label>
                        <input type="text" name="parish" required placeholder="e.g. Grace City Main" value={formData.parish} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Resident Pastor</label>
                        <input type="text" name="residentPastor" placeholder="Name of Pastor" value={formData.residentPastor} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    {(formData.role === 'Leader' || formData.role === 'Member') && (
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Worker Position</label>
                             <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="position" placeholder="e.g. Usher, Choir Member" value={formData.position} onChange={handleChange} className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                             </div>
                        </div>
                    )}
                </div>
            </div>

             {/* Bible School Section */}
             <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><GraduationCap size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Bible School</h2>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                        <input type="checkbox" name="isBibleStudent" checked={formData.isBibleStudent} onChange={handleChange} className="w-5 h-5 text-church-600 rounded focus:ring-church-500" />
                        <div>
                            <span className="font-bold text-gray-800 block">I am a Bible Student</span>
                            <span className="text-sm text-gray-500">Check if you are currently enrolled in our Bible School.</span>
                        </div>
                    </label>

                    {formData.isBibleStudent && (
                        <div className="mt-4 animate-fade-in">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Campus</label>
                            <div className="flex gap-2">
                                <select name="campus" value={formData.campus} onChange={handleChange} className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none">
                                    <option value="">Select a campus...</option>
                                    {campuses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {(formData.role === 'Pastor' || formData.role === 'Leader') && (
                                    <button 
                                      type="button" 
                                      onClick={() => setIsCreatingCampus(true)}
                                      className="bg-church-100 text-church-700 px-4 rounded-xl font-bold text-sm hover:bg-church-200 whitespace-nowrap flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Create Campus
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Address */}
            <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><MapPin size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Address</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Spiritual Profile */}
            <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-gold-100 p-2 rounded-lg text-gold-600"><Heart size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Spiritual Profile</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ministry Interest</label>
                        <select name="ministryInterest" value={formData.ministryInterest} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none">
                            <option value="None">None yet</option>
                            <option value="Worship">Worship Team</option>
                            <option value="Kids">Kids Kingdom</option>
                            <option value="Welcome">Welcome Team</option>
                            <option value="Tech">Tech / Media</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            <input type="checkbox" name="isBaptized" checked={formData.isBaptized as boolean} onChange={handleChange} className="w-5 h-5 text-church-600 rounded focus:ring-church-500" />
                            <div>
                                <span className="font-bold text-gray-800 block">I have been water baptized</span>
                                <span className="text-sm text-gray-500">Check this box if you have made a public declaration of your faith through baptism.</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

             {/* Emergency Contact */}
             <div className="glass-panel p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600"><CheckCircle2 size={20} /></div>
                    <h2 className="text-xl font-bold text-gray-800">Emergency Contact</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Name</label>
                        <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Relationship</label>
                        <input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                        <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <Link to="/login" className="text-gray-600 font-medium hover:text-church-600">Already a member? Sign In</Link>
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-church-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-church-700 transition shadow-lg shadow-church-200/50 flex items-center gap-2 disabled:opacity-70 transform hover:-translate-y-1"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                </button>
            </div>
        </form>
      </div>

      {/* Create Campus Modal */}
      {isCreatingCampus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Create New Campus</h3>
                      <button onClick={() => setIsCreatingCampus(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Add a new campus location for Bible Students to enroll in.</p>
                  <input 
                    type="text" 
                    value={newCampusName}
                    onChange={(e) => setNewCampusName(e.target.value)}
                    placeholder="Enter Campus Name"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-church-500 outline-none mb-4"
                  />
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setIsCreatingCampus(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                      <button onClick={handleCreateCampus} className="px-4 py-2 bg-church-600 text-white rounded-lg hover:bg-church-700">Create Campus</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Signup;