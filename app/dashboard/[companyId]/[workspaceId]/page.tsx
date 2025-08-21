import React from 'react';

type DashboardPageProps = {
  params: { companyId: string; workspaceId: string };
};

// The component must be async to correctly receive params
export default async function DashboardPage({ params }: DashboardPageProps) {
  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="mt-8">
        <p>Welcome to your new workspace!</p>
        <p className="text-muted-foreground text-sm mt-2">
          Company ID: {params.companyId} <br />
          Workspace ID: {params.workspaceId}
        </p>
        {/* Your main dashboard content will go here */}
      </div>
    </main>
  );
}
