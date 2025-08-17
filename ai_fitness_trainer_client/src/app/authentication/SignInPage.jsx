import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
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
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
