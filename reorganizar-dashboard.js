(() => {
  /**
   * ============================================
   * 🚀 Snippet utilitário de reorganização visual
   * Autor: israel elias
   * Compatível com: Edge / Chrome / Firefox
   * ============================================
   * 
   * CORREÇÃO: Move elementos completos (preservando eventos)
   * ao invés de apenas copiar innerHTML
   */

  /** --------------------------
   * ⚙️ CONFIGURAÇÕES GERAIS
   * ---------------------------*/
  const config = {
    // Se true → remove elementos do DOM
    // Se false → apenas oculta via CSS
    removeElements: false,

    selectorsToHideOrRemove: [
      '.section.priorities-section',
      '.content-right-top'
    ],

    // Mapeamento de classes antigas → novas
    classMapping: {
      'content-left': 'content-right',
      'content-center-top': 'content-left',
      'content-right': 'content-center-top'
    },

    // CSS adicional que será injetado
    customCSS: `
      .growl-container {
        visibility: hidden !important;
      }

      .content-fixed.content-left {
        top: 55px;
        bottom: 0;
        left: 0;
        width: 210px;
      }

      .content-fixed.content-center-top {
        position: absolute;
        top: 55px;
        left: 210px;
        bottom: 0;
        right: 210px;
        width: 420px;
        padding: 0 5px;
      }

      .content-fixed.content-right {
        position: absolute;
        top: 55px;
        bottom: 0;
        right: 0;
        width: calc(100% - 630px);
      }
    `
  };

  /** --------------------------
   * 🔧 FUNÇÕES DE UTILIDADE
   * ---------------------------*/

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  /**
   * Atualiza a classe de posicionamento de um elemento
   * @param {HTMLElement} element - Elemento a ser atualizado
   * @param {string} oldClass - Classe antiga (ex: 'content-left')
   * @param {string} newClass - Nova classe (ex: 'content-right')
   */
  const updatePositionClass = (element, oldClass, newClass) => {
    if (!element) return;
    
    element.classList.remove(oldClass);
    element.classList.add(newClass);
    
    // Atualiza também no ng-class se existir
    const ngClass = element.getAttribute('ng-class');
    if (ngClass) {
      const updated = ngClass.replace(
        new RegExp(`content-${oldClass.split('-').pop()}`, 'g'),
        `content-${newClass.split('-').pop()}`
      );
      element.setAttribute('ng-class', updated);
    }
    
    console.log(`🔄 Classe atualizada: ${oldClass} → ${newClass}`);
  };

  /**
   * Move fisicamente o elemento no DOM (preserva eventos)
   * @param {HTMLElement} element - Elemento a ser movido
   * @param {HTMLElement} targetParent - Novo pai
   * @param {HTMLElement} referenceNode - Nó de referência para inserção
   */
  const moveElement = (element, targetParent, referenceNode = null) => {
    if (!element || !targetParent) return;
    
    if (referenceNode) {
      targetParent.insertBefore(element, referenceNode);
    } else {
      targetParent.appendChild(element);
    }
  };

  /**
   * Oculta ou remove elementos do DOM
   */
  const hideOrRemoveElements = () => {
    config.selectorsToHideOrRemove.forEach((sel) => {
      $$(sel).forEach((el) => {
        if (config.removeElements) {
          el.remove();
          console.log(`🗑️ Removido: ${sel}`);
        } else {
          el.style.visibility = 'hidden';
          el.style.display = 'none';
          console.log(`🙈 Ocultado: ${sel}`);
        }
      });
    });
  };

  /**
   * Injeta CSS customizado no head
   */
  const injectCustomCSS = () => {
    const styleId = 'dashboard-reorganizer-styles';
    
    // Remove estilo anterior se existir
    const existingStyle = $(`#${styleId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = config.customCSS.trim();
    document.head.appendChild(style);
    console.log('🎨 CSS personalizado injetado.');
  };

  /**
   * Reorganiza os elementos do dashboard
   * Move elementos completos (não apenas innerHTML)
   */
  const reorganizeDashboard = () => {
    console.log('🔧 Reorganizando elementos do dashboard...');

    // Seleciona os elementos principais
    const contentLeft = $('.content-fixed.content-left');
    const contentCenterTop = $('.content-fixed.content-center-top');
    const contentRight = $('.content-fixed.content-right');

    if (!contentLeft || !contentCenterTop || !contentRight) {
      console.error('❌ Estrutura esperada não encontrada.');
      return false;
    }

    // Pega o container pai
    const parentContainer = contentLeft.parentElement;
    
    if (!parentContainer) {
      console.error('❌ Container pai não encontrado.');
      return false;
    }

    // Extrai todo o conteúdo interno de cada elemento
    const leftContent = Array.from(contentLeft.children);
    const centerContent = Array.from(contentCenterTop.children);
    const rightContent = Array.from(contentRight.children);

    // Limpa os containers
    contentLeft.innerHTML = '';
    contentCenterTop.innerHTML = '';
    contentRight.innerHTML = '';

    // Rota de movimentação:
    // right → left
    // left → center-top  
    // center-top → right
    
    // Move conteúdo preservando elementos (e seus eventos)
    rightContent.forEach(child => contentLeft.appendChild(child));
    leftContent.forEach(child => contentCenterTop.appendChild(child));
    centerContent.forEach(child => contentRight.appendChild(child));

    // Atualiza as classes dos containers principais
    updatePositionClass(contentLeft, 'content-left', 'temp-class-marker-left');
    updatePositionClass(contentCenterTop, 'content-center-top', 'temp-class-marker-center');
    updatePositionClass(contentRight, 'content-right', 'temp-class-marker-right');

    // Segunda passagem: aplica as classes finais
    updatePositionClass(contentLeft, 'temp-class-marker-left', 'content-left');
    updatePositionClass(contentCenterTop, 'temp-class-marker-center', 'content-center-top');
    updatePositionClass(contentRight, 'temp-class-marker-right', 'content-right');

    console.log('✅ Elementos reorganizados com sucesso (eventos preservados).');
    return true;
  };

  /** --------------------------
   * 🧠 EXECUÇÃO PRINCIPAL
   * ---------------------------*/
  const main = () => {
    console.log('🚀 Iniciando reorganização do dashboard...');

    const success = reorganizeDashboard();
    
    if (success) {
      hideOrRemoveElements();
      injectCustomCSS();
      console.log('✨ Script executado com sucesso!');
    } else {
      console.error('⚠️ Falha na reorganização.');
    }
  };

  /** --------------------------
   * 🔄 FUNÇÃO DE RESTAURAÇÃO (OPCIONAL)
   * ---------------------------*/
  window.restaurarDashboard = () => {
    console.log('🔄 Restaurando dashboard ao estado original...');
    location.reload();
  };

  /** --------------------------
   * 🚀 INICIALIZAÇÃO
   * ---------------------------*/
  try {
    main();
    console.log('💡 Dica: Execute "restaurarDashboard()" no console para desfazer.');
  } catch (err) {
    console.error('⚠️ Erro ao executar o snippet:', err);
  }
})();
