import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminPlaceholderPage } from '@/components/admin/admin-placeholder-page';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Dashboard"
        description="Overview area for portfolio content, message activity, and admin shortcuts. Detailed metrics will be added after the CRUD modules are implemented."
      />
    </AdminLayout>
  );
}
