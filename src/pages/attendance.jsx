import React, { useEffect, useState } from 'react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({shift_id: 0, check_in: '', status: ''});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(false);
  const token = localStorage.getItem("token");
  
  const fetchAttendance = async () => {
    setLoading(true);
    await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {headers: {Authorization: `Bearer ${token}`}})
    .then((res) => {
        if(!res.ok){
            throw new Error("Unable to fetch attendance");
        }
        return res.json();
    })
    .then((a) => {
        setAttendance(a);
        setLoading(false);
    })
    .catch(
        () => {
            setError("Failed to fetch attendance");
            setLoading(false);
        }
    )
  }

  useEffect(() => {
    fetchAttendance();
  },[])

  const changeAttendance = async () => {
    const url = editingAttendance ? `${import.meta.env.VITE_API_URL}/attendance/${editingAttendance.attendance_id}` : `${import.meta.env.VITE_API_URL}/attendance`;
    const method = editingAttendance ? "PUT" : "POST";
    const payload = {
      shift_id : parseInt(form.shift_id),
      check_in : form.check_in==="" ? null : form.check_in,
      status : form.status
    };
    const res = await fetch(url, {method, headers: {"Content-Type" : "application/json", Authorization: `Bearer ${token}`}, body: JSON.stringify(payload)});
    if(!res.ok){
      const errorData = await res.json();
      console.error("Validation error details: ", errorData);
      setError(`Error: ${res.statusText}`);
      return;
    }
    setShowForm(false);
    setEditingAttendance(null);
    fetchAttendance();
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Do you want to delete this contract?")){
      return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {method: "DELETE", headers: {Authorization: `Bearer ${token}`}});
    fetchAttendance();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className='text-2xl font-semibold'>Attendance</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => {
          setShowForm(!showForm);
        }}>Add Attendance</button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg mb-6 p-4">
      {showForm && 
        <form>
          <div className="grid grid-cols-3 gap-4">
          <div>
          <label className="text-xs text-gray-500 block mb-1">Shift ID</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="number" value={form.shift_id} onChange={(e) => setForm({...form, shift_id: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Check In</label>
          <input className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" type="time" value={form.check_in} onChange={(e) => setForm({...form, check_in: e.target.value})}/>
          </div>
          <div>
          <label className="text-xs text-gray-500 block mb-1">Status</label>
          <select className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-blue-400" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
            <option value="">Select Status</option>
            <option value="On Time">On Time</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
          </div>
          </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg my-2 text-sm hover:bg-blue-700" onClick={changeAttendance}>{editingAttendance ? "Edit" : "Add"}</button>
      </form>}  
      </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Shift ID</th>
              <th className="px-4 py-3 text-left">Check In</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendance.map((e,idx)=>(
              <tr className="hover:bg-gray-50" key={e.attendance_id}>
                <td className="px-4 py-3 text-gray-400">{idx+1}</td>
                <td className="px-4 py-3 text-gray-400">{e.shift_id}</td>
                <td className="px-4 py-3 text-gray-400">{e.check_in}</td>
                <td className="px-4 py-3 text-gray-400">{e.status}</td>
                <td className="px-4 py-3">
                  <button className="text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-xs" onClick={() => handleDelete(e.attendance_id)}>Delete</button>
                  <button onClick={() =>{
                    setEditingAttendance(e);
                    setShowForm(true);
                    setForm({...form, shift_id: e.shift_id, check_in: e.check_in, status: e.status});
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

export default Attendance
