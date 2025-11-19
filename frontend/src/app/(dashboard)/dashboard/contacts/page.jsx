'use client';

import withAuth from '@/hoc/withAuth';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/libs/axios';

function ContactsPage() {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('/contact');
                setContacts(response.data.data.contacts);
            } catch (err) {
                setError('Failed to fetch contacts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
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


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{contact.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{contact.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{contact.subject}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{contact.message}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(contact.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default withAuth(ContactsPage, ['admin']);