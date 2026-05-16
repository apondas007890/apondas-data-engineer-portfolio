
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Globe, Briefcase, Save, 
  Upload, PenBox, Calendar, MessageSquare, Linkedin, Github, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentAdminProfile } from '@/src/lib/supabase/admin-data';
import RichTextEditor from '@/src/components/admin/RichTextEditor';
import { supabase } from '@/src/lib/supabase/client';
import { buildSafeFileName, deleteFile, uploadFile } from '@/src/lib/supabase/storage';

export default function Personal() {
  const [formData, setFormData] = useState({
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop',
    name: 'Admin User',
    bio: 'Passionate full stack developer with expertise in building modern web applications. I love turning ideas into reality using clean code and innovative technologies.',
    role: 'Portfolio Owner',
    dob: '1995-05-15',
    email: 'admin@portfolio.com',
    phone: '+123 456 7890',
    whatsapp: '+123 456 7890',
    address: 'New York, USA',
    linkedin_url: 'https://linkedin.com/in/admin',
    github_url: 'https://github.com/admin'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'delete' } | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [aboutId, setAboutId] = useState<number | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => {
        setToast(null);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getCurrentAdminProfile();
        setAdminId(profile.id);
        const { data: about } = await supabase
          .from('about')
          .select('*')
          .eq('admin_id', profile.id)
          .is('deleted_at', null)
          .maybeSingle();

        if (about) {
          setAboutId(about.id);
          setCurrentImagePath(about.profile_picture_path || null);
          setFormData(prev => ({
            ...prev,
            image: about.profile_picture_url || prev.image,
            name: about.full_name || '',
            role: about.role_title || '',
            email: about.email || '',
            phone: about.phone_number || '',
            whatsapp: about.whatsapp_number || '',
            dob: about.dob || '',
            linkedin_url: about.linkedin_url || '',
            github_url: about.github_url || '',
            address: about.location || '',
            bio: about.bio_html || '',
          }));
        }
      } catch {
        setToast({ message: 'Failed to load about data.', type: 'delete' });
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleBioChange = (value: string) => {
    setFormData(prev => ({ ...prev, bio: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (name: string, value: string) => {
    let error = '';
    
    if (name === 'name') {
      if (!value.trim()) error = "Bro... don't ghost your name 😭";
      else if (value.length < 3) error = "Give it some more flavor, it's too short 👀";
    }
    
    if (name === 'email') {
      if (!value.trim()) error = "We need the digits (well, the email) 📧";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Bro... that email ain't it 😅";
    }

    if (name === 'role') {
      if (!value.trim()) error = "This field is feeling ignored 😭";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSave = async () => {
    const fields = ['name', 'email', 'role'] as const;
    let isValid = true;
    fields.forEach(field => {
      if (!validate(field, formData[field] || '')) isValid = false;
    });

    if (isValid && adminId) {
      setIsSaving(true);
      let uploadedPath: string | null = null;
      let uploadedUrl: string | null = null;
      try {
        if (pendingImageFile) {
          const newPath = `about/${adminId}/${buildSafeFileName(pendingImageFile.name)}`;
          const uploaded = await uploadFile('profile-images', newPath, pendingImageFile);
          uploadedPath = uploaded.path;
          uploadedUrl = uploaded.url;
        }

        const payload = {
          admin_id: adminId,
          full_name: formData.name,
          role_title: formData.role,
          email: formData.email,
          phone_number: formData.phone || null,
          whatsapp_number: formData.whatsapp || null,
          dob: formData.dob || null,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          location: formData.address || null,
          bio_html: formData.bio || null,
          profile_picture_url: uploadedUrl ?? formData.image ?? null,
          profile_picture_path: uploadedPath ?? currentImagePath ?? null,
          updated_at: new Date().toISOString(),
        };

        if (aboutId) {
          const { error } = await supabase.from('about').update(payload).eq('id', aboutId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.from('about').insert(payload).select('id').single();
          if (error) throw error;
          setAboutId(data.id);
        }

        if (pendingImageFile && currentImagePath) {
          await deleteFile('profile-images', currentImagePath);
        }
        if (uploadedPath) setCurrentImagePath(uploadedPath);
        setPendingImageFile(null);
        setToast({ message: 'Nailed it! Saved.', type: 'success' });
      } catch {
        if (uploadedPath) {
          await deleteFile('profile-images', uploadedPath).catch(() => {});
        }
        setToast({ message: 'Save failed. Try again.', type: 'delete' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const inputClasses = "w-full bg-[#101216] border border-white/[0.08] rounded-2xl py-4 pl-14 pr-6 text-white font-medium placeholder:text-gray-500 focus:outline-none focus:border-brand-indigo/50 transition-all";
  const labelClasses = "text-sm font-bold text-[#9ca3af] mb-3 block flex items-center tracking-tight";
  const iconClasses = "absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4b52] group-focus-within:text-brand-indigo transition-colors";

  return (
    <div className="relative">
      {/* Toast Notification */}
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message + Date.now()}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "fixed top-24 right-8 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border bg-[#0d0e12]/95 backdrop-blur-md transition-all",
              toast.type === 'delete' ? "border-red-500/20" : "border-green-500/20"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              toast.type === 'delete' ? "bg-red-500/10" : "bg-green-500/10"
            )}>
              <CheckCircle2 className={cn("w-4 h-4", toast.type === 'delete' ? "text-red-400" : "text-green-400")} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[0.16, 1, 0.3, 1]">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">Personal Information</h2>
          <p className="text-[#8fa3bf] font-medium">Update your identity and contact details across the platform.</p>
        </div>

        <div className="bg-[#0f0f13] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <h3 className="text-xl font-bold text-white tracking-tight px-2">Personal Details</h3>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-10 py-3 bg-[#4a4b52] rounded-2xl text-white font-black text-sm tracking-widest hover:bg-[#5a5b65] active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Image Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center">
                  <span className={labelClasses}>Profile Picture</span>
                  <div className="relative group cursor-pointer" onClick={handleImageClick}>
                    <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative bg-white/[0.03]">
                      {formData.image ? (
                        <img 
                          src={formData.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                          <Upload className="w-8 h-8 text-[#8fa3bf]" />
                          <span className="text-[10px] text-[#6f7f95] font-bold uppercase tracking-widest">Upload Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white scale-90 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-4 bg-brand-indigo rounded-2xl text-white shadow-xl hover:scale-110 transition-transform border-4 border-[#0f0f13]">
                      <PenBox className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-[#6f7f95] font-medium leading-relaxed">
                      Click image or icon to update.<br/>
                      Recommended: Square JPG or PNG.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-3 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {/* Full Name */}
                  <div className="group">
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative">
                      <User className={iconClasses} />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={cn(inputClasses, errors.name && "border-brand-orange/40 shadow-[0_0_20px_rgba(255,138,0,0.05)]")}
                      />
                    </div>
                    {errors.name && <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-2 block flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</motion.span>}
                    {!errors.name && formData.name && <span className="text-[11px] text-brand-green/70 font-bold mt-2 ml-2 block">Looking solid! 💪</span>}
                  </div>

                  {/* Role */}
                  <div className="group">
                    <label className={labelClasses}>Role / Title</label>
                    <div className="relative">
                      <Briefcase className={iconClasses} />
                      <input 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g. Full Stack Developer"
                        className={cn(inputClasses, errors.role && "border-brand-orange/40 shadow-[0_0_20px_rgba(255,138,0,0.05)]")}
                      />
                    </div>
                    {errors.role && <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-2 block flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.role}</motion.span>}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative">
                      <Mail className={iconClasses} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. hello@example.com"
                        className={cn(inputClasses, errors.email && "border-brand-orange/40 shadow-[0_0_20px_rgba(255,138,0,0.05)]")}
                      />
                    </div>
                    {errors.email && <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-brand-orange font-bold mt-2 ml-2 block flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</motion.span>}
                    {!errors.email && formData.email && <span className="text-[11px] text-brand-green/70 font-bold mt-2 ml-2 block">Smooth email choice. ⚡️</span>}
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative">
                      <Phone className={iconClasses} />
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 234 567 890"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="group">
                    <label className={labelClasses}>Date of Birth</label>
                    <div className="relative">
                      <Calendar className={iconClasses} />
                      <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={cn(inputClasses, "[color-scheme:dark]")}
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="group">
                    <label className={labelClasses}>WhatsApp Number</label>
                    <div className="relative">
                      <MessageSquare className={iconClasses} />
                      <input 
                        type="tel" 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="e.g. +1 234 567 890"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="group">
                    <label className={labelClasses}>LinkedIn Profile</label>
                    <div className="relative">
                      <Linkedin className={iconClasses} />
                      <input 
                        type="url" 
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="group">
                    <label className={labelClasses}>GitHub Profile</label>
                    <div className="relative">
                      <Github className={iconClasses} />
                      <input 
                        type="url" 
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                </div>

                {/* Address */}
                <div className="group col-span-full">
                  <label className={labelClasses}>Physical Address / Location</label>
                  <div className="relative">
                    <MapPin className={iconClasses} />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Silicon Valley, CA"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="group col-span-full">
                  <label className={labelClasses}>Professional Bio</label>
                  <RichTextEditor
                    value={formData.bio}
                    onChange={handleBioChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
