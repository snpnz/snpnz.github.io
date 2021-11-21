import React, {HTMLAttributes} from 'react';
import clsx from 'clsx';
import styles from './style.module.css';
import {NavLink} from "react-router-dom";

const AppHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
    return <div className={clsx(styles.appHeader, className)}>
        SN58

        <nav>
            <NavLink to={'/about'}>Фищге</NavLink>
        </nav>
    </div>
}

export default AppHeader;