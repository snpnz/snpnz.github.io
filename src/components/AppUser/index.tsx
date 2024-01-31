import React from 'react';
import {
    Alert,
    Box,
    Typography,
    CircularProgress,
    Avatar,
    ListItemText,
    List,
    ListItemButton,
    Tabs,
    Tab
} from '@mui/material';
import {getRemotePointsForUser, getUser} from '../../services/apiService';
import {IPointReport, IUser} from '../../types';
import {useParams} from "react-router-dom";
import TabPanel from "../TabPanel";
import {getHumanDate} from "../../helpers/dateHelper";


const AppUser: React.FC = () => {
    const params = useParams();
    const id = params?.id ? +params?.id : 0;
    const [user, setUser] = React.useState<IUser | null>(null);
    const [pointsReports, setPointsReports] = React.useState<IPointReport[] | null>(null);
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
                const data = await getUser(id);
                setUser(data);

                const data1 = await getRemotePointsForUser(id);
                setPointsReports(data1);
            } catch (e) {
                setErr((e as Error).message);
            }
        }

        getData(id);
    }, [id]);

    if (err) {
        return <Alert severity="error" sx={{mt: 3}}>{err}</Alert>
    }

    if (user == null) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }



    return <section>
        <Typography variant="h4" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            {user.name} {user.surname}
        </Typography>
        <Typography variant="subtitle1" component="h5" gutterBottom sx={{p: 1, mt: -2}}>
            <Avatar src={user.photo} />
        </Typography>
        <Typography variant="body1" gutterBottom sx={{p: 1}}>
            На сайте с {user.registerDate.toLocaleString()}
        </Typography>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Отметки" />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                {!!pointsReports?.length && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {pointsReports.map(point => {
                        return (
                            <ListItemButton key={point.comment + point.created_at + point.id_point}>
                                <ListItemText
                                    primary={<>
                                        <strong>{point.name}</strong>
                                        <Typography variant="caption"  display="block" gutterBottom>
                                            {getHumanDate(point.created_at)}
                                        </Typography>
                                    </>}
                                    secondary={<>
                                        <br />
                                        <small>
                                            <em>{point?.comment}</em>
                                        </small>
                                    </>}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>}
            </TabPanel>
        </Box>
    </section>
}

export default AppUser;
