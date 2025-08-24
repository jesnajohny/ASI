// app/dashboard/[companyId]/[workspaceId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Bot, PlusCircle, Settings, Trash2 } from 'lucide-react';

type DashboardPageProps = {
  params: { companyId: string, workspaceId: string }; // Add companyId here
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('id, name, employee_type')
    .eq('workspace_id', params.workspaceId)
    .eq('user_id', user.id);

  if (employeesError) {
    return <p className="p-8 text-destructive">Error: Could not fetch AI employees.</p>;
  }

  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-semibold">AI Employee Dashboard</h1>
        {/* MODIFIED: Pass companyId and workspaceId in the href */}
        <Link href={`/hire?companyId=${params.companyId}&workspaceId=${params.workspaceId}`}>
          <Button className="bg-primary-gradient text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add AI Employee
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {employees && employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <div key={employee.id} className="border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                       <div className="bg-primary/10 p-3 rounded-full">
                         <Bot className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                         <h2 className="text-lg font-semibold">{employee.name || 'AI Employee'}</h2>
                         <p className="text-sm text-muted-foreground">{employee.employee_type}</p>
                       </div>
                    </div>
                    <div className="text-xs inline-flex items-center font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                      Active
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 border-t flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" /> View
                    </Button>
                     <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-lg">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Welcome to your new workspace!</h2>
            <p className="mt-2 text-muted-foreground">Get started by adding your first AI Employee.</p>
            {/* MODIFIED: Pass companyId and workspaceId in the href */}
            <Link href={`/hire?companyId=${params.companyId}&workspaceId=${params.workspaceId}`} className="mt-6 inline-block">
              <Button className="bg-primary-gradient text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                Hire Your First Employee
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}