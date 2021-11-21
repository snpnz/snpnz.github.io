import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointReportsAction} from "../../store/main.slice";

const AppMy: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { pointReports, isPointReportsLoading, pointReportsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

    if (isPointReportsLoading) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (pointReportsLoadingError) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointReportsAction())} size="small">
                Загрузить
            </Button>
        }>{pointReportsLoadingError}</Alert>
    }

    if (!pointReports?.length) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointReportsAction())} size="small">
                Загрузить
            </Button>
        }>Не загружены точки {pointReportsLoadingError}</Alert>
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            Мои отметки на точках
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {pointReports.map(point => {
                    return (
                        <ListItemButton key={point.id}>
                            <ListItemText primary={point.name} secondary={point.created_at.toLocaleString()} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    </section>
}

export default AppMy;