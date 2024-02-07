import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './public/image';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast/dist/js/iziToast.min.js';
import 'izitoast/dist/css/iziToast.min.css';

const imageApiService = new ImagesApiService();
const form = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

// Початково приховуємо кнопку "Load more"
loadMoreBtn.classList.add('is-hidden');

function onSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notify.info('Please enter your search query!');
    return;
  } else {
    imageApiService
      .getImage()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length < 40) {
          renderImages(queriesArray);
          // Показуємо кнопку "Load more" при наявності результатів
          loadMoreBtn.classList.remove('is-hidden');
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        } else {
          renderImages(queriesArray);
          // Показуємо кнопку "Load more" при наявності результатів
          loadMoreBtn.classList.remove('is-hidden');
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
      })
      .catch(error => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        console.log(error);
      });
  }
}

function onLoadMore() {
  imageApiService.getImage().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      // Приховуємо кнопку "Load more" при досягненні кінця результатів
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function renderImages(queriesArray) {
  const markup = queriesArray
    .map(item => {
      return `<a href="${item.largeImageURL}" class="photo-card" data-lightbox="gallery">
        <div class="thumb"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
        <div class="info">
          <p class="info-item"><b>Likes</b><span>${item.likes}</span></p>
          <p class="info-item"><b>Views</b><span>${item.views}</span></p>
          <p class="info-item"><b>Comments</b><span>${item.comments}</span></p>
          <p class="info-item"><b>Downloads</b><span>${item.downloads}</span></p>
        </div>
      </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  // Ініціалізація SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}
