import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Building2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-900 p-4 rounded-2xl shadow-lg">
            <Building2 className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-900 bg-clip-text text-transparent">
          Rentify
        </h1>
        <p className="text-muted-foreground mt-2">Smart Property Management</p>
      </div>

      {/* Welcome Card */}
      <Card className="w-full max-w-md shadow-xl border-2 border-purple-200">
        <CardHeader className="text-center pb-4">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 mb-4">
              <span className="text-3xl">👋</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Hi there Thomas!</CardTitle>
          <CardDescription className="text-base mt-2">
            Welcome to Rentify - your all-in-one property management solution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold">✓</span>
              </div>
              <span>Track rental units and tenants</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-900 font-semibold">✓</span>
              </div>
              <span>Manage rent payments effortlessly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold">✓</span>
              </div>
              <span>Handle maintenance requests easily</span>
            </div>
          </div>

          <Button onClick={onGetStarted} className="w-full h-12 text-base shadow-lg" size="lg">
            Get Started
          </Button>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground mt-6 text-center max-w-md">
        Streamline your property management with Rentify's intuitive platform
      </p>
    </div>
  );
}
