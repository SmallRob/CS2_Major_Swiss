import React from 'react';
import { i18n } from '../locales/i18n';

const ThemeLanguageSwitcher = ({ 
  darkMode, 
  toggleDarkMode, 
  currentLocale, 
  setCurrentLocale 
}) => {
  const supportedLocales = i18n.getSupportedLocales();

  const toggleLocale = () => {
    const currentIndex = supportedLocales.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % supportedLocales.length;
    setCurrentLocale(supportedLocales[nextIndex]);
  };

  // 优化的太阳图标（亮色主题）
  const SunIcon = () => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-800 dark:text-gray-200"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  // 优化的月亮图标（暗色主题）
  const MoonIcon = () => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-800 dark:text-gray-200"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  // 语言图标
  const LanguageIcon = () => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-800 dark:text-gray-200"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );

  return (
    <div className="flex items-center space-x-3">
      {/* 语言切换按钮 */}
      <div className="flex items-center bg-gray-200/50 dark:bg-gray-700/50 rounded-full pl-3 pr-1 py-1 transition-all duration-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
        <span className="mr-2 text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
          {i18n.t('common.language', currentLocale)}
        </span>
        <button
          onClick={toggleLocale}
          className="flex items-center justify-center w-12 h-6 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700 rounded-full transition-all duration-300 focus:outline-none shadow-inner hover:shadow-md active:scale-95 relative"
          aria-label={i18n.t('common.language', currentLocale)}
          title={`${i18n.t('common.language', currentLocale)}: ${i18n.getLocaleDisplayName(currentLocale)}`}
        >
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out">
            <LanguageIcon />
          </div>
          <span className="absolute text-xs font-medium text-white px-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {i18n.getLocaleDisplayName(currentLocale).substring(0, 2)}
          </span>
        </button>
      </div>

      {/* 暗黑模式切换按钮 */}
      <div className="flex items-center bg-gray-200/50 dark:bg-gray-700/50 rounded-full pl-3 pr-1 py-1 transition-all duration-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50">
        <span className="mr-2 text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
          {i18n.t('common.theme', currentLocale)}
        </span>
        <button
          onClick={toggleDarkMode}
          className="relative flex items-center justify-center w-12 h-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full transition-all duration-300 focus:outline-none shadow-inner hover:shadow-md active:scale-95"
          aria-label={i18n.t('common.theme', currentLocale)}
          title={darkMode ? i18n.t('common.theme', currentLocale) + ': 暗色' : i18n.t('common.theme', currentLocale) + ': 亮色'}
        >
          <div 
            className={`absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
              darkMode 
                ? 'translate-x-3 rotate-180' 
                : '-translate-x-3 rotate-0'
            }`}
          >
            {darkMode ? <MoonIcon /> : <SunIcon />}
          </div>
          
          {/* 背景装饰图标 */}
          <div className="absolute left-1 opacity-30">
            <SunIcon />
          </div>
          <div className="absolute right-1 opacity-30">
            <MoonIcon />
          </div>
        </button>
      </div>

      {/* 当前状态指示器（移动端显示） */}
      <div className="sm:hidden flex items-center text-xs text-gray-600 dark:text-gray-400 space-x-2">
        <span className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
          {i18n.getLocaleDisplayName(currentLocale).substring(0, 2)}
        </span>
        <span className="bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded">
          {darkMode ? '🌙' : '☀️'}
        </span>
      </div>
    </div>
  );
};

export default ThemeLanguageSwitcher;