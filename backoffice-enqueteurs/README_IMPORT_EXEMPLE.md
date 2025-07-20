# Guide d'utilisation du fichier d'exemple d'importation

## Fichier d'exemple : `exemple_import_courses_100_lignes.csv`

Ce fichier contient 100 lignes d'exemple pour tester l'importation de courses dans le système back-office enquêteurs.

## Structure du fichier CSV

### Colonnes obligatoires :
- **mission** : Type de mission (BSC, MQ, IT, HLP)
- **trainCourse** : Numéro du train/course (ex: TER 123456, TGV 7890)
- **hd** : Heure de départ (format: YYYY-MM-DD HH:MM:SS)
- **ha** : Heure d'arrivée (format: YYYY-MM-DD HH:MM:SS)
- **status** : Statut de la course (DRAFT, AFFECTED, CANCELED, TERMINED)
- **placeDeparture** : Lieu de départ
- **placeArrival** : Lieu d'arrivée

### Colonnes optionnelles :
- **commentaire** : Commentaires additionnels
- **ligne** : Ligne de transport (L1, L2, L3, L4)
- **objectif** : Objectif numérique (nombre entier positif)
- **service** : Service assigné
- **departureTimeOrigin** : Heure de départ origine (optionnel)
- **arrivalTimeTerminus** : Heure d'arrivée terminus (optionnel)
- **pds** : Code PDS
- **vac** : Code VAC
- **affectationId** : ID de l'enquêteur affecté (1-4 dans l'exemple)

## Caractéristiques de l'exemple

### Dates variées :
- **Passé** : Courses de 2023 (toutes avec statut TERMINED)
- **Présent** : Courses de 2024 (statuts variés)
- **Futur** : Courses de 2025-2026 (statuts DRAFT, AFFECTED, etc.)

### Types de missions :
- **BSC** : Missions de base
- **MQ** : Missions qualité
- **IT** : Missions techniques
- **HLP** : Missions d'assistance

### Statuts de course :
- **DRAFT** : Brouillon
- **AFFECTED** : Affectée à un enquêteur
- **CANCELED** : Annulée
- **TERMINED** : Terminée

## Utilisation pour l'importation

1. **Test complet** : Utilisez le fichier tel quel pour tester l'importation de 100 courses
2. **Test partiel** : Copiez quelques lignes pour des tests rapides
3. **Modification** : Adaptez les données selon vos besoins spécifiques

## Format des dates

Toutes les dates sont au format ISO : `YYYY-MM-DD HH:MM:SS`

Exemples :
- `2024-01-15 08:30:00` (15 janvier 2024 à 8h30)
- `2025-06-20 14:45:00` (20 juin 2025 à 14h45)
- `2023-12-31 23:59:00` (31 décembre 2023 à 23h59)

## Validation des données

Le système validera automatiquement :
- Format des dates
- Cohérence heure départ < heure arrivée
- Valeurs des énumérations (mission, status)
- Objectifs numériques positifs
- Existence des enquêteurs pour affectationId

## Notes importantes

- Les dates dans le passé sont acceptées (utile pour l'historique)
- Les dates futures sont acceptées (planification)
- Le champ objectif accepte les valeurs nulles
- L'affectationId doit correspondre à un enquêteur existant
- Les heures sont en format 24h

## Exemple d'utilisation

1. Ouvrez l'interface d'importation dans le back-office
2. Sélectionnez le fichier `exemple_import_courses_100_lignes.csv`
3. Vérifiez l'aperçu des données
4. Lancez l'importation
5. Vérifiez les résultats et les éventuelles erreurs

Ce fichier d'exemple vous permettra de tester toutes les fonctionnalités d'importation avec des données réalistes et variées.