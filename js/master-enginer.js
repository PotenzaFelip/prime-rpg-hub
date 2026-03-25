// --- BANCO DE DADOS LOCAL & PRESETS ---

const COMMON_MOBS = [
    // --- NÍVEL BAIXO (CR 0 - 1) ---
    { name: "Goblin", ac: "15", hp: "7", image: "assets/goblin.png", actions: "Cimitarra: +4 para acertar, dano 1d6+2. Arco Curto: +4 para acertar, dano 1d6+2." },
    { name: "Orc", ac: "13", hp: "15", image: "assets/orc.png", actions: "Machado Grande: +5 para acertar, dano 1d12+3. Azagaia: +5 para acertar, dano 1d6+3." },
    { name: "Esqueleto", ac: "13", hp: "13", image: "assets/skeleton.png", actions: "Espada Curta: +4 para acertar, dano 1d6+2. Arco Curto: +4 para acertar, dano 1d6+2." },
    { name: "Zumbi", ac: "8", hp: "22", image: "assets/zombie.png", actions: "Pancada: +3 para acertar, dano 1d6+1. Resistência Morta-Viva." },
    { name: "Lobo", ac: "13", hp: "11", image: "assets/wolf.png", actions: "Mordida: +4 para acertar, dano 2d4+2 (derruba se falhar DES CD 11)." },
    { name: "Bandido", ac: "12", hp: "11", image: "assets/bandit.png", actions: "Cimitarra: +3 para acertar, dano 1d6+1. Besta Leve: +3 para acertar, dano 1d8+1." },
    { name: "Kobold", ac: "12", hp: "5", image: "assets/kobold.png", actions: "Adaga: +4 para acertar, dano 1d4+2. Estilingue: +4 para acertar, dano 1d4+2. Tática de Bando." },

    // --- NÍVEL MÉDIO (CR 2 - 5) ---
    { name: "Aranha Gigante", ac: "14", hp: "26", image: "assets/spider.png", actions: "Mordida: +5 para acertar, dano 1d8+3 + 2d8 veneno. Teia (Recarga 5-6)." },
    { name: "Ogro", ac: "11", hp: "59", image: "assets/ogre.png", actions: "Clava Grande: +6 para acertar, dano 2d8+4. Azagaia: +6 para acertar, dano 2d6+4." },
    { name: "Mímico", ac: "12", hp: "58", image: "assets/mimic.png", actions: "Pseudópode: +5 para acertar, dano 1d8+3 (Aderir). Mordida: +5 para acertar, dano 1d8+3." },
    { name: "Urso-Coruja", ac: "13", hp: "59", image: "assets/bear.png", actions: "Ataque Múltiplo: Bico (+7, 1d10+5) e Garras (+7, 2d8+5)." },
    { name: "Minotauro", ac: "14", hp: "76", image: "assets/minotaur.png", actions: "Machado Grande: +6 para acertar, dano 2d12+4. Chifres: +6 para acertar, dano 2d8+4." },

    // --- NÍVEL ALTO / BOSSES ---
    { name: "Troll", ac: "15", hp: "84", image: "assets/troll.png", actions: "Ataque Múltiplo: Mordida (+7, 1d6+4) e 2x Garras (+7, 2d6+4). Regeneração (10 HP/turno)." },
    { name: "Observador", ac: "18", hp: "180", image: "assets/observador.png", actions: "Mordida: +5, 4d6. Raios Oculares (3 aleatórios): Encantar, Paralisar, Medo, Lentidão, Morte, etc." },
    { name: "Dragão Vermelho", ac: "18", hp: "178", image: "assets/dragon-head.png", actions: "Ataque Múltiplo: Mordida (+10, 2d10+6) e 2x Garras (+10, 2d6+6). Sopro de Fogo: 16d6 fogo." },
    { name: "Lich", ac: "17", hp: "135", image: "assets/skull-king.png", actions: "Toque Paralisante: +12, 3d6 frio. Magias: Palavra de Poder Matar, Desintegrar, Bola de Fogo." }
];

// Imagem padrão caso o link falhe ou não seja informado
const IMG_FALLBACK = "https://via.placeholder.com/150/222/00ff00?text=🐉";

// Inicialização de Dados
let localBestiary = JSON.parse(localStorage.getItem('my_local_bestiary'));
if (!localBestiary || localBestiary.length === 0) {
    localBestiary = COMMON_MOBS;
    localStorage.setItem('my_local_bestiary', JSON.stringify(localBestiary));
}
let combatants = JSON.parse(localStorage.getItem('my_combat_initiative')) || [];

