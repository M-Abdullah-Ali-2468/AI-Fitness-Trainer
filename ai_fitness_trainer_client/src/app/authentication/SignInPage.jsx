import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div
           
        >
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    );
}
