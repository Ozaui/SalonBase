// User types
export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt?: string;
}

// Appointment types
export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  isActive: boolean;
}

// Payment types
export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  method: "cash" | "card" | "online";
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface AppointmentFormData {
  service: string;
  date: string;
  time: string;
  notes?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
}
