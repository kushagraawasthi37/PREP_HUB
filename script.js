// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(card => observer.observe(card));

// ============================================================
// PARTICLES
// ============================================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 20}s`;
        p.style.animationDuration = `${15 + Math.random() * 15}s`;
        container.appendChild(p);
    }
}
createParticles();

// ============================================================
// HERO RIPPLE
// ============================================================
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        Object.assign(ripple.style, {
            position: 'absolute', width: '20px', height: '20px',
            background: 'rgba(255,255,255,0.5)', borderRadius: '50%',
            left: `${e.clientX - rect.left}px`, top: `${e.clientY - rect.top}px`,
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            animation: 'ripple 0.6s ease-out'
        });
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{from{width:20px;height:20px;opacity:1}to{width:200px;height:200px;opacity:0}}`;
document.head.appendChild(rippleStyle);

// ============================================================
// PARALLAX
// ============================================================
window.addEventListener('scroll', () => {
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow && window.scrollY < window.innerHeight) {
        heroGlow.style.transform = `translate(-50%,-50%) translateY(${window.scrollY * 0.5}px)`;
    }
});

// ============================================================
// CARD HOVER TRACKING
// ============================================================
document.querySelectorAll('.card').forEach(card => {
    const glow = card.querySelector('.card-glow');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        if (glow) glow.style.transform = `translate(${(x / rect.width - 0.5) * 20}px,${(y / rect.height - 0.5) * 20}px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
        if (glow) glow.style.transform = 'translate(0,0)';
    });
});

// ============================================================
// PAGE LOAD FADE IN
// ============================================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================================
// TAB SWITCHING
// ============================================================
document.querySelectorAll('.planner-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.planner-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.planner-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.dataset.tab === 'weekly' ? 'weeklyPlanner' : 'dailyPlanner';
        document.getElementById(id).classList.add('active');
    });
});

