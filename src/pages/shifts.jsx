import React from 'react'
import {useState, useEffect} from 'react';

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({contract_id: 0, shift_date: '', start_time: '', end_time: '', shift_hours: 0, shift_pay: 0});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState(false);
  const token = localStorage.getItem("token");

  const fetchShifts = async () => {
    setLoading(true);
    await fetch("http://127.0.0.1:8000/shifts", {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
      if(!res.ok){
        throw new Error("Failed to fetch shifts");
      }
      return res.json();
    }) 
    .then(s => {
      setShifts(s);
      setLoading(false);
    })
    .catch(()=>{
      setError("Could not fetch shifts");
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchShifts();
  },[])

  const changeShifts = async () => {
    const url = editingShift ? `http://127.0.0.1:8000/shifts/${editingShift.shift_id}` : "http://127.0.0.1:8000/shifts";
    const method = editingShift ? "PUT" : "POST";
    const payload = {
      contract_id: parseInt(form.contract_id),
      shift_date: form.shift_date==="" ? null : form.shift_date,
      start_time: form.start_time==="" ? null : form.start_time,
      end_time:form.end_time==="" ? null : form.end_time,
      shift_hours: parseFloat(form.shift_hours),
      shift_pay: parseFloat(form.shift_pay)
    }
    await fetch(url, {method, headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
      body: JSON.stringify(payload)}
    );
    setShowForm(false);
    setEditingShift(null);
    await fetchShifts();
  }

  const handleDelete = async (idx) => {
    if(!window.confirm("Are you sure you want to delete this shift?")){
      return;
    }
    await fetch(`http://127.0.0.1:8000/shifts/${idx}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
    await fetchShifts();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Shifts</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={ () => {
          setShowForm(!showForm);
          setEditingShift(null);
        }}>Add Shift</button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      {showForm &&
        <form>
          <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
          <label className="text-xs text-gray-500 block mb-1">Contract ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.contract_id} onChange={(e) => setForm({...form, contract_id: e.target.value})}></input>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Shift Date</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="date" value={form.shift_date} onChange={(e) => setForm({...form, shift_date: e.target.value})}></input>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Start Time</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400"  type="time" value={form.start_time} onChange={(e) => setForm({...form, start_time: e.target.value})}></input>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">End Time</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})}></input>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Shift Hours</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.shift_hours} onChange={e => setForm({...form, shift_hours: e.target.value})}></input>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Shift Pay</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.shift_pay} onChange={e => setForm({...form, shift_pay: e.target.value})}></input>
          </div>
          </div>
          <button className="bg-blue-600 text-sm px-4 py-2 rounded-lg text-white mt-1 hover:bg-blue-600" onClick={changeShifts}>{editingShift ? "Edit" : "Add"}</button>
        </form>}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Contract Number</th>
              <th className="px-4 py-3 text-left">Shift Date</th>
              <th className="px-4 py-3 text-left">Start Time</th>
              <th className="px-4 py-3 text-left">End Time</th>
              <th className="px-4 py-3 text-left">Shift Hours</th>
              <th className="px-4 py-3 text-left">Shift Pay</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((e,idx) => (
              <tr key={e.shift_id} className="hover:bg-gray-100">
                <td className="px-4 py-3 font-gray-400">{idx+1}</td>
                <td className="px-4 py-3 font-gray-400">{e.contract_id}</td>
                <td className="px-4 py-3 font-gray-400">{e.shift_date}</td>
                <td className="px-4 py-3 font-gray-400">{e.start_time}</td>
                <td className="px-4 py-3 font-gray-400">{e.end_time}</td>
                <td className="px-4 py-3 font-gray-400">{e.shift_hours}</td>
                <td className="px-4 py-3 font-gray-400">{e.shift_pay}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs" onClick={() => handleDelete(e.shift_id)}>Delete</button>
                    <button onClick={() => {
                      setEditingShift(e);
                      setForm({...form, contract_id: e.contract_id, shift_date: e.shift_date, start_time: e.start_time, end_time: e.end_time, shift_hours: e.shift_hours, shift_pay: e.shift_pay});
                      setShowForm(true);
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

export default Shifts;
