import React from 'react'
import {useState, useEffect} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { LuArrowUp } from "react-icons/lu";

const AiAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
      const fetchHistory = async () => {
        try{
          const history = await fetch(`${import.meta.env.VITE_API_URL}/agent/history`, {headers : {Authorization : `Bearer ${token}`}});
          if(history.ok){
            const data = await history.json();
            setMessages(data.messages);
          }
        } catch{
          
        }
      };
      fetchHistory();
    },[]);

    const sendMessage = async () => {
      if(!input.trim()) return;
      const userMessage = {role : 'user', content: input};
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);
        try{
            const payload = {question : input};
            const res = await fetch(`${import.meta.env.VITE_API_URL}/agent/ask`, {method : "POST" , headers : {"Content-Type" : "application/json" , Authorization : `Bearer ${token}`}, body: JSON.stringify(payload)});
            if(!res.ok){
              throw new Error('Failed to fetch');
            }
            const data = await res.json();
            const assistantMessage = {role : 'assistant', content: data.answer};
            setMessages(prev => [...prev, assistantMessage]);
        }catch{
          setError("Could not fetch the prompt answer.");
        }finally{
          setLoading(false);
        }
    }

    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">  {/*So it's really the combination: h-screen on the outer container sets a fixed total height, flex-1 makes the message area claim "whatever space is left after the input box," and overflow-y-auto makes that specific area scrollable once its content overflows.*/}
          {
            messages.map((msg, idx)=>(
              <div key={idx} className={`flex ${msg.role==='user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-md ${msg.role==="user"?"bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          }
          {loading && <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-100 text-sm">
              Thinking...
            </div>
          </div>}
        </div>
        <div className="relative flex items-end w-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 justify-between mb-6 focus-within:border-gray-400 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-800/80 transition-all duration-200 shadow-sm">

          <TextareaAutosize className="w-full resize-none bg-transparent px-2 py-4 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none" minRows={1} maxRows={6} placeholder="Input here..." value={input} onChange={(e)=>setInput(e.target.value)}/>
          <button type="button" onClick={sendMessage} className="p-3 mb-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <LuArrowUp className="w-5 h-5"/>
          </button>
        </div>
      </div>
  )
}
export default AiAssistant;
