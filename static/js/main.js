// Bootstrap tooltip initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    console.log('Site loaded successfully with Bootstrap');
});

// Функция применения фильтров
function applyFilters() {
    const yearFrom = parseInt(document.getElementById('yearFrom').value) || 0;
    const yearTo = parseInt(document.getElementById('yearTo').value) || 9999;

    // Извлекаем числа из отформатированных полей цены
    const priceFromValue = extractNumbers(document.getElementById('priceFrom').value);
    const priceToValue = extractNumbers(document.getElementById('priceTo').value);

    const priceFrom = priceFromValue ? parseInt(priceFromValue) : 0;
    const priceTo = priceToValue ? parseInt(priceToValue) : Infinity;

    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

    // Получаем все карточки автомобилей
    const carCards = document.querySelectorAll('#carsGrid > div[data-year]');
    let visibleCount = 0;

    // Добавляем состояние загрузки
    const carsSection = document.querySelector('.cars-section');
    if (carsSection) {
        carsSection.classList.add('loading');
    }

    // Небольшая задержка для визуального эффекта
    setTimeout(() => {
        carCards.forEach(card => {
            let isVisible = true;

            // Фильтр по году
            const carYear = parseInt(card.dataset.year) || 0;
            if (carYear && (carYear < yearFrom || carYear > yearTo)) {
                isVisible = false;
            }

            // Фильтр по цене
            const carPrice = parseInt(extractNumbers(card.dataset.price)) || 0;
            if (carPrice && (carPrice < priceFrom || carPrice > priceTo)) {
                isVisible = false;
            }

            // Фильтр по поиску
            if (searchQuery) {
                const carTitle = (card.dataset.title || '').toLowerCase();
                if (!carTitle.includes(searchQuery)) {
                    isVisible = false;
                }
            }

            // Показать/скрыть карточку с анимацией
            if (isVisible) {
                card.style.display = 'block';
                card.classList.remove('d-none');
                card.style.animation = 'fadeInUp 0.4s ease-out forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('d-none');
            }
        });

        // Убираем состояние загрузки
        if (carsSection) {
            carsSection.classList.remove('loading');
        }

        // Обновляем счетчик результатов
        updateResultsCount(visibleCount);

        // Показываем сообщение, если ничего не найдено
        showNoResultsMessage(visibleCount === 0);
    }, 300);
}

// Функция очистки фильтров
function clearFilters() {
    document.getElementById('yearFrom').value = '';
    document.getElementById('yearTo').value = '';
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    document.getElementById('searchInput').value = '';

    // Показываем все карточки
    const carCards = document.querySelectorAll('#carsGrid > div');
    carCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('d-none');
        card.style.animation = 'fadeInUp 0.4s ease-out forwards';
    });

    updateResultsCount(carCards.length);
    showNoResultsMessage(false);
}

// Обновление счетчика результатов с улучшенным стилем
function updateResultsCount(count) {
    const counter = document.getElementById('resultsCount');
    const totalCars = document.querySelectorAll('#carsGrid > div').length;

    if (counter) {
        // Анимация обновления
        counter.style.transform = 'scale(0.8)';
        counter.style.opacity = '0.5';

        setTimeout(() => {
            counter.textContent = `Показано: ${count} из ${totalCars} автомобилей`;

            // Обновляем стиль в соответствии с дизайном сайта
            counter.className = count > 0
                ? 'results-badge badge bg-success text-white px-3 py-2'
                : 'results-badge badge bg-warning text-dark px-3 py-2';

            // Возвращаем нормальный размер
            counter.style.transform = 'scale(1)';
            counter.style.opacity = '1';
            counter.style.transition = 'all 0.3s ease';
        }, 150);
    }
}

