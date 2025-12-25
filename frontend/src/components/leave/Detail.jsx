import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Detail= () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setLeave(response.data.leave); // Set leave data
        } else {
          setError("Failed to fetch employee data.");
        }
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  // If loading, show a loading message
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // If error, show the error message
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Check if employee and userId are available
 if (!leave || !leave.employeeId || !leave.employeeId.userId) {
  return <div className="text-center text-red-500">
    Leave data is not available.
  </div>;
}


  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">  Leave Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Profile Image with fallback check */}
          <img
            src={`http://localhost:5000/uploads/${leave.employeeId.userId.profileImage || "default.jpg"}`}
            className="rounded-full border w-56"
           alt={leave.employeeId.userId.name || "Profile"}

          />
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Name:</p>
            <p className="font-medium">{leave.employeeId.userId.name || "N/A"}</p>
          </div>

          <div className="flex space-x-3">
            <p className="text-lg font-bold">Employee Id:</p>
            <p className="font-medium">{leave.employeeId.employeeId || "N/A"}</p>
          </div>

          <div className="flex space-x-3">
            <p className="text-lg font-bold">Leave Types:</p>
            <p className="font-medium">
              { leave.leaveType || "N/A" }
            </p>
          </div>

          <div className="flex space-x-3">
            <p className="text-lg font-bold">Reason:</p>
            <p className="font-medium">{leave.reason || "N/A"}</p>
          </div>

          <div className="flex space-x-3">
            <p className="text-lg font-bold">Department:</p>
            <p className="font-medium">{leave.employeeId.department?.dep_name || "N/A"}</p>
          </div>

          
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Start Date:</p>
            <p className="font-medium">{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "N/A"}</p>
          </div>

           <div className="flex space-x-3">
            <p className="text-lg font-bold">End Date:</p>
            <p className="font-medium">{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"}</p>
          </div>

           <div className="flex space-x-3">
            <p className="text-lg font-bold">Status:</p>
            <p className="font-medium">{leave.status || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
