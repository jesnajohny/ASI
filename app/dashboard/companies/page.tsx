//app\dashboard\companies\page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// This is a Server Component by default, and it MUST be async
export default async function CompaniesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, company_name')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching companies:", error);
    return <p className="p-8">Could not fetch companies.</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Organizations</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for an organization" className="pl-10" />
            </div>
            <Link href="/workspace-setup">
              <Button className="bg-primary-gradient text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Organization
              </Button>
            </Link>
          </div>
        </header>

        <main>
          {companies && companies.length > 0 ? (
            <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
              {companies.map((company) => (
                <Link href={`/dashboard/${company.id}`} key={company.id}>
                  <div className="block p-6 border rounded-lg hover:bg-accent transition-colors">
                    <h2 className="font-semibold text-lg">{company.company_name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">View workspaces</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No organizations found</h2>
              <p className="text-muted-foreground mt-2">Get started by creating your first one.</p>
              <Link href="/workspace-setup" className="mt-4 inline-block">
                 <Button className="bg-primary-gradient text-primary-foreground">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Organization
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}