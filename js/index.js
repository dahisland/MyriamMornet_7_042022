import * as animNav from "./utils/animNav.js";
import * as data from "./data/recipes.js";
import * as card from "./patterns/cards.js";
import * as tags from "./patterns/tagsList.js";
import * as algo from "./algos/functionalAlgo.js";
import * as norm from "./utils/normalizeTxt.js";

// ------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------- VARIABLES //
// ------------------------------------------------------------------------------------------- //

const tagsFilters = document.querySelectorAll(".searchTags_filter");
const downBtns = document.querySelectorAll(".searchTags_btnDown");
const upBtns = document.querySelectorAll(".searchTags_btnUp");
const ulTagsList = document.querySelectorAll(".searchTags_tagsList");
const containerTagsIngredient = ulTagsList[0];
const containerTagsAppliance = ulTagsList[1];
const containerTagsUstensil = ulTagsList[2];
const searchInput = document.querySelector(".searchBar_input");
const containerRecipes = document.querySelector(".main_recipesList");

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------------ ARRAYS //
// ------------------------------------------------------------------------------------------- //

// ----------------------------------------------------- Containers recipes & recipes filtered //
let arrayRecipes = [];
let arrayRecipesFiltered = [];

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- OBJECTS //
// ------------------------------------------------------------------------------------------- //

// ----------------------------------------------------------------- Containers for tags lists //

let objTagsIngredient = {
  tags: [],
  li: [],
};
let objTagsUstensil = {
  tags: [],
  li: [],
};
let objTagsAppliance = {
  tags: [],
  li: [],
};

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------------------------- INTERACTIONS FOR TAGS FILTERS //
// ------------------------------------------------------------------------------------------- //

animNav.animDownFilters(downBtns, tagsFilters);
animNav.animUpFilters(upBtns, tagsFilters);

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------- IMPLEMENTATION DATAS //
// ------------------------------------------------------------------------------------------- //

data.recipes.forEach((rec) => {
  // ------------------------------------------------------------------ Get data recipes cards //
  let cardRecipe = new card.recipe(
    rec.name,
    rec.time,
    rec.appliance,
    rec.ustensils,
    rec.ingredients,
    rec.description
  );
  cardRecipe.getCard(arrayRecipes);

  // ------------------------------------------------ Get data tags lists for each tags filter //

  for (let i = 0; i < rec.ingredients.length; i++) {
    let ingredientsClass = new tags.tagsListFilter(
      rec.ingredients[i].ingredient
    );
    ingredientsClass.createTagsList(objTagsIngredient);
  }
  for (let i = 0; i < rec.ustensils.length; i++) {
    let ustensilsClass = new tags.tagsListFilter(rec.ustensils[i]);
    ustensilsClass.createTagsList(objTagsUstensil);
  }
  let applianceClass = new tags.tagsListFilter(rec.appliance);
  applianceClass.createTagsList(objTagsAppliance);
});

// ------------------------------------------------------------------------------------------- //
// --------------------------------------------------------- DISPLAY CARDS RECIPES & TAGS LIST //
// ------------------------------------------------------------------------------------------- //

for (let element of arrayRecipes) {
  if (searchInput.value == "") {
    containerRecipes.appendChild(element.li);

    tags.displayTagsLists(element, containerTagsIngredient, objTagsIngredient);
    tags.displayTagsLists(element, containerTagsAppliance, objTagsAppliance);
    tags.displayTagsLists(element, containerTagsUstensil, objTagsUstensil);
  }
}

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------------------- CALL NATIVE SEARCH ALGO ON EVENT INPUT //
// ------------------------------------------------------------------------------------------- //

searchInput.addEventListener("input", (e) => {
  let searchUser = e.target.value;
  let normalizeSearchUser = norm.getNormalizeText(searchUser);
  containerTagsIngredient.innerHTML = "";
  containerTagsAppliance.innerHTML = "";
  containerTagsUstensil.innerHTML = "";

  // Update cards recipes displays
  algo.searchInRecipes(
    containerRecipes,
    normalizeSearchUser,
    arrayRecipes,
    arrayRecipesFiltered
  );
  // Update tags list displays
  for (let element of arrayRecipesFiltered) {
    tags.displayTagsLists(element, containerTagsIngredient, objTagsIngredient);
    tags.displayTagsLists(element, containerTagsAppliance, objTagsAppliance);
    tags.displayTagsLists(element, containerTagsUstensil, objTagsUstensil);
  }
});

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------- STYLE & EVENTS FOR TAGS SELECTED //
// ------------------------------------------------------------------------------------------- //

const tagsSelectedContainer = document.querySelector(".nav_selectedTags");
const allTags = document.querySelectorAll(".selectedTags_item--unchecked");

allTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    let containerTagSelected = document.createElement("p");
    if (tag.getAttribute("data-status") == "unchecked") {
      tags.selectTag(containerTagSelected, tag);
      tagsSelectedContainer.appendChild(containerTagSelected);
    }
    tags.unselectTag(tag);
  });
});
