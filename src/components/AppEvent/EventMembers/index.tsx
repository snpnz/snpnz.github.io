import React from 'react';
import {addEventMember, getEventMembers} from "../../../services/apiService";
import {IEventMember} from "../../../types";
import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import {getHumanDate} from "../../../helpers/dateHelper";
import {useAppSelector} from "../../../store";

const EventMembers: React.FC<{ id_event: number }> = ({ id_event }) => {
    const [data, setData] = React.useState<IEventMember[]>([]);
    const [actualKey, setActualKey] = React.useState<number>(0);
    const [err, setErr] = React.useState('');
    const [loa, setLoa] = React.useState(false);
    const { user } = useAppSelector(s => s.main);


    React.useEffect(() => {
        const getData = async (id: number) => {
            try {
                setLoa(true);
                setErr('');
                const mmbrs = await getEventMembers(id);
                setData(mmbrs);
            } catch (e) {
                setErr((e as Error).message)
            } finally {
                setLoa(false);
            }
        }

        getData(id_event);
    }, [id_event, actualKey]);


    if (loa) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (err) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => setActualKey(Date.now())} size="small">
                Загрузить
            </Button>
        }>{err}</Alert>
    }

    return <>
        {<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {data.map(member => {
                return (
                    <ListItemButton  component={Link} to={`/user/${member?.user?.id}`} key={member.id}>
                        {member.user ? (
                            <ListItemAvatar>
                                <Avatar
                                    alt={member.user.name + ' ' + member.user.surname}
                                    src={member.user.photo}
                                />
                            </ListItemAvatar>
                        ): (
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                        )}
                        <ListItemText
                            primary={<Typography component="span" color="primary">{
                                (
                                    member.user?.id ?
                                        `${member.user.name || ''} ${member.user.surname || ''}`
                                        : `${member.name || ''} ${member.surname || ''}`
                                ) +  (member.team ? ` (${member.team })`: '')
                            }</Typography>}
                            secondary={
                            +member.acceptedAt > 0 ? 'Принято ' + getHumanDate(member.acceptedAt) : 'Приглашен ' + getHumanDate(member.createdAt)
                        }
                        />
                    </ListItemButton>
                );
            })}
        </List>}

        {user && !data?.find(x => x?.user?.id === user?.id) && (
            <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => {
                addEventMember({
                    id_event: id_event,
                    id_user: user.id,
                    name: user.name,
                    surname: user.surname,
                }).then(() => setActualKey(Date.now()))
            }}>
            Я пойду</Button>
        )}
    </>
}

export default EventMembers;
