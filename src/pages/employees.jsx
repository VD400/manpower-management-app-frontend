import React from 'react';
import {useEffect, useState} from 'react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({name: '', age: 0, mobile_number: ''});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(false);
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    setLoading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {headers: {Authorization: `Bearer ${token}`}})
      if(!res.ok){
        throw new Error("Failed to fetch employees");
      }
      const data= await res.json();
      setEmployees(data);
    }catch{
      setError("Could not load data");
    }finally{
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this employee?")){
      return;
    }
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employees/${id}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
      if(!res.ok){
        throw new Error(`Delete failed: ${res.status}`);
      }
      await fetchEmployees();
    }catch(err){
      console.error(err);
      setError("Could not delete employee");
    }
  }

  async function changeEmployees(){
    try{
      const endpoint = editingEmployee ? `${import.meta.env.VITE_API_URL}/employees/${editingEmployee.emp_id}` : `${import.meta.env.VITE_API_URL}/employees`;
      const method = editingEmployee ? "PUT" : "POST";
      const res = await fetch(endpoint, {method, headers: {"Content-Type" : "application/json", Authorization : `Bearer ${token}`},
        body: JSON.stringify(form)}
      );
      if(!res.ok){
        throw new Error("Failed to fetch employees");
      }
      setShowForm(false);
      setEditingEmployee(null);
      await fetchEmployees();
    }catch(err){
      console.log(err);
      setError("Could not save employee");
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);
  return (
    <div className="p-6"> 
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>Add Employees</button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      {showForm &&
      <form>
        <div className="grid grid-cols-3 gap-4 mb-4"> 
          <div>
            <label className="text-xs text-gray-500 block mb-1">Name</label>
            <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="text" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          </div>
          <div>  
            <label className="text-xs text-gray-500 block mb-1">Age</label>
            <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.age} onChange={e => setForm({...form, age:e.target.value})}/>
          </div>
          <div>  
            <label className="text-xs text-gray-500 block mb-1">Mobile Number</label>
            <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="text" value={form.mobile_number} onChange={e => setForm({...form, mobile_number:e.target.value})}/>
          </div>
          </div>
        <button className="rounded-lg text-sm px-4 py-2 mt-1 text-white bg-blue-600 hover:bg-blue-700" onClick={changeEmployees}>{(!!editingEmployee) ? "Edit" : "Add"}</button>
      </form>}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden"> 
        <table className="w-full text-sm">
          <thead className="bg-gray-80 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Employee Name</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Mobile Number</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((e,index)=>(
              <tr key={e.emp_id} className="hover:bg-gray-100">
                <td className="px-4 py-3 font-gray-400">{index+1}</td>
                <td className="px-4 py-3 font-gray-400">{e.emp_id}</td>
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3 font-gray-400">{e.age}</td>
                <td className="px-4 py-3 font-gray-400">{e.mobile_number}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(e.emp_id)} className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs">Delete</button>
                    <button onClick={() => {
                      setEditingEmployee(e);
                      setShowForm(true);
                      setForm({...form, name: e.name, age: e.age, mobile_number: e.mobile_number})
                    }} className="text-blue-500 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 text-xs">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employees;
