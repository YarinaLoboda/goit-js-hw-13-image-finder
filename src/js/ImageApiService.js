export default class ImageApiService {
  constructor() {
    this.base_url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal`;
    this.searchQuery = '';
    this.per_page = 12;
    this.key = '24105767-529978ca3577f63abe59720d6';
    this.currentPage = 0;
    this.data = [];
    this.changed = false;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }

  async fetchImage() {
    if (checkQueryChange(this.searchQuery)) {
      this.currentPage = 0;
      this.changed = true;
    }

    this.currentPage += 1;
    const url = `${this.base_url}&per_page=${this.per_page}&page=${this.currentPage}&q=${this.searchQuery}&key=${this.key}`;

    sessionStorage.setItem('prevQuerry', this.searchQuery);
    const response = await fetch(url, {
      method: 'GET',
      // mode: 'no-cors',
      cache: 'no-cache',
      // credentials: 'omit',
    });

    if (response.ok) {
      const dataArr = await response.json();
      this.data = dataArr;

      return dataArr;
    } else {
      console.log(`HTTP Error:  ${response.status}`);
    }
  }
}

function checkQueryChange(newQuerry) {
  if (!newQuerry) {
    sessionStorage.setItem('prevQuerry', newQuerry);
    return false;
  } else {
    if (newQuerry !== sessionStorage.getItem('prevQuerry')) {
      sessionStorage.setItem('prevQuerry', newQuerry);
      return true;
    }
  }
}
