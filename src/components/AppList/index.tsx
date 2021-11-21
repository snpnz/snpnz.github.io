import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointsAction} from "../../store/main.slice";

const AppList: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

    if (isPointsLoading) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (pointsLoadingError) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                Загрузить
            </Button>
        }>{pointsLoadingError}</Alert>
    }

    if (!points?.length) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                Загрузить
            </Button>
        }>Не загружены точки {pointsLoadingError}</Alert>
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            Все точки
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {points.map(point => {
                    return (
                        <ListItemButton key={point.id}>
                            <ListItemText primary={point.name} secondary={point.description} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    </section>
}

export default AppList;