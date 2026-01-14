import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Wrench, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function MaintenanceTab() {
  const { maintenanceRequests, updateMaintenanceRequest, units, properties, users, assignments, currentUser } =
    useApp();

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser?.id);
  const landlordUnits = units.filter((u) =>
    landlordProperties.some((p) => p.id === u.propertyId)
  );

  const landlordRequests = maintenanceRequests.filter((req) =>
    landlordUnits.some((u) => u.id === req.unitId)
  );

  const pendingRequests = landlordRequests.filter((req) => req.status === 'pending');
  const resolvedRequests = landlordRequests.filter((req) => req.status === 'resolved');

  const getUnitInfo = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    const property = properties.find((p) => p.id === unit?.propertyId);
    return `${unit?.name} - ${property?.name}`;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = users.find((u) => u.id === tenantId);
    return tenant?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Maintenance Requests</h2>
        <p className="text-sm text-muted-foreground">
          Manage maintenance issues reported by tenants
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-semibold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-semibold">{resolvedRequests.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-yellow-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(request.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="font-medium">{getUnitInfo(request.unitId)}</p>
                        <p className="text-sm text-muted-foreground">Tenant: {getTenantName(request.tenantId)}</p>
                        <p className="text-sm mt-2">{request.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => updateMaintenanceRequest(request.id, 'resolved')}
                      className="w-full"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resolved Requests */}
      {resolvedRequests.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">Resolved Requests</h3>
          <div className="space-y-3">
            {resolvedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Reported: {format(new Date(request.createdAt), 'MMM d')} • Resolved:{' '}
                            {request.resolvedAt && format(new Date(request.resolvedAt), 'MMM d')}
                          </span>
                        </div>
                        <p className="font-medium">{getUnitInfo(request.unitId)}</p>
                        <p className="text-sm text-muted-foreground">Tenant: {getTenantName(request.tenantId)}</p>
                        <p className="text-sm mt-2 text-muted-foreground">{request.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {landlordRequests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No maintenance requests</p>
            <p className="text-sm text-muted-foreground">Requests from tenants will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
