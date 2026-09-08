import React from 'react';
const dummyDeals = [
  {
    _id: "1",
    client: { name: "Rajesh Kumar" },
    stage: "Closed",
    finalPrice: 7500000,
    commissionAmount: 225000
  },
  {
    _id: "2",
    client: { name: "Amit Sharma" },
    stage: "Negotiation",
    finalPrice: 4500000,
    commissionAmount: 135000
  }
];
const DealDashboard = ({ deals = dummyDeals }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Deal Dashboard</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Final Price</th>
              <th className="px-6 py-4 text-right">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deals.length > 0 ? (
              deals.map((deal) => (
                <tr key={deal._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{deal.client?.name || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      deal.stage === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">₹{deal.finalPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">
                    ₹{deal.commissionAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No deals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealDashboard; // <--- THIS WAS MISSING