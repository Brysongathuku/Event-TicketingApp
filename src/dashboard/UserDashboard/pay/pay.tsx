import React, { useState, useEffect } from "react";

import {
  FaBitcoin,
  FaEthereum,
  FaCopy,
  FaCheck,
  FaTimes,
  FaPlus,
  FaMinus,
  FaExchangeAlt,
} from "react-icons/fa";
import { SiTether } from "react-icons/si";

interface PayProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    eventID: number;
    title: string;
    ticketPrice: number;
  };
  customerID: number;
}

interface CryptoOption {
  name: string;
  symbol: string;
  address: string;
  icon: React.ReactNode;
  color: string;
  qrCode?: string;
}

interface ExchangeRates {
  EUR: number;
  GBP: number;
}

const Pay: React.FC<PayProps> = ({ isOpen, onClose, event }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  // const [showQR, setShowQR] = useState<boolean>(false); // QR feature commented out
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  // New state for ticket calculation and currency conversion
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    EUR: 0.92,
    GBP: 0.79,
  });
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  // New state for payment loading and cooldown
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const [paymentCooldown, setPaymentCooldown] = useState<number>(0);
  const [cooldownTimer, setCooldownTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const cryptoOptions: CryptoOption[] = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "bc1q3w4umuny50rdc9dcwcszs00euay3q0cpv4mq4s",
      icon: <FaBitcoin size={24} />,
      color: "from-orange-500 to-yellow-500",
      // qrCode: "btc-qr", // QR code commented out
    },
    {
      name: "USDT (TRC-20)",
      symbol: "USDT",
      address: "TX3dv389V7d9eeDnrAJuvokYka5rPogQ6a",
      icon: <SiTether size={24} />,
      color: "from-green-500 to-emerald-500",
      // qrCode: "usdt-qr", // QR code commented out
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x09710b400A91AD6d5Ed80F0696C59928F317b5BC",
      icon: <FaEthereum size={24} />,
      color: "from-blue-500 to-purple-500",
    },
  ];

  // Calculate total amount in USD
  const totalAmountUSD = ticketQuantity * event.ticketPrice;

  // Convert amount based on selected currency
  const getConvertedAmount = (): number => {
    switch (selectedCurrency) {
      case "EUR":
        return totalAmountUSD * exchangeRates.EUR;
      case "GBP":
        return totalAmountUSD * exchangeRates.GBP;
      default:
        return totalAmountUSD;
    }
  };

  const getCurrencySymbol = (): string => {
    switch (selectedCurrency) {
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  // Simulate fetching exchange rates (in real app, use actual API)
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // In real implementation, fetch from actual exchange rate API
      // For now, using mock rates that update slightly
      setTimeout(() => {
        setExchangeRates({
          EUR: 0.92 + (Math.random() - 0.5) * 0.02,
          GBP: 0.79 + (Math.random() - 0.5) * 0.02,
        });
        setIsLoadingRates(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExchangeRates();
    }
  }, [isOpen]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer) {
        clearInterval(cooldownTimer);
      }
    };
  }, [cooldownTimer]);

  // Start countdown timer
  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      setPaymentCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setCooldownTimer(timer);
  };

  const copyToClipboard = async (address: string, symbol: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(symbol);
      setTimeout(() => setCopiedAddress(""), 3000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
    // setShowQR(false); // QR feature commented out
  };

  // QR toggle function commented out
  // const toggleQR = () => {
  //   setShowQR(!showQR);
  // };

  const handleTicketQuantityChange = (change: number) => {
    const newQuantity = ticketQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setTicketQuantity(newQuantity);
    }
  };

  const handleCompletePayment = () => {
    if (isProcessingPayment || paymentCooldown > 0) return;

    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentCompleted(true);
      setIsProcessingPayment(false);

      // Start 3-minute cooldown (180 seconds)
      setPaymentCooldown(180);
      startCooldownTimer();

      setTimeout(() => {
        onClose();
        setPaymentCompleted(false);
        setSelectedCrypto("");
        setTicketQuantity(1);
        setSelectedCurrency("USD");
        // Reset cooldown when modal closes
        setPaymentCooldown(0);
        if (cooldownTimer) {
          clearInterval(cooldownTimer);
          setCooldownTimer(null);
        }
      }, 3000);
    }, 2000); // 2 second loading simulation
  };

  // Helper function to format countdown time
  // Removed unused formatCountdown function

  if (!isOpen) return null;

  const selectedCryptoData = cryptoOptions.find(
    (crypto) => crypto.symbol === selectedCrypto
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Pay with Crypto
            </h2>
            <p className="text-gray-600 mt-1">
              Choose your preferred payment method
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Ticket Quantity Selection */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">{event.title}</h3>

          {/* Ticket Quantity Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-medium">
              Number of Tickets:
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTicketQuantityChange(-1)}
                disabled={ticketQuantity <= 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  ticketQuantity <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FaMinus size={12} />
              </button>
              <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">
                {ticketQuantity}
              </span>
              <button
                onClick={() => handleTicketQuantityChange(1)}
                disabled={ticketQuantity >= 10}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  ticketQuantity >= 10
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          {/* Currency Conversion */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-black font-medium">Display Currency:</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <button
                onClick={fetchExchangeRates}
                disabled={isLoadingRates}
                className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                title="Refresh exchange rates"
              >
                <FaExchangeAlt
                  size={16}
                  className={isLoadingRates ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-black">Price per ticket (USD):</span>
              <span className="font-medium text-black">
                ${event.ticketPrice}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-black">Quantity:</span>
              <span className="font-medium text-black">{ticketQuantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-black">Subtotal (USD):</span>
              <span className="font-medium text-black">${totalAmountUSD}</span>
            </div>
            {selectedCurrency !== "USD" && (
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-black">
                  Exchange Rate (1 USD = {selectedCurrency}):
                </span>
                <span className="font-medium text-black">
                  {selectedCurrency === "EUR"
                    ? exchangeRates.EUR.toFixed(4)
                    : exchangeRates.GBP.toFixed(4)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-black font-semibold">Total Amount:</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {getCurrencySymbol()}
                  {getConvertedAmount().toFixed(2)}
                </div>
                {selectedCurrency !== "USD" && (
                  <div className="text-xs text-gray-500">
                    (${totalAmountUSD} USD)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Success */}
        {paymentCompleted && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Payment Submitted!
            </h3>
            <p className="text-gray-600 mb-2">
              Your payment of {getCurrencySymbol()}
              {getConvertedAmount().toFixed(2)} for {ticketQuantity} ticket
              {ticketQuantity > 1 ? "s" : ""} is being processed.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive a confirmation email shortly.
            </p>
          </div>
        )}

        {/* Crypto Selection */}
        {!paymentCompleted && (
          <>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Select Cryptocurrency
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {cryptoOptions.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => handleCryptoSelect(crypto.symbol)}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      selectedCrypto === crypto.symbol
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${crypto.color} flex items-center justify-center text-white`}
                      >
                        {crypto.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">
                          {crypto.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                    {selectedCrypto === crypto.symbol && (
                      <FaCheck className="text-blue-500" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Crypto Details */}
            {selectedCryptoData && (
              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-gray-800">
                      {selectedCryptoData.name} Address
                    </h5>
                    {/* QR Code Button - Commented Out */}
                    {/* {selectedCryptoData.qrCode && (
                      <button
                        onClick={toggleQR}
                        className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <FaQrcode size={16} />
                        <span className="text-sm">{showQR ? "Hide" : "Show"} QR</span>
                      </button>
                    )} */}
                  </div>

                  {/* QR Code Display - Completely Commented Out */}
                  {/* {showQR && selectedCryptoData.qrCode && (
                    <div className="mb-4 text-center">
                      <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl border-2 border-gray-200">
                        {selectedCryptoData.symbol === "BTC" ? (
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <FaBitcoin size={48} className="text-orange-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 font-mono break-all px-2">
                                  {selectedCryptoData.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : selectedCryptoData.symbol === "USDT" ? (
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <SiTether size={48} className="text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 font-mono break-all px-2">
                                  {selectedCryptoData.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <FaQrcode size={48} className="text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">QR Code</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Scan this QR code with your crypto wallet
                      </p>
                    </div>
                  )} */}

                  {/* Address Copy Section */}
                  <div className="relative">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm text-black break-all">
                      {selectedCryptoData.address}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedCryptoData.address,
                          selectedCryptoData.symbol
                        )
                      }
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                        copiedAddress === selectedCryptoData.symbol
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      {copiedAddress === selectedCryptoData.symbol ? (
                        <FaCheck size={16} />
                      ) : (
                        <FaCopy size={16} />
                      )}
                    </button>
                  </div>

                  {copiedAddress === selectedCryptoData.symbol && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      ✓ Address copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Payment Instructions */}

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h6 className="font-semibold text-blue-800 mb-2">
                    Payment Instructions:
                  </h6>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>
                      1. Copy the wallet address above by clicking the copy
                      button
                    </li>
                    <li>
                      2. Open your crypto wallet app (Coinbase, Trust Wallet,
                      MetaMask, Binance, or Crypto.com)
                    </li>
                    <li>
                      3. Navigate to "Send" or "Transfer" section in your wallet
                    </li>
                    <li>
                      4. Select {selectedCryptoData.symbol} and paste the copied
                      address
                    </li>
                    <li>
                      5. Send exactly {getCurrencySymbol()}
                      {getConvertedAmount().toFixed(2)} worth of{" "}
                      {selectedCryptoData.symbol}
                    </li>
                    <li>6. Return to this page and click "Complete Payment"</li>
                    <li>
                      7. Your ticket will be available for download from your
                      dashboard within 5-10 minutes
                    </li>
                  </ol>

                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 font-semibold mb-2">
                      📱 Popular Wallet Apps by Region:
                    </p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>
                        <strong>🇺🇸 USA:</strong> Coinbase, Trust Wallet,
                        MetaMask
                      </p>
                      <p>
                        <strong>🇬🇧 UK/London:</strong> Coinbase, Binance, Trust
                        Wallet
                      </p>
                      <p>
                        <strong>🇪🇺 Europe:</strong> Binance, Coinbase,
                        Crypto.com, MetaMask
                      </p>
                    </div>
                  </div>

                  {selectedCurrency !== "USD" && (
                    <p className="text-xs text-blue-600 mt-2">
                      * Amount shown in {selectedCurrency}, equivalent to $
                      {totalAmountUSD} USD
                    </p>
                  )}
                </div>

                {/* Complete Payment Button */}
                <button
                  onClick={handleCompletePayment}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaCheck size={18} />
                  Complete Payment - {getCurrencySymbol()}
                  {getConvertedAmount().toFixed(2)}
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Please ensure you send the exact amount to avoid delays in
                  processing. check your ticket from the dashboard for download
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pay;
