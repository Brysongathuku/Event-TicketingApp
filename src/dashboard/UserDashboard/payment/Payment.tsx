import React, { useState } from "react";
import { FaCreditCard, FaMobile, FaTimes, FaSpinner } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import {
  useCreatePaymentMutation,
  useInitiateMpesaPaymentMutation,
} from "../../../features/Payments/paymentsApi";
import { useCreateBookingMutation } from "../../../features/Bookings/bookingAPI";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    eventID: number;
    title: string;
    ticketPrice: number;
  };
  customerID: number;
}

type PaymentMethod = "mpesa" | "stripe";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  event,
  customerID,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  const [createPayment] = useCreatePaymentMutation();
  const [createBooking] = useCreateBookingMutation();
  const [initiateMpesaPayment] = useInitiateMpesaPaymentMutation();

  const totalAmount = event.ticketPrice * numberOfTickets;

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digits
    const cleaned = phone.replace(/\D/g, "");
    // If starts with 07, convert to 2547
    if (cleaned.startsWith("07")) {
      return "254" + cleaned.substring(1);
    }
    // If starts with +254, remove +
    if (cleaned.startsWith("254")) {
      return cleaned;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim() && selectedMethod === "mpesa") {
      alert("Please enter your phone number");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Starting payment process...");

      // Step 1: Create booking
      const bookingData = {
        customerID: customerID,
        eventID: event.eventID,
        numberOfTickets: numberOfTickets,
        totalAmount: totalAmount.toFixed(2),
        bookingDate: new Date().toISOString(),
        bookingStatus: "confirmed" as const,
      };

      console.log("Creating booking with data:", bookingData);

      const bookingResponse = await createBooking(bookingData).unwrap();
      console.log("Booking created:", bookingResponse);

      // Ensure we have the booking ID
      const bookingID = bookingResponse?.bookingID;

      if (!bookingID) {
        throw new Error("Failed to create booking - no booking ID returned");
      }

      // Step 2: Create payment record
      type PaymentMethod = "M-Pesa" | "Stripe";

      const paymentData = {
        customerID: Number(customerID),
        bookingID: Number(bookingID),
        amount: totalAmount.toString(),
        paymentMethod: (selectedMethod === "mpesa"
          ? "M-Pesa"
          : "Stripe") as PaymentMethod,
        paymentStatus: "Pending" as const,
      };

      console.log("Creating payment with data:", paymentData);

      const paymentResponse = await createPayment(paymentData).unwrap();
      console.log("Payment created:", paymentResponse);

      // Ensure we have the payment ID
      const paymentID =
        paymentResponse?.data?.paymentID || paymentResponse?.data.paymentID;

      if (!paymentID) {
        throw new Error("Failed to create payment - no payment ID returned");
      }

      if (selectedMethod === "mpesa") {
        // Step 3: Initiate M-Pesa STK Push
        const formattedPhone = formatPhoneNumber(phoneNumber);

        const mpesaData = {
          phoneNumber: formattedPhone,
          amount: totalAmount,
          paymentID: Number(paymentID),
        };

        console.log("Initiating M-Pesa payment with data:", mpesaData);

        const mpesaResponse = await initiateMpesaPayment(mpesaData).unwrap();

        if (mpesaResponse.success) {
          alert(
            `${
              mpesaResponse.data?.CustomerMessage ||
              "STK Push sent! Please check your phone to complete payment."
            }`
          );
          onClose();
        } else {
          throw new Error(mpesaResponse.message || "M-Pesa payment failed");
        }
      } else {
        // Handle Stripe payment here
        alert("Stripe payment integration coming soon!");
        onClose();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Payment error:", error);

      let errorMessage = "Please try again";

      // Handle different error formats
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-gray-600">{event.title}</p>
            <p className="text-lg font-semibold text-gray-800">
              ${event.ticketPrice} × {numberOfTickets} = ${totalAmount}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ticket Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setNumberOfTickets(Math.max(1, numberOfTickets - 1))
                }
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold w-8 text-center">
                {numberOfTickets}
              </span>
              <button
                onClick={() => setNumberOfTickets(numberOfTickets + 1)}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Payment Method
            </label>
            <div className="space-y-3">
              {/* M-Pesa Option */}
              <div
                onClick={() => setSelectedMethod("mpesa")}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedMethod === "mpesa"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === "mpesa"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "mpesa" && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <FaMobile className="text-green-600 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">M-Pesa</p>
                    <p className="text-sm text-gray-600">
                      Pay with your mobile money
                    </p>
                  </div>
                </div>
              </div>

              {/* Stripe Option */}
              <div
                onClick={() => setSelectedMethod("stripe")}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedMethod === "stripe"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === "stripe"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "stripe" && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <FaCreditCard className="text-blue-600 text-xl" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Card Payment</p>
                    <p className="text-sm text-gray-600">
                      Visa, Mastercard, etc.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <SiVisa className="text-blue-600 text-lg" />
                    <SiMastercard className="text-red-500 text-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* M-Pesa Phone Number Input */}
          {selectedMethod === "mpesa" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678 or +254712345678"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Safaricom M-Pesa number
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay ${totalAmount}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
