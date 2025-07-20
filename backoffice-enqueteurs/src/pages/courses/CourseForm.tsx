import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Course, CreateCourseDto, StatusCourse, MissionType, User } from '@/types/api';
import { apiService } from '@/services/api';

const courseSchema = z.object({
  mission: z.string().min(1, 'La mission est requise'),
  trainCourse: z.string().min(1, 'Le train/course est requis'),
  commentaire: z.string().optional(),
  ligne: z.string().optional(),
  objectif: z.number().min(0, 'L\'objectif doit être un nombre positif').nullable().optional(),
  service: z.string().optional(),
  hd: z.union([z.date(), z.string().transform((str) => new Date(str))]),
  ha: z.union([z.date(), z.string().transform((str) => new Date(str))]),
  status: z.nativeEnum(StatusCourse),
  departureTimeOrigin: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
  arrivalTimeTerminus: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
  placeDeparture: z.string().min(1, 'Le lieu de départ est requis'),
  placeArrival: z.string().min(1, 'Le lieu d\'arrivée est requis'),
  pds: z.string().optional(),
  vac: z.string().optional(),
  affectationId: z.number().optional()
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const isEdit = !!id;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: StatusCourse.DRAFT,
      mission: MissionType.BSC
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await apiService.getUsers();
        setUsers(usersData.filter(u => !u.blocked));

        if (isEdit && id) {
          const course = await apiService.getCourse(parseInt(id));
          reset({
            mission: course.mission,
            trainCourse: course.trainCourse,
            commentaire: course.commentaire || '',
            ligne: course.ligne || '',
            objectif: course.objectif || undefined,
            service: course.service || '',
            hd: new Date(course.hd),
            ha: new Date(course.ha),
            status: course.status,
            departureTimeOrigin: course.departureTimeOrigin ? new Date(course.departureTimeOrigin) : undefined,
            arrivalTimeTerminus: course.arrivalTimeTerminus ? new Date(course.arrivalTimeTerminus) : undefined,
            placeDeparture: course.placeDeparture,
            placeArrival: course.placeArrival,
            pds: course.pds || '',
            vac: course.vac || '',
            affectationId: course.affectationId || undefined
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des données',
          life: 3000
        });
      }
    };

    fetchData();
  }, [id, isEdit, reset]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);
      
      const courseData: CreateCourseDto = {
        ...data,
        hd: data.hd.toISOString().split('T')[0],
        ha: data.ha.toISOString().split('T')[0],
        departureTimeOrigin: data.departureTimeOrigin?.toISOString(),
        arrivalTimeTerminus: data.arrivalTimeTerminus?.toISOString()
      };
      
      console.log('Données envoyées à l\'API:', courseData);

      if (isEdit && id) {
        await apiService.updateCourse(parseInt(id), courseData);
        toast.current?.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Course modifiée avec succès',
          life: 3000
        });
      } else {
        await apiService.createCourse(courseData);
        toast.current?.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Course créée avec succès',
          life: 3000
        });
      }
      
      navigate('/courses');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: error.response?.data?.message || 'Erreur lors de la sauvegarde',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const missionOptions = [
    { label: 'BSC', value: MissionType.BSC },
    { label: 'MQ', value: MissionType.MQ },
    { label: 'IT', value: MissionType.IT },
    { label: 'HLP', value: MissionType.HLP }
  ];

  const statusOptions = [
    { label: 'Brouillon', value: StatusCourse.DRAFT },
    { label: 'Affectée', value: StatusCourse.AFFECTED },
    { label: 'Annulée', value: StatusCourse.CANCELED },
    { label: 'Terminée', value: StatusCourse.TERMINED }
  ];

  const userOptions = users.map(user => ({
    label: user.username,
    value: user.id
  }));

  const getFormErrorMessage = (name: keyof CourseFormData) => {
    return errors[name] && <small className="p-error">{errors[name]?.message}</small>;
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <Card 
        title={isEdit ? 'Modifier la Course' : 'Nouvelle Course'}
        subTitle={isEdit ? `Modification de la course #${id}` : 'Créer une nouvelle course'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="grid">
            {/* Informations principales */}
            <div className="col-12">
              <h3 className="text-xl font-semibold mb-3">Informations principales</h3>
            </div>
            
            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="mission" className="block text-900 font-medium mb-2">
                  Mission *
                </label>
                <Controller
                  name="mission"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      id="mission"
                      {...field}
                      options={missionOptions}
                      placeholder="Sélectionner une mission"
                      className={errors.mission ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('mission')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="trainCourse" className="block text-900 font-medium mb-2">
                  Train/Course *
                </label>
                <Controller
                  name="trainCourse"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="trainCourse"
                      {...field}
                      placeholder="Ex: TER 123456"
                      className={errors.trainCourse ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('trainCourse')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="ligne" className="block text-900 font-medium mb-2">
                  Ligne
                </label>
                <Controller
                  name="ligne"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="ligne"
                      {...field}
                      placeholder="Ex: L1, L2..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="service" className="block text-900 font-medium mb-2">
                  Service
                </label>
                <Controller
                  name="service"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="service"
                      {...field}
                      placeholder="Service"
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="field">
                <label htmlFor="commentaire" className="block text-900 font-medium mb-2">
                  Commentaire
                </label>
                <Controller
                  name="commentaire"
                  control={control}
                  render={({ field }) => (
                    <InputTextarea
                      id="commentaire"
                      {...field}
                      rows={3}
                      placeholder="Commentaires additionnels..."
                    />
                  )}
                />
              </div>
            </div>

            <Divider />

            {/* Lieux et horaires */}
            <div className="col-12">
              <h3 className="text-xl font-semibold mb-3">Lieux et horaires</h3>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="placeDeparture" className="block text-900 font-medium mb-2">
                  Lieu de départ *
                </label>
                <Controller
                  name="placeDeparture"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="placeDeparture"
                      {...field}
                      placeholder="Gare de départ"
                      className={errors.placeDeparture ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('placeDeparture')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="placeArrival" className="block text-900 font-medium mb-2">
                  Lieu d'arrivée *
                </label>
                <Controller
                  name="placeArrival"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="placeArrival"
                      {...field}
                      placeholder="Gare d'arrivée"
                      className={errors.placeArrival ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('placeArrival')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="hd" className="block text-900 font-medium mb-2">
                  Heure de départ *
                </label>
                <Controller
                  name="hd"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      id="hd"
                      {...field}
                      showTime
                      hourFormat="24"
                      placeholder="Sélectionner date et heure"
                      className={errors.hd ? 'p-invalid' : ''}
                      dateFormat="dd/mm/yy"
                    />
                  )}
                />
                {getFormErrorMessage('hd')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="ha" className="block text-900 font-medium mb-2">
                  Heure d'arrivée *
                </label>
                <Controller
                  name="ha"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      id="ha"
                      {...field}
                      showTime
                      hourFormat="24"
                      placeholder="Sélectionner date et heure"
                      className={errors.ha ? 'p-invalid' : ''}
                      dateFormat="dd/mm/yy"
                    />
                  )}
                />
                {getFormErrorMessage('ha')}
              </div>
            </div>

            <Divider />

            {/* Affectation et statut */}
            <div className="col-12">
              <h3 className="text-xl font-semibold mb-3">Affectation et statut</h3>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="affectationId" className="block text-900 font-medium mb-2">
                  Enquêteur affecté
                </label>
                <Controller
                  name="affectationId"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      id="affectationId"
                      {...field}
                      options={userOptions}
                      placeholder="Sélectionner un enquêteur"
                      showClear
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="status" className="block text-900 font-medium mb-2">
                  Statut *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      id="status"
                      {...field}
                      options={statusOptions}
                      placeholder="Sélectionner un statut"
                      className={errors.status ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('status')}
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="objectif" className="block text-900 font-medium mb-2">
                  Objectif
                </label>
                <Controller
                  name="objectif"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <InputNumber
                      id="objectif"
                      {...field}
                      value={value || null}
                      onValueChange={(e) => onChange(e.value)}
                      placeholder="Objectif numérique"
                      min={0}
                      useGrouping={false}
                      className={errors.objectif ? 'p-invalid' : ''}
                    />
                  )}
                />
                {getFormErrorMessage('objectif')}
              </div>
            </div>

            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="pds" className="block text-900 font-medium mb-2">
                  PDS
                </label>
                <Controller
                  name="pds"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="pds"
                      {...field}
                      placeholder="PDS"
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-12 md:col-3">
              <div className="field">
                <label htmlFor="vac" className="block text-900 font-medium mb-2">
                  VAC
                </label>
                <Controller
                  name="vac"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id="vac"
                      {...field}
                      placeholder="VAC"
                    />
                  )}
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="col-12">
              <Divider />
              <div className="flex gap-2 justify-content-end">
                <Button
                  type="button"
                  label="Annuler"
                  icon="pi pi-times"
                  className="p-button-secondary"
                  onClick={() => navigate('/courses')}
                />
                <Button
                  type="submit"
                  label={isEdit ? 'Modifier' : 'Créer'}
                  icon={isEdit ? 'pi pi-check' : 'pi pi-plus'}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CourseForm;