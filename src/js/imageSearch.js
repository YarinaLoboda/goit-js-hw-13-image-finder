import debounce from 'lodash.debounce';
import createMarkupSearchForm from '../js/renderSearchForm';
import createMarkupGallery from '../js/renderGallery';
import ImageApiService from './ImageApiService';
import createMarkupImageCard from '../js/renderImageCard';
import createMarkupLoadMore from '../js/renderLoadMore';
import showNotice from './showNotice';
import * as basicLightbox from 'basiclightbox';

const markup = createMarkupSearchForm() + createMarkupGallery();
document.body.innerHTML = markup;

const refs = {
  imageSearchForm: document.getElementById('search-form'),
  inputSearchVal: document.getElementById('searchval'),
  clearEl: document.getElementById('clear-el'),
  zoomPicEl: document.getElementById('zoom'),
  galleryListContainer: document.querySelector('ul.gallery'),
  progressBar: document.querySelector('.progress-bar'),
  loadMoreContainer: null,
  loadMoreBtn: null,
};

const obsOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.25,
};

const obsrverCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      onLoadMoreClick();
    }
  });
};

const imageApiService = new ImageApiService();
const observer = new IntersectionObserver(obsrverCallback, obsOptions);

refs.imageSearchForm.addEventListener('submit', onSearchFormSubmit);
refs.clearEl.addEventListener('click', onClearElClick);

refs.inputSearchVal.addEventListener('focus', () => {
  refs.zoomPicEl.classList.add('zoom-pic-active');
});
refs.inputSearchVal.addEventListener('blur', () => {
  refs.zoomPicEl.classList.remove('zoom-pic-active');
});
refs.inputSearchVal.addEventListener('input', debounce(onLoadMoreClick, 800));

refs.galleryListContainer.addEventListener('click', onImageClick);

function onSearchFormSubmit(e) {
  e.preventDefault();
}

function onClearElClick(e) {
  imageApiService.query = '';
  refs.imageSearchForm.reset();
  refs.clearEl.classList.remove('clear-el-active');
  clearGallery();
  imageApiService.currentPage = 0;
  refs.progressBar.setAttribute('value', imageApiService.currentPage);
}

function onImageClick(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const instance = basicLightbox.create(
    `<img width="1280"  src="${event.target.getAttribute('data-source')}">`,
  );

  instance.show();
}

async function onLoadMoreClick() {
  const querryVal = refs.imageSearchForm.elements.query.value.trim();

  if (!querryVal.length) {
    showNotice({ type: 'emptyQuerry', data: null });
    refs.clearEl.classList.remove('clear-el-active');
    return;
  }

  if (!refs.clearEl.classList.contains('clear-el-active')) {
    refs.clearEl.classList.add('clear-el-active');
  }

  imageApiService.query = refs.imageSearchForm.elements.query.value;

  const data = await imageApiService.fetchImage();
  renderImageCard(data);
}

function renderImageCard(arg) {
  if (imageApiService.changed) {
    clearGallery();

    if (!imageApiService.data.total) {
      showNotice({ type: 'notFind', data: null });
    } else {
      showNotice({ type: 'totalFind', data: imageApiService.data.total });
    }
    scrollIntoView('topLevel');
    imageApiService.changed = false;
  }

  const totalpages = Math.ceil(
    Number(imageApiService.data.total / imageApiService.per_page),
  );

  if (totalpages) {
    showNotice({
      type: 'pageNav',
      data: `${imageApiService.currentPage} from ${totalpages}`,
    });
  }

  refs.progressBar.setAttribute('max', totalpages);
  refs.progressBar.setAttribute('value', imageApiService.currentPage);

  if (!totalpages) {
    refs.progressBar.setAttribute('value', 0);
  }

  if (imageApiService.currentPage === totalpages) {
    showNotice({
      type: 'lastPage',
      data: `${imageApiService.currentPage} page is last!`,
    });
  }

  let resultMarkup = '';
  resultMarkup += createMarkupImageCard(arg);

  if (!checkLoadMoreBtnExists()) {
    refs.galleryListContainer.insertAdjacentHTML('beforeend', resultMarkup);

    if (imageApiService.currentPage < totalpages) {
      resultMarkup = createMarkupLoadMore();
      refs.galleryListContainer.insertAdjacentHTML('afterend', resultMarkup);
      refs.loadMoreContainer = document.querySelector(
        'div.load-more-container',
      );
      refs.loadMoreBtn = document.getElementById('load-more');

      setTimeout(() => {
        observer.observe(refs.loadMoreBtn);
      }, 1800);
    }
  } else {
    refs.loadMoreContainer = document.querySelector('div.load-more-container');
    refs.galleryListContainer.insertAdjacentHTML('beforeend', resultMarkup);

    if (imageApiService.currentPage === totalpages) {
      refs.loadMoreContainer.innerHTML = '';
    }
  }
}

function checkLoadMoreBtnExists() {
  if (!refs.loadMoreBtn) return false;
  else return true;
}

function clearGallery() {
  if (refs.galleryListContainer) refs.galleryListContainer.innerHTML = '';
  if (refs.loadMoreContainer) refs.loadMoreContainer.innerHTML = '';
  refs.loadMoreContainer = null;
  refs.loadMoreBtn = null;
}

function scrollIntoView(idElem) {
  const element = document.getElementById(idElem);
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
