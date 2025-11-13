import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees]= useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;

          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp.userId?.name || "N/A",
            dep_name: emp.department?.dep_name || "N/A",
            dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
            profileImage: emp.userId?.profileImage ? (
             <img
             src={`http://localhost:5000/uploads/${emp.userId.profileImage}`}
             alt={emp.userId?.name}
             style={{ width: "40px" }}
             className="rounded-full"
              />

            ) : "N/A",
            action: <EmployeeButtons employee={emp} />,
          }));

          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert(error.response?.data?.error || "Failed to fetch employees");
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
  
  const records = employees.filter((emp) => 
    emp.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  
  setFilteredEmployees(records);  
};

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Department Name"
          className="px-4 py-1 border rounded"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Employee
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployee}
        progressPending={empLoading}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default List;
