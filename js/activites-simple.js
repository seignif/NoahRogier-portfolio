/**
 * activities-simple.js
 * Gestion complète des activités du portfolio EPHEC
 * Noah Rogier - 2024
 */

// ===================================
// Configuration et contraintes
// ===================================
const CONFIG = {
    maxTotalHours: 60,
    minThemes: 6,
    minActivities: 6,
    maxHoursPerTheme: 10,
    maxHoursPerActivity: 10,

    activityTypes: {
        'hackathon': { label: 'Hackathon', maxCount: 3, maxHours: 10 },
        'formation_ligne': { label: 'Formation en ligne', maxCount: 2, maxHours: 10 },
        'formation_presentiel': { label: 'Formation présentiel', maxCount: 3, maxHours: 10 },
        'conference': { label: 'Conférence', maxCount: 1, maxHours: 10 },
        'visite': { label: 'Visite d\'entreprise', maxCount: 1, maxHours: 10 },
        'salon': { label: 'Salon informatique', maxCount: 1, maxHours: 10 },
        'job_day': { label: 'IT Job Day', maxCount: 1, maxHours: 10 },
        'projet': { label: 'Projet personnel', maxCount: null, maxHours: 10 },
        'autre': { label: 'Autre', maxCount: null, maxHours: 10 }
    },

    themes: [
        'Développement',
        'Réseaux',
        'Sécurité',
        'Électronique/IoT',
        'Soft skills',
        'Langues',
        'Communication',
        'Droit IT'
    ],

    statuses: {
        'À faire': { class: 'todo', icon: '⏳' },
        'En cours': { class: 'progress', icon: '🔄' },
        'Complété': { class: 'completed', icon: '✅' }
    }
};

// ===================================
// Classe Activity
// ===================================
class Activity {
    constructor(data) {
        this.id = data.id || Date.now();
        this.theme = data.theme;
        this.name = data.name;
        this.type = data.type;
        this.date = data.date;
        this.hours = parseInt(data.hours);
        this.proof = data.proof;
        this.status = data.status || 'À faire';
        this.analysis = data.analysis || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    validate() {
        const errors = [];

        if (!this.theme) errors.push('Le thème est requis');
        if (!this.name) errors.push('Le nom de l\'activité est requis');
        if (!this.type) errors.push('Le type d\'activité est requis');
        if (!this.date) errors.push('La date est requise');
        if (!this.hours || this.hours < 1) errors.push('Les heures doivent être supérieures à 0');
        if (this.hours > CONFIG.maxHoursPerActivity) {
            errors.push(`Maximum ${CONFIG.maxHoursPerActivity} heures par activité`);
        }
        if (!this.proof) errors.push('Une preuve est requise');

        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            theme: this.theme,
            name: this.name,
            type: this.type,
            date: this.date,
            hours: this.hours,
            proof: this.proof,
            status: this.status,
            analysis: this.analysis,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

// ===================================
// Gestionnaire d'activités
// ===================================
class ActivityManager {
    constructor() {
        this.activities = [];
        this.loadFromStorage();
        this.currentEditId = null;
    }

    loadFromStorage() {
        const stored = localStorage.getItem('portfolio_activities');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.activities = data.map(item => new Activity(item));
            } catch (error) {
                console.error('Erreur de chargement des données:', error);
                this.activities = [];
            }
        }

        // Charger des données d'exemple si vide
        if (this.activities.length === 0) {
            this.loadSampleData();
        }
    }

    loadSampleData() {
        const sampleActivities = [
            {
                theme: 'Développement',
                name: 'Formation React.js avancé',
                type: 'formation_ligne',
                date: '2024-03-15',
                hours: 10,
                proof: 'Certificat Udemy CERT-REACT-2024',
                status: 'Complété',
                analysis: 'Cette formation m\'a permis d\'approfondir mes connaissances en React...'
            },
            {
                theme: 'Sécurité',
                name: 'Cybersecurity Challenge EPHEC',
                type: 'hackathon',
                date: '2024-02-20',
                hours: 10,
                proof: 'Badge participation + Classement 3ème place',
                status: 'Complété',
                analysis: 'Participation au challenge de cybersécurité organisé par l\'EPHEC...'
            },
            {
                theme: 'Soft skills',
                name: 'Formation Gestion de projet Agile',
                type: 'formation_presentiel',
                date: '2024-04-10',
                hours: 8,
                proof: 'Attestation de présence',
                status: 'En cours',
                analysis: ''
            }
        ];

        sampleActivities.forEach(data => {
            this.activities.push(new Activity(data));
        });

        this.save();
    }

    save() {
        localStorage.setItem('portfolio_activities', JSON.stringify(this.activities));
    }

    add(activityData) {
        const activity = new Activity(activityData);
        const errors = this.validateConstraints(activity);

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        this.activities.push(activity);
        this.save();
        return activity;
    }

    update(id, activityData) {
        const index = this.activities.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('Activité non trouvée');
        }

        const updatedActivity = new Activity({
            ...this.activities[index].toJSON(),
            ...activityData,
            id: id,
            updatedAt: new Date().toISOString()
        });

        // Validation temporaire sans l'activité actuelle
        const tempActivities = [...this.activities];
        tempActivities.splice(index, 1);

        const errors = this.validateConstraints(updatedActivity, tempActivities);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        this.activities[index] = updatedActivity;
        this.save();
        return updatedActivity;
    }