// --- SISTEMA DE MODAL DE CONFIRMAÇÃO ---
let confirmCallback = null;

window.askConfirmation = function(message, onConfirm) {
    const modal = document.getElementById('custom-confirm-modal');
    const msgPara = document.getElementById('confirm-msg');
    if (modal) {
        msgPara.innerText = message;
        modal.style.display = 'flex';
        confirmCallback = onConfirm;
    } else {
        if (confirm(message)) onConfirm(); // Fallback se o modal não existir no HTML
    }
};

window.closeConfirmModal = function() {
    const modal = document.getElementById('custom-confirm-modal');
    if (modal) modal.style.display = 'none';
    confirmCallback = null;
};

// --- LOGICA DO BESTIÁRIO ---

window.registerMonster = function() {
    const editId = document.getElementById('reg-id').value; 
    const nameInput = document.getElementById('reg-name');
    const acInput = document.getElementById('reg-ac');
    const hpInput = document.getElementById('reg-hp');
    const imgInput = document.getElementById('reg-image'); 
    const actionsInput = document.getElementById('reg-actions');

    if (!nameInput.value) return alert("O nome do mob é obrigatório!");

    const monsterData = { 
        name: nameInput.value, 
        ac: acInput.value, 
        hp: hpInput.value, 
        actions: actionsInput.value,
        image: imgInput.value || IMG_FALLBACK
    };

    if (editId) {
        // Modo Edição: Localiza pelo nome antigo (editId) e atualiza
        const index = localBestiary.findIndex(m => m.name === editId);
        if (index !== -1) localBestiary[index] = monsterData;
    } else {
        // Novo cadastro
        localBestiary.push(monsterData);
    }

    localStorage.setItem('my_local_bestiary', JSON.stringify(localBestiary));
    resetMonsterForm();
    renderBestiary();
};

window.showMonsterDetail = function(name) {
    const mob = localBestiary.find(m => m.name === name);
    if (!mob) return;

    document.getElementById('m-name').innerText = mob.name;
    document.getElementById('m-ac').innerText = mob.ac;
    document.getElementById('m-hp').innerText = mob.hp;
    document.getElementById('m-actions').innerText = mob.actions;
    
    const imgElement = document.getElementById('m-image');
    if (imgElement) {
        imgElement.src = mob.image || IMG_FALLBACK;
        imgElement.style.display = 'inline-block';

        // Caso a imagem dê erro (403/404), carrega o fallback
        imgElement.onerror = function() {
            this.src = IMG_FALLBACK;
            this.onerror = null; // Evita loop infinito
        };
    }

    document.getElementById('monster-display').style.display = 'block';
    document.getElementById('add-to-init-btn').onclick = () => addCombatant(mob);
    document.getElementById('edit-mob-btn').onclick = () => prepareEdit(mob.name);
};

