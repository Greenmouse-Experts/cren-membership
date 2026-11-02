// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "@/lib/router-compat";
import { Custom } from "../services/config";

const Member_details = () => {
  const { memberId } = useParams(); 
  const [memberDetails, setMemberDetails] = useState({});

  useEffect(() => {

    Custom.get(`/admin/member/retrieve/all?keyword=fellow/${memberId}`)
      .then((response) => {
        setMemberDetails(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching member details", error);
      });
  }, [memberId]);

  return (
    <div className="fellow">
      <h2>Member Details</h2>
      `${memberId}`      
      <p>Member Name: {memberDetails.username}</p>
      <p>Email: {memberDetails.email}</p>
      {/* Display other member details */}
    </div>
  );
};

export default Member_details;




