import { useState, useRef } from 'react';
import { Upload, X, RefreshCw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MultipleImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label: string;
}

export default function MultipleImageUpload({ images, onChange, label }: MultipleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const loaders = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loaders).then(newBase64Images => {
      onChange([...images, ...newBase64Images]);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImages = [...images];
      newImages[replacingIndex] = base64String;
      onChange(newImages);
      setReplacingIndex(null);
    };
    reader.readAsDataURL(file);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImages = [...images];
    [newImages[index], newImages[newIdx]] = [newImages[newIdx], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{label}</label>
        <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">{images.length} Images</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {images.map((img, idx) => (
            <motion.div 
              key={`${idx}-${img.slice(0, 100)}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#101216] border border-white/[0.08]"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setReplacingIndex(idx); replaceInputRef.current?.click(); }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                    title="Replace"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors text-red-500"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-1">
                  <button 
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, 'left')}
                    className="p-1.5 bg-white/10 disabled:opacity-20 hover:bg-white/20 rounded-lg text-white"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button 
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => moveImage(idx, 'right')}
                    className="p-1.5 bg-white/10 disabled:opacity-20 hover:bg-white/20 rounded-lg text-white"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.button
            layout
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-indigo/50 hover:bg-brand-indigo/5 transition-all text-white/30 hover:text-brand-indigo"
          >
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Add Image</span>
          </motion.button>
        </AnimatePresence>
      </div>

      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={replaceInputRef} 
        onChange={handleReplaceFile} 
      />
    </div>
  );
}
