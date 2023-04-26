import { useContext, useState } from "react";
import { UserAuth } from "../../components/UserAuth/UserAuth";
import { Typography, TextField, Button, Box, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
	const { login, signUp } = useContext(UserAuth);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameSignUp, setUsernameSignUp] = useState('');
	const [passwordSignUp, setPasswordSignUp] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isPasswordSignUpVisible, setIsPasswordSignUpVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};

	const togglePasswordSignUpVisibility = () => {
		setIsPasswordSignUpVisible((prev) => !prev);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		login(username, password);
		setUsername('');
		setPassword('');
	};

	const handleSignUp = (event) => {
		event.preventDefault();
		signUp(firstName, lastName, usernameSignUp, passwordSignUp)
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
					Sign Up / Login
				</Typography>
				<Box sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row',
					width: '100%',
					gap: "75px"
				}}>
					<Box sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						width: '100%',
						gap: "15px"
					}}>
						<TextField
							label="First Name"
							variant="outlined"
							value={firstName}
							onChange={(event) => setFirstName(event.target.value)}
							sx={{ width: '100%' }}
							required
						/>
						<TextField
							label="Last Name"
							variant="outlined"
							value={lastName}
							onChange={(event) => setLastName(event.target.value)}
							sx={{ width: '100%' }}
							required
						/>
						<TextField
							label="Username"
							variant="outlined"
							value={usernameSignUp}
							onChange={(event) => setUsernameSignUp(event.target.value)}
							sx={{ width: '100%' }}
							required
						/>
						<TextField
							label="Password"
							variant="outlined"
							type={isPasswordVisible ? 'text' : 'password'}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={togglePasswordSignUpVisibility} edge="end">
											{isPasswordSignUpVisible ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							value={passwordSignUp}
							onChange={(event) => setPasswordSignUp(event.target.value)}
							sx={{ width: '100%' }}
							required
						/>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={handleSignUp}
							disabled={!firstName || !lastName || !usernameSignUp || !passwordSignUp}
						>
							Sign Up
						</Button>
					</Box>
					<Box sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						width: '100%',
						gap: "15px"
					}}>
						<TextField
							label="Username"
							variant="outlined"
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							sx={{ width: '100%' }}
							required
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
							required
						/>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={handleSubmit}
							disabled={!username || !password}
						>
							Login
						</Button>
					</Box>
				</Box>
				<Typography sx={{ width: '300px', textAlign: 'center' }} variant="p" component="p">
					*Note: Any usernames entered that do not exist, will be made into a new user account with the provided Username and Password.
				</Typography>
			</Box>

		</div>
	)
}

export default Login