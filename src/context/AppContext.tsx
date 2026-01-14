import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Property,
  Unit,
  TenantAssignment,
  Payment,
  MaintenanceRequest,
  VacateNotice,
  RentStatus,
} from '@/types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  properties: Property[];
  units: Unit[];
  assignments: TenantAssignment[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
  vacateNotices: VacateNotice[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  assignTenant: (assignment: Omit<TenantAssignment, 'id'>) => void;
  updateUnit: (unitId: string, updates: Partial<Unit>) => void;
  makePayment: (payment: Omit<Payment, 'id' | 'date' | 'status'>) => void;
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => void;
  updateMaintenanceRequest: (id: string, status: 'pending' | 'resolved') => void;
  addVacateNotice: (notice: Omit<VacateNotice, 'id' | 'submittedAt'>) => void;
  getRentStatus: (unitId: string, month: string) => RentStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: 'landlord-1',
    email: 'landlord@test.com',
    password: 'password123',
    role: 'landlord',
    name: 'John Landlord',
  },
  {
    id: 'tenant-1',
    email: 'tenant1@test.com',
    password: 'password123',
    role: 'tenant',
    name: 'Sarah Tenant',
  },
  {
    id: 'tenant-2',
    email: 'tenant2@test.com',
    password: 'password123',
    role: 'tenant',
    name: 'Mike Johnson',
  },
  {
    id: 'tenant-3',
    email: 'tenant3@test.com',
    password: 'password123',
    role: 'tenant',
    name: 'Emma Davis',
  },
];

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    landlordId: 'landlord-1',
    name: 'Sunset Apartments',
    address: '123 Main St, Springfield',
    createdAt: '2024-01-15',
  },
  {
    id: 'prop-2',
    landlordId: 'landlord-1',
    name: 'Green Valley Complex',
    address: '456 Oak Ave, Springfield',
    createdAt: '2024-02-01',
  },
];

const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    propertyId: 'prop-1',
    name: 'Unit 101',
    monthlyRent: 1200,
    dueDate: 1,
    gracePeriodDays: 5,
  },
  {
    id: 'unit-2',
    propertyId: 'prop-1',
    name: 'Unit 102',
    monthlyRent: 1350,
    dueDate: 1,
    gracePeriodDays: 5,
  },
  {
    id: 'unit-3',
    propertyId: 'prop-1',
    name: 'Unit 201',
    monthlyRent: 1100,
    dueDate: 1,
    gracePeriodDays: 5,
  },
  {
    id: 'unit-4',
    propertyId: 'prop-2',
    name: 'Unit A',
    monthlyRent: 1500,
    dueDate: 1,
    gracePeriodDays: 3,
  },
];

const mockAssignments: TenantAssignment[] = [
  {
    id: 'assign-1',
    unitId: 'unit-1',
    tenantId: 'tenant-1',
    moveInDate: '2024-01-01',
    isActive: true,
  },
  {
    id: 'assign-2',
    unitId: 'unit-2',
    tenantId: 'tenant-2',
    moveInDate: '2024-02-01',
    isActive: true,
  },
  {
    id: 'assign-3',
    unitId: 'unit-3',
    tenantId: 'tenant-3',
    moveInDate: '2024-03-01',
    isActive: true,
  },
];

const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    unitId: 'unit-1',
    tenantId: 'tenant-1',
    amount: 1200,
    date: '2025-12-28',
    month: '2026-01',
    status: 'completed',
  },
  {
    id: 'pay-2',
    unitId: 'unit-2',
    tenantId: 'tenant-2',
    amount: 1350,
    date: '2025-11-30',
    month: '2025-12',
    status: 'completed',
  },
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-1',
    unitId: 'unit-1',
    tenantId: 'tenant-1',
    description: 'Kitchen faucet is leaking',
    status: 'pending',
    createdAt: '2026-01-10',
  },
  {
    id: 'maint-2',
    unitId: 'unit-3',
    tenantId: 'tenant-3',
    description: 'Heater not working properly',
    status: 'resolved',
    createdAt: '2025-12-20',
    resolvedAt: '2025-12-22',
  },
];

