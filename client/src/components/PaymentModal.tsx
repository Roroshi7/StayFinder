import React, { useState } from 'react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, onSuccess, amount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (cardNumber.length === 16 && expiry && cvc.length === 3) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess();
        }, 1200);
      } else {
        setError('Invalid card details. Use 16 digits and 3-digit CVC.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Complete Payment</h2>
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              maxLength={16}
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="1234 5678 9012 3456"
              disabled={loading || success}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Expiry</label>
              <input
                type="text"
                maxLength={5}
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, ''))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="MM/YY"
                disabled={loading || success}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <input
                type="text"
                maxLength={3}
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="123"
                disabled={loading || success}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-primary-600">₹{amount}</span>
            <button
              type="submit"
              className="btn btn-primary px-6"
              disabled={loading || success}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">Payment successful!</div>}
        </form>
      </div>
    </div>
  );
}; 