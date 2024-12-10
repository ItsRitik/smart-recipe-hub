import React, { useEffect } from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import axios from "axios";

const SignUpPage = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const saveUserOnSignUp = async () => {
      if (isSignedIn && user) {
        try {
          const response = await axios.post("http://localhost:5000/api/save-user", {
            clerkUserId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            name: user.fullName,
          });
          console.log("User saved:", response.data.message);
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      }
    };

    saveUserOnSignUp();
  }, [user, isSignedIn]);

  return (
    <div className="signUpPage">
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;
