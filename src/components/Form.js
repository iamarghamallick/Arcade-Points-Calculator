"use client"
import { useState } from 'react';

const Form = () => {
    const [formData, setFormData] = useState({ url: '' });
    const [responseData, setResponseData] = useState(null);
    const [milestoneData, setMilestoneData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateURL = (url) => {
        const prefix = 'https://www.cloudskillsboost.google/public_profiles/';
        return url.startsWith(prefix);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!validateURL(formData.url)) {
                setError("Wrong URL");
                return;
            }
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: formData.url }),
            });

            if (!response.ok) {
                throw new Error("Error from the Server");
            }

            const data = await response.json();
            const points = data.points;
            const milestone = data.milestone;
            setResponseData(points);
            setMilestoneData(milestone);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-80 md:w-96 p-4 bg-gray-500 shadow-md rounded">
                <div className="mb-4">
                    <label htmlFor="url" className="block text-gray-200 font-bold mb-2 text-center">Paste the Public Profile URL</label>
                    <input
                        type="text"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    {loading ? "Calculating..." : "Submit"}
                </button>
                {error && <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                    <h2 className="text-lg text-center font-normal text-red-500 mb-2">{error}</h2>
                </div>}
                {responseData ? (
                    <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                        <h2 className="text-lg text-center font-bold mb-2">Arcade Points: {responseData}</h2>
                        {milestoneData && <h2 className="text-lg text-center font-bold mb-2 text-green-400">You have reached {milestoneData} Milestone!</h2>}
                    </div>
                ) : (
                    <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                        <h2 className="text-base text-center font-bold mb-2">Arcade Points will appear here</h2>
                    </div>
                )}
                <div className='p-2'>Note: Completion Badges may be counted as a Skill Badge.</div>
                <div className='p-2 text-green-400'>Last Updated: 30th June, 2024</div>
            </form>
        </>
    );
};

export default Form;
