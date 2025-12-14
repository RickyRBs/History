import React from 'react';
import { TimelineEvent, EventType } from '../types';
import { Tag, Pencil, Trash2 } from 'lucide-react';

interface EventCardProps {
  event: TimelineEvent;
  align: 'left' | 'right';
  onDelete: (id: string) => void;
  onEdit: (event: TimelineEvent) => void;
  language: 'en' | 'zh';
}

const EventCard: React.FC<EventCardProps> = ({ event, align, onDelete, onEdit, language }) => {
  const isCourse = event.type === EventType.COURSE;
  const isPersonal = event.type === EventType.PERSONAL;
  
  const borderColor = isCourse 
    ? 'border-cobalt' 
    : isPersonal 
      ? 'border-china-red' 
      : 'border-gray-400';

  const typeLabelEn = isCourse ? 'Lecture / Recitation' : isPersonal ? 'Personal Interest' : 'Historical Context';
  const typeLabelZh = isCourse ? '课程资料' : isPersonal ? '私人档案' : '历史背景';
  const typeLabel = language === 'zh' ? typeLabelZh : typeLabelEn;

  const accentColor = isCourse ? 'text-cobalt' : isPersonal ? 'text-china-red' : 'text-gray-500';

  // Content Selection
  const title = language === 'zh' ? (event.titleZh || event.title) : event.title;
  const year = language === 'zh' ? (event.yearZh || event.year) : event.year;
  const description = language === 'zh' ? (event.descriptionZh || event.description) : event.description;
  const tags = language === 'zh' ? (event.tagsZh || event.tags) : event.tags;

  return (
    <div className={`relative w-full md:w-[calc(50%-40px)] ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      
      {/* Connector Dot */}
      <div className={`absolute top-8 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 hidden md:block transition-transform hover:scale-125
        ${isCourse ? 'bg-cobalt' : isPersonal ? 'bg-china-red' : 'bg-gray-400'}
        ${align === 'right' ? '-left-[50px]' : '-right-[50px]'}
      `}></div>

      {/* Connector Line/Dot (Mobile) */}
      <div className={`absolute left-[20px] top-8 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 md:hidden
        ${isCourse ? 'bg-cobalt' : isPersonal ? 'bg-china-red' : 'bg-gray-400'}
      `}></div>

      {/* Card Content */}
      <div className={`
        ml-12 md:ml-0 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] 
        border-t-4 ${borderColor}
        hover:shadow-[0_15px_30px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-1 
        transition-all duration-300 group overflow-hidden
      `}>
        <div className="md:flex h-full">
          {/* Image Section */}
          {event.imageUrl && (
            <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-gray-100">
               <img 
                 src={event.imageUrl} 
                 alt={title} 
                 className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r"></div>
            </div>
          )}

          <div className={`p-8 ${event.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
            {/* Header Info */}
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}>
                {typeLabel}
              </span>
              
              {/* Action Buttons (Visible on Hover) */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(event)}
                  className="text-gray-400 hover:text-cobalt transition-colors p-1"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => onDelete(event.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="font-serif text-3xl text-ink font-bold mb-1 leading-tight">{title}</h3>
            <p className="text-sm font-semibold text-gray-400 mb-6 font-mono tracking-wide">{year}</p>

            <div className="prose prose-sm prose-slate max-w-none mb-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-sans text-base">
                {description}
              </p>
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center text-xs text-gray-500 px-2 py-1 rounded bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100 hover:text-cobalt">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;