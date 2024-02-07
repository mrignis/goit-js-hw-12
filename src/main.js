// main.js
import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42103820-367af78541649bbd92098b568';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endCollectionText = document.querySelector('.end-collection-text');

let currentPage = 1;
let searchQuery = '';

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

loadMoreBtn.classList.add('is-hidden');

async function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  await fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 15,
        page: currentPage,
      },
    });

    const { hits, totalHits } = response.data;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImages(hits);
      Notify.success(`Hooray! We found ${totalHits} images.`);
      if (hits.length < 15) {
        loadMoreBtn.classList.add('is-hidden');
        endCollectionText.classList.remove('is-hidden');
      } else {
        loadMoreBtn.classList.remove('is-hidden');
        endCollectionText.classList.add('is-hidden');
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notify.failure("We're sorry, but there was an error fetching images.");
  }
}

async function onLoadMore() {
  currentPage++;
  await fetchImages();
}

function renderImages(images) {
  const markup = images
    .map(image => {
      return `
                <a href="${image.largeImageURL}" class="photo-card" data-lightbox="gallery">
                    <div class="thumb">
                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    </div>
                    <div class="info">
                        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                        <p class="info-item"><b>Views:</b> ${image.views}</p>
                        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                    </div>
                </a>
            `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  // Remove the "is-hidden" class from the "Load more" button
  loadMoreBtn.classList.remove('is-hidden');
}
