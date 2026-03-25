# 🎲 RPG Hub - 3D Dice Roller, Sheet & Combat Tracker

Uma aplicação web completa, leve e expansível para jogadores e mestres de RPG. O **RPG Hub** combina um simulador de dados 3D realista com ferramentas de gestão de campanha, incluindo um Bestiário customizável e rastreador de iniciativa.

![Versão](https://img.shields.io/badge/version-1.5.0-blue)
![GitHub License](https://img.shields.io/github/license/PotenzaFelip/dice-roller-rpg)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)

## 🚀 Funcionalidades Principais

* **🎲 Simulador de Dados 3D:** Rolagens realistas (D4 a D100) usando `Three.js` e `Cannon.js` com detecção inteligente de resultados.
* **⚔️ Combat Tracker:** Sistema de ordem de iniciativa integrado para mestres, com controle de CA, HP e Ações em tempo real.
* **🐉 Bestiário Personalizável:** Banco de dados de monstros com suporte a **URLs de imagens externas**. Cadastre, edite e adicione monstros diretamente ao combate.
* **📜 Ficha de Personagem:** Gerenciamento completo de atributos, perícias e inventário com interface Dark Mode.
* **📝 Diário de Campanha:** Espaço para anotações de sessão com salvamento automático.


## 🛠️ Tecnologias Utilizadas

* **Three.js & Cannon.js:** Renderização 3D e motor de física para colisões e gravidade.
* **JavaScript (ES6+):** Lógica modular para manipulação de DOM e persistência.
* **HTML5/CSS3:** Estrutura responsiva com design focado em usabilidade durante o jogo.

## 📦 Como Usar

O projeto é "plug-and-play" e não requer Node.js. No entanto, por utilizar **JavaScript Modules (ESM)**, o navegador exige que o projeto seja executado através de um servidor local para carregar os scripts corretamente.

1.  **Acesse o link oficial:** [RPG HUB](https://potenzafelip.github.io/prime-rpg-hub/)
2.  **Ou rode localmente:**
    
    * **Opção A (VS Code - Recomendada):** Instale a extensão **Live Server**, abra a pasta do projeto e clique em "Go Live" no canto inferior direito.
    * **Opção B (Python):** Se tiver Python instalado, abra o terminal na pasta e digite:
        ```bash
        # Python 3.x
        python -m http.server 8080
        ```
    * **Opção C (Node/NPX):** Se tiver Node.js:
        ```bash
        npx serve .
        ```
    Após iniciar qualquer uma das opções, acesse `http://localhost:8080` no seu navegador.

## ⚙️ Customização de Mesa

No menu lateral, você pode ajustar as constantes de física:
* **Impulso:** Força do lançamento.
* **Gravidade:** Velocidade de queda.
* **Resistência:** O quanto o dado "quica" ou desliza na mesa.


<br>

---

<br>


> [!WARNING]
> ### ⚠️ Aviso Legal (Legal Disclaimer)
> Este projeto foi desenvolvido exclusivamente para fins de entretenimento e automação de mesas de RPG.
> 
> * **Imagens:** O sistema permite que o usuário utilize URLs de imagens externas. O autor do projeto **não hospeda nem distribui** arquivos protegidos por direitos autorais. A responsabilidade pelo conteúdo visual inserido via URL é inteira do usuário final.
> * **Conteúdo:** Dados de monstros baseados no SRD 5.1 (*System Reference Document*) sob a licença **OGL**.

<br>

---
Desenvolvido com ⚔️ por [PotenzaFelip](https://github.com/PotenzaFelip)
