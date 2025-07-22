// import React, { useState, useEffect } from "react";
// import type { TIEvent } from "../../../features/events/eventAPI";
// import {
//   bookingApi,
//   type TICreateBooking,
// } from "../../../features/Bookings/bookingAPI";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../app/store";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaTicketAlt,
//   FaCreditCard,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaTimes,
//   FaShoppingCart,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { MdAttachMoney, MdConfirmationNumber } from "react-icons/md";

// interface BookEventProps {
//   event: TIEvent | null;
//   onClose?: () => void;
// }

// const BookEvent = ({ event, onClose }: BookEventProps) => {
//   // Get customerID from Redux store
//   const currentUser = useSelector((state: RootState) => state.user);
//   const customerID = currentUser?.user || currentUser?.user; // Adjust based on your user state structure

//   const [createBooking, { isLoading: isBookingLoading, error: bookingError }] =
//     bookingApi.useCreateBookingMutation();

//   const [bookingData, setBookingData] = useState<Partial<TICreateBooking>>({
//     numberOfTickets: 1,
//     bookingStatus: "pending",
//   });

//   const [customerData, setCustomerData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const [paymentData, setPaymentData] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//   });

//   const [currentStep, setCurrentStep] = useState(1);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSuccess, setIsSuccess] = useState(false);

//   // Calculate total amount
//   const totalAmount = React.useMemo(() => {
//     if (event && bookingData.numberOfTickets) {
//       return (
//         parseFloat(event.ticketPrice) * bookingData.numberOfTickets
//       ).toFixed(2);
//     }
//     return "0.00";
//   }, [event, bookingData.numberOfTickets]);

//   // Reset form when event changes
//   useEffect(() => {
//     if (event && customerID) {
//       setBookingData({
//         eventID: event.eventID,
//         customerID: currentUser.user?.user_id,
//         numberOfTickets: 1,
//         bookingStatus: "pending",
//         totalAmount: event.ticketPrice,
//         bookingDate: new Date().toISOString(),
//       });
//       setCurrentStep(1);
//       setErrors({});
//       setIsSuccess(false);
//     }
//   }, [event, customerID, currentUser.user?.user_id]);

//   // Pre-fill customer data if available in Redux store
//   useEffect(() => {
//     if (currentUser) {
//       setCustomerData({
//         name: currentUser.user?.firstNname || currentUser.user?.lastName || "",
//         email: currentUser.user?.email || "",
//         phone:
//           currentUser.user?.contactPhone ||
//           currentUser.user?.contactPhone ||
//           "",
//       });
//     }
//   }, [currentUser]);

//   // Update total amount when tickets change
//   useEffect(() => {
//     if (event && bookingData.numberOfTickets) {
//       const total = (
//         parseFloat(event.ticketPrice) * bookingData.numberOfTickets
//       ).toFixed(2);
//       setBookingData((prev) => ({ ...prev, totalAmount: total }));
//     }
//   }, [bookingData.numberOfTickets, event]);

//   const validateBookingDetails = () => {
//     const newErrors: Record<string, string> = {};

//     if (!customerData.name.trim()) {
//       newErrors.name = "Name is required";
//     }
//     if (!customerData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
//       newErrors.email = "Email format is invalid";
//     }
//     if (!customerData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     }
//     if (!bookingData.numberOfTickets || bookingData.numberOfTickets < 1) {
//       newErrors.numberOfTickets = "At least 1 ticket is required";
//     }
//     if (
//       event &&
//       bookingData.numberOfTickets &&
//       bookingData.numberOfTickets > event.availableTickets
//     ) {
//       newErrors.numberOfTickets = `Only ${event.availableTickets} tickets available`;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validatePaymentDetails = () => {
//     const newErrors: Record<string, string> = {};

//     if (!paymentData.cardNumber.replace(/\s/g, "")) {
//       newErrors.cardNumber = "Card number is required";
//     } else if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
//       newErrors.cardNumber = "Card number must be 16 digits";
//     }
//     if (!paymentData.expiryDate) {
//       newErrors.expiryDate = "Expiry date is required";
//     } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
//       newErrors.expiryDate = "Invalid expiry date format (MM/YY)";
//     }
//     if (!paymentData.cvv) {
//       newErrors.cvv = "CVV is required";
//     } else if (paymentData.cvv.length !== 3) {
//       newErrors.cvv = "CVV must be 3 digits";
//     }
//     if (!paymentData.cardholderName.trim()) {
//       newErrors.cardholderName = "Cardholder name is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNextStep = () => {
//     if (validateBookingDetails()) {
//       setCurrentStep(2);
//     }
//   };

