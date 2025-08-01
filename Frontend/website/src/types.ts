// types.ts - Add this file to your src folder

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  role: string;
  createdAt: string;
}

export interface Event {
  title: string;
  description: string;
  date: string;
  day: string;
  time: string;
  image: string;
  participants: string[];
}

export interface Program {
  _id: string;
  title: string;
  description: string;
  startingDate: string;
  endingDate: string;
  day: string;
  time: string;
  image: string;
  participants: string[];
}
export interface Job {
  _id: string;
  position: string;
  jobLink:string;
  location:string;
  description: string;
  workMode: string;
  postedAt:String

  companyName: string;
  companyEmail: string;
}

export interface Donation {
  campaign: string;
  amount: number;
  date: string;
  method: string;
 receiptUrl: string;
 approved: boolean;
}
export interface JobType {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  mode: 'remote' | 'onsite' | 'hybrid';
  applyLink: string;
  contactEmail: string;
}

export interface UserData {
  user: User;
  userEvents: Event[];
  userPrograms: Program[];
  donations: Donation[];
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  status: number;
  error?: string;
}

export interface ApiErrorResponse {
  msg: string;
  [key: string]: any;
}

export interface ApiCallOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  requiresAuth?: boolean;
}

export type TabType = 'dashboard' | 'profile' | 'courses' |'events' | 'programs' | 'donations' | 'jobs' | 'jobType';