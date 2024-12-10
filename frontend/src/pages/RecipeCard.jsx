/* eslint-disable react/prop-types */

import "./RecipeCard.css";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Helper function to generate random usernames
const generateRandomUsername = () => {
  const adjectives = ["Happy", "Quick", "Bright", "Clever", "Chill", "Cool"];
  const nouns = ["Chef", "Foodie", "Cook", "Taster", "Baker", "Critic"];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdj}${randomNoun}${Math.floor(Math.random() * 100)}`;
};

// Helper function to chunk ingredients into groups of 6
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const RecipeCard = ({ recipe }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // UseEffect to handle body scroll
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [showModal]);

  // Use a fallback value for instructions
  const instructions = typeof recipe.instructions === "string" ? recipe.instructions : "";

  // Split instructions into list items based on full stop
  const splitInstructions = instructions
    .split(".")
    .map((instruction) => instruction.trim())
    .filter((instruction) => instruction.length > 0);

  return (
    <div className="card mb-4 shadow-lg bg-dark text-light" style={{ borderRadius: "15px" }}>
      <div className="row g-0">
        {/* Left Column */}
        <div className="col-md-4">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="img-fluid rounded-start h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Center Column */}
        <div className="col-md-5">
          <div className="card-body">
            <h2 className="card-title">{recipe.title}</h2>
            <p className="card-text">{recipe.description}</p>

            <h4>Ingredients:</h4>
            <div className="row">
              {chunkArray(recipe.ingredients, 6).map((chunk, index) => (
                <div key={index} className="col-6">
                  <ul className="list-unstyled">
                    {chunk.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary my-3"
              onClick={handleModalOpen}
            >
              View Instructions
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-3 border-start">
          <div className="p-3">
            <h4>Comments:</h4>
            <ul className="list-unstyled">
              {recipe.comments.map((comment, index) => (
                <li key={index}>
                  <strong>{generateRandomUsername()}:</strong> {comment}
                </li>
              ))}
            </ul>

            <div className="d-flex mt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="form-control me-2"
              />
              <button className="btn btn-secondary">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Instructions</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <ol>
                  {splitInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}.</li>
                  ))}
                </ol>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
