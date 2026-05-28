import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminProjectsCrudPage } from '@/components/admin/crud/admin-crud-pages';

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <AdminProjectsCrudPage />
    </AdminLayout>
  );
}
