/* eslint-disable react/prop-types */

import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  const renderIngredients = (ingredients) => {
    // Divide ingredients into two columns if there are more than 6
    const column1 = ingredients.slice(0, 6);
    const column2 = ingredients.slice(6);

    return (
      <div className="ingredients-grid">
        <ul>
          {column1.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        {column2.length > 0 && (
          <ul>
            {column2.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="recipe-card">
      <div className="left-column">
        <img src={recipe.image} alt={recipe.title} />
      </div>
      <div className="center-column">
        <h2>{recipe.title}</h2>
        <p className="description">{recipe.description}</p>

        <h4>Ingredients:</h4>
        {renderIngredients(recipe.ingredients)}

        <h4>Instructions:</h4>
        <p>{recipe.instructions}</p>
      </div>
      <div className="right-column">
        <h4>Comments:</h4>
        <ul>
          {recipe.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <div className="add-comment">
          <input type="text" placeholder="Add a comment..." />
          <button>Add</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
