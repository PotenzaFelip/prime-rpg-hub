# 🎲 RPG Dice Roller 3D

Um simulador de dados 3D de alta performance desenvolvido para mestres e jogadores de RPG. O projeto utiliza física realista e renderização acelerada por hardware para proporcionar uma experiência imersiva diretamente no navegador.

![GitHub License](https://img.shields.io/github/license/PotenzaFelip/dice-roller-rpg)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)

## 🚀 Funcionalidades

- **Física Realista:** Utiliza o motor `Cannon.js` para colisões, gravidade e rotações autênticas.
- **Gráficos 3D:** Renderização via `Three.js` com suporte a luzes dinâmicas e sombras.
- **Histórico Automático:** Painel lateral que registra todas as rolagens e calcula a soma total automaticamente.
- **Ajustes Dinâmicos (Menu Hambúrguer):**
  - Controle de Gravidade.
  - Ajuste de Impulso (Força do lançamento).
  - Configuração de Damping (Frenagem do giro).
  - Botão de Reset para padrões de fábrica.
- **Sprites de Leitura:** Exibição clara do resultado acima de cada dado após a parada.
- **Responsivo:** Interface otimizada para Desktop e Mobile.

## 🛠️ Tecnologias Utilizadas

- [Three.js](https://threejs.org/): Renderização da cena 3D e geometrias dos dados (D4, D6, D8, D10, D12, D20).
- [Cannon.js](https://github.com/schteppe/cannon.js): Simulação física de corpos rígidos.
- [HTML5/CSS3](https://developer.mozilla.org/pt-BR/docs/Web/HTML): Estruturação da UI e animações de interface.
- [JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript): Lógica de controle, cálculos de soma e manipulação do DOM.

## 🎮 Como Usar

1. **Rolar Dados:** Clique nos botões coloridos na parte inferior para adicionar dados à mesa.
2. **Rolar Mesa:** Use o botão "ROLAR MESA" para relançar todos os dados presentes com força aleatória.
3. **Histórico:** Veja o somatório no canto superior esquerdo. Use "LIMPAR CHAT" para reiniciar o log.
4. **Configurações:** Clique no ícone ☰ no canto superior direito para ajustar a física conforme sua preferência.
