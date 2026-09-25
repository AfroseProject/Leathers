import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, X, Menu, MessageCircle, ArrowRight, Star, Plus, Minus, Trash2, Check } from 'lucide-react';
import CheckoutCart from './components/CheckoutCart';
import CustomerPortal from './components/CustomerPortal';

import artisanBeltImg from './assets/Artisanleatherbelt.png';
import Leatherkeyorganizer from './assets/Leather_Key Organizer.png'
// --- CUSTOM ICONS ---
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// --- ASSETS & DATA ---
const HERO_IMAGE = "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1600&q=80";
const CRAFT_IMAGE = "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=1000&q=80";

const PRODUCTS = [
  { id: 1, name: "The Heritage Briefcase", price: 12500, category: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", description: "Handcrafted from full-grain Italian leather." },
  { id: 2, name: "Classic Cognac Tote", price: 8500, category: "Bags", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", description: "A versatile, spacious tote that ages beautifully." },
  { id: 3, name: "Minimalist Bifold Wallet", price: 2500, category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80", description: "Slim profile, hand-stitched edges." },
  { id: 4, name: "Artisan Leather Belt", price: 3200, category: "Accessories", image: artisanBeltImg, description: "Solid brass hardware meets thick leather." },
  { id: 5, name: "Weekend Duffle", price: 18000, category: "Travel", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80", description: "The ultimate travel companion for short getaways." },
  { id: 6, name: "Leather Key Organizer", price: 1200, category: "Accessories", image: Leatherkeyorganizer, description: "Keep your keys silent and organized." }
];

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(''); // 'sending', 'sent', or ''

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // 1. Send the real data to your Node.js server
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Database save succeeded!
        setStatus('sent');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success badge after 4 seconds
        setTimeout(() => setStatus(''), 4000);
      } else {
        // Handle server-side errors
        console.error("Backend error:", data);
        setStatus('error');
      }
    } catch (err) {
      // Handle network/connection failure
      console.error("Network error:", err);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 mt-8 text-base">
      {/* Contact Details Column */}
      <div className="md:w-1/3 space-y-8">
        <div>
          <h4 className="text-amber-500 font-serif text-xl mb-2">Artisan Studio</h4>
          <p className="text-neutral-400">123 Heritage Lane<br/>Colaba, Mumbai<br/>Maharashtra 400005<br/>India</p>
        </div>
        <div>
          <h4 className="text-amber-500 font-serif text-xl mb-2">Direct Lines</h4>
          <p className="text-neutral-400">
            <span className="block mb-1"><strong>Email:</strong> support@auraleather.com</span>
            <span className="block"><strong>WhatsApp:</strong> +91 98765 43210</span>
          </p>
        </div>
        <div>
          <h4 className="text-amber-500 font-serif text-xl mb-2">Studio Hours</h4>
          <p className="text-neutral-400">Monday - Friday<br/>9:00 AM - 6:00 PM IST</p>
        </div>
      </div>

      {/* Inquiry Form Column */}
      <div className="md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Full Name</label>
              <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} 
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
              <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} 
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none transition-colors" placeholder="john@example.com" />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Inquiry Type</label>
            <select id="subject" name="subject" value={formData.subject} onChange={handleChange} 
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none transition-colors appearance-none">
              <option value="" disabled>Select a topic...</option>
              <option value="order">Order Status & Tracking</option>
              <option value="custom">Custom & Bespoke Orders</option>
              <option value="returns">Returns & Exchanges</option>
              <option value="other">General Inquiry</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Message</label>
            <textarea required id="message" name="message" rows="5" value={formData.message} onChange={handleChange} 
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded px-4 py-3 text-white outline-none transition-colors resize-none" placeholder="How can we assist you today?"></textarea>
          </div>

          <button type="submit" disabled={status === 'sending'} 
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 font-bold tracking-widest uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'sent' && (
            <div className="p-4 bg-green-900/30 border border-green-500/50 text-green-400 rounded text-center text-sm">
              Thank you for reaching out. Our artisans will get back to you within 24 hours.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const PAGE_CONTENT = {
  'privacy-policy': { 
    title: 'Privacy Policy', 
    content: (
      <div className="space-y-8">
        <p className="text-neutral-300">
          At Aura Leather, we are committed to protecting the privacy and security of our customers. This Privacy Policy outlines how we collect, use, and protect your personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023, and other applicable Indian laws.
        </p>

        {/* Section 1: Data Collection */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">1. Information We Collect</h3>
          <div className="space-y-4 text-neutral-300">
            <p>We only collect personal data that is strictly necessary for providing our services to you. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identifiable Information (PII):</strong> Your name, email address, phone number, shipping and billing addresses provided during checkout or account creation.</li>
              <li><strong>Payment Information:</strong> We do not store your Credit Card, Debit Card, or UPI details on our servers. All transactions are securely processed via PCI-DSS compliant third-party payment gateways (e.g., Razorpay/Stripe).</li>
              <li><strong>Technical Data:</strong> Your IP address, browser type, and interactions with our website, collected via cookies to enhance your shopping experience.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Use of Data */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">2. How We Use Your Information</h3>
          <div className="space-y-4 text-neutral-300">
            <p>Your data is processed based on your explicit consent for the following legitimate purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process, fulfill, and dispatch your orders.</li>
              <li>To communicate with you regarding your order status, delivery tracking, and customer support inquiries.</li>
              <li>To comply with legal obligations, including tax and consumer protection laws.</li>
              <li>To send marketing communications, only if you have explicitly opted-in to receive them.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Data Sharing */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">3. Information Sharing & Third Parties</h3>
          <div className="space-y-4 text-neutral-300">
            <p>We do not sell, rent, or trade your personal information. We may share your data strictly with trusted third parties to fulfill our services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Logistics Partners:</strong> Delivery services (e.g., BlueDart, Delhivery, FedEx) to ship your handcrafted items.</li>
              <li><strong>Payment Processors:</strong> Secure gateways to facilitate your transactions.</li>
              <li><strong>Legal Authorities:</strong> If requested by law enforcement or government authorities as mandated by Indian law.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: User Rights (DPDP Act 2023) */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">4. Your Rights as a Data Principal</h3>
          <div className="space-y-4 text-neutral-300">
            <p>Under the DPDP Act, 2023, you hold the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right to Access & Correction:</strong> You may request a summary of your data and ask us to correct or update inaccurate information.</li>
              <li><strong>Right to Erasure:</strong> You can request the deletion of your personal data when it is no longer required for the purpose it was collected (subject to legal retention requirements).</li>
              <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent for data processing at any time, which may affect our ability to provide certain services to you.</li>
            </ul>
            <p>To exercise these rights, please email our Grievance Officer.</p>
          </div>
        </section>

        {/* Section 5: Grievance Officer */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">5. Grievance Redressal</h3>
          <div className="space-y-4 text-neutral-300">
            <p>In accordance with the Information Technology Act, 2000, and the DPDP Act, 2023, the name and contact details of our designated Grievance Officer are provided below. We aim to resolve all privacy-related queries within 30 days.</p>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 mt-4">
              <p className="text-amber-500 font-medium mb-2">Grievance Officer</p>
              <ul className="space-y-1 text-neutral-400">
                <li><strong>Name:</strong> [Insert Name / Legal Team]</li>
                <li><strong>Email:</strong> legal@auraleather.com</li>
                <li><strong>Phone:</strong> +91 9XXXX XXXXX</li>
                <li><strong>Address:</strong> Aura Leather HQ, [Insert Complete Business Address, City, Pin Code, India]</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    )
  },
  'terms-of-service': { 
    title: 'Terms of Service', 
    content: (
      <div className="space-y-8">
        <p className="text-neutral-300">
          Welcome to Aura Leather. By accessing or using our website, you agree to be bound by the following Terms and Conditions. Please read them carefully before making a purchase. These terms constitute a legally binding electronic contract under the Information Technology Act, 2000.
        </p>

        {/* Section 1: Eligibility & Contract */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">1. Eligibility</h3>
          <div className="space-y-4 text-neutral-300">
            <p>In accordance with the Indian Contract Act, 1872, you must be at least 18 years of age to use this website and enter into a binding contract. If you are a minor, you may use our website only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.</p>
          </div>
        </section>

        {/* Section 2: Product Authenticity (Crucial for Leather) */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">2. Product Authenticity & Variations</h3>
          <div className="space-y-4 text-neutral-300">
            <p>Aura Leather prides itself on using premium, full-grain leather. Because leather is a natural material, slight variations in texture, color, and grain are inherent characteristics of the hide and are not considered manufacturing defects. Such variations are the hallmark of authentic, handcrafted leather goods.</p>
            <p>While we make every effort to display the colors and details of our products accurately, we cannot guarantee that your device's display of any color will be perfectly accurate.</p>
          </div>
        </section>

        {/* Section 3: Pricing & Payments */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">3. Pricing, GST, and Payments</h3>
          <div className="space-y-4 text-neutral-300">
            <p>All prices displayed on the website are in Indian Rupees (INR) and are inclusive of the applicable Goods and Services Tax (GST). Prices are subject to change without prior notice, but such changes will not affect orders that have already been dispatched.</p>
            <p>We process payments through secure, RBI-compliant third-party payment gateways. Aura Leather reserves the right to cancel any order if a fraudulent transaction is suspected or if there is an error in pricing or product information.</p>
          </div>
        </section>

        {/* Section 4: Intellectual Property */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">4. Intellectual Property Rights</h3>
          <div className="space-y-4 text-neutral-300">
            <p>All content on this website, including but not limited to text, graphics, logos, images, product designs, and software, is the exclusive property of Aura Leather and is protected by Indian and international copyright and trademark laws. Any unauthorized reproduction, modification, or distribution is strictly prohibited.</p>
          </div>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">5. Limitation of Liability</h3>
          <div className="space-y-4 text-neutral-300">
            <p>To the maximum extent permitted by Indian law, Aura Leather and its artisans, directors, or employees shall not be liable for any indirect, incidental, punitive, or consequential damages arising from your use of our website or products. Our total liability to you for any claim arising out of your purchase shall not exceed the amount you paid for the specific product in question.</p>
          </div>
        </section>

        {/* Section 6: Governing Law & Jurisdiction */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">6. Governing Law & Jurisdiction</h3>
          <div className="space-y-4 text-neutral-300">
            <p>These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the Republic of India.</p>
            <p>Any disputes arising out of or related to these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts located in <strong>[Insert Your City/State, e.g., Mumbai, Maharashtra]</strong>, India.</p>
          </div>
        </section>
        
        {/* Section 7: Updates to Terms */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">7. Modifications to the Service and Prices</h3>
          <div className="space-y-4 text-neutral-300">
            <p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
          </div>
        </section>

      </div>
    )
  },
  'shipping-returns': { 
    title: 'Shipping & Returns Policy', 
    content: (
      <div className="space-y-8">
        
        {/* Shipping Section */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">1. Shipping & Delivery (Domestic & International)</h3>
          <div className="space-y-4 text-neutral-300">
            <p><strong>Dispatch Timelines:</strong> As every Aura Leather piece is handcrafted to order by our master artisans, please allow <strong>3 to 5 business days</strong> for your order to be processed and dispatched from our workshop in India.</p>
            <p><strong>Domestic Shipping (India):</strong> We offer <strong>Complimentary Express Shipping on all orders above ₹10,000</strong> within India. For orders below ₹10,000, a standard shipping fee applies. Delivery within India typically takes 3-7 business days post-dispatch, depending on the pin code.</p>
            <p><strong>International Shipping:</strong> We ship globally. International transit times generally range from 7-14 business days. Shipping costs are calculated at checkout based on the destination.</p>
          </div>
        </section>

        {/* International Duties Section - CRITICAL FOR GLOBAL LAWS */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">2. Customs, Duties & Taxes (International Orders)</h3>
          <div className="space-y-4 text-neutral-300">
            <p>In accordance with international shipping laws, all cross-border shipments are sent on a <strong>Delivery Duty Unpaid (DDU)</strong> basis. This means the product prices displayed are exclusive of all import duties.</p>
            <p>As the recipient, <strong>you are liable for all import duties, customs, and local sales taxes</strong> levied by the country you are shipping to. Payment of these is required to release your order from customs on arrival. Aura Leather is not responsible for transit delays resulting from customs clearance.</p>
          </div>
        </section>

        {/* Returns Section - INDIAN CONSUMER LAW COMPLIANCE */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">3. Returns & Exchanges</h3>
          <div className="space-y-4 text-neutral-300">
            <p>We take immense pride in our craftsmanship. However, if you are not entirely satisfied with your purchase, you may initiate a return within <strong>14 days of delivery</strong>.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be unused, unblemished, and in their original packaging with all tags, dust bags, and authenticity cards intact.</li>
              <li><strong>Exclusions:</strong> Customized, monogrammed, or bespoke items are final sale and cannot be returned or exchanged unless there is a manufacturing defect.</li>
              <li>The customer is responsible for the return shipping cost unless the item received was damaged or incorrect.</li>
            </ul>
          </div>
        </section>

        {/* Refunds Section - RBI / BANKING COMPLIANCE */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">4. Refunds & Processing</h3>
          <div className="space-y-4 text-neutral-300">
            <p>Upon receiving and inspecting the returned item, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed back to your original method of payment (Credit Card, UPI, Net Banking, etc.).</p>
            <p>Please allow <strong>7 to 10 business days</strong> for the credited amount to reflect in your bank account, as per standard banking guidelines.</p>
          </div>
        </section>

        {/* Damages / Grievance Section - INDIAN E-COMMERCE RULES 2020 */}
        <section>
          <h3 className="text-2xl font-serif text-amber-500 mb-3 border-b border-neutral-800 pb-2">5. Damages & Grievance Redressal</h3>
          <div className="space-y-4 text-neutral-300">
            <p>If you receive a defective or damaged product, please contact us within <strong>48 hours of delivery</strong> with photographic evidence.</p>
            <p>In compliance with the Consumer Protection (E-Commerce) Rules, 2020, for any grievances, disputes, or return authorizations, please contact our Customer Support and Grievance Team:</p>
            <ul className="space-y-1 text-amber-600 font-medium">
              <li>Email: support@auraleather.com</li>
              <li>WhatsApp/Phone: +91 9XXXX XXXXX</li>
            </ul>
          </div>
        </section>

      </div>
    )
  },
  
  'contact': { 
    title: 'Contact Us', 
    content: (
      <div className="space-y-6">
        <p className="text-neutral-300 text-lg">
          Whether you have a question about our craftsmanship, need assistance with an order, or wish to inquire about a bespoke piece, we are at your service.
        </p>
        <ContactForm />
      </div>
    )
  },
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProductCard = ({ product, addToCart }) => (
  <div className="group flex flex-col bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-800 hover:border-amber-900/50 transition-all duration-500">
    <div className="relative aspect-[4/5] overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => addToCart(product)} className="bg-white/10 hover:bg-amber-600 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium tracking-wide uppercase text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
          <ShoppingBag size={18} /> Add to Cart
        </button>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="text-xs text-amber-600 uppercase tracking-widest mb-2">{product.category}</div>
      <h3 className="text-xl font-serif mb-2 leading-snug">{product.name}</h3>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-lg font-medium">₹{product.price}</span>
        <div className="flex text-amber-500">
          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
        </div>
      </div>
    </div>
  </div>
);

const HomePage = ({ addToCart }) => (
  <>
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
        <img src={HERO_IMAGE} alt="Luxury Background" className="w-full h-full object-cover object-center transform scale-105 motion-safe:animate-[pulse_15s_ease-in-out_infinite_alternate]" />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-20 pt-20">
        <div className="max-w-2xl">
          <span className="text-amber-500 font-medium tracking-[0.3em] uppercase text-sm mb-4 block">The Heritage Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Elegance Forged in <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Leather.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-lg leading-relaxed">Award-winning craftsmanship meeting timeless design.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all duration-300 hover:scale-105">
              Explore Collection
            </Link>
            <Link to="/craft" className="inline-flex items-center justify-center border border-neutral-600 hover:border-amber-500 text-white hover:text-amber-400 px-8 py-4 font-bold tracking-widest uppercase text-sm transition-all duration-300">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-neutral-950 border-t border-neutral-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-3xl md:text-5xl font-serif">Featured Pieces</h2>
          <Link to="/shop" className="flex items-center text-amber-500 hover:text-amber-400 uppercase tracking-widest text-sm font-bold group">
            View All <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  </>
);

const ShopPage = ({ addToCart }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Bags', 'Accessories', 'Travel'];
  const filteredProducts = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-neutral-950">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center">Our Collection</h1>
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 uppercase tracking-widest text-sm border transition-colors ${filter === cat ? 'border-amber-500 text-amber-500' : 'border-neutral-800 text-neutral-400 hover:border-neutral-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CraftPage = () => (
  <div className="pt-32 pb-24 min-h-screen bg-neutral-900 border-y border-neutral-800">
    <div className="container mx-auto px-6 md:px-12">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute inset-0 bg-amber-600 transform translate-x-4 translate-y-4 opacity-20 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
          <img src={CRAFT_IMAGE} alt="Leather Crafting" className="relative z-10 w-full h-[600px] object-cover filter grayscale-[30%] contrast-125" />
          <div className="absolute -bottom-8 -right-8 bg-neutral-950 p-8 border border-neutral-800 z-20 hidden md:block">
            <p className="font-serif text-4xl text-amber-500 mb-2">100%</p>
            <p className="uppercase tracking-widest text-xs text-neutral-400 max-w-[150px]">Full-Grain Italian Leather</p>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif">The Art of <span className="italic text-amber-500">Craftsmanship</span></h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            We believe that true luxury lies in the details. Every piece we create is a testament to the time-honored techniques of master leatherworkers. We source only the finest full-grain hides, renowned for their durability and ability to develop a unique patina over time.
          </p>
          <ul className="space-y-4">
            {[
              "Ethically sourced, vegetable-tanned hides",
              "Hand-burnished edges for a flawless finish",
              "Solid brass hardware engineered to endure",
              "Lifetime guarantee on all stitching"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center text-neutral-300">
                <Check className="text-amber-600 mr-3 flex-shrink-0" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SocialPage = () => (
  <div className="pt-32 pb-24 min-h-screen bg-neutral-950 flex flex-col justify-center">
    <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-serif mb-6">Shop Where You Connect</h2>
      <p className="text-neutral-400 mb-12 text-lg">
        Experience our premium concierge service directly through your favorite platforms. We offer personalized styling advice and seamless checkout via Instagram and WhatsApp.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <a href="#" className="group relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 p-10 rounded-xl transition-all duration-500 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <InstagramIcon size={48} className="mb-6 text-pink-400 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-2xl font-serif mb-3">Instagram Shop</h3>
          <p className="text-neutral-400 mb-6 text-sm">Browse our curated feed, see products in action, and shop directly from our posts.</p>
          <span className="inline-flex items-center text-pink-400 font-bold uppercase tracking-widest text-xs">
            @AuraLeather <ArrowRight size={14} className="ml-2" />
          </span>
        </a>

        <a href="#" className="group relative overflow-hidden bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/20 hover:border-green-500/50 p-10 rounded-xl transition-all duration-500 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageCircle size={48} className="mb-6 text-green-400 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-2xl font-serif mb-3">WhatsApp Concierge</h3>
          <p className="text-neutral-400 mb-6 text-sm">Chat with our styling experts, request custom orders, and checkout instantly.</p>
          <span className="inline-flex items-center text-green-400 font-bold uppercase tracking-widest text-xs">
            Start Chat <ArrowRight size={14} className="ml-2" />
          </span>
        </a>
      </div>
    </div>
  </div>
);

const TextPage = () => {
  const { pathname } = useLocation();
  const pageId = pathname.replace('/pages/', '');
  const data = PAGE_CONTENT[pageId] || { title: 'Page Not Found', content: 'This page does not exist.' };

  return (
    <div className="pt-40 pb-24 min-h-screen bg-neutral-950 flex justify-center">
      {/* Changed max-w-3xl to max-w-4xl below for a wider layout */}
      <div className="max-w-4xl px-6 w-full">
        <h1 className="text-4xl font-serif mb-8 text-amber-500">{data.title}</h1>
        {/* We changed this div so it directly injects the formatted HTML from above */}
        <div className="text-neutral-300 leading-relaxed text-lg">
          {data.content}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`${product.name} added to cart`);
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item.id !== id));
  
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handlePaymentSuccess = (paymentId) => {
    setIsCartOpen(false);
    setCartItems([]);
    showNotification(`Order placed successfully! ID: ${paymentId}`);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans flex flex-col overflow-x-hidden selection:bg-amber-700 selection:text-white">
        
        {/* Toast Notification */}
        <div className={`fixed top-24 right-4 z-50 bg-amber-600 text-white px-6 py-3 rounded shadow-lg transform transition-all duration-300 ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          {notification}
        </div>

        {/* Dynamic Header Navigation */}
        <header className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-neutral-950/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
          <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
            
            <button className="md:hidden text-neutral-200 hover:text-amber-500 transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <Link to="/" onClick={closeMobileMenu} className="text-2xl md:text-3xl font-serif tracking-widest uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
              Aura Leather
            </Link>

            {/* Restored Header Links */}
            <nav className="hidden md:flex space-x-8 items-center text-sm tracking-widest uppercase">
              <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
              <Link to="/shop" className="hover:text-amber-500 transition-colors">Shop Collection</Link>
              <Link to="/craft" className="hover:text-amber-500 transition-colors">Our Craft</Link>
              <Link to="/social" className="hover:text-amber-500 transition-colors">Social Store</Link>
              {/* Add the new Account Link */}
              <Link to="/account" className="hover:text-amber-500 transition-colors font-bold text-amber-600">Account</Link>
            </nav>

            <button className="relative p-2 text-neutral-200 hover:text-amber-500 transition-colors" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={24} />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-30 bg-neutral-950/95 backdrop-blur-xl transition-opacity duration-300 md:hidden flex flex-col items-center justify-center space-y-8 text-xl font-serif tracking-widest uppercase ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <Link to="/" onClick={closeMobileMenu} className="hover:text-amber-500 transition-colors">Home</Link>
          <Link to="/shop" onClick={closeMobileMenu} className="hover:text-amber-500 transition-colors">Shop Collection</Link>
          <Link to="/craft" onClick={closeMobileMenu} className="hover:text-amber-500 transition-colors">Our Craft</Link>
          <Link to="/social" onClick={closeMobileMenu} className="hover:text-amber-500 transition-colors">Social Store</Link>
          {/* Add the Mobile Account Link */}
          <Link to="/account" onClick={closeMobileMenu} className="hover:text-amber-500 transition-colors text-amber-600">My Account</Link>
        </div>

        {/* Cart Sidebar */}
        <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-neutral-900 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="px-6 py-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <h2 className="text-xl font-serif tracking-wider uppercase">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-white transition-colors"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-neutral-500 mt-12 flex flex-col items-center">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p>Your cart is empty.</p>
                <button onClick={() => { setIsCartOpen(false); window.location.href='/shop'; }} className="mt-6 text-amber-500 hover:text-amber-400 underline underline-offset-4 uppercase text-sm tracking-widest">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-neutral-800 rounded overflow-hidden flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-200 leading-tight">{item.name}</h3>
                      <p className="text-amber-500 text-sm mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-neutral-700 rounded bg-neutral-950">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-neutral-400 hover:text-white"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-neutral-400 hover:text-white"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950">
               <div className="flex justify-between items-center mb-6 text-lg font-medium">
                 <span>Subtotal</span>
                 <span className="text-amber-500 font-serif">₹{cartTotal.toFixed(2)}</span>
               </div>
               {/* 
                  NOTE: In your local environment, replace this <CheckoutCart /> 
                  with the Razorpay integration from your components folder! 
               */}
               <CheckoutCart cartTotal={cartTotal} cartItems={cartItems} onSuccess={handlePaymentSuccess} />
               <p className="text-xs text-neutral-500 mt-4 text-center">Shipping and taxes calculated securely.</p>
            </div>
          )}
        </div>

        {/* Dynamic Main Content Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
            <Route path="/craft" element={<CraftPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/pages/:pageId" element={<TextPage />} />
            {/* Add your Customer Portal Route here! */}
            <Route path="/account" element={<CustomerPortal />} />
          </Routes>
        </main>

        {/* Dynamic Footer Navigation */}
        <footer className="bg-black pt-20 pb-10 border-t border-neutral-900 mt-auto">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="text-2xl font-serif tracking-widest uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 mb-6 block">
                  Aura Leather
                </Link>
                <p className="text-neutral-500 max-w-sm mb-6">Redefining modern luxury through traditional craftsmanship and uncompromising quality.</p>
                <div className="flex space-x-4 text-neutral-400">
                  <a href="#" className="hover:text-amber-500 transition-colors"><InstagramIcon size={20} /></a>
                  <a href="#" className="hover:text-amber-500 transition-colors"><MessageCircle size={20} /></a>
                </div>
              </div>
              <div>
                <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Shop</h4>
                <ul className="space-y-4 text-neutral-400 text-sm">
                  <li><Link to="/shop" className="hover:text-amber-500 transition-colors">All Collections</Link></li>
                  <li><Link to="/pages/shipping-returns" className="hover:text-amber-500 transition-colors">Shipping & Returns</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Support</h4>
                <ul className="space-y-4 text-neutral-400 text-sm">
                  <li><Link to="/pages/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
                  <li><Link to="/pages/privacy-policy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/pages/terms-of-service" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-neutral-900 pt-8 flex justify-center items-center text-xs text-neutral-600">
              <p>&copy; {new Date().getFullYear()} Aura Leather. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}