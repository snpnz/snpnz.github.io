import React, {HTMLAttributes} from 'react';
import {Typography, Box, Link} from '@mui/material';

const AppAbout: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    
    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            О приложении
        </Typography>
        <Box>
        <Typography variant="body2" component="p" sx={{p: 1}}>
            Придумано на расчистке Серебряной нити перед сезоном 2021-2022
        </Typography>
        <Typography variant="body2" component="p" sx={{p: 1}}>
            Общий чат для обсуждений в <Link href="https://t.me/+rpioYIdz1Z8xZWQy" target="_blank">telegram</Link>
        </Typography>
        {/* <Typography variant="body2" component="p" sx={{p: 1}}>
            Связаться с автором в <Link href="https://t.me/xneek" target="_blank">telegram</Link>
        </Typography> */}
        </Box>
    </section>
}

export default AppAbout;