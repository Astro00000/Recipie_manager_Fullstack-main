import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../assets/Myrecipe.css';  // Importing the CSS for custom styles

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get("http://localhost:3000/my-recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyRecipes(response.data);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`http://localhost:3000/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the state to remove the deleted recipe from the list
      setMyRecipes(myRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="my-recipes-container">
      <h2 className="text-center mt-4 page-title">Your Recipes</h2>
      <div className="recipe-cards-container row mx-auto">
        {myRecipes.length === 0 ? (
          <h4 className="text-center">You haven't created any recipes yet.</h4>
        ) : (
          myRecipes.map((recipe) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={recipe._id}>
              <div className="recipe-card">
                <img
                  src={recipe.image ? recipe.image : "default-recipe.jpg"}
                  alt="Recipe"
                  className="recipe-image"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                />
                <div className="recipe-card-body">
                  <h5 className="recipe-title">{recipe.name}</h5>
                  <p className="recipe-time"><strong>{recipe.timeToCook}</strong></p>
                  <div className="button-group">
                    <Link to={`/update_recipe/${recipe._id}`} className="btn btn-update">Update</Link>
                    <button className="btn btn-delete" onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="create-recipe-button">
        <Link to="/create_recipe" className="btn btn-create-recipe">
          + Create
        </Link>
      </div>
    </div>
  );
};

export default MyRecipes;
