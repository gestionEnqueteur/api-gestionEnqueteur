import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/api';
import { apiService } from '@/services/api';

interface UserFilters {
  search: string;
  role: string;
  confirmed: boolean | null;
  blocked: boolean | null;
  createdAfter: Date | null;
  createdBefore: Date | null;
}

const InvestigatorsList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    confirmed: null,
    blocked: null,
    createdAfter: null,
    createdBefore: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const roleOptions = [
    { label: 'Tous les rôles', value: '' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Enquêteur', value: 'Enqueteur' },
    { label: 'Superviseur', value: 'Superviseur' }
  ];

  const statusOptions = [
    { label: 'Tous', value: null },
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les utilisateurs',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      await apiService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setDeleteDialog(false);
      setUserToDelete(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur supprimé avec succès',
        life: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer l\'utilisateur',
        life: 3000
      });
    }
  };

  const deleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await Promise.all(
        selectedUsers.map(user => apiService.deleteUser(user.id))
      );
      
      const selectedIds = selectedUsers.map(u => u.id);
      setUsers(users.filter(u => !selectedIds.includes(u.id)));
      setSelectedUsers([]);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: `${selectedUsers.length} utilisateur(s) supprimé(s)`,
        life: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la suppression des utilisateurs',
        life: 3000
      });
    }
  };

  const applyFilters = () => {
    let filteredUsers = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => 
        user.roles?.includes(filters.role)
      );
    }

    if (filters.confirmed !== null) {
      filteredUsers = filteredUsers.filter(user => 
        user.confirmed === filters.confirmed
      );
    }

    if (filters.blocked !== null) {
      filteredUsers = filteredUsers.filter(user => 
        user.blocked === filters.blocked
      );
    }

    if (filters.createdAfter) {
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.createdAt) >= filters.createdAfter!
      );
    }

    if (filters.createdBefore) {
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.createdAt) <= filters.createdBefore!
      );
    }

    return filteredUsers;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      confirmed: null,
      blocked: null,
      createdAfter: null,
      createdBefore: null
    });
    setGlobalFilter('');
  };

  const exportCSV = () => {
    const filteredData = applyFilters();
    const csvData = filteredData.map(user => ({
      'Nom d\'utilisateur': user.username,
      'Email': user.email,
      'Rôles': user.roles?.join(', ') || '',
      'Confirmé': user.confirmed ? 'Oui' : 'Non',
      'Bloqué': user.blocked ? 'Oui' : 'Non',
      'Date de création': new Date(user.createdAt).toLocaleDateString('fr-FR'),
      'Dernière mise à jour': new Date(user.updatedAt).toLocaleDateString('fr-FR')
    }));
    
    // Conversion en CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `enqueteurs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => navigate(`/investigators/${rowData.id}`)}
          tooltip="Voir"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => navigate(`/investigators/${rowData.id}/edit`)}
          tooltip="Modifier"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => confirmDeleteUser(rowData)}
          tooltip="Supprimer"
        />
      </div>
    );
  };

  const rolesBodyTemplate = (rowData: User) => {
    if (!rowData.roles || rowData.roles.length === 0) {
      return <Tag value="Aucun rôle" severity="warning" />;
    }
    
    return (
      <div className="flex gap-1 flex-wrap">
        {rowData.roles.map((role, index) => (
          <Tag 
            key={index} 
            value={role} 
            severity={role === 'Admin' ? 'danger' : role === 'Superviseur' ? 'warning' : 'info'}
          />
        ))}
      </div>
    );
  };

  const statusBodyTemplate = (rowData: User) => {
    if (rowData.blocked) {
      return <Tag value="Bloqué" severity="danger" />;
    }
    if (!rowData.confirmed) {
      return <Tag value="Non confirmé" severity="warning" />;
    }
    return <Tag value="Actif" severity="success" />;
  };

  const dateBodyTemplate = (rowData: User, field: 'createdAt' | 'updatedAt') => {
    return new Date(rowData[field]).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const coursesCountBodyTemplate = (rowData: User) => {
    const count = rowData.courses?.length || 0;
    return (
      <Tag 
        value={count.toString()} 
        severity={count > 0 ? 'info' : 'secondary'}
      />
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Nouveau"
          icon="pi pi-plus"
          onClick={() => navigate('/investigators/new')}
        />
        <Button
          label="Import"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={() => navigate('/investigators/import')}
        />
        {selectedUsers.length > 0 && (
          <Button
            label={`Supprimer (${selectedUsers.length})`}
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={deleteSelectedUsers}
          />
        )}
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-filter"
          className={`p-button-outlined ${showFilters ? 'p-button-info' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          tooltip="Filtres"
        />
        <Button
          icon="pi pi-download"
          className="p-button-outlined"
          onClick={exportCSV}
          tooltip="Exporter CSV"
        />
        <Button
          icon="pi pi-refresh"
          className="p-button-outlined"
          onClick={loadUsers}
          tooltip="Actualiser"
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2 className="m-0">Enquêteurs ({applyFilters().length})</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Recherche globale..."
        />
      </span>
    </div>
  );

  const filteredUsers = applyFilters().filter(user => {
    if (!globalFilter) return true;
    const searchLower = globalFilter.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.roles?.some(role => role.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div>
      <Toast ref={toast} />
      
      <Card>
        <Toolbar 
          className="mb-4" 
          left={leftToolbarTemplate} 
          right={rightToolbarTemplate}
        />
        
        {showFilters && (
          <Card className="mb-4" title="Filtres">
            <div className="grid">
              <div className="col-12 md:col-3">
                <label htmlFor="search" className="block text-900 font-medium mb-2">
                  Recherche
                </label>
                <InputText
                  id="search"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Nom ou email..."
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="role" className="block text-900 font-medium mb-2">
                  Rôle
                </label>
                <Dropdown
                  id="role"
                  value={filters.role}
                  options={roleOptions}
                  onChange={(e) => setFilters({...filters, role: e.value})}
                  placeholder="Sélectionner un rôle"
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="confirmed" className="block text-900 font-medium mb-2">
                  Confirmé
                </label>
                <Dropdown
                  id="confirmed"
                  value={filters.confirmed}
                  options={statusOptions}
                  onChange={(e) => setFilters({...filters, confirmed: e.value})}
                  placeholder="Statut de confirmation"
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="blocked" className="block text-900 font-medium mb-2">
                  Bloqué
                </label>
                <Dropdown
                  id="blocked"
                  value={filters.blocked}
                  options={statusOptions}
                  onChange={(e) => setFilters({...filters, blocked: e.value})}
                  placeholder="Statut de blocage"
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-6">
                <label htmlFor="createdAfter" className="block text-900 font-medium mb-2">
                  Créé après
                </label>
                <Calendar
                  id="createdAfter"
                  value={filters.createdAfter}
                  onChange={(e) => setFilters({...filters, createdAfter: e.value as Date})}
                  showIcon
                  dateFormat="dd/mm/yy"
                  placeholder="Date de début"
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-6">
                <label htmlFor="createdBefore" className="block text-900 font-medium mb-2">
                  Créé avant
                </label>
                <Calendar
                  id="createdBefore"
                  value={filters.createdBefore}
                  onChange={(e) => setFilters({...filters, createdBefore: e.value as Date})}
                  showIcon
                  dateFormat="dd/mm/yy"
                  placeholder="Date de fin"
                  className="w-full"
                />
              </div>
              
              <div className="col-12">
                <div className="flex gap-2 justify-content-end">
                  <Button
                    label="Effacer"
                    icon="pi pi-times"
                    className="p-button-outlined"
                    onClick={clearFilters}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
        
        <DataTable
          value={filteredUsers}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          header={header}
          emptyMessage="Aucun enquêteur trouvé"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="username" header="Nom d'utilisateur" sortable />
          <Column field="email" header="Email" sortable />
          <Column header="Rôles" body={rolesBodyTemplate} />
          <Column header="Statut" body={statusBodyTemplate} />
          <Column 
            header="Courses" 
            body={coursesCountBodyTemplate}
            style={{ width: '100px' }}
          />
          <Column 
            field="createdAt" 
            header="Créé le" 
            body={(rowData) => dateBodyTemplate(rowData, 'createdAt')}
            sortable
            style={{ width: '150px' }}
          />
          <Column 
            field="updatedAt" 
            header="Modifié le" 
            body={(rowData) => dateBodyTemplate(rowData, 'updatedAt')}
            sortable
            style={{ width: '150px' }}
          />
          <Column 
            header="Actions" 
            body={actionBodyTemplate}
            style={{ width: '150px' }}
          />
        </DataTable>
      </Card>
      
      <Dialog
        visible={deleteDialog}
        style={{ width: '450px' }}
        header="Confirmer la suppression"
        modal
        footer={
          <div>
            <Button
              label="Non"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialog(false)}
            />
            <Button
              label="Oui"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={deleteUser}
            />
          </div>
        }
        onHide={() => setDeleteDialog(false)}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {userToDelete && (
            <span>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <b>{userToDelete.username}</b> ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default InvestigatorsList;