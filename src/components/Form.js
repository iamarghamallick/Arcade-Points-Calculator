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
    const [status, setStatus] = useState("Waiting for the Input...");

    const handleChange = (e) => {
        setStatus("Waiting for a valid Input...");
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (validateURL(value))
            setStatus("URL validated, calculate now.")
    };

    const validateURL = (url) => {
        const prefix = 'https://www.cloudskillsboost.google/public_profiles/';
        return url.startsWith(prefix);
    };

    const handleBadgeChange = (e) => {
        const badgeVal = e.target.value;
        if (badgeVal === "allBadges") {
            setListOfBadges(result.badges);
            setBadgeValText("All Badges");
            setBadgeValPoint(totalPoints);
        } else if (badgeVal === "specialBadges") {
            setListOfBadges(result.special);
            setBadgeValText("Special Badges");
            setBadgeValPoint(result.special.length);
        } else if (badgeVal === "levelBadges") {
            setListOfBadges(result.level);
            setBadgeValText("Level Badges");
            setBadgeValPoint(result.level.length);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startTime = performance.now();
        setLoading(true);
        setStatus("Waiting for the server...");
        setError(null);

        try {
            if (!validateURL(formData.url)) {
                setError("Wrong URL");
                setTimeout(() => {
                    setError(null);
                    setStatus("Waiting for a valid Input...");
                }, 2000);
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
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        console.log(`Response Time: ${timeTaken} ms`);
    };

    return (
        <>
            <div className='md: container w-80 lg:w-[1000px] md:w-[97%] mt-8 mb-8 p-4 bg-gray-500 shadow-md rounded flex flex-col  md:flex-row justify-center items-center gap-6'>
                <form onSubmit={handleSubmit} className="w-full md:w-[50%]">
                    <div className="mb-4">
                        <input
                            type="text"
                            id="url"
                            name="url"
                            placeholder='Paste Public-Profile-URL here'
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[#101823] border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button type="submit" className="flex justify-center items-center w-full text-gray-950 font-bold text-xl bg-gray-300 py-2 px-4 rounded hover:bg-gray-200">
                        {loading ? <Loader /> : "Calculate"}
                    </button>
                    {result ? (
                        <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                            <h2 className="text-lg text-center font-bold mb-2 text-green-300">Arcade Points: {arcadePoints}</h2>
                            {milestoneData && <h2 className="text-lg text-center font-bold mb-2 text-green-400">{milestoneData} Milestone</h2>}
                        </div>
                    ) : (
                        <div className="mt-4 p-4 bg-gray-900 rounded text-center">
                            <h2 className={`text-base text-center mb-2 ${error ? "text-red-500" : ""}`}>{error ? error : status}</h2>
                        </div>
                    )}
                </form>

                <div className='w-full md:w-[50%]'>
                    <div className='p-2 font-bold text-center underline'>Please Note</div>
                    <div className='p-2 text-center'>Arcade Points shown here don&apos;t include any <strong>Bonus Points</strong> of the <strong>Facilitator Program</strong>.</div>
                    <div className='p-2 text-green-300 text-center'>Last Updated: <strong>24 July, 2024</strong></div>
                </div>
            </div>
            {result && <section className='container'>
                <h1 className='p-2 font-bold text-center underline'>Details</h1>
                <select name="badges" id="badges" className='mt-4 mb-4 w-full md:min-w-[700px] bg-slate-600 p-4 text-xl font-bold outline-none cursor-pointer' onChange={handleBadgeChange} defaultValue="allBadges">
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="allBadges">All Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="levelBadges">Level Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="triviaBadges">Trivia Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="specialBadges">Special Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="monsoonBadges">Monsoon Badges</option>
                    <option className='rounded-lg bg-slate-900 p-2' type="button" value="skillBadges">Skill Badges</option>
                </select>
                <table className='border-collapse w-full mb-4'>
                    <tbody>
                        <tr className=' border border-gray-200'>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600 border-r border-gray-400'>Title</th>
                            <th className='hidden lg:block text-center p-2 text-bold text-xl bg-slate-600 border-r border-gray-400'>Date Earned</th>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600'>Arcade Point</th>
                        </tr>
                        {listOfBadges.map((badge) => {
                            return <tr key={badge.title} className=' border border-gray-400'>
                                <td className='text-left p-2 border-r border-gray-400'>
                                    <Link href={badge.badgeURL} target='_blank'>{badge.title}</Link>
                                </td>
                                <td className='hidden lg:block text-center p-2 border-r border-gray-400'>{badge.dateEarned}</td>
                                <td className='text-center text-bold p-2'>{badge.points}</td>
                            </tr>
                        })}
                        <tr className=' border border-gray-200'>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600 border-r lg:border-0 border-gray-400'>{`Total Points Earned from ${badgeValText}`}</th>
                            <th className='hidden lg:block text-center p-2 text-bold text-xl bg-slate-600 border-r border-gray-400'>-</th>
                            <th className='text-center p-2 text-bold text-xl bg-slate-600'>{badgeValPoint}</th>
                        </tr>
                    </tbody>
                </table>
                <div className='flex text-left gap-2 mt-2 p-1 text-sm'>
                    <h1>#</h1>
                    <h1>Skill Badges earned during <strong>Skill Badge Monsoon Challenge 2024</strong> are only displayed under <strong>Monsoon Badges Category.</strong></h1>
                </div>
                <div className='flex text-left gap-2 mb-8 p-1 text-sm'>
                    <h1>#</h1>
                    <h1>If you believe there is an error in the points calculated, please fill out <Link href="/help"><strong className='underline'>User Query Form</strong></Link>.</h1>
                </div>
            </section>}
        </>
    );
};

export default Form;
