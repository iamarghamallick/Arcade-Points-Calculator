"use client";
import React from 'react';

const ProgressBar = ({ percentage, color, milestoneName }) => {
    const containerStyles = {
        height: '20px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '50px',
        margin: '30px 0'
    };

    const fillerStyles = {
        height: '100%',
        width: `${percentage}%`,
        backgroundColor: `${color}`,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 0.2s ease-in'
    };

    const labelStyles = {
        padding: '5px',
        color: 'white',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}></span>
            </div>
            <div className='flex justify-between px-2 py-1'>
                <span className='text-sm md:text-lg font-semibold'>{milestoneName}</span>
                <span className='text-sm md:text-lg font-semibold'>{`${percentage}% Completed`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
