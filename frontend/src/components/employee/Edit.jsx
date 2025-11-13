import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDepartments } from '../../utils/EmployeeHelper';

const EditEmployee = () => {
  const [employee, setEmployee] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [depError, setDepError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();  // Employee ID from URL

  // Fetch departments and employee data
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

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          setDepError("Failed to fetch employee data.");
        }
      } catch (error) {
        setDepError(error.response?.data?.error || "Failed to fetch employee");
      }
    };

    getDepartments();
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle image preview
    if (name === "image" && files?.length > 0) {
      setEmployee((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      const previewURL = URL.createObjectURL(files[0]);
      setImagePreview(previewURL);
    } else {
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(employee).forEach((key) => {
      if (key === 'image' && employee[key]) {
        data.append('image', employee[key]);
      } else {
        data.append(key, employee[key]);
      }
    });

    try {
      const res = await axios.put(
        `http://localhost:5000/api/employee/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("✅ Employee updated successfully!");
        navigate("/admin-dashboard/employees");
      } else {
        alert(res.data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update employee.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Employee</h2>

      {loadingDeps && <p className="text-center text-gray-500 mb-4">Loading departments...</p>}
      {depError && <p className="text-center text-red-500 mb-4">{depError}</p>}

      {/* Employee Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={employee?.name || ""}
              onChange={handleChange}
              placeholder="Insert Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              name="designation"
              onChange={handleChange}
              value={employee?.designation || ""}
              placeholder="Insert Designation"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              value={employee?.salary || ""}
              placeholder="Insert Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="maritalStatus"
              onChange={handleChange}
              value={employee?.maritalStatus || ""}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>

          {/* Department */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              disabled={loadingDeps || depError}
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
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-6 w-full text-white py-2 px-4 rounded-md ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {submitting ? "Updating Employee" : "Edit Employee"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
