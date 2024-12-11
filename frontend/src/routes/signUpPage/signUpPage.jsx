import React, { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import axios from "axios";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSignUpComplete = async (user) => {
    // Function triggered when sign-up is complete
    console.log("✅ Sign-up completed. User:", user);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/save-user", {
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
      });
      console.log("✅ User saved successfully:", response.data.message);
      setStatusMessage("User data saved successfully.");
    } catch (error) {
      console.error("❌ Error saving user data:", error.message);
      setStatusMessage("Failed to save user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signUpPage">
      <SignUp
        path="/sign-up"
        signInUrl="/sign-in"
        onSignUpComplete={(event) => handleSignUpComplete(event.user)} // Event listener
      />
      {/* Status Message */}
      {loading && <p>Saving user data...</p>}
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default SignUpPage;
