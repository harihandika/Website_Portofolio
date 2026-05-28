import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminMessagesCrudPage } from '@/components/admin/crud/admin-crud-pages';

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <AdminMessagesCrudPage />
    </AdminLayout>
  );
}
