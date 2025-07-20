import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/pages/Dashboard';
import CoursesList from '@/pages/courses/CoursesList';
import CourseForm from '@/pages/courses/CourseForm';
import CourseImport from '@/pages/courses/CourseImport';
import InvestigatorsList from '@/pages/investigators/InvestigatorsList';
import InvestigatorForm from '@/pages/investigators/InvestigatorForm';
import InvestigatorImport from '@/pages/investigators/InvestigatorImport';
import InvestigatorDetail from '@/pages/investigators/InvestigatorDetail';
import MeasurementsList from '@/pages/measurements/MeasurementsList';

// Configuration de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route de connexion */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Routes sans protection */}
            <Route path="/" element={<Layout />}>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* Courses */}
              <Route path="courses" element={<CoursesList />} />
              <Route path="courses/new" element={<CourseForm />} />
              <Route path="courses/import" element={<CourseImport />} />
              <Route path="courses/:id" element={<CourseForm />} />
              <Route path="courses/:id/edit" element={<CourseForm />} />
              
              {/* Investigators */}
              <Route path="investigators" element={<InvestigatorsList />} />
              <Route path="investigators/new" element={<InvestigatorForm />} />
              <Route path="investigators/import" element={<InvestigatorImport />} />
              <Route path="investigators/:id" element={<InvestigatorDetail />} />
              <Route path="investigators/:id/edit" element={<InvestigatorForm />} />
              
              {/* Measurements */}
              <Route path="measurements" element={<MeasurementsList />} />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;