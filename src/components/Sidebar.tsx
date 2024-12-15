import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  Search,
  Bell,
  MessageSquare,
  Bookmark,
  User,
  Settings,
  LogOut,
  Brain
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isExternal?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const MenuItem = ({ icon: Icon, label, path, isExternal }: MenuItem) => {
    const isActive = location.pathname === path;
    const Component = isExternal ? 'a' : Link;
    const props = isExternal ? { href: path, target: "_blank" } : { to: path };

    return (
      <Component
        {...props}
        className={`
          relative flex items-center ${isExpanded ? 'px-4' : 'justify-center'} py-4 
          text-base font-medium w-full transition-colors duration-200 group
          ${isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}
        `}
      >
        <div className={`flex items-center ${isExpanded ? 'gap-4' : 'justify-center'}`}>
          <Icon className="h-6 w-6" />
          
          <motion.span
            className="whitespace-nowrap origin-left"
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </div>
        
        {isExternal && isExpanded && (
          <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
        )}

        {!isExpanded && (
          <div className="
            absolute left-full top-1/2 -translate-y-1/2 ml-2
            px-2 py-1 bg-gray-800 text-white text-sm
            rounded-md opacity-0 group-hover:opacity-100
            pointer-events-none shadow-lg border border-gray-700
            whitespace-nowrap z-50 transition-opacity duration-150
          ">
            {label}
          </div>
        )}
      </Component>
    );
  };

  return (
    <motion.div
      className="
        fixed left-0 top-0 h-screen
        bg-gray-900/95 backdrop-blur-lg 
        border-r border-gray-800 z-50
        flex flex-col
      "
      initial={{ width: '4.5rem' }}
      animate={{
        width: isExpanded ? '16rem' : '4.5rem',
      }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* Logo */}
      <div className="p-4 flex flex-col">
        <Link to="/" className="flex items-center justify-center mb-8">
          <img
            src="https://gfcesyuegnfgyntvqsmv.supabase.co/storage/v1/object/public/Public/logo.png"
            alt="Lifestyle Hub"
            className="h-8 w-auto"
          />
          
          <motion.div
            className={`${isExpanded ? 'ml-4' : 'hidden'} origin-left`}
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xl font-bold text-white whitespace-nowrap">
              Lifestyle Hub
            </span>
          </motion.div>
        </Link>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className={`
            relative flex items-center ${isExpanded ? 'px-4' : 'justify-center'} py-4
            text-base font-medium w-full text-gray-400 hover:text-white 
            transition-colors duration-200 group
          `}
        >
          <div className={`flex items-center ${isExpanded ? 'gap-4' : 'justify-center'}`}>
            <LogOut className="h-6 w-6" />
            
            <motion.span
              className="whitespace-nowrap origin-left"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                width: isExpanded ? 'auto' : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Sign Out
            </motion.span>
          </div>

          {!isExpanded && (
            <div className="
              absolute left-full top-1/2 -translate-y-1/2 ml-2
              px-2 py-1 bg-gray-800 text-white text-sm
              rounded-md opacity-0 group-hover:opacity-100
              pointer-events-none shadow-lg border border-gray-700
              whitespace-nowrap z-50 transition-opacity duration-150
            ">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;