import React, { useState, useMemo, useEffect } from 'react';
import { TimelineEvent, EventType } from './types';
import { INITIAL_EVENTS } from './constants';
import EventCard from './components/EventCard';
import TimeSpinner from './components/TimeSpinner';
import EventEditor from './components/EventEditor';
import { Languages, Plus } from 'lucide-react';

function App() {
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

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

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-celadon selection:text-ink pb-20">
      
      {/* Header Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
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
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="font-serif text-2xl text-cobalt font-bold mb-4">
            {language === 'zh' ? '瓷器编年史' : 'Cíqì Chronicles'}
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {language === 'zh' 
              ? '设计为综合学习工具和个人档案。将艺术史的学术严谨性与个人叙事的温暖相融合。' 
              : 'Designed as a comprehensive study tool and personal archive. Blending the academic rigor of art history with the warmth of personal narrative.'}
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} Student Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;