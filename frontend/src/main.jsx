import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Layouts
import MainLayout from "./components/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";
// Pages
import HomePage from "./pages/HomePage";
import SignInPage from "./routes/signInPage/signInPage";
import SignUpPage from "./routes/signUpPage/signUpPage";
import AddRecipePage from "./pages/addRecipe";
import AIRecommendationPage from "./pages/recipeRecommender";
import ProfilePage from "./pages/profilePage";

// Unified Router Configuration
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true, // Root path "/"
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        path: "/add-recipe",
        element: <AddRecipePage />,
      },
      {
        path: "/recommend",
        element: <AIRecommendationPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
