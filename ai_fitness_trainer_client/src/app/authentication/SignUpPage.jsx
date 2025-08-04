import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div>
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
