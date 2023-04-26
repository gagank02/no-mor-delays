import { useState, useEffect, useContext } from 'react'
import { UserAuth } from '../../components/UserAuth/UserAuth';
import { Box, Typography } from '@mui/material';


const Account = () => {
    const { user, login, logout } = useContext(UserAuth);

    return (
        <div>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                gap: "50px",
            }}>
                <Typography variant="h4" component="h2">
                    Account {user ? "Logged in" : "no user"}
                </Typography>
            </Box>

        </div>
    )
}

export default Account