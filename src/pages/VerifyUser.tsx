import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { userAPI } from "../features/users/usersApi";
import { toast } from "sonner";

type VerifyUserInputs = {
  email: string;
  verificationCode: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max 100 characters")
    .required("Email is required"),

  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, "Code must be a 6 digit number")

    .required("Verification code is required"),
});

const VerifyUser = () => {
  const navigate = useNavigate();
  const [VerifyUser] = userAPI.useVerifyUserMutation();
  const location = useLocation();
  const emailFormState = location.state?.email || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyUserInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFormState,
    },
  });

  const onSubmit: SubmitHandler<VerifyUserInputs> = async (data) => {
    const { ...userData } = data;
    console.log(userData);

    try {
      const response = await VerifyUser({
        email: data.email,
        code: data.verificationCode,
      }).unwrap();
      console.log("Verification", response);
      toast.success("Account verified successfully");
      navigate("/login", {
        state: { email: data.email },
      });
    } catch (error) {
      console.log("Error", error);
      toast.error("account verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-2xl flex flex-col w-full max-w-lg p-8 rounded-md">
        <div>
          <h2 className="text-center capitalize font-semibold text-xl md:text-2xl ">
            Verify your account
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full  mt-4"
        >
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
            readOnly={!!emailFormState}
          />
          {errors.email && (
            <span className="text-rose-500 text-sm">
              {errors.email.message}
            </span>
          )}

          <input
            type="text"
            {...register("verificationCode")}
            placeholder="6 Digit Code"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.verificationCode && (
            <span className="text-rose-500 text-sm">
              {errors.verificationCode.message}
            </span>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600  p-2 rounded-md mt-4 text-white"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;
