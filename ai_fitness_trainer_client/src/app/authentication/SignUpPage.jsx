import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f0f0f", // theme background
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          borderRadius: "16px",
          border: "2px solid rgb(0, 255, 247)",
          boxShadow: "rgba(0, 255, 247, 0.3) 0px 0px 40px",
          background: "rgb(26, 26, 26)",
          width: "400px",
          maxWidth: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/onboarding"
        />
      </div>
    </div>
  );
}
