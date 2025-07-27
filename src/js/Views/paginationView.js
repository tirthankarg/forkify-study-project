import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler){
    this._parentElement.addEventListener('click',function(e){
        const btn = e.target.closest('.btn--inline');
        // console.log(btn);

        if(!btn) return;

        const goToPage  = +btn.dataset.goto;

        handler(goToPage);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);
    // page 1 andthere are other pages
    if (curPage === 1 && numPages > 1) {
      return `
       ${this._generateNextBtn(curPage)}
           `;
    }

    // last
    if (curPage === numPages && numPages > 1) {
      return `
        ${this._generatePrevBtn(curPage)}`;
    }

    // other pages
    if (curPage < numPages) {
      return ` 
      ${this._generateNextBtn(curPage)}
      ${this._generatePrevBtn(curPage)}
        `;
    }

    // page 1 andthere are NO other pages
    return '';
  }

  _generateNextBtn(page) {
  return `
    <button data-goto="${page+1}" class="btn--inline pagination__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
  `;
}

_generatePrevBtn(page) {
  return `
    <button data-goto="${page-1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
    </button>
  `;
}
}

export default new PaginationView();
