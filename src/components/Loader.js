import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => {
            setIsDarkMode(e.matches);
        };

        darkModeMediaQuery.addEventListener('change', handleChange);
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return (
        <ThreeDots
            visible={true}
            height="28"
            width="80"
            color={isDarkMode ? '#374151' : 'white'}
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}

export default Loader