const mockVacateNotices: VacateNotice[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [assignments, setAssignments] = useState<TenantAssignment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [vacateNotices, setVacateNotices] = useState<VacateNotice[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedProperties = localStorage.getItem('properties');
    setProperties(savedProperties ? JSON.parse(savedProperties) : mockProperties);

    const savedUnits = localStorage.getItem('units');
    setUnits(savedUnits ? JSON.parse(savedUnits) : mockUnits);

    const savedAssignments = localStorage.getItem('assignments');
    setAssignments(savedAssignments ? JSON.parse(savedAssignments) : mockAssignments);

    const savedPayments = localStorage.getItem('payments');
    setPayments(savedPayments ? JSON.parse(savedPayments) : mockPayments);

    const savedMaintenanceRequests = localStorage.getItem('maintenanceRequests');
    setMaintenanceRequests(
      savedMaintenanceRequests ? JSON.parse(savedMaintenanceRequests) : mockMaintenanceRequests
    );

    const savedVacateNotices = localStorage.getItem('vacateNotices');
    setVacateNotices(savedVacateNotices ? JSON.parse(savedVacateNotices) : mockVacateNotices);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('maintenanceRequests', JSON.stringify(maintenanceRequests));
  }, [maintenanceRequests]);

  useEffect(() => {
    localStorage.setItem('vacateNotices', JSON.stringify(vacateNotices));
  }, [vacateNotices]);

  const login = (email: string, password: string): boolean => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addProperty = (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProperties([...properties, newProperty]);
  };

  const addUnit = (unit: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unit,
      id: `unit-${Date.now()}`,
    };
    setUnits([...units, newUnit]);
  };

  const assignTenant = (assignment: Omit<TenantAssignment, 'id'>) => {
    const newAssignment: TenantAssignment = {
      ...assignment,
      id: `assign-${Date.now()}`,
    };
    setAssignments([...assignments, newAssignment]);
  };

  const updateUnit = (unitId: string, updates: Partial<Unit>) => {
    setUnits(units.map((u) => (u.id === unitId ? { ...u, ...updates } : u)));
  };

  const makePayment = (payment: Omit<Payment, 'id' | 'date' | 'status'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setPayments([...payments, newPayment]);
  };

  const addMaintenanceRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMaintenanceRequests([...maintenanceRequests, newRequest]);
  };

  const updateMaintenanceRequest = (id: string, status: 'pending' | 'resolved') => {
    setMaintenanceRequests(
      maintenanceRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              resolvedAt: status === 'resolved' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : req
      )
    );
  };

  const addVacateNotice = (notice: Omit<VacateNotice, 'id' | 'submittedAt'>) => {
    const newNotice: VacateNotice = {
      ...notice,
      id: `vacate-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setVacateNotices([...vacateNotices, newNotice]);
  };

  const getRentStatus = (unitId: string, month: string): RentStatus => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return 'pending';

    const payment = payments.find((p) => p.unitId === unitId && p.month === month && p.status === 'completed');
    if (payment) return 'paid';

    const now = new Date();
    const [year, monthNum] = month.split('-').map(Number);
    const dueDate = new Date(year, monthNum - 1, unit.dueDate);
    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + unit.gracePeriodDays);

    if (now <= dueDate) return 'pending';
    if (now <= gracePeriodEnd) return 'overdue-grace';
    return 'overdue-late';
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        properties,
        units,
        assignments,
        payments,
        maintenanceRequests,
        vacateNotices,
        login,
        logout,
        addProperty,
        addUnit,
        assignTenant,
        updateUnit,
        makePayment,
        addMaintenanceRequest,
        updateMaintenanceRequest,
        addVacateNotice,
        getRentStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
