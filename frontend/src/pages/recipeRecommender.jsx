import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from "react-bootstrap";

const RecipeRecommender = () => {
  const { user } = useUser();
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
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recipe recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (videoUrl) => {
    const urlMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?/\s]+)/);
    return urlMatch ? `https://www.youtube.com/embed/${urlMatch[1]}` : null;
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
            <Button onClick={fetchRecommendations} disabled={loading} variant="primary">
              {loading ? <Spinner animation="border" size="sm" /> : "Get Recipes"}
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      {recommendations.map((rec, index) => (
        <Row key={index} className="mt-4">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Card.Title>{rec.title}</Card.Title>
                <Card.Text>{rec.steps}</Card.Text>
                {rec.video ? (
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={getEmbedUrl(rec.video)}
                      title={rec.title}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <Card.Img variant="top" src={rec.image} alt={rec.title} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default RecipeRecommender;
