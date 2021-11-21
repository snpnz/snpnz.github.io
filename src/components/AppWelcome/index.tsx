import React, {HTMLAttributes} from 'react';
import clsx from 'clsx';
import styles from './style.module.css';
import Screen from "../Screen";
import { Typography } from '@mui/material';

const AppWelcome: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    return <Screen className={clsx(styles.screen)}>
        <Typography variant="h4" component="h1" gutterBottom>
            Create React App v5 example with TypeScript
        </Typography> AppWelcome
    </Screen>
}

export default AppWelcome;