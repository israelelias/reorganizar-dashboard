(() => {

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
   * 🔍 FUNÇÕES DE UTILIDADE
   * ---------------------------*/

  const $ = (selector) => document.querySelector(selector);

  const swapContent = (sourceSel, targetSel) => {
    const source = $(sourceSel);
    const target = $(targetSel);
    if (!source || !target) {
      console.warn(`Elemento não encontrado: ${sourceSel} ou ${targetSel}`);
      return;
    }

    // Armazena o conteúdo do source
    const temp = target.innerHTML;
    target.innerHTML = source.innerHTML;
    source.innerHTML = temp;
  };

  const hideOrRemoveElements = () => {
    config.selectorsToHideOrRemove.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
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

  const injectCustomCSS = () => {
    const style = document.createElement('style');
    style.textContent = config.customCSS.trim();
    document.head.appendChild(style);
    console.log('🎨 CSS personalizado injetado.');
  };

  /** --------------------------
   * 🧠 EXECUÇÃO PRINCIPAL
   * ---------------------------*/
  const main = () => {
    console.log('🔧 Reorganizando conteúdo das divs...');

    // Rota do conteúdo:
    // right → left
    // left → center-top
    // center-top → right
    const contentLeft = $('.content-fixed.content-left');
    const contentCenterTop = $('.content-fixed.content-center-top');
    const contentRight = $('.content-fixed.content-right');

    if (!contentLeft || !contentCenterTop || !contentRight) {
      console.error('❌ Estrutura esperada não encontrada.');
      return;
    }

    const tempLeft = contentLeft.innerHTML;
    const tempCenter = contentCenterTop.innerHTML;
    const tempRight = contentRight.innerHTML;

    // Realoca os conteúdos
    contentLeft.innerHTML = tempRight;
    contentCenterTop.innerHTML = tempLeft;
    contentRight.innerHTML = tempCenter;

    console.log('✅ Conteúdos realocados com sucesso.');

    hideOrRemoveElements();
    injectCustomCSS();

    console.log('✨ Script executado com sucesso!');
  };

  /** --------------------------
   * 🚀 INICIALIZAÇÃO
   * ---------------------------*/
  try {
    main();
  } catch (err) {
    console.error('⚠️ Erro ao executar o snippet:', err);
  }
})();
