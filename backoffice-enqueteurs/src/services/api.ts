import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  Course,
  CreateUserDto,
  UpdateUserDto,
  CreateCourseDto,
  UpdateCourseDto,
  LoginDto,
  AuthResponse,
  CourseFilters,
  CreateMesureDto,
  Mesure
} from '@/types/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs de réponse
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Récupérer le token du localStorage au démarrage
    this.token = localStorage.getItem('auth_token');
  }

  // Méthodes d'authentification
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    this.token = response.data.access_token;
    localStorage.setItem('auth_token', this.token);
    return response.data;
  }

  async loginFromScratch(credentials: LoginDto): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/loginFromScratch', credentials);
    this.token = response.data.access_token;
    localStorage.setItem('auth_token', this.token);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Méthodes pour les utilisateurs
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Méthodes pour les courses
  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response: AxiosResponse<Course[]> = await this.api.get(`/courses?${params.toString()}`);
    return response.data;
  }

  async getCourse(id: number): Promise<Course> {
    const response: AxiosResponse<Course> = await this.api.get(`/courses/${id}`);
    return response.data;
  }

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    const response: AxiosResponse<Course> = await this.api.post('/courses', courseData);
    return response.data;
  }

  async updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course> {
    const response: AxiosResponse<Course> = await this.api.patch(`/courses/${id}`, courseData);
    return response.data;
  }

  async deleteCourse(id: number): Promise<void> {
    await this.api.delete(`/courses/${id}`);
  }

  // Méthodes pour les courses des enquêteurs
  async getEnqueteurCourses(): Promise<Course[]> {
    const response: AxiosResponse<Course[]> = await this.api.get('/enq/courses');
    return response.data;
  }

  // Méthodes pour les mesures
  async createMesure(mesureData: CreateMesureDto): Promise<Mesure> {
    const response: AxiosResponse<Mesure> = await this.api.post('/enq/mesures', mesureData);
    return response.data;
  }

  // Méthodes pour l'import en masse
  async importCourses(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.api.post('/courses/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async importUsers(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.api.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;