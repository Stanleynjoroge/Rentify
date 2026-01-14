import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { LandingPage } from '@/app/components/LandingPage';
import { LoginPage } from '@/app/components/LoginPage';
import { LandlordDashboard } from '@/app/components/LandlordDashboard';
import { TenantDashboard } from '@/app/components/TenantDashboard';
import { Toaster } from '@/app/components/ui/sonner';

function AppContent() {
  const { currentUser } = useApp();
  const [hasStarted, setHasStarted] = useState(false);

  // Show landing page first
  if (!hasStarted && !currentUser) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  // Show login if not authenticated
  if (!currentUser) {
    return <LoginPage />;
  }

  // Show appropriate dashboard based on role
  if (currentUser.role === 'landlord') {
    return <LandlordDashboard />;
  }

  return <TenantDashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}
