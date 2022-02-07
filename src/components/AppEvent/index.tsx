import React from 'react';
import {
    Alert,
    Box,
    Typography,
    CircularProgress,
    ListItemAvatar,
    Avatar,
    ListItemText,
    List,
    ListItemButton,
    Tabs,
    Tab
} from '@mui/material';
import { getEvent } from '../../services/apiService';
import {IEventWithPoints} from '../../types';
import { getHumanDate } from '../../helpers/dateHelper';
import {Link, useParams} from "react-router-dom";
import TourIcon from "@mui/icons-material/Tour";
import TabPanel from "../TabPanel";
import EventMembers from "./EventMembers";


const AppEvent: React.FC = () => {
    const params = useParams();
    const id = params?.id ? +params?.id : 0;
    const [event, setEvent] = React.useState<IEventWithPoints | null>(null);
    const [err, setErr] = React.useState<string>('');

    const [tab, setTab] = React.useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    React.useEffect(() => {

        if (id === 0) {
            return;
        }

        const getData = async (id: number) => {
            try {
                const data = await getEvent(id);
                setEvent(data);
            } catch (e) {
                setErr((e as Error).message);
            }
        }

        getData(id);
    }, [id]);

    if (event == null) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (err) {
        return <Alert severity="error" sx={{mt: 3}}>{err}</Alert>
    }

    return <section>
        <Typography variant="h4" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            {event.name}
        </Typography>
        <Typography variant="subtitle1" component="h5" gutterBottom sx={{p: 1, mt: -2}}>
            {event.name}
        </Typography>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1}}>
            {getHumanDate(event.start)} - {getHumanDate(event.finish)}
        </Typography>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Участники" />
                    <Tab label="Контрольные точки" />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <EventMembers id_event={id} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {event.points.map(point => {
                        return (
                            <ListItemButton  component={Link} to={`/list?id=${point.id}`} key={point.id}>
                                {point.referee ? (
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={point.referee.name + ' ' + point.referee.surname}
                                            src={point.referee.photo}
                                        />
                                    </ListItemAvatar>
                                ): (
                                    <ListItemAvatar>
                                        <Avatar>
                                            <TourIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                )}
                                <ListItemText
                                    primary={<Typography component="span" color="primary">{point.name}</Typography>}
                                    secondary={point.referee ? `${point.referee.name} ${point.referee.surname}` : 'Без рефери'}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </TabPanel>
        </Box>
    </section>
}

export default AppEvent;