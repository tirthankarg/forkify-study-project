import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultView.js';
import bookmarkView from './Views/bookmarkView.js';
import paginationView from './Views/paginationView.js';
import AddRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './Views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) update result view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1.get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2.load search reasult
    await model.loadSearchResults(query);

    //3. render result
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4. render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. render new result
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. render new initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipes servings(in state)
  model.updateServings(newServings);

  //update servings
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. update
  recipeView.update(model.state.recipe);

  //3. render bookmark
  // console.log(model.state.bookmarks)
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // loading spinner
    addRecipeView.renderSpinner();
    //uplod the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    // render book mark new
    bookmarkView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back;

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const newFe = function(){
  console.log('welcome ...');
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandelerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFe();
};
init();
