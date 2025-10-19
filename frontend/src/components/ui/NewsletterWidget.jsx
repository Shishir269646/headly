import { useState } from 'react';

export default function NewsletterWidget() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Subscribing:', email);
        setEmail('');
    };

    return (
        <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3">Newsletter</h3>
            <p className="text-xs sm:text-sm mb-4 text-blue-100 dark:text-blue-200">
                Subscribe to get the latest tech news delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded text-gray-900 dark:text-gray-100 dark:bg-gray-800 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                >
                    Subscribe
                </button>
            </form>
        </div>
    );
}