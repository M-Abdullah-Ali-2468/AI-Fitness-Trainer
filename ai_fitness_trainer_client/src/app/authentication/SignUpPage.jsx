import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage(){
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SignUp signInUrl="/sign-in"/>
        </div>
    );
}