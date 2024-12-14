import React, { useState } from "react";
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
import Loader from "./Loader"; // Import the Loader component

// RecipeCard Component
const RecipeCard = ({ recipe }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Card
        className="mb-4 shadow-sm recipe-card"
        style={{
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        }}
      >
        <Card.Img
          variant="top"
          src={recipe?.image || "https://via.placeholder.com/300"}
          alt={recipe?.title || "Recipe Image"}
          style={{
            objectFit: "cover",
            height: "200px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        />
        <Card.Body className="text-center">
          <Card.Title className="fw-bold">
            {recipe?.title || "No Title"}
          </Card.Title>
          <Card.Text className="text-muted mb-3">
            {recipe?.description || "A delicious recipe to try out!"}
          </Card.Text>
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-2"
            onClick={handleShowModal}
          >
            View Details
          </Button>
        </Card.Body>
      </Card>

      {/* Modal for Viewing Recipe Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{recipe?.title || "Recipe Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Img
            variant="top"
            src={recipe?.image || "https://via.placeholder.com/300"}
            alt={recipe?.title || "Recipe Image"}
            style={{
              objectFit: "cover",
              maxHeight: "300px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          />
          <h5>Instructions</h5>
          {recipe?.steps ? (
            <div>
              {recipe.steps.split("\n").map((step, index) => (
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// RecipeRecommender Component
const RecipeRecommender = () => {
  const { user } = useUser(); // Clerk user data
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recommendations, setRecommendations] = useState([]);

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
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recipe recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className="text-center mb-4">AI Recipe Recommender</h2>
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
            {recommendations?.length > 0 && (
              <Row className="mt-5 justify-content-center">
                <h3 className="text-center mb-4">Recommended Recipes</h3>
                {recommendations.map((rec, index) => (
                  <Col
                    key={index}
                    xs={12}
                    sm={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <RecipeCard recipe={rec} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RecipeRecommender;
