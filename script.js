let swiperInstance;

// Selecionando as imagens e o contêiner de paginação
const images = document.querySelectorAll('#carousel img');
const pagination = document.querySelector('#pagination');
const carousel = document.querySelector('#carousel');

// Debugando para verificar os elementos na página
console.log('Inicializando script...');

// Função para aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado completamente');
  
  // Adicionando elementos para funcionalidade de like e salvar
  const likeButton = document.querySelector('.social .inter div button:first-child');
  const shareButton = document.querySelector('.social .inter div button:nth-child(3)');
  const bookmarkButton = document.querySelector('.social .inter > button'); // Seletor mais específico
  const likesCountElement = document.querySelector('.social p:first-of-type');
  
  // Verificando se os elementos foram encontrados corretamente
  console.log('Like button:', likeButton);
  console.log('Share button:', shareButton);
  console.log('Bookmark button:', bookmarkButton);
  
  // Variáveis para controlar o estado de curtida e salvamento
  let isLiked = false;
  let isSaved = false;
  let likesCount = 57; // Valor inicial baseado no HTML

  /**
   * Toggle da funcionalidade de like (curtida)
   */
  function toggleLike() {
    console.log('Toggle like acionado');
    isLiked = !isLiked;
    
    // Atualiza o ícone do coração
    if (isLiked) {
      likeButton.innerHTML = '<i class="ri-heart-fill" style="color: #ff3366;"></i>';
      likesCount++;
    } else {
      likeButton.innerHTML = '<i class="ri-heart-line"></i>';
      likesCount--;
    }
    
    // Atualiza o contador de curtidas
    likesCountElement.textContent = `${likesCount.toLocaleString()} likes`;
    
    // Efeito de animação no botão de curtir
    likeButton.classList.add('pulse');
    setTimeout(() => {
      likeButton.classList.remove('pulse');
    }, 300);
  }

  /**
   * Toggle da funcionalidade de salvar
   */
  function toggleSave() {
    console.log('Toggle save acionado');
    isSaved = !isSaved;
    
    // Atualiza o ícone de salvar
    if (isSaved) {
      bookmarkButton.innerHTML = '<i class="ri-bookmark-fill" style="color: #fff;"></i>';
    } else {
      bookmarkButton.innerHTML = '<i class="ri-bookmark-line"></i>';
    }
    
    // Efeito de animação no botão de salvar
    bookmarkButton.classList.add('pulse');
    setTimeout(() => {
      bookmarkButton.classList.remove('pulse');
    }, 300);
  }

  // Adiciona eventos de clique aos botões
  if (likeButton) {
    likeButton.addEventListener('click', toggleLike);
  }
  
  if (bookmarkButton) {
    bookmarkButton.addEventListener('click', toggleSave);
  }
  
  // Prevenir comportamentos indesejados nos outros botões
  const commentButton = document.querySelector('.social .inter div button:nth-child(2)');
  
  if (commentButton) {
    commentButton.addEventListener('click', (e) => {
      console.log('Comentário clicado');
    });
  }
  
  if (shareButton) {
    shareButton.addEventListener('click', (e) => {
      console.log('Compartilhar clicado');
    });
  }

  // Adiciona funcionalidade de curtida dupla clicando na imagem
  images.forEach(img => {
    img.addEventListener('dblclick', () => {
      console.log('Duplo clique na imagem');
      // Se ainda não estiver curtido, dá like
      if (!isLiked) {
        toggleLike();
        
        // Mostra animação de coração
        showHeartAnimation(img);
      }
    });
  });

  /**
   * Mostra uma animação de coração ao dar duplo clique na imagem
   */
  function showHeartAnimation(img) {
    // Cria um elemento de coração para animação
    const heart = document.createElement('div');
    heart.classList.add('heart-animation');
    heart.innerHTML = '<i class="ri-heart-fill"></i>';
    
    // Posiciona o coração no centro da imagem
    const imgRect = img.getBoundingClientRect();
    heart.style.top = `${imgRect.top + imgRect.height/2 - 40}px`;
    heart.style.left = `${imgRect.left + imgRect.width/2 - 40}px`;
    
    // Adiciona ao DOM
    document.body.appendChild(heart);
    
    // Remove o coração após a animação
    setTimeout(() => {
      heart.remove();
    }, 1000);
  }
});

