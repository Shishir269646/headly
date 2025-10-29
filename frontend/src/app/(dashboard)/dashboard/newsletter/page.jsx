'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/libs/axios';

export default function NewsletterPage() {
    const { user } = useAuth();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscribers = async () => {
            if (user?.role !== 'admin') {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('/newsletter/subscribers');
                setSubscribers(response.data.data.subscribers);
            } catch (err) {
                setError('Failed to fetch subscribers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (user?.role !== 'admin') {
        return <div className="text-red-500">You do not have permission to view this page.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Newsletter Subscribers</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{subscriber.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(subscriber.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
