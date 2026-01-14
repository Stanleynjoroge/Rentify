import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { LogOut, Building2, DollarSign, Wrench, UserMinus } from 'lucide-react';
import { TenantRentTab } from './tenant/TenantRentTab';
import { TenantMaintenanceTab } from './tenant/TenantMaintenanceTab';
import { TenantVacateTab } from './tenant/TenantVacateTab';

export function TenantDashboard() {
  const { currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState('rent');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-900 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold bg-gradient-to-r from-purple-600 to-blue-900 bg-clip-text text-transparent">
                  Rentify
                </h1>
                <p className="text-sm text-muted-foreground">{currentUser?.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="rent" className="flex-col gap-1 h-auto py-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Rent</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-col gap-1 h-auto py-2">
              <Wrench className="h-4 w-4" />
              <span className="text-xs">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="vacate" className="flex-col gap-1 h-auto py-2">
              <UserMinus className="h-4 w-4" />
              <span className="text-xs">Move Out</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent">
            <TenantRentTab />
          </TabsContent>

          <TabsContent value="maintenance">
            <TenantMaintenanceTab />
          </TabsContent>

          <TabsContent value="vacate">
            <TenantVacateTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}