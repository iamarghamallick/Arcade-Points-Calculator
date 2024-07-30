"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearBuffer() {
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);
    const [completed, setCompleted] = React.useState(false);

    const duration = 2000; // Total duration for the animation (in milliseconds)
    const intervalDuration = 50; // Interval duration (in milliseconds)
    const totalIntervals = duration / intervalDuration; // Total number of intervals
    const progressIncrement = 100 / totalIntervals; // Increment per interval

    const progressRef = React.useRef(() => { });
    React.useEffect(() => {
        progressRef.current = () => {
            if (progress >= 100) {
                setCompleted(true);
            } else {
                setProgress((prevProgress) => Math.min(prevProgress + progressIncrement, 100));
                setBuffer((prevProgress) => Math.min(prevProgress + progressIncrement * 1.5, 100)); // Slightly faster buffer progress
            }
        };
    }, [progress, progressIncrement]);

    React.useEffect(() => {
        if (!completed) {
            const timer = setInterval(() => {
                progressRef.current();
            }, intervalDuration);

            return () => {
                clearInterval(timer);
            };
        }
    }, [completed, intervalDuration]);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
        </Box>
    );
}
