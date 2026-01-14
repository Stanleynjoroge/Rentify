import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Home, User, DollarSign, Calendar } from 'lucide-react';

export function UnitsTab() {
  const { properties, units, addUnit, assignTenant, currentUser, assignments, users } = useApp();
  const [isAddUnitDialogOpen, setIsAddUnitDialogOpen] = useState(false);
  const [isAssignTenantDialogOpen, setIsAssignTenantDialogOpen] = useState(false);
  const [selectedUnitForAssignment, setSelectedUnitForAssignment] = useState<string>('');
  const [newUnit, setNewUnit] = useState({
    propertyId: '',
    name: '',
    monthlyRent: '',
    dueDate: '1',
    gracePeriodDays: '5',
  });
  const [newAssignment, setNewAssignment] = useState({
    tenantId: '',
    moveInDate: '',
  });

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser?.id);
  const landlordUnits = units.filter((u) =>
    landlordProperties.some((p) => p.id === u.propertyId)
  );

  const availableTenants = users.filter((u) => u.role === 'tenant');

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    addUnit({
      propertyId: newUnit.propertyId,
      name: newUnit.name,
      monthlyRent: parseFloat(newUnit.monthlyRent),
      dueDate: parseInt(newUnit.dueDate),
      gracePeriodDays: parseInt(newUnit.gracePeriodDays),
    });
    setNewUnit({
      propertyId: '',
      name: '',
      monthlyRent: '',
      dueDate: '1',
      gracePeriodDays: '5',
    });
    setIsAddUnitDialogOpen(false);
  };

  const handleAssignTenant = (e: React.FormEvent) => {
    e.preventDefault();
    assignTenant({
      unitId: selectedUnitForAssignment,
      tenantId: newAssignment.tenantId,
      moveInDate: newAssignment.moveInDate,
      isActive: true,
    });
    setNewAssignment({ tenantId: '', moveInDate: '' });
    setIsAssignTenantDialogOpen(false);
    setSelectedUnitForAssignment('');
  };

  const getUnitTenant = (unitId: string) => {
    const assignment = assignments.find((a) => a.unitId === unitId && a.isActive);
    if (assignment) {
      return users.find((u) => u.id === assignment.tenantId);
    }
    return null;
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Units</h2>
          <p className="text-sm text-muted-foreground">Manage rental units and tenants</p>
        </div>
        <Dialog open={isAddUnitDialogOpen} onOpenChange={setIsAddUnitDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit-property">Property</Label>
                <Select
                  value={newUnit.propertyId}
                  onValueChange={(value) => setNewUnit({ ...newUnit, propertyId: value })}
                  required
                >
                  <SelectTrigger id="unit-property">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {landlordProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit-name">Unit Name/Number</Label>
                <Input
                  id="unit-name"
                  placeholder="e.g., Unit 101, Apt A"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-rent">Monthly Rent ($)</Label>
                <Input
                  id="monthly-rent"
                  type="number"
                  step="0.01"
                  placeholder="1200"
                  value={newUnit.monthlyRent}
                  onChange={(e) => setNewUnit({ ...newUnit, monthlyRent: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date (Day of Month)</Label>
                  <Input
                    id="due-date"
                    type="number"
                    min="1"
                    max="31"
                    value={newUnit.dueDate}
                    onChange={(e) => setNewUnit({ ...newUnit, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grace-period">Grace Period (Days)</Label>
                  <Input
                    id="grace-period"
                    type="number"
                    min="0"
                    value={newUnit.gracePeriodDays}
                    onChange={(e) => setNewUnit({ ...newUnit, gracePeriodDays: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Unit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {landlordUnits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No units yet</p>
            <p className="text-sm text-muted-foreground">Add units to start managing rentals</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {landlordUnits.map((unit) => {
            const tenant = getUnitTenant(unit.id);
            const isOccupied = !!tenant;

            return (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                      <CardDescription>{getPropertyName(unit.propertyId)}</CardDescription>
                    </div>
                    <Badge variant={isOccupied ? 'default' : 'secondary'}>
                      {isOccupied ? 'Occupied' : 'Vacant'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${unit.monthlyRent}/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Due: Day {unit.dueDate} (Grace: {unit.gracePeriodDays} days)
                      </span>
                    </div>
                    {tenant && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{tenant.name}</span>
                      </div>
                    )}
                  </div>

                  {!isOccupied && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedUnitForAssignment(unit.id);
                        setIsAssignTenantDialogOpen(true);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Assign Tenant
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Assign Tenant Dialog */}
      <Dialog open={isAssignTenantDialogOpen} onOpenChange={setIsAssignTenantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tenant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignTenant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant</Label>
              <Select
                value={newAssignment.tenantId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, tenantId: value })}
                required
              >
                <SelectTrigger id="tenant">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {availableTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="move-in-date">Move-In Date</Label>
              <Input
                id="move-in-date"
                type="date"
                value={newAssignment.moveInDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, moveInDate: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Assign Tenant
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
