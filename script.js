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
  let likesCount = 3802; // Valor inicial baseado no HTML

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

document.addEventListener('DOMContentLoaded', function() {
  // Seletores para o modal de comentários
  const commentButton = document.querySelector('.social .inter div button:nth-child(2)');
  const modalOverlay = document.getElementById('comments-modal-overlay');
  const closeModalButton = document.getElementById('close-modal');
  const commentInput = document.getElementById('comment-input');
  const postCommentButton = document.getElementById('post-comment');
  const commentsContainer = document.querySelector('.comments-container');
  
  // Abrir o modal ao clicar no botão de comentários
  if (commentButton) {
    commentButton.addEventListener('click', () => {
      console.log('Abrindo modal de comentários');
      modalOverlay.classList.add('active');
      // Impedir o scroll da página
      document.body.style.overflow = 'hidden';
      // ADICIONADO: Desabilitar o Swiper quando o modal estiver aberto
      if (typeof swiper !== 'undefined') {
        // Desabilitar o mousewheel e touchmove do Swiper
        swiper.mousewheel.disable();
        swiper.allowTouchMove = false;
        console.log('Swiper desabilitado');
      }
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
    
    // Criar elementos do comentário
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    // Data/hora atual para o comentário
    const now = new Date();
    const timeString = 'agora mesmo';
    
    // HTML do comentário
    comment.innerHTML = `
      <img src="img/pfp.jpeg" alt="Seu avatar" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-username">você</div>
        <div class="comment-text">${commentInput.value}</div>
        <div class="comment-actions">
          <span>${timeString}</span>
          <span>Curtir</span>
          <span>Responder</span>
        </div>
      </div>
    `;
    
    // Adicionar o comentário ao início da lista
    commentsContainer.insertBefore(comment, commentsContainer.firstChild);
    
    // Limpar o input e desabilitar o botão
    commentInput.value = '';
    postCommentButton.disabled = true;
    
    // Aplicar efeito de destaque no novo comentário
    comment.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    setTimeout(() => {
      comment.style.transition = 'background-color 0.5s ease';
      comment.style.backgroundColor = '';
    }, 50);
    
    // Focar no input para facilitar novos comentários
    commentInput.focus();
  }
  
  // Adicionar interação para os botões "Curtir" nos comentários
  document.addEventListener('click', (e) => {
    if (e.target.textContent === 'Curtir' && e.target.parentElement.classList.contains('comment-actions')) {
      if (e.target.style.color === 'rgb(237, 73, 86)') {
        e.target.style.color = '';
        e.target.textContent = 'Curtir';
      } else {
        e.target.style.color = 'rgb(237, 73, 86)';
        e.target.textContent = 'Curtido';
      }
    }
  });
  
  // Adicionar funcionalidade de resposta aos comentários
  document.addEventListener('click', (e) => {
    if (e.target.textContent === 'Responder' && e.target.parentElement.classList.contains('comment-actions')) {
      const username = e.target.parentElement.parentElement.querySelector('.comment-username').textContent;
      commentInput.value = `@${username} `;
      commentInput.focus();
      
      // Habilitar o botão de publicar
      postCommentButton.disabled = false;
      
      // Rolar para o campo de comentário
      document.querySelector('.add-comment').scrollIntoView({ behavior: 'smooth' });
    }
  });
});