//app\dashboard\[companyId]\page.tsx
import React from 'react';

type CompanyDashboardPageProps = {
  params: { companyId: string };
};

export default function CompanyDashboardPage({ params }: CompanyDashboardPageProps) {
  return (
    <main className="p-4 sm:px-6 sm:py-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Company Dashboard</h1>
      </div>
      <div className="mt-8">
        <p>Displaying workspaces and info for Company ID: {params.companyId}</p>
        {/* You can fetch and list workspaces for this company here */}
      </div>
    </main>
  );
}
