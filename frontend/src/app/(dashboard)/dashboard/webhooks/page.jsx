'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '@/libs/axios'; 

const WebhooksPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/webhooks/logs');
      setLogs(response.data.data.logs);
    } catch (error) {
      toast.error('Failed to fetch webhook logs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (logId) => {
    try {
      await axios.post(`/webhooks/logs/${logId}/retry`);
      toast.success('Webhook retry triggered successfully.');
      fetchLogs(); // Refresh logs after retry
    } catch (error) {
      toast.error('Failed to retry webhook.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Webhook Logs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">URL</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Attempt</th>
                <th className="py-2 px-4 border-b">Response Status</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="py-2 px-4 border-b">{log.url}</td>
                  <td className="py-2 px-4 border-b">{log.status}</td>
                  <td className="py-2 px-4 border-b">{log.attempt}</td>
                  <td className="py-2 px-4 border-b">{log.responseStatusCode}</td>
                  <td className="py-2 px-4 border-b">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {log.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(log._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;