// ============================================================
// BEAUTIFUL POPUP SYSTEM
// ============================================================
class PopupSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        const style = document.createElement('style');
        style.textContent = `
            .popup-backdrop {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0,0,0,0); backdrop-filter: blur(0px);
                display: flex; align-items: center; justify-content: center;
                transition: background 0.25s ease, backdrop-filter 0.25s ease;
                pointer-events: none;
            }
            .popup-backdrop.open {
                background: rgba(0,0,0,0.65); backdrop-filter: blur(12px);
                pointer-events: all;
            }
            .popup-box {
                background: #111113; border: 1px solid rgba(255,255,255,0.1);
                border-radius: 22px; padding: 0; width: 90%; max-width: 460px;
                box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15);
                transform: scale(0.88) translateY(20px); opacity: 0;
                transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
                overflow: hidden;
            }
            .popup-backdrop.open .popup-box {
                transform: scale(1) translateY(0); opacity: 1;
            }
            .popup-stripe {
                height: 4px;
                background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
            }
            .popup-inner { padding: 2rem; }
            .popup-icon-wrap {
                width: 56px; height: 56px; border-radius: 16px; margin-bottom: 1.25rem;
                display: flex; align-items: center; justify-content: center;
                background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
            }
            .popup-icon-wrap.danger { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.25); }
            .popup-icon-wrap.success { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.25); }
            .popup-title { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
            .popup-msg { font-size: 0.95rem; color: #888; line-height: 1.6; margin-bottom: 1.75rem; }
            .popup-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
            .popup-btn {
                padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 0.9rem;
                font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none;
                font-family: inherit; letter-spacing: -0.01em;
            }
            .popup-btn-cancel {
                background: rgba(255,255,255,0.06); color: #aaa;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .popup-btn-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .popup-btn-confirm {
                background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
                box-shadow: 0 4px 16px rgba(99,102,241,0.35);
            }
            .popup-btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
            .popup-btn-confirm:active { transform: translateY(0); }
            .popup-btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; box-shadow: 0 4px 16px rgba(239,68,68,0.3); }
            .popup-btn-danger:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(239,68,68,0.4); }
            .popup-form-section { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1.75rem; }
            .popup-field label { display: block; font-size: 0.8rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
            .popup-field select, .popup-field input[type=number], .popup-field input[type=text] {
                width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px; padding: 0.875rem 1rem; color: #fff; font-size: 0.95rem;
                font-family: inherit; outline: none; transition: all 0.2s ease; appearance: none;
            }
            .popup-field select:focus, .popup-field input:focus {
                border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05);
                box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
            }
            .popup-field select option { background: #1a1a1a; }
            .popup-color-preview {
                width: 14px; height: 14px; border-radius: 4px; display: inline-block; margin-right: 8px; vertical-align: middle;
            }
            .hours-selector { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; }
            .hours-chip {
                padding: 0.6rem 0; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.04); color: #888; font-size: 0.85rem; font-weight: 600;
                cursor: pointer; transition: all 0.2s ease; text-align: center; font-family: inherit;
            }
            .hours-chip:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; background: rgba(99,102,241,0.08); }
            .hours-chip.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.5); color: #a5b4fc; }
        `;
        document.head.appendChild(style);

        this.container = document.createElement('div');
        this.container.className = 'popup-backdrop';
        document.body.appendChild(this.container);

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this._resolve && this._resolve(false);
        });
    }

    _iconSVG(type) {
        if (type === 'danger') return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`;
        if (type === 'success') return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }

    confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'default' }) {
        return new Promise((resolve) => {
            this._resolve = resolve;
            const iconClass = type === 'danger' ? 'danger' : type === 'success' ? 'success' : '';
            const btnClass = type === 'danger' ? 'popup-btn-danger' : 'popup-btn-confirm';

            this.container.innerHTML = `
                <div class="popup-box">
                    <div class="popup-stripe"></div>
                    <div class="popup-inner">
                        <div class="popup-icon-wrap ${iconClass}">${this._iconSVG(type)}</div>
                        <div class="popup-title">${title}</div>
                        <div class="popup-msg">${message}</div>
                        <div class="popup-actions">
                            <button class="popup-btn popup-btn-cancel" id="pp-cancel">${cancelText}</button>
                            <button class="popup-btn ${btnClass}" id="pp-confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>`;

            requestAnimationFrame(() => this.container.classList.add('open'));

            this.container.querySelector('#pp-confirm').onclick = () => { resolve(true); this.close(); };
            this.container.querySelector('#pp-cancel').onclick = () => { resolve(false); this.close(); };
        });
    }

    prompt({ title, fields, confirmText = 'Save' }) {
        return new Promise((resolve) => {
            this._resolve = resolve;
            const fieldsHtml = fields.map(f => {
                if (f.type === 'select') {
                    const opts = f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
                    return `<div class="popup-field"><label>${f.label}</label><select id="pf-${f.id}">${opts}</select></div>`;
                }
                if (f.type === 'hours') {
                    const chips = f.options.map(v => `<button class="hours-chip${v === f.default ? ' active' : ''}" data-v="${v}" type="button">${v}h</button>`).join('');
                    return `<div class="popup-field"><label>${f.label}</label><div class="hours-selector" id="pf-${f.id}-wrap">${chips}</div><input type="hidden" id="pf-${f.id}" value="${f.default}"></div>`;
                }
                return `<div class="popup-field"><label>${f.label}</label><input type="${f.type || 'text'}" id="pf-${f.id}" value="${f.default || ''}" placeholder="${f.placeholder || ''}"></div>`;
            }).join('');

            this.container.innerHTML = `
                <div class="popup-box">
                    <div class="popup-stripe"></div>
                    <div class="popup-inner">
                        <div class="popup-title">${title}</div>
                        <div class="popup-form-section">${fieldsHtml}</div>
                        <div class="popup-actions">
                            <button class="popup-btn popup-btn-cancel" id="pp-cancel">Cancel</button>
                            <button class="popup-btn popup-btn-confirm" id="pp-confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>`;

            requestAnimationFrame(() => this.container.classList.add('open'));

            // Hours chips
            fields.filter(f => f.type === 'hours').forEach(f => {
                const wrap = this.container.querySelector(`#pf-${f.id}-wrap`);
                const hidden = this.container.querySelector(`#pf-${f.id}`);
                wrap && wrap.addEventListener('click', (e) => {
                    const chip = e.target.closest('.hours-chip');
                    if (!chip) return;
                    wrap.querySelectorAll('.hours-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    hidden.value = chip.dataset.v;
                });
            });

            this.container.querySelector('#pp-confirm').onclick = () => {
                const result = {};
                fields.forEach(f => {
                    result[f.id] = this.container.querySelector(`#pf-${f.id}`)?.value;
                });
                resolve(result);
                this.close();
            };
            this.container.querySelector('#pp-cancel').onclick = () => { resolve(null); this.close(); };
        });
    }

    close() {
        this.container.classList.remove('open');
        setTimeout(() => { this.container.innerHTML = ''; }, 300);
        this._resolve = null;
    }

    toast(message, type = 'default') {
        const existing = document.querySelector('.popup-toast-container');
        if (!existing) {
            const tc = document.createElement('div');
            tc.className = 'popup-toast-container';
            tc.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:99998;display:flex;flex-direction:column;gap:0.75rem;';
            document.body.appendChild(tc);
        }
        const tc = document.querySelector('.popup-toast-container');
        const t = document.createElement('div');
        const colors = { default: '#6366f1', success: '#10b981', danger: '#ef4444', warning: '#f59e0b' };
        t.style.cssText = `background:#111;border:1px solid rgba(255,255,255,0.1);border-left:3px solid ${colors[type] || colors.default};border-radius:12px;padding:1rem 1.25rem;color:#fff;font-size:0.9rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateX(120%);transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s;max-width:320px;`;
        t.textContent = message;
        tc.appendChild(t);
        requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
        setTimeout(() => {
            t.style.transform = 'translateX(120%)';
            t.style.opacity = '0';
            setTimeout(() => t.remove(), 350);
        }, 3000);
    }
}

