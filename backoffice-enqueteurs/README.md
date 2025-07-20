# Back-office Enquêteurs

Application web de gestion des plannings des enquêteurs développée avec React, TypeScript et PrimeReact.

## 🚀 Fonctionnalités

- **Authentification** : Connexion sécurisée avec gestion des rôles
- **Gestion des courses** : CRUD complet avec filtres et recherche
- **Gestion des enquêteurs** : Administration des utilisateurs
- **Import en masse** : Support CSV/Excel pour courses et enquêteurs
- **Mesures** : Visualisation et gestion des mesures
- **Dashboard** : Statistiques et aperçu général
- **Interface responsive** : Compatible mobile et desktop

## 🛠️ Technologies

- **React 18.2.0** avec TypeScript
- **React Router 7.7.0** pour la navigation
- **PrimeReact 15.1.5** pour l'interface utilisateur
- **React Hook Form** + **Zod** pour la validation
- **React Query** pour la gestion des données
- **Axios** pour les appels API
- **Vite** pour le build et le développement

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- API Backend en cours d'exécution

## 🔧 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd backoffice-enqueteurs
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Modifier le fichier `.env` avec vos paramètres :
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   VITE_APP_TITLE=Back-office Enquêteurs
   VITE_APP_VERSION=1.0.0
   ```

4. **Démarrer l'application**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`

## 🏗️ Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run type-check` : Vérifie les types TypeScript

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Composants d'authentification
│   └── layout/         # Composants de mise en page
├── contexts/           # Contextes React
├── pages/              # Pages de l'application
│   ├── courses/        # Gestion des courses
│   ├── investigators/  # Gestion des enquêteurs
│   └── measurements/   # Gestion des mesures
├── services/           # Services API
├── types/              # Types TypeScript
├── App.tsx             # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🔐 Authentification

L'application utilise un système d'authentification basé sur JWT :

- **Connexion** : `/login`
- **Rôles supportés** : Admin, Enqueteur, Superviseur
- **Protection des routes** : Redirection automatique si non authentifié
- **Gestion des tokens** : Stockage sécurisé et refresh automatique

## 📊 Fonctionnalités principales

### Dashboard
- Statistiques générales (courses, enquêteurs)
- Graphiques de répartition
- Actions rapides
- Aperçu des courses récentes

### Gestion des courses
- Liste avec filtres avancés
- Création/modification de courses
- Import en masse (CSV/Excel)
- Assignation aux enquêteurs
- Gestion des statuts

### Gestion des enquêteurs
- Administration des utilisateurs
- Gestion des rôles et permissions
- Import en masse
- Visualisation des courses assignées

### Mesures
- Consultation des mesures
- Filtres par type et enquêteur
- Export des données

## 🔄 Import de données

### Format CSV pour les courses
```csv
mission,train,lieuDepart,lieuArrivee,dateDepart,heureDepart,dateArrivee,heureArrivee,assignedToUsername,status
TER,12345,Paris,Lyon,2024-01-15,08:30,2024-01-15,11:45,enqueteur1,AFFECTED
```

### Format CSV pour les enquêteurs
```csv
username,email,password,expoPushToken,roles,isConfirmed,isBlocked
jdoe,john@example.com,password123,,Admin;Enqueteur,true,false
```

## 🎨 Thème et styles

- **Thème PrimeReact** : Lara Light Indigo
- **Icônes** : PrimeIcons
- **Layout responsive** : PrimeFlex
- **Styles personnalisés** : CSS modules et classes utilitaires

## 🔧 Configuration API

L'application communique avec l'API Backend via les endpoints suivants :

- **Auth** : `/auth/login`, `/auth/profile`
- **Users** : `/users/*`
- **Courses** : `/courses/*`
- **Import** : `/import/*`

Tous les appels API incluent automatiquement :
- Headers d'authentification (Bearer token)
- Gestion des erreurs
- Retry automatique
- Intercepteurs pour le refresh des tokens

## 🚀 Déploiement

1. **Build de production**
   ```bash
   npm run build
   ```

2. **Servir les fichiers statiques**
   Les fichiers générés dans `dist/` peuvent être servis par n'importe quel serveur web.

3. **Variables d'environnement**
   Assurez-vous de configurer `VITE_API_BASE_URL` pour pointer vers votre API de production.

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion API**
   - Vérifiez que l'API Backend est démarrée
   - Contrôlez l'URL dans `.env`
   - Vérifiez les CORS sur l'API

2. **Erreurs de build**
   - Supprimez `node_modules` et `package-lock.json`
   - Réinstallez les dépendances : `npm install`

3. **Problèmes de types TypeScript**
   - Exécutez `npm run type-check`
   - Vérifiez les imports et exports

## 📝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation de l'API
- Vérifiez les logs de l'application et de l'API