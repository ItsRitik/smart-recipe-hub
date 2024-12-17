import "./RecipeCard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";



// Helper function to split array
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const RecipeCard = ({ recipe }) => {
  const { user } = useUser(); // Get Clerk user data
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState(recipe.comments || []); // Existing comments
  const [newComment, setNewComment] = useState(""); // Input for new comment
  const [isSubmitting, setIsSubmitting] = useState(false); // For button loading state

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    if (!user) {
      alert("You need to be logged in to comment!");
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to add comment
      const response = await axios.post(
        `http://localhost:8000/api/recipes/${recipe._id}/comments`,
        {
          userId: user.id, // Clerk User ID
          username: user.username || "Anonymous", // User's name
          text: newComment,
        }
      );

      // Update local comments state with the new comment
      setComments([...comments, response.data.comment]);
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error adding comment:", error.message);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const instructions = typeof recipe.instructions === "string" ? recipe.instructions : "";

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
            src={recipe.imageUrl}
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
                      <li key={idx}>
                        {ingredient.item}: {ingredient.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button className="btn btn-primary my-3" onClick={handleModalOpen}>
              View Instructions
            </button>
            <p className="text-muted">
              <small>By {recipe.username}</small>
            </p>
          </div>
        </div>

        {/* Right Column: Comments Section */}
        <div className="col-md-3 border-start">
          <div className="p-3">
            <h4>Comments:</h4>
            <ul className="list-unstyled">
              {comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.username}:</strong> {comment.text}
                </li>
              ))}
            </ul>

            <div className="d-flex mt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="form-control me-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="btn btn-secondary"
                onClick={handleAddComment}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
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
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
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
