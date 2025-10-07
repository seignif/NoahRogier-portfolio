# NoahRogier-portfolio

# 📚 Documentation Portfolio EPHEC - Noah Rogier
*Version 1.0 - Décembre 2024*

## 🎯 Vue d'ensemble du projet

### Objectif principal
Créer un portfolio web professionnel pour valider la fin d'études en Technologies de l'Informatique à l'EPHEC, présentant 60 heures d'activités valorisées, un CV interactif, et un projet professionnel structuré.

### Technologies utilisées
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Frameworks CSS**: Animations CSS personnalisées, design responsive
- **Stockage**: LocalStorage pour la persistance des données
- **Déploiement**: GitHub Pages / Netlify (recommandé)

---

## 📁 Structure des fichiers

```
NOAH-ROGIER-PORTFOLIO/
│
├── 📁 assets/
│   └── 📁 css/
│       ├── animations.css      # Animations et transitions
│       ├── cv.css              # Styles page CV
│       ├── main.css            # Styles globaux
│       ├── portfolio-activites.css  # Styles tableau activités
│       ├── projet-pro.css      # Styles projet professionnel
│       └── responsive.css      # Media queries
│
├── 📁 documents/
│   └── cv.pdf                   # CV format PDF téléchargeable
│
├── 📁 images/
│   └── 📁 profile/
│       ├── cv-photo-150.jpg    # Photo CV petit format
│       └── cv-photo.jpg        # Photo CV haute résolution
│
├── 📁 js/
│   ├── activities-simple.js    # Gestion simplifiée activités
│   ├── main.js                 # Script principal
│   └── navigation.js           # Navigation et menu
│
├── 📁 data/
│   └── activities.json         # Données activités (backup)
│
├── cv.html                      # Page CV détaillé
├── index.html                   # Page d'accueil
├── portfolio-activites.html    # Page gestion activités
├── projet-pro.html             # Page projet professionnel
└── README.md                    # Documentation GitHub
```

---

## 🏠 Page d'accueil (index.html)

### Structure
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noah Rogier - Portfolio TI EPHEC</title>
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/animations.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <!-- Navigation principale -->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="logo">NR</div>
            <ul class="nav-links">
                <li><a href="index.html" class="active">Accueil</a></li>
                <li><a href="cv.html">CV</a></li>
                <li><a href="projet-pro.html">Projet Pro</a></li>
                <li><a href="portfolio-activites.html">Activités</a></li>
            </ul>
            <div class="burger-menu">☰</div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="fade-in">Noah Rogier</h1>
            <h2 class="subtitle slide-up">Futur Ingénieur en Technologies de l'Information</h2>
            <p class="description">Étudiant finissant EPHEC | Passionné par le développement et la cybersécurité</p>
            <div class="cta-buttons">
                <a href="cv.html" class="btn btn-primary">Découvrir mon parcours</a>
                <a href="portfolio-activites.html" class="btn btn-secondary">Voir mes activités</a>
            </div>
        </div>
    </section>

    <!-- Statistiques rapides -->
    <section class="quick-stats">
        <div class="stat-card">
            <span class="stat-number">60</span>
            <span class="stat-label">Heures valorisées</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">8</span>
            <span class="stat-label">Thèmes couverts</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">12</span>
            <span class="stat-label">Activités réalisées</span>
        </div>
    </section>
</body>
</html>
```

### Fonctionnalités clés
- Animation d'entrée progressive
- Navigation sticky au scroll
- Design moderne avec glassmorphism
- Responsive mobile-first

---

## 📄 Page CV (cv.html)

### Sections requises
1. **En-tête avec photo**
   - Photo professionnelle
   - Nom et titre
   - Coordonnées (email, téléphone, LinkedIn, GitHub)

2. **Formation académique**
   ```javascript
   const formations = [
       {
           periode: "2021-2024",
           diplome: "Bachelier en Technologies de l'Informatique",
           etablissement: "EPHEC",
           details: "Spécialisation en développement et cybersécurité"
       },
       // Ajouter formations antérieures
   ];
   ```

3. **Expériences professionnelles**
   - Stages
   - Jobs étudiants IT
   - Projets freelance

4. **Compétences techniques**
   - Langages: JavaScript, Python, Java, PHP, SQL
   - Frameworks: React, Node.js, Laravel
   - Outils: Git, Docker, Linux, VS Code
   - Bases de données: MySQL, MongoDB

5. **Langues**
   - Français: Langue maternelle
   - Anglais: B2 (technique)
   - Néerlandais: A2

6. **Bouton téléchargement PDF**

---

## 🎯 Page Projet Professionnel (projet-pro.html)

### Structure du contenu
```markdown
## Vision à court terme (1-2 ans)
- Obtenir mon diplôme de bachelier
- Décrocher un premier emploi comme développeur junior
- Me spécialiser en [domaine choisi]
- Obtenir des certifications (AWS, Azure, etc.)

