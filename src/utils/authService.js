const AuthService = {
    isAuthenticated: () => {
      const token = localStorage.getItem('token');
      return token !== null; 
    },
  
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
    }
  };
  
  export default AuthService;
  