import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;

        const data = response.data.leaves.map((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);

          // ✅ Correct days calculation
          const days =
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

          return {
            _id: leave._id,
            sno: sno++,
            employeeId: leave?.employeeId?.employeeId || "N/A",
            name: leave?.employeeId?.userId?.name || "N/A",
            leaveType: leave.leaveType || "N/A",
            department:
              leave?.employeeId?.department?.dep_name || "N/A",
            days,
            status: leave.status || "N/A",
            action: <LeaveButtons Id={leave._id} />,
          };
        });

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      alert(error.response?.data?.error || "Failed to fetch leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Combined filtering (search + status)
  useEffect(() => {
    let data = [...leaves];

    // search filter
    if (search) {
      data = data.filter((leave) =>
        leave.employeeId
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // status filter
    if (statusFilter) {
      data = data.filter(
        (leave) => leave.status === statusFilter
      );
    }

    setFilteredLeaves(data);
  }, [search, statusFilter, leaves]);

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search By Employee ID"
          className="px-4 py-1 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🎯 Filters */}
        <div className="space-x-3">
          <button
            onClick={() => setStatusFilter("Pending")}
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("Approved")}
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter("Rejected")}
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
          >
            Rejected
          </button>
          <button
            onClick={() => setStatusFilter("")}
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
          >
            All
          </button>
        </div>
      </div>

      {/* 📊 Table */}
      <DataTable
        columns={columns}
        data={filteredLeaves}
        pagination
        highlightOnHover
        responsive
        keyField="_id"
      />
    </div>
  );
};

export default Table;