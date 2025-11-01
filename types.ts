export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface MessageAttachment {
  mimeType: string;
  data: string; // base64 encoded string
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  attachment?: MessageAttachment;
  isRead?: boolean;
  cost?: number; // Cost of the message in coins
}

export enum Personality {
  FRIENDLY = 'Friendly',
  PLAYFUL = 'Playful',
  CALM = 'Calm Supportive',
}

export enum SafetyLevel {
  DEFAULT = 'پیش‌فرض (توصیه می‌شود)',
  RELAXED = 'آسان‌گیر',
  NO_FILTERS = 'بدون فیلتر (با احتیاط استفاده شود)',
}

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this should be hashed.
  balance: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  personality: Personality;
  systemPrompt: string;
  safetyLevel: SafetyLevel;
  lastUpdated: string;
  characterId?: string;
  userId?: string; // Link to a user
}

export interface Character {
  id:string;
  name: string;
  age: number;
  imageUrl: string;
  gifUrl?: string;
  bio: string;
  systemPrompt: string;
  tags?: string[]; // Added for character tagging/filtering
  // Additional details for the profile view
  about?: Record<string, string>;
  gallery?: string[];
}

export type Page = 'landing' | 'chat' | 'admin' | 'privacy' | 'auth' | 'profile';