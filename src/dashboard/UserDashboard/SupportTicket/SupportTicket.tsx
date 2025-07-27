import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateSupportTicketMutation } from "../../../features/supportTickets/supportTicketApi";
import type { RootState } from "../../../app/store";
import type { CreateSupportTicketRequest } from "../../../features/supportTickets/supportTicketApi";

type SupportTicketInputs = {
  subject: string;
  description: string;
};

const schema = yup.object({
  subject: yup
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters")
    .required("Subject is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .required("Description is required"),
});

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="inline-flex items-center">
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Submitting...
  </div>
);

const SupportTicket = () => {
  const navigate = useNavigate();
  const [createSupportTicket] = useCreateSupportTicketMutation();
  const [isLoading, setIsLoading] = useState(false);

  // Get logged in user's customerID from Redux store
  const user = useSelector((state: RootState) => state.user);
  const customerID = user.user?.user_id; // Adjust this path based on your user state structure

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SupportTicketInputs>({
    resolver: yupResolver(schema),
  });

  // Watch description for character count
  const description = watch("description", "");
  const subject = watch("subject", "");

  const onSubmit: SubmitHandler<SupportTicketInputs> = async (data) => {
    if (!customerID) {
      toast.error("Please log in to submit a support ticket");
      return;
    }

    setIsLoading(true);

    try {
      const ticketData: CreateSupportTicketRequest = {
        customerID,
        subject: data.subject,
        description: data.description,
      };

      await createSupportTicket(ticketData).unwrap();

      toast.success("Support ticket submitted successfully!");
      reset();

      // Optionally navigate to a tickets list page
      navigate("/events");
    } catch (error) {
      console.error("Error creating support ticket:", error);

      // Type guard to check if error has the expected structure
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to submit support ticket. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in
  if (!customerID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to submit a support ticket.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM8.25 12l7.5 0"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit Support Ticket
          </h1>
          <p className="text-gray-600">
            Need help? Let us know what's going on and we'll get back to you
            soon.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="Brief description of your issue"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
                    errors.subject
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-gray-400">
                    {subject.length}/200
                  </span>
                </div>
              </div>
              {errors.subject && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="relative">
                <textarea
                  {...register("description")}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }`}
                />
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-0 pr-3 flex items-center pointer-events-none">
                  <span
                    className={`text-xs ${
                      description.length > 1800
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {description.length}/2000
                  </span>
                </div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority Level Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Response Time
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    We typically respond to support tickets within 24-48 hours
                    during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? <LoadingSpinner /> : "Submit Support Ticket"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need immediate assistance?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Contact us directly
              </button>
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Before submitting, check our{" "}
            <button className="text-blue-600 hover:underline">
              FAQ section
            </button>{" "}
            for quick answers
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
