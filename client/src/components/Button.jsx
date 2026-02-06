import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, type = 'button', onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "w-full py-3 rounded-lg font-medium transition-all duration-200 flex justify-center items-center shadow-md";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30",
    outline: "bg-white border text-gray-700 hover:bg-gray-50",
    google: "bg-white border text-gray-700 hover:bg-gray-50 relative"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
