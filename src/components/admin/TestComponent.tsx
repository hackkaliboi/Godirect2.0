import { useState, useEffect } from "react";

export function TestComponent() {
  const [message, setMessage] = useState("Test component is working!");

  useEffect(() => {
    console.log("TestComponent mounted");
  }, []);

  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Test Component</h2>
      <p>{message}</p>
      <button 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setMessage("Button clicked! Component is interactive.")}
      >
        Click Me
      </button>
    </div>
  );
}