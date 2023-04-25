import { useContext, useState } from "react";
import { UserAuth } from "../../components/UserAuth/UserAuth";
import { Typography, TextField, Button, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
    const { user, login, logout } = useContext(UserAuth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        let userData = {
            'username': username,
            'password': password,
        }
        console.log(userData)
        login(userData)
    };

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
                    Login / Sign Up
                </Typography>

                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type={isPasswordVisible ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    sx={{ width: '100%' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Login
                </Button>
            </Box>
        </div>
    )
}

export default Login