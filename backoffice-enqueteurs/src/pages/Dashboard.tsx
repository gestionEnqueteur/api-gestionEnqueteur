import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
// import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Course, StatusCourse, User } from '@/types/api';
import { apiService } from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, usersData] = await Promise.all([
          apiService.getCourses(),
          apiService.getUsers()
        ]);
        setCourses(coursesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return rowData.affectation?.username || 'Non affectée';
  };

  // Statistiques
  const totalCourses = courses.length;
  const coursesAffected = courses.filter(c => c.status === StatusCourse.AFFECTED).length;
  const coursesTermined = courses.filter(c => c.status === StatusCourse.TERMINED).length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.blocked).length;

  // Données pour le graphique
  const chartData = {
    labels: ['Brouillon', 'Affectées', 'Annulées', 'Terminées'],
    datasets: [
      {
        data: [
          courses.filter(c => c.status === StatusCourse.DRAFT).length,
          courses.filter(c => c.status === StatusCourse.AFFECTED).length,
          courses.filter(c => c.status === StatusCourse.CANCELED).length,
          courses.filter(c => c.status === StatusCourse.TERMINED).length
        ],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#EF4444',
          '#6B7280'
        ],
        hoverBackgroundColor: [
          '#2563EB',
          '#059669',
          '#DC2626',
          '#4B5563'
        ]
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  // Courses récentes (5 dernières)
  const recentCourses = courses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="text-3xl font-bold text-900 mb-4">Dashboard</h1>
      </div>

      {/* Cartes de statistiques */}
      <div className="col-12 md:col-3">
        <Card className="bg-blue-100 border-left-3 border-blue-500">
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-blue-600 font-medium text-sm">Total Courses</div>
              <div className="text-blue-900 font-bold text-2xl">{totalCourses}</div>
            </div>
            <i className="pi pi-calendar text-blue-500 text-2xl"></i>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="bg-green-100 border-left-3 border-green-500">
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-green-600 font-medium text-sm">Courses Affectées</div>
              <div className="text-green-900 font-bold text-2xl">{coursesAffected}</div>
            </div>
            <i className="pi pi-check-circle text-green-500 text-2xl"></i>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="bg-purple-100 border-left-3 border-purple-500">
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-purple-600 font-medium text-sm">Courses Terminées</div>
              <div className="text-purple-900 font-bold text-2xl">{coursesTermined}</div>
            </div>
            <i className="pi pi-flag text-purple-500 text-2xl"></i>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="bg-orange-100 border-left-3 border-orange-500">
          <div className="flex justify-content-between align-items-center">
            <div>
              <div className="text-orange-600 font-medium text-sm">Enquêteurs Actifs</div>
              <div className="text-orange-900 font-bold text-2xl">{activeUsers}</div>
            </div>
            <i className="pi pi-users text-orange-500 text-2xl"></i>
          </div>
        </Card>
      </div>

      {/* Graphique et courses récentes */}
      <div className="col-12 md:col-6">
        <Card title="Répartition des Courses" className="h-full">
          <div style={{ height: '300px' }}>
            {/* <Chart type="doughnut" data={chartData} options={chartOptions} /> */}
            <div className="text-center p-4">
              <p>Graphique temporairement désactivé</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card 
          title="Courses Récentes" 
          className="h-full"
          subTitle={`${recentCourses.length} dernières courses`}
        >
          <DataTable 
            value={recentCourses} 
            loading={loading}
            emptyMessage="Aucune course trouvée"
            size="small"
          >
            <Column 
              field="mission" 
              header="Mission" 
              style={{ width: '25%' }}
            />
            <Column 
              field="trainCourse" 
              header="Train" 
              style={{ width: '25%' }}
            />
            <Column 
              header="Date" 
              body={dateBodyTemplate}
              style={{ width: '30%' }}
            />
            <Column 
              header="Statut" 
              body={statusBodyTemplate}
              style={{ width: '20%' }}
            />
          </DataTable>
          
          <div className="mt-3 text-center">
            <Button 
              label="Voir toutes les courses" 
              icon="pi pi-arrow-right" 
              className="p-button-text"
              onClick={() => navigate('/courses')}
            />
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="col-12">
        <Card title="Actions Rapides">
          <div className="flex flex-wrap gap-3">
            <Button 
              label="Nouvelle Course" 
              icon="pi pi-plus" 
              onClick={() => navigate('/courses/new')}
            />
            <Button 
              label="Nouvel Enquêteur" 
              icon="pi pi-user-plus" 
              className="p-button-secondary"
              onClick={() => navigate('/users/new')}
            />
            <Button 
              label="Import Courses" 
              icon="pi pi-upload" 
              className="p-button-help"
              onClick={() => navigate('/courses/import')}
            />
            <Button 
              label="Import Enquêteurs" 
              icon="pi pi-upload" 
              className="p-button-warning"
              onClick={() => navigate('/users/import')}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;