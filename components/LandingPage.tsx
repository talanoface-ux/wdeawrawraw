
import React, { useMemo, useState } from 'react';
import { Character, Page, User } from '../types';
import { LogoutIcon, MenuIcon, XMarkIcon, WalletIcon } from './icons';

interface LandingPageProps {
  onCharacterSelect: (character: Character) => void;
  characters: Character[];
  navigate: (page: Page) => void;
  navigateToAuth: (mode: 'login' | 'signup') => void;
  currentUser: User | null;
  onLogout: () => void;
  isAdmin: boolean;
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
  setIsPurchaseModalOpen: (isOpen: boolean) => void;
}

const CharacterCard: React.FC<{ 
  character: Character; 
  onSelect: () => void;
}> = ({ character, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const displayUrl = isHovered && character.gifUrl ? character.gifUrl : character.imageUrl;

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg group aspect-[2/3] cursor-pointer"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={displayUrl}
        alt={character.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />
      <div className="absolute bottom-0 left-0 p-4 text-white w-full">
        <h3 className="text-xl font-bold">{character.name}, {character.age}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {character.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onCharacterSelect, characters, navigate, navigateToAuth, currentUser, onLogout, isAdmin, filterTag, setFilterTag, setIsPurchaseModalOpen }) => {
  
  const filteredCharacters = useMemo(() => {
    if (!filterTag) return characters;
    return characters.filter(c => c.tags?.includes(filterTag));
  }, [characters, filterTag]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="sticky top-0 z-40 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <button className="text-slate-800 dark:text-slate-200">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-rose-500 tracking-wider">
                        ایران پارتنر
                    </h1>
                </div>

                <div className="hidden md:flex items-center">
                   <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                      اولین پارتنری که میدونی ولت نمیکنه
                   </p>
                </div>

                <div className="flex items-center gap-3">
                    {currentUser ? (
                        <>
                            {isAdmin && (
                                <button 
                                    onClick={() => navigate('admin')}
                                    className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition hidden sm:block"
                                >
                                    پنل ادمین
                                </button>
                            )}
                            <button 
                                onClick={() => setIsPurchaseModalOpen(true)}
                                className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
                                title="خرید سکه"
                            >
                                <WalletIcon className="w-5 h-5 text-amber-500" />
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {currentUser.balance.toLocaleString('fa-IR')}
                                </span>
                            </button>
                            <button 
                                onClick={() => navigate('profile')}
                                className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition hidden sm:block border border-slate-300 dark:border-slate-600"
                            >
                                پروفایل
                            </button>
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
                            >
                                <LogoutIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">خروج</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigateToAuth('login')}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition"
                            >
                                ورود
                            </button>
                            <button 
                                onClick={() => navigateToAuth('signup')}
                                className="px-5 py-2 text-sm font-semibold bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-transform hover:scale-105"
                            >
                                ثبت نام و دریافت سکه رایگان
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {filterTag && (
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full">
              <span className="font-semibold">فیلتر فعال: #{filterTag}</span>
              <button onClick={() => setFilterTag(null)} className="p-1 rounded-full hover:bg-rose-200 dark:hover:bg-rose-800 transition">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onSelect={() => onCharacterSelect(char)}
            />
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
        <p>تمام شخصیت‌ها توسط هوش مصنوعی ساخته شده و صرفاً برای سرگرمی هستند.</p>
        <div className="mt-4">
          <button onClick={() => navigate('admin')} className="hover:text-rose-400 transition-colors">
            ورود به پنل ادمین
          </button>
          <span className="mx-2">|</span>
           <button onClick={() => navigate('privacy')} className="hover:text-rose-400 transition-colors">
            حریم خصوصی و شرایط
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
