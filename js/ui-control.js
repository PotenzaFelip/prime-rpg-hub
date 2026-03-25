import { Persistence } from './persistence.js';

// --- MODO VISUALIZAÇÃO VS EDIÇÃO ---
window.isLocked = false; // Estado inicial: Aberto para editar

window.toggleSheetLock = function() {
    window.isLocked = !window.isLocked;
    const btn = document.getElementById('lock-btn');
    const sheetContainer = document.querySelector('#view-sheet .sheet-container');
    
    // Busca todos os inputs e textareas da ficha
    const fields = document.querySelectorAll('#view-sheet input, #view-sheet textarea');

    if (window.isLocked) {
        // MODO LEITURA (Trancado)
        btn.innerHTML = "MODO LEITURA 🔒";
        btn.style.background = "#2c3e50";
        sheetContainer.classList.add('sheet-locked'); // Para estilizar via CSS
        
        fields.forEach(field => {
            field.setAttribute('readonly', true);
        });
    } else {
        // MODO EDIÇÃO (Aberto)
        btn.innerHTML = "MODO EDIÇÃO 🔓";
        btn.style.background = "#444";
        sheetContainer.classList.remove('sheet-locked');
        
        fields.forEach(field => {
            field.removeAttribute('readonly');
        });
    }
};

const skillMap = {
    'str': ['sk-athl'],
    'dex': ['sk-acro', 'sk-slei', 'sk-stea'],
    'int': ['sk-arc', 'sk-hist', 'sk-inv', 'sk-nat', 'sk-rel'],
    'wis': ['sk-anim', 'sk-insig', 'sk-med', 'sk-perc', 'sk-surv'],
    'cha': ['sk-decep', 'sk-intim', 'sk-perf', 'sk-pers']
};

// Função para calcular o modificador de D&D 5e: (Valor - 10) / 2 arredondado para baixo
window.calculateMod = function(score) {
    return Math.floor((score - 10) / 2);
};
document.addEventListener('input', (e) => {
    const id = e.target.id;

    // Se o usuário mexer em um SCORE de atributo (ex: str-score)
    if (id.endsWith('-score')) {
        const attr = id.replace('-score', ''); // Pega apenas 'str', 'dex', etc.
        const score = parseInt(e.target.value) || 0;
        const mod = window.calculateMod(score);

        // 1. Atualiza o Modificador Principal do Atributo
        const modInput = document.getElementById(`${attr}-mod`);
        if (modInput) modInput.value = mod;

        // 2. Atualiza o Teste de Resistência correspondente
        const saveInput = document.getElementById(`n-sv-${attr}`);
        if (saveInput) saveInput.value = mod;

        // 3. Atualiza todas as Perícias ligadas a esse atributo
        if (skillMap[attr]) {
            skillMap[attr].forEach(skillId => {
                const skillInput = document.getElementById(`n-${skillId}`);
                if (skillInput) skillInput.value = mod;
            });
        }
        
        // Salva as mudanças
        Persistence.save();
    }

    // Mantém sua lógica de HP e Auto-save original para os outros campos
    const physicsIds = ['grav', 'force', 'damp', 'stop'];
    if (!physicsIds.includes(id) && !id.endsWith('-score')) {
        Persistence.save();
    }
});

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
    // 1. Carrega os dados salvos no localStorage
    Persistence.load();

    // 2. CORREÇÃO: Força a atualização visual da barra de vida assim que carrega
    // Usamos um pequeno timeout para garantir que os inputs já tenham os valores
    setTimeout(() => {
        if (typeof window.updateHPVisual === 'function') {
            window.updateHPVisual();
        }
    }, 100);

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

// --- LÓGICA VISUAL DE PONTOS DE VIDA ---
window.updateHPVisual = function() {
    // 1. Pega os valores atuais dos inputs
    const currentHP = parseInt(document.getElementById('hp-curr').value) || 0;
    const maxHP = parseInt(document.getElementById('hp-max').value) || 1;
    const charName = document.getElementById('char-name').value || "Personagem"; // Nome dinâmico
    
    const barFill = document.getElementById('hp-bar-fill');
    const tempFill = document.getElementById('hp-temp-fill');

    if (currentHP > maxHP) {
        // --- LÓGICA DE HP TEMPORÁRIO ---
        const totalRepresented = currentHP; 
        const greenWidth = (maxHP / totalRepresented) * 100;
        const yellowWidth = ((currentHP - maxHP) / totalRepresented) * 100;

        barFill.style.width = greenWidth + "%";
        barFill.style.backgroundColor = "#2ecc71"; 
        
        tempFill.style.width = yellowWidth + "%";
        
        // Dispara o Toast com o nome que estiver no input
        showHPToast(charName, currentHP, 110); 
    } else {
        // --- LÓGICA NORMAL ---
        let percentage = (currentHP / maxHP) * 100;
        percentage = Math.max(0, Math.min(100, percentage));

        barFill.style.width = percentage + "%";
        tempFill.style.width = "0%"; 

        // Cores de alerta
        if (percentage < 25) {
            barFill.style.backgroundColor = "#e74c3c";
        } else if (percentage < 50) {
            barFill.style.backgroundColor = "#f39c12";
        } else {
            barFill.style.backgroundColor = "#2ecc71";
        }

        showHPToast(charName, currentHP, percentage);
    }
    
    if(typeof Persistence !== 'undefined') Persistence.save();
};

// Variável de controle do tempo do Toast
let hpToastTimeout;

window.showHPToast = function(name, current, percentage) {
    const container = document.getElementById('toast-container');
    const toast = container.querySelector('.toast');
    const msg = document.getElementById('hp-toast-msg');
    const icon = container.querySelector('.toast-icon');
    
    // Define a mensagem usando o nome passado por argumento
    msg.innerText = `${name}: ${current} HP`;

    // Lógica visual do ícone no Toast
    if (percentage > 100) {
        icon.innerText = "🛡️"; // Ícone de escudo/temp HP
        toast.style.borderColor = "#f1c40f";
    } else if (percentage < 25) {
        icon.innerText = "💀";
        toast.style.borderColor = "#e74c3c";
    } else {
        icon.innerText = "❤️";
        toast.style.borderColor = "#2ecc71";
    }

    container.style.display = 'block';

    clearTimeout(hpToastTimeout);
    hpToastTimeout = setTimeout(() => {
        container.style.display = 'none';
    }, 3000);
};