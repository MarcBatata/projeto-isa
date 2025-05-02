// Selecionando as imagens e o contêiner de paginação
const images = document.querySelectorAll('#carousel img');
const pagination = document.querySelector('#pagination');
const carousel = document.querySelector('#carousel');

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