//   const handlePreviousStep = () => {
//     setCurrentStep(1);
//     setErrors({});
//   };

//   const handleBookingSubmit = async () => {
//     if (!validatePaymentDetails()) return;

//     try {
//       // Prepare booking payload according to your schema
//       if (!currentUser.user || !currentUser.user.user_id) {
//         setErrors({
//           submit: "User information is missing. Please log in again.",
//         });
//         return;
//       }
//       const bookingPayload: TICreateBooking = {
//         customerID: currentUser.user.user_id, // ✅ only the number
//         eventID: event!.eventID,
//         numberOfTickets: bookingData.numberOfTickets!,
//         totalAmount,
//         bookingStatus: "Confirmed",
//         bookingDate: new Date().toISOString(),
//       };

//       // Create the booking
//       await createBooking(bookingPayload).unwrap();

//       // Show success state
//       setIsSuccess(true);
//       setCurrentStep(3); // Success step

//       // Auto close after 5 seconds
//       setTimeout(() => {
//         handleClose();
//       }, 5000);
//     } catch (error: unknown) {
//       console.error("Booking failed:", error);

//       // Handle specific error messages from API
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "data" in error &&
//         typeof (error as { data?: { message?: string } }).data === "object" &&
//         (error as { data?: { message?: string } }).data !== null &&
//         "message" in (error as { data?: { message?: string } }).data!
//       ) {
//         setErrors({
//           submit: (error as { data: { message: string } }).data.message,
//         });
//       } else if (
//         typeof error === "object" &&
//         error !== null &&
//         "message" in error
//       ) {
//         setErrors({ submit: (error as { message: string }).message });
//       } else {
//         setErrors({ submit: "Booking failed. Please try again." });
//       }
//     }
//   };

//   const handleClose = () => {
//     setCurrentStep(1);
//     setBookingData({ numberOfTickets: 1, bookingStatus: "pending" });
//     setCustomerData({ name: "", email: "", phone: "" });
//     setPaymentData({
//       cardNumber: "",
//       expiryDate: "",
//       cvv: "",
//       cardholderName: "",
//     });
//     setErrors({});
//     setIsSuccess(false);

//     const modal = document.getElementById(
//       "book_event_modal"
//     ) as HTMLDialogElement;
//     modal?.close();

//     if (onClose) onClose();
//   };

//   const formatCardNumber = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//     const matches = v.match(/\d{4,16}/g);
//     const match = (matches && matches[0]) || "";
//     const parts = [];
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
//     if (parts.length) {
//       return parts.join(" ");
//     } else {
//       return v;
//     }
//   };

//   // Don't render if no event or no customer ID
//   if (!event || !customerID) {
//     return null;
//   }

//   return (
//     <dialog id="book_event_modal" className="modal">
//       <div className="modal-box w-11/12 max-w-2xl bg-white">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <FaShoppingCart className="text-blue-500" />
//             {isSuccess ? "Booking Confirmed!" : "Book Event"}
//           </h3>
//           <button
//             className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
//             onClick={handleClose}
//           >
//             <FaTimes size={16} />
//           </button>
//         </div>

//         {/* Success Step */}
//         {currentStep === 3 && isSuccess && (
//           <div className="text-center py-8">
//             <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               Booking Successful!
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Your booking for "{event.title}" has been confirmed.
//             </p>
//             <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
//               <div className="text-sm space-y-1">
//                 <div>
//                   <strong>Event:</strong> {event.title}
//                 </div>
//                 <div>
//                   <strong>Date:</strong> {event.eventDate}
//                 </div>
//                 <div>
//                   <strong>Time:</strong> {event.startTime}
//                 </div>
//                 <div>
//                   <strong>Tickets:</strong> {bookingData.numberOfTickets}
//                 </div>
//                 <div>
//                   <strong>Total Paid:</strong> ${totalAmount}
//                 </div>
//                 <div>
//                   <strong>Status:</strong> Confirmed
//                 </div>
//               </div>
//             </div>
//             <p className="text-sm text-gray-500">
//               You will receive a confirmation email shortly. This window will
//               close automatically.
//             </p>
//           </div>
//         )}

