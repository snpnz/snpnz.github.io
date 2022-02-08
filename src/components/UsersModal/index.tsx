import React from 'react';
import {List, ListItemText, Modal, Box, ListItemButton, Typography, CircularProgress } from '@mui/material';
import {IEventPointReferee} from "../../types";
import { getUsers } from '../../services/apiService';
import {modalStyles} from "../../commonStyles/modalStyles";

const UsersModal: React.FC<{ open: boolean, onClose: (user?: IEventPointReferee) => void}> = ({ open, onClose }) => {
const [users, setUsers] = React.useState<IEventPointReferee[]>([]);
const [isLoading, setIsLoading] = React.useState<boolean>(false);
const [err, setErr] = React.useState<string>('');

React.useEffect(() => {
    const getData = async () => {
        try {
            setIsLoading(true);
            setErr('');
            const d = await getUsers();
            setUsers(d);
        } catch (e) {
            setErr((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    getData();

}, []);



return <Modal
        open={open}
        onClose={() => onClose()}
        >
            <Box sx={modalStyles}>
                {isLoading && <CircularProgress />}
                {err.length && err}
                {users.length > 0 && <List>
                    {users.map((option) => {
                        return <ListItemButton key={option?.id} onClick={() => onClose(option)}>
                        <ListItemText
                            primary={<Typography color="primary">{option.name}</Typography>}
                            secondary={option?.surname}
                        />
                    </ListItemButton>
                    })}
                </List>}
            </Box>
        </Modal>;
}

export default UsersModal;