// Показать/скрыть сообщение "Ничего не найдено" с улучшенным стилем
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('noResultsMessage');
    const carsGrid = document.getElementById('carsGrid');

    if (show && !noResultsDiv) {
        // Создаем стильное сообщение
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResultsMessage';
        noResultsDiv.className = 'no-results text-center py-5 mt-4';
        noResultsDiv.innerHTML = `
            <div class="bg-white rounded-4 shadow-sm p-5 mx-auto" style="max-width: 500px;">
                <div class="text-muted">
                    <i class="bi bi-search display-1 mb-4 opacity-25" style="color: var(--color-red);"></i>
                    <h4 class="fw-bold text-dark mb-3">Автомобили не найдены</h4>
                    <p class="mb-4">Попробуйте изменить параметры поиска или воспользуйтесь другими фильтрами</p>
                    <button class="btn btn-danger rounded-pill px-4 py-2" onclick="clearFilters()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Сбросить фильтры
                    </button>
                </div>
            </div>
        `;

        // Добавляем с анимацией
        noResultsDiv.style.opacity = '0';
        noResultsDiv.style.transform = 'translateY(20px)';
        document.querySelector('.cars-section').appendChild(noResultsDiv);

        setTimeout(() => {
            noResultsDiv.style.transition = 'all 0.4s ease-out';
            noResultsDiv.style.opacity = '1';
            noResultsDiv.style.transform = 'translateY(0)';
        }, 100);

    } else if (!show && noResultsDiv) {
        // Удаляем с анимацией
        noResultsDiv.style.transition = 'all 0.3s ease-out';
        noResultsDiv.style.opacity = '0';
        noResultsDiv.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            noResultsDiv.remove();
        }, 300);
    }
}

// Функции для форматирования цен
function formatNumberWithSpaces(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function extractNumbers(str) {
    return str.replace(/\D/g, '');
}

function formatPriceInput(input) {
    const cursorPosition = input.selectionStart;
    const numbers = extractNumbers(input.value);

    if (numbers === '') {
        input.value = '';
        return;
    }

    const formatted = formatNumberWithSpaces(numbers);
    const lengthDiff = formatted.length - input.value.length;

    input.value = formatted;

    const newCursorPosition = cursorPosition + lengthDiff;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
}

// Автоматический поиск при вводе
document.addEventListener('DOMContentLoaded', function() {
    // Форматирование полей цены
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPriceInput(this);
        });

        input.addEventListener('keydown', function(e) {
            const allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                'Home', 'End', 'Tab', 'Enter'
            ];

            if (allowedKeys.includes(e.key) ||
                (e.key >= '0' && e.key <= '9') ||
                (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v'))) {
                return true;
            }

            e.preventDefault();
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = extractNumbers(pastedText);

            if (numbers) {
                this.value = formatNumberWithSpaces(numbers);
            }
        });
    });

    // Поиск с debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(applyFilters, 300);
        });
    }

    // Enter для применения фильтров
    const filterInputs = document.querySelectorAll('#yearFrom, #yearTo, #priceFrom, #priceTo, #searchInput');
    filterInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    });

    // Инициализация счетчика
    const initialCount = document.querySelectorAll('#carsGrid > div[data-year]').length;
    updateResultsCount(initialCount);
});

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auto-hide alerts with improved styling
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-dismissible')) {
            // Добавляем стильную анимацию появления
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            alert.style.transition = 'all 0.4s ease-out';

            setTimeout(() => {
                alert.style.opacity = '1';
                alert.style.transform = 'translateY(0)';
            }, 100);

            // Автоматическое скрытие
            setTimeout(() => {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }, 400);
            }, 5000);
        }
    });
});

// Loading animation for images with improved styling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.transition = 'opacity 0.4s ease-out';
            this.style.opacity = '1';
        });

        // Add loading placeholder
        if (!img.complete) {
            img.style.opacity = '0.3';
            img.style.transition = 'opacity 0.4s ease-out';
        }
    });
});

// Глобальные переменные для галереи
let currentImageIndex = 0;
let galleryImages = [];
let isModalOpen = false;

// Инициализация галереи изображений
function initImageGallery() {
  // Собираем все изображения галереи
  const mainImage = document.getElementById('mainCarImage');
  const thumbnails = document.querySelectorAll('.thumbnail-image');

  if (!mainImage) return;

  // Создаем массив всех изображений (главное + миниатюры)
  galleryImages = [mainImage.src];
  thumbnails.forEach(thumb => {
    const imageSrc = thumb.src || thumb.dataset.image;
    if (imageSrc && !galleryImages.includes(imageSrc)) {
      galleryImages.push(imageSrc);
    }
  });

  // Обновляем счетчики
  updateImageCounter();
  updateModalImageCounter();

  // Добавляем обработчики для стрелок
  setupNavigationArrows();

  // Добавляем обработчики клавиатуры
  setupKeyboardNavigation();

  // Добавляем touch-события для мобильных
  setupTouchNavigation();

  // Обработчик модального окна
  setupModalHandlers();
}

