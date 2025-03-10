import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../assets/RecipeCard.css'; // Relative path to the CSS file


const RecipeCard = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(`https://recipiebackend.onrender.com/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipe details", error);
      });
  }, [id]);

  if (!recipe) {
    return <p className="text-center my-5">Loading...</p>;
  }

  return (
    <section className="recipe-card-container py-5">
      <div className="container">
        <div className="recipe-card-content row gx-4">
          {/* Recipe Image */}
          <div className="col-lg-6 image-container">
            <img
              className="recipe-image rounded-4 shadow-lg"
              src={recipe.image || "placeholder.jpg"}
              alt={recipe.name || "Recipe Image"}
            />
          </div>

          {/* Recipe Details */}
          <div className="col-lg-6 recipe-details">
            <h4 className="recipe-title">{recipe.name}</h4>
            <p className="cooking-time">
              <strong>Cooking Time:</strong> {recipe.timeToCook || "N/A"}
            </p>

            <div className="ingredients-section">
              <h5 className="ingredients-title">Ingredients:</h5>
              <ul className="ingredients-list">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))
                ) : (
                  <li>No ingredients available.</li>
                )}
              </ul>
            </div>

            <div className="steps-section">
              <h5 className="steps-title">Steps:</h5>
              <ol className="steps-list">
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps.map((step, index) => <li key={index}>{step}</li>)
                ) : (
                  <li>No steps provided.</li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeCard;
