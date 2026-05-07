/**
 * activities-simple.js
 * Gestion complète des activités du portfolio EPHEC
 * Noah Rogier - 2025
 * Stockage: Supabase (PostgreSQL)
 */

// ===================================
// Supabase Config
// ===================================
var SUPABASE_URL = 'https://vqeqenhmudypkbneeccs.supabase.co';
var SUPABASE_KEY = 'sb_publishable_uFYg2zsE2UJHhDwCDoNxtw_P7cL0xJJ';

var supabase = {
    fetch: async function(endpoint, options) {
        options = options || {};
        var method = options.method || 'GET';
        var headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json'
        };
        if (method !== 'GET' && method !== 'DELETE') {
            headers['Prefer'] = options.prefer || 'return=representation';
        }
        var res = await fetch(SUPABASE_URL + '/rest/v1/' + endpoint, {
            headers: headers,
            method: method,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        if (!res.ok) {
            var err = await res.text();
            throw new Error('Supabase ' + res.status + ': ' + err);
        }
        if (method === 'DELETE') return true;
        return res.json();
    },
    getAll: function() { return this.fetch('activities?select=*&order=date.desc'); },
    insert: function(data) { return this.fetch('activities', { method: 'POST', body: data }); },
    update: function(id, data) { return this.fetch('activities?id=eq.' + id, { method: 'PATCH', body: data }); },
    remove: function(id) { return this.fetch('activities?id=eq.' + id, { method: 'DELETE' }); }
};

// ===================================
// Configuration
// ===================================
var CONFIG = {
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
        'visite': { label: "Visite d'entreprise", maxCount: 1, maxHours: 10 },
        'salon': { label: 'Salon informatique', maxCount: 1, maxHours: 10 },
        'job_day': { label: 'IT Job Day', maxCount: 1, maxHours: 10 },
        'projet': { label: 'Projet personnel', maxCount: null, maxHours: 10 },
        'autre': { label: 'Autre', maxCount: null, maxHours: 10 }
    },
    themes: ['Développement','Réseaux','Sécurité','Électronique/IoT','Soft skills','Langues','Communication','Droit IT','Gestion de projet'],
    statuses: {
        'À faire': { class: 'todo' },
        'En cours': { class: 'progress' },
        'Complété': { class: 'completed' }
    }
};

function cleanStatus(s) {
    if (!s) return 'À faire';
    var c = s.replace(/[^\p{L}\p{N}\s\u00C0-\u024F]/gu, '').trim();
    if (c === 'Complété' || c.indexOf('omplété') !== -1) return 'Complété';
    if (c === 'En cours' || c.indexOf('cours') !== -1) return 'En cours';
    if (c === 'À faire' || c.indexOf('faire') !== -1) return 'À faire';
    return 'À faire';
}

function Activity(d) {
    this.id = d.id || null;
    this.theme = d.theme || '';
    this.name = d.name || '';
    this.type = d.type || 'autre';
    this.date = d.date || '';
    this.hours = parseInt(d.hours) || 0;
    this.proof = d.proof || '';
    this.status = cleanStatus(d.status);
    this.analysis = d.analysis || '';
    this.proofImages = d.proof_images || d.proofImages || [];
}

Activity.prototype.validate = function() {
    var e = [];
    if (!this.theme) e.push('Le thème est requis');
    if (!this.name) e.push("Le nom est requis");
    if (!this.type) e.push("Le type est requis");
    if (!this.date) e.push('La date est requise');
    if (this.hours < 1) e.push('Heures > 0 requises');
    if (this.hours > CONFIG.maxHoursPerActivity) e.push('Max ' + CONFIG.maxHoursPerActivity + 'h par activité');
    if (!this.proof) e.push('Une preuve est requise');
    return e;
};

Activity.prototype.toSupabase = function() {
    return {
        theme: this.theme, name: this.name, type: this.type, date: this.date,
        hours: this.hours, proof: this.proof, status: this.status,
        analysis: this.analysis, proof_images: this.proofImages,
        updated_at: new Date().toISOString()
    };
};

