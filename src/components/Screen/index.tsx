import React, {HTMLAttributes} from 'react';
import clsx from 'clsx';
import styles from './style.module.css';

const Screen: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
    return <div className={clsx(styles.screen, className)}>
        {children}
    </div>
}

export default Screen;