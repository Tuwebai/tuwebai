import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import NewsletterList from '../../components/admin/NewsletterList';

const AdminNewsletterPage: React.FC = () => {
  return (
    <AdminLayout>
      <NewsletterList />
    </AdminLayout>
  );
};

export default AdminNewsletterPage;