window.prepareEdit = function(name) {
    const mob = localBestiary.find(m => m.name === name);
    if (!mob) return;

    document.getElementById('reg-id').value = mob.name; 
    document.getElementById('reg-name').value = mob.name;
    document.getElementById('reg-ac').value = mob.ac;
    document.getElementById('reg-hp').value = mob.hp;
    document.getElementById('reg-image').value = mob.image !== IMG_FALLBACK ? mob.image : "";
    document.getElementById('reg-actions').value = mob.actions;
    
    const btn = document.getElementById('btn-save-mob');
    btn.innerText = "ATUALIZAR MONSTRO ✏️";
    btn.style.background = "#f39c12";
    
    // Rola para o topo do formulário
    document.getElementById('reg-name').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function resetMonsterForm() {
    document.getElementById('reg-id').value = '';
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-ac').value = '';
    document.getElementById('reg-hp').value = '';
    document.getElementById('reg-image').value = '';
    document.getElementById('reg-actions').value = '';
    const btn = document.getElementById('btn-save-mob');
    btn.innerText = "SALVAR NO BESTIÁRIO";
    btn.style.background = "#27ae60";
}

// --- LOGICA DE INICIATIVA ---

window.addCombatant = function(mobData = null) {
    const nameInput = document.getElementById('init-name');
    const valInput = document.getElementById('init-value');
    
    const name = mobData ? mobData.name : nameInput.value;
    const value = parseInt(valInput.value) || 0;

    if (!name) return alert("Informe um nome!");

    combatants.push({
        name: name,
        value: value,
        ac: mobData ? mobData.ac : "",
        hp: mobData ? mobData.hp : "",
        actions: mobData ? mobData.actions : ""
    });

    saveAndRefreshInitiative();
};

window.updateCombatant = function(index, field, value) {
    combatants[index][field] = value;
    localStorage.setItem('my_combat_initiative', JSON.stringify(combatants));
};

window.sortInitiative = function() {
    combatants.sort((a, b) => b.value - a.value);
    saveAndRefreshInitiative();
};

window.clearInitiative = function() {
    askConfirmation("Limpar toda a ordem de iniciativa?", () => {
        combatants = [];
        saveAndRefreshInitiative();
    });
};

window.removeCombatant = function(index) {
    combatants.splice(index, 1);
    saveAndRefreshInitiative();
};

function saveAndRefreshInitiative() {
    localStorage.setItem('my_combat_initiative', JSON.stringify(combatants));
    renderInitiative();
    document.getElementById('init-name').value = '';
    document.getElementById('init-value').value = '';
}

window.renderInitiative = function() {
    const list = document.getElementById('init-list');
    if (!list) return;

    list.innerHTML = combatants.map((c, i) => `
        <div class="sheet-block" style="margin-bottom:10px; border-left: 4px solid #2980b9; background: #222; padding: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <input type="number" value="${c.value}" onchange="updateCombatant(${i}, 'value', this.value)" style="width:45px; background:#000; border:1px solid #444; color:#00ff00; font-weight:bold; text-align:center;">
                <strong style="flex-grow:1; margin-left:10px; font-size: 14px;">${c.name}</strong>
                <button onclick="removeCombatant(${i})" style="background:none; border:none; color:#e74c3c; cursor:pointer;">✕</button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div><label style="font-size:10px; color:#888;">CA</label><input type="text" value="${c.ac}" onchange="updateCombatant(${i}, 'ac', this.value)" style="width:100%; background:#111; border:1px solid #333; color:white; padding:2px 5px;"></div>
                <div><label style="font-size:10px; color:#888;">HP</label><input type="text" value="${c.hp}" onchange="updateCombatant(${i}, 'hp', this.value)" style="width:100%; background:#111; border:1px solid #333; color:white; padding:2px 5px;"></div>
            </div>
            <div style="margin-top:8px;">
                <textarea onchange="updateCombatant(${i}, 'actions', this.value)" placeholder="Ações..." style="width:100%; height:35px; background:#111; border:1px solid #333; color:#aaa; font-size:11px; padding:5px;">${c.actions}</textarea>
            </div>
        </div>
    `).join('');
};

// --- BUSCA E RENDERIZAÇÃO ---

window.renderBestiary = function(filter = "") {
    const resultsList = document.getElementById('search-results-list');
    if (!resultsList) return;

    const mobsToShow = filter 
        ? localBestiary.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
        : localBestiary;

    resultsList.innerHTML = mobsToShow.map(m => `
        <div class="skill-item" style="cursor:pointer; background:#2a2a2a; margin-bottom:5px; padding:8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
            <span onclick="showMonsterDetail('${m.name}')" style="flex-grow:1;">🐉 ${m.name} <small style="color:#888;">(CA: ${m.ac})</small></span>
            <button onclick="deleteFromBestiary('${m.name}')" style="background:none; border:none; color:#c0392b; cursor:pointer; padding:5px;">✕</button>
        </div>
    `).join('');
};

window.deleteFromBestiary = function(name) {
    askConfirmation(`Remover ${name} permanentemente?`, () => {
        localBestiary = localBestiary.filter(m => m.name !== name);
        localStorage.setItem('my_local_bestiary', JSON.stringify(localBestiary));
        renderBestiary();
        document.getElementById('monster-display').style.display = 'none';
    });
};

window.searchMonster = function() {
    renderBestiary(document.getElementById('monster-search').value);
};

// --- EVENTOS INICIAIS ---
document.addEventListener('DOMContentLoaded', () => {
    // Configura botão de confirmação do modal se existir
    const btnYes = document.getElementById('confirm-yes');
    if (btnYes) {
        btnYes.onclick = () => {
            if (confirmCallback) confirmCallback();
            closeConfirmModal();
        };
    }
    
    renderBestiary();
    renderInitiative();
});