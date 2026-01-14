import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { UserMinus, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export function VacateNoticesTab() {
  const { vacateNotices, units, properties, users, currentUser } = useApp();

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser?.id);
  const landlordUnits = units.filter((u) =>
    landlordProperties.some((p) => p.id === u.propertyId)
  );

  const landlordNotices = vacateNotices.filter((notice) =>
    landlordUnits.some((u) => u.id === notice.unitId)
  );

  const getUnitInfo = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    const property = properties.find((p) => p.id === unit?.propertyId);
    return `${unit?.name} - ${property?.name}`;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = users.find((u) => u.id === tenantId);
    return tenant?.name || 'Unknown';
  };

  const getDaysUntilVacate = (vacateDate: string) => {
    return differenceInDays(new Date(vacateDate), new Date());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Vacate Notices</h2>
        <p className="text-sm text-muted-foreground">
          Track tenants planning to move out
        </p>
      </div>

      {landlordNotices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserMinus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No vacate notices</p>
            <p className="text-sm text-muted-foreground">Move-out notices from tenants will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {landlordNotices.map((notice) => {
            const daysUntil = getDaysUntilVacate(notice.vacateDate);
            const isPast = daysUntil < 0;

            return (
              <Card key={notice.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={isPast ? 'secondary' : 'default'}>
                            {isPast ? 'Vacated' : `${daysUntil} days left`}
                          </Badge>
                        </div>
                        <p className="font-medium">{getUnitInfo(notice.unitId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Tenant: {getTenantName(notice.tenantId)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium">
                          {format(new Date(notice.submittedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Move-Out Date</p>
                        <p className="text-sm font-medium">
                          {format(new Date(notice.vacateDate), 'MMM d, yyyy')}
                        </p>
                      </div>
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