/**
 * Cria marcadores de paginação usando a Scroll-driven Animations API
 * Cada imagem tem sua própria timeline e o botão correspondente usa essa timeline
 */
function createPaginationMarkers() {
  images.forEach((img, index) => {
    // Usa o ID da imagem ou cria um ID se não existir
    const imgId = img.id || `img-${index}`;
    const imgViewName = `--${imgId}`;
    
    // Define o nome da timeline de visualização para a imagem
    img.style.viewTimelineName = imgViewName;
    
    // Cria o botão marcador para a paginação
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.role = 'tab';
    marker.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    marker.style.animationTimeline = imgViewName;
    
    // Adiciona evento de clique para rolar para a imagem correspondente
    marker.addEventListener('click', () => {
      img.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    });
    
    // Adiciona o marcador à paginação
    pagination.appendChild(marker);
  });

  // Define o escopo da timeline no body para todas as imagens
  try {
    document.body.style.timelineScope = `${Array.from(images)
      .map(image => image.style.viewTimelineName)
      .join(' ')}`;
  } catch (error) {
    console.warn('Configuração de timelineScope não suportada:', error);
  }

  // Adiciona evento de rolagem para atualizar visualmente os marcadores em navegadores
  // onde as animações CSS podem não refletir perfeitamente o estado de rolagem
  carousel.addEventListener('scroll', updateVisualMarkers);
}

/**
 * Atualiza visualmente os marcadores com base na posição atual de rolagem
 * Isso complementa as animações CSS para garantir consistência
 */
function updateVisualMarkers() {
  const scrollPosition = carousel.scrollLeft;
  const slideWidth = carousel.querySelector('img').offsetWidth;
  const currentSlide = Math.round(scrollPosition / slideWidth);
  
  // Atualiza a aparência dos marcadores
  const markers = pagination.querySelectorAll('button');
  markers.forEach((marker, index) => {
    if (index === currentSlide) {
      marker.classList.add('active');
      marker.style.scale = '1';
      marker.style.backgroundColor = 'white';
    } else {
      marker.classList.remove('active');
      // Permitindo que a animação CSS original controle a aparência
      // quando não é o slide ativo
    }
  });
}

/**
 * Cria navegação alternativa para navegadores que não suportam Scroll-driven Animations
 */
function createFallbackNavigation() {
  images.forEach((img, index) => {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.role = 'tab';
    marker.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    
    // Adiciona evento de clique para rolar para a imagem correspondente
    marker.addEventListener('click', () => {
      carousel.scrollTo({
        left: index * img.offsetWidth,
        behavior: 'smooth'
      });
    });
    
    pagination.appendChild(marker);
  });
  
  // Adiciona evento de rolagem para atualizar os marcadores
  carousel.addEventListener('scroll', updateVisualMarkers);
}

// Verifica o suporte do navegador para Scroll-driven Animations
if (CSS.supports('view-timeline-axis', 'inline')) {
  createPaginationMarkers();
} else {
  console.log('Navegador não suporta Scroll-driven Animations, usando fallback');
  createFallbackNavigation();
}

// Inicia rolando para a primeira imagem
setTimeout(() => {
  images[0].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}, 100);

