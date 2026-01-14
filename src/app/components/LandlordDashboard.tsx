import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { LogOut, Building2, Home, DollarSign, Wrench, UserMinus } from 'lucide-react';
import { PropertiesTab } from './landlord/PropertiesTab';
import { UnitsTab } from './landlord/UnitsTab';
import { RentStatusTab } from './landlord/RentStatusTab';
import { MaintenanceTab } from './landlord/MaintenanceTab';
import { VacateNoticesTab } from './landlord/VacateNoticesTab';

export function LandlordDashboard() {
  const { currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState('rent-status');

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundImage: 'url("/landing-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/20 bg-white/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-900 p-2 rounded-lg shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold bg-gradient-to-r from-purple-600 to-blue-900 bg-clip-text text-transparent">
                  Rentify
                </h1>
                <p className="text-sm text-muted-foreground">{currentUser?.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="backdrop-blur-sm bg-white/50 hover:bg-white/70">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg">
            <TabsTrigger value="rent-status" className="flex-col gap-1 h-auto py-2 data-[state=active]:bg-white/80">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Rent</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex-col gap-1 h-auto py-2 data-[state=active]:bg-white/80">
              <Building2 className="h-4 w-4" />
              <span className="text-xs">Properties</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="flex-col gap-1 h-auto py-2 data-[state=active]:bg-white/80">
              <Home className="h-4 w-4" />
              <span className="text-xs">Units</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-col gap-1 h-auto py-2 data-[state=active]:bg-white/80">
              <Wrench className="h-4 w-4" />
              <span className="text-xs">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="vacate" className="flex-col gap-1 h-auto py-2 data-[state=active]:bg-white/80">
              <UserMinus className="h-4 w-4" />
              <span className="text-xs">Vacate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent-status">
            <RentStatusTab />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesTab />
          </TabsContent>

          <TabsContent value="units">
            <UnitsTab />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTab />
          </TabsContent>

          <TabsContent value="vacate">
            <VacateNoticesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}