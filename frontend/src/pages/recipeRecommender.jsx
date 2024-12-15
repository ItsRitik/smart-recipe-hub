import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";

import "./recipeRecommender.css";

const RecipeRecommender = () => {
  const { user } = useUser(); // Clerk user data
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // To store the selected recipe for the modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gemini-recommend",
        {
          clerkUserId: user.id,
          cuisine,
          ingredients: ingredients.split(",").map((item) => item.trim()),
        }
      );

      // Log the response to verify the structure
      console.log("API Response:", response.data.recommendations);

      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recipe recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalShow = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleModalClose = () => {
    setSelectedRecipe(null);
  };

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="text-center mb-4" style={{ fontSize: "1.5rem" }}>
            AI Generated Recipes
          </h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cuisine Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cuisine (e.g., Italian, Indian)"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ingredients (comma-separated)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button
                variant="primary"
                size="lg"
                onClick={fetchRecommendations}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Get Recipes"
                )}
              </Button>
            </div>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>

      {recommendations?.length > 0 && (
        <Row className="mt-5 justify-content-center">
          <h3 className="text-center mb-4">Recommended Recipes</h3>
          {recommendations.map((rec, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={4}
              className="d-flex justify-content-center"
            >
              <Card className="recipe-card mb-4 shadow-lg">
                <Card.Img
                  variant="top"
                  src={rec?.image || "https://via.placeholder.com/300"}
                  alt={rec?.title || "Recipe Image"}
                  className="card-img"
                />
                <Card.Body className="text-center">
                  <Card.Title className="recipe-card-title fw-bold">
                    {rec?.title || "Recipe Name Unavailable"}
                  </Card.Title>
                  <Card.Text className="recipe-card-text">
                    {rec?.description || "A delicious recipe to try out!"}
                  </Card.Text>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2 recipe-card-button"
                    onClick={() => handleModalShow(rec)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Viewing Recipe Details */}
      {selectedRecipe && (
        <Modal
          show={!!selectedRecipe}
          onHide={handleModalClose}
          centered
          size="lg"
          dialogClassName="modal-dialog-scrollable"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe?.title || "Recipe Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card.Img
              variant="top"
              src={selectedRecipe?.image || "https://via.placeholder.com/300"}
              alt={selectedRecipe?.title || "Recipe Image"}
              style={{
                objectFit: "cover",
                maxHeight: "300px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            />
            <h5>Instructions</h5>
            {selectedRecipe?.steps ? (
              <div>
                {selectedRecipe.steps.split("\n").map((step, index) => (
                  <p key={index}>
                    <Markdown>{step}</Markdown>
                  </p>
                ))}
              </div>
            ) : (
              <p>No instructions available.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default RecipeRecommender;
