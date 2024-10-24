
const apiId = '355e6a8d'; 
const apiKey = '76393ed1145579b314443a9d708e9661';  
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const recipeList = document.getElementById('recipe-list');
const favoritesList = document.getElementById('favorites-list');


searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        fetchRecipes(query);
    }
});


function fetchRecipes(query) {
    fetch(`https://api.edamam.com/search?q=${query}&app_id=${apiId}&app_key=${apiKey}&from=0&to=20`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.hits);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}


function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    recipes.forEach(item => {
        const recipe = item.recipe;
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <p><strong>Calories:</strong> ${Math.round(recipe.calories)}</p>
            <button class="favorite-btn" onclick="addToFavorites('${recipe.uri}', '${recipe.label}', '${recipe.image}')">Add to Favorites</button>
        `;
        recipeList.appendChild(recipeCard);
    });
}


function addToFavorites(id, title, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push({ id, title, image });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}


function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(); 
}


function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const favCard = document.createElement('div');
        favCard.classList.add('recipe-card');
        favCard.innerHTML = `
            <img src="${fav.image}" alt="${fav.title}">
            <h3>${fav.title}</h3>
            <button class="remove-btn" onclick="removeFromFavorites('${fav.id}')">Remove from Favorites</button>
        `;
        favoritesList.appendChild(favCard);
    });
}


window.onload = displayFavorites;
