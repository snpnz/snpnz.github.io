import React, {HTMLAttributes} from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import {useAppDispatch, useAppSelector} from "../../store";
import {toggleTheme} from "../../store/main.slice";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {Link} from "react-router-dom";
import QrCodeSharpIcon from '@mui/icons-material/QrCodeSharp';
import AddLocationSharpIcon from '@mui/icons-material/AddLocationSharp';
import {Avatar, Button, Typography, TypographyVariant} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {lsRemove} from "../../helpers/localStorageHelper";
import {LsKey} from "../../types/lsKeys.enum";


const Menu: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
    const [o, sO] = React.useState(false);
    const dispatch = useAppDispatch();
    const { themeMode, user } = useAppSelector(s => s.main);
    return <>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => sO(s => !s)}
        >
            <MenuIcon />
        </IconButton>
        <SwipeableDrawer
            open={o}
            onClose={() => sO(false)}
            onOpen={() => sO(true)}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => sO(false)}
                onKeyDown={() => sO(false)}
            >
                <Box sx={{p:2, py: 3, display: 'flex'}}>
                    {!user?.photo ? <Avatar
                        sx={{ width: 56, height: 56 }}
                    >
                        <PersonOffIcon />
                    </Avatar> : <Avatar
                        src={user.photo}
                        sx={{ width: 56, height: 56 }}
                    />}
                    <Box sx={{flexGrow: 1, ml: 2}}>
                        {
                            !user
                            ? <Typography variant={"subtitle2"} color="warning">Неавторизованный пользователь</Typography>
                            : <Typography variant={"subtitle2"} color="primary">{user.name} {user.surname}</Typography>
                        }
                        {!user && <Button sx={{ml:-1}} component={Link} to="/login" color="inherit">Войти</Button>}
                        {user && <Button sx={{ml:-1}} onClick={() => {
                            lsRemove(LsKey.AuthData);
                            lsRemove(LsKey.UserData);
                            window.location.reload();
                        }} color="inherit">Выйти</Button>}
                    </Box>
                </Box>
                <Divider />
                <ListItem button component={Link} to={"/my"}>
                    <ListItemIcon>
                        <PlaylistAddCheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Мои отметки"} />
                </ListItem>
                <ListItem button component={Link} to={"/list"}>
                    <ListItemIcon>
                        <ListAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Все точки"} />
                </ListItem>
                <Divider />


                <ListItem button component={Link} to={"/scan"}>
                    <ListItemIcon>
                        <QrCodeSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Сканировать QR-код"} />
                </ListItem>
                <ListItem button component={Link} to={"/add"}>
                    <ListItemIcon>
                        <AddLocationSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Добавить вручную"} />
                </ListItem>
                <Divider />
                <List>

                        <ListItem button onClick={() => dispatch(toggleTheme())} color="inherit">
                            <ListItemIcon>
                                {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </ListItemIcon>
                            <ListItemText primary={themeMode === 'dark' ? 'Светлая тема' : 'Тёмная тема'} />
                        </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    </>
}

export default Menu;