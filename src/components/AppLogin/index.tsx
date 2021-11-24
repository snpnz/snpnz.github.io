import React, {HTMLAttributes, useEffect} from 'react';
import {Typography, Paper} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getAuthLink} from "../../services/authService";
import {updateUserDataAction} from "../../store/main.slice";
import {useNavigate} from "react-router-dom";
import {lsSet} from "../../helpers/localStorageHelper";
import {LsKey} from "../../types/lsKeys.enum";

const AppLogin: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { user, isUserLoading, userError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(document.location.search.substring(1));
        const token = params.get("token");
        const id = params.get("id");
        const expiration = params.get("expiration");

        if (token && id && expiration) {
            lsSet(LsKey.AuthData, { token, id, expiration });
        }

        dispatch(updateUserDataAction());

    }, []);

    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);



    return <section>
        <Paper elevation={3} sx={{p: 4, mt: 2}}>
            <Typography variant="h6" component="h4" gutterBottom sx={{p: 1}}>
                Авторизация
            </Typography>
            {isUserLoading && 'Loading...'}
            {userError}
            <Button component={'a'} href={getAuthLink()}>Войти через Strava</Button>
        </Paper>
    </section>
}

export default AppLogin;