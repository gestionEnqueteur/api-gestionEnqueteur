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
import { CreateCourseDto, StatusCourse, MissionType, ImportResult, ImportError } from '@/types/api';
import { apiService } from '@/services/api';

interface ParsedCourse {
  mission: string;
  trainCourse: string;
  commentaire?: string;
  ligne?: string;
  objectif?: number;
  service?: string;
  hd: string;
  ha: string;
  status: string;
  placeDeparture: string;
  placeArrival: string;
  pds?: string;
  vac?: string;
  [key: string]: any;
}

const CourseImport: React.FC = () => {
  const [parsedData, setParsedData] = useState<ParsedCourse[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const requiredFields = [
    'mission',
    'trainCourse', 
    'hd',
    'ha',
    'placeDeparture',
    'placeArrival',
    'status'
  ];

  const fieldMapping = {
    'mission': 'Mission',
    'trainCourse': 'Train/Course',
    'commentaire': 'Commentaire',
    'ligne': 'Ligne',
    'objectif': 'Objectif',
    'service': 'Service',
    'hd': 'Heure Départ',
    'ha': 'Heure Arrivée',
    'status': 'Statut',
    'placeDeparture': 'Lieu Départ',
    'placeArrival': 'Lieu Arrivée',
    'pds': 'PDS',
    'vac': 'VAC'
  };

  const parseFile = (file: File) => {
    setLoading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data as ParsedCourse[]);
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
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ParsedCourse[];
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

  const processParsedData = (data: ParsedCourse[]) => {
    // Normaliser les noms de colonnes
    const normalizedData = data.map(row => {
      const normalizedRow: ParsedCourse = {
        mission: '',
        trainCourse: '',
        hd: '',
        ha: '',
        status: '',
        placeDeparture: '',
        placeArrival: ''
      };
      
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim();
        const value = row[key];
        
        // Mapping des colonnes communes
        if (normalizedKey.includes('mission')) normalizedRow.mission = value;
        else if (normalizedKey.includes('train') || normalizedKey.includes('course')) normalizedRow.trainCourse = value;
        else if (normalizedKey.includes('commentaire')) normalizedRow.commentaire = value;
        else if (normalizedKey.includes('ligne')) normalizedRow.ligne = value;
        else if (normalizedKey.includes('objectif')) normalizedRow.objectif = parseInt(value) || undefined;
        else if (normalizedKey.includes('service')) normalizedRow.service = value;
        else if (normalizedKey.includes('heure') && normalizedKey.includes('depart') || normalizedKey === 'hd') normalizedRow.hd = value;
        else if (normalizedKey.includes('heure') && normalizedKey.includes('arrivee') || normalizedKey === 'ha') normalizedRow.ha = value;
        else if (normalizedKey.includes('statut') || normalizedKey.includes('status')) normalizedRow.status = value;
        else if (normalizedKey.includes('lieu') && normalizedKey.includes('depart') || normalizedKey.includes('placedeparture')) normalizedRow.placeDeparture = value;
        else if (normalizedKey.includes('lieu') && normalizedKey.includes('arrivee') || normalizedKey.includes('placearrival')) normalizedRow.placeArrival = value;
        else if (normalizedKey.includes('pds')) normalizedRow.pds = value;
        else if (normalizedKey.includes('vac')) normalizedRow.vac = value;
      });
      
      return normalizedRow;
    });
    
    setParsedData(normalizedData);
    setImportResult(null);
  };

  const validateData = (data: ParsedCourse[]): ImportError[] => {
    const errors: ImportError[] = [];
    
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
      
      // Valider le format des dates
      if (row.hd && !isValidDate(row.hd)) {
        errors.push({
          row: index + 1,
          field: 'hd',
          message: 'Format de date invalide pour l\'heure de départ',
          data: row
        });
      }
      
      if (row.ha && !isValidDate(row.ha)) {
        errors.push({
          row: index + 1,
          field: 'ha',
          message: 'Format de date invalide pour l\'heure d\'arrivée',
          data: row
        });
      }
      
      // Valider la mission
      if (row.mission && !Object.values(MissionType).includes(row.mission as MissionType)) {
        errors.push({
          row: index + 1,
          field: 'mission',
          message: `Mission invalide. Valeurs acceptées: ${Object.values(MissionType).join(', ')}`,
          data: row
        });
      }
      
      // Valider le statut
      if (row.status && !Object.values(StatusCourse).includes(row.status as StatusCourse)) {
        errors.push({
          row: index + 1,
          field: 'status',
          message: `Statut invalide. Valeurs acceptées: ${Object.values(StatusCourse).join(', ')}`,
          data: row
        });
      }
    });
    
    return errors;
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
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
          const courseData: CreateCourseDto = {
            mission: row.mission,
            trainCourse: row.trainCourse,
            commentaire: row.commentaire,
            ligne: row.ligne,
            objectif: row.objectif,
            service: row.service,
            hd: new Date(row.hd),
            ha: new Date(row.ha),
            status: row.status as StatusCourse,
            placeDeparture: row.placeDeparture,
            placeArrival: row.placeArrival,
            pds: row.pds,
            vac: row.vac
          };
          
          await apiService.createCourse(courseData);
          successCount++;
        } catch (error: any) {
          importErrors.push({
            row: i + 1,
            field: 'general',
            message: error.response?.data?.message || 'Erreur lors de la création',
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
          detail: `${successCount} course(s) importée(s) avec succès`,
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

  const statusBodyTemplate = (rowData: ParsedCourse) => {
    const isValid = Object.values(StatusCourse).includes(rowData.status as StatusCourse);
    return (
      <Tag 
        value={rowData.status} 
        severity={isValid ? 'success' : 'danger'}
      />
    );
  };

  const missionBodyTemplate = (rowData: ParsedCourse) => {
    const isValid = Object.values(MissionType).includes(rowData.mission as MissionType);
    return (
      <Tag 
        value={rowData.mission} 
        severity={isValid ? 'success' : 'danger'}
      />
    );
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

  return (
    <div>
      <Toast ref={toast} />
      
      <Card title="Import de Courses" subTitle="Import en masse via fichiers CSV ou Excel">
        <div className="grid">
          <div className="col-12">
            <Message 
              severity="info" 
              text="Formats supportés: CSV, Excel (.xlsx, .xls). Les colonnes requises sont: Mission, Train/Course, Heure Départ, Heure Arrivée, Lieu Départ, Lieu Arrivée, Statut."
              className="mb-4"
            />
          </div>
          
          <div className="col-12">
            <FileUpload
              mode="basic"
              name="file"
              accept=".csv,.xlsx,.xls"
              maxFileSize={10000000}
              customUpload
              uploadHandler={onUpload}
              chooseLabel="Choisir un fichier"
              className="mb-4"
              disabled={loading || importing}
            />
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
                  <Column field="mission" header="Mission" body={missionBodyTemplate} />
                  <Column field="trainCourse" header="Train" />
                  <Column field="placeDeparture" header="Départ" />
                  <Column field="placeArrival" header="Arrivée" />
                  <Column field="hd" header="H. Départ" />
                  <Column field="ha" header="H. Arrivée" />
                  <Column field="status" header="Statut" body={statusBodyTemplate} />
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
                onClick={() => navigate('/courses')}
              />
              {importResult?.success > 0 && (
                <Button
                  label="Voir les courses"
                  icon="pi pi-list"
                  onClick={() => navigate('/courses')}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseImport;