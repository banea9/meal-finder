const searchValue = document.getElementById("search-value"); // update the p when the search btn is clicked with text "Searching for input.value";
const searchBox = document.getElementById("searchBox");
const submitBtn = document.getElementById("submit");
const randomBtn = document.getElementById("random");
const meals = document.getElementById("meals-grid");
const singleMeal = document.getElementById("meal-desc");

//fetch from API for meals
function searchMeals(event) {
  event.preventDefault();

  //claerSingleMeal

  singleMeal.innerHTML = "";

  if (searchBox.value.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBox.value}`
    )
      .then(resp => resp.json())
      .then(data => {
        searchValue.innerText = `Searching for '${searchBox.value}':`;
        if (data.meals === null) {
          searchValue.innerText = "There are no search results. Try again...";
        } else {
          meals.innerHTML = data.meals
            .map(
              meal =>
                `<div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                  </div>
                </div>
              `
            )
            .join("");
        }
      });
  } else {
    alert("Please enter valid term.");
  }
}

function randomSearchMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  .then(resp => resp.json())
  .then(data => {
    const meal = data.meals[0];
    meals.innerHTML = ``;
    searchBox.value = '';
    searchValue.innerText = ``;

    addMealToDOM(meal)
  })
}
//fetch Meal by ID function

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(resp => resp.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//add meal to dom function

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `);
    } else {
      break;
    }
  }

  singleMeal.innerHTML=`
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}` : ''}
        ${meal.strArea ? `<p>${meal.strArea}` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(el => `<li>${el.split(' - ')[0]}:${el.split(' - ')[1]}</li>`).join('')}
        </ul>
      </div>
    </div>
  `


}

//Event listeners
submitBtn.addEventListener("submit", searchMeals);
randomBtn.addEventListener('click', randomSearchMeal)
meals.addEventListener("click", e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});
