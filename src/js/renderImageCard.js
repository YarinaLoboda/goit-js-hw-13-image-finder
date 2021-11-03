import imageCardTpl from '../templates/image-card.hbs';

export default function createMarkupImageCard(images) {
  const { hits } = images;

  const markup = imageCardTpl(hits);

  return markup;
}
