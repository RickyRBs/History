import React, { useState } from 'react';
import { TimelineEvent } from '../types';

interface TimeSpinnerProps {
  events: TimelineEvent[];
  onSelectEvent: (id: string) => void;
  language: 'en' | 'zh';
}

const TimeSpinner: React.FC<TimeSpinnerProps> = ({ events, onSelectEvent, language }) => {
  const count = events.length;
  
  // 3D Layout Config
  const anglePerItem = 360 / count;
  const radius = 380; 

  // State: Represents the float index in the timeline (0 to count-1)
  const [scrollPos, setScrollPos] = useState(0);

  // Derive rotation from the slider position
  // 0 -> 0 degrees
  // 1 -> -anglePerItem degrees
  const rotation = -scrollPos * anglePerItem;

  // Calculate active index
  const activeIndex = Math.round(scrollPos) % count;
  const activeEvent = events[activeIndex];

  // Helper for localized text
  const getText = (event: TimelineEvent | undefined, field: 'title' | 'year') => {
    if (!event) return '';
    if (language === 'zh') {
        if (field === 'title') return event.titleZh || event.title;
        if (field === 'year') return event.yearZh || event.year;
    }
    return event[field];
  };

  return (
    <div className="w-full h-[85vh] flex flex-col items-center justify-center relative overflow-hidden bg-[#F9F7F2]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Atmospheric Ink Wash Background */}
         <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fan_Kuan_-_Travelers_Among_Mountains_and_Streams_-_Google_Art_Project.jpg/1280px-Fan_Kuan_-_Travelers_Among_Mountains_and_Streams_-_Google_Art_Project.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] mix-blend-multiply scale-110 blur-[1px]"
            alt="Fan Kuan Landscape"
         />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cobalt/5 rounded-full blur-3xl"></div>
         <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#F9F7F2] via-[#F9F7F2]/80 to-transparent z-10"></div>
         <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/80 to-transparent z-10"></div>
      </div>

      {/* Main 3D Scene */}
      <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center perspective-1000 z-10">
        <div 
          className="relative w-[240px] h-[360px] preserve-3d transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {events.map((event, index) => {
            const angle = index * anglePerItem;
            const cardTitle = language === 'zh' 
              ? (event.titleZh?.split('：')[1] || event.titleZh || event.title)
              : event.title.split(':')[1] || event.title;
            
            return (
              <div
                key={event.id}
                className="absolute top-0 left-0 w-full h-full backface-hidden flex flex-col items-center justify-center bg-transparent"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                {/* The Porcelain Card */}
                <div 
                  className={`
                    relative w-full h-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 cursor-pointer bg-white group
                    ${activeIndex === index ? 'border-cobalt scale-110 shadow-cobalt/30 ring-4 ring-cobalt/20 grayscale-0' : 'border-gray-200 opacity-60 grayscale scale-90'}
                  `}
                  onClick={() => onSelectEvent(event.id)}
                >
                  {/* Image */}
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={cardTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
                  )}

                  {/* Decorative Border */}
                  <div className="absolute inset-2 border border-white/40 rounded-xl pointer-events-none z-10"></div>

                  {/* Gloss Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none z-20"></div>
                </div>

                {/* Reflection Effect */}
                <div 
                  className="absolute -bottom-24 w-full h-full opacity-30 transform scale-y-[-1] blur-sm mask-linear-fade"
                  style={{
                     maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent)',
                     WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent)'
                  }}
                >
                   {event.imageUrl && <img src={event.imageUrl} className="w-full h-full object-cover rounded-2xl" alt="" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Overlay (Simplified - Just Year and Title) */}
      <div className="absolute top-[10%] text-center z-20 pointer-events-none px-4 select-none w-full">
        <h2 className="text-cobalt text-base md:text-lg font-bold tracking-[0.5em] uppercase mb-4 animate-fade-in font-sans">
          {getText(activeEvent, 'year')}
        </h2>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-ink drop-shadow-sm transition-all duration-300">
          {getText(activeEvent, 'title').split('：')[0].split(':')[0]}
        </h1>
      </div>

      {/* Slider Control */}
      <div className="absolute bottom-16 w-full flex flex-col items-center z-30 px-8 md:px-0">
        <input 
          type="range" 
          min={0} 
          max={count - 1} 
          step={0.01}
          value={scrollPos}
          onChange={(e) => setScrollPos(parseFloat(e.target.value))}
          className="w-full max-w-xl h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-cobalt hover:accent-cobalt-dark transition-all"
        />
        <p className="mt-4 text-xs text-gray-400 font-mono uppercase tracking-widest">
           {language === 'zh' ? '拖动时间轴' : 'Drag to Rotate History'}
        </p>
      </div>
      
      <style>{`
        .perspective-1000 {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: visible; 
        }
      `}</style>
    </div>
  );
};

export default TimeSpinner;