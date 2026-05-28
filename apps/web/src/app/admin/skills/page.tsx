import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminSkillsCrudPage } from '@/components/admin/crud/admin-crud-pages';

export default function AdminSkillsPage() {
  return (
    <AdminLayout>
      <AdminSkillsCrudPage />
    </AdminLayout>
  );
}