//         {/* Progress Steps - Only show if not success */}
//         {currentStep !== 3 && (
//           <div className="flex items-center justify-center mb-8">
//             <div className="flex items-center">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                   currentStep >= 1
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 1
//               </div>
//               <span className="ml-2 text-sm font-medium text-gray-600">
//                 Booking Details
//               </span>
//             </div>
//             <div
//               className={`w-16 h-1 mx-4 ${
//                 currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"
//               }`}
//             ></div>
//             <div className="flex items-center">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                   currentStep >= 2
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 2
//               </div>
//               <span className="ml-2 text-sm font-medium text-gray-600">
//                 Payment
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Event Summary Card - Only show if not success */}
//         {currentStep !== 3 && (
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-100">
//             <h4 className="font-bold text-lg text-gray-800 mb-3">
//               {event.title}
//             </h4>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div className="flex items-center gap-2">
//                 <FaCalendarAlt className="text-blue-500" size={14} />
//                 <span className="text-gray-700">{event.eventDate}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaClock className="text-green-500" size={14} />
//                 <span className="text-gray-700">{event.startTime}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MdAttachMoney className="text-yellow-500" size={16} />
//                 <span className="text-gray-700">
//                   ${event.ticketPrice} per ticket
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaTicketAlt className="text-purple-500" size={14} />
//                 <span className="text-gray-700">
//                   {event.availableTickets} available
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 1: Booking Details */}
//         {currentStep === 1 && (
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-gray-800 mb-4">
//               Customer Information
//             </h4>

//             {/* Customer Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium flex items-center gap-2">
//                     <FaUser className="text-gray-500" size={14} />
//                     Full Name *
//                   </span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`input input-bordered ${
//                     errors.name ? "input-error" : ""
//                   }`}
//                   value={customerData.name}
//                   onChange={(e) =>
//                     setCustomerData((prev) => ({
//                       ...prev,
//                       name: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter your full name"
//                 />
//                 {errors.name && (
//                   <span className="text-error text-sm mt-1">{errors.name}</span>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium flex items-center gap-2">
//                     <FaEnvelope className="text-gray-500" size={14} />
//                     Email Address *
//                   </span>
//                 </label>
//                 <input
//                   type="email"
//                   className={`input input-bordered ${
//                     errors.email ? "input-error" : ""
//                   }`}
//                   value={customerData.email}
//                   onChange={(e) =>
//                     setCustomerData((prev) => ({
//                       ...prev,
//                       email: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter your email"
//                 />
//                 {errors.email && (
//                   <span className="text-error text-sm mt-1">
//                     {errors.email}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium flex items-center gap-2">
//                     <FaPhone className="text-gray-500" size={14} />
//                     Phone Number *
//                   </span>
//                 </label>
//                 <input
//                   type="tel"
//                   className={`input input-bordered ${
//                     errors.phone ? "input-error" : ""
//                   }`}
//                   value={customerData.phone}
//                   onChange={(e) =>
//                     setCustomerData((prev) => ({
//                       ...prev,
//                       phone: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter your phone number"
//                 />
//                 {errors.phone && (
//                   <span className="text-error text-sm mt-1">
//                     {errors.phone}
//                   </span>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium flex items-center gap-2">
//                     <MdConfirmationNumber className="text-gray-500" size={14} />
//                     Number of Tickets *
//                   </span>
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max={event.availableTickets}
//                   className={`input input-bordered ${
//                     errors.numberOfTickets ? "input-error" : ""
//                   }`}
//                   value={bookingData.numberOfTickets || 1}
//                   onChange={(e) =>
//                     setBookingData((prev) => ({
//                       ...prev,
//                       numberOfTickets: parseInt(e.target.value) || 1,
//                     }))
//                   }
//                 />
//                 {errors.numberOfTickets && (
//                   <span className="text-error text-sm mt-1">
//                     {errors.numberOfTickets}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Total Amount Display */}
//             <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-gray-700">
//                   Total Amount:
//                 </span>
//                 <span className="text-2xl font-bold text-blue-600">
//                   ${totalAmount}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-500 mt-1">
//                 {bookingData.numberOfTickets} ticket(s) × ${event.ticketPrice}
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-end gap-3 pt-4">
//               <button className="btn btn-ghost px-6" onClick={handleClose}>
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-primary px-8 flex items-center gap-2"
//                 onClick={handleNextStep}
//               >
//                 Next: Payment
//                 <FaCreditCard size={14} />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Payment */}
//         {currentStep === 2 && (
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-gray-800 mb-4">
//               Payment Information
//             </h4>