## Vision à moyen terme (3-5 ans)
- Évoluer vers un poste de développeur senior
- Maîtriser l'architecture logicielle
- Contribuer à des projets open source
- Développer une expertise en [spécialisation]

## Domaines d'intérêt
1. **Développement Full-Stack**
   - Technologies web modernes
   - API REST et GraphQL
   - Microservices

2. **Cybersécurité**
   - Sécurité applicative
   - Tests de pénétration
   - DevSecOps

3. **Intelligence Artificielle**
   - Machine Learning
   - Traitement du langage naturel
   - Computer Vision

## Type d'entreprise visée
- Startups innovantes
- Entreprises de consultance IT
- Départements R&D
```

---

## 📊 Page Activités (portfolio-activites.html)

### Fonctionnalités JavaScript

#### 1. Gestion des activités
```javascript
// Structure de données pour une activité
class Activity {
    constructor(data) {
        this.id = Date.now();
        this.theme = data.theme;
        this.titre = data.titre;
        this.type = data.type;
        this.heures = data.heures;
        this.dateRealisation = data.date;
        this.preuve = data.preuve;
        this.statut = data.statut; // "Complété", "En cours", "À faire"
        this.analyseReflexive = data.analyse || "";
    }

    validate() {
        // Vérifier les contraintes
        if (this.heures > 10) {
            throw new Error("Maximum 10h par activité");
        }
        // Autres validations...
    }
}
```

#### 2. Gestionnaire d'activités
```javascript
class ActivityManager {
    constructor() {
        this.activities = this.loadFromStorage();
        this.constraints = {
            maxHoursTotal: 60,
            minThemes: 6,
            minActivities: 6,
            maxHoursPerTheme: 10,
            activityLimits: {
                'hackathon': { max: 3, hours: 10 },
                'formation_ligne': { max: 2, hours: 10 },
                'formation_presentiel': { max: 3, hours: 10 },
                'conference': { max: 1, hours: 10 },
                'visite': { max: 1, hours: 10 },
                'salon': { max: 1, hours: 10 },
                'job_day': { max: 1, hours: 10 }
            }
        };
    }

    addActivity(data) {
        const activity = new Activity(data);
        this.validateConstraints(activity);
        this.activities.push(activity);
        this.save();
    }

    validateConstraints(activity) {
        // Vérifier total heures
        const totalHours = this.getTotalHours();
        if (totalHours + activity.heures > 60) {
            throw new Error(`Dépassement: ${totalHours + activity.heures}/60h`);
        }

        // Vérifier heures par thème
        const themeHours = this.getHoursForTheme(activity.theme);
        if (themeHours + activity.heures > 10) {
            throw new Error(`Max 10h pour le thème ${activity.theme}`);
        }

        // Vérifier limites par type
        const typeCount = this.getCountForType(activity.type);
        const limit = this.constraints.activityLimits[activity.type];
        if (limit && typeCount >= limit.max) {
            throw new Error(`Max ${limit.max} activités de type ${activity.type}`);
        }
    }

    getTotalHours() {
        return this.activities.reduce((sum, act) => sum + act.heures, 0);
    }

    getThemes() {
        return [...new Set(this.activities.map(act => act.theme))];
    }

    getStats() {
        return {
            totalHours: this.getTotalHours(),
            totalActivities: this.activities.length,
            themes: this.getThemes(),
            isValid: this.checkValidity()
        };
    }

    checkValidity() {
        const stats = this.getStats();
        return stats.totalHours === 60 && 
               stats.themes.length >= 6 && 
               stats.totalActivities >= 6;
    }

    exportToJSON() {
        return JSON.stringify(this.activities, null, 2);
    }

    save() {
        localStorage.setItem('portfolio_activities', JSON.stringify(this.activities));
    }