// ===================================
// Manager
// ===================================
var ActivityManager = {
    activities: [],
    currentEditId: null,

    loadData: async function() {
        try {
            var rows = await supabase.getAll();
            this.activities = [];
            for (var i = 0; i < rows.length; i++) {
                this.activities.push(new Activity(rows[i]));
            }
            return true;
        } catch (err) {
            console.error('[Supabase] Error:', err);
            this.activities = [];
            this.loadError = err.message;
            return false;
        }
    },

    add: async function(data) {
        var a = new Activity(data);
        var errs = this.validateConstraints(a);
        if (errs.length > 0) throw new Error(errs.join('\n'));
        var result = await supabase.insert(a.toSupabase());
        this.activities.push(new Activity(result[0]));
    },

    update: async function(id, data) {
        var idx = -1;
        for (var i = 0; i < this.activities.length; i++) { if (this.activities[i].id === id) { idx = i; break; } }
        if (idx === -1) throw new Error('Non trouvée');
        var merged = {};
        var old = this.activities[idx];
        merged.theme = data.theme || old.theme;
        merged.name = data.name || old.name;
        merged.type = data.type || old.type;
        merged.date = data.date || old.date;
        merged.hours = data.hours || old.hours;
        merged.proof = data.proof || old.proof;
        merged.status = data.status || old.status;
        merged.analysis = data.analysis !== undefined ? data.analysis : old.analysis;
        merged.proofImages = data.proofImages || old.proofImages;
        merged.id = id;
        var upd = new Activity(merged);
        var temp = this.activities.slice(); temp.splice(idx, 1);
        var errs = this.validateConstraints(upd, temp);
        if (errs.length > 0) throw new Error(errs.join('\n'));
        var result = await supabase.update(id, upd.toSupabase());
        this.activities[idx] = new Activity(result[0]);
    },

    delete: async function(id) {
        var idx = -1;
        for (var i = 0; i < this.activities.length; i++) { if (this.activities[i].id === id) { idx = i; break; } }
        if (idx === -1) return false;
        await supabase.remove(id);
        this.activities.splice(idx, 1);
        return true;
    },

    validateConstraints: function(activity, list) {
        list = list || this.activities;
        var errors = activity.validate();
        var totalH = parseInt(activity.hours) || 0;
        var themeH = parseInt(activity.hours) || 0;
        for (var i = 0; i < list.length; i++) {
            totalH += parseInt(list[i].hours) || 0;
            if (list[i].theme === activity.theme) themeH += parseInt(list[i].hours) || 0;
        }
        if (totalH > CONFIG.maxTotalHours) errors.push('Dépassement ' + CONFIG.maxTotalHours + 'h (total: ' + totalH + 'h)');
        if (themeH > CONFIG.maxHoursPerTheme) errors.push('Max ' + CONFIG.maxHoursPerTheme + 'h pour ' + activity.theme + ' (total: ' + themeH + 'h)');
        var tc = CONFIG.activityTypes[activity.type];
        if (tc && tc.maxCount) {
            var cnt = 1;
            for (var j = 0; j < list.length; j++) { if (list[j].type === activity.type) cnt++; }
            if (cnt > tc.maxCount) errors.push('Max ' + tc.maxCount + ' ' + tc.label);
        }
        return errors;
    },

    getStats: function() {
        var totalH = 0, completed = 0, themes = {}, themeH = {};
        for (var i = 0; i < this.activities.length; i++) {
            var a = this.activities[i];
            var h = parseInt(a.hours) || 0;
            totalH += h;
            themes[a.theme] = true;
            if (a.status === 'Complété') completed++;
            themeH[a.theme] = (themeH[a.theme] || 0) + h;
        }
        var tc = 0; for (var t in themes) tc++;
        return { totalHours: totalH, totalActivities: this.activities.length, completedActivities: completed, totalThemes: tc, themeHours: themeH };
    },

    getValidationMessages: function() {
        var s = this.getStats(), m = [];
        if (s.totalHours < CONFIG.maxTotalHours) m.push({ type:'warning', text:'Il manque ' + (CONFIG.maxTotalHours - s.totalHours) + 'h' });
        else if (s.totalHours > CONFIG.maxTotalHours) m.push({ type:'error', text:'Dépassement de ' + (s.totalHours - CONFIG.maxTotalHours) + 'h' });
        else m.push({ type:'success', text:'Objectif de 60h atteint!' });
        if (s.totalThemes < CONFIG.minThemes) m.push({ type:'warning', text:'Il manque ' + (CONFIG.minThemes - s.totalThemes) + ' thème(s)' });
        if (s.totalActivities < CONFIG.minActivities) m.push({ type:'warning', text:'Il manque ' + (CONFIG.minActivities - s.totalActivities) + ' activité(s)' });
        return m;
    },

    generateReport: function() {
        var s = this.getStats();
        var r = "# Portfolio - Noah Rogier\n\nHeures: " + s.totalHours + "/60\nActivités: " + s.totalActivities + "\nThèmes: " + s.totalThemes + "\n\n";
        for (var i = 0; i < this.activities.length; i++) {
            var a = this.activities[i];
            r += "## " + a.name + "\n- " + a.theme + " | " + a.hours + "h | " + a.status + "\n- Preuve: " + a.proof + "\n\n";
        }
        return r;
    }
};