// Функция смены главного изображения
function changeMainImage(src, updateIndex = true) {
  const mainImage = document.getElementById('mainCarImage');
  const modalImage = document.getElementById('modalImage');

  if (mainImage) {
    mainImage.style.opacity = '0.8';

    setTimeout(() => {
      mainImage.src = src;
      mainImage.style.transition = 'opacity 0.3s ease';
      mainImage.style.opacity = '1';
    }, 100);
  }

  if (modalImage) {
    modalImage.src = src;
  }

  // Обновляем индекс текущего изображения
  if (updateIndex) {
    currentImageIndex = galleryImages.indexOf(src);
    if (currentImageIndex === -1) currentImageIndex = 0;
  }

  // Обновляем активную миниатюру
  updateActiveThumbnail(src);

  // Обновляем счетчики
  updateImageCounter();
  updateModalImageCounter();
}

// Обновление активной миниатюры
function updateActiveThumbnail(src) {
  document.querySelectorAll('.thumbnail-image').forEach(thumb => {
    thumb.classList.remove('active');
    if (thumb.src === src || thumb.dataset.image === src) {
      thumb.classList.add('active');
    }
  });
}

// Навигация к следующему изображению
function nextImage() {
  if (galleryImages.length === 0) return;

  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  changeMainImage(galleryImages[currentImageIndex], false);
}

// Навигация к предыдущему изображению
function prevImage() {
  if (galleryImages.length === 0) return;

  currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
  changeMainImage(galleryImages[currentImageIndex], false);
}

// Обновление счетчика изображений
function updateImageCounter() {
  const currentSpan = document.getElementById('currentImageIndex');
  const totalSpan = document.getElementById('totalImages');

  if (currentSpan && totalSpan) {
    currentSpan.textContent = currentImageIndex + 1;
    totalSpan.textContent = galleryImages.length;
  }
}

// Обновление счетчика в модальном окне
function updateModalImageCounter() {
  const modalCurrentSpan = document.getElementById('modalCurrentImageIndex');
  const modalTotalSpan = document.getElementById('modalTotalImages');

  if (modalCurrentSpan && modalTotalSpan) {
    modalCurrentSpan.textContent = currentImageIndex + 1;
    modalTotalSpan.textContent = galleryImages.length;
  }
}

// Настройка стрелок навигации
function setupNavigationArrows() {
  const prevBtn = document.getElementById('prevImageBtn');
  const nextBtn = document.getElementById('nextImageBtn');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }
}

// Настройка клавиатурной навигации
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Проверяем, что мы на странице автомобиля и не в поле ввода
    const isCarPage = document.querySelector('.car-single-page');
    const isInputFocused = document.activeElement &&
                          (document.activeElement.tagName === 'INPUT' ||
                           document.activeElement.tagName === 'TEXTAREA' ||
                           document.activeElement.isContentEditable);

    if (!isCarPage || isInputFocused) {
      return;
    }

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
      case 'Escape':
        if (isModalOpen) {
          e.preventDefault();
          closeModal();
        }
        break;
    }
  });
}

// Настройка touch-событий для мобильных
function setupTouchNavigation() {
  const mainImageContainer = document.querySelector('.main-image-container');
  const modalBody = document.querySelector('#imageModal .modal-body');

  if (mainImageContainer) {
    setupTouchEvents(mainImageContainer);
  }

  if (modalBody) {
    setupTouchEvents(modalBody);
  }
}

// Добавление touch-событий к элементу
function setupTouchEvents(element) {
  let startX = 0;
  let startY = 0;
  let threshold = 50; // Минимальное расстояние для свайпа

  element.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Проверяем, что это горизонтальный свайп
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Свайп влево - следующее изображение
        nextImage();
      } else {
        // Свайп вправо - предыдущее изображение
        prevImage();
      }
    }

    startX = 0;
    startY = 0;
  }, { passive: true });
}

// Настройка обработчиков модального окна
function setupModalHandlers() {
  const modal = document.getElementById('imageModal');
  const mainImage = document.getElementById('mainCarImage');

  if (modal && mainImage) {
    // Открытие модального окна
    mainImage.addEventListener('click', () => {
      const modalImage = document.getElementById('modalImage');
      if (modalImage) {
        modalImage.src = mainImage.src;
      }
    });

    // Отслеживание состояния модального окна
    modal.addEventListener('shown.bs.modal', () => {
      isModalOpen = true;
    });

    modal.addEventListener('hidden.bs.modal', () => {
      isModalOpen = false;
    });
  }
}

// Закрытие модального окна
function closeModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Инициализируем галерею изображений
  initImageGallery();

  // Первая миниатюра активная
  const firstThumbnail = document.querySelector('.thumbnail-image');
  if (firstThumbnail) {
    firstThumbnail.classList.add('active');
  }
});
