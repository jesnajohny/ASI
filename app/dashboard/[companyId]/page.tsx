// app/dashboard/[companyId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type CompanyDashboardPageProps = {
  params: { companyId: string };
};

export default async function CompanyDashboardPage({ params }: CompanyDashboardPageProps) {
  // Create a Supabase client for server-side operations
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch company details and verify the current user owns it
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('company_name')
    .eq('id', params.companyId)
    .eq('user_id', user.id) // Ensures you can only see your own companies
    .single();

  // If the company doesn't exist or the user doesn't own it, show an error
  if (companyError || !company) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-4">
        <div>
          <h1 className="text-2xl font-bold">Company Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The organization you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/dashboard/companies">
            <Button variant="outline" className="mt-4">
              Back to Your Organizations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all workspaces associated with this company
  const { data: workspaces, error: workspacesError } = await supabase
    .from('workspaces')
    .select('id, workspace_name')
    .eq('company_id', params.companyId);

  if (workspacesError) {
    return <p className="p-8 text-destructive">Error: Could not fetch workspaces.</p>;
  }

  // Render the page with the fetched data
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Organization</p>
            <h1 className="text-3xl font-bold">{company.company_name}</h1>
          </div>
          <Link href="/workspace-setup" className="mt-4 sm:mt-0">
            <Button className="bg-primary-gradient text-primary-foreground w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Workspace
            </Button>
          </Link>
        </header>

        <section>
          {workspaces && workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workspaces.map((workspace) => (
                <Link
                  href={`/dashboard/${params.companyId}/${workspace.id}`}
                  key={workspace.id}
                  className="block p-6 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {workspace.workspace_name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">View dashboard →</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No Workspaces Found</h2>
              <p className="text-muted-foreground mt-2">
                Get started by creating your first workspace for this organization.
              </p>
              <Link href="/workspace-setup" className="mt-6 inline-block">
                <Button className="bg-primary-gradient text-primary-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Workspace
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}