
import React, { useState } from 'react';
import { User } from '../types';
import { XMarkIcon, WalletIcon, TelegramIcon } from './icons';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const plans = [
  { coins: 50, price: 4.99 },
  { coins: 120, price: 9.99 },
  { coins: 300, price: 19.99, popular: true },
  { coins: 1000, price: 49.99 },
];

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [showTelegramInfo, setShowTelegramInfo] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handlePlanSelect = () => {
    setShowTelegramInfo(true);
  };
  
  const handleClose = () => {
      setShowTelegramInfo(false); // Reset internal state on close
      onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]"
      onClick={handleClose}
      dir="rtl"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <WalletIcon className="w-6 h-6 text-amber-500" />
            {showTelegramInfo ? 'راهنمای خرید' : 'خرید سکه'}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        {showTelegramInfo ? (
            <div className="p-8 text-center">
                <TelegramIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">خرید از طریق تلگرام</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    برای تکمیل فرآیند خرید و شارژ حساب خود، لطفاً به پشتیبانی ما در تلگرام پیام دهید.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <a
                        href="https://t.me/iranpartnersup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-transform hover:scale-105"
                    >
                        <TelegramIcon className="w-6 h-6" />
                        <span>ارتباط با پشتیبانی</span>
                    </a>
                     <button 
                        onClick={() => setShowTelegramInfo(false)} 
                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-rose-500 transition"
                     >
                        بازگشت به بسته‌ها
                     </button>
                </div>
            </div>
        ) : (
            <div className="p-6">
              <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                برای ادامه گفتگو با شخصیت‌ها، یکی از بسته‌های زیر را انتخاب کنید.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    onClick={handlePlanSelect}
                    className={`relative p-6 rounded-lg border-2 text-center transition-transform hover:scale-105 cursor-pointer
                      ${plan.popular
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30'
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                        محبوب‌ترین
                      </div>
                    )}
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                      {plan.coins.toLocaleString('fa-IR')}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">سکه</p>
                    <div className="my-4 h-px bg-slate-200 dark:bg-slate-600"></div>
                    <p className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-6">
                      ${plan.price.toLocaleString()}
                    </p>
                    <div
                      className="w-full px-6 py-3 font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition"
                    >
                      انتخاب بسته
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
