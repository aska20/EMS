import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit"; // Import the Edit component
import AddSalary from "./components/salary/Add.jsx";
import ViewSalary from "./components/salary/View.jsx";
import Summary from "./components/EmployeeDashboard/Summary.jsx";
import LeaveList from "./components/leave/List.jsx";
import AddLeave from "./components/leave/Add.jsx";
import Setting from "./components/EmployeeDashboard/Setting.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
         }>
          <Route index element={<AdminSummary />} />
          <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
          <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
          <Route path="/admin-dashboard/employees" element={<List />} />
          <Route path="/admin-dashboard/add-employee" element={<Add />} />
          <Route path="/admin-dashboard/employees/:id" element={<View />} />
          <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />} />
           <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
           <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary />} />


         </Route>
        <Route
         path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin' , 'employee']}>
          <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >

        <Route index element={<Summary />} />\
        <Route path="/employee-dashboard/profile/:id" element={<View />}></Route>
        <Route path="/employee-dashboard/leaves" element={<LeaveList />}></Route>
        <Route path="/employee-dashboard/add-leave" element={<AddLeave />}></Route>
        <Route path="/employee-dashboard/salary/:id" element={<ViewSalary/>}></Route>
        <Route path="/employee-dashboard/setting" element={<Setting/>}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
