import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../../store/slices/authSlice";
import { LogIn } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import MessageBox from "../common/MessageBox";
import { useNavigate } from "react-router";


// import { loginUser } from './store/slices/authSlice'; // Adjust the path as necessary
const Login = () => {
    // Imports would be needed here: React, hooks, dispatch, actions, components
    const [email, setEmail] = useState('intern@dacoid.com');
    const [password, setPassword] = useState('Test123');
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(clearAuthError());
      dispatch(loginUser({ email, password }));
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          <form onSubmit={handleSubmit}>
            <MessageBox message={error} type="error" onDismiss={() => dispatch(clearAuthError())} />
            <div className="mb-4 mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="******************"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size={5} /> : <><LogIn className="mr-2 h-4 w-4" /> Login</>}
              </button>
              
              
              
            </div>
            <div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Don't have an account? <button onClick={()=> navigate("/register")} className="text-blue-600 hover:text-blue-800">Register</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default Login;