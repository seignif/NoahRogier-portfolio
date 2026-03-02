/**
 * main.js - Script principal du portfolio
 * Noah Rogier - EPHEC 2025
 */
const APP = { name: 'Portfolio Noah Rogier', version: '1.0.0', year: 2025, debug: false };

document.addEventListener('DOMContentLoaded', () => {
    initApp(); initAnimations(); initInteractions(); updateFooterYear();
});

function initApp() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => link.setAttribute('rel', 'noopener noreferrer'));
    document.body.classList.add('loaded');
}

function initAnimations() {
    const els = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-' + e.target.dataset.animate); obs.unobserve(e.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        els.forEach(el => obs.observe(el));
    } else { els.forEach(el => el.classList.add('animate-' + el.dataset.animate)); }
    initParticles();
}

function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const c = document.createElement('div');
    c.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;z-index:0;';
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('span');
        p.style.cssText = 'position:absolute;display:block;width:'+Math.random()*5+'px;height:'+Math.random()*5+'px;background:rgba(102,126,234,'+Math.random()*0.5+');border-radius:50%;top:'+Math.random()*100+'%;left:'+Math.random()*100+'%;animation:float '+(10+Math.random()*20)+'s infinite linear;';
        c.appendChild(p);
    }
    hero.insertBefore(c, hero.firstChild);
}

function initInteractions() {
    document.querySelectorAll('.card, .preview-card, .interest-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const r = this.getBoundingClientRect();
            this.style.transform = 'perspective(1000px) rotateX('+((e.clientY-r.top-r.height/2)/20)+'deg) rotateY('+((r.width/2-(e.clientX-r.left))/20)+'deg) translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() { this.style.transform = ''; });
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const email = link.getAttribute('href').replace('mailto:', '');
            if (email.includes('example.com')) return;
            e.preventDefault(); copyToClipboard(email); showNotification('Email copié !', 'success');
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    else { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
}

function showNotification(message, type) {
    type = type || 'info';
    const n = document.createElement('div');
    n.textContent = message;
    n.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:15px 20px;background:'+(type==='success'?'#48bb78':type==='error'?'#f56565':'#4299e1')+';color:white;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,.1);z-index:9999;animation:slideInUp .3s ease;';
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; n.style.transition = 'opacity .3s'; setTimeout(() => { if (document.body.contains(n)) document.body.removeChild(n); }, 300); }, 3000);
}

function updateFooterYear() {
    document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
}

window.portfolioApp = { showNotification, copyToClipboard,
    formatDate: function(d) { return new Date(d).toLocaleDateString('fr-FR', { year:'numeric', month:'long', day:'numeric' }); },
    scrollToTop: function() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
};
