import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Wrench, Plus, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function TenantMaintenanceTab() {
  const { currentUser, assignments, maintenanceRequests, addMaintenanceRequest } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');

  const tenantAssignment = assignments.find(
    (a) => a.tenantId === currentUser?.id && a.isActive
  );

  const tenantRequests = maintenanceRequests.filter((req) => req.tenantId === currentUser?.id);
  const pendingRequests = tenantRequests.filter((req) => req.status === 'pending');
  const resolvedRequests = tenantRequests.filter((req) => req.status === 'resolved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantAssignment && currentUser) {
      addMaintenanceRequest({
        unitId: tenantAssignment.unitId,
        tenantId: currentUser.id,
        description,
        status: 'pending',
      });
      toast.success('Maintenance request submitted!');
      setDescription('');
      setIsDialogOpen(false);
    }
  };

  if (!tenantAssignment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No unit assigned</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Maintenance Requests</h2>
          <p className="text-sm text-muted-foreground">Submit and track maintenance issues</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Maintenance Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Describe the issue</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Kitchen sink is leaking under the cabinet"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
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
          <h3 className="font-medium mb-4">Active Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Submitted {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm">{request.description}</p>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Resolved {request.resolvedAt && format(new Date(request.resolvedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tenantRequests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No maintenance requests</p>
            <p className="text-sm text-muted-foreground">Submit a request when you need help</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
