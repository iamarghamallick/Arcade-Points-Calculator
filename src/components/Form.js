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
        } else if (badgeVal === "monsoonBadges") {
            setListOfBadges(result.monsoon);
            setBadgeValText("Monsoon Badges");
            setBadgeValPoint(result.monsoon.length);
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
            <div className='md: container w-80 md:w-[97%] mt-8 mb-8 p-4 bg-gray-500 shadow-md rounded flex flex-col  md:flex-row justify-center items-center gap-6'>
                <form onSubmit={handleSubmit} className="w-full md:w-[50%]">
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
                    {result ? (
                        <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                            <h2 className="text-lg text-center font-bold mb-2">Arcade Points: {arcadePoints}</h2>
                            {milestoneData && <h2 className="text-lg text-center font-bold mb-2 text-green-400">{milestoneData} Milestone</h2>}
                        </div>
                    ) : (
                        <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                            <h2 className="text-base text-center font-bold mb-2">Arcade Points will appear here</h2>
                        </div>
                    )}
                </form>

                <div className='w-full md:w-[50%]'>
                    <div className='p-2 font-bold text-center underline'>Please Note</div>
                    <div className='p-2'>1. <strong>Completion Badges</strong> may be counted as a <strong>Skill Badge.</strong></div>
                    <div className='p-2'>2. Arcade Points shown here doesn't include any <strong>Bonus Points</strong> of the <strong>Facilitator Program</strong>.</div>
                    <div className='p-2 text-green-300 text-center'>Last Updated: <strong>24 July, 2024</strong></div>
                </div>
            </div>
            {result && <section className='container'>
                <select name="badges" id="badges" className='mt-4 mb-4 w-full md:min-w-[700px] bg-slate-600 p-4 text-xl font-bold outline-none cursor-pointer' onChange={handleBadgeChange} defaultValue="allBadges">
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="allBadges">All Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="gameBadges">Game Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="triviaBadges">Trivia Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="monsoonBadges">Monsoon Badges</option>
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
                <h1 className='text-gray-100 text-sm mt-4 ml-1'># Skill Badges earned during <strong>Skill Badge Monsoon Challenge 2024</strong> are only displayed under <strong>Monsoon Badges Category.</strong></h1>
                <h1 className='text-gray-100 text-sm mb-4 ml-1'># If you believe there is an error in the points calculated, please fill out <Link href="/help"><strong className='underline'>this form</strong></Link>.</h1>
            </section>}
        </>
    );
};

export default Form;
