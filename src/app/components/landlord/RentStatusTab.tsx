import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { DollarSign, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export function RentStatusTab() {
  const { properties, units, assignments, users, getRentStatus, currentUser } = useApp();

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser?.id);
  const landlordUnits = units.filter((u) =>
    landlordProperties.some((p) => p.id === u.propertyId)
  );

  const occupiedUnits = landlordUnits.filter((u) =>
    assignments.some((a) => a.unitId === u.id && a.isActive)
  );

  // Current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property?.name || 'Unknown';
  };

  const getTenantName = (unitId: string) => {
    const assignment = assignments.find((a) => a.unitId === unitId && a.isActive);
    if (assignment) {
      const tenant = users.find((u) => u.id === assignment.tenantId);
      return tenant?.name || 'Unknown Tenant';
    }
    return 'No Tenant';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'overdue-grace':
        return (
          <Badge variant="default" className="bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Grace Period
          </Badge>
        );
      case 'overdue-late':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const stats = {
    paid: occupiedUnits.filter((u) => getRentStatus(u.id, currentMonth) === 'paid').length,
    overdue: occupiedUnits.filter(
      (u) =>
        getRentStatus(u.id, currentMonth) === 'overdue-grace' ||
        getRentStatus(u.id, currentMonth) === 'overdue-late'
    ).length,
    pending: occupiedUnits.filter((u) => getRentStatus(u.id, currentMonth) === 'pending').length,
  };

  const totalRent = occupiedUnits.reduce((sum, unit) => sum + unit.monthlyRent, 0);
  const collectedRent = occupiedUnits
    .filter((u) => getRentStatus(u.id, currentMonth) === 'paid')
    .reduce((sum, unit) => sum + unit.monthlyRent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Rent Status</h2>
        <p className="text-sm text-muted-foreground">Track rent payments for {currentMonth}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalRent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">${collectedRent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue Units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Status List */}
      <div>
        <h3 className="font-medium mb-4">Unit Details</h3>
        {occupiedUnits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No occupied units</p>
              <p className="text-sm text-muted-foreground">Assign tenants to start tracking rent</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {occupiedUnits.map((unit) => {
              const status = getRentStatus(unit.id, currentMonth);
              return (
                <Card key={unit.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{unit.name}</p>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{getPropertyName(unit.propertyId)}</p>
                        <p className="text-sm text-muted-foreground">{getTenantName(unit.id)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${unit.monthlyRent}</p>
                        <p className="text-xs text-muted-foreground">Due: Day {unit.dueDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
