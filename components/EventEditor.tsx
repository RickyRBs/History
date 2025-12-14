import React, { useState, useEffect, useRef } from 'react';
import { TimelineEvent, EventType } from '../types';
import { enhanceEntry } from '../services/geminiService';
import { Sparkles, Loader2, X, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface EventEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: TimelineEvent) => void;
  initialData?: TimelineEvent | null;
}

const EventEditor: React.FC<EventEditorProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [sortYear, setSortYear] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>(EventType.COURSE);
  const [imageUrl, setImageUrl] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setYear(initialData.year);
      setSortYear(initialData.sortYear);
      setDescription(initialData.description);
      setType(initialData.type);
      setImageUrl(initialData.imageUrl || '');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setYear('');
    setSortYear(0);
    setDescription('');
    setType(EventType.COURSE);
    setImageUrl('');
  };

  const handleEnhance = async () => {
    if (!title) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceEntry(title, year, description);
      if (result) {
        const newDesc = `${description ? description + '\n\n' : ''}--- AI HISTORIAN CONTEXT ---\n${result.expandedDescription}\n\nHistorical Context: ${result.historicalContext}`;
        setDescription(newDesc);
      }
    } catch (e) {
      alert('Failed to fetch AI enhancement. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: TimelineEvent = {
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      // For new entries, we assume English/Primary fields are filled. 
      titleZh: initialData?.titleZh || title, 
      year,
      yearZh: initialData?.yearZh || year,
      sortYear,
      description,
      descriptionZh: initialData?.descriptionZh || description,
      type,
      tags: initialData?.tags || [], 
      tagsZh: initialData?.tagsZh || [],
      // Use provided image, or fallback to random if it's a NEW entry and no image provided
      imageUrl: imageUrl || (!initialData ? `https://picsum.photos/seed/${Date.now()}/400/300` : '') 
    };
    onSave(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif text-cobalt font-bold">
            {initialData ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setType(EventType.COURSE)}
                className={`flex-1 py-3 px-4 text-left text-sm rounded border transition-all ${
                  type === EventType.COURSE 
                  ? 'bg-cobalt text-white border-cobalt shadow-md' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-bold block">Lecture / Recitation</span>
                <span className="text-xs opacity-80 font-normal">Course material, dates, and core subjects.</span>
              </button>
              
              <button
                type="button"
                onClick={() => setType(EventType.PERSONAL)}
                className={`flex-1 py-3 px-4 text-left text-sm rounded border transition-all ${
                  type === EventType.PERSONAL 
                  ? 'bg-china-red text-white border-china-red shadow-md' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-bold block">Personal / Interests</span>
                <span className="text-xs opacity-80 font-normal">Family history, personal notes, and design curiosities.</span>
              </button>

              <button
                type="button"
                onClick={() => setType(EventType.HISTORICAL)}
                className={`flex-1 py-3 px-4 text-left text-sm rounded border transition-all ${
                  type === EventType.HISTORICAL 
                  ? 'bg-gray-600 text-white border-gray-600 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-bold block">Historical Context</span>
                <span className="text-xs opacity-80 font-normal">General world events or context.</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Ming Dynasty Blue & White"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cobalt focus:border-cobalt outline-none transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Display Date</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 1420 AD"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cobalt outline-none"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort Year</label>
              <input
                type="number"
                required
                value={sortYear}
                onChange={(e) => setSortYear(parseInt(e.target.value))}
                placeholder="1420"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cobalt outline-none"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>
             <div className="flex gap-2 items-start">
                <div className="flex-1">
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                         <LinkIcon size={14} />
                      </div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="w-full pl-9 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cobalt outline-none text-sm"
                      />
                   </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-600 transition"
                   title="Upload Image"
                >
                   <Upload size={20} />
                </button>
             </div>
             
             {/* Image Preview */}
             {imageUrl && (
                <div className="mt-3 relative w-full h-32 bg-gray-50 rounded border border-gray-200 overflow-hidden flex items-center justify-center group">
                   <img src={imageUrl} alt="Preview" className="h-full w-full object-contain" />
                   <button 
                     type="button"
                     onClick={() => setImageUrl('')}
                     className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                   >
                     <X size={14} />
                   </button>
                </div>
             )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">Description & Notes</label>
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !title}
                className="flex items-center text-xs text-cobalt hover:text-cobalt-dark disabled:opacity-50"
              >
                {isEnhancing ? <Loader2 className="animate-spin mr-1" size={12} /> : <Sparkles className="mr-1" size={12} />}
                Ask AI Historian
              </button>
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter lecture notes, recitation details, or your personal interest story here..."
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cobalt outline-none resize-none text-sm leading-relaxed"
            ></textarea>
            <p className="text-xs text-gray-400 mt-1 italic">
              Tip: Use the 'Ask AI' button to help contextualize this topic within the broader design movement.
            </p>
          </div>
        </form>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-cobalt text-white rounded shadow hover:bg-cobalt-dark transition">
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventEditor;