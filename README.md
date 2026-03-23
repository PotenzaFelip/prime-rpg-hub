# 🎲 Mesa de RPG Virtual - 3D Dice Roller & Sheet

Uma aplicação web completa e leve para jogadores e mestres de RPG. Conta com um simulador de dados 3D com física realista, ficha de personagem editável e diário de campanha, tudo com salvamento automático local.

![Versão](https://img.shields.io/badge/version-1.2.0-blue)
![GitHub License](https://img.shields.io/github/license/PotenzaFelip/dice-roller-rpg)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)

## 🚀 Funcionalidades

* **Simulador de Dados 3D:** Rolagens realistas de D4, D6, D8, D10, D12 e D20 usando `Three.js` e `Cannon.js`.
* **Física Avançada:** Colisões reais, barreiras invisíveis na mesa e detecção inteligente de resultados.
* **Histórico de Rolagens:** Log detalhado com a soma total de todos os dados na mesa.
* **Ficha de Personagem:** Gerenciamento de atributos (FOR, DES, CON, etc.) e inventário.
* **Diário de Campanha:** Espaço dedicado para anotações de sessões.
* **Persistência de Dados (Auto-Save):** Todos os dados da ficha e do diário são salvos no `localStorage` do navegador — nunca perca seu progresso ao dar F5.
* **Interface Responsiva:** Navegação lateral intuitiva para alternar entre dados, ficha e notas.

## 🛠️ Tecnologias Utilizadas

* **Three.js:** Renderização 3D de alta performance.
* **Cannon.js:** Motor de física para gravidade e colisões.
* **JavaScript (ES6+):** Lógica de aplicação e manipulação de DOM.
* **HTML5/CSS3:** Estrutura e estilização moderna (Dark Mode).

## 📦 Como usar

Não é necessário instalar nada. Basta abrir o arquivo `index.html` em qualquer navegador moderno ou acessar via GitHub Pages.

1.  Clone o repositório:
    ```bash
    git clone https://github.com/PotenzaFelip/dice-roller-rpg.git
    ```
2.  Abra o arquivo `index.html`.

## ⚙️ Customização

No menu de configurações (ícone ☰), você pode ajustar:
* **Gravidade:** Altere a velocidade de queda dos dados.
* **Impulso:** Ajuste a força com que os dados são lançados.
* **Atrito:** Controle o quanto os dados rolam antes de parar.

---
Desenvolvido por PotenzaFelip
