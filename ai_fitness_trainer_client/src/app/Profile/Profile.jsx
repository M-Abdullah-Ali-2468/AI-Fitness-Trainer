import React, { useState } from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import ActivePlanCard from "../../components/ActivePlanCard/ActivePlanCard";
import InactivePlansCard from "../../components/InactivePlansCard/InactivePlansCard";
import { useUser } from "@clerk/clerk-react";
import useData from "../../hooks/useData";
import usePlans from "../../hooks/usePlans";
import "./Profile.css";

function Profile() {
  const { user } = useUser();
  const { data, loading, error } = useData(user ? user.id : null);

  // Get userId from onboarding data when available
  const userId = data ? data.user_id : null;

 const [refreshFlag, setRefreshFlag] = useState(false);
const handlePlanChange = () => setRefreshFlag(prev => !prev);

const { activePlans, inactivePlans, loading: plansLoading, error: plansError } = usePlans(userId, refreshFlag);

  console.log('This is the plan');
  console.log({ activePlans });

  // ✅ State for modals
  const [openPlanId, setOpenPlanId] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);

  if (loading || plansLoading) {
    return (
      <div className="userDashboard">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || plansError) {
    return (
      <div className="userDashboard">
        <p>Error loading profile data: {(error || plansError)?.message || "Unknown error"}</p>
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

  // ✅ Current active plan or null
  const firstActivePlan = activePlans && activePlans.length > 0 ? activePlans[0] : null;
  const activePlanId = firstActivePlan ? firstActivePlan.id : null;
  console.log('This is first plan extracted');
  console.log(firstActivePlan);

  return (
    <div className="userDashboard">
      <UserInfo
        userName={user?.firstName || "User"}
        userMail={user?.emailAddresses?.[0]?.emailAddress || "No email"}
        userInfo={data}
      />

      {/* Active Plan Section */}
      <div className="active">
        <h1 className="main-active">Active Plan</h1>
        <ActivePlanCard activePlanData={firstActivePlan} />
      </div>

      {/* Inactive Plans Section */}
      <div className="inactive">
        <h1 className="main-inactive">Inactive Plans </h1>
        {inactivePlans.map((plan, idx) => (
          <InactivePlansCard
            key={plan.id || idx}
            inactivePlansData={plan}
            openPlanId={openPlanId}
            setOpenPlanId={setOpenPlanId}
            deletePlanId={deletePlanId}
            setDeletePlanId={setDeletePlanId}
            activePlanId={activePlanId}      // ✅ Pass active plan id
              onPlanChange={handlePlanChange} // ✅ Refresh callback
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
