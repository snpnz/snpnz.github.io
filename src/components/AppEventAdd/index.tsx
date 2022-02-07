import React from 'react';
import {
    Box, Typography, TextField, Button, Alert, List, ListItem, ListItemText, ListSubheader, IconButton,
    ListItemAvatar, Avatar, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { notifyWithState } from '../../helpers/notificationHelper';
import {
    addEvent,
    addEventPoint,
    addEventPointReferee,
    deleteEventPoint,
    deleteEventPointReferee,
    getEvent
} from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { getInputDate } from '../../helpers/dateHelper';
import PointsModal from '../PointsModal';
import UsersModal from '../UsersModal';
import { IEventPoint, IEventPointReferee, IPoint } from '../../types';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TourIcon from '@mui/icons-material/Tour';

const AppEventAdd: React.FC = () => {
    const params = useParams();
    const id = params?.id;

    const [err, setErr] = React.useState('');
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [start, setStart] = React.useState('');
    const [finish, setFinish] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [points, setPoints] = React.useState<IEventPoint[]>([]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = async (point?: IPoint) => {
        setOpen(false);

        if (!point || !id) {
            return;
        }

        if (points.find(p => p.pointId === point.id)) {
            notifyWithState('error', 'Такая точка уже есть')
            return false;
        }

        setIsSaving(true);
        try {
            setErr('');
            const { id: newId } = await addEventPoint({
                id_event: +id,
                id_point: point.id,
                sort_order: 0
            });

            setPoints(ps => ([
                ...ps,
                {
                    id: +newId,
                    pointId: point.id,
                    name: point.name,
                    idEventPointReferee: null,
                    coordinates: point.point as [number, number]
                }
            ]))

            notifyWithState('success', 'точка добавлена')

        } catch (e) {
            setErr((e as Error).message)
        } finally {
            setIsSaving(false);
        }
    }


    const [userOpen, setUserOpen] = React.useState<number | null>(null);

    const handleUserClose = async (user?: IEventPointReferee) => {
        

        if (!user || !userOpen) {
            return;
        }
        setIsSaving(true);
        try {
            setErr('');
            const { id: newId } = await addEventPointReferee({
                id_event_point: userOpen,
                id_user: user!.id!
            });

            setPoints(po => po.map(p => (
                p.id === userOpen
                    ? {...p, idEventPointReferee: newId, referee: user }
                    : p
            )))

            notifyWithState('success', `Рефери '${user.name} ${user.surname}' добавлен`)

        } catch (e) {
            setErr((e as Error).message)
        } finally {
            setIsSaving(false);
            setUserOpen(null);
        }
    }

    const navigate = useNavigate();

    React.useEffect(() => {
        if (id) {
            setIsLoading(true);
            getEvent(+id).then((ev) => {
                setName(ev.name);
                setDesc(ev.description);
                setStart(getInputDate(ev.start));
                setFinish(getInputDate(ev.finish));
                setPoints(ev.points);
                setIsLoading(false);
            }).finally(() => {

            })
        }

    }, [id]);


    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            setErr('');
            const { id } = await addEvent({
                name,
                description: desc,
                start_at: start,
                finish_at: finish
            });
            notifyWithState('success', 'Готово!');
            navigate(`/event/add/${id}`);
        } catch (e) {
            setErr((e as Error).message)
        } finally {
            setIsSaving(false);
        }
        
      }

    const canEdit = !id || (id && Date.parse(start) > Date.now());

    if (isLoading) {
        return <CircularProgress />;
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            {id ? 'Редактирование события' : 'Добавление события'}
        </Typography>
        
        <Box>
            {
                err?.length > 0 && <Alert severity="error" sx={{my: 3}}>{err}</Alert>
            }
        <form onSubmit={handleSubmit}>
            <TextField
                label="Название"
                required
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                sx={{ mt: 2 }}
                fullWidth
                autoFocus
                disabled={isSaving || !canEdit}
            />
            <TextField
                label="Описание"
                value={desc}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDesc(event.target.value)}
                sx={{ mt: 2 }}
                fullWidth
                multiline
                maxRows={4}
                disabled={isSaving || !canEdit}
            />
            <TextField
                label="Старт"
                type="datetime-local"
                required
                inputProps={{
                    min: getInputDate(new Date(Date.now() + 3600000)),
                    max: finish || ''
                }}
                value={start}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setStart(event.target.value)}
                sx={{ mt: 2 }}
                fullWidth
                disabled={isSaving || !canEdit}
            />
             <TextField
                label="Финиш"
                type="datetime-local"
                required
                value={finish}
                inputProps={{ min: start || getInputDate(new Date(Date.now() + 3600000)) }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFinish(event.target.value)}
                sx={{ mt: 2 }}
                fullWidth
                disabled={isSaving || !canEdit}
            />
            {
                id
                ? (
                    <Box sx={{ mt: 2, mx: -2 }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <ListSubheader>Точки</ListSubheader>
                            {points.map(point => {
                                return (
                                    <ListItem key={point.id} dense secondaryAction={
                                      <>
                                        <IconButton disabled={!canEdit} edge="end" sx={{mr:1}} aria-label="change" onClick={() => {
                                            point.referee ?
                                                window.confirm(`Убрать пользователя "${point.referee.name}" из рефери?`)
                                                && deleteEventPointReferee(point.idEventPointReferee!).then(() => {
                                                    setPoints(po => po.map(p => (
                                                        p.idEventPointReferee === point.idEventPointReferee!
                                                            ? {...p, idEventPointReferee: null, referee: undefined }
                                                            : p
                                                    )))
                                                    notifyWithState('success', 'Рефери удален');
                                                }).catch((e) => alert(e.message))
                                                : setUserOpen(point.id)
                                        }}>
                                          {point.referee ? <PersonRemoveIcon /> : <PersonAddIcon />}
                                        </IconButton>

                                        <IconButton  disabled={!canEdit}  edge="end" aria-label="delete" onClick={() => {
                                            window.confirm(`Убрать точку "${point.name}"?`) && deleteEventPoint(point.id).then(() => {
                                                setPoints(p => p.filter(pp => pp.id !== point.id));
                                                notifyWithState('success', 'Точка удалена');
                                            }).catch((e) => alert(e.message))
                                        }}>
                                          <DeleteIcon />
                                        </IconButton>
</>
                                      }>
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
                                            primary={<Typography color="primary">{point.name}</Typography>}
                                            secondary={point.referee ? `${point.referee.name} ${point.referee.surname}` : 'Без рефери'}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Button
                            disabled={!canEdit}
                            sx={{ my:3, mx: 2 }}
                            color="primary"
                            variant="outlined"
                            size="small" onClick={handleOpen}
                        >
                            Добавить
                        </Button>
                        <PointsModal open={open} onClose={handleClose} />
                        {userOpen && <UsersModal open={!!userOpen} onClose={handleUserClose} />}
                    </Box>
                )
                : (
                    <Button sx={{ mt:3 }} variant="contained" disabled={isSaving} size="large" type="submit" fullWidth>
                        Далее
                    </Button>
                )
            }
        </form>
        </Box>
    </section>
}

export default AppEventAdd;