document.addEventListener('DOMContentLoaded', function () {
  // Seletores para o modal de comentários
  const commentButton = document.querySelector('.social .inter div button:nth-child(2)');
  const modalOverlay = document.getElementById('comments-modal-overlay');
  const closeModalButton = document.getElementById('close-modal');
  const commentInput = document.getElementById('comment-input');
  const postCommentButton = document.getElementById('post-comment');
  const commentsContainer = document.querySelector('.comments-container');

  // Array para armazenar todos os comentários (existentes + novos)
  let allComments = [];

  // Carregar comentários salvos do localStorage quando a página carrega
  loadCommentsFromLocalStorage();

  // Função para criar elemento de comentário a partir de um objeto de comentário
  function createCommentElement(commentObj) {
    // Criar elementos do comentário
    const comment = document.createElement('div');
    comment.className = 'comment';

    // Determinar se é um comentário do usuário (para mostrar opções de exclusão)
    const deleteOption = commentObj.isUserComment ?
      '<span class="delete-comment" style="color: #f13b3b;">Excluir</span>' : '';

    // HTML do comentário
    comment.innerHTML = `
      <img src="${commentObj.avatar}" alt="Avatar" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-username">${commentObj.username}</div>
        <div class="comment-text">${commentObj.text}</div>
        <div class="comment-actions">
          <span>${commentObj.time}</span>
          <span class="like-action">Curtir</span>
          <span class="reply-action">Responder</span>
          ${deleteOption}
        </div>
      </div>
    `;

    // Adicionar o comentário ao início ou fim da lista, dependendo se é do usuário
    if (commentObj.isUserComment) {
      commentsContainer.insertBefore(comment, commentsContainer.firstChild);
    } else {
      commentsContainer.appendChild(comment);
    }

    // Adicionar eventos de clique para opções de comentário
    if (commentObj.isUserComment) {
      const deleteButton = comment.querySelector('.delete-comment');
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          // Remove o comentário do DOM
          comment.remove();
          // Remove o comentário do array
          const index = allComments.findIndex(c =>
            c.text === commentObj.text &&
            c.time === commentObj.time &&
            c.isUserComment === true);

          if (index !== -1) {
            allComments.splice(index, 1);
            // Salva os comentários atualizados
            saveCommentsToLocalStorage();
          }
        });
      }
    }

    // Adicionar funcionalidade para curtir
    const likeButton = comment.querySelector('.like-action');
    if (likeButton) {
      likeButton.addEventListener('click', () => {
        if (likeButton.style.color === 'rgb(237, 73, 86)') {
          likeButton.style.color = '';
          likeButton.textContent = 'Curtir';
        } else {
          likeButton.style.color = 'rgb(237, 73, 86)';
          likeButton.textContent = 'Curtido';
        }
      });
    }

    // Adicionar funcionalidade para responder
    const replyButton = comment.querySelector('.reply-action');
    if (replyButton) {
      replyButton.addEventListener('click', () => {
        const username = comment.querySelector('.comment-username').textContent;
        commentInput.value = `@${username} `;
        commentInput.focus();
        
        // Abrir o modal de comentários se estiver fechado
        if (!modalOverlay.classList.contains('active')) {
          modalOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        
        // Habilitar o botão de publicar
        postCommentButton.disabled = false;
      });
    }
    
    return comment;
  }

  // Função para carregar comentários do localStorage
  function loadCommentsFromLocalStorage() {
    // Tentar obter comentários salvos
    const savedComments = localStorage.getItem('userComments');

    // Guarda todos os comentários iniciais já existentes no HTML
    const initialComments = Array.from(commentsContainer.querySelectorAll('.comment')).map(comment => {
      const username = comment.querySelector('.comment-username').textContent;
      const text = comment.querySelector('.comment-text').textContent;
      const timeStr = comment.querySelector('.comment-actions span:first-child').textContent;
      const avatar = comment.querySelector('.comment-avatar').src;

      return {
        username: username,
        text: text,
        time: timeStr,
        avatar: avatar,
        isUserComment: false // Marca como comentário pré-existente
      };
    });

    // Se houver comentários salvos, adicione-os ao container
    if (savedComments) {
      // Converte string JSON para array de objetos
      const userComments = JSON.parse(savedComments);

      // Combina comentários iniciais com os comentários do usuário salvos
      allComments = [...initialComments, ...userComments];
    } else {
      // Se não houver comentários salvos, guarda apenas os comentários iniciais
      allComments = [...initialComments];
    }

    // Limpa o container e exibe todos os comentários
    commentsContainer.innerHTML = '';
    
    // Adiciona todos os comentários ao container
    allComments.forEach(comment => {
      createCommentElement(comment);
    });
  }

  // Função para salvar comentários no localStorage
  function saveCommentsToLocalStorage() {
    // Filtra apenas os comentários do usuário
    const userComments = allComments.filter(comment => comment.isUserComment);

    // Salva no localStorage como string JSON
    localStorage.setItem('userComments', JSON.stringify(userComments));
  }

  // Abrir o modal ao clicar no botão de comentários
  if (commentButton) {
    commentButton.addEventListener('click', () => {
      console.log('Abrindo modal de comentários');
      modalOverlay.classList.add('active');
      // Impedir o scroll da página
      document.body.style.overflow = 'hidden';
      // Focar no campo de input
      setTimeout(() => {
        commentInput.focus();
      }, 300);
    });
  }

  // Fechar o modal ao clicar no botão de fechar
  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      closeCommentsModal();
    });
  }

  // Fechar o modal ao clicar fora dele
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      // Verifica se o clique foi no overlay e não no conteúdo do modal
      if (e.target === modalOverlay) {
        closeCommentsModal();
      }
    });
  }

  // Função para fechar o modal
  function closeCommentsModal() {
    modalOverlay.classList.remove('active');
    // Restaurar o scroll da página
    document.body.style.overflow = '';
    // ADICIONADO: Reabilitar o Swiper quando o modal for fechado
    if (typeof swiper !== 'undefined') {
      // Reabilitar o mousewheel e touchmove do Swiper
      swiper.mousewheel.enable();
      swiper.allowTouchMove = true;
      console.log('Swiper reabilitado');
    }
    // Limpar o campo de input
    commentInput.value = '';
    postCommentButton.disabled = true;
  }

  // Evitar propagação de eventos de scroll do modal para o Swiper
  // ADICIONADO: Este bloco inteiro
  const commentsModal = document.querySelector('.comments-modal');
  if (commentsModal) {
    commentsModal.addEventListener('wheel', function(e) {
      e.stopPropagation();
    }, { passive: false });
    
    commentsModal.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    }, { passive: false });
    
    // Adicionar listener para a área de comentários para impedir o scroll do swiper
    const commentsContainer = document.querySelector('.comments-container');
    if (commentsContainer) {
      commentsContainer.addEventListener('wheel', function(e) {
        e.stopPropagation();
      }, { passive: false });
      
      commentsContainer.addEventListener('touchmove', function(e) {
        e.stopPropagation();
      }, { passive: false });
    }
  }

  // Habilitar/desabilitar o botão de publicar com base no conteúdo do input
  if (commentInput) {
    commentInput.addEventListener('input', () => {
      postCommentButton.disabled = !commentInput.value.trim();
    });

    // Permitir enviar comentário com Enter
    commentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && commentInput.value.trim()) {
        addNewComment();
      }
    });
  }

  // Adicionar um novo comentário ao clicar em "Publicar"
  if (postCommentButton) {
    postCommentButton.addEventListener('click', () => {
      addNewComment();
    });
  }

  // Função para adicionar um novo comentário
  function addNewComment() {
    if (!commentInput.value.trim()) return;

    // Criar dados do comentário
    const now = new Date();
    const timeString = 'agora mesmo';
    const avatarSrc = "images/isa.jpg";

    // Criar objeto de comentário
    const newComment = {
      username: 'você',
      text: commentInput.value,
      time: timeString,
      avatar: "images/isa.jpg",
      isUserComment: true
    };

    // Adicionar ao array de comentários
    allComments.unshift(newComment);

    // Criar e adicionar o elemento DOM
    const commentElement = createCommentElement(newComment);

    // Salvar comentários atualizados
    saveCommentsToLocalStorage();

    // Limpar o input e desabilitar o botão
    commentInput.value = '';
    postCommentButton.disabled = true;

    // Aplicar efeito de destaque no novo comentário
    commentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    setTimeout(() => {
      commentElement.style.transition = 'background-color 0.5s ease';
      commentElement.style.backgroundColor = '';
    }, 50);

    // Focar no input para facilitar novos comentários
    commentInput.focus();
  }

  // Função para limpar todos os comentários do usuário (opcional)
  function clearAllUserComments() {
    // Filtra apenas comentários pré-existentes
    allComments = allComments.filter(comment => !comment.isUserComment);
    // Limpa localStorage
    localStorage.removeItem('userComments');
    // Recarrega comentários
    commentsContainer.innerHTML = '';
    allComments.forEach(comment => {
      createCommentElement(comment);
    });
  }

  // Se quiser um botão para limpar todos os comentários, pode adicionar:
  // const clearButton = document.createElement('button');
  // clearButton.textContent = 'Limpar meus comentários';
  // clearButton.addEventListener('click', clearAllUserComments);
  // document.querySelector('.modal-header').appendChild(clearButton);
});