    loadFromStorage() {
        const data = localStorage.getItem('portfolio_activities');
        return data ? JSON.parse(data) : [];
    }
}
```

---

## 🎨 Styles CSS principaux

### main.css - Variables et thème
```css
:root {
    /* Couleurs principales */
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    
    /* Couleurs texte */
    --text-primary: #2d3748;
    --text-secondary: #4a5568;
    --text-light: #718096;
    
    /* Backgrounds */
    --bg-primary: #ffffff;
    --bg-secondary: #f7fafc;
    --bg-dark: #1a202c;
    
    /* Espacements */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;
    --spacing-xl: 4rem;
    
    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Ombres */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
}

/* Reset et base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--text-primary);
    background: var(--bg-primary);
    line-height: 1.6;
}

/* Composants réutilisables */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: var(--transition-normal);
    cursor: pointer;
    border: none;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.card {
    background: white;
    border-radius: 12px;
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
}
```

### animations.css - Animations personnalisées
```css
/* Fade In */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.8s ease forwards;
}

/* Slide Up */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-up {
    animation: slideUp 0.6s ease forwards;
    animation-delay: 0.2s;
}

/* Gradient Animation */
@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.gradient-animated {
    background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

/* Pulse */
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    }
}

.pulse {
    animation: pulse 2s infinite;
}

/* Loading Spinner */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-secondary);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### responsive.css - Media Queries
```css
/* Tablette (768px - 1024px) */
@media (max-width: 1024px) {
    .container {
        padding: 0 var(--spacing-sm);
    }
    
    .nav-container {
        padding: var(--spacing-sm);
    }
    
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .quick-stats {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
}

/* Mobile (moins de 768px) */
@media (max-width: 768px) {
    /* Navigation mobile */
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: var(--spacing-md);
        box-shadow: var(--shadow-lg);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .burger-menu {
        display: block;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    /* Hero mobile */
    .hero h1 {
        font-size: 2rem;
    }
    
    .hero .subtitle {
        font-size: 1.2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .btn {
        width: 100%;
        text-align: center;
    }
    
    /* Tables responsive */
    table {
        font-size: 0.9rem;
    }
    
    th, td {
        padding: 8px;
    }
    
    /* Hide less important columns on mobile */
    .hide-mobile {
        display: none;
    }
}

/* Petits mobiles (moins de 480px) */
@media (max-width: 480px) {
    body {
        font-size: 14px;
    }
    
    .hero h1 {
        font-size: 1.5rem;
    }
    
    .stat-card {
        padding: var(--spacing-sm);
    }
    
    .stat-number {
        font-size: 2rem;
    }
}

/* Print styles */
@media print {
    .no-print {
        display: none !important;
    }
    
    body {
        font-size: 12pt;
        color: black;
        background: white;
    }
    
    a {
        color: black;
        text-decoration: underline;
    }
    
    .container {
        max-width: 100%;
    }
}
```

---

## 📝 Template Analyse Réflexive

### Structure obligatoire (1 page minimum)

```markdown
# Analyse Réflexive - [Nom de l'activité]

## 1. Cadre et contexte (15-20%)
Je me suis inscrit à [activité] qui s'est déroulée le [date] à [lieu]. Cette activité, organisée par [organisateur], s'inscrit dans le thème [thème] de mon portfolio. J'ai choisi cette activité car [motivation personnelle liée au projet professionnel].

## 2. Description factuelle (30-35%)
Durant cette activité de [X] heures, j'ai pu [actions principales réalisées]. Le programme comprenait [détail du contenu]. J'ai particulièrement travaillé sur [aspects spécifiques]. 

Les principaux défis rencontrés étaient :
- [Défi 1] : J'ai surmonté ce défi en [solution]
- [Défi 2] : Ma stratégie a été de [approche]

J'ai collaboré avec [autres participants] ce qui m'a permis de [apprentissage collaboratif].

## 3. Lien avec mon projet professionnel (25-30%)
Cette activité s'aligne parfaitement avec mon objectif de [objectif professionnel spécifique]. Les compétences développées, notamment [compétence 1] et [compétence 2], sont essentielles pour mon futur rôle de [poste visé].

Cette expérience confirme mon intérêt pour [domaine] et renforce ma volonté de me spécialiser dans [spécialisation]. Elle m'a également ouvert de nouvelles perspectives sur [nouvelle découverte].

## 4. Compétences développées (20-25%)
### Compétences techniques
- **[Compétence 1]** : J'ai appris à [détail]
- **[Compétence 2]** : Je maîtrise maintenant [détail]

### Compétences transversales
- **[Soft skill 1]** : Cette activité m'a permis d'améliorer [détail]
- **[Soft skill 2]** : J'ai développé ma capacité à [détail]

## 5. Bilan et perspectives (5-10%)
Cette activité a dépassé mes attentes en termes de [aspect positif]. Si je devais la refaire, j'approfondirais [aspect à améliorer]. Pour la suite, je prévois de [action future] afin de consolider ces acquis.

---
*Preuve jointe : [Type de preuve - certificat/capture/photo]*
```

