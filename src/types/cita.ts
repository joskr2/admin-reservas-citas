export enum UserRole {
  PSYCHOLOGIST = "psychologist",
  CLIENT = "client",
  ADMIN = "admin",
  USER = "user",
}

export interface AppointmentUser {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface AppointmentRoom {
  id: number;
  roomNumber: string;
  available?: boolean;
}

export interface Appointment {
  id: string;
  psychologist: AppointmentUser;
  client: AppointmentUser;
  date: string;
  startTime: string;
  endTime: string;
  room: AppointmentRoom;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "in_progress"
    | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentCreateData {
  psychologistId: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  status?: string;
}
