import { Persistence } from './persistence.js';

// --- NAVEGAÇÃO ENTRE ABAS ---
window.switchView = function(id, el) {
    // Esconde todas as telas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Mostra a tela selecionada
    const target = document.getElementById('view-' + id);
    if (target) target.classList.add('active');
    
    // Atualiza os ícones da sidebar
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    
    // Se for para a mesa de dados, avisa o motor 3D para recalcular o tamanho
    if(id === 'dice' && window.onResize) {
        window.onResize();
    }
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    Persistence.load();

    // Auto-save: Salva sempre que algo for digitado (exceto configs de física)
    document.addEventListener('input', (e) => {
        const physicsIds = ['grav', 'force', 'damp', 'stop'];
        if (!physicsIds.includes(e.target.id)) {
            Persistence.save();
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') Persistence.save();
    });
});