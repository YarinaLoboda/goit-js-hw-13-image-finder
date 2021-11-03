import imageSearchFromTpl from '../templates/image-search-form.hbs';

export default function createMarkupImageSearchForm() {
  const markup = imageSearchFromTpl();

  return markup;
}
