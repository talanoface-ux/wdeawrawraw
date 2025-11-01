import React, { useState, useMemo } from 'react';
import { Page, Conversation, Character, User } from '../types';
import CharacterEditorModal from './CharacterEditorModal';
import { PencilIcon, TrashIcon, PlusIcon, ArrowRightIcon } from './icons';

interface AdminDashboardProps {
  navigate: (page: Page) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

const ADMIN_PASSWORD = '22093805';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  navigate, isAdmin, setIsAdmin, characters, setCharacters, users, setUsers, conversations, setConversations 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'characters' | 'users'>('conversations');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);
  
  const [balanceAmounts, setBalanceAmounts] = useState<Record<string, string>>({});


  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [conversations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError('');
    } else {
      setError('رمز عبور نادرست است.');
    }
    setPassword('');
  };
  
  const handleDeleteConversation = (id: string) => {
    if (window.confirm('آیا از حذف این مکالمه مطمئن هستید؟')) {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (selectedConversation?.id === id) {
        setSelectedConversation(null);
      }
    }
  };
  
  const exportToCSV = () => {
    const headers = ['conversationId', 'userId', 'messageId', 'timestamp', 'role', 'content'];
    const rows = conversations.flatMap(conv => 
      conv.messages.map(msg => [
        conv.id,
        conv.userId || 'guest',
        msg.id,
        msg.timestamp,
        msg.role,
        `"${msg.content.replace(/"/g, '""')}"`
      ])
    );
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "conversations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleOpenModal = (character: Character | null = null) => {
    setCharacterToEdit(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCharacterToEdit(null);
  };

  const handleSaveCharacter = (character: Character) => {
    if (characterToEdit) {
      setCharacters(prev => prev.map(c => c.id === character.id ? character : c));
    } else {
      setCharacters(prev => [...prev, character]);
    }
    handleCloseModal();
  };
  
  const handleDeleteCharacter = (id: string) => {
    if (window.confirm('آیا از حذف این شخصیت مطمئن هستید؟')) {
      setCharacters(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleBalanceChange = (userId: string, amount: string) => {
    setBalanceAmounts(prev => ({...prev, [userId]: amount}));
  };

  const handleUpdateBalance = (userId: string, operation: 'add' | 'subtract') => {
    const amountStr = balanceAmounts[userId] || '0';
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount < 0) {
      alert("لطفا یک عدد معتبر وارد کنید.");
      return;
    }

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const newBalance = operation === 'add' 
          ? user.balance + amount 
          : user.balance - amount;
        return { ...user, balance: Math.max(0, newBalance) }; // Ensure balance doesn't go below zero
      }
      return user;
    }));
    // Clear input after update
    handleBalanceChange(userId, '');
  };


  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="relative w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <button
              onClick={() => navigate('landing')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="بازگشت به صفحه اصلی"
          >
              <ArrowRightIcon className="w-6 h-6 text-slate-500" />
          </button>
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">ورود ادمین</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password-admin" className="text-sm font-medium text-slate-600 dark:text-slate-300">رمز عبور</label>
              <input
                id="password-admin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700">
              ورود
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">داشبورد ادمین</h1>
          <button 
            onClick={() => navigate('landing')} 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" 
            aria-label="بازگشت به سایت"
          >
            <ArrowRightIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs" dir="rtl">
                <button
                    onClick={() => setActiveTab('conversations')}
                    className={`${activeTab === 'conversations' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    مدیریت مکالمات
                </button>
                <button
                    onClick={() => setActiveTab('characters')}
                    className={`${activeTab === 'characters' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    مدیریت شخصیت‌ها
                </button>
                 <button
                    onClick={() => setActiveTab('users')}
                    className={`${activeTab === 'users' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    مدیریت کاربران
                </button>
            </nav>
        </div>

        {activeTab === 'conversations' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
               <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">مکالمات ({conversations.length})</h2>
               <ul className="h-[75vh] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
                 {sortedConversations.map(conv => (
                   <li key={conv.id} onClick={() => setSelectedConversation(conv)} className={`p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 ${selectedConversation?.id === conv.id ? 'bg-slate-200 dark:bg-slate-600' : ''}`}>
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-semibold">{conv.title}</p>
                         <p className="text-sm text-slate-500 dark:text-slate-400">{conv.messages.length} پیام</p>
                         <p className="text-xs text-slate-400 dark:text-slate-500">آخرین بروزرسانی: {new Date(conv.lastUpdated).toLocaleString('fa-IR')}</p>
                       </div>
                       <button onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }} className="text-red-600 hover:text-red-500 p-1 text-xs">حذف</button>
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="md:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">گزارش پیام‌ها</h2>
                 <button onClick={exportToCSV} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                   خروجی CSV از همه
                 </button>
               </div>
               <div className="h-[75vh] overflow-y-auto bg-slate-100 dark:bg-slate-700/50 p-3 rounded">
                 {selectedConversation ? (
                   <div>
                     {selectedConversation.messages.map(msg => (
                       <div key={msg.id} className={`p-3 my-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-200 dark:bg-slate-600'}`}>
                         <p className="text-sm font-bold capitalize text-slate-900 dark:text-slate-100">{msg.role}</p>
                         <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(msg.timestamp).toLocaleString('fa-IR')}</p>
                         <p className="mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">{msg.content}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-slate-500 dark:text-slate-400 text-center pt-10">یک مکالمه را برای دیدن پیام‌ها انتخاب کنید.</p>
                 )}
               </div>
             </div>
           </div>
        )}
        
        {activeTab === 'characters' && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">شخصیت‌ها ({characters.length})</h2>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition"
              >
                <PlusIcon className="w-5 h-5" />
                <span>ساخت شخصیت جدید</span>
              </button>
            </div>
            <div className="h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.map((char) => (
                  <div key={char.id} className="relative rounded-lg overflow-hidden shadow-lg group aspect-[2/3]">
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={() => handleOpenModal(char)} className="p-2 bg-white/80 rounded-full text-slate-700 hover:bg-slate-200">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCharacter(char.id)} className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                        <h3 className="text-lg font-bold">{char.name}, {char.age}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {char.tags?.map(tag => (
                                <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">کاربران ({users.length})</h2>
            <div className="h-[75vh] overflow-y-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-600 dark:text-slate-300 uppercase bg-slate-200 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">ایمیل کاربر</th>
                    <th scope="col" className="px-6 py-3">موجودی فعلی</th>
                    <th scope="col" className="px-6 py-3">تغییر موجودی</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {user.email}
                      </th>
                      <td className="px-6 py-4">
                        {user.balance.toLocaleString('fa-IR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                value={balanceAmounts[user.id] || ''}
                                onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                                placeholder="مقدار"
                                className="w-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-slate-200"
                            />
                            <button onClick={() => handleUpdateBalance(user.id, 'add')} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">افزایش</button>
                            <button onClick={() => handleUpdateBalance(user.id, 'subtract')} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">کاهش</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CharacterEditorModal
          character={characterToEdit}
          onSave={handleSaveCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;