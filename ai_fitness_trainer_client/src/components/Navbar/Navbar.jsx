import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import navLogo from '../../assets/navLogo.png'
import "./Navbar.css"; // Assuming you have a CSS file for styling
import { useState } from "react";
export default function Navbar() {
    const [clicked, setClick] = useState(false);
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={navLogo} alt="Logo" className="logoImg" />
                <Link className="logoText" to="/">AlphaFit Ai</Link>
            </div>

            <div className="toggleMenu" onClick={() => setClick(prev => !prev)}>
                {clicked ? (
                    <i className="fa-solid fa-xmark"></i>   // Close icon
                ) : (
                    <i className="fa-solid fa-bars"></i>    // Hamburger icon
                )}
            </div>
            <div className= {`nav-links ${clicked ? 'active':''}`}>
                <SignedIn>
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/onboarding">Onboard From</NavLink>
                    <NavLink to="/generate-program">Generate Program</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    <UserButton afterSignOutUrl="/home" />
                </SignedIn>

                <SignedOut>
                    <NavLink to="/sign-in">Sign In</NavLink>
                    <NavLink to="/sign-up">Sign Up</NavLink>
                </SignedOut>
            </div>
        </nav>
    );
};