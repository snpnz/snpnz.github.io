import React from "react";
import {Route, Routes, Link, useLocation} from "react-router-dom";
import AppWelcome from "../AppWelcome";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {AppBar, Toolbar, Typography, Container, Fab, CircularProgress} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudOffIcon from '@mui/icons-material/CloudOff';

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

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });


function App() {
    const [showScanBtn, setShowScanBtn] = React.useState<boolean>(true);
    const { themeMode, isOnline, isUploadComplete, user, isUploadLoading } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const location = useLocation();

    React.useEffect(() => {
        const loc = location.pathname;
        setShowScanBtn( !['/scan', '/add'].includes(loc));
    }, [location]);

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
                        <AppBar position="static">
                            <Toolbar>
                                <Menu />
                                <Typography component={Link} to={'/'} color="inherit" variant="h6" sx={{ flexGrow: 1, textDecoration:'none' }}>
                                    Sn58
                                </Typography>
                                <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleUploadClick}>
                                    {upIcon}
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Box sx={{
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 0,
                        flexGrow: 1
                    }}>
                        <Container>
                            <Routes>
                                <Route path="/" element={<AppWelcome />} />
                                <Route path="scan" element={<AppScan />} />
                                <Route path="add" element={<AppCheckpoint />} />
                                <Route path="my" element={<AppMy />} />
                                <Route path="list" element={<AppList />} />
                                <Route path="login" element={<AppLogin />} />
                                <Route path="map" element={<AppMap />} />
                            </Routes>
                        </Container>
                    </Box>
                    {showScanBtn && <Fab component={Link} to="/scan" variant="extended" color="primary" aria-label="add"  sx={{
                        position: 'fixed',
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}>
                        <QrCodeScannerIcon sx={{ mr: 1 }} />
                        Сканировать
                    </Fab>}
                </main>
             </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;