import React from "react";
import {Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import AppWelcome from "../AppWelcome";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {AppBar, Toolbar, Typography, Container, CircularProgress, Backdrop, SpeedDial, SpeedDialIcon, SpeedDialAction} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import Menu from "./components/Menu";
import AppScan from "../AppScan";
import {useAppDispatch, useAppSelector} from "../../store";
import {
    addCachedPointReportAction,
    getRemotePointReportsAction,
    getRemotePointsAction,
    setOnlineState,
    toggleTheme
} from "../../store/main.slice";
import {notifyWithState} from "../../helpers/notificationHelper";
import AppCheckpoint from "../AppCheckpoint";
import AppMy from "../AppMy";
import AppList from "../AppList";
import AppLogin from "../AppLogin";
import AppMap from "../AppMap";
import AppAll from "../AppAll";
import AppAbout from "../AppAbout";
import AppReferee from "../AppReferee";
import AppEvents from "../AppEvents";
import AppEvent from "../AppEvent";
import AppEventAdd from "../AppEventAdd";
import AppUser from "../AppUser";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });


function App() {
    const [showScanBtn, setShowScanBtn] = React.useState<boolean>(true);
    const [showActionsButton, setShowActionsButton] = React.useState<boolean>(false);
    const [fullScr, setFullScr] = React.useState<boolean>(true);
    const { themeMode, isOnline, isUploadComplete, user, isUploadLoading } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const loc = location.pathname;
        setShowScanBtn( !['/scan', '/add', '/referee'].includes(loc));
        setFullScr(['/map'].includes(loc));

        const params = new URLSearchParams(document.location.search.substring(1));
        const code = params.get("code");
        if (code && code.length && loc !== '/add') {
            window.navigator.vibrate(300);
            navigate('/add?code=' + code);
        }

    }, [location, navigate]);

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                },
            }),
        [themeMode],
    );

    React.useEffect(() => {
        const updateOnlineStatus = () => {
            dispatch(setOnlineState(navigator.onLine));
        }

        if (isOnline) {
            dispatch(getRemotePointsAction());
            user && dispatch(getRemotePointReportsAction());
        }

        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }, [dispatch, user, isOnline]);

    function handleUploadClick() {
        if (!isUploadLoading && !isUploadComplete && isOnline) {
            dispatch(addCachedPointReportAction());
            return;
        }

        if (isUploadComplete) {
            notifyWithState('success', 'Все данные уже загружены');
            return;
        }


        if (!isOnline && !isUploadLoading) {
            notifyWithState('error', 'Нет доступа к интернету')
        }

    }

    let upIcon = <CircularProgress />;
    if (isUploadLoading) {
        upIcon = <CircularProgress />;
    } else if (!isOnline) {
        upIcon = <CloudOffIcon />
    } else if (!isUploadComplete) {
        upIcon = <CloudUploadIcon/>;
    } else if (isUploadComplete) {
        upIcon = <CloudDoneIcon/>
    }

    return (
        <ColorModeContext.Provider value={{ toggleColorMode: toggleTheme }}>
            <ThemeProvider theme={theme}>
                <main style={{display:'flex', flexDirection: 'column', height:'100vh'}}>
                    <Box>
                        <AppBar position="fixed">
                            <Toolbar>
                                <Menu />
                                <Typography component={Link} to={'/'} color="inherit" variant="h6" sx={{ flexGrow: 1, textDecoration:'none' }}>
                                    <Typography variant="inherit" color="accent" component="span">sn</Typography>
                                    <Typography variant="inherit" component="span">pnz</Typography>

                                </Typography>
                                <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleUploadClick}>
                                    {upIcon}
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Toolbar />
                    <Box sx={{
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 0,
                        flexGrow: 1
                    }}>
                        <Container disableGutters={fullScr} maxWidth={false}>
                            <Routes>
                                <Route path="/" element={<AppWelcome />} />
                                <Route path="scan" element={<AppScan />} />
                                <Route path="add" element={<AppCheckpoint />} />
                                <Route path="my" element={<AppMy />} />
                                <Route path="list" element={<AppList />} />
                                <Route path="login" element={<AppLogin />} />
                                <Route path="map" element={<AppMap />} />
                                <Route path="all" element={<AppAll />} />
                                <Route path="about" element={<AppAbout />} />
                                <Route path="referee" element={<AppReferee />} />
                                <Route path="event/add/:id" element={<AppEventAdd />} />
                                <Route path="event/add" element={<AppEventAdd />} />
                                <Route path="user/:id" element={<AppUser />} />
                                <Route path="event/:id" element={<AppEvent />} />
                                <Route path="events" element={<AppEvents />} />
                            </Routes>
                        </Container>
                    </Box>
                    {/*{showScanBtn && <Fab component={Link} to="/scan" variant="extended" color="primary" aria-label="add"  >*/}
                    {/*    <QrCodeScannerIcon sx={{ mr: 1 }} />*/}
                    {/*    Сканировать*/}
                    {/*</Fab>}*/}
                    {showScanBtn && <>
                        <Backdrop open={showActionsButton} />
                        <SpeedDial
                            ariaLabel="SpeedDial actions"
                            icon={<SpeedDialIcon />}
                            onClose={() => setShowActionsButton(false)}
                            onOpen={() => setShowActionsButton(true)}
                            open={showActionsButton}
                            sx={{
                                position: 'fixed',
                                bottom: (theme) => theme.spacing(2),
                                right: (theme) => theme.spacing(2),
                                zIndex: 999
                            }}
                        >
                            <SpeedDialAction
                                icon={<QrCodeScannerIcon />}
                                tooltipTitle={'Сканировать\u00a0QR\u2011код'}
                                tooltipOpen
                                onClick={() => {
                                    setShowActionsButton(false);
                                    navigate('/scan');
                                }}
                            />
                            <SpeedDialAction
                                icon={<AddLocationAltIcon />}
                                tooltipTitle={'Добавить\u00a0вручную'}
                                tooltipOpen
                                onClick={() => {
                                    setShowActionsButton(false);
                                    navigate('/add');
                                }}
                            />
                        </SpeedDial>
                    </>}

                </main>
             </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
