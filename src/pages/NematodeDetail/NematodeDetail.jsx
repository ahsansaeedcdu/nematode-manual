import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NematodeDetail = () => {
  const { name } = useParams();
  const [nematodeData, setNematodeData] = useState(null);

  const imageDetails = [
    { path: '/data/RKN Juvenile Under Microscope.jpg', name: 'RKN Juvenile Under Microscope.jpg' },
    { path: '/data/Root Galls on Tomato Caused by RKN.jpg', name: 'Root Galls on Tomato Caused by RKN.jpg' },
    { path: '/data/RKN Juvenile Under Microscope.jpg', name: 'RKN Juvenile Under Microscope.jpg' },
    { path: '/data/Root Galls on Tomato Caused by RKN.jpg', name: 'Root Galls on Tomato Caused by RKN.jpg' },
  ];

  useEffect(() => {
    fetch('/data/nematode_data_grouped_by_letter.json')
      .then(res => res.json())
      .then(data => {
        const allItems = Object.values(data).flat();
        const match = allItems.find(n => n.name === decodeURIComponent(name));
        setNematodeData(match || null);
      })
      .catch(err => console.error('Error loading nematode detail:', err));
  }, [name]);

  if (!nematodeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600 p-8">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div>Loading or Nematode not found...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 md:p-16 bg-gray-100 text-gray-800 flex flex-col items-center">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 border-b-4 border-indigo-900 pb-3 inline-block">
          {nematodeData.name}
        </h1>
      </header>

      {/* Image Gallery Section */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {imageDetails.map((image, index) => (
          <div key={index} className="flex flex-col items-center bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={image.path}
              alt={image.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <p className="text-center text-sm font-semibold text-gray-700">{image.name}</p>
          </div>
        ))}
      </div>

      {/* Information Cards Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Associated Plants Card */}
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4 border-b-2 border-gray-200 pb-2">
            Associated Plants
          </h3>
          <ul className="list-none p-0 space-y-2 text-gray-600">
            {nematodeData.plants_associated.map((plant, i) => (
              <li key={i} className="bg-gray-50 p-3 rounded-lg">{plant}</li>
            ))}
          </ul>
        </div>

        {/* States Card */}
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4 border-b-2 border-gray-200 pb-2">
            States
          </h3>
          <p className="text-gray-600">{nematodeData.states.join(', ')}</p>
        </div>

        {/* References Card */}
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4 border-b-2 border-gray-200 pb-2">
            References
          </h3>
          <ul className="list-none p-0 space-y-2 text-gray-600">
            {nematodeData.references.map((ref, i) => (
              <li key={i} className="bg-gray-50 p-3 rounded-lg">{ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NematodeDetail;