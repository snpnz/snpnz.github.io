import React, {HTMLAttributes} from 'react';
import clsx from 'clsx';
import styles from './style.module.css';
import Screen from "../Screen";
import {IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CachedIcon from '@mui/icons-material/Cached';


const AppWelcome: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    return <Screen className={clsx(styles.screen)}>
        <Paper elevation={3} sx={{p: 4}}>
            <Typography variant="h4" component="h1">
                Серебряная нить
            </Typography>
            <Typography variant="subtitle1" component="h1" gutterBottom>
                Состояние приложения
            </Typography>
            <List sx={{p:1}}>
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <CachedIcon />
                        </IconButton>
                    }
                >
                        <ListItemIcon>
                            <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Список точек маршрута"
                            secondary={'Secondary text'}
                        />
                </ListItem>
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <CachedIcon />
                        </IconButton>
                    }
                >
                    <ListItemIcon>
                        <ErrorIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Авторизация пользователя"
                        secondary={'Secondary text'}
                    />
                </ListItem>
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                            <CachedIcon />
                        </IconButton>
                    }
                >
                    <ListItemIcon>
                        <CloudIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Single-line item"
                        secondary={'Secondary text'}
                    />
                </ListItem>
            </List>
        </Paper>

    </Screen>
}

export default AppWelcome;