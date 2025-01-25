import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const RemoveDoctor = () => {
  const { doctors, aToken, getAllDoctors, removeDoctor } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  const handleRemove = async (docId) => {
    try {
      await removeDoctor(docId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              key={index}
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            >
              <img
                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
                src={doctor.image}
                alt={doctor.name}
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">{doctor.name}</p>
                <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <p>Experience: {doctor.experience}</p>
                </div>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                  onClick={() => handleRemove(doctor._id)}
                >
                  Remove Doctor
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 w-full text-center">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default RemoveDoctor;
