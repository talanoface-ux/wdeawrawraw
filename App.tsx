
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPage from './components/PrivacyPage';
import AuthPage from './components/AuthPage';
import UserProfilePage from './components/UserProfilePage';
import PurchaseModal from './components/PurchaseModal';
import SupportButton from './components/SupportButton';
import SupportModal from './components/SupportModal';
import LoginPromptModal from './components/LoginPromptModal';
import { Page, Character, User, Conversation } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { characters as defaultCharacters } from './data/characters';
import GlobalSidebar from './components/GlobalSidebar';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  
  // User Management State
  const [users, setUsers] = useLocalStorage<User[]>('ai-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('ai-currentUser', null);
  
  // Character and Conversation State
  const [characterToChat, setCharacterToChat] = useState<Character | null>(null);
  const [characters, setCharacters] = useLocalStorage<Character[]>('ai-characters', defaultCharacters);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('ai-conversations', []);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  // Modal State
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLoginPromptModalOpen, setIsLoginPromptModalOpen] = useState(false);
  
  // Auth page initial mode state
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigate = useCallback((page: Page) => {
    // When navigating to auth page generally, default to login mode.
    if (page === 'auth') {
      setInitialAuthMode('login');
    }
    setCurrentPage(page);
  }, []);
  
  // Specific navigation for auth page to set mode
  const navigateToAuth = (mode: 'login' | 'signup') => {
    setInitialAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsAdmin(false); // Also log out from admin
    navigate('landing');
  }, [setCurrentUser, navigate]);

  const handleCharacterSelect = (character: Character) => {
    if (!currentUser) {
      setIsLoginPromptModalOpen(true);
    } else {
      setCharacterToChat(character);
      navigate('chat');
    }
  };

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return conversations
      .filter(c => c.userId === currentUser.id)
      .reduce((count, conversation) => {
        const unreadInConv = conversation.messages.filter(
            message => message.role === 'assistant' && message.isRead === false
        ).length;
        return count + unreadInConv;
    }, 0);
  }, [conversations, currentUser]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage 
                  onCharacterSelect={handleCharacterSelect} 
                  characters={characters} 
                  navigate={navigate}
                  navigateToAuth={navigateToAuth}
                  currentUser={currentUser} 
                  onLogout={handleLogout} 
                  isAdmin={isAdmin}
                  filterTag={filterTag}
                  setFilterTag={setFilterTag} 
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                />;
      case 'chat':
        return <ChatPage 
                  navigate={navigate} 
                  character={characterToChat} 
                  characters={characters}
                  setCharacterToChat={setCharacterToChat}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  setUsers={setUsers}
                  conversations={conversations}
                  setConversations={setConversations}
                  isAdmin={isAdmin}
                  setCharacters={setCharacters}
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                />;
      case 'admin':
        return <AdminDashboard 
                  navigate={navigate} 
                  setIsAdmin={setIsAdmin} 
                  isAdmin={isAdmin} 
                  characters={characters} 
                  setCharacters={setCharacters}
                  users={users}
                  setUsers={setUsers}
                  conversations={conversations}
                  setConversations={setConversations}
                />;
      case 'privacy':
        return <PrivacyPage navigate={navigate} />;
      case 'auth':
        return <AuthPage 
                  navigate={navigate} 
                  users={users} 
                  setUsers={setUsers} 
                  setCurrentUser={setCurrentUser} 
                  initialMode={initialAuthMode} 
                />;
      case 'profile':
        return <UserProfilePage navigate={navigate} currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <LandingPage 
                  onCharacterSelect={handleCharacterSelect} 
                  characters={characters} 
                  navigate={navigate}
                  navigateToAuth={navigateToAuth}
                  currentUser={currentUser} 
                  onLogout={handleLogout} 
                  isAdmin={isAdmin}
                  filterTag={filterTag}
                  setFilterTag={setFilterTag}
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <GlobalSidebar 
        navigate={navigate} 
        currentPage={currentPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        unreadCount={unreadCount}
        characters={characters}
        setFilterTag={setFilterTag} 
      />
      <main className="pl-20">
        {renderPage()}
      </main>
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setUsers={setUsers}
      />
      <SupportButton onClick={() => setIsSupportModalOpen(true)} />
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
      <LoginPromptModal
        isOpen={isLoginPromptModalOpen}
        onClose={() => setIsLoginPromptModalOpen(false)}
        onLogin={() => {
          setIsLoginPromptModalOpen(false);
          navigateToAuth('login');
        }}
        onSignup={() => {
          setIsLoginPromptModalOpen(false);
          navigateToAuth('signup');
        }}
      />
    </div>
  );
};

export default App;
