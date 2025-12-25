import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";

const Add = () => {
  const [employee, setEmployee] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
    department: "",
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [depError, setDepError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch departments & employees
  useEffect(() => {
    const getDepartments = async () => {
      try {
        setLoadingDeps(true);
        const deps = await fetchDepartments();
        setDepartments(Array.isArray(deps) ? deps : []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setDepError("Unable to load departments. Please try again later.");
      } finally {
        setLoadingDeps(false);
      }
    };

    getDepartments();
  }, []);

  // Fetch employees for selected department
  const handleDepartment = async (e) => {
    const deptId = e.target.value;
    setEmployee((prev) => ({ ...prev, department: deptId }));
    try {
      const emps = await getEmployees(deptId);
      setEmployees(Array.isArray(emps) ? emps : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/salary/Add`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        alert("✅ Salary added successfully!");
        navigate("/admin-dashboard/employees");
      } else {
        alert(res.data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add salary.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add Salary</h2>

      {depError && <p className="text-red-500 mb-4">{depError}</p>}

     <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Department */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Department
      </label>
      <select
        name="department"
        onChange={handleDepartment}
        value={employee.department}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        required
      >
        <option value="">Select Department</option>
        {departments.map((dep) => (
          <option key={dep._id} value={dep._id}>
            {dep.dep_name}
          </option>
        ))}
      </select>
    </div>

    {/* Employee */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Employee
      </label>
      <select
        name="employeeId"
        onChange={handleChange}
        value={employee.employeeId}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        required
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.employeeId}
          </option>
        ))}
      </select>
    </div>

    {/* Basic Salary */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Basic Salary
      </label>
     <input
  type="number"
  name="basicSalary"
  min="0"
  value={employee.basicSalary}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (value < 0) return;
    handleChange(e);
  }}
  placeholder="Basic Salary"
  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
  required
/>

    </div>

    {/* Allowances */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Allowances
      </label>
      <input
  type="number"
  name="allowances"
  min="0"
  value={employee.allowances}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (value < 0) return;
    handleChange(e);
  }}
  placeholder="Allowances"
  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
  required
/>

    </div>

    {/* Deductions */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Deductions
      </label>
      <input
  type="number"
  name="deductions"
  min="0"
  value={employee.deductions}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (value < 0) return;
    handleChange(e);
  }}
  placeholder="Deductions"
  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
  required
/>

    </div>

    {/* Pay Date */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Pay Date
      </label>
      <input
        type="date"
        name="payDate"
        value={employee.payDate}
        onChange={handleChange}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        required
      />
    </div>
  </div>

  <button
    type="submit"
    disabled={submitting}
    className={`mt-6 w-full text-white py-2 px-4 rounded-md ${
      submitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-teal-600 hover:bg-teal-700"
    }`}
  >
    {submitting ? "Saving Salary..." : "Add Salary"}
        </button>
      </form>
    </div>
  );
};

export default Add;
