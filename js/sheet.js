import { Persistence } from './persistence.js';

export const Sheet = {
    calcMod(val) {
        return Math.floor((val - 10) / 2);
    },

    updateMods() {
        const attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        attrs.forEach(attr => {
            const input = document.getElementById(attr);
            const display = document.getElementById(`${attr}-mod`);
            if (input && display) {
                const mod = this.calcMod(parseInt(input.value) || 10);
                display.innerText = mod >= 0 ? `+${mod}` : mod;
            }
        });
    }
};

// Escuta mudanças nos atributos para atualizar os modificadores na hora
document.addEventListener('input', (e) => {
    const attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    if (attrs.includes(e.target.id)) {
        Sheet.updateMods();
    }
});

// Calcula ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Sheet.updateMods(), 100); 
});