const popup = new PopupSystem();

// Expose for HTML onclick compatibility
window.popup = popup;

// ============================================================
// WEEKLY STUDY PLANNER
// ============================================================
const SUBJECTS = {
    'DSA': { color: '#c4b5fd', text: '#3b0764' },
    'SQL': { color: '#bfdbfe', text: '#1e3a5f' },
    'System Design': { color: '#fecaca', text: '#7f1d1d' },
    'OOP': { color: '#d9f99d', text: '#1a2e05' },
    'JavaScript': { color: '#fde68a', text: '#451a03' },
    'React': { color: '#fbcfe8', text: '#500724' },
    'Frontend Advanced': { color: '#e5e7eb', text: '#1f2937' },
    'Revision': { color: '#fecdd3', text: '#4c0519' }
};

const DAYS_CONFIG = {
    light: ['Monday', 'Tuesday', 'Wednesday'],
    heavy: ['Thursday', 'Friday', 'Saturday', 'Sunday']
};

class WeeklyPlanner {
    constructor() {
        this.data = this.load();
        this.render();
        this.updateStats();
    }

    load() {
        try {
            const saved = localStorage.getItem('prephub_weekly_v2');
            if (saved) return JSON.parse(saved);
        } catch {}
        const make = (names, target) => names.map(name => ({ name, target, blocks: [] }));
        return { light: make(DAYS_CONFIG.light, 6), heavy: make(DAYS_CONFIG.heavy, 10) };
    }

    save() { localStorage.setItem('prephub_weekly_v2', JSON.stringify(this.data)); }

    getAllDays() { return [...this.data.light, ...this.data.heavy]; }

    getDay(name) { return this.getAllDays().find(d => d.name === name); }

    render() {
        this.renderGroup('lightDaysGrid', this.data.light);
        this.renderGroup('heavyDaysGrid', this.data.heavy);
    }

