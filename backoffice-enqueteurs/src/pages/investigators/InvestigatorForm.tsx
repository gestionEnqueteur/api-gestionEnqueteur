import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CreateUserDto, UpdateUserDto, User } from '@/types/api';
import { apiService } from '@/services/api';

const userSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  confirmed: z.boolean(),
  blocked: z.boolean(),
  roles: z.array(z.string()).optional(),
  expoPushToken: z.string().optional()
});

type UserFormData = z.infer<typeof userSchema>;

const InvestigatorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [user, setUser] = useState<User | null>(null);
  const isEdit = !!id;

  const roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Enquêteur', value: 'Enqueteur' },
    { label: 'Superviseur', value: 'Superviseur' }
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmed: true,
      blocked: false,
      roles: ['Enqueteur'],
      expoPushToken: ''
    }
  });

  useEffect(() => {
    if (isEdit && id) {
      loadUser(id);
    }
  }, [id, isEdit]);

  const loadUser = async (userId: string) => {
    try {
      setInitialLoading(true);
      const userData = await apiService.getUser(userId);
      setUser(userData);
      
      // Reset form with user data
      reset({
        username: userData.username,
        email: userData.email,
        password: '', // Ne pas pré-remplir le mot de passe
        confirmed: userData.confirmed,
        blocked: userData.blocked,
        roles: userData.roles || ['Enqueteur'],
        expoPushToken: userData.expoPushToken || ''
      });
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
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      
      if (isEdit && user) {
        // Mode édition
        const updateData: UpdateUserDto = {
          username: data.username,
          email: data.email,
          confirmed: data.confirmed,
          blocked: data.blocked,
          roles: data.roles,
          expoPushToken: data.expoPushToken
        };
        
        // Ajouter le mot de passe seulement s'il est fourni
        if (data.password && data.password.trim() !== '') {
          updateData.password = data.password;
        }
        
        await apiService.updateUser(user.id, updateData);
        
        toast.current?.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Enquêteur modifié avec succès',
          life: 3000
        });
      } else {
        // Mode création
        if (!data.password || data.password.trim() === '') {
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Le mot de passe est requis pour créer un nouvel utilisateur',
            life: 3000
          });
          return;
        }
        
        const createData: CreateUserDto = {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmed: data.confirmed,
          blocked: data.blocked,
          roles: data.roles,
          expoPushToken: data.expoPushToken
        };
        
        await apiService.createUser(createData);
        
        toast.current?.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Enquêteur créé avec succès',
          life: 3000
        });
      }
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/investigators');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      let errorMessage = 'Erreur lors de la sauvegarde';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'Un utilisateur avec ce nom ou cet email existe déjà';
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    reset({
      ...watch(),
      password: newPassword
    });
    
    toast.current?.show({
      severity: 'info',
      summary: 'Mot de passe généré',
      detail: 'Un nouveau mot de passe a été généré',
      life: 3000
    });
  };

  if (initialLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      
      <Card 
        title={isEdit ? `Modifier l'enquêteur: ${user?.username}` : 'Nouvel enquêteur'}
        subTitle={isEdit ? 'Modification des informations de l\'enquêteur' : 'Création d\'un nouvel enquêteur'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid">
            {/* Informations de base */}
            <div className="col-12">
              <h3>Informations de base</h3>
              <Divider />
            </div>
            
            <div className="col-12 md:col-6">
              <label htmlFor="username" className="block text-900 font-medium mb-2">
                Nom d'utilisateur *
              </label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="username"
                    {...field}
                    className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                    placeholder="Nom d'utilisateur"
                  />
                )}
              />
              {errors.username && (
                <small className="p-error">{errors.username.message}</small>
              )}
            </div>
            
            <div className="col-12 md:col-6">
              <label htmlFor="email" className="block text-900 font-medium mb-2">
                Email *
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="email"
                    {...field}
                    type="email"
                    className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                    placeholder="email@exemple.com"
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>
            
            {/* Mot de passe */}
            <div className="col-12">
              <h3>Sécurité</h3>
              <Divider />
            </div>
            
            <div className="col-12 md:col-8">
              <label htmlFor="password" className="block text-900 font-medium mb-2">
                Mot de passe {!isEdit && '*'}
              </label>
              {isEdit && (
                <Message 
                  severity="info" 
                  text="Laissez vide pour conserver le mot de passe actuel"
                  className="mb-2"
                />
              )}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Password
                    id="password"
                    {...field}
                    className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                    placeholder={isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                    toggleMask
                    feedback={!isEdit}
                  />
                )}
              />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
            </div>
            
            <div className="col-12 md:col-4">
              <label className="block text-900 font-medium mb-2">
                &nbsp;
              </label>
              <Button
                type="button"
                label="Générer"
                icon="pi pi-refresh"
                className="p-button-outlined w-full"
                onClick={handleGeneratePassword}
              />
            </div>
            
            <div className="col-12 md:col-6">
              <label htmlFor="expoPushToken" className="block text-900 font-medium mb-2">
                Token Push Expo
              </label>
              <Controller
                name="expoPushToken"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="expoPushToken"
                    {...field}
                    className="w-full"
                    placeholder="Token pour les notifications push"
                  />
                )}
              />
            </div>
            
            {/* Rôles et permissions */}
            <div className="col-12">
              <h3>Rôles et permissions</h3>
              <Divider />
            </div>
            
            <div className="col-12 md:col-6">
              <label htmlFor="roles" className="block text-900 font-medium mb-2">
                Rôles
              </label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    id="roles"
                    value={field.value}
                    options={roleOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Sélectionner les rôles"
                    className="w-full"
                    display="chip"
                  />
                )}
              />
            </div>
            
            {/* Statut */}
            <div className="col-12">
              <h3>Statut du compte</h3>
              <Divider />
            </div>
            
            <div className="col-12 md:col-6">
              <div className="field-checkbox">
                <Controller
                  name="confirmed"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="confirmed"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="confirmed" className="ml-2">
                  Compte confirmé
                </label>
              </div>
              <small className="text-600">
                Un compte confirmé peut se connecter à l'application
              </small>
            </div>
            
            <div className="col-12 md:col-6">
              <div className="field-checkbox">
                <Controller
                  name="blocked"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      inputId="blocked"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
                <label htmlFor="blocked" className="ml-2">
                  Compte bloqué
                </label>
              </div>
              <small className="text-600">
                Un compte bloqué ne peut pas se connecter
              </small>
            </div>
            
            {/* Actions */}
            <div className="col-12">
              <Divider />
              <div className="flex gap-2 justify-content-end">
                <Button
                  type="button"
                  label="Annuler"
                  icon="pi pi-times"
                  className="p-button-secondary"
                  onClick={() => navigate('/investigators')}
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

export default InvestigatorForm;