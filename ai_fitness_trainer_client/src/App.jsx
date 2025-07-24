import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Layout and Pages
import Layout from "./components/Layout/Layout";// Jis mein Navbar, Footer aur <Outlet /> hoga
import SignInPage from "./app/authentication/SignInPage";
import SignUpPage from "./app/authentication/SignUpPage";
import Home from "./app/Home/Home";
import GenerateProgram from "./app/GenerateProgram/GenerateProgram";
import Profile from "./app/Profile/Profile";
import Onboarding from "./app/Onboarding/Onboarding";
function App() {
  return (
    <Routes>

      {/* Ye sab pages Layout ke andar honge jisme Navbar/Footer hota hai */}
      <Route path="/" element={<Layout />}>

        {/* Home page sirf signed-in user k liye */}
        <Route index element={
          <SignedIn>
            <Home />
          </SignedIn>
        }/>

        {/* /home bhi wahi Home.jsx kholega */}
        <Route path="home" element={
          <SignedIn>
            <Home />
          </SignedIn>
        }/>

         
          {/* /home bhi wahi Home.jsx kholega */}
        <Route path="onboarding" element={
          <SignedIn>
            <Onboarding />
          </SignedIn>
        }/>

        {/* Program Generator page (signed-in users only) */}
        <Route path="generate-program" element={
          <SignedIn>
            <GenerateProgram />
          </SignedIn>
        }/>

        {/* Profile route ko protect karna hai */}
        <Route path="profile" element={
          <>
            <SignedIn>
              <Profile />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }/>

      </Route>

      {/* Ye auth wale pages hain, layout ke bahar (pure centered page) */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

    </Routes>
  );
}

export default App;
