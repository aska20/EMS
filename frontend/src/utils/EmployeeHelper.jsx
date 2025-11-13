import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "S No", selector: (row) => row.sno, width: "70px" },
  { name: "Name", selector: (row) => row.name || "N/A", sortable: true, width: "90px" },
  { name: "Image", selector: (row) => row.profileImage, width: "140px" },
  { name: "Department", selector: (row) => row.dep_name || "N/A", sortable: true, width: "120px" },
  { name: "DOB", selector: (row) => row.dob || "N/A", sortable: true },
  { name: "Action", selector: (row) => row.action, sortable: true, width: "300px", style: { textAlign: "center" } },
];

export const EmployeeButtons = ({ employee }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2">
      <button
        className="px-2 py-1 bg-teal-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/${employee._id}`)}
      >
        View
      </button>

      <button
        className="px-2 py-1 bg-green-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${employee._id}`)}
      >
        Edit
      </button>

      <button
        className="px-2 py-1 bg-yellow-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${employee._id}`)}
      >
        Salary
      </button>

      <button
        className="px-2 py-1 bg-red-600 text-white rounded"
        onClick={() => navigate(`/admin-dashboard/leave/${employee._id}`)}
      >
        Leave
      </button>
    </div>
  );
};

// ------------------- Fetch Departments -------------------
export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Missing authentication token");
    }

    const response = await axios.get("http://localhost:5000/api/department", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && Array.isArray(response.data.departments)) {
      return response.data.departments;
    } else {
      throw new Error(response.data.error || "Failed to load departments");
    }
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    alert(error.response?.data?.error || "Failed to fetch departments from server.");
    return [];
  }
};

// ------------------- Fetch Employees by Department -------------------
export const getEmployees = async (departmentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Missing authentication token");
    }

    const response = await axios.get(
      `http://localhost:5000/api/employee/department/${departmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && Array.isArray(response.data.employees)) {
      return response.data.employees;
    } else {
      throw new Error(response.data.error || "Failed to load employees");
    }
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    alert(error.response?.data?.error || "Failed to fetch employees from server.");
    return [];
  }
};
