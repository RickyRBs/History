export enum EventType {
  COURSE = 'COURSE', // Lecture/Recitation material
  PERSONAL = 'PERSONAL', // Family history, personal notes
  HISTORICAL = 'HISTORICAL' // General context
}

export interface TimelineEvent {
  id: string;
  title: string;
  titleZh?: string; // Chinese Title
  year: string;
  yearZh?: string; // Chinese Year
  sortYear: number;
  description: string;
  descriptionZh?: string; // Chinese Description
  type: EventType;
  imageUrl?: string;
  tags?: string[];
  tagsZh?: string[]; // Chinese Tags
}

export interface AiEnhanceResponse {
  expandedDescription: string;
  historicalContext: string;
  suggestedTags: string[];
}