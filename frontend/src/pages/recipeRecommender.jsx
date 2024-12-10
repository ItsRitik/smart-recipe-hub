import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from "react-bootstrap";

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
      const response = await axios.post("http://localhost:5000/api/gemini-recommend", {
        clerkUserId: user.id,
        cuisine,
        ingredients: ingredients.split(",").map((item) => item.trim()),
      });
      setRecommendations(response.data.recommendations);
      console.log(recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recipe recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                {loading ? <Spinner animation="border" size="sm" /> : "Get Recipes"}
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
  <Row className="mt-5">
    <h3 className="text-center mb-4">Recommended Recipes</h3>
    {recommendations.map((rec, index) => (
      <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Img
            variant="top"
            src={rec.image || "https://via.placeholder.com/300"}
            alt={rec.title}
            style={{ objectFit: "cover", height: "180px" }}
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title>{rec.title}</Card.Title>
            <Card.Text style={{ flex: "1" }}>{rec.steps}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
)}

    </Container>
  );
};

export default RecipeRecommender;
