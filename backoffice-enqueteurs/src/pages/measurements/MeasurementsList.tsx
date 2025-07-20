import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';
import { Mesure, TypeMesure, Course, User } from '@/types/api';
import { apiService } from '@/services/api';

interface MeasurementFilters {
  search: string;
  type: TypeMesure | '';
  courseId: string;
  userId: string;
  createdAfter: Date | null;
  createdBefore: Date | null;
}

const MeasurementsList: React.FC = () => {
  const [measurements, setMeasurements] = useState<Mesure[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<MeasurementFilters>({
    search: '',
    type: '',
    courseId: '',
    userId: '',
    createdAfter: null,
    createdBefore: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const typeOptions = [
    { label: 'Tous les types', value: '' },
    { label: 'BSC', value: TypeMesure.BSC },
    { label: 'MQ', value: TypeMesure.MQ }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, usersData] = await Promise.all([
        apiService.getCourses(),
        apiService.getUsers()
      ]);
      
      setCourses(coursesData);
      setUsers(usersData);
      
      // Extraire toutes les mesures de toutes les courses
      const allMeasurements: Mesure[] = [];
      coursesData.forEach(course => {
        if (course.mesure && course.mesure.length > 0) {
          course.mesure.forEach(mesure => {
            allMeasurements.push({
              ...mesure,
              course: course,
              user: course.affectation
            } as Mesure);
          });
        }
      });
      
      setMeasurements(allMeasurements);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les mesures',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredMeasurements = [...measurements];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        measurement.course?.mission.toLowerCase().includes(searchLower) ||
        measurement.course?.trainCourse.toLowerCase().includes(searchLower) ||
        measurement.user?.username.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        measurement.type === filters.type
      );
    }

    if (filters.courseId) {
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        measurement.course?.id === filters.courseId
      );
    }

    if (filters.userId) {
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        measurement.user?.id === filters.userId
      );
    }

    if (filters.createdAfter) {
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        new Date(measurement.createdAt) >= filters.createdAfter!
      );
    }

    if (filters.createdBefore) {
      filteredMeasurements = filteredMeasurements.filter(measurement => 
        new Date(measurement.createdAt) <= filters.createdBefore!
      );
    }

    return filteredMeasurements;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      courseId: '',
      userId: '',
      createdAfter: null,
      createdBefore: null
    });
    setGlobalFilter('');
  };

  const exportCSV = () => {
    const filteredData = applyFilters();
    const csvData = filteredData.map(measurement => ({
      'Type': measurement.type,
      'Course': measurement.course?.mission || '',
      'Train': measurement.course?.trainCourse || '',
      'Enquêteur': measurement.user?.username || '',
      'Date de création': new Date(measurement.createdAt).toLocaleDateString('fr-FR'),
      'Dernière mise à jour': new Date(measurement.updatedAt).toLocaleDateString('fr-FR')
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
    link.download = `mesures_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const typeBodyTemplate = (rowData: Mesure) => {
    const getTypeSeverity = (type: TypeMesure) => {
      switch (type) {
        case TypeMesure.BSC: return 'info';
        case TypeMesure.MQ: return 'success';
        default: return 'secondary';
      }
    };
    
    return <Tag value={rowData.type} severity={getTypeSeverity(rowData.type)} />;
  };

  const courseBodyTemplate = (rowData: Mesure) => {
    if (!rowData.course) return '-';
    
    return (
      <div>
        <div className="font-medium">{rowData.course.mission}</div>
        <div className="text-sm text-600">{rowData.course.trainCourse}</div>
      </div>
    );
  };

  const userBodyTemplate = (rowData: Mesure) => {
    if (!rowData.user) return '-';
    
    return (
      <div>
        <div className="font-medium">{rowData.user.username}</div>
        <div className="text-sm text-600">{rowData.user.email}</div>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Mesure, field: 'createdAt' | 'updatedAt') => {
    return new Date(rowData[field]).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const actionBodyTemplate = (rowData: Mesure) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => navigate(`/measurements/${rowData.id}`)}
          tooltip="Voir les détails"
        />
        {rowData.course && (
          <Button
            icon="pi pi-external-link"
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={() => navigate(`/courses/${rowData.course!.id}`)}
            tooltip="Voir la course"
          />
        )}
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Actualiser"
          icon="pi pi-refresh"
          onClick={loadData}
        />
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
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2 className="m-0">Mesures ({applyFilters().length})</h2>
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

  const filteredMeasurements = applyFilters().filter(measurement => {
    if (!globalFilter) return true;
    const searchLower = globalFilter.toLowerCase();
    return (
      measurement.type.toLowerCase().includes(searchLower) ||
      measurement.course?.mission.toLowerCase().includes(searchLower) ||
      measurement.course?.trainCourse.toLowerCase().includes(searchLower) ||
      measurement.user?.username.toLowerCase().includes(searchLower)
    );
  });

  const courseOptions = [
    { label: 'Toutes les courses', value: '' },
    ...courses.map(course => ({
      label: `${course.mission} - ${course.trainCourse}`,
      value: course.id
    }))
  ];

  const userOptions = [
    { label: 'Tous les enquêteurs', value: '' },
    ...users.map(user => ({
      label: user.username,
      value: user.id
    }))
  ];

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
                  placeholder="Mission, train, enquêteur..."
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="type" className="block text-900 font-medium mb-2">
                  Type de mesure
                </label>
                <Dropdown
                  id="type"
                  value={filters.type}
                  options={typeOptions}
                  onChange={(e) => setFilters({...filters, type: e.value})}
                  placeholder="Sélectionner un type"
                  className="w-full"
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="course" className="block text-900 font-medium mb-2">
                  Course
                </label>
                <Dropdown
                  id="course"
                  value={filters.courseId}
                  options={courseOptions}
                  onChange={(e) => setFilters({...filters, courseId: e.value})}
                  placeholder="Sélectionner une course"
                  className="w-full"
                  filter
                />
              </div>
              
              <div className="col-12 md:col-3">
                <label htmlFor="user" className="block text-900 font-medium mb-2">
                  Enquêteur
                </label>
                <Dropdown
                  id="user"
                  value={filters.userId}
                  options={userOptions}
                  onChange={(e) => setFilters({...filters, userId: e.value})}
                  placeholder="Sélectionner un enquêteur"
                  className="w-full"
                  filter
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
          value={filteredMeasurements}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          header={header}
          emptyMessage="Aucune mesure trouvée"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column header="Type" body={typeBodyTemplate} sortable />
          <Column header="Course" body={courseBodyTemplate} />
          <Column header="Enquêteur" body={userBodyTemplate} />
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
            style={{ width: '120px' }}
          />
        </DataTable>
      </Card>
    </div>
  );
};

export default MeasurementsList;