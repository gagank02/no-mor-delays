import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserAuth = createContext();

const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.get(
        'http://localhost:5001/login',
        { params: { UserName: username, Password: password } }
      );
      if (response.data.success) {
        const user = response.data.result[0];
        console.log(user);
        setUser(user);
        navigate('/account');
      } else {
        alert("Incorrect username or password provided. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signUp = async (firstname, lastname, username, password) => {
    try {
      const response = await axios.get(
        'http://localhost:5001/login',
        {
          params: {
            FirstName: firstname,
            LastName: lastname,
            UserName: username,
            Password: password
          }
        }
      );
      if (response.data.success) {
        const user = response.data.result[0];
        console.log(user);
        setUser(user);
        navigate('/account');
      } else {
        alert("Username is taken. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async () => {
    console.log("clicked")
		try {
			const response = await axios.delete(
				`http://localhost:5001/user`, { data: user}
			);
      console.log(response.data)
      if (response.data.success) {
        console.log(response.data)
        setUser(null);
        navigate('/login');
      } else {
        console.log("error")
      }
			
		} catch (error) {
			console.error(error);
		}
	}

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    signUp,
    logout,
    deleteUser
  };

  return <UserAuth.Provider value={value}>{children}</UserAuth.Provider>;
};

export { UserAuth, UserAuthProvider };