// ===================================
// UI
// ===================================
var UI = {
    manager: ActivityManager,
    pendingImages: [],

    init: async function() {
        var ok = await this.manager.loadData();
        this.bindEvents();
        this.render();
        if (!ok) {
            this.showNotification('Erreur de connexion à la base de données: ' + (this.manager.loadError || 'inconnue'), 'error');
        }
    },

    bindEvents: function() {
        var self = this;
        var form = document.getElementById('activityForm');
        if (form) form.addEventListener('submit', function(e) { self.handleSubmit(e); });

        var ta = document.getElementById('activityAnalysis');
        if (ta) ta.addEventListener('input', function(e) {
            var cc = document.getElementById('charCount');
            if (cc) cc.textContent = e.target.value.length;
        });

        var pi = document.getElementById('proofPhotos');
        if (pi) pi.addEventListener('change', function(e) { self.handlePhotoUpload(e); });

        var dz = document.getElementById('photoUploadZone');
        if (dz && pi) {
            dz.addEventListener('dragenter', function(e) { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragover', function(e) { e.preventDefault(); });
            dz.addEventListener('dragleave', function(e) { e.preventDefault(); dz.classList.remove('dragover'); });
            dz.addEventListener('drop', function(e) { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files.length) { pi.files = e.dataTransfer.files; pi.dispatchEvent(new Event('change')); } });
        }
    },

    handlePhotoUpload: function(e) {
        var self = this;
        Array.from(e.target.files).forEach(function(file) {
            if (!file.type.startsWith('image/') || file.size > 5242880) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var img = new Image();
                img.onload = function() {
                    var c = document.createElement('canvas'), w = img.width, h = img.height;
                    if (w > 800) { h = h * (800/w); w = 800; }
                    if (h > 800) { w = w * (800/h); h = 800; }
                    c.width = w; c.height = h;
                    c.getContext('2d').drawImage(img, 0, 0, w, h);
                    self.pendingImages.push(c.toDataURL('image/jpeg', 0.7));
                    self.renderPhotoPreview();
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    },

    renderPhotoPreview: function() {
        var c = document.getElementById('photoPreview');
        if (!c) return;
        var h = '';
        for (var i = 0; i < this.pendingImages.length; i++) {
            h += '<div class="photo-thumb"><img src="' + this.pendingImages[i] + '"><button type="button" class="photo-remove" onclick="UI.removePhoto(' + i + ')">&times;</button></div>';
        }
        c.innerHTML = h;
    },

    removePhoto: function(i) { this.pendingImages.splice(i, 1); this.renderPhotoPreview(); },

    render: function() {
        var s = this.manager.getStats();
        console.log('[UI] render - stats:', JSON.stringify(s));

        // Stats
        var el;
        el = document.getElementById('totalHours'); if (el) el.textContent = s.totalHours;
        el = document.getElementById('totalThemes'); if (el) el.textContent = s.totalThemes;
        el = document.getElementById('totalActivities'); if (el) el.textContent = s.totalActivities;
        el = document.getElementById('completedActivities'); if (el) el.textContent = s.completedActivities;

        var pb = document.getElementById('hoursProgress');
        if (pb) {
            pb.style.width = Math.min((s.totalHours / CONFIG.maxTotalHours) * 100, 100) + '%';
            pb.style.background = s.totalHours === CONFIG.maxTotalHours ? 'var(--success-color)' : s.totalHours > CONFIG.maxTotalHours ? 'var(--error-color)' : 'var(--gradient-primary)';
        }

        // Alerts
        var msgs = this.manager.getValidationMessages();
        var ac = document.getElementById('validationAlerts');
        if (ac) {
            var ah = '';
            for (var i = 0; i < msgs.length; i++) ah += '<div class="alert alert-' + msgs[i].type + '">' + msgs[i].text + '</div>';
            ac.innerHTML = ah;
        }

        // Table
        this.renderTable();
        this.renderThemeCards();
    },

    renderTable: function() {
        var tbody = document.getElementById('activitiesTableBody');
        if (!tbody) return;
        var acts = this.getFilteredActivities();
        console.log('[UI] renderTable - showing:', acts.length, 'activities');

        if (acts.length === 0) {
            document.getElementById('activitiesTable').style.display = 'none';
            var es = document.getElementById('emptyState'); if (es) es.style.display = 'flex';
            return;
        }
        document.getElementById('activitiesTable').style.display = 'table';
        var es2 = document.getElementById('emptyState'); if (es2) es2.style.display = 'none';

        var html = '';
        for (var i = 0; i < acts.length; i++) {
            var a = acts[i];
            var tl = (CONFIG.activityTypes[a.type] || {}).label || a.type;
            var sc = (CONFIG.statuses[a.status] || {}).class || 'todo';
            var ds = ''; try { ds = new Date(a.date).toLocaleDateString('fr-FR'); } catch(e) { ds = a.date; }
            var pi = (a.proofImages && a.proofImages.length > 0) ? ' (' + a.proofImages.length + ' photo' + (a.proofImages.length > 1 ? 's' : '') + ')' : '';

            html += '<tr>';
            html += '<td><span class="theme-badge">' + a.theme + '</span></td>';
            html += '<td><strong>' + a.name + '</strong></td>';
            html += '<td>' + tl + '</td>';
            html += '<td>' + ds + '</td>';
            html += '<td><strong>' + a.hours + 'h</strong></td>';
            html += '<td>' + a.proof + pi + '</td>';
            html += '<td><span class="status-badge status-' + sc + '">' + a.status + '</span></td>';
            html += '<td>' + (a.analysis ? '<button class="btn-link" onclick="UI.showAnalysis(' + a.id + ')">Voir</button>' : '<button class="btn-link" onclick="UI.editActivity(' + a.id + ')">Ajouter</button>') + '</td>';
            html += '<td style="white-space:nowrap"><button class="btn-icon" onclick="UI.editActivity(' + a.id + ')">Modifier</button><br><button class="btn-icon" onclick="UI.deleteActivity(' + a.id + ')">Supprimer</button></td>';
            html += '</tr>';
        }
        tbody.innerHTML = html;
    },

    renderThemeCards: function() {
        var c = document.getElementById('themeCards');
        if (!c) return;
        var s = this.manager.getStats(), html = '';
        for (var i = 0; i < CONFIG.themes.length; i++) {
            var t = CONFIG.themes[i], h = s.themeHours[t] || 0;
            var cnt = 0, comp = 0;
            for (var j = 0; j < this.manager.activities.length; j++) {
                if (this.manager.activities[j].theme === t) { cnt++; if (this.manager.activities[j].status === 'Complété') comp++; }
            }
            html += '<div class="theme-card"><div class="theme-card-header"><h3>' + t + '</h3><span class="theme-hours">' + h + '/' + CONFIG.maxHoursPerTheme + 'h</span></div>';
            html += '<div class="theme-progress"><div class="theme-progress-bar" style="width:' + (h/CONFIG.maxHoursPerTheme*100) + '%"></div></div>';
            html += '<div class="theme-stats"><span>' + cnt + ' activité(s)</span><span>' + comp + ' complétée(s)</span></div></div>';
        }
        c.innerHTML = html;
    },

    getFilteredActivities: function() {
        var all = this.manager.activities.slice();
        var tf = document.getElementById('themeFilter');
        var sf = document.getElementById('statusFilter');
        var tv = (tf && tf.value) || '';
        var sv = (sf && sf.value) || '';

        if (tv) { var f = []; for (var i = 0; i < all.length; i++) { if (all[i].theme === tv) f.push(all[i]); } all = f; }
        if (sv) { var f2 = []; for (var j = 0; j < all.length; j++) { if (all[j].status === sv) f2.push(all[j]); } all = f2; }
        return all;
    },

    handleSubmit: async function(e) {
        e.preventDefault();
        var d = {
            theme: document.getElementById('activityTheme').value,
            name: document.getElementById('activityName').value,
            type: document.getElementById('activityType').value,
            date: document.getElementById('activityDate').value,
            hours: parseInt(document.getElementById('activityHours').value),
            proof: document.getElementById('activityProof').value,
            status: document.getElementById('activityStatus').value,
            analysis: document.getElementById('activityAnalysis').value,
            proofImages: this.pendingImages.slice()
        };
        try {
            if (this.manager.currentEditId) { await this.manager.update(this.manager.currentEditId, d); this.showNotification('Mise à jour OK', 'success'); }
            else { await this.manager.add(d); this.showNotification('Activité ajoutée', 'success'); }
            this.closeModal();
            this.render();
        } catch (err) { this.showNotification(err.message, 'error'); }
    },

    editActivity: function(id) {
        var a = null;
        for (var i = 0; i < this.manager.activities.length; i++) { if (this.manager.activities[i].id === id) { a = this.manager.activities[i]; break; } }
        if (!a) return;
        this.manager.currentEditId = id;
        this.pendingImages = (a.proofImages || []).slice();
        document.getElementById('modalTitle').textContent = "Modifier l'activité";
        document.getElementById('activityTheme').value = a.theme;
        document.getElementById('activityName').value = a.name;
        document.getElementById('activityType').value = a.type;
        document.getElementById('activityDate').value = a.date;
        document.getElementById('activityHours').value = a.hours;
        document.getElementById('activityProof').value = a.proof;
        document.getElementById('activityStatus').value = a.status;
        document.getElementById('activityAnalysis').value = a.analysis;
        var cc = document.getElementById('charCount'); if (cc) cc.textContent = a.analysis.length;
        this.renderPhotoPreview();
        this.updateHoursLimit();
        this.openModal();
    },

    deleteActivity: async function(id) {
        if (!confirm('Supprimer cette activité ?')) return;
        try { await this.manager.delete(id); this.showNotification('Supprimée', 'success'); this.render(); }
        catch (err) { this.showNotification(err.message, 'error'); }
    },

    currentAnalysisId: null,

    showAnalysis: function(id) {
        this.currentAnalysisId = id;
        var a = null;
        for (var i = 0; i < this.manager.activities.length; i++) { if (this.manager.activities[i].id === id) { a = this.manager.activities[i]; break; } }
        if (!a) return;
        var modal = document.getElementById('analysisModal'), content = document.getElementById('analysisContent');
        if (!modal || !content) return;
        var ds = ''; try { ds = new Date(a.date).toLocaleDateString('fr-FR'); } catch(e) { ds = a.date; }
        var h = '<h3>' + a.name + '</h3>';
        h += '<div class="analysis-meta"><span><strong>Thème:</strong> ' + a.theme + '</span><span><strong>Date:</strong> ' + ds + '</span><span><strong>Durée:</strong> ' + a.hours + 'h</span></div>';
        h += '<div class="analysis-text">' + (a.analysis ? '<div class="analysis-content">' + a.analysis.replace(/\n/g,'<br>') + '</div>' : '<p class="text-muted">Pas d\'analyse réflexive.</p>') + '</div>';
        h += '<div class="analysis-proof"><strong>Preuve:</strong> ' + a.proof + '</div>';
        if (a.proofImages && a.proofImages.length > 0) {
            h += '<div class="analysis-photos"><strong>Photos:</strong><div class="photo-gallery">';
            for (var j = 0; j < a.proofImages.length; j++) h += '<a href="' + a.proofImages[j] + '" target="_blank" class="gallery-item"><img src="' + a.proofImages[j] + '"></a>';
            h += '</div></div>';
        }
        content.innerHTML = h;
        modal.classList.add('active');
    },

    openModal: function() { var m = document.getElementById('activityModal'); if (m) m.classList.add('active'); },
    closeModal: function() {
        var m = document.getElementById('activityModal');
        if (m) { m.classList.remove('active'); document.getElementById('activityForm').reset(); this.manager.currentEditId = null; this.pendingImages = []; this.renderPhotoPreview(); document.getElementById('modalTitle').textContent = 'Ajouter une activité'; }
    },
    closeAnalysisModal: function() { var m = document.getElementById('analysisModal'); if (m) m.classList.remove('active'); },

    updateHoursLimit: function() {
        var type = document.getElementById('activityType').value, ht = document.getElementById('hoursHelp');
        if (!type || !ht) return;
        var tc = CONFIG.activityTypes[type];
        if (!tc) return;
        ht.textContent = '(max ' + tc.maxHours + 'h)';
        if (tc.maxCount) {
            var cnt = 0;
            for (var i = 0; i < this.manager.activities.length; i++) { if (this.manager.activities[i].type === type) cnt++; }
            if (this.manager.currentEditId) { for (var j = 0; j < this.manager.activities.length; j++) { if (this.manager.activities[j].id === this.manager.currentEditId && this.manager.activities[j].type === type) { cnt--; break; } } }
            ht.textContent += cnt >= tc.maxCount ? ' - Limite atteinte' : ' - ' + (tc.maxCount - cnt) + ' restante(s)';
            ht.style.color = cnt >= tc.maxCount ? 'var(--error-color)' : 'var(--text-light)';
        }
    },

    exportData: function() {
        var b = new Blob([JSON.stringify(this.manager.activities, null, 2)], {type:'application/json'});
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'activites_' + new Date().toISOString().split('T')[0] + '.json'; a.click();
    },

    generateReport: function() {
        var b = new Blob([this.manager.generateReport()], {type:'text/markdown'});
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rapport_' + new Date().toISOString().split('T')[0] + '.md'; a.click();
    },

    showNotification: function(msg, type) {
        var n = document.createElement('div'); n.textContent = msg;
        var bg = type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1';
        n.style.cssText = 'position:fixed;top:100px;right:20px;padding:15px 20px;background:' + bg + ';color:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:9999;';
        document.body.appendChild(n);
        setTimeout(function() { n.style.opacity = '0'; n.style.transition = 'opacity .3s'; setTimeout(function() { if (n.parentNode) n.parentNode.removeChild(n); }, 300); }, 3000);
    }
};

// Globales
window.openAddModal = function() { UI.manager.currentEditId = null; UI.pendingImages = []; document.getElementById('modalTitle').textContent = 'Ajouter une activité'; document.getElementById('activityForm').reset(); UI.renderPhotoPreview(); UI.openModal(); };
window.closeModal = function() { UI.closeModal(); };
window.closeAnalysisModal = function() { UI.closeAnalysisModal(); };
window.filterActivities = function() { UI.renderTable(); };
window.exportData = function() { UI.exportData(); };
window.generateReport = function() { UI.generateReport(); };
window.updateHoursLimit = function() { UI.updateHoursLimit(); };
window.handleSubmit = function(e) { e.preventDefault(); UI.handleSubmit(e); };
window.printAnalysis = function() { window.print(); };
window.editAnalysis = function() { var id = UI.currentAnalysisId; UI.closeAnalysisModal(); if (id) UI.editActivity(id); };

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('activitiesTable')) UI.init();
});