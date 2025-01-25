import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const SearchResults = () => {
    const location = useLocation();
    // const { query } = location.state || {};
    const query = new URLSearchParams(location.search).get('query'); 
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    

    const { backendUrl, token } = useContext(AppContext); // Assume `token` is available in the context

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!query) {
                setError('No search query provided');
                setLoading(false);
                return;
            }

            try {
                console.log('Query:', query);
                // const { data } = await axios.post(backendUrl + '/api/user/search-doctors', query);

                const { data } = await axios.post(
                    `${backendUrl}/api/user/search-doctors`,
                    { name: query }, { headers: { Authorization: `Bearer ${token}` } } 
                );

                if (data.success) {
                    console.log(data.doctors);
                    setDoctors(data.doctors);
                } else {
                    setError(data.message || 'An error occurred while fetching doctors.');
                }
            } catch (error) {
                    console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [query, backendUrl]);

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
          <h1 className="text-3xl font-medium mb-4 text-gray-600">Search Results</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && doctors.length > 0 && (
            <div className="w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
              {doctors.map((doctor) => (
                <div
                  onClick={() => {
                    navigate(`/appointment/${doctor._id}`);
                    scrollTo(0, 0);
                  }}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-15px] transition-all duration-500"
                  key={doctor._id}
                >
                  <img className="bg-blue-50" src={doctor.image} alt="" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-center text-green-500">
                      <p className="w-2 h-2 rounded-full bg-green-500"></p>
                      <p>Available</p>
                    </div>
                    <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
                    <p className="text-gray-600 text-sm">{doctor.speciality} </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && doctors.length === 0 && (
            <p className="text-gray-600">No doctors found with the given query.</p>
          )}
        </div>
      );
    };
    

export default SearchResults;
