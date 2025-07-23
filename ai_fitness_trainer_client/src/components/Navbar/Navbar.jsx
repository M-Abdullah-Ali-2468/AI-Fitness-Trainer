import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link className="logoText" to="/">Ai Fitness Trainer</Link>
            </div>
            <div className="nav-links">
                <SignedIn>
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/generate-program">Generate Program</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>

                <SignedOut>
                    <NavLink to="/sign-in">Sign In</NavLink>
                    <NavLink to="/sign-up">Sign Up</NavLink>
                </SignedOut>
            </div>
        </nav>
    );
};