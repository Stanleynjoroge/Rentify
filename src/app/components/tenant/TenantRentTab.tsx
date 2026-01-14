import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Home, CheckCircle2, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function TenantRentTab() {
  const { currentUser, assignments, units, properties, getRentStatus, makePayment, payments } = useApp();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const tenantAssignment = assignments.find(
    (a) => a.tenantId === currentUser?.id && a.isActive
  );
  const unit = tenantAssignment ? units.find((u) => u.id === tenantAssignment.unitId) : null;
  const property = unit ? properties.find((p) => p.id === unit.propertyId) : null;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const rentStatus = unit ? getRentStatus(unit.id, currentMonth) : null;

  const tenantPayments = payments.filter((p) => p.tenantId === currentUser?.id);
  const recentPayments = tenantPayments.slice(-5);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (unit && currentUser) {
      makePayment({
        unitId: unit.id,
        tenantId: currentUser.id,
        amount: parseFloat(paymentAmount),
        month: currentMonth,
      });
      toast.success('Payment submitted successfully!');
      setPaymentAmount('');
      setCardNumber('');
      setIsPaymentDialogOpen(false);
    }
  };

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'paid':
        return {
          icon: <CheckCircle2 className="h-6 w-6" />,
          badge: (
            <Badge variant="default" className="bg-green-600">
              Paid
            </Badge>
          ),
          color: 'text-green-600',
          message: 'Your rent is paid for this month',
        };
      case 'overdue-grace':
        return {
          icon: <Clock className="h-6 w-6" />,
          badge: (
            <Badge variant="default" className="bg-yellow-600">
              Grace Period
            </Badge>
          ),
          color: 'text-yellow-600',
          message: 'Payment is overdue but within grace period',
        };
      case 'overdue-late':
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          badge: (
            <Badge variant="destructive">
              Overdue
            </Badge>
          ),
          color: 'text-red-600',
          message: 'Payment is overdue. Please pay as soon as possible',
        };
      default:
        return {
          icon: <Clock className="h-6 w-6" />,
          badge: (
            <Badge variant="secondary">
              Pending
            </Badge>
          ),
          color: 'text-gray-600',
          message: 'Payment not yet due',
        };
    }
  };

  if (!unit || !property) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Home className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No unit assigned</p>
          <p className="text-sm text-muted-foreground">Contact your landlord for unit assignment</p>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(rentStatus);

  return (
    <div className="space-y-6">
      {/* Unit Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <CardTitle>{unit.name}</CardTitle>
              <CardDescription>{property.name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Monthly Rent</span>
            <span className="font-semibold">${unit.monthlyRent}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Due Date</span>
            <span className="font-semibold">Day {unit.dueDate} of each month</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Grace Period</span>
            <span className="font-semibold">{unit.gracePeriodDays} days</span>
          </div>
        </CardContent>
      </Card>

      {/* Current Rent Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Month Status</CardTitle>
          <CardDescription>{format(new Date(), 'MMMM yyyy')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={statusInfo.color}>{statusInfo.icon}</div>
              <div>
                <p className="font-medium">{statusInfo.message}</p>
                <p className="text-sm text-muted-foreground">Amount: ${unit.monthlyRent}</p>
              </div>
            </div>
            {statusInfo.badge}
          </div>

          {rentStatus !== 'paid' && (
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={() => setPaymentAmount(unit.monthlyRent.toString())}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Rent Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pay Rent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Number (Demo)</Label>
                    <Input
                      id="card"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This is a demo payment. Use any card number.
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Payment
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Recent rent payments</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No payment history</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.reverse().map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">
                      {format(new Date(payment.month + '-01'), 'MMMM yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Paid on {format(new Date(payment.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
                    <Badge variant="default" className="bg-green-600 text-xs">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}