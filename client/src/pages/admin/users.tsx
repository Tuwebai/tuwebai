import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UsersList from '../../components/admin/UsersList';

const AdminUsersPage: React.FC = () => {
  return (
    <AdminLayout>
      <UsersList />
    </AdminLayout>
  );
};

export default AdminUsersPage;