import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-root-container">
      <AdminSidebar />
      <main className="admin-main-viewport">
        <div className="admin-content-pad">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-root-container {
          display: flex;
          min-height: 100vh;
          background: #F8F9FA;
        }
        .admin-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-y: auto;
        }
        .admin-content-pad {
          padding: 32px 36px 60px;
          max-width: 1300px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .admin-root-container {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            min-height: auto;
            position: relative;
          }
          .admin-content-pad {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

