import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const SpecialistRecommendation = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const {backendUrl} = useContext(AppContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      alert("Please enter a description of your symptoms.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(backendUrl + "/api/user/suggest-specialist", { description });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ success: false, message: "Error fetching recommendation. Please try again later." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-600 mb-10">Find the Right Specialist</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow p-6"
      >
        <label className="block text-11 font-medium text-gray-500 mb-2">
          Describe your symptoms
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          placeholder="e.g., I have a severe headache and nausea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="mt-4 w-full bg-primary text-white font-semibold py-2 rounded-lg shadow hover:bg-green-400"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Get Recommendation"}
        </button>
      </form>

      {result && (
        <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow p-6">
          {result.success ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800">
                Recommendation
              </h2>
              <p className="text-gray-600">{result.message}</p>
              <ul className="mt-4 list-disc list-inside text-gray-700">
                {result.specialists.map((specialist) => (
                  <li key={specialist}>{specialist}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-red-600">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialistRecommendation;
