import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiPath';
import {jwtDecode} from 'jwt-decode';

const CareTakerDashboard = () => {
  const [outings, updateOutings] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [currentOuting, setCurrentOuting] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [careTakerName, setcareTakerName] = useState('');

  useEffect(() => {
    getOutings();
  }, [selectedDate]);

  useEffect(() => {
    getName();
  }, []);
  
  const getName = () => {
    const token = localStorage.getItem('loginToken');
    if (token) {
      const decoded = jwtDecode(token);
      setcareTakerName(decoded.name);
    }
  };

  async function getOutings() {
    try {
      let response = await fetch(`${API_URL}/outing/allOutings`);
      let res = await response.json();
      const outingsData = res.data;
      
      const filteredOutings = outingsData.filter(outing => 
        new Date(outing.requestDate).toISOString().split("T")[0] === selectedDate
      );
      
      updateOutings(filteredOutings);

      const approved = filteredOutings.filter(outing => outing.status === "approved").length;
      const pending = filteredOutings.filter(outing => outing.status === "pending").length;
      const rejected = filteredOutings.filter(outing => outing.status === "rejected").length;

      setApprovedCount(approved);
      setPendingCount(pending);
      setRejectedCount(rejected);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditClick = (outing) => {
    setCurrentOuting(outing);
    setShowModal(true);
  };

  async function updateOutingStatus() {
    try {
      const response = await fetch(`${API_URL}/outing/update-outing/${currentOuting._id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("loginToken")
        },
        body: JSON.stringify({
          status: currentOuting.status,
        }),
      });

      if (response.ok) {
        getOutings();
        setShowModal(false);
      } else {
        console.error("Failed to update outing status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const displayedOutings = outings
    .filter(outing => (filterStatus ? outing.status === filterStatus : true))
    .filter(outing => (filterYear ? outing.year === filterYear : true))
    .filter(outing => 
      outing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outing.studentId.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      outing.year.toString().includes(searchTerm)
    );

  return (
    <div className="flex-grow p-4 md:p-6">
      {/* Responsive Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
  {/* Left-aligned Welcome Message */}
  <div className="flex justify-center md:justify-start mb-4 md:mb-0 w-full md:w-auto">
    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:text-left">
      Welcome, Mr. {careTakerName}
    </h1>
  </div>

  {/* Right-aligned Date Picker and Logout Button */}
  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 w-full md:w-auto justify-center md:justify-end">
    <input 
      type="date" 
      value={selectedDate} 
      onChange={(e) => setSelectedDate(e.target.value)} 
      className="border rounded p-2 w-full md:w-auto"
    />
    
    <button
      onClick={() => {
        localStorage.removeItem('loginToken');
        window.location.href = '/login';
      }}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
    >
      Logout
    </button>
  </div>
</header>


      {/* Date Picker */}
      

      {/* Outing Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center cursor-pointer" onClick={() => setFilterStatus('')}>
          <h2 className="text-2xl font-bold">{outings.length}</h2>
          <p>Total Outings</p>
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg text-center cursor-pointer" onClick={() => setFilterStatus('approved')}>
          <h2 className="text-2xl font-bold">{approvedCount}</h2>
          <p>Approved</p>
        </div>
        <div className="bg-purple-100 text-purple-700 p-4 rounded-lg text-center cursor-pointer" onClick={() => setFilterStatus('pending')}>
          <h2 className="text-2xl font-bold">{pendingCount}</h2>
          <p>Pending</p>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center cursor-pointer" onClick={() => setFilterStatus('rejected')}>
          <h2 className="text-2xl font-bold">{rejectedCount}</h2>
          <p>Rejected</p>
        </div>
      </div>

      {/* Search and Filter Options */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name, ID, or Year"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="p-2 border rounded w-full md:w-auto"
        >
          <option value="">Filter by Year</option>
          {["P1", "P2", "E1", "E2", "E3", "E4"].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Outings Table */}
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">All Outings for Selected Date</h2>
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 font-medium">S.no</th>
              <th className="p-4 font-medium">Id</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Year</th>
              <th className="p-4 font-medium">Reason</th>
              <th className="p-4 font-medium">Slot</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Approved by</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedOutings.map((outing, index) => (
              <tr key={outing._id} className="border-t">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{outing.studentId.id}</td>
                <td className="p-4">{outing.name}</td>
                <td className="p-4">{outing.year}</td>
                <td className="p-4">{outing.reason}</td>
                <td className="p-4">{outing.slot}</td>
                <td className="p-4">{outing.status}</td>
                <td className="p-4 text-green-600">{outing.careTakerId ? outing.careTakerId.name : "N/A"}</td>
                <td className="p-4 text-blue-600 cursor-pointer" onClick={() => handleEditClick(outing)}>
                  Edit
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Update Outing Status</h2>
            <select
              value={currentOuting.status}
              onChange={(e) => setCurrentOuting({ ...currentOuting, status: e.target.value })}
              className="p-2 border rounded mb-4 w-full"
            >
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={updateOutingStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareTakerDashboard;
