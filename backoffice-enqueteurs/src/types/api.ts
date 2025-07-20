// Types basés sur les DTOs de l'API NestJS

export enum StatusCourse {
  DRAFT = 'DRAFT',
  AFFECTED = 'AFFECTED',
  CANCELED = 'CANCELED',
  TERMINED = 'TERMINED'
}

export enum TypeMesure {
  BSC = 'BSC',
  MQ = 'MQ'
}

export enum MissionType {
  BSC = 'BSC',
  MQ = 'MQ',
  IT = 'IT',
  HLP = 'HLP'
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  confirmed: boolean;
  blocked: boolean;
  roles: string[];
  expoPushToken?: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  confirmed: boolean;
  blocked: boolean;
  roles?: string[];
  expoPushToken?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface Course {
  id: number;
  mission: string;
  trainCourse: string;
  commentaire?: string;
  ligne?: string;
  objectif?: number;
  service?: string;
  hd: string;
  ha: string;
  status: StatusCourse;
  departureTimeOrigin?: string;
  arrivalTimeTerminus?: string;
  placeDeparture: string;
  placeArrival: string;
  pds?: string;
  vac?: string;
  affectationId?: number;
  affectation?: User;
  mesure?: Mesure[];
  createdAt: string;
  updatadAt: string;
}

export interface CreateCourseDto {
  mission: string;
  trainCourse: string;
  commentaire?: string;
  ligne?: string;
  objectif?: number;
  service?: string;
  hd: string | Date;
  ha: string | Date;
  status: StatusCourse;
  departureTimeOrigin?: string | Date;
  arrivalTimeTerminus?: string | Date;
  placeDeparture: string;
  placeArrival: string;
  pds?: string;
  vac?: string;
  affectationId?: number;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface Mesure {
  id: number;
  courseId: number;
  type: TypeMesure;
  isCurrent: boolean;
  mesureBsc?: MesureBsc;
  mesureMq?: MesureMQ;
  createAt: string;
  updatedAt: string;
}

export interface MesureBsc {
  id: number;
  mesureId: number;
  composition?: string;
  numMaterial?: string;
  distrbutedQuestionnaire?: number;
  emptyQuestionnaire?: number;
  invalidQuestionnaire?: number;
  validQuestionnnaire?: number;
  lateDeparture?: number;
  lateArrived?: number;
  departureStation?: string;
  arrivalStation?: string;
}

export interface MesureMQ {
  id: number;
  mesureId: number;
  mileage: number;
  numberPlate: string;
  busBrand: string;
  driverBadge: boolean;
  usb: boolean;
  onBoardConfort: boolean;
  ticketCheck: boolean;
  applicationLocaliTER: boolean;
  destinationDisplay: boolean;
  routeIndicator: boolean;
  wheelchairRamp: boolean;
  busLoad: boolean;
  outdoorCleanliness: boolean;
  intdoorCleanliness: boolean;
  intdoorState: boolean;
  outdoorState: boolean;
  ontimeDeparture: boolean;
  itinerary: boolean;
  availabilityAtThePlatform: boolean;
  commercialBehavior: boolean;
  uniform: boolean;
  drivingBehavior: boolean;
  comment: string;
}

export interface CreateMesureDto {
  courseId: number;
  type: TypeMesure;
  isCurrent?: boolean;
}

// Types pour l'authentification
export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}

// Types pour l'import CSV/Excel
export interface ImportResult {
  success: number;
  errors: ImportError[];
  total: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  data: any;
}

// Types pour les filtres et pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CourseFilters extends PaginationParams {
  status?: StatusCourse;
  mission?: string;
  affectationId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}