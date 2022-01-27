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
import {useAppDispatch, useAppSelector} from "../../../../store";
import {toggleTheme} from "../../../../store/main.slice";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {Link} from "react-router-dom";
import QrCodeSharpIcon from '@mui/icons-material/QrCodeSharp';
import AddLocationSharpIcon from '@mui/icons-material/AddLocationSharp';
import {Avatar, Button, Typography, Modal} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import SportsIcon from '@mui/icons-material/Sports';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QRCode from "react-qr-code";

import MapIcon from '@mui/icons-material/Map';
import {lsGet, lsRemove} from "../../../../helpers/localStorageHelper";
import {LsKey} from "../../../../types/lsKeys.enum";
const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: 'inherit',
    p: 4,
  };

const Menu: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
    const [o, sO] = React.useState(false);
    const [isQrOpen, setIsQrOpen] = React.useState(false);
    const dispatch = useAppDispatch();
    const { themeMode, user } = useAppSelector(s => s.main);
    const handleQrClick = () => setIsQrOpen((c) => !c)
    const handleQrClose = () => setIsQrOpen(false);

    const userData: {token?: string} = lsGet<{token?: string} | null>(LsKey.AuthData) || { token: undefined };

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
        <Modal
            open={isQrOpen}
            onClose={handleQrClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <div style={{textAlign:'center'}}>
                    <Typography id="modal-modal-title" variant="h6" color="primary" gutterBottom component="span">
                        QR-код для отметки у судей
                    </Typography>
                    <br />
                    <br />
                    {userData?.token && <QRCode value={`https://sn58.tk/?invite=${userData?.token}`} />}
                </div>
            </Box>
        </Modal>
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
                            ? <Typography variant={"subtitle2"} gutterBottom color="warning">Неавторизованный пользователь</Typography>
                            : <Typography variant={"subtitle1"} gutterBottom color="primary">{user.name} {user.surname}</Typography>
                        }
                    
                        {!user && <Button size="small" variant='outlined' component={Link} to="/login" color="inherit">Войти</Button>}
                        {user && <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Button  size="small" variant='outlined' onClick={() => {
                                Object.values(LsKey).forEach(lsRemove)
                                window.location.reload();
                            }} color="inherit">
                                Выйти
                            </Button>
                            {userData?.token && <Button  size="small" color="secondary" onClick={handleQrClick}>
                                <QrCodeIcon/>
                            </Button>}

                        </Box>}
                
                    </Box>
                </Box>
                <Divider />
                <ListItem button component={Link} to={"/my"}>
                    <ListItemIcon>
                        <PlaylistAddCheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Мои отметки"} />
                </ListItem>
                <ListItem button component={Link} to={"/all"}>
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Все отметки"} />
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
                <ListItem button component={Link} to={"/map"}>
                    <ListItemIcon>
                        <MapIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Карта"} />
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
                <Divider />
                <List>

                        <ListItem button component={Link} to={"/about"}>
                            <ListItemIcon>
                                <InfoTwoToneIcon />
                            </ListItemIcon>
                            <ListItemText primary="О приложении" />
                        </ListItem>
                        {user?.isReferee && (
                            <ListItem button component={Link} to={"/referee"}>
                                <ListItemIcon>
                                    <SportsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Referee" />
                            </ListItem>
                        )}
                </List>
            </Box>
        </SwipeableDrawer>
    </>
}

export default Menu;