    renderGroup(id, days) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '';
        days.forEach(day => el.appendChild(this.buildDayCard(day)));
    }

    buildDayCard(day) {
        const total = day.blocks.reduce((s, b) => s + b.hours, 0);
        const pct = Math.min(100, Math.round((total / day.target) * 100));

        const card = document.createElement('div');
        card.className = 'day-card';
        card.dataset.day = day.name;

        // Progress ring color
        const ringColor = pct >= 100 ? '#10b981' : pct >= 60 ? '#6366f1' : '#f59e0b';

        card.innerHTML = `
            <div class="day-header">
                <div class="day-header-left">
                    <span class="day-name">${day.name.slice(0, 3).toUpperCase()}</span>
                    <span class="day-full-name">${day.name}</span>
                </div>
                <div class="day-progress-ring">
                    <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
                        <circle cx="24" cy="24" r="18" fill="none" stroke="${ringColor}" stroke-width="4"
                            stroke-dasharray="${2 * Math.PI * 18}" stroke-dashoffset="${2 * Math.PI * 18 * (1 - pct / 100)}"
                            stroke-linecap="round" transform="rotate(-90 24 24)" style="transition:stroke-dashoffset 0.5s ease"/>
                        <text x="24" y="24" text-anchor="middle" dominant-baseline="central" fill="${ringColor}" font-size="11" font-weight="700" font-family="inherit">${pct}%</text>
                    </svg>
                </div>
            </div>
            <div class="day-meta">
                <span class="day-hours-badge">${total}h / ${day.target}h</span>
            </div>
            <div class="day-blocks-list" data-day="${day.name}">
                ${day.blocks.map((b, i) => this.buildBlockHTML(day.name, b, i)).join('')}
            </div>
            <button class="add-block-btn" data-day="${day.name}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Block
            </button>`;

        card.querySelector('.add-block-btn').addEventListener('click', () => this.openAddBlock(day.name));

        card.querySelectorAll('.block-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBlock(day.name, parseInt(btn.dataset.idx));
            });
        });

        return card;
    }

    buildBlockHTML(dayName, block, idx) {
        const s = SUBJECTS[block.subject] || { color: '#e5e7eb', text: '#1f2937' };
        return `
            <div class="task-block" style="background:${s.color}; color:${s.text}" data-idx="${idx}">
                <div class="block-left">
                    <div class="block-name">${block.subject}</div>
                    <div class="block-dur">${block.hours}h</div>
                </div>
                <button class="block-del" data-idx="${idx}" title="Remove">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>`;
    }

    async openAddBlock(dayName) {
        const result = await popup.prompt({
            title: `Add block — ${dayName}`,
            confirmText: 'Add Block',
            fields: [
                {
                    id: 'subject', type: 'select', label: 'Subject',
                    options: Object.keys(SUBJECTS).map(k => ({ value: k, label: k }))
                },
                {
                    id: 'hours', type: 'hours', label: 'Duration',
                    options: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10],
                    default: 1
                }
            ]
        });
        if (!result) return;
        const day = this.getDay(dayName);
        if (day) {
            day.blocks.push({ subject: result.subject, hours: parseFloat(result.hours) });
            this.save();
            this.render();
            this.updateStats();
            popup.toast(`${result.subject} added to ${dayName}`, 'success');
        }
    }

    async deleteBlock(dayName, idx) {
        const ok = await popup.confirm({
            title: 'Remove Study Block',
            message: 'Delete this study block from your schedule?',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (!ok) return;
        const day = this.getDay(dayName);
        if (day) {
            day.blocks.splice(idx, 1);
            this.save();
            this.render();
            this.updateStats();
            popup.toast('Block removed', 'default');
        }
    }

    updateStats() {
        const lightH = this.data.light.reduce((s, d) => s + d.blocks.reduce((ss, b) => ss + b.hours, 0), 0);
        const heavyH = this.data.heavy.reduce((s, d) => s + d.blocks.reduce((ss, b) => ss + b.hours, 0), 0);
        document.getElementById('totalWeekHours').textContent = lightH + heavyH;
        document.getElementById('lightDaysHours').textContent = lightH;
        document.getElementById('heavyDaysHours').textContent = heavyH;
    }
}

// ============================================================
// DAILY PLANNER
// ============================================================
class DailyPlanner {
    constructor() {
        this.tasks = this.load();
        this.filter = 'all';
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.emptyState = document.getElementById('emptyState');
        this.init();
    }

    init() {
        this.render();
        this.updateStats();
        this.attachEvents();
        this.injectDailyStyles();
    }

    injectDailyStyles() {
        const s = document.createElement('style');
        s.textContent = `
            .filter-bar { display:flex; gap:0.5rem; margin-bottom:1.5rem; }
            .filter-chip {
                padding:0.5rem 1.1rem; border-radius:30px; font-size:0.85rem; font-weight:600;
                cursor:pointer; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
                color:#888; transition:all 0.2s ease; font-family:inherit;
            }
            .filter-chip.active { background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.5); color:#a5b4fc; }
            .filter-chip:hover:not(.active) { background:rgba(255,255,255,0.07); color:#ccc; }
            .task-item {
                display:flex; align-items:center; gap:1rem; padding:1.1rem 1.4rem;
                background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
                border-radius:14px; margin-bottom:0.6rem;
                transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
                animation:taskSlideIn 0.35s cubic-bezier(0.34,1.3,0.64,1) both;
                position:relative; overflow:hidden;
            }
            @keyframes taskSlideIn { from{opacity:0;transform:translateY(-12px) scale(0.97)} to{opacity:1;transform:none} }
            .task-item::before {
                content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
                background:linear-gradient(180deg,#6366f1,#8b5cf6); border-radius:14px 0 0 14px;
                opacity:0; transition:opacity 0.25s;
            }
            .task-item:hover::before { opacity:1; }
            .task-item:hover { background:rgba(255,255,255,0.07); transform:translateX(4px); border-color:rgba(99,102,241,0.2); }
            .task-item.completed { opacity:0.45; }
            .task-item.completed:hover { opacity:0.65; }
            .task-item.completed .task-text { text-decoration:line-through; color:#666; }
            .task-checkbox {
                width:22px; height:22px; min-width:22px; border:2px solid rgba(255,255,255,0.15);
                border-radius:7px; cursor:pointer; transition:all 0.2s ease; position:relative;
                background:transparent; flex-shrink:0;
            }
            .task-checkbox:hover { border-color:#6366f1; transform:scale(1.1); }
            .task-checkbox.checked { background:linear-gradient(135deg,#6366f1,#8b5cf6); border-color:#6366f1; }
            .task-checkbox.checked::after {
                content:''; position:absolute; left:5px; top:2px; width:6px; height:10px;
                border:solid white; border-width:0 2px 2px 0; transform:rotate(45deg);
            }
            .task-text { flex:1; color:#e5e7eb; font-size:0.95rem; line-height:1.5; word-break:break-word; }
            .task-time { font-size:0.78rem; color:#555; white-space:nowrap; font-weight:500; }
            .task-delete {
                padding:0.45rem; background:transparent; border:none; color:#555; cursor:pointer;
                border-radius:8px; transition:all 0.2s ease; display:flex; align-items:center; flex-shrink:0;
            }
            .task-delete:hover { background:rgba(239,68,68,0.12); color:#ef4444; transform:scale(1.1); }
            .planner-input-wrapper { position:relative; }
            .char-counter {
                position:absolute; right:170px; top:50%; transform:translateY(-50%);
                font-size:0.75rem; color:#555; pointer-events:none; transition:color 0.2s;
            }
            .char-counter.warn { color:#f59e0b; }
            .clear-all-btn { margin-top:1rem; }
            .progress-bar-wrap { margin-bottom:1.5rem; background:rgba(255,255,255,0.05); border-radius:100px; height:6px; overflow:hidden; }
            .progress-bar-fill { height:100%; border-radius:100px; background:linear-gradient(90deg,#6366f1,#8b5cf6); transition:width 0.5s cubic-bezier(0.4,0,0.2,1); }
            .day-meta { padding: 0 1.25rem 0.25rem; }
            .day-hours-badge {
                display:inline-flex; align-items:center; gap:0.4rem;
                font-size:0.78rem; font-weight:600; color:#888;
                background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
                border-radius:30px; padding:0.3rem 0.75rem;
            }
            .day-header-left { display:flex; flex-direction:column; }
            .day-full-name { font-size:0.75rem; color:#666; font-weight:500; margin-top:2px; }
            .day-name { font-size:1.05rem; font-weight:800; color:#fff; letter-spacing:0.04em; }
            .day-blocks-list { padding:0.5rem 0.75rem; display:flex; flex-direction:column; gap:0.5rem; min-height:60px; }
            .block-left { display:flex; flex-direction:column; flex:1; }
            .block-name { font-size:0.88rem; font-weight:700; }
            .block-dur { font-size:0.75rem; opacity:0.7; font-weight:600; }
            .block-del {
                background:rgba(0,0,0,0.2); border:none; border-radius:6px; padding:0.35rem;
                cursor:pointer; opacity:0; transition:all 0.2s; display:flex; align-items:center;
                flex-shrink:0; color:rgba(0,0,0,0.6);
            }
            .task-block:hover .block-del { opacity:1; }
            .block-del:hover { background:rgba(0,0,0,0.4) !important; }
            .task-block { animation:blockIn 0.3s cubic-bezier(0.34,1.3,0.64,1) both; }
            @keyframes blockIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
            .daily-header-row {
                display:flex; align-items:center; justify-content:space-between;
                margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;
            }
            .today-date {
                font-size:0.85rem; color:#666; font-weight:500;
                background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
                border-radius:30px; padding:0.35rem 1rem;
            }
        `;
        document.head.appendChild(s);

        // Add filter bar + date header to daily planner
        const dailyContent = document.getElementById('dailyPlanner');
        if (!dailyContent) return;

        const headerRow = document.createElement('div');
        headerRow.className = 'daily-header-row';
        headerRow.innerHTML = `
            <div class="filter-bar" id="filterBar">
                <button class="filter-chip active" data-f="all">All</button>
                <button class="filter-chip" data-f="pending">Pending</button>
                <button class="filter-chip" data-f="done">Done</button>
            </div>
            <span class="today-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>`;

        const statsEl = dailyContent.querySelector('.planner-stats');
        if (statsEl) statsEl.after(headerRow);

        // Progress bar
        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress-bar-wrap';
        progressWrap.innerHTML = `<div class="progress-bar-fill" id="taskProgressBar" style="width:0%"></div>`;
        headerRow.after(progressWrap);

        // Char counter for input
        const inputWrap = dailyContent.querySelector('.planner-input-wrapper');
        if (inputWrap) {
            const counter = document.createElement('span');
            counter.className = 'char-counter';
            counter.id = 'charCount';
            counter.textContent = '0/200';
            inputWrap.appendChild(counter);
        }
    }

    attachEvents() {
        this.addTaskBtn?.addEventListener('click', () => this.addTask());
        this.taskInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.addTask(); });
        this.clearAllBtn?.addEventListener('click', () => this.clearAll());

        this.taskInput?.addEventListener('input', () => {
            const len = this.taskInput.value.length;
            const counter = document.getElementById('charCount');
            if (counter) {
                counter.textContent = `${len}/200`;
                counter.classList.toggle('warn', len > 160);
            }
        });

        document.getElementById('filterBar')?.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            this.filter = chip.dataset.f;
            this.render();
        });
    }

    load() {
        try {
            const s = localStorage.getItem('prephub_daily_v2');
            return s ? JSON.parse(s) : [];
        } catch { return []; }
    }

    save() { localStorage.setItem('prephub_daily_v2', JSON.stringify(this.tasks)); }

    addTask() {
        const text = this.taskInput?.value.trim();
        if (!text) {
            this.taskInput.style.borderColor = '#ef4444';
            this.taskInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
            setTimeout(() => { this.taskInput.style.borderColor = ''; this.taskInput.style.boxShadow = ''; }, 600);
            return;
        }
        this.tasks.unshift({ id: Date.now(), text, completed: false, createdAt: new Date().toISOString() });
        this.save();
        this.render();
        this.updateStats();
        this.taskInput.value = '';
        document.getElementById('charCount') && (document.getElementById('charCount').textContent = '0/200');
        popup.toast('Task added!', 'success');
    }

    async deleteTask(id) {
        const ok = await popup.confirm({ title: 'Delete Task', message: 'Remove this task from your list?', confirmText: 'Delete', type: 'danger' });
        if (!ok) return;
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save(); this.render(); this.updateStats();
    }

    toggleTask(id) {
        const t = this.tasks.find(t => t.id === id);
        if (t) { t.completed = !t.completed; this.save(); this.render(); this.updateStats(); }
    }

    async clearAll() {
        if (!this.tasks.length) return;
        const ok = await popup.confirm({
            title: 'Clear All Tasks',
            message: `This will permanently delete all ${this.tasks.length} tasks. This can't be undone.`,
            confirmText: 'Clear All', type: 'danger'
        });
        if (!ok) return;
        this.tasks = []; this.save(); this.render(); this.updateStats();
        popup.toast('All tasks cleared', 'default');
    }

    filteredTasks() {
        if (this.filter === 'pending') return this.tasks.filter(t => !t.completed);
        if (this.filter === 'done') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    formatTime(iso) {
        return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    render() {
        if (!this.tasksContainer) return;
        const filtered = this.filteredTasks();

        if (this.tasks.length === 0) {
            this.emptyState && (this.emptyState.style.display = 'flex');
            this.clearAllBtn?.classList.add('hidden');
            this.tasksContainer.innerHTML = '';
            this.tasksContainer.appendChild(this.emptyState || document.createElement('div'));
            return;
        }

        this.emptyState && (this.emptyState.style.display = 'none');
        this.clearAllBtn?.classList.remove('hidden');

        if (filtered.length === 0) {
            this.tasksContainer.innerHTML = `<div style="text-align:center;padding:2rem;color:#555;font-size:0.9rem;">No ${this.filter} tasks</div>`;
            return;
        }

        this.tasksContainer.innerHTML = filtered.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}" role="checkbox"></div>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-time">${this.formatTime(task.createdAt)}</span>
                <button class="task-delete" data-id="${task.id}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
            </div>`).join('');

        this.tasksContainer.querySelectorAll('.task-checkbox').forEach(cb => {
            cb.addEventListener('click', () => this.toggleTask(parseInt(cb.dataset.id)));
        });
        this.tasksContainer.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', () => this.deleteTask(parseInt(btn.dataset.id)));
        });
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        document.getElementById('totalTasks') && (document.getElementById('totalTasks').textContent = total);
        document.getElementById('completedTasks') && (document.getElementById('completedTasks').textContent = completed);
        document.getElementById('pendingTasks') && (document.getElementById('pendingTasks').textContent = total - completed);

        const bar = document.getElementById('taskProgressBar');
        if (bar) bar.style.width = total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';
    }
}

// ============================================================
// INIT
// ============================================================
let weeklyPlanner, planner;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lightDaysGrid')) weeklyPlanner = new WeeklyPlanner();
    if (document.getElementById('taskInput')) planner = new DailyPlanner();
});

// Legacy global compatibility
window.openTaskBlockModal = (day) => weeklyPlanner?.openAddBlock(day);
window.closeTaskBlockModal = () => {};
window.saveTaskBlock = () => {};
window.weeklyPlanner = { deleteBlock: (day, idx) => weeklyPlanner?.deleteBlock(day, idx) };