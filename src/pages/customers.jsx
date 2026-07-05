import React from 'react';
import {useState, useEffect} from "react";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form, setForm] = useState({customer_name: "", address: ""});
    const token = localStorage.getItem('token');
    const fetchCustomers = () => {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/customers`, {headers: {Authorization: `Bearer ${token}`}})
      .then( res => {
        if(!res.ok) throw new Error("Failed to fetch");
        return res.json();
        }
      )
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load customers");
        setLoading(false);
      })
    }

    useEffect(() => {
      fetchCustomers();
    },[]);

    const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete customer?")){
        return;
      }
      try{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/customers/${id}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
        if(!res.ok){
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || `Delete failed: ${res.status}`);
        }
        fetchCustomers();
      }catch(err){
        alert(err.message);
      }
    }    

    const handleSubmit = async () => {
      const url = editingCustomer ? `${import.meta.env.VITE_API_URL}/customers/${editingCustomer.customer_id}` : `${import.meta.env.VITE_API_URL}/customers`;
      const method = editingCustomer ? "PUT" : 'POST';

      await fetch(url, {method, headers: {"Content-Type":"application/json", Authorization: `Bearer ${token}`},
      body: JSON.stringify(form)
    });
    setShowForm(false);
    await fetchCustomers();
    }
    
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>Add Customer</button>
      </div>
      <div className="by-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      {showForm && <form>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs block text-gray-500 mb-1">Customer Name</label>
            <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="text" value={form.customer_name} onChange={e=>{setForm({...form, customer_name: e.target.value})}}></input>
          </div>
          <div>
            <label className="text-xs block text-gray-500 mb-1">Customer Address</label>
            <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="text" value={form.address} onChange={e=>{setForm({...form, address: e.target.value})}}/>
          </div>
          </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" onClick={handleSubmit}>{editingCustomer ? "Edit" : "Add"}</button>
        </form>}
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Index</th>
                <th className="px-4 py-3 text-left">Customer ID</th>
                <th className="px-4 py-3 text-left">Customer Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c,index)=>(
                <tr key={c.customer_id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 font-gray-400">{index+1}</td>
                  <td className="px-4 py-3 font-gray-400">{c.customer_id}</td>
                  <td className="px-4 py-3 font-medium">{c.customer_name}</td>
                  <td className="px-4 py-3 font-gray-400">{c.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(c.customer_id)} className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs">Delete</button>
                      <button onClick={() => {
                        setEditingCustomer(c);
                        setShowForm(true);
                        setForm({...form, customer_name: c.customer_name, address: c.address});
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

export default Customers
