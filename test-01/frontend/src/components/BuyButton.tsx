import React from 'react';

interface BuyButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

/**
 * Main button to buy corn
 */
const BuyButton: React.FC<BuyButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform active:scale-95
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}
      `}
    >
      {isLoading ? 'Harvesting...' : 'Harvest Corn! 🌽'}
    </button>
  );
};

export default BuyButton;
