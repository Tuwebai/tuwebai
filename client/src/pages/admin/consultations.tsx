import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ConsultationsList from '../../components/admin/ConsultationsList';

const AdminConsultationsPage: React.FC = () => {
  return (
    <AdminLayout>
      <ConsultationsList />
    </AdminLayout>
  );
};

export default AdminConsultationsPage;