import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard-header';
import { User } from '@supabase/supabase-js';

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { companyId: string; workspaceId: string };
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // We can now assume a user exists because the middleware has checked.
  // We fetch it again here to get the user's details for the header.
  const { data: { user } } = await supabase.auth.getUser();

  // It's still good practice to have this, just in case.
  if (!user) {
    return redirect('/login');
  }

  // Fetch company data first
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('company_name')
    .eq('id', params.companyId)
    .single();
    
  if (companyError || !company) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Company not found or you do not have access.</p>
        </div>
    );
  }

  // Fetch workspace data
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('workspace_name')
    .eq('id', params.workspaceId)
    .eq('company_id', params.companyId)
    .single();
    
  if (workspaceError || !workspace) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Workspace not found or you do not have access.</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader 
          userEmail={user.email || ''}
          companyName={company.company_name || 'Company'}
          workspaceName={workspace.workspace_name || 'Workspace'}
        />
        {children}
      </div>
    </div>
  );
}