document.addEventListener('DOMContentLoaded', function() {
  // Criar o overlay de carregamento via JavaScript se ele não existir no HTML
  let loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.className = 'loading-overlay';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    loadingOverlay.appendChild(spinner);
    
    document.body.insertBefore(loadingOverlay, document.body.firstChild);
    
    // Adicionar o CSS necessário se ainda não existir
    const style = document.createElement('style');
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top:.0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.5s ease;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Verificar se há um slide salvo
  const savedIndex = localStorage.getItem('swiperActiveIndex');
  
  // Referência ao elemento container do Swiper
  const swiperContainer = document.querySelector('.swiper');
  
  // Esconder o Swiper inicialmente em todos os casos
  swiperContainer.style.opacity = '0';
  
  // Esconder o logo inicialmente até determinarmos se ele deve estar visível
  const logo = document.querySelector('.logo');
  logo.style.opacity = '0';
  logo.style.transition = 'none'; // Desativar a transição inicialmente
  
  // Função para configurar o controle do logo
  function setupLogoControl(swiper) {
    setTimeout(() => {
      // Restabelecer a transição do logo
      logo.style.transition = 'opacity 0.5s ease';
      
      // Controle inicial do logo baseado no slide atual
      if (swiper.activeIndex === 0) {
        gsap.to(logo, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
      } else {
        gsap.to(logo, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
      }
      
      // Adicionar evento slideChange para controlar a visibilidade do logo
      swiper.on('slideChange', function () {
        if (swiper.activeIndex === 0) {
          gsap.to(logo, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
        } else {
          gsap.to(logo, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
        }
      });
    }, 50);
  }
  
  // Função para remover o overlay de carregamento
  function hideLoadingOverlay() {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }

  // Função para aplicar estilos específicos a cada slide
  function applySlideStyles(swiper) {
    // Se estiver no slide 2
    if (swiper.activeIndex === 1) {
      swiper.slides[1].style.backgroundColor = '#0b2b2b';
    }
    
    // Adicione aqui mais condições para outros slides se necessário
  }
  
  // Se houver um índice salvo
  if (savedIndex !== null) {
    // Inicializar Swiper com a opção init: false para não iniciar automaticamente
    var swiper = new Swiper(".swiper", {
      init: false, // Não inicializar automaticamente
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 30,
      mousewheel: true,
      effect: "coverflow",
      speed: 2000,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"> <span>' + String(index + 1).padStart(2, '0') + '</span></span>';
        },
      },
      on: {
        slideChange: function() {
          localStorage.setItem('swiperActiveIndex', swiper.activeIndex);
          applySlideStyles(swiper); // Aplicar estilos quando mudar o slide
        }
      }
    });
    
    // Inicializar no slide correto e mostrar depois
    swiper.on('init', function() {
      // Mover para o slide salvo sem animação
      swiper.slideTo(parseInt(savedIndex), 0, false);
      
      // Aguardar um tempo maior antes de mostrar o Swiper e configurar o logo
      setTimeout(function() {
        // Configurar o controle do logo
        setupLogoControl(swiper);
        
        // Aplicar estilos específicos aos slides após a inicialização
        applySlideStyles(swiper);
        
        // Mostrar o Swiper com uma transição suave
        swiperContainer.style.transition = 'opacity 800ms';
        swiperContainer.style.opacity = '1';
        
        // Remover o overlay de carregamento
        hideLoadingOverlay();
      }, 800); // Aumentado para 800ms
    });
    
    // Inicializar o Swiper manualmente
    swiper.init();
  } else {
    // Se não houver índice salvo, inicializar normalmente
    var swiper = new Swiper(".swiper", {
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 30,
      mousewheel: true,
      effect: "coverflow",
      speed: 2000,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"> <span>' + String(index + 1).padStart(2, '0') + '</span></span>';
        },
      },
      on: {
        slideChange: function() {
          localStorage.setItem('swiperActiveIndex', swiper.activeIndex);
          applySlideStyles(swiper); // Aplicar estilos quando mudar o slide
        },
        init: function() {
          // Aguardar um tempo antes de mostrar o Swiper e configurar o logo
          setTimeout(function() {
            // Configurar o controle do logo
            setupLogoControl(swiper);
            
            // Aplicar estilos específicos aos slides após a inicialização
            applySlideStyles(swiper);
            
            // Mostrar o Swiper com uma transição suave
            swiperContainer.style.transition = 'opacity 800ms';
            swiperContainer.style.opacity = '1';
            
            // Remover o overlay de carregamento
            hideLoadingOverlay();
          }, 800);
        }
      }
    });
  }
});

