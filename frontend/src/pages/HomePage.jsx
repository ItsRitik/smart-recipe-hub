
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const recipes = [
    {
      title: "Chicken Biryani",
      image: "src/assets/biryani.png", // Replace with actual image URL
      description: "A mixed rice dish popular in South Asia, made with spices, rice, and meat.",
      ingredients: ["Chicken: 150g", "Rice: 100g", "Onions: 3 medium", "Tomatoes: 2 medium"],
      instructions:"Put the boiling water in a saucepan, add the washed rice, boil for 5 minutes and drain. Layer the chicken mixture with the rice starting with the rice, then the chicken mixture, and repeat this twice. Garnish with cumin seeds and ginger.",
      
      comments: ["Good recipe", "Loved it", "Could use more spices!"],
    },
    

    {
      
        title: "Veg Manchurian",
        image: "src/assets/vegmanchurian.png", // Replace with actual image URL
        description: "A popular Indo-Chinese dish made with deep-fried vegetable balls in a spicy, tangy sauce.",
        ingredients: [
          "Cabbage: 1 cup (grated)",
          "Carrot: 1/2 cup (grated)",
          "Capsicum: 1/4 cup (finely chopped)",
          "All-purpose flour: 3 tbsp",
          "Cornflour: 2 tbsp",
          "Ginger-Garlic paste: 1 tsp",
          "Soy sauce: 2 tbsp",
          "Tomato ketchup: 2 tbsp",
          "Vinegar: 1 tsp",
          "Spring onions: 2 tbsp (finely chopped)",
          "Salt: to taste",
          "Pepper: 1/2 tsp",
          "Water: as needed",
          "Oil: for frying"
        ],
        instructions:
          "Mix cabbage, carrot, capsicum, all-purpose flour, cornflour, ginger-garlic paste, salt, and pepper in a bowl. Form small balls from the mixture. Heat oil in a pan and deep-fry the balls until golden brown. Set aside. In another pan, heat a little oil and sauté ginger, garlic, and spring onions. Add soy sauce, tomato ketchup, vinegar, and a little water to create the sauce. Add the fried vegetable balls to the sauce and mix well. Cook for 2-3 minutes until the balls are coated with the sauce. Garnish with spring onions and serve hot.",
        comments: ["Delicious and easy to make!", "Perfect with fried rice!", "Tastes just like restaurant-style!"]
      
    },
  ];

  return (
    <div>
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
};

export default HomePage;
