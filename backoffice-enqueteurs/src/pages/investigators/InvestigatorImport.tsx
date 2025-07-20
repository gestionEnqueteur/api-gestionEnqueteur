import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { CreateUserDto, ImportResult, ImportError } from '@/types/api';
import { apiService } from '@/services/api';

interface ParsedUser {
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  blocked: boolean;
  roles: string[];
  expoPushToken?: string;
  [key: string]: any;
}

const InvestigatorImport: React.FC = () => {
  const [parsedData, setParsedData] = useState<ParsedUser[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const requiredFields = [
    'username',
    'email',
    'password'
  ];

  const fieldMapping = {
    'username': 'Nom d\'utilisateur',
    'email': 'Email',
    'password': 'Mot de passe',
    'confirmed': 'Confirmé',
    'blocked': 'Bloqué',
    'roles': 'Rôles',
    'expoPushToken': 'Token Push'
  };

  const validRoles = ['Admin', 'Enqueteur', 'Superviseur'];

  const parseFile = (file: File) => {
    setLoading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data as ParsedUser[]);
          setLoading(false);
        },
        error: (error) => {
          console.error('Erreur lors du parsing CSV:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la lecture du fichier CSV',
            life: 3000
          });
          setLoading(false);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ParsedUser[];
          processParsedData(jsonData);
        } catch (error) {
          console.error('Erreur lors du parsing Excel:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la lecture du fichier Excel',
            life: 3000
          });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Format non supporté',
        detail: 'Seuls les fichiers CSV et Excel sont supportés',
        life: 3000
      });
      setLoading(false);
    }
  };

  const processParsedData = (data: ParsedUser[]) => {
    // Normaliser les noms de colonnes
    const normalizedData = data.map(row => {
      const normalizedRow: ParsedUser = {
        username: '',
        email: '',
        password: '',
        confirmed: true,
        blocked: false,
        roles: ['Enqueteur']
      };
      
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim();
        const value = row[key];
        
        // Mapping des colonnes communes
        if (normalizedKey.includes('username') || normalizedKey.includes('utilisateur') || normalizedKey.includes('nom')) {
          normalizedRow.username = value;
        } else if (normalizedKey.includes('email') || normalizedKey.includes('mail')) {
          normalizedRow.email = value;
        } else if (normalizedKey.includes('password') || normalizedKey.includes('motdepasse') || normalizedKey.includes('mot_de_passe')) {
          normalizedRow.password = value;
        } else if (normalizedKey.includes('confirmed') || normalizedKey.includes('confirme')) {
          normalizedRow.confirmed = parseBooleanValue(value);
        } else if (normalizedKey.includes('blocked') || normalizedKey.includes('bloque')) {
          normalizedRow.blocked = parseBooleanValue(value);
        } else if (normalizedKey.includes('roles') || normalizedKey.includes('role')) {
          normalizedRow.roles = parseRolesValue(value);
        } else if (normalizedKey.includes('token') || normalizedKey.includes('push')) {
          normalizedRow.expoPushToken = value;
        }
      });
      
      return normalizedRow;
    });
    
    setParsedData(normalizedData);
    setImportResult(null);
  };

  const parseBooleanValue = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      return ['true', '1', 'oui', 'yes', 'vrai'].includes(lowerValue);
    }
    if (typeof value === 'number') return value === 1;
    return false;
  };

  const parseRolesValue = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Séparer par virgule, point-virgule ou pipe
      const roles = value.split(/[,;|]/).map(role => role.trim());
      return roles.filter(role => validRoles.includes(role));
    }
    return ['Enqueteur']; // Rôle par défaut
  };

  const validateData = (data: ParsedUser[]): ImportError[] => {
    const errors: ImportError[] = [];
    const existingUsernames = new Set<string>();
    const existingEmails = new Set<string>();
    
    data.forEach((row, index) => {
      // Vérifier les champs requis
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push({
            row: index + 1,
            field,
            message: `Le champ ${fieldMapping[field as keyof typeof fieldMapping]} est requis`,
            data: row
          });
        }
      });
      
      // Valider l'email
      if (row.email && !isValidEmail(row.email)) {
        errors.push({
          row: index + 1,
          field: 'email',
          message: 'Format d\'email invalide',
          data: row
        });
      }
      
      // Valider la longueur du mot de passe
      if (row.password && row.password.length < 6) {
        errors.push({
          row: index + 1,
          field: 'password',
          message: 'Le mot de passe doit contenir au moins 6 caractères',
          data: row
        });
      }
      
      // Valider la longueur du nom d'utilisateur
      if (row.username && row.username.length < 3) {
        errors.push({
          row: index + 1,
          field: 'username',
          message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
          data: row
        });
      }
      
      // Vérifier les doublons dans le fichier
      if (row.username) {
        if (existingUsernames.has(row.username.toLowerCase())) {
          errors.push({
            row: index + 1,
            field: 'username',
            message: 'Nom d\'utilisateur en doublon dans le fichier',
            data: row
          });
        } else {
          existingUsernames.add(row.username.toLowerCase());
        }
      }
      
      if (row.email) {
        if (existingEmails.has(row.email.toLowerCase())) {
          errors.push({
            row: index + 1,
            field: 'email',
            message: 'Email en doublon dans le fichier',
            data: row
          });
        } else {
          existingEmails.add(row.email.toLowerCase());
        }
      }
      
      // Valider les rôles
      if (row.roles && row.roles.length > 0) {
        const invalidRoles = row.roles.filter(role => !validRoles.includes(role));
        if (invalidRoles.length > 0) {
          errors.push({
            row: index + 1,
            field: 'roles',
            message: `Rôles invalides: ${invalidRoles.join(', ')}. Rôles valides: ${validRoles.join(', ')}`,
            data: row
          });
        }
      }
    });
    
    return errors;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const importData = async () => {
    if (parsedData.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Aucune donnée à importer',
        life: 3000
      });
      return;
    }

    const errors = validateData(parsedData);
    
    if (errors.length > 0) {
      setImportResult({
        success: 0,
        errors,
        total: parsedData.length
      });
      return;
    }

    setImporting(true);
    let successCount = 0;
    const importErrors: ImportError[] = [];

    try {
      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        try {
          const userData: CreateUserDto = {
            username: row.username,
            email: row.email,
            password: row.password,
            confirmed: row.confirmed,
            blocked: row.blocked,
            roles: row.roles,
            expoPushToken: row.expoPushToken
          };
          
          await apiService.createUser(userData);
          successCount++;
        } catch (error: any) {
          let errorMessage = 'Erreur lors de la création';
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.status === 409) {
            errorMessage = 'Utilisateur déjà existant (nom ou email)';
          }
          
          importErrors.push({
            row: i + 1,
            field: 'general',
            message: errorMessage,
            data: row
          });
        }
      }
      
      setImportResult({
        success: successCount,
        errors: importErrors,
        total: parsedData.length
      });
      
      if (successCount > 0) {
        toast.current?.show({
          severity: 'success',
          summary: 'Import terminé',
          detail: `${successCount} enquêteur(s) importé(s) avec succès`,
          life: 5000
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de l\'import des données',
        life: 3000
      });
    } finally {
      setImporting(false);
    }
  };

  const onUpload = (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    if (file) {
      parseFile(file);
    }
  };

  const rolesBodyTemplate = (rowData: ParsedUser) => {
    return (
      <div className="flex gap-1 flex-wrap">
        {rowData.roles.map((role, index) => {
          const isValid = validRoles.includes(role);
          return (
            <Tag 
              key={index} 
              value={role} 
              severity={isValid ? 'success' : 'danger'}
            />
          );
        })}
      </div>
    );
  };

  const statusBodyTemplate = (rowData: ParsedUser) => {
    if (rowData.blocked) {
      return <Tag value="Bloqué" severity="danger" />;
    }
    if (!rowData.confirmed) {
      return <Tag value="Non confirmé" severity="warning" />;
    }
    return <Tag value="Actif" severity="success" />;
  };

  const errorBodyTemplate = (rowData: ImportError) => {
    return (
      <Tag 
        value={rowData.message} 
        severity="danger"
        className="text-xs"
      />
    );
  };

  const generateSampleCSV = () => {
    const sampleData = [
      {
        'username': 'enqueteur1',
        'email': 'enqueteur1@exemple.com',
        'password': 'motdepasse123',
        'confirmed': 'true',
        'blocked': 'false',
        'roles': 'Enqueteur',
        'expoPushToken': ''
      },
      {
        'username': 'superviseur1',
        'email': 'superviseur1@exemple.com',
        'password': 'motdepasse456',
        'confirmed': 'true',
        'blocked': 'false',
        'roles': 'Superviseur,Enqueteur',
        'expoPushToken': ''
      }
    ];
    
    const headers = Object.keys(sampleData[0]);
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exemple_enqueteurs.csv';
    link.click();
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <Card title="Import d'Enquêteurs" subTitle="Import en masse via fichiers CSV ou Excel">
        <div className="grid">
          <div className="col-12">
            <Message 
              severity="info" 
              text="Formats supportés: CSV, Excel (.xlsx, .xls). Les colonnes requises sont: username, email, password. Les colonnes optionnelles: confirmed, blocked, roles, expoPushToken."
              className="mb-4"
            />
          </div>
          
          <div className="col-12">
            <div className="flex gap-2 mb-4">
              <FileUpload
                mode="basic"
                name="file"
                accept=".csv,.xlsx,.xls"
                maxFileSize={10000000}
                customUpload
                uploadHandler={onUpload}
                chooseLabel="Choisir un fichier"
                disabled={loading || importing}
              />
              <Button
                label="Télécharger exemple CSV"
                icon="pi pi-download"
                className="p-button-outlined"
                onClick={generateSampleCSV}
              />
            </div>
          </div>
          
          {loading && (
            <div className="col-12">
              <ProgressBar mode="indeterminate" className="mb-4" />
              <p className="text-center">Analyse du fichier en cours...</p>
            </div>
          )}
          
          {parsedData.length > 0 && (
            <>
              <div className="col-12">
                <Divider />
                <div className="flex justify-content-between align-items-center mb-3">
                  <h3>Aperçu des données ({parsedData.length} lignes)</h3>
                  <Button
                    label="Importer"
                    icon="pi pi-upload"
                    onClick={importData}
                    loading={importing}
                    disabled={parsedData.length === 0}
                  />
                </div>
                
                <DataTable
                  value={parsedData.slice(0, 10)}
                  responsiveLayout="scroll"
                  stripedRows
                  size="small"
                >
                  <Column field="username" header="Nom d'utilisateur" />
                  <Column field="email" header="Email" />
                  <Column field="password" header="Mot de passe" body={() => '••••••••'} />
                  <Column header="Rôles" body={rolesBodyTemplate} />
                  <Column header="Statut" body={statusBodyTemplate} />
                </DataTable>
                
                {parsedData.length > 10 && (
                  <p className="text-center mt-2 text-600">
                    ... et {parsedData.length - 10} autres lignes
                  </p>
                )}
              </div>
            </>
          )}
          
          {importResult && (
            <>
              <div className="col-12">
                <Divider />
                <h3>Résultat de l'import</h3>
                
                <div className="grid">
                  <div className="col-12 md:col-4">
                    <Card className="bg-green-100 border-left-3 border-green-500">
                      <div className="text-green-600 font-medium text-sm">Succès</div>
                      <div className="text-green-900 font-bold text-2xl">{importResult.success}</div>
                    </Card>
                  </div>
                  
                  <div className="col-12 md:col-4">
                    <Card className="bg-red-100 border-left-3 border-red-500">
                      <div className="text-red-600 font-medium text-sm">Erreurs</div>
                      <div className="text-red-900 font-bold text-2xl">{importResult.errors.length}</div>
                    </Card>
                  </div>
                  
                  <div className="col-12 md:col-4">
                    <Card className="bg-blue-100 border-left-3 border-blue-500">
                      <div className="text-blue-600 font-medium text-sm">Total</div>
                      <div className="text-blue-900 font-bold text-2xl">{importResult.total}</div>
                    </Card>
                  </div>
                </div>
                
                {importResult.errors.length > 0 && (
                  <>
                    <h4 className="mt-4">Erreurs détaillées</h4>
                    <DataTable
                      value={importResult.errors}
                      responsiveLayout="scroll"
                      stripedRows
                      size="small"
                      paginator
                      rows={10}
                    >
                      <Column field="row" header="Ligne" style={{ width: '80px' }} />
                      <Column field="field" header="Champ" style={{ width: '120px' }} />
                      <Column header="Message" body={errorBodyTemplate} />
                    </DataTable>
                  </>
                )}
              </div>
            </>
          )}
          
          <div className="col-12">
            <Divider />
            <div className="flex gap-2 justify-content-end">
              <Button
                label="Retour"
                icon="pi pi-arrow-left"
                className="p-button-secondary"
                onClick={() => navigate('/investigators')}
              />
              {importResult?.success > 0 && (
                <Button
                  label="Voir les enquêteurs"
                  icon="pi pi-list"
                  onClick={() => navigate('/investigators')}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvestigatorImport;