import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../assets/Home.css';  // Importing the CSS for custom styles

export const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recipes/");
        setData(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setData([]); // In case of error, set an empty array
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Extract only recipe IDs
        const favoriteRecipeIds = response.data.map(fav => fav.recipeId._id);
        setFavorites(favoriteRecipeIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // function to toggle the like button
  const toggleFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post("http://localhost:3000/favorites/toggle", 
          { recipeId }, 
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Removed from favorites") {
        setFavorites(favorites.filter((id) => id !== recipeId));
      } else {
        setFavorites([...favorites, recipeId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Filtering based on search input
  const filterData = (Array.isArray(data) ? data : []).filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination logic
  const recordPerPage = 4;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = filterData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filterData.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <>
      {/* Quote on the top-left, but pushed below the navbar */}
      <span 
          className="quote"
        >
          <p>"Recipes are Joy.</p><p> Good Recipes are Happiness.”</p>
          - Ajith Raju
        </span>

      {/* Image on the right */}
      <img 
        src="pizza.jpg" 
        className="header-image"
      />

      {/* SVG Background */}
      {/* <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320" 
        className="svg-background"
      >
        <path fill="#71E2FF" fillOpacity="1" d="M0,32L60,80C120,128,240,224,360,218.7C480,213,600,107,720,90.7C840,75,960,149,1080,197.3C1200,245,1320,267,1380,277.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg> */}

      <br /><br /><br />
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        className="search-bar"
      />

      {/* Recipe List */}
      <div className="recipe-list">
        {records.length > 0 ? (
          records.map((item) => (
            <div className="recipe-card" key={item._id}>
              <Link to={`recipe/${item._id}`}>
                <img 
                  src={item.image ? item.image : "istockphoto-520410807-612x612.jpg"}
                  className="recipe-image"
                  alt="Recipe" 
                />
              </Link>
              <div className="recipe-card-body">
                <h5 className="recipe-title">{item.name}</h5>
                <p className="recipe-time"><strong>{item.timeToCook}</strong></p>

                {/* Favorite Icon */}
                <button 
                  onClick={() => toggleFavorite(item._id)} 
                  className={`favorite-button ${favorites.includes(item._id) ? 'active' : ''}`}
                >
                  {favorites.includes(item._id) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No results available</h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      <nav className="pagination-nav">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </button>
          </li>

          {numbers.map((n) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
              <button className="page-link" onClick={() => setCurrentPage(n)}> {n} </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
