import React from 'react';

const Input = ({ type, placeholder, name, value, onChange, required, icon: Icon }) => {
  return (
    <div className="relative mb-4">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
      />
    </div>
  );
};

export default Input;
