import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface CountdownProps {
    targetDate: Date;
}

const useStyles = makeStyles((theme) => ({
    countdown: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        fontFamily: 'Rubik Wet Paint',
        fontSize: '1.2rem',
        backdropFilter: 'blur(10px)',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
    },
}));

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
    const classes = useStyles();
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const calculateCountdown = () => {
        const now = new Date();
        const timeDifference = targetDate.getTime() - now.getTime();

        if (timeDifference <= 0) {
            setCountdown({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            });
        } else {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            setCountdown({
                days,
                hours,
                minutes,
                seconds
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            calculateCountdown();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span className={classes.countdown}>
            {`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
        </span>
    );
}

export default CountdownTimer;
