import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('Message sent successfully! We will get back to you soon.');
        // Clear the form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('Error connecting to the server.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-neutral-900 p-8 rounded-lg border border-neutral-800 mt-10">
      <h2 className="text-2xl font-serif text-white mb-6">Contact Concierge</h2>
      <form onSubmit={handleContactSubmit} className="space-y-4">
        
        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" 
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none" />
        
        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" 
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none" />
        
        <input required type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject (e.g., Custom Order)" 
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none" />
        
        <textarea required name="message" value={formData.message} onChange={handleInputChange} placeholder="How can we help you?" rows="4"
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none resize-none"></textarea>
        
        <button type="submit" disabled={status === 'Sending...'} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 font-bold tracking-widest uppercase text-sm disabled:opacity-50 transition-colors">
          Send Message
        </button>

        {status && (
          <p className={`text-center text-sm mt-4 ${status.includes('successfully') ? 'text-green-500' : 'text-amber-500'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}