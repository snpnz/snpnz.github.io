import React, {FormEvent, HTMLAttributes} from 'react';
import {Box, TextField, Typography, Button} from '@mui/material';

const AppReferee: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [comment, setComment] = React.useState<string>('');
    const [fio, setFio] = React.useState<string>('');

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }
    const onFioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFio(event.target.value);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            referee mode
        </Typography>

        <Box sx={{mt:2}} component='form' onSubmit={handleSubmit}>
            <TextField
                label="ФИО (обязательно)"
                value={fio}
                onChange={onFioChange}
                sx={{ mt: 2 }}
                fullWidth
                autoFocus
                required
            />
            <TextField
                label="Коммент (не обязательно)"
                multiline
                maxRows={4}
                value={comment}
                onChange={onCommentChange}
                sx={{ mt: 2, mb: 3 }}
                fullWidth
            />
            <Button size='large' color='primary' fullWidth type='submit' variant='outlined'>Сохранить</Button>
        </Box>
    </section>
}

export default AppReferee;