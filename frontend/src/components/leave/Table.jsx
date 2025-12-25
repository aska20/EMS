import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";

const Table = () => {
  const [leaves, setLeaves] = useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;

        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "N/A",
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || "N/A",
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate() +
            1,
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      alert(error.response?.data?.error || "Failed to fetch leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return leaves ? (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Department Name"
          className="px-4 py-1 border rounded"
        />

        <div className="space-x-3">
          <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700">
            Pending
          </button>
          <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700">
            Approved
          </button>
          <button className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700">
            Rejected
          </button>
        </div>
      </div>
      <div className="mb-3 font-semibold">
      <DataTable columns={columns} data={leaves} pagination />
    </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Table;
 