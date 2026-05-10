
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';

// Register more font sizes
const Size = Quill.import('formats/size') as any;
Size.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px'];
Quill.register(Size, true);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color',
  'list'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="w-full bg-[#101216] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-brand-indigo/50 transition-all quill-dark">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="text-white"
      />
      
      <style>{`
        .quill-dark .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 8px;
        }
        .quill-dark .ql-container.ql-snow {
          border: none;
          min-height: 120px;
          font-family: inherit;
        }
        .quill-dark .ql-editor {
          min-height: 120px;
          color: white;
          line-height: 1.6;
          font-size: 0.875rem;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: #4b5563;
          font-style: normal;
        }
        .quill-dark .ql-snow .ql-stroke {
          stroke: #6b7280;
        }
        .quill-dark .ql-snow .ql-fill {
          fill: #6b7280;
        }
        .quill-dark .ql-snow .ql-picker {
          color: #6b7280;
        }
        .quill-dark .ql-snow .ql-picker-options {
          background-color: #1a1c23;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .quill-dark .ql-snow .ql-picker-item:hover,
        .quill-dark .ql-snow .ql-picker-item.ql-selected {
          color: #6366f1;
        }
        .quill-dark .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-dark .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #6366f1;
        }
      `}</style>
    </div>
  );
}
