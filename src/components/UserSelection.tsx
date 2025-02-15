"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Briefcase, User } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo Placeholder */}
      <div className="absolute top-6 left-6 text-xl font-semibold">SmartSprint</div>

      <h1 className="text-2xl font-semibold mb-6">Join as a client or freelancer</h1>
      
      <div className="flex gap-6">
        <Card 
          className={cn("p-6 w-64 flex flex-col items-start cursor-pointer border", selectedRole === 'client' && 'ring-2 ring-black')}
          onClick={() => setSelectedRole('client')}
        >
          <Briefcase className="w-6 h-6" />
          <span className="font-medium">Im a client, hiring for a project</span>
        </Card>
        
        <Card 
          className={cn("p-6 w-64 flex flex-col items-start cursor-pointer border", selectedRole === 'freelancer' && 'ring-2 ring-black')}
          onClick={() => setSelectedRole('freelancer')}
        >
          <User className="w-6 h-6" />
          <span className="font-medium">Im a freelancer, looking for work</span>
        </Card>
      </div>
      
      <Button className="mt-6 w-64" disabled={!selectedRole}>
        <Link href="/sign-up">
        Create Account
        </Link>
      </Button>

      <p className="mt-4 text-sm">
        Already have an account? <Link href="/login" className="text-blue-600">Log In</Link>
      </p>
    </div>
  );
}
