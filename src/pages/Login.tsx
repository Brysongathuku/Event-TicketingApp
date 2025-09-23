import * as yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginAPI } from "../features/login/LoginAPI";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/users/Userslice";
import { type RootState } from "../app/store"; // Import your RootState type

type LoginInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add this to debug the current state
  const currentUserState = useSelector((state: RootState) => state.user);
  console.log("🔍 Current user state in Login component:", currentUserState);

  const emailFormState = location.state?.email || "";
  const [loginUser, { isLoading }] = LoginAPI.useLoginUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFormState,
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log(" Login form data:", data);
    try {
      const response = await loginUser(data).unwrap();

      //  CRITICAL DEBUG - Check the exact structure of response
      console.log("🔍 FULL API Response:", response);
      console.log("🔍 Response type:", typeof response);
      console.log("🔍 Response keys:", Object.keys(response));

      // Check if response has the expected structure
      if (response.token) {
        console.log("Token found:", response.token);
      } else {
        console.log(" No token in response");
      }

      if (response.user) {
        console.log("User found:", response.user);
        console.log(" User keys:", Object.keys(response.user));
      } else {
        console.log(" No user in response");
      }

      // Dispatch the action
      console.log(" Dispatching loginSuccess with:", response);
      dispatch(loginSuccess(response));

      // Check state immediately after dispatch
      setTimeout(() => {
        console.log("🔍 User state after dispatch:", currentUserState);
      }, 100);

      console.log(" Login response:", response);
      toast.success("Login successful");
      if (response.user.role === "admin") {
        navigate("/admin/dashboard/");
      } else if (response.user.role === "user") {
        navigate("/user/dashboard/events");
      }

      // console.log(" Navigating to /admin/dashboard");
      // navigate("/user/dashboard/");
    } catch (error) {
      console.log(" Login error:", error);
      toast.error("Login failed. Please check your credentials and try again");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 min-h-screen flex justify-center items-center p-4">
      {isLoading ? (
        <span className="loading loading-spinner text-error"></span>
      ) : (
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Welcome Back
            </h1>
            <p className="text-blue-100 text-center text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                data-test="login-email-input"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                readOnly={!!emailFormState}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <input
                {...register("password")}
                data-test="login-password-input"
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-test="login-submit-button"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
