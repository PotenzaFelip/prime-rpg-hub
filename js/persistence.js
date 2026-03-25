export const Persistence = {
    save() {
        const data = {};
        document.querySelectorAll('input, textarea').forEach(el => {
            if (el.id) {
                data[el.id] = el.type === 'checkbox' ? el.checked : el.value;
            }
        });
        localStorage.setItem('rpg_suite_pro_data', JSON.stringify(data));
        console.log("Dados salvos automaticamente.");
    },

    load() {
        const saved = localStorage.getItem('rpg_suite_pro_data');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox') el.checked = data[id];
                    else el.value = data[id];
                }
            });
        }
    }
};