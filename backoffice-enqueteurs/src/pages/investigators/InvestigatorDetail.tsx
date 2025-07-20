import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { User, Course } from '@/types/api';
import { apiService } from '@/services/api';

const InvestigatorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(id);
      loadUserCourses(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      const userData = await apiService.getUser(userId);
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les données de l\'utilisateur',
        life: 3000
      });
      navigate('/investigators');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCourses = async (userId: string) => {
    try {
      setCoursesLoading(true);
      // Récupérer toutes les courses et filtrer par utilisateur assigné
      const allCourses = await apiService.getCourses();
      const userCourses = allCourses.filter(course => 
        course.affectation?.id === userId
      );
      setCourses(userCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les courses de l\'utilisateur',
        life: 3000
      });
    } finally {
      setCoursesLoading(false);
    }
  };

  const confirmDeleteUser = () => {
    setDeleteDialog(true);
  };

  const deleteUser = async () => {
    if (!user) return;

    try {
      await apiService.deleteUser(user.id);
      setDeleteDialog(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Enquêteur supprimé avec succès',
        life: 3000
      });
      navigate('/investigators');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer l\'enquêteur',
        life: 3000
      });
    }
  };

  const rolesBodyTemplate = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) {
      return <Tag value="Aucun rôle" severity="warning" />;
    }
    
    return (
      <div className="flex gap-1 flex-wrap">
        {roles.map((role, index) => (
          <Tag 
            key={index} 
            value={role} 
            severity={role === 'Admin' ? 'danger' : role === 'Superviseur' ? 'warning' : 'info'}
          />
        ))}
      </div>
    );
  };

  const statusBodyTemplate = (user: User) => {
    if (user.blocked) {
      return <Tag value="Bloqué" severity="danger" />;
    }
    if (!user.confirmed) {
      return <Tag value="Non confirmé" severity="warning" />;
    }
    return <Tag value="Actif" severity="success" />;
  };

  const courseStatusBodyTemplate = (rowData: Course) => {
    const getStatusSeverity = (status: string) => {
      switch (status) {
        case 'AFFECTED': return 'info';
        case 'TERMINATED': return 'success';
        case 'CANCELLED': return 'danger';
        default: return 'secondary';
      }
    };
    
    return <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />;
  };

  const courseDateBodyTemplate = (rowData: Course, field: 'hd' | 'ha') => {
    return new Date(rowData[field]).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const courseActionBodyTemplate = (rowData: Course) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => navigate(`/courses/${rowData.id}`)}
          tooltip="Voir la course"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => navigate(`/courses/${rowData.id}/edit`)}
          tooltip="Modifier la course"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <div className="text-center">
          <h3>Enquêteur non trouvé</h3>
          <Button
            label="Retour à la liste"
            icon="pi pi-arrow-left"
            onClick={() => navigate('/investigators')}
          />
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      
      {/* En-tête avec actions */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h2 className="m-0">{user.username}</h2>
            <p className="text-600 m-0">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Modifier"
              icon="pi pi-pencil"
              className="p-button-success"
              onClick={() => navigate(`/investigators/${user.id}/edit`)}
            />
            <Button
              label="Supprimer"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={confirmDeleteUser}
            />
            <Button
              label="Retour"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={() => navigate('/investigators')}
            />
          </div>
        </div>
      </Card>
      
      <div className="grid">
        {/* Informations personnelles */}
        <div className="col-12 lg:col-6">
          <Card title="Informations personnelles">
            <div className="grid">
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Nom d'utilisateur</label>
                <p className="text-700 m-0">{user.username}</p>
              </div>
              
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Email</label>
                <p className="text-700 m-0">{user.email}</p>
              </div>
              
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Rôles</label>
                <div>{rolesBodyTemplate(user.roles)}</div>
              </div>
              
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Statut</label>
                <div>{statusBodyTemplate(user)}</div>
              </div>
              
              {user.expoPushToken && (
                <div className="col-12">
                  <label className="block text-900 font-medium mb-1">Token Push</label>
                  <p className="text-700 m-0 text-sm">
                    {user.expoPushToken.substring(0, 20)}...
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Statistiques */}
        <div className="col-12 lg:col-6">
          <Card title="Statistiques">
            <div className="grid">
              <div className="col-6">
                <div className="text-center">
                  <div className="text-blue-600 font-medium text-sm">Total Courses</div>
                  <div className="text-blue-900 font-bold text-2xl">{courses.length}</div>
                </div>
              </div>
              
              <div className="col-6">
                <div className="text-center">
                  <div className="text-green-600 font-medium text-sm">Terminées</div>
                  <div className="text-green-900 font-bold text-2xl">
                    {courses.filter(c => c.status === 'TERMINATED').length}
                  </div>
                </div>
              </div>
              
              <div className="col-6">
                <div className="text-center">
                  <div className="text-orange-600 font-medium text-sm">En cours</div>
                  <div className="text-orange-900 font-bold text-2xl">
                    {courses.filter(c => c.status === 'AFFECTED').length}
                  </div>
                </div>
              </div>
              
              <div className="col-6">
                <div className="text-center">
                  <div className="text-red-600 font-medium text-sm">Annulées</div>
                  <div className="text-red-900 font-bold text-2xl">
                    {courses.filter(c => c.status === 'CANCELLED').length}
                  </div>
                </div>
              </div>
            </div>
            
            <Divider />
            
            <div className="grid">
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Membre depuis</label>
                <p className="text-700 m-0">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="col-12">
                <label className="block text-900 font-medium mb-1">Dernière modification</label>
                <p className="text-700 m-0">
                  {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Courses assignées */}
        <div className="col-12">
          <Card title={`Courses assignées (${courses.length})`}>
            <DataTable
              value={courses}
              loading={coursesLoading}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              emptyMessage="Aucune course assignée"
              responsiveLayout="scroll"
              stripedRows
            >
              <Column field="mission" header="Mission" sortable />
              <Column field="trainCourse" header="Train" sortable />
              <Column field="placeDeparture" header="Départ" />
              <Column field="placeArrival" header="Arrivée" />
              <Column 
                field="hd" 
                header="Heure Départ" 
                body={(rowData) => courseDateBodyTemplate(rowData, 'hd')}
                sortable
              />
              <Column 
                field="ha" 
                header="Heure Arrivée" 
                body={(rowData) => courseDateBodyTemplate(rowData, 'ha')}
                sortable
              />
              <Column 
                field="status" 
                header="Statut" 
                body={courseStatusBodyTemplate}
                sortable
              />
              <Column 
                header="Actions" 
                body={courseActionBodyTemplate}
                style={{ width: '120px' }}
              />
            </DataTable>
          </Card>
        </div>
      </div>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog
        visible={deleteDialog}
        style={{ width: '450px' }}
        header="Confirmer la suppression"
        modal
        footer={
          <div>
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialog(false)}
            />
            <Button
              label="Supprimer"
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
          <span>
            Êtes-vous sûr de vouloir supprimer l'enquêteur <b>{user.username}</b> ?
            <br />
            <small className="text-600">
              Cette action supprimera également toutes les courses assignées à cet enquêteur.
            </small>
          </span>
        </div>
      </Dialog>
    </div>
  );
};

export default InvestigatorDetail;