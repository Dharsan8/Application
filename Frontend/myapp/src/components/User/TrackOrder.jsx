import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const handleTrack = (e) => {
        e.preventDefault();
        if (orderId.trim()) {
            navigate(`/order-tracking/${orderId}`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#8A4F7D] mb-6 text-center">Track Your Order</h1>
            <form onSubmit={handleTrack} className="space-y-4">
                <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Order Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="orderId"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g. ORD-ABC123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8A4F7D] focus:border-[#8A4F7D]"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8A4F7D] hover:text-[#6d3b5f]"
                        >
                            <FaSearch size={20} />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#8A4F7D] text-white py-2 px-4 rounded-lg hover:bg-[#6d3b5f] transition-colors"
                >
                    Track Order
                </button>
            </form>
        </div>
    );
};

export default TrackOrder;