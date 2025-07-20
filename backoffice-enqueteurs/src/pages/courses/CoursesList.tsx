import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import { Course, StatusCourse, User } from '@/types/api';
import { apiService } from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusCourse | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, usersData] = await Promise.all([
        apiService.getCourses(),
        apiService.getUsers()
      ]);
      setCourses(coursesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors du chargement des courses',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusSeverity = (status: StatusCourse) => {
    switch (status) {
      case StatusCourse.DRAFT:
        return 'info';
      case StatusCourse.AFFECTED:
        return 'success';
      case StatusCourse.CANCELED:
        return 'danger';
      case StatusCourse.TERMINED:
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: StatusCourse) => {
    switch (status) {
      case StatusCourse.DRAFT:
        return 'Brouillon';
      case StatusCourse.AFFECTED:
        return 'Affectée';
      case StatusCourse.CANCELED:
        return 'Annulée';
      case StatusCourse.TERMINED:
        return 'Terminée';
      default:
        return status;
    }
  };

  const statusBodyTemplate = (rowData: Course) => {
    return (
      <Tag 
        value={getStatusLabel(rowData.status)} 
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const dateBodyTemplate = (rowData: Course) => {
    return format(new Date(rowData.hd), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const affectationBodyTemplate = (rowData: Course) => {
    const user = users.find(u => u.id === rowData.affectationId);
    return user ? user.username : 'Non affectée';
  };

  const actionBodyTemplate = (rowData: Course) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-info"
          onClick={() => navigate(`/courses/${rowData.id}`)}
          tooltip="Voir"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-warning"
          onClick={() => navigate(`/courses/${rowData.id}/edit`)}
          tooltip="Modifier"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Supprimer"
        />
      </div>
    );
  };

  const confirmDelete = (course: Course) => {
    confirmDialog({
      message: `Êtes-vous sûr de vouloir supprimer la course ${course.mission} - ${course.trainCourse} ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteCourse(course.id),
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      acceptClassName: 'p-button-danger'
    });
  };

  const deleteCourse = async (id: number) => {
    try {
      await apiService.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Course supprimée avec succès',
        life: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la suppression de la course',
        life: 3000
      });
    }
  };

  const deleteSelectedCourses = async () => {
    try {
      await Promise.all(
        selectedCourses.map(course => apiService.deleteCourse(course.id))
      );
      setCourses(courses.filter(c => !selectedCourses.find(sc => sc.id === c.id)));
      setSelectedCourses([]);
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: `${selectedCourses.length} course(s) supprimée(s) avec succès`,
        life: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de la suppression des courses',
        life: 3000
      });
    }
  };

  const confirmDeleteSelected = () => {
    confirmDialog({
      message: `Êtes-vous sûr de vouloir supprimer ${selectedCourses.length} course(s) sélectionnée(s) ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: deleteSelectedCourses,
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      acceptClassName: 'p-button-danger'
    });
  };

  const statusOptions = [
    { label: 'Tous les statuts', value: null },
    { label: 'Brouillon', value: StatusCourse.DRAFT },
    { label: 'Affectée', value: StatusCourse.AFFECTED },
    { label: 'Annulée', value: StatusCourse.CANCELED },
    { label: 'Terminée', value: StatusCourse.TERMINED }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesGlobal = !globalFilter || 
      course.mission.toLowerCase().includes(globalFilter.toLowerCase()) ||
      course.trainCourse.toLowerCase().includes(globalFilter.toLowerCase()) ||
      course.placeDeparture.toLowerCase().includes(globalFilter.toLowerCase()) ||
      course.placeArrival.toLowerCase().includes(globalFilter.toLowerCase());
    
    const matchesStatus = !statusFilter || course.status === statusFilter;
    
    return matchesGlobal && matchesStatus;
  });

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          label="Nouvelle Course" 
          icon="pi pi-plus" 
          onClick={() => navigate('/courses/new')}
        />
        <Button 
          label="Import" 
          icon="pi pi-upload" 
          className="p-button-help"
          onClick={() => navigate('/courses/import')}
        />
        {selectedCourses.length > 0 && (
          <Button 
            label={`Supprimer (${selectedCourses.length})`}
            icon="pi pi-trash" 
            className="p-button-danger"
            onClick={confirmDeleteSelected}
          />
        )}
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText 
            value={globalFilter} 
            onChange={(e) => setGlobalFilter(e.target.value)} 
            placeholder="Rechercher..."
          />
        </span>
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value)}
          placeholder="Filtrer par statut"
          className="w-12rem"
        />
        <Button 
          icon="pi pi-refresh" 
          className="p-button-outlined"
          onClick={fetchData}
          tooltip="Actualiser"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card>
        <Toolbar 
          className="mb-4" 
          start={leftToolbarTemplate} 
          end={rightToolbarTemplate}
        />
        
        <DataTable
          value={filteredCourses}
          selection={selectedCourses}
          onSelectionChange={(e) => setSelectedCourses(e.value)}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="Aucune course trouvée"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="mission" header="Mission" sortable />
          <Column field="trainCourse" header="Train" sortable />
          <Column field="placeDeparture" header="Départ" sortable />
          <Column field="placeArrival" header="Arrivée" sortable />
          <Column header="Date/Heure" body={dateBodyTemplate} sortable />
          <Column header="Affectation" body={affectationBodyTemplate} />
          <Column header="Statut" body={statusBodyTemplate} sortable />
          <Column header="Actions" body={actionBodyTemplate} style={{ width: '12rem' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default CoursesList;