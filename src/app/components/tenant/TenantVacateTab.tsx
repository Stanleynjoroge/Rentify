import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { UserMinus, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function TenantVacateTab() {
  const { currentUser, assignments, vacateNotices, addVacateNotice, units, properties } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vacateDate, setVacateDate] = useState('');

  const tenantAssignment = assignments.find(
    (a) => a.tenantId === currentUser?.id && a.isActive
  );

  const unit = tenantAssignment ? units.find((u) => u.id === tenantAssignment.unitId) : null;
  const property = unit ? properties.find((p) => p.id === unit.propertyId) : null;

  const existingNotice = vacateNotices.find(
    (notice) => notice.tenantId === currentUser?.id && notice.unitId === tenantAssignment?.unitId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantAssignment && currentUser) {
      addVacateNotice({
        unitId: tenantAssignment.unitId,
        tenantId: currentUser.id,
        vacateDate,
      });
      toast.success('Vacate notice submitted successfully!');
      setVacateDate('');
      setIsDialogOpen(false);
    }
  };

  if (!tenantAssignment || !unit || !property) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <UserMinus className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No unit assigned</p>
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const daysUntilVacate = existingNotice ? differenceInDays(new Date(existingNotice.vacateDate), new Date()) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Move Out</h2>
        <p className="text-sm text-muted-foreground">Submit notice when you plan to move out</p>
      </div>

      {/* Current Unit Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Rental</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Unit</span>
            <span className="font-medium">{unit.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Property</span>
            <span className="font-medium">{property.name}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Move-In Date</span>
            <span className="font-medium">{format(new Date(tenantAssignment.moveInDate), 'MMM d, yyyy')}</span>
          </div>
        </CardContent>
      </Card>

      {existingNotice ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Notice Submitted</CardTitle>
            </div>
            <CardDescription>Your landlord has been notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Submitted On</span>
                <span className="font-medium">
                  {format(new Date(existingNotice.submittedAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Move-Out Date</span>
                <span className="font-medium">
                  {format(new Date(existingNotice.vacateDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <span className="font-semibold text-lg">
                  {daysUntilVacate !== null && daysUntilVacate >= 0 ? daysUntilVacate : 0} days
                </span>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please ensure all rent is paid and the unit is cleaned before move-out date.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Vacate Notice</CardTitle>
            <CardDescription>Notify your landlord when you plan to move out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Most leases require 30-60 days notice before moving out. Check your lease agreement.
              </AlertDescription>
            </Alert>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Submit Move-Out Notice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Vacate Notice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vacate-date">Planned Move-Out Date</Label>
                    <Input
                      id="vacate-date"
                      type="date"
                      min={today}
                      value={vacateDate}
                      onChange={(e) => setVacateDate(e.target.value)}
                      required
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This notice will be sent to your landlord. Make sure you have reviewed your lease terms.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full">
                    Submit Notice
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