//             {/* Payment Form */}
//             <div className="space-y-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium flex items-center gap-2">
//                     <FaCreditCard className="text-gray-500" size={14} />
//                     Card Number *
//                   </span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`input input-bordered ${
//                     errors.cardNumber ? "input-error" : ""
//                   }`}
//                   value={paymentData.cardNumber}
//                   onChange={(e) =>
//                     setPaymentData((prev) => ({
//                       ...prev,
//                       cardNumber: formatCardNumber(e.target.value),
//                     }))
//                   }
//                   placeholder="1234 5678 9012 3456"
//                   maxLength={19}
//                 />
//                 {errors.cardNumber && (
//                   <span className="text-error text-sm mt-1">
//                     {errors.cardNumber}
//                   </span>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">
//                     Cardholder Name *
//                   </span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`input input-bordered ${
//                     errors.cardholderName ? "input-error" : ""
//                   }`}
//                   value={paymentData.cardholderName}
//                   onChange={(e) =>
//                     setPaymentData((prev) => ({
//                       ...prev,
//                       cardholderName: e.target.value,
//                     }))
//                   }
//                   placeholder="Name as it appears on card"
//                 />
//                 {errors.cardholderName && (
//                   <span className="text-error text-sm mt-1">
//                     {errors.cardholderName}
//                   </span>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Expiry Date *
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`input input-bordered ${
//                       errors.expiryDate ? "input-error" : ""
//                     }`}
//                     value={paymentData.expiryDate}
//                     onChange={(e) => {
//                       let value = e.target.value.replace(/\D/g, "");
//                       if (value.length >= 2) {
//                         value =
//                           value.substring(0, 2) + "/" + value.substring(2, 4);
//                       }
//                       setPaymentData((prev) => ({
//                         ...prev,
//                         expiryDate: value,
//                       }));
//                     }}
//                     placeholder="MM/YY"
//                     maxLength={5}
//                   />
//                   {errors.expiryDate && (
//                     <span className="text-error text-sm mt-1">
//                       {errors.expiryDate}
//                     </span>
//                   )}
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-medium">CVV *</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`input input-bordered ${
//                       errors.cvv ? "input-error" : ""
//                     }`}
//                     value={paymentData.cvv}
//                     onChange={(e) =>
//                       setPaymentData((prev) => ({
//                         ...prev,
//                         cvv: e.target.value.replace(/\D/g, ""),
//                       }))
//                     }
//                     placeholder="123"
//                     maxLength={3}
//                   />
//                   {errors.cvv && (
//                     <span className="text-error text-sm mt-1">
//                       {errors.cvv}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
//               <h5 className="font-semibold text-gray-800 mb-2">
//                 Order Summary
//               </h5>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Event: {event.title}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Tickets: {bookingData.numberOfTickets}</span>
//                   <span>${totalAmount}</span>
//                 </div>
//                 <div className="border-t pt-2 flex justify-between font-bold">
//                   <span>Total:</span>
//                   <span className="text-green-600">${totalAmount}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Error Display */}
//             {(errors.submit || bookingError) && (
//               <div className="alert alert-error">
//                 <span>
//                   {errors.submit ||
//                     "An error occurred while processing your booking"}
//                 </span>
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between gap-3 pt-4">
//               <button
//                 className="btn btn-outline px-6"
//                 onClick={handlePreviousStep}
//                 disabled={isBookingLoading}
//               >
//                 Back
//               </button>
//               <button
//                 className={`btn btn-success px-8 flex items-center gap-2 ${
//                   isBookingLoading ? "loading" : ""
//                 }`}
//                 onClick={handleBookingSubmit}
//                 disabled={isBookingLoading}
//               >
//                 {isBookingLoading ? "Processing..." : "Complete Booking"}
//                 {!isBookingLoading && <FaShoppingCart size={14} />}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </dialog>
//   );
// };

// export default BookEvent;
