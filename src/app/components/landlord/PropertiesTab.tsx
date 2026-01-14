import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Plus, Building2, MapPin } from 'lucide-react';

export function PropertiesTab() {
  const { properties, addProperty, currentUser, units, assignments, users } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
  });

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addProperty({
        ...newProperty,
        landlordId: currentUser.id,
      });
      setNewProperty({ name: '', address: '' });
      setIsDialogOpen(false);
    }
  };

  const getPropertyStats = (propertyId: string) => {
    const propertyUnits = units.filter((u) => u.propertyId === propertyId);
    const occupiedUnits = propertyUnits.filter((u) =>
      assignments.some((a) => a.unitId === u.id && a.isActive)
    );
    return {
      totalUnits: propertyUnits.length,
      occupiedUnits: occupiedUnits.length,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">Manage your rental properties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-name">Property Name</Label>
                <Input
                  id="property-name"
                  placeholder="e.g., Sunset Apartments"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-address">Address</Label>
                <Input
                  id="property-address"
                  placeholder="e.g., 123 Main St, Springfield"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Property
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {landlordProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No properties yet</p>
            <p className="text-sm text-muted-foreground">Add your first property to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {landlordProperties.map((property) => {
            const stats = getPropertyStats(property.id);
            return (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="text-2xl font-semibold">{stats.totalUnits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Occupied</p>
                      <p className="text-2xl font-semibold">{stats.occupiedUnits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}