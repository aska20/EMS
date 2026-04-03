import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DepartmentButtons = ({Id,onDepartmentDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async(id)=>{
      const confirm = window.confirm("Are you sure you want to delete the department?");
          if(confirm){
         try { 
      const response = await axios.delete(`http://localhost:5000/api/department/${id}`,{
        headers:{
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      })
if(response.data.success){
onDepartmentDelete ();

}  
  }catch (error) {
      if(error.response && !error.response.data.success){
                    alert(error.response.data.error);
                  }
      }
    }

  };
  return (
    <div className="flex space-x-3">
      <button className="px-3 py-1 bg-purple-600 text-white"
      onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
      >Edit</button>
      <button className="px-3 py-1 bg-red-500 text-white"
      onClick={()=>handleDelete(Id)}
      >Delete</button>
    </div>
  );
};

export const columns = [
  {
    name: "S.No",
    selector: (row) => row.sno
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
  },
  {
  name: "Action",
  selector: (row) => row.action
},
];