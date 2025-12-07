import React, { useState, useEffect } from 'react';
import ThemeLanguageSwitcher from './components/ThemeLanguageSwitcher';
import { i18n } from './locales/i18n';

function App() {
  const [activeTab, setActiveTab] = useState('preresult');
  const [preResultData, setPreResultData] = useState(null);
  const [swissData, setSwissData] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // 默认暗黑模式
  const [currentLocale, setCurrentLocale] = useState('zh-CN'); // 默认中文

  useEffect(() => {
    // Load Pre-result data
    fetch('/data/cs2_gen_preresult.json')
      .then(response => response.json())
      .then(data => setPreResultData(data))
      .catch(error => console.error('Error loading Pre-result data:', error));

    // Load Swiss data
    fetch('/data/cs2_gen_swiss.json')
      .then(response => response.json())
      .then(data => setSwissData(data))
      .catch(error => console.error('Error loading Swiss data:', error));

    // Load Final data
    fetch('/data/cs2_prediction_final.json')
      .then(response => response.json())
      .then(data => setFinalData(data))
      .catch(error => console.error('Error loading Final data:', error));
  }, []);

  // 切换暗黑模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-4 shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
              <div className="flex items-center gap-4">
                {/* CS2 Logo */}
                <div className="flex-shrink-0">
                  <img 
                    src="/cs2.png" 
                    alt="CS2 Logo" 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-lg"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center gap-2">
                    {/* <span>CS2</span> */}
                    {/* <span className="text-xl md:text-2xl">|</span> */}
                    <span>{i18n.t('app.title', currentLocale)}</span>
                  </h1>
                  <p className="text-center text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base">
                    {i18n.t('app.subtitle', currentLocale)}
                  </p>
                </div>
              </div>
              {/* Theme and Language Switcher */}
              <ThemeLanguageSwitcher
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700 mb-8 gap-2">
            <button
              className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
                activeTab === 'preresult' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('preresult')}
            >
              {i18n.t('tabs.preresult', currentLocale)}
            </button>
            <button
              className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
                activeTab === 'swiss' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('swiss')}
            >
              {i18n.t('tabs.swiss', currentLocale)}
            </button>
            <button
              className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
                activeTab === 'final' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('final')}
            >
              {i18n.t('tabs.final', currentLocale)}
            </button>
            <button
              className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
                activeTab === 'champions' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('champions')}
            >
              {i18n.t('tabs.champions', currentLocale)}
            </button>
          </div>

          {/* Info Cards Section */}
          {(activeTab === 'preresult' || activeTab === 'swiss') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* ELO Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-600 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                      {i18n.t('infoCards.eloTitle', currentLocale)}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {i18n.t('infoCards.eloDesc1', currentLocale)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {i18n.t('infoCards.eloDesc2', currentLocale)}
                    </p>
                    <div className="mt-3 p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-semibold">{i18n.t('common.prediction', currentLocale)}：</span>
                        {i18n.t('infoCards.eloModel', currentLocale)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swiss System Info Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-gray-600 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mr-4">
                    <span className="text-2xl">🔀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
                      {i18n.t('infoCards.swissTitle', currentLocale)}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {i18n.t('infoCards.swissDesc1', currentLocale)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {i18n.t('infoCards.swissDesc2', currentLocale)}
                    </p>
                    <div className="mt-3 p-3 bg-green-100/50 dark:bg-green-900/30 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <span className="font-semibold">{i18n.t('infoCards.swissTech', currentLocale).split('：')[0]}：</span>
                        {i18n.t('infoCards.swissTech', currentLocale).split('：')[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            {activeTab === 'preresult' && <PreResultTab data={preResultData} currentLocale={currentLocale} />}
            {activeTab === 'swiss' && <SwissTab data={swissData} currentLocale={currentLocale} />}
            {activeTab === 'final' && <FinalTab data={finalData} currentLocale={currentLocale} />}
            {activeTab === 'champions' && <ChampionsTab data={finalData} currentLocale={currentLocale} />}
          </div>
        </main>

        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-6 mt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">{i18n.t('app.footer', currentLocale)}</p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">{i18n.t('app.footerDesc', currentLocale)}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Pre-result Tab Component
function PreResultTab({ data, currentLocale }) {
  if (!data) {
    return <div className="text-center py-12">{i18n.t('common.loading', currentLocale)}</div>;
  }

  // Sort teams by qualification probability
  const sortedTeams = Object.entries(data.simulation_results)
    .sort((a, b) => b[1].qualified - a[1].qualified);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        {i18n.t('tabs.preresult', currentLocale)}
      </h2>
      
      {/* Team Statistics */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">📊</span> {i18n.t('predictions.detailedStats', currentLocale)}
        </h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white dark:bg-gray-700/50 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800/80">
              <tr>
                <th className="py-3 px-4 text-left text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.team', currentLocale)}</th>
                <th className="py-3 px-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.eloRating', currentLocale)}</th>
                <th className="py-3 px-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.threeZero', currentLocale)}</th>
                <th className="py-3 px-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.threeOneTwo', currentLocale)}</th>
                <th className="py-3 px-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.qualification', currentLocale)}</th>
                <th className="py-3 px-4 text-center text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.zeroThree', currentLocale)}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map(([team, stats], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800/30'}>
                  <td className="py-3 px-4 font-medium flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {team.substring(0, 2)}
                    </div>
                    <span className="truncate max-w-[120px] md:max-w-none">{team}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-yellow-600 dark:text-yellow-400 text-sm md:text-base">{data.elo_ratings[team]?.toFixed(0) || 'N/A'}</td>
                  <td className="py-3 px-4 text-center text-green-600 dark:text-green-400 text-sm md:text-base">{(stats['3-0'] * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-blue-600 dark:text-blue-400 text-sm md:text-base">{(stats['3-1-or-3-2'] * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-yellow-700 dark:text-yellow-300 font-bold text-sm md:text-base">{(stats.qualified * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 text-sm md:text-base">{(stats['0-3'] * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Top 3-0 Teams */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-700/80 dark:to-green-900/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-600/30">
          <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300 flex items-center">
            <span className="mr-2">🏆</span> {i18n.t('predictions.mostLikely30', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {sortedTeams
              .sort((a, b) => b[1]['3-0'] - a[1]['3-0'])
              .slice(0, 5)
              .map(([team, stats], index) => (
                <li key={index} className="flex items-center justify-between bg-green-100/50 dark:bg-green-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                    <span className="font-medium truncate max-w-[100px] text-gray-700 dark:text-gray-300">{team}</span>
                  </div>
                  <span className="bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded">
                    {(stats['3-0'] * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Top Qualification Teams */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-700/80 dark:to-yellow-900/80 rounded-xl p-6 shadow-lg border border-yellow-100 dark:border-yellow-600/30">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300 flex items-center">
            <span className="mr-2">⭐</span> {i18n.t('predictions.highestQualification', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {sortedTeams.slice(0, 5).map(([team, stats], index) => (
              <li key={index} className="flex items-center justify-between bg-yellow-100/50 dark:bg-yellow-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                  <span className="font-medium truncate max-w-[100px] text-gray-700 dark:text-gray-300">{team}</span>
                </div>
                <span className="bg-yellow-500/80 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap" 
                      title={i18n.t('predictions.highestQualification', currentLocale)}>
                  {currentLocale === 'en-US' ? 'Highest Qualification' : i18n.t('predictions.highestQualification', currentLocale)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 0-3 Teams */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-700/80 dark:to-red-900/80 rounded-xl p-6 shadow-lg border border-red-100 dark:border-red-600/30">
          <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300 flex items-center">
            <span className="mr-2">❌</span> {i18n.t('predictions.mostLikely03', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {sortedTeams
              .sort((a, b) => b[1]['0-3'] - a[1]['0-3'])
              .slice(0, 5)
              .map(([team, stats], index) => (
                <li key={index} className="flex items-center justify-between bg-red-100/50 dark:bg-red-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                    <span className="font-medium truncate max-w-[100px] text-gray-700 dark:text-gray-300">{team}</span>
                  </div>
                  <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded">
                    {(stats['0-3'] * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Simulation Info */}
      <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 text-center backdrop-blur-sm border border-gray-200 dark:border-gray-600/30">
        <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-300 flex justify-center items-center">
          <span className="mr-2">⚙️</span> {i18n.t('predictions.simulationInfo', currentLocale)}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {i18n.t('predictions.monteCarloSimulations', currentLocale)}: {data.raw_simulations ? data.raw_simulations.length.toLocaleString() : '100,000'}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {i18n.t('common.updateTime', currentLocale)}: {new Date(data.timestamp).toLocaleString(currentLocale)}
        </p>
      </div>
    </div>
  );
}

// Swiss Prediction Tab Component
function SwissTab({ data, currentLocale }) {
  if (!data) {
    return <div className="text-center py-12">{i18n.t('common.loading', currentLocale)}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        {i18n.t('tabs.swiss', currentLocale)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3-0 Predictions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-700/80 dark:to-green-900/80 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-600/30">
          <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300 flex items-center">
            <span className="mr-2">🏆</span> {i18n.t('pickem.pick30', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {data.best_prediction['3-0'].map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-white dark:bg-gray-700/50 py-3 px-4 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px] text-gray-700 dark:text-gray-200">{team}</span>
                </div>
                <span className="bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap" 
                      title={currentLocale === 'en-US' ? '3-0 Result' : '3-0结果'}>
                  3-0
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Advances Predictions */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-700/80 dark:to-yellow-900/80 rounded-xl p-6 shadow-lg border border-yellow-100 dark:border-yellow-600/30">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300 flex items-center">
            <span className="mr-2">⭐</span> {i18n.t('pickem.pickAdvances', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {data.best_prediction.advances.map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-white dark:bg-gray-700/50 py-3 px-4 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px] text-gray-700 dark:text-gray-200">{team}</span>
                </div>
                <span className="bg-yellow-500/80 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap" 
                      title={i18n.t('predictions.highestQualification', currentLocale)}>
                  {currentLocale === 'en-US' ? 'Highest Qualification' : i18n.t('predictions.highestQualification', currentLocale)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 0-3 Predictions */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-700/80 dark:to-red-900/80 rounded-xl p-6 shadow-lg border border-red-100 dark:border-red-600/30">
          <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300 flex items-center">
            <span className="mr-2">❌</span> {i18n.t('pickem.pick03', currentLocale)}
          </h3>
          <ul className="space-y-3">
            {data.best_prediction['0-3'].map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-white dark:bg-gray-700/50 py-3 px-4 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px] text-gray-700 dark:text-gray-200">{team}</span>
                </div>
                <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap" 
                      title={currentLocale === 'en-US' ? '0-3 Result' : '0-3结果'}>
                  0-3
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl shadow-lg">
          <p className="text-lg font-semibold text-white">{i18n.t('pickem.successRate', currentLocale)}: <span className="text-yellow-300">{(data.success_rate * 100).toFixed(2)}%</span></p>
        </div>
      </div>
    </div>
  );
}

// Final Prediction Tab Component
function FinalTab({ data, currentLocale }) {
  if (!data) {
    return <div className="text-center py-12">{i18n.t('common.loading', currentLocale)}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        {i18n.t('tabs.final', currentLocale)}
      </h2>
      
      {/* Info Card for Playoff System */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-600 mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start">
          <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-400">
              {i18n.t('infoCards.playoffTitle', currentLocale)}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {i18n.t('infoCards.playoffDesc1', currentLocale)}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {i18n.t('infoCards.playoffDesc2', currentLocale)}
            </p>
            <div className="mt-3 p-3 bg-purple-100/50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <span className="font-semibold">{i18n.t('common.prediction', currentLocale)}：</span>
                {i18n.t('infoCards.playoffModel', currentLocale)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quarter Finals */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔶</span> {i18n.t('matchStages.quarterFinals', currentLocale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.quarter_finals.map((match, index) => (
            <div key={index} className="bg-white dark:bg-gray-700/50 rounded-xl p-5 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/30">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{match.match}</span>
                <span className="bg-purple-600/80 px-2 py-1 rounded text-xs text-white">{match.format}</span>
              </div>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team1 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-md border border-green-300 dark:border-green-600/30' 
                    : 'bg-gray-100 dark:bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {match.team1.substring(0, 2)}
                    </div>
                    <span className={`truncate max-w-[90px] ${match.predicted_winner === match.team1 ? 'font-bold' : ''}`}>{match.team1}</span>
                  </div>
                  {match.predicted_winner === match.team1 && <span className="text-green-600 dark:text-green-300 whitespace-nowrap" 
                      title={i18n.t('matchStages.predictedWinner', currentLocale)}>{currentLocale === 'en-US' ? '✓ Winner' : '✓ ' + i18n.t('matchStages.predictedWinner', currentLocale)}</span>}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">VS</div>
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team2 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-md border border-green-300 dark:border-green-600/30' 
                    : 'bg-gray-100 dark:bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {match.team2.substring(0, 2)}
                    </div>
                    <span className={`truncate max-w-[90px] ${match.predicted_winner === match.team2 ? 'font-bold' : ''}`}>{match.team2}</span>
                  </div>
                  {match.predicted_winner === match.team2 && <span className="text-green-600 dark:text-green-300 text-sm">✓</span>}
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {i18n.t('matchStages.winProbability', currentLocale)}: <span className="font-bold text-yellow-600 dark:text-yellow-300">{(match.win_probability * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semi Finals */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔷</span> {i18n.t('matchStages.semiFinals', currentLocale)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.semi_finals.map((match, index) => (
            <div key={index} className="bg-white dark:bg-gray-700/50 rounded-xl p-5 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/30">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700 dark:text-gray-300">{match.match}</span>
                <span className="bg-purple-600/80 px-2 py-1 rounded text-sm text-white">{match.format}</span>
              </div>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team1 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-md border border-green-300 dark:border-green-600/30' 
                    : 'bg-gray-100 dark:bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {match.team1.substring(0, 2)}
                    </div>
                    <span className={`text-lg ${match.predicted_winner === match.team1 ? 'font-bold' : ''}`}>{match.team1}</span>
                  </div>
                  {match.predicted_winner === match.team1 && <span className="text-green-600 dark:text-green-300 whitespace-nowrap" 
                                    title={i18n.t('matchStages.predictedWinner', currentLocale)}>{currentLocale === 'en-US' ? '✓ Winner' : '✓ ' + i18n.t('matchStages.predictedWinner', currentLocale)}</span>}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">VS</div>
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team2 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-md border border-green-300 dark:border-green-600/30' 
                    : 'bg-gray-100 dark:bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {match.team2.substring(0, 2)}
                    </div>
                    <span className={`text-lg ${match.predicted_winner === match.team2 ? 'font-bold' : ''}`}>{match.team2}</span>
                  </div>
                  {match.predicted_winner === match.team2 && <span className="text-green-600 dark:text-green-300 whitespace-nowrap" 
                                    title={i18n.t('matchStages.predictedWinner', currentLocale)}>{currentLocale === 'en-US' ? '✓ Winner' : '✓ ' + i18n.t('matchStages.predictedWinner', currentLocale)}</span>}
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {i18n.t('matchStages.winProbability', currentLocale)}: <span className="font-bold text-yellow-600 dark:text-yellow-300">{(match.win_probability * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔶</span> {i18n.t('matchStages.final', currentLocale)} ({data.final.format})
        </h3>
        <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-6 shadow-2xl max-w-2xl mx-auto backdrop-blur-sm border border-gray-200 dark:border-gray-600/30">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 dark:text-gray-300">{data.final.match}</span>
            <span className="bg-purple-600/80 px-3 py-1 rounded text-white">{data.final.format}</span>
          </div>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
              data.final.predicted_winner === data.final.team1 
                ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-lg border border-green-300 dark:border-green-600/30' 
                : 'bg-gray-100 dark:bg-gray-600/30'
            }`}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-4 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300">
                  {data.final.team1.substring(0, 2)}
                </div>
                <span className={`text-xl ${data.final.predicted_winner === data.final.team1 ? 'font-bold' : ''}`}>{data.final.team1}</span>
              </div>
              {data.final.predicted_winner === data.final.team1 && <span className="text-green-600 dark:text-green-300 text-lg whitespace-nowrap" title={i18n.t('matchStages.predictedWinner', currentLocale)}>{currentLocale === 'en-US' ? '✓ Winner' : '✓ ' + i18n.t('matchStages.predictedWinner', currentLocale)}</span>}
            </div>
            <div className="text-center text-3xl text-gray-500 dark:text-gray-400">⚔️</div>
            <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
              data.final.predicted_winner === data.final.team2 
                ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-700/80 dark:to-green-900/80 shadow-lg border border-green-300 dark:border-green-600/30' 
                : 'bg-gray-100 dark:bg-gray-600/30'
            }`}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-4 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300">
                  {data.final.team2.substring(0, 2)}
                </div>
                <span className={`text-xl ${data.final.predicted_winner === data.final.team2 ? 'font-bold' : ''}`}>{data.final.team2}</span>
              </div>
              {data.final.predicted_winner === data.final.team2 && <span className="text-green-600 dark:text-green-300 text-lg whitespace-nowrap" title={i18n.t('matchStages.predictedWinner', currentLocale)}>{currentLocale === 'en-US' ? '✓ Winner' : '✓ ' + i18n.t('matchStages.predictedWinner', currentLocale)}</span>}
            </div>
          </div>
          <div className="mt-5 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {currentLocale === 'en-US' ? 'Winner' : i18n.t('matchStages.predictedWinner', currentLocale)}: <span className="font-bold text-green-600 dark:text-green-400 text-xl">{data.final.predicted_winner}</span>
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {i18n.t('matchStages.winProbability', currentLocale)}: <span className="font-bold text-yellow-600 dark:text-yellow-300 text-lg">{(data.final.win_probability * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Champions Prediction Tab Component
function ChampionsTab({ data, currentLocale }) {
  if (!data) {
    return <div className="text-center py-12">{i18n.t('common.loading', currentLocale)}</div>;
  }

  // Sort champions by probability
  const sortedChampions = Object.entries(data.probabilities.champion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        {i18n.t('tabs.champions', currentLocale)}
      </h2>
      
      {/* Info Card for Champion Prediction */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-yellow-100 dark:border-gray-600 mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start">
          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-lg mr-4">
            <span className="text-2xl">🥇</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 text-yellow-700 dark:text-yellow-400">
              {i18n.t('infoCards.championTitle', currentLocale)}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {i18n.t('infoCards.championDesc1', currentLocale)}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {i18n.t('infoCards.championDesc2', currentLocale)}
            </p>
            <div className="mt-3 p-3 bg-yellow-100/50 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <span className="font-semibold">{i18n.t('infoCards.championTech', currentLocale).split(':')[0]}：</span>
                {i18n.t('infoCards.championTech', currentLocale).split(':')[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Champion Prediction */}
      <div className="bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-yellow-700/80 dark:via-yellow-800/80 dark:to-yellow-900/80 rounded-2xl p-8 mb-10 text-center shadow-2xl backdrop-blur-sm border border-yellow-300 dark:border-yellow-600/30">
        <h3 className="text-2xl font-bold mb-2 flex justify-center items-center text-gray-800 dark:text-yellow-200">
          <span className="mr-2">🏆</span> {i18n.t('predictions.predictedChampion', currentLocale)}
        </h3>
        <p className="text-4xl md:text-5xl font-bold mb-4 py-4 rounded-xl bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-900/50 dark:to-yellow-800/50 text-gray-900 dark:text-yellow-100 shadow-lg dark:shadow-yellow-900/20">
          <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_3px_rgba(255,255,0,0.5)] filter">
            {data.final_champion}
          </span>
        </p>
        <p className="text-lg text-gray-800 dark:text-yellow-200">{i18n.t('predictions.basedOnSuccess', currentLocale)} {(data.based_on_success_rate * 100).toFixed(2)}% {i18n.t('common.rate', currentLocale)}</p>
      </div>

      {/* Top 5 Champions */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">⭐</span> {i18n.t('predictions.top5Champions', currentLocale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {sortedChampions.map(([team, probability], index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-5 text-center shadow-lg transform transition duration-300 hover:scale-105 backdrop-blur-sm border border-gray-200 dark:border-gray-600/30">
              <div className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div className="font-bold text-lg mb-2 truncate text-gray-800 dark:text-gray-200">{team}</div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(probability * 100).toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">📊</span> {i18n.t('predictions.detailedStats', currentLocale)}
        </h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white dark:bg-gray-700/50 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800/80">
              <tr>
                <th className="py-3 px-4 text-left text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.team', currentLocale)}</th>
                <th className="py-3 px-4 text-right text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.championProb', currentLocale)}</th>
                <th className="py-3 px-4 text-right text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.finalProb', currentLocale)}</th>
                <th className="py-3 px-4 text-right text-sm md:text-base text-gray-700 dark:text-gray-300">{i18n.t('tableHeaders.semifinalProb', currentLocale)}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.probabilities.champion)
                .sort((a, b) => b[1] - a[1])
                .map(([team, champProb], index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800/30'}>
                    <td className="py-3 px-4 font-medium flex items-center text-gray-700 dark:text-gray-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                        {team.substring(0, 2)}
                      </div>
                      <span className="truncate max-w-[120px] md:max-w-none">{team}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-yellow-600 dark:text-yellow-400 text-sm md:text-base">{(champProb * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300 text-sm md:text-base">{(data.probabilities.top2[team] * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300 text-sm md:text-base">{(data.probabilities.top4[team] * 100).toFixed(2)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