    delete(id) {
        const index = this.activities.findIndex(a => a.id === id);
        if (index !== -1) {
            this.activities.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    validateConstraints(activity, customActivities = null) {
        const activities = customActivities || this.activities;
        const errors = activity.validate();

        // Vérifier le total des heures
        const totalHours = activities.reduce((sum, a) => sum + a.hours, 0) + activity.hours;
        if (totalHours > CONFIG.maxTotalHours) {
            errors.push(`Dépassement du maximum de ${CONFIG.maxTotalHours}h (actuellement ${totalHours}h)`);
        }

        // Vérifier les heures par thème
        const themeHours = activities
            .filter(a => a.theme === activity.theme)
            .reduce((sum, a) => sum + a.hours, 0) + activity.hours;

        if (themeHours > CONFIG.maxHoursPerTheme) {
            errors.push(`Maximum ${CONFIG.maxHoursPerTheme}h pour le thème ${activity.theme} (actuellement ${themeHours}h)`);
        }

        // Vérifier les limites par type d'activité
        const typeConfig = CONFIG.activityTypes[activity.type];
        if (typeConfig && typeConfig.maxCount) {
            const typeCount = activities.filter(a => a.type === activity.type).length + 1;
            if (typeCount > typeConfig.maxCount) {
                errors.push(`Maximum ${typeConfig.maxCount} activité(s) de type ${typeConfig.label}`);
            }
        }

        return errors;
    }

    getStats() {
        const stats = {
            totalHours: 0,
            totalActivities: this.activities.length,
            completedActivities: 0,
            themes: new Set(),
            themeHours: {},
            typeCount: {}
        };

        this.activities.forEach(activity => {
            stats.totalHours += activity.hours;
            stats.themes.add(activity.theme);

            if (activity.status === 'Complété') {
                stats.completedActivities++;
            }

            // Heures par thème
            if (!stats.themeHours[activity.theme]) {
                stats.themeHours[activity.theme] = 0;
            }
            stats.themeHours[activity.theme] += activity.hours;

            // Compte par type
            if (!stats.typeCount[activity.type]) {
                stats.typeCount[activity.type] = 0;
            }
            stats.typeCount[activity.type]++;
        });

        stats.totalThemes = stats.themes.size;
        stats.isValid = this.checkValidity();

        return stats;
    }

    checkValidity() {
        const stats = this.getStats();
        return stats.totalHours === CONFIG.maxTotalHours &&
            stats.totalThemes >= CONFIG.minThemes &&
            stats.totalActivities >= CONFIG.minActivities;
    }

    getValidationMessages() {
        const stats = this.getStats();
        const messages = [];

        if (stats.totalHours < CONFIG.maxTotalHours) {
            messages.push({
                type: 'warning',
                text: `Il manque ${CONFIG.maxTotalHours - stats.totalHours} heures pour atteindre les ${CONFIG.maxTotalHours}h requises`
            });
        } else if (stats.totalHours > CONFIG.maxTotalHours) {
            messages.push({
                type: 'error',
                text: `Dépassement de ${stats.totalHours - CONFIG.maxTotalHours} heures (maximum ${CONFIG.maxTotalHours}h)`
            });
        } else {
            messages.push({
                type: 'success',
                text: '✅ Objectif de 60 heures atteint!'
            });
        }

        if (stats.totalThemes < CONFIG.minThemes) {
            messages.push({
                type: 'warning',
                text: `Il manque ${CONFIG.minThemes - stats.totalThemes} thème(s) (minimum ${CONFIG.minThemes})`
            });
        }

        if (stats.totalActivities < CONFIG.minActivities) {
            messages.push({
                type: 'warning',
                text: `Il manque ${CONFIG.minActivities - stats.totalActivities} activité(s) (minimum ${CONFIG.minActivities})`
            });
        }

        return messages;
    }

    exportToJSON() {
        return JSON.stringify({
            metadata: {
                exportDate: new Date().toISOString(),
                version: '1.0',
                student: 'Noah Rogier',
                school: 'EPHEC'
            },
            stats: this.getStats(),
            activities: this.activities
        }, null, 2);
    }

    generateReport() {
        const stats = this.getStats();
        let report = `# Portfolio d'Activités - Noah Rogier\n\n`;
        report += `Date d'export: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
        report += `## Statistiques\n`;
        report += `- Total heures: ${stats.totalHours}/${CONFIG.maxTotalHours}h\n`;
        report += `- Nombre d'activités: ${stats.totalActivities}\n`;
        report += `- Activités complétées: ${stats.completedActivities}\n`;
        report += `- Thèmes couverts: ${stats.totalThemes}/${CONFIG.minThemes}\n\n`;

        report += `## Répartition par thème\n`;
        Object.entries(stats.themeHours).forEach(([theme, hours]) => {
            report += `- ${theme}: ${hours}h\n`;
        });

        report += `\n## Liste des activités\n\n`;
        this.activities.forEach(activity => {
            report += `### ${activity.name}\n`;
            report += `- **Thème**: ${activity.theme}\n`;
            report += `- **Type**: ${CONFIG.activityTypes[activity.type].label}\n`;
            report += `- **Date**: ${activity.date}\n`;
            report += `- **Heures**: ${activity.hours}h\n`;
            report += `- **Statut**: ${activity.status}\n`;
            report += `- **Preuve**: ${activity.proof}\n`;
            if (activity.analysis) {
                report += `- **Analyse**: ${activity.analysis.substring(0, 200)}...\n`;
            }
            report += `\n`;
        });

        return report;
    }
}

// ===================================
// Interface utilisateur
// ===================================
const UI = {
    manager: null,

    init() {
        this.manager = new ActivityManager();
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Gestion du formulaire
        const form = document.getElementById('activityForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Gestion du textarea pour compter les caractères
        const analysisTextarea = document.getElementById('activityAnalysis');
        if (analysisTextarea) {
            analysisTextarea.addEventListener('input', (e) => {
                const count = e.target.value.length;
                document.getElementById('charCount').textContent = count;
            });
        }
    },

    render() {
        this.updateStats();
        this.updateValidationAlerts();
        this.renderTable();
        this.renderThemeCards();
    },

    updateStats() {
        const stats = this.manager.getStats();

        document.getElementById('totalHours').textContent = stats.totalHours;
        document.getElementById('totalThemes').textContent = stats.totalThemes;
        document.getElementById('totalActivities').textContent = stats.totalActivities;
        document.getElementById('completedActivities').textContent = stats.completedActivities;

        // Mise à jour de la barre de progression
        const progress = (stats.totalHours / CONFIG.maxTotalHours) * 100;
        const progressBar = document.getElementById('hoursProgress');
        if (progressBar) {
            progressBar.style.width = Math.min(progress, 100) + '%';

            // Couleur selon l'état
            if (stats.totalHours === CONFIG.maxTotalHours) {
                progressBar.style.background = 'var(--success-color)';
            } else if (stats.totalHours > CONFIG.maxTotalHours) {
                progressBar.style.background = 'var(--error-color)';
            } else {
                progressBar.style.background = 'var(--gradient-primary)';
            }
        }
    },

    updateValidationAlerts() {
        const messages = this.manager.getValidationMessages();
        const alertsContainer = document.getElementById('validationAlerts');

        if (!alertsContainer) return;

        alertsContainer.innerHTML = messages.map(msg => `
            <div class="alert alert-${msg.type}">
                ${msg.text}
            </div>
        `).join('');
    },

    renderTable() {
        const tbody = document.getElementById('activitiesTableBody');
        if (!tbody) return;

        const activities = this.getFilteredActivities();

        if (activities.length === 0) {
            document.getElementById('activitiesTable').style.display = 'none';
            document.getElementById('emptyState').style.display = 'flex';
            return;
        }

        document.getElementById('activitiesTable').style.display = 'table';
        document.getElementById('emptyState').style.display = 'none';

        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td><span class="theme-badge">${activity.theme}</span></td>
                <td><strong>${activity.name}</strong></td>
                <td>${CONFIG.activityTypes[activity.type].label}</td>
                <td>${new Date(activity.date).toLocaleDateString('fr-FR')}</td>
                <td><strong>${activity.hours}h</strong></td>
                <td>${activity.proof}</td>
                <td>
                    <span class="status-badge status-${CONFIG.statuses[activity.status].class}">
                        ${CONFIG.statuses[activity.status].icon} ${activity.status}
                    </span>
                </td>
                <td>
                    ${activity.analysis ?
            `<button class="btn-link" onclick="UI.showAnalysis(${activity.id})">Voir</button>` :
            `<button class="btn-link" onclick="UI.editActivity(${activity.id})">Ajouter</button>`
        }
                </td>
                <td>
                    <button class="btn-icon" onclick="UI.editActivity(${activity.id})" title="Modifier">
                        ✏️
                    </button>
                    <button class="btn-icon" onclick="UI.deleteActivity(${activity.id})" title="Supprimer">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderThemeCards() {
        const container = document.getElementById('themeCards');
        if (!container) return;

        const stats = this.manager.getStats();

        container.innerHTML = CONFIG.themes.map(theme => {
            const hours = stats.themeHours[theme] || 0;
            const activities = this.manager.activities.filter(a => a.theme === theme);
            const progress = (hours / CONFIG.maxHoursPerTheme) * 100;

            return `
                <div class="theme-card">
                    <div class="theme-card-header">
                        <h3>${theme}</h3>
                        <span class="theme-hours">${hours}/${CONFIG.maxHoursPerTheme}h</span>
                    </div>
                    <div class="theme-progress">
                        <div class="theme-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="theme-stats">
                        <span>${activities.length} activité(s)</span>
                        <span>${activities.filter(a => a.status === 'Complété').length} complétée(s)</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    getFilteredActivities() {
        let activities = [...this.manager.activities];

        const themeFilter = document.getElementById('themeFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;

        if (themeFilter) {
            activities = activities.filter(a => a.theme === themeFilter);
        }

        if (statusFilter) {
            activities = activities.filter(a => a.status === statusFilter);
        }

        return activities;
    },

    handleSubmit(e) {
        e.preventDefault();

        const activityData = {
            theme: document.getElementById('activityTheme').value,
            name: document.getElementById('activityName').value,
            type: document.getElementById('activityType').value,
            date: document.getElementById('activityDate').value,
            hours: parseInt(document.getElementById('activityHours').value),
            proof: document.getElementById('activityProof').value,
            status: document.getElementById('activityStatus').value,
            analysis: document.getElementById('activityAnalysis').value
        };

        try {
            if (this.manager.currentEditId) {
                this.manager.update(this.manager.currentEditId, activityData);
                this.showNotification('Activité mise à jour avec succès', 'success');
            } else {
                this.manager.add(activityData);
                this.showNotification('Activité ajoutée avec succès', 'success');
            }

            this.closeModal();
            this.render();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    },

    editActivity(id) {
        const activity = this.manager.activities.find(a => a.id === id);
        if (!activity) return;

        this.manager.currentEditId = id;

        document.getElementById('modalTitle').textContent = 'Modifier l\'activité';
        document.getElementById('activityTheme').value = activity.theme;
        document.getElementById('activityName').value = activity.name;
        document.getElementById('activityType').value = activity.type;
        document.getElementById('activityDate').value = activity.date;
        document.getElementById('activityHours').value = activity.hours;
        document.getElementById('activityProof').value = activity.proof;
        document.getElementById('activityStatus').value = activity.status;
        document.getElementById('activityAnalysis').value = activity.analysis;

        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = activity.analysis.length;
        }

        this.updateHoursLimit();
        this.openModal();
    },

    deleteActivity(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
            if (this.manager.delete(id)) {
                this.showNotification('Activité supprimée', 'success');
                this.render();
            }
        }
    },

    showAnalysis(id) {
        const activity = this.manager.activities.find(a => a.id === id);
        if (!activity) return;

        const modal = document.getElementById('analysisModal');
        const content = document.getElementById('analysisContent');

        if (!modal || !content) return;

        content.innerHTML = `
            <h3>${activity.name}</h3>
            <div class="analysis-meta">
                <span><strong>Thème:</strong> ${activity.theme}</span>
                <span><strong>Date:</strong> ${new Date(activity.date).toLocaleDateString('fr-FR')}</span>
                <span><strong>Durée:</strong> ${activity.hours}h</span>
            </div>
            <div class="analysis-text">
                ${activity.analysis ?
            `<div class="analysis-content">${activity.analysis.replace(/\n/g, '<br>')}</div>` :
            '<p class="text-muted">Aucune analyse réflexive n\'a été rédigée pour cette activité.</p>'
        }
            </div>
            <div class="analysis-proof">
                <strong>Preuve:</strong> ${activity.proof}
            </div>
        `;

        modal.classList.add('active');
    },

    openModal() {
        const modal = document.getElementById('activityModal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    closeModal() {
        const modal = document.getElementById('activityModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('activityForm').reset();
            this.manager.currentEditId = null;
            document.getElementById('modalTitle').textContent = 'Ajouter une activité';
        }
    },

    closeAnalysisModal() {
        const modal = document.getElementById('analysisModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    updateHoursLimit() {
        const type = document.getElementById('activityType').value;
        const helpText = document.getElementById('hoursHelp');

        if (!type || !helpText) return;

        const typeConfig = CONFIG.activityTypes[type];
        if (typeConfig) {
            helpText.textContent = `(max ${typeConfig.maxHours}h)`;

            if (typeConfig.maxCount) {
                const currentCount = this.manager.activities.filter(a => a.type === type).length;
                if (this.manager.currentEditId) {
                    const currentActivity = this.manager.activities.find(a => a.id === this.manager.currentEditId);
                    if (currentActivity && currentActivity.type === type) {
                        // Ne pas compter l'activité en cours d'édition
                        currentCount--;
                    }
                }

                if (currentCount >= typeConfig.maxCount) {
                    helpText.textContent += ` - Limite atteinte (${typeConfig.maxCount} max)`;
                    helpText.style.color = 'var(--error-color)';
                } else {
                    helpText.textContent += ` - ${typeConfig.maxCount - currentCount} restante(s)`;
                    helpText.style.color = 'var(--text-light)';
                }
            }
        }
    },

    exportData() {
        const json = this.manager.exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_activites_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Données exportées avec succès', 'success');
    },

    generateReport() {
        const report = this.manager.generateReport();
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_portfolio_${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Rapport généré avec succès', 'success');
    },

    showNotification(message, type = 'info') {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'var(--success-color)' :
            type === 'error' ? 'var(--error-color)' :
                'var(--info-color)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// ===================================
// Fonctions globales pour les onclick
// ===================================
window.openAddModal = function() {
    UI.manager.currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter une activité';
    document.getElementById('activityForm').reset();
    UI.openModal();
};

window.closeModal = function() {
    UI.closeModal();
};

window.closeAnalysisModal = function() {
    UI.closeAnalysisModal();
};

window.filterActivities = function() {
    UI.renderTable();
};

window.exportData = function() {
    UI.exportData();
};

window.generateReport = function() {
    UI.generateReport();
};

window.updateHoursLimit = function() {
    UI.updateHoursLimit();
};

window.editAnalysis = function() {
    const modal = document.getElementById('analysisModal');
    const activityId = modal?.dataset.activityId;
    if (activityId) {
        UI.closeAnalysisModal();
        UI.editActivity(parseInt(activityId));
    }
};

window.printAnalysis = function() {
    window.print();
};

// ===================================
// Initialisation
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser uniquement sur la page portfolio-activites
    if (document.getElementById('activitiesTable')) {
        UI.init();
    }
});