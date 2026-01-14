export type UserRole = 'landlord' | 'tenant';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Property {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  name: string;
  monthlyRent: number;
  dueDate: number; // day of month (1-31)
  gracePeriodDays: number;
}

export interface TenantAssignment {
  id: string;
  unitId: string;
  tenantId: string;
  moveInDate: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  unitId: string;
  tenantId: string;
  amount: number;
  date: string;
  month: string; // YYYY-MM format
  status: 'completed' | 'pending' | 'failed';
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  tenantId: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface VacateNotice {
  id: string;
  unitId: string;
  tenantId: string;
  vacateDate: string;
  submittedAt: string;
}

export type RentStatus = 'paid' | 'overdue-grace' | 'overdue-late' | 'pending';
