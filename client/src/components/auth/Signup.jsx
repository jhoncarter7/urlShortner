import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSignupStatus, signupUser } from "../../store/slices/authSlice";
import { UserPlus } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import MessageBox from "../common/MessageBox";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { signupLoading, signupError, signupSuccess } = useSelector(
    (state) => state.auth
  ); 
  const navigate = useNavigate(); 


  useEffect(() => {
    dispatch(clearSignupStatus());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearSignupStatus());
    dispatch(signupUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch(() => {
        console.error("Signup failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <MessageBox
            message={signupError}
            type="error"
            onDismiss={() => dispatch(clearSignupStatus())}
          />

          <MessageBox
            message={signupSuccess}
            type="success"
            onDismiss={() => dispatch(clearSignupStatus())}
          />

          <div className="mb-4 mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="signup-email"
            >
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="signup-password"
            >
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              disabled={signupLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-50"
            >
              {signupLoading ? (
                <LoadingSpinner size={5} />
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </>
              )}
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 focus:outline-none underline"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
