import React from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useUser } from "@clerk/clerk-react";
import useData from "../../hooks/useData";
import "./Profile.css";

function Profile() {
  const { user } = useUser();
  const { data, loading, error } = useData(user ? user.id : null);

  if (loading) {
    return (
      <div className="userDashboard">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userDashboard">
        <p>Error loading profile data: {error.message || error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="userDashboard">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="userDashboard">
        <p>No profile data found. Please complete your onboarding.</p>
      </div>
    );
  }

  return (
    <div className="userDashboard">
      <UserInfo
        userName={user?.firstName || "User"}
        userMail={user?.emailAddresses?.[0]?.emailAddress || "No email"}
        userInfo={data}
      />
    </div>
  );
}

export default Profile;
