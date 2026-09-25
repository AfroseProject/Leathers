import React, { useState } from 'react';

const CheckoutCart = ({ cartTotal, cartItems, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // 1. State to capture the user's shipping address
  const [customer, setCustomer] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: ''
  });

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // 2. Load the secure Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 3. The Real Checkout Function
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    setLoading(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // Send cart total, cart items, and address to your backend
      const response = await fetch('https://auraleathers-peach.vercel.app//create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: cartTotal, 
          customer: customer,
          items: cartItems 
        })
      });

      const data = await response.json();

      if (!data.success) {
        alert('Failed to create order on server.');
        setLoading(false);
        return;
      }

      // Open the Razorpay Payment Window
      const options = {
        key: 'rzp_test_TfQho3PwfWWX6K', // IMPORTANT: Put your Razorpay Test Key here
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Aura Leather',
        description: 'Premium Leather Goods',
        order_id: data.order.id, // Order ID from your backend
        handler: async function (response) {
          // 1. The payment succeeded on the frontend. Now, send proof to the backend!
          try {
            const verifyRes = await fetch('https://auraleathers-peach.vercel.app//verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // 2. Backend verified it and updated MongoDB to 'Paid'!
              if (onSuccess) {
                onSuccess(response.razorpay_payment_id);
              }
            } else {
              alert('Payment successful, but verification failed on the server.');
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        theme: {
          color: '#d97706' // Matches the amber-600 button color
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Something went wrong connecting to the payment gateway!');
    }
    setLoading(false);
  };

  // 4. Render the Form instead of just a button
  return (
    <form onSubmit={handlePayment} className="w-full space-y-3 mt-2">
      <h3 className="text-white uppercase tracking-widest text-xs font-bold border-b border-neutral-800 pb-2 mb-3">
        Shipping Details
      </h3>
      
      <input required type="text" name="name" placeholder="Full Name" onChange={handleInputChange} 
        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
      
      <input required type="email" name="email" placeholder="Email Address" onChange={handleInputChange} 
        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
      
      <input required type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} 
        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
      
      <input required type="text" name="address" placeholder="Street Address" onChange={handleInputChange} 
        className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
      
      <div className="flex gap-2">
        <input required type="text" name="city" placeholder="City" onChange={handleInputChange} 
          className="w-1/2 bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
        <input required type="text" name="pincode" placeholder="Pincode" onChange={handleInputChange} 
          className="w-1/2 bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-3 py-2 text-white text-sm outline-none transition-colors" />
      </div>
      
      <button type="submit" disabled={loading} 
        className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 font-bold tracking-widest uppercase text-sm transition-colors mt-4 disabled:opacity-50">
        {loading ? 'Processing...' : `Pay ₹${cartTotal}`}
      </button>
    </form>
  );
};

export default CheckoutCart;