import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card title="Reset Password" subtitle="Enter your email to receive a reset link">
        {!submitted ? (
          <form onSubmit={onSubmit}>
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <Button type="submit" variant="primary">
              Send Reset Link
            </Button>

            <div className="text-center mt-6">
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Check your email</h3>
            <p className="text-slate-500 mb-6 font-medium leading-relaxed">
              We have sent a password reset link to <span className="text-indigo-600 font-bold">{email}</span>
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Resend Email
            </Button>
            <div className="text-center mt-6">
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
