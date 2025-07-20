import * as yup from "yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router";
import { userAPI } from "../features/users/usersApi";
import { toast } from "sonner";

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmpassword: string;
};

const schema = yup.object({
  firstName: yup
    .string()
    .max(50, "Max is 50 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .max(50, "Max is 50 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max is 100 characters")
    .required("email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("password is required"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = userAPI.useCreateUSersMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    console.log(data);
    //API
    try {
      const response = await createUser(data).unwrap();
      console.log("Response..", response);
      toast.success(
        "Registration  successfull check  your  email  for verification"
      );

      navigate("/verify", {
        state: { email: data.email },
      });
    } catch (error) {
      console.log("error creating customer", error);
      toast.error("Registration  failed, please try  again");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 min-h-screen flex justify-center items-center p-4">
      {isLoading ? (
        <span className="loading loading-spinner text-error"></span>
      ) : (
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-purple-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Create Account
            </h1>
            <p className="text-purple-100 text-center text-sm mt-1">
              Join us today and get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.firstName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              />
              {errors.firstName && (
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
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.lastName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              />
              {errors.lastName && (
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
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
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

            {/* password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Create a password"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-purple-400"
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

            {/* Confirm password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                {...register("confirmpassword")}
                type="password"
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.confirmpassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              />
              {errors.confirmpassword && (
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
                  {errors.confirmpassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-800 font-medium ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
