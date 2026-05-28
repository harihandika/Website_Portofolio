import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminExperiencesCrudPage } from '@/components/admin/crud/admin-crud-pages';

export default function AdminExperiencesPage() {
  return (
    <AdminLayout>
      <AdminExperiencesCrudPage />
    </AdminLayout>
  );
}
