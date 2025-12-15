import React, { useState, useMemo, useEffect } from 'react';
import { TimelineEvent, EventType } from './types';
import { INITIAL_EVENTS } from './constants';
import EventCard from './components/EventCard';
import TimeSpinner from './components/TimeSpinner';
import EventEditor from './components/EventEditor';
import { Languages, Plus, RotateCcw, Share2, Check } from 'lucide-react';

function App() {
  // Initialize state logic:
  // 1. Check URL parameters first (Shared Link)
  // 2. Check LocalStorage second (Saved Local Data)
  // 3. Fallback to Initial Constants
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    if (typeof window !== 'undefined') {
      // 1. Try URL Params
      const params = new URLSearchParams(window.location.search);
      const sharedData = params.get('data');
      if (sharedData) {
        try {
          const decoded = atob(sharedData);
          return JSON.parse(decoded);
        } catch (e) {
          console.error("Failed to parse shared link data", e);
        }
      }

      // 2. Try Local Storage
      try {
        const saved = localStorage.getItem('ciqi-timeline-data');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Could not load saved data", e);
      }
    }
    return INITIAL_EVENTS;
  });

  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  // Save to LocalStorage whenever events change (unless we are viewing a shared link)
  useEffect(() => {
    try {
      // Only save to local storage if we aren't currently viewing a readonly share link
      // (Simple heuristic: if we modify data, we save it. )
      localStorage.setItem('ciqi-timeline-data', JSON.stringify(events));
    } catch (e) {
      console.error("Storage failed", e);
    }
  }, [events]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sort events chronologically
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.sortYear - b.sortYear);
  }, [events]);

  const handleDeleteEvent = (id: string) => {
    if (confirm(language === 'zh' ? '确定要删除此条目吗？' : 'Are you sure you want to remove this entry?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleResetData = () => {
    if (confirm(language === 'zh' 
      ? '这将删除所有自定义条目并重置为默认课程内容。确定吗？' 
      : 'This will delete all your custom entries and reset to the default course material. Are you sure?')) {
      setEvents(INITIAL_EVENTS);
      localStorage.removeItem('ciqi-timeline-data');
      // Clear URL params without reload
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsEditorOpen(true);
  };

  const handleSaveEvent = (event: TimelineEvent) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) {
        return prev.map(e => e.id === event.id ? event : e);
      }
      return [...prev, event];
    });
    setIsEditorOpen(false);
    setEditingEvent(null);
  };

  // Scroll to event when clicked in spinner
  const scrollToEvent = (id: string) => {
    const element = document.getElementById(`event-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const generateShareLink = () => {
    // 1. Optimize data: Remove large base64 images from sharing to keep URL short enough
    // We only share events that have external URLs or no images.
    const cleanEvents = events.map(e => {
        if (e.imageUrl && e.imageUrl.startsWith('data:')) {
            return { ...e, imageUrl: '' }; // Strip embedded images
        }
        return e;
    });

    const jsonString = JSON.stringify(cleanEvents);
    const encoded = btoa(jsonString);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setShareUrl(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-celadon selection:text-ink pb-20">
      
      {/* Header Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <button 
          onClick={generateShareLink}
          className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white text-cobalt border border-cobalt/20 transition-all active:scale-95 group relative"
          title={language === 'zh' ? '生成分享链接' : 'Share Snapshot Link'}
        >
          {showCopied ? <Check size={24} className="text-green-600" /> : <Share2 size={24} />}
          
          {/* Tooltip for Share */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-ink text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             {showCopied ? 'Link Copied!' : 'Share Snapshot'}
          </span>
        </button>

        <button 
          onClick={() => {
            setEditingEvent(null);
            setIsEditorOpen(true);
          }}
          className="bg-cobalt text-white p-3 rounded-full shadow-lg hover:bg-cobalt-dark hover:scale-105 transition-all flex items-center justify-center group"
          title={language === 'zh' ? '添加条目' : 'Add Entry'}
        >
          <Plus size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 text-sm font-bold">
            {language === 'zh' ? '添加条目' : 'Add Entry'}
          </span>
        </button>

        <button 
          onClick={toggleLanguage}
          className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white text-cobalt border border-cobalt/20 transition-all active:scale-95"
          title="Switch Language / 切换语言"
        >
          <Languages size={24} />
        </button>
      </div>

      {/* 3D Interactive Hero Section */}
      <TimeSpinner events={sortedEvents} onSelectEvent={scrollToEvent} language={language} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden md:block"></div>
          
          {/* Vertical Line (Mobile) */}
          <div className="absolute left-6 h-full w-0.5 bg-gradient-to-b from-gray-300 to-transparent md:hidden"></div>

          {/* Events */}
          <div className="flex flex-col gap-12 md:gap-24 relative">
            {sortedEvents.map((event, index) => (
              <div key={event.id} id={`event-${event.id}`}>
                <EventCard 
                  event={event}
                  align={index % 2 === 0 ? 'left' : 'right'}
                  onDelete={handleDeleteEvent}
                  onEdit={handleEditEvent} 
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Editor Modal */}
      <EventEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <h3 className="font-serif text-2xl text-cobalt font-bold mb-4">
            {language === 'zh' ? '瓷器编年史' : 'Cíqì Chronicles'}
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {language === 'zh' 
              ? '设计为综合学习工具和个人档案。将艺术史的学术严谨性与个人叙事的温暖相融合。' 
              : 'Designed as a comprehensive study tool and personal archive. Blending the academic rigor of art history with the warmth of personal narrative.'}
          </p>
          
          <button 
            onClick={handleResetData}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest mt-4"
          >
            <RotateCcw size={12} />
            {language === 'zh' ? '重置数据' : 'Reset All Data'}
          </button>

          <p className="text-xs text-gray-400 uppercase tracking-widest mt-6">© {new Date().getFullYear()} Student Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;