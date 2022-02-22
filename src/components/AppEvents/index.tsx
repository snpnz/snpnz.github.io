import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress} from '@mui/material';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/apiService';
import { IEvent } from '../../types';

const AppEvents: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [events, setEvents] = React.useState<IEvent[] | null>(null);
    const [err, setErr] = React.useState<string>('');


    React.useEffect(() => {
        const getData = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (e) {
                setErr((e as Error).message);
            }
        }

        getData();
    }, []);

    if (events == null) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (err) {
        return <Alert severity="error" sx={{mt: 3}}>{err}</Alert>
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            События
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {events.map(event => {
                    return (
                        <React.Fragment key={event.id}>
                            <ListItemButton component={Link} to={`/event/${event.id}`}>
                                <ListItemText primary={event.name} secondary={event.description} />
                            </ListItemButton>
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    </section>
}

export default AppEvents;