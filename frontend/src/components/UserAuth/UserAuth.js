import { createContext, useState } from 'react';
import axios from 'axios';

const UserAuth = createContext();

const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Login user and set user state
    setUser(userData)
  };

  // const login = async (username, password) => {
  //   try {
  //     const response = await axios.post('/api/login', { username, password });
  //     const user = response.data;
  //     setUser(user);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const logout = () => {
    // Logout user and set user state to null
    setUser(null)
  };

  const value = {
    user,
    login,
    logout,
  };

  return <UserAuth.Provider value={value}>{children}</UserAuth.Provider>;
};

export { UserAuth, UserAuthProvider };
