"use client"

import React from 'react'
import { useRef, useState } from 'react';
import Loader from './Loader';

const HelpForm = () => {
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState(null);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        public_profile_url: '',
        arcade_points_shown: '',
        arcade_points_org: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const scriptURL = "https://script.google.com/macros/s/AKfycbxMY8yT-Npyyh4Mrq7PmjDna24hXceIch8UoRPWgrDtCgAsO4v1GpyR4LNbHxYHifJrQA/exec";
        const form = formRef.current;
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: new FormData(form),
            });

            if (response.ok) {
                // console.log('Form successfully submitted');
                setFormData({
                    name: '',
                    email: '',
                    public_profile_url: '',
                    arcade_points_shown: '',
                    arcade_points_org: '',
                    message: '',
                });
                setLoading(false);
                setResponseText("Thank You for your response! We'll get back to you soon.");
            } else {
                console.error('Form submission error');
                setLoading(false);
                setResponseText("Internal Server Error! Couldn't submit the form.");
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setLoading(false);
            setResponseText("Some error occured! Couldn't submit the form.");
        }
        // console.log(formData);
        setLoading(false);
    };

    return (
        <section className='container mx-auto'>
            <form ref={formRef} onSubmit={handleSubmit} className="m-8 max-w-lg mx-auto p-6 bg-gray-600 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="public_profile_url">
                        Public Profile URL
                    </label>
                    <input
                        id="public_profile_url"
                        name="public_profile_url"
                        type="url"
                        value={formData.public_profile_url}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="arcade_points_shown">
                        Arcade Points Shown Here
                    </label>
                    <input
                        id="arcade_points_shown"
                        name="arcade_points_shown"
                        type="number"
                        value={formData.arcade_points_shown}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="arcade_points_org">
                        Arcade Points You Think
                    </label>
                    <input
                        id="arcade_points_org"
                        name="arcade_points_org"
                        type="number"
                        value={formData.arcade_points_org}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                        rows="4"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="flex justify-center items-center w-full text-gray-950 font-bold text-xl bg-gray-300 py-2 px-4 rounded hover:bg-gray-200"
                    >
                        {loading ? <Loader /> : "Submit"}
                    </button>
                </div>
            </form>
            {responseText && <h1 className='text-center font-xl text-gray-100 mb-4'>{responseText}</h1>}
        </section>
    )
}

export default HelpForm