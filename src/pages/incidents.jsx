import React, { useEffect, useState } from 'react';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({emp_id: 0, customer_id: 0, description: '', loss_amount: 0, incident_date: ''});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIncidents, setEditingIncidents] = useState(false);
  const token = localStorage.getItem("token");
  
  const fetchIncidents = async () => {
    setLoading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/incidents`, {headers: {Authorization: `Bearer ${token}`}})
      if(!res.ok){
        throw new Error("Failed to fetch incidents");
      }
      const data = await res.json();
      setIncidents(data);
    }catch{
      setError("Could not load incidents");
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIncidents();
  },[])

  const changeIncidents = async () => {
    try{
      const url = editingIncidents ? `${import.meta.env.VITE_API_URL}/incidents/${editingIncidents.incident_id}` : `${import.meta.env.VITE_API_URL}/incidents`;
      const method = editingIncidents ? "PUT" : "POST";
      const payload = {
        emp_id : parseInt(form.emp_id),
        customer_id: parseInt(form.customer_id),
        description: form.description,
        loss_amount: form.loss_amount,
        incident_date: form.incident_date==="" ? null : form.incident_date
      };
      const res = await fetch(url, {method, headers: {"Content-Type" : "application/json", Authorization: `Bearer ${token}`}, body: JSON.stringify(payload)});
      if(!res.ok){
        throw new Error("Failed to save");
      }
      setShowForm(false);
      setEditingIncidents(null);
      await fetchIncidents();
    }catch(err){
      console.error(err);
      setError("Failed to save incident");
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Do you want to delete this contract?")){
      return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/incidents/${id}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
    await fetchIncidents();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Incidents</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => {
          setShowForm(!showForm);
        }}>Add Incidents</button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      {showForm && 
        <form>
          <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
          <label className="text-xs text-gray-500 block mb-1">Employee ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.emp_id} onChange={(e) => setForm({...form, emp_id: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Customer ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.customer_id} onChange={(e) => setForm({...form, customer_id: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Description</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Loss Amount</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" step="0.01" value={form.loss_amount} onChange={(e) => setForm({...form, loss_amount:e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Incident Date</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="date" value={form.incident_date} onChange={(e)=>setForm({...form, incident_date:e.target.value})}/>
          </div>
        </div>
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" onClick={changeIncidents}>{editingIncidents ? "Edit" : "Add"}</button>
      </form>}  
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Employee ID</th>
              <th className="px-4 py-3 text-left">Customer ID</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Loss Amount</th>
              <th className="px-4 py-3 text-left">Incident Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incidents.map((e,idx)=>(
              <tr key={e.incident_id} className="hover:bg-gray-100">
                <td className="px-4 py-3 font-gray-400">{idx+1}</td>
                <td className="px-4 py-3 font-gray-400">{e.emp_id}</td>
                <td className="px-4 py-3 font-gray-400">{e.customer_id}</td>
                <td className="px-4 py-3 font-gray-400">{e.description}</td>
                <td className="px-4 py-3 font-gray-400">{e.loss_amount}</td>
                <td className="px-4 py-3 font-gray-400">{e.incident_date}</td>
                <td className="px-4 py-3">
                  <button className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs" onClick={() => handleDelete(e.incident_id)}>Delete</button>
                  <button onClick={() =>{
                    setEditingIncidents(e);
                    setShowForm(true);
                    setForm({...form, emp_id: e.emp_id, customer_id: e.customer_id, description: e.description, loss_amount: e.loss_amount, incident_date: e.incident_date});
                  }} className="text-blue-500 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 text-xs">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Incidents;