---

## 🚀 Plan de développement

### Phase 1 : Préparation (Semaine 1)
- [ ] Rassembler toutes les preuves d'activités
- [ ] Rédiger le CV complet
- [ ] Définir clairement le projet professionnel
- [ ] Lister et valider les 60h d'activités

### Phase 2 : Développement (Semaine 2-3)
- [ ] Créer la structure HTML de base
- [ ] Implémenter les styles CSS
- [ ] Développer les fonctionnalités JavaScript
- [ ] Intégrer le contenu

### Phase 3 : Rédaction (Semaine 3-4)
- [ ] Rédiger les 6+ analyses réflexives
- [ ] Compléter l'auto-évaluation
- [ ] Réviser l'orthographe et la grammaire
- [ ] Optimiser la présentation

### Phase 4 : Finalisation (Semaine 4-5)
- [ ] Tests sur différents navigateurs
- [ ] Optimisation responsive
- [ ] Déploiement en ligne
- [ ] Dernières corrections

---

## 🔧 Configuration et déploiement

### Déploiement sur GitHub Pages
```bash
# Initialiser Git
git init
git add .
git commit -m "Initial portfolio commit"

# Créer repo sur GitHub
git remote add origin https://github.com/noah-rogier/portfolio-ephec.git
git branch -M main
git push -u origin main

# Activer GitHub Pages dans Settings > Pages
# Choisir source: Deploy from branch (main)
```

### Structure du README.md
```markdown
# Portfolio TI EPHEC - Noah Rogier

## 🎓 À propos
Portfolio de fin d'études présentant 60 heures d'activités valorisées dans le cadre du Bachelier en Technologies de l'Informatique à l'EPHEC.

## 🚀 Technologies utilisées
- HTML5 / CSS3 / JavaScript
- LocalStorage API
- Responsive Design
- Progressive Enhancement

## 📋 Fonctionnalités
- CV interactif
- Projet professionnel détaillé
- Gestion des activités avec validation
- Analyses réflexives
- Export des données

## 🌐 Démo en ligne
[Voir le portfolio](https://noah-rogier.github.io/portfolio-ephec)

## 📝 Licence
© 2024 Noah Rogier - Tous droits réservés
```

---

## ✅ Checklist finale de validation

### Contenu
- [ ] 60 heures exactement (ni plus, ni moins)
- [ ] Minimum 6 thèmes différents
- [ ] Minimum 6 activités
- [ ] Maximum 10h par thème respecté
- [ ] Toutes les preuves sont présentes et valides
- [ ] Analyses réflexives complètes (1 page min chacune)
- [ ] CV complet et à jour
- [ ] Projet professionnel clairement défini
- [ ] Auto-évaluation honnête et constructive

### Technique
- [ ] Site responsive (mobile, tablette, desktop)
- [ ] Navigation intuitive
- [ ] Pas d'erreurs JavaScript dans la console
- [ ] Performance optimisée (images compressées)
- [ ] Compatibilité navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] Données sauvegardées en LocalStorage
- [ ] Fonction d'export fonctionnelle

### Qualité
- [ ] Orthographe irréprochable
- [ ] Présentation professionnelle
- [ ] Cohérence graphique
- [ ] Accessibilité (contraste, tailles de police)
- [ ] Code propre et commenté
- [ ] Documentation claire

---

## 📞 Support et contact

Pour toute question sur l'implémentation :
1. Référer à cette documentation
2. Vérifier les exemples de code fournis
3. Tester dans un environnement local d'abord
4. Valider avec les critères EPHEC

**Bon développement Noah ! 🚀**
