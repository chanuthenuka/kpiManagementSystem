import React from "react";
import KPIRatingsFormManager from "./KPIRatingsFormManager";
import CompetencyRatingsFormManager from "./CompetencyRatingsFormManager";



const View_ratings_2 = ({ user, onBack }) => {
  return (
    <div className="container mx-auto p-4 mt-10">
      <h1 className="text-3xl font-bold mb-8">Manager Ratings System</h1>
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Back
      </button>

      <KPIRatingsFormManager selectedUser={user} />
      <CompetencyRatingsFormManager selectedUser={user} />
    </div>
  );
};

export default View_ratings_2;
