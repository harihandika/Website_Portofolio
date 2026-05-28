import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminProfileCrudPage } from '@/components/admin/crud/admin-crud-pages';

export default function AdminProfilePage() {
  return (
    <AdminLayout>
      <AdminProfileCrudPage />
    </AdminLayout>
  );
}
