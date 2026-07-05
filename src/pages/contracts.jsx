import React from 'react';
import { useState, useEffect} from 'react';

const Contracts = () => {
  const token = localStorage.getItem("token");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingContracts, setEditingContracts] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({emp_id: 0, customer_id: 0, contract_type: "", monthly_salary: 0.0, start_date: "", end_date: ""});
  const [showForm, setShowForm] = useState(false);

  const fetchContracts = async () => {
    setLoading(true);
    await fetch(`${import.meta.env.VITE_API_URL}/contracts`, {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
      if(!res.ok){
        throw new Error("Failed to fetch contracts");
      }
      return res.json();
    })
    .then(cont => {
      setContracts(cont);
      setLoading(false);
    })
    .catch(() => {
      setError("Could not fetch contracts");
      setLoading(false);
    })
  }

  useEffect(()=>{
    fetchContracts();
  },[]);

  const changeContracts = async () => {
    const url = editingContracts ? `${import.meta.env.VITE_API_URL}/contracts/${editingContracts.contract_id}` : `${import.meta.env.VITE_API_URL}/contracts`;
    const method = editingContracts ? "PUT" : "POST";
    const payload = {emp_id: parseInt(form.emp_id, 10),
      customer_id: parseInt(form.customer_id,10),
      contract_type: form.contract_type,
      monthly_salary: parseFloat(form.monthly_salary),
      start_date: form.start_date === "" ? null : form.start_date,
      end_date: form.end_date === "" ? null : form.end_date
    };
    const res = await fetch(url, {method, headers: {"Content-Type" : "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify(payload)});
    if(!res.ok){
      const errorData = await res.json();
      console.error("Validation error details: ", errorData);
      setError(`Error: ${res.statusText}`);
      return;
    }
    setShowForm(false);
    setEditingContracts(null);
    fetchContracts();
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Do you want to delete this contract?")){
      return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/contracts/${id}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
    fetchContracts();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => {
          setShowForm(!showForm);
          setEditingContracts(null);
          }}>Add Contracts</button>
      </div>
      {showForm && 
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <form>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
          <label className="text-xs text-gray-500 block mb-1">Employee ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.emp_id} onChange={(e) => setForm({...form, emp_id:e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Customer ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.customer_id} onChange={(e) => setForm({...form, customer_id: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Contract Type</label>
          <select className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" value={form.contract_type} onChange={e => setForm({...form, contract_type: e.target.value})}>
            <option value="">Select type</option>
            <option value="temporary">Temporary</option>
            <option value="standard">Standard</option>
          </select>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Salary</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" step="0.01" value={form.monthly_salary} onChange={(e) => setForm({...form, monthly_salary:e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Start Date</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">End Date</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})}/>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" onClick={changeContracts}>{editingContracts ? "Edit" : "Add"}</button>
      </form>
      </div>}
      <div className="border border-gray-200 rounded overflow-hidden"> 
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Customer ID</th>
              <th className="px-4 py-3 text-left">Contract Type</th>
              <th className="px-4 py-3 text-left">Monthly Salary</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contracts.map((c, idx)=>(
              <tr key={c.contract_id} className="hover:bg-gray-100">
                <td className="px-4 py-3 font-gray-400">{idx+1}</td>
                <td className="px-4 py-3 font-gray-400">{c.emp_id}</td>  
                <td className="px-4 py-3 font-gray-400">{c.customer_id}</td>
                <td className="px-4 py-3 font-gray-400">{c.contract_type}</td>
                <td className="px-4 py-3 font-gray-400">{c.monthly_salary}</td>
                <td className="px-4 py-3 font-gray-400">{c.start_date}</td>
                <td className="px-4 py-3 font-gray-400">{c.end_date}</td>
                <td className="px-4 py-3">{
                  <div className="flex gap-2">
                    <button className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs" onClick={() => handleDelete(c.contract_id)}>Delete</button>
                    <button onClick={()=>{
                      setEditingContracts(c);
                      setForm({...form, emp_id: c.emp_id, customer_id: c.customer_id, contract_type: c.contract_type, monthly_salary: c.monthly_salary, start_date: c.start_date, end_date: c.end_date})
                      setShowForm(true);
                    }} className="text-blue-500 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 text-xs">Edit</button>
                  </div>}</td>
              </tr>
        ))}
          </tbody>
        </table>  
      </div>
    </div>
  )
}

export default Contracts
