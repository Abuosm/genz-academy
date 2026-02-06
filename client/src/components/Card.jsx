import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, title, subtitle, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-8 ${className}`}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};

export default Card;
