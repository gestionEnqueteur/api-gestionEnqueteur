import React, { useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Toast } from 'primereact/toast';

const Layout: React.FC = () => {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const menu = useRef<Menu>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // const handleLogout = () => {
  //   logout();
  //   toast.current?.show({
  //     severity: 'success',
  //     summary: 'Déconnexion',
  //     detail: 'Vous avez été déconnecté avec succès',
  //     life: 3000
  //   });
  //   navigate('/login');
  // };

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/dashboard')
    },
    {
      label: 'Courses',
      icon: 'pi pi-calendar',
      items: [
        {
          label: 'Liste des courses',
          icon: 'pi pi-list',
          command: () => navigate('/courses')
        },
        {
          label: 'Nouvelle course',
          icon: 'pi pi-plus',
          command: () => navigate('/courses/new')
        },
        {
          label: 'Import en masse',
          icon: 'pi pi-upload',
          command: () => navigate('/courses/import')
        }
      ]
    },
    {
      label: 'Enquêteurs',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Liste des enquêteurs',
          icon: 'pi pi-list',
          command: () => navigate('/users')
        },
        {
          label: 'Nouvel enquêteur',
          icon: 'pi pi-user-plus',
          command: () => navigate('/users/new')
        },
        {
          label: 'Import en masse',
          icon: 'pi pi-upload',
          command: () => navigate('/users/import')
        }
      ]
    },
    {
      label: 'Mesures',
      icon: 'pi pi-chart-bar',
      command: () => navigate('/mesures')
    }
  ];

  const userMenuItems: MenuItem[] = [
    {
      label: 'Profil',
      icon: 'pi pi-user',
      command: () => {
        // Navigation vers le profil
        console.log('Navigation vers le profil');
      }
    }
  ];

  const start = (
    <div className="flex align-items-center">
      <i className="pi pi-calendar text-2xl text-primary mr-2"></i>
      <span className="text-xl font-bold text-primary">
        Back-office Enquêteurs
      </span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {/* <span className="text-sm text-600 hidden md:block">
        Bonjour, {user?.username}
      </span> */}
      <Button
        type="button"
        icon="pi pi-bars"
        className="p-button-rounded p-button-text"
        onClick={(e) => {
          setIsMenuVisible(!isMenuVisible);
          menu.current?.toggle(e);
        }}
      />
      <Menu
        model={userMenuItems}
        popup
        ref={menu}
        id="popup_menu"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      <Menubar 
        model={menuItems} 
        start={start} 
        end={end}
        className="border-none border-round-none shadow-2"
      />
      
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;