import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ContactsList from '../../components/admin/ContactsList';

const AdminContactsPage: React.FC = () => {
  return (
    <AdminLayout>
      <ContactsList />
    </AdminLayout>
  );
};

export default AdminContactsPage;