// Funcionalidade para o botão IMPORTANTE e modal
document.addEventListener('DOMContentLoaded', function() {
  const btnImportante = document.getElementById('btn-importante');
  const modal = document.getElementById('modal-explicacoes');
  const closeModal = document.querySelector('.close-modal');
  
  // Função para abrir o modal
  btnImportante.addEventListener('click', function() {
      console.log("Botão clicado!"); // Debug
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      
      setTimeout(() => {
          modal.classList.add('active');
      }, 10);
      
      // Animar a entrada do modal com GSAP
      gsap.to(".modal-content", {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
      });
  });
  
  // Função para fechar o modal ao clicar no X
  closeModal.addEventListener('click', function() {
      fecharModal();
  });
  
  // Fechar o modal ao clicar fora dele
  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          fecharModal();
      }
  });
  
  // Função para fechar o modal
  function fecharModal() {
      gsap.to(".modal-content", {
          scale: 0.8,
          duration: 0.2,
          ease: "power2.in"
      });
      
      modal.classList.remove('active');
      setTimeout(() => {
          modal.style.opacity = '0';
          modal.style.visibility = 'hidden';
          setTimeout(() => {
              modal.style.display = 'none';
          }, 300);
      }, 200);
  }
  
  // Garantir que o modal seja fechado ao mudar de slide
  swiper.on('slideChange', function() {
      modal.classList.remove('active');
      setTimeout(() => {
          modal.style.display = 'none';
      }, 300);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Garante que cada slide tenha suas propriedades independentes
  swiper.on('slideChange', function() {
      // Restaura as propriedades específicas do slide atual
      const activeSlide = swiper.slides[swiper.activeIndex];
      
      // Se estiver no slide 2
      if (swiper.activeIndex === 1) {
          // Restaurar propriedades específicas do slide 2
          activeSlide.style.backgroundColor = '#0b2b2b'; // Substituir pela cor original
      }
  });
});