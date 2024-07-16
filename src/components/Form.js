"use client"
import { useState } from 'react';
import Loader from './Loader';
import Link from 'next/link';

const Form = () => {
    const [formData, setFormData] = useState({ url: '' });
    const [arcadePoints, setArcadePoints] = useState(null);
    const [totalPoints, setTotalPoints] = useState(null);
    const [milestoneData, setMilestoneData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [listOfBadges, setListOfBadges] = useState(null);
    const [badgeValText, setBadgeValText] = useState("All Badges");
    const [badgeValPoint, setBadgeValPoint] = useState(0);

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

    const handleBadgeChange = (e) => {
        const badgeVal = e.target.value;
        if (badgeVal === "allBadges") {
            setListOfBadges(result.badges);
            setBadgeValText("All Badges");
            setBadgeValPoint(totalPoints);
        } else if (badgeVal === "gameBadges") {
            setListOfBadges(result.game);
            setBadgeValText("Game Badges");
            setBadgeValPoint(result.game.length);
        } else if (badgeVal === "triviaBadges") {
            setListOfBadges(result.trivia);
            setBadgeValText("Trivia Badges");
            setBadgeValPoint(result.trivia.length);
        } else if (badgeVal === "specialBadges") {
            setListOfBadges(result.special);
            setBadgeValText("Special Badges");
            setBadgeValPoint(result.special.length * 2);
        } else if (badgeVal === "skillBadges") {
            setListOfBadges(result.skill);
            setBadgeValText("Skill Badges");
            setBadgeValPoint(result.skill.length / 2);
        }
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
            console.log(data);
            setResult(data);
            setArcadePoints(data.points);
            setMilestoneData(data.milestone);
            setTotalPoints(data.totalPoints);
            setBadgeValPoint(data.totalPoints);
            setListOfBadges(data.badges);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-80 md:w-96 mt-8 p-4 bg-gray-500 shadow-md rounded">
                <div className="mb-4">
                    <label htmlFor="url" className="block text-gray-200 font-bold mb-2 text-center">Paste the Public Profile URL</label>
                    <input
                        type="text"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#101823] border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button type="submit" className="flex justify-center items-center w-full text-gray-950 font-bold text-xl bg-gray-300 py-2 px-4 rounded hover:bg-gray-200">
                    {loading ? <Loader /> : "Calculate"}
                </button>
                {error && <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                    <h2 className="text-lg text-center font-normal text-red-500 mb-2">{error}</h2>
                </div>}
                {arcadePoints ? (
                    <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                        <h2 className="text-lg text-center font-bold mb-2">Arcade Points: {arcadePoints}</h2>
                        {milestoneData && <h2 className="text-lg text-center font-bold mb-2 text-green-400">{milestoneData} Milestone</h2>}
                    </div>
                ) : (
                    <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                        <h2 className="text-base text-center font-bold mb-2">Arcade Points will appear here</h2>
                    </div>
                )}
                <div className='p-2'>Note: Completion Badges may be counted as a Skill Badge.</div>
                <div className='p-2 text-green-400'>Last Updated: 15 July, 2024</div>
            </form>
            {result && <section>
                <select name="badges" id="badges" className='mt-4 mb-4 w-full md:min-w-[700px] bg-slate-600 p-4 text-xl font-bold outline-none cursor-pointer' onChange={handleBadgeChange} defaultValue="allBadges">
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="allBadges">All Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="gameBadges">Game Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="triviaBadges">Trivia Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="specialBadges">Special Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="skillBadges">Skill Badges</option>
                </select>
                <table className='border-collapse w-full mb-4'>
                    <tbody>
                        <tr className=' border border-gray-200'>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600 border-r border-gray-400'>Title</th>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600'>Arcade Point</th>
                        </tr>
                        {listOfBadges.map((badge) => {
                            return <tr key={badge.title} className=' border border-gray-400'>
                                <td className='text-left p-2 border-r border-gray-400'>
                                    <Link href={badge.badgeURL} target='_blank'>{badge.title}</Link>
                                </td>
                                <td className='text-center text-bold p-2'>{badge.points}</td>
                            </tr>
                        })}
                        <tr className=' border border-gray-200'>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600 border-r border-gray-400'>{`Total Points Earned from ${badgeValText}`}</th>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600'>{badgeValPoint}</th>
                        </tr>
                    </tbody>
                </table>
            </section>}
        </>
    );
};

export default Form;
