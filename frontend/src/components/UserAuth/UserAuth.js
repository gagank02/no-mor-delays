import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserAuth = createContext();

const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // const login = (userData) => {
  //   // Login user and set user state
  //   setUser(userData);
  //   navigate('/account');
  // };

  const login = async (username, password) => {
    try {
      const response = await axios.get(
        'http://localhost:5001/login',
        { params: {UserName: username, Password: password} }
      );
      const user = response.data;
      console.log(user)
      // setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    // Logout user and set user state to null
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
  };

  return <UserAuth.Provider value={value}>{children}</UserAuth.Provider>;
};

export { UserAuth, UserAuthProvider };
