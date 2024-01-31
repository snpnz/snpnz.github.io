import React, {HTMLAttributes} from 'react';
import {
    Alert,
    Box,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    CircularProgress,
    ListSubheader
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/apiService';
import { IEvent } from '../../types';
import {getHumanDate} from "../../helpers/dateHelper";

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


    if (err) {
        return <Alert severity="error" sx={{mt: 3}}>{err}</Alert>
    }
    if (events == null) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    const accumulated = events.reduce<{ future: IEvent[], current: IEvent[], archive: IEvent[] }>((acc, cur) => {
        const now = new Date();
        if (cur.start > now) {
            acc.future.push(cur);
        } else if (cur.finish > now) {
            acc.current.push(cur);
        } else {
            acc.archive.push(cur)
        }

        return acc;
    }, { current: [], future: [], archive: [] });

    const groupNames: Record<string, string> = {
        future: 'Предстоящие', current: 'Текущие', archive: 'Прошедшие'
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2, mb:0}}>
            События
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {Object.entries(accumulated).map(([key, events]) => {
                    if (!events.length) return null;

                    return (<React.Fragment key={key}>
                        <ListSubheader>{groupNames[key]}</ListSubheader>
                        {events.map((event) => {
                            return (<ListItemButton component={Link} to={`/event/${event.id}`}>
                                <ListItemText primary={<span style={{display: 'flex', justifyContent: 'space-between'}}>
                                    {event.name}
                                    <Typography variant="caption" display="block">
                                        {getHumanDate(event.start)}
                                        {` — `}
                                        {getHumanDate(event.finish)}
                                    </Typography>
                                </span>} secondary={event.description} />
                            </ListItemButton>);
                        })}
                    </React.Fragment>)
                })}
            </List>
        </Box>
    </section>
}

export default AppEvents;
