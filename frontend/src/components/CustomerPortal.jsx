import React, { useState, useEffect } from 'react';

export default function CustomerPortal() {
  const [token, setToken] = useState(localStorage.getItem('customerToken') || null);
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);

  // Fetch orders automatically if the user is already logged in
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setStatus('Sending code...');
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setStatus('Code sent to your email!');
      } else {
        setStatus(data.message || 'Error sending code.');
      }
    } catch (err) {
      setStatus('Network error.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus('Verifying...');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        setToken(data.token);
        setStatus('');
      } else {
        setStatus(data.message || 'Invalid code.');
      }
    } catch (err) {
      setStatus('Network error.');
    }
  };

  // Fetch Order History
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/my-orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('customerToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders");
    }
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setToken(null);
    setStep(1);
    setEmail('');
    setOtp('');
  };

  // --- UI: DASHBOARD (Logged In) ---
 // --- UI: DASHBOARD (Logged In) ---
  if (token) {
    return (
      <div className="pt-40 pb-24 max-w-4xl mx-auto px-6 text-white min-h-screen">
        <div className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-4">
          <h2 className="text-4xl font-serif text-amber-500">Your Orders</h2>
          <button onClick={logout} className="text-sm text-neutral-400 hover:text-amber-500 uppercase tracking-widest font-bold transition-colors">
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 text-center">
              <p className="text-neutral-400 text-lg">You haven't placed any orders yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6 hover:border-neutral-700 transition-colors">
                <div className="w-full md:w-auto">
                  <p className="text-xs text-neutral-500 mb-1 tracking-widest">ORDER # {order._id}</p>
                  <p className="text-lg font-medium text-white mb-1">
                    Status: <span className="text-amber-500">{order.status}</span>
                  </p>
                  <p className="text-sm text-neutral-400">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto flex flex-col items-start md:items-end">
                  <p className="text-2xl font-serif text-amber-500 mb-3">₹{order.totalAmount}</p>
                  
                  {/* Updated Track Button */}
                  <button 
                    onClick={() => {
                      // Simulating a tracking action
                      alert(`Tracking link for Order ${order._id} is being generated. You will be redirected to BlueDart tracking once dispatched.`);
                    }}
                    className="px-6 py-2 text-sm border border-neutral-700 hover:border-amber-500 text-neutral-300 hover:text-amber-500 rounded transition-all uppercase tracking-widest font-bold"
                  >
                    Track Package
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- UI: LOGIN FLOW (Not Logged In) ---
  return (
    <div className="flex justify-center items-center py-20">
      <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-serif text-white mb-6 text-center">
          {step === 1 ? 'Sign In / Register' : 'Enter Secure Code'}
        </h2>
        
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none" />
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 font-bold tracking-widest uppercase text-sm">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-neutral-400 text-center">Code sent to {email}</p>
            <input required type="text" placeholder="6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none text-center tracking-[1em] font-mono text-xl" />
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 font-bold tracking-widest uppercase text-sm">
              Verify & Login
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-neutral-500 hover:text-white text-sm mt-2">
              Use a different email
            </button>
          </form>
        )}

        {status && <p className="text-center text-sm mt-4 text-amber-500">{status}</p>}
      </div>
    </div>
  );
}