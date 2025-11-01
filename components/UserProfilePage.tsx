


import React from 'react';
import { Page, User } from '../types';
import { LogoutIcon, ArrowRightIcon } from './icons';

interface UserProfilePageProps {
  navigate: (page: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ navigate, currentUser, onLogout }) => {
  if (!currentUser) {
    // Should not happen if routed correctly, but as a safeguard
    navigate('landing');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="relative w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
        <button
          onClick={() => navigate('landing')}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="بازگشت به صفحه اصلی"
        >
          <ArrowRightIcon className="w-6 h-6 text-slate-500" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">پروفایل کاربری</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">اطلاعات حساب شما</p>
        
        <div className="text-left space-y-4">
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="text-sm text-slate-500 dark:text-slate-400">ایمیل</label>
            <p className="text-lg text-slate-900 dark:text-slate-100">{currentUser.email}</p>
          </div>
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="text-sm text-slate-500 dark:text-slate-400">موجودی فعلی</label>
            <p className="text-2xl font-bold text-rose-500">{currentUser.balance.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            <LogoutIcon className="w-5 h-5"/>
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;