import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('preresult');
  const [preResultData, setPreResultData] = useState(null);
  const [swissData, setSwissData] = useState(null);
  const [finalData, setFinalData] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800/80 backdrop-blur-sm py-6 shadow-xl border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            CS2 Major 瑞士轮预测系统
          </h1>
          <p className="text-center text-gray-300 mt-2 text-sm md:text-base">
            基于ELO评分和蒙特卡洛模拟的赛事预测
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center border-b border-gray-700 mb-8 gap-2">
          <button
            className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
              activeTab === 'preresult' 
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-500' 
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('preresult')}
          >
            初始对战模拟
          </button>
          <button
            className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
              activeTab === 'swiss' 
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-500' 
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('swiss')}
          >
            瑞士轮预测
          </button>
          <button
            className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
              activeTab === 'final' 
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-500' 
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('final')}
          >
            淘汰赛预测
          </button>
          <button
            className={`py-3 px-4 md:px-6 font-medium text-sm md:text-base rounded-t-lg transition-all duration-300 ${
              activeTab === 'champions' 
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-500' 
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('champions')}
          >
            冠军预测
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6 border border-gray-700">
          {activeTab === 'preresult' && <PreResultTab data={preResultData} />}
          {activeTab === 'swiss' && <SwissTab data={swissData} />}
          {activeTab === 'final' && <FinalTab data={finalData} />}
          {activeTab === 'champions' && <ChampionsTab data={finalData} />}
        </div>
      </main>

      <footer className="bg-gray-800/80 backdrop-blur-sm py-6 mt-12 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-sm">CS2 Major 瑞士轮预测系统 © 2025</p>
          <p className="text-xs mt-1 text-gray-500">基于数据科学和机器学习的电竞赛事预测</p>
        </div>
      </footer>
    </div>
  );
}

// Pre-result Tab Component
function PreResultTab({ data }) {
  if (!data) {
    return <div className="text-center py-12">加载中...</div>;
  }

  // Sort teams by qualification probability
  const sortedTeams = Object.entries(data.simulation_results)
    .sort((a, b) => b[1].qualified - a[1].qualified);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        初始对战模拟结果
      </h2>
      
      {/* Team Statistics */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">📊</span> 队伍表现概率预测
        </h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-gray-700/50 rounded-lg overflow-hidden">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="py-3 px-4 text-left text-sm md:text-base">队伍</th>
                <th className="py-3 px-4 text-center text-sm md:text-base">ELO评分</th>
                <th className="py-3 px-4 text-center text-sm md:text-base">3-0概率</th>
                <th className="py-3 px-4 text-center text-sm md:text-base">3-1/3-2概率</th>
                <th className="py-3 px-4 text-center text-sm md:text-base">晋级概率</th>
                <th className="py-3 px-4 text-center text-sm md:text-base">0-3概率</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map(([team, stats], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-700/30' : 'bg-gray-800/30'}>
                  <td className="py-3 px-4 font-medium flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                      {team.substring(0, 2)}
                    </div>
                    <span className="truncate max-w-[120px] md:max-w-none">{team}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-yellow-400 text-sm md:text-base">{data.elo_ratings[team]?.toFixed(0) || 'N/A'}</td>
                  <td className="py-3 px-4 text-center text-green-400 text-sm md:text-base">{(stats['3-0'] * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-blue-400 text-sm md:text-base">{(stats['3-1-or-3-2'] * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-yellow-300 font-bold text-sm md:text-base">{(stats.qualified * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center text-red-400 text-sm md:text-base">{(stats['0-3'] * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Top 3-0 Teams */}
        <div className="bg-gradient-to-br from-green-700/80 to-green-900/80 rounded-xl p-6 shadow-lg border border-green-600/30">
          <h3 className="text-xl font-bold mb-4 text-green-300 flex items-center">
            <span className="mr-2">🏆</span> 最可能3-0队伍
          </h3>
          <ul className="space-y-3">
            {sortedTeams
              .sort((a, b) => b[1]['3-0'] - a[1]['3-0'])
              .slice(0, 5)
              .map(([team, stats], index) => (
                <li key={index} className="flex items-center justify-between bg-green-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                    <span className="font-medium truncate max-w-[100px]">{team}</span>
                  </div>
                  <span className="bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded">
                    {(stats['3-0'] * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Top Qualification Teams */}
        <div className="bg-gradient-to-br from-yellow-700/80 to-yellow-900/80 rounded-xl p-6 shadow-lg border border-yellow-600/30">
          <h3 className="text-xl font-bold mb-4 text-yellow-300 flex items-center">
            <span className="mr-2">⭐</span> 晋级概率最高
          </h3>
          <ul className="space-y-3">
            {sortedTeams.slice(0, 5).map(([team, stats], index) => (
              <li key={index} className="flex items-center justify-between bg-yellow-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                  <span className="font-medium truncate max-w-[100px]">{team}</span>
                </div>
                <span className="bg-yellow-500/80 text-white text-xs font-bold px-2 py-1 rounded">
                  {(stats.qualified * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 0-3 Teams */}
        <div className="bg-gradient-to-br from-red-700/80 to-red-900/80 rounded-xl p-6 shadow-lg border border-red-600/30">
          <h3 className="text-xl font-bold mb-4 text-red-300 flex items-center">
            <span className="mr-2">❌</span> 最可能0-3队伍
          </h3>
          <ul className="space-y-3">
            {sortedTeams
              .sort((a, b) => b[1]['0-3'] - a[1]['0-3'])
              .slice(0, 5)
              .map(([team, stats], index) => (
                <li key={index} className="flex items-center justify-between bg-red-600/20 py-3 px-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                    <span className="font-medium truncate max-w-[100px]">{team}</span>
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
      <div className="bg-gray-700/50 rounded-xl p-6 text-center backdrop-blur-sm border border-gray-600/30">
        <h3 className="text-lg font-bold mb-2 text-gray-300 flex justify-center items-center">
          <span className="mr-2">⚙️</span> 模拟统计信息
        </h3>
        <p className="text-gray-400">
          基于 {data.raw_simulations ? data.raw_simulations.length.toLocaleString() : '100,000'} 次蒙特卡洛模拟
        </p>
        <p className="text-gray-400 mt-1">
          更新时间: {new Date(data.timestamp).toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}

// Swiss Prediction Tab Component
function SwissTab({ data }) {
  if (!data) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        瑞士轮最佳预测
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3-0 Predictions */}
        <div className="bg-gradient-to-br from-green-700/80 to-green-900/80 rounded-xl p-6 shadow-lg border border-green-600/30">
          <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center">
            <span className="mr-2">🏆</span> 3-0 投币队伍
          </h3>
          <ul className="space-y-3">
            {data.best_prediction['3-0'].map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-600/30 py-3 px-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px]">{team}</span>
                </div>
                <span className="bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded">3-0</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Advances Predictions */}
        <div className="bg-gradient-to-br from-yellow-700/80 to-yellow-900/80 rounded-xl p-6 shadow-lg border border-yellow-600/30">
          <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
            <span className="mr-2">⭐</span> 晋级投币队伍
          </h3>
          <ul className="space-y-3">
            {data.best_prediction.advances.map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-600/30 py-3 px-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px]">{team}</span>
                </div>
                <span className="bg-yellow-500/80 text-white text-xs font-bold px-2 py-1 rounded">晋级</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 0-3 Predictions */}
        <div className="bg-gradient-to-br from-red-700/80 to-red-900/80 rounded-xl p-6 shadow-lg border border-red-600/30">
          <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center">
            <span className="mr-2">❌</span> 0-3 投币队伍
          </h3>
          <ul className="space-y-3">
            {data.best_prediction['0-3'].map((team, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-600/30 py-3 px-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                    {team.substring(0, 2)}
                  </div>
                  <span className="font-medium truncate max-w-[120px]">{team}</span>
                </div>
                <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded">0-3</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl shadow-lg">
          <p className="text-lg font-semibold">预测成功率: <span className="text-yellow-300">{(data.success_rate * 100).toFixed(2)}%</span></p>
        </div>
      </div>
    </div>
  );
}

// Final Prediction Tab Component
function FinalTab({ data }) {
  if (!data) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        淘汰赛对阵预测
      </h2>
      
      {/* Quarter Finals */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔶</span> 四分之一决赛 (BO3)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.quarter_finals.map((match, index) => (
            <div key={index} className="bg-gray-700/50 rounded-xl p-5 shadow-lg backdrop-blur-sm border border-gray-600/30">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-300 text-sm">{match.match}</span>
                <span className="bg-purple-600/80 px-2 py-1 rounded text-xs">{match.format}</span>
              </div>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team1 
                    ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-md border border-green-600/30' 
                    : 'bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                      {match.team1.substring(0, 2)}
                    </div>
                    <span className={`truncate max-w-[90px] ${match.predicted_winner === match.team1 ? 'font-bold' : ''}`}>{match.team1}</span>
                  </div>
                  {match.predicted_winner === match.team1 && <span className="text-green-300 text-sm">✓</span>}
                </div>
                <div className="text-center text-gray-400 text-sm">VS</div>
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team2 
                    ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-md border border-green-600/30' 
                    : 'bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                      {match.team2.substring(0, 2)}
                    </div>
                    <span className={`truncate max-w-[90px] ${match.predicted_winner === match.team2 ? 'font-bold' : ''}`}>{match.team2}</span>
                  </div>
                  {match.predicted_winner === match.team2 && <span className="text-green-300 text-sm">✓</span>}
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-300">
                胜率: <span className="font-bold text-yellow-300">{(match.win_probability * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semi Finals */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔷</span> 半决赛 (BO3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.semi_finals.map((match, index) => (
            <div key={index} className="bg-gray-700/50 rounded-xl p-5 shadow-lg backdrop-blur-sm border border-gray-600/30">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-300">{match.match}</span>
                <span className="bg-purple-600/80 px-2 py-1 rounded text-sm">{match.format}</span>
              </div>
              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team1 
                    ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-md border border-green-600/30' 
                    : 'bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                      {match.team1.substring(0, 2)}
                    </div>
                    <span className={`text-lg ${match.predicted_winner === match.team1 ? 'font-bold' : ''}`}>{match.team1}</span>
                  </div>
                  {match.predicted_winner === match.team1 && <span className="text-green-300">✓ 预测胜者</span>}
                </div>
                <div className="text-center text-gray-400">VS</div>
                <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                  match.predicted_winner === match.team2 
                    ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-md border border-green-600/30' 
                    : 'bg-gray-600/30'
                }`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                      {match.team2.substring(0, 2)}
                    </div>
                    <span className={`text-lg ${match.predicted_winner === match.team2 ? 'font-bold' : ''}`}>{match.team2}</span>
                  </div>
                  {match.predicted_winner === match.team2 && <span className="text-green-300">✓ 预测胜者</span>}
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-300">
                胜率: <span className="font-bold text-yellow-300">{(match.win_probability * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">🔶</span> 总决赛 ({data.final.format})
        </h3>
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 shadow-2xl max-w-2xl mx-auto backdrop-blur-sm border border-gray-600/30">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-300">{data.final.match}</span>
            <span className="bg-purple-600/80 px-3 py-1 rounded">{data.final.format}</span>
          </div>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
              data.final.predicted_winner === data.final.team1 
                ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-lg border border-green-600/30' 
                : 'bg-gray-600/30'
            }`}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-4 flex items-center justify-center text-sm font-bold">
                  {data.final.team1.substring(0, 2)}
                </div>
                <span className={`text-xl ${data.final.predicted_winner === data.final.team1 ? 'font-bold' : ''}`}>{data.final.team1}</span>
              </div>
              {data.final.predicted_winner === data.final.team1 && <span className="text-green-300 text-lg">✓ 预测冠军</span>}
            </div>
            <div className="text-center text-3xl text-gray-400">⚔️</div>
            <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
              data.final.predicted_winner === data.final.team2 
                ? 'bg-gradient-to-r from-green-700/80 to-green-900/80 shadow-lg border border-green-600/30' 
                : 'bg-gray-600/30'
            }`}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-4 flex items-center justify-center text-sm font-bold">
                  {data.final.team2.substring(0, 2)}
                </div>
                <span className={`text-xl ${data.final.predicted_winner === data.final.team2 ? 'font-bold' : ''}`}>{data.final.team2}</span>
              </div>
              {data.final.predicted_winner === data.final.team2 && <span className="text-green-300 text-lg">✓ 预测冠军</span>}
            </div>
          </div>
          <div className="mt-5 text-center">
            <p className="text-lg">
              预测胜者: <span className="font-bold text-green-400 text-xl">{data.final.predicted_winner}</span>
            </p>
            <p className="mt-2">
              胜率: <span className="font-bold text-yellow-300 text-lg">{(data.final.win_probability * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Champions Prediction Tab Component
function ChampionsTab({ data }) {
  if (!data) {
    return <div className="text-center py-12">加载中...</div>;
  }

  // Sort champions by probability
  const sortedChampions = Object.entries(data.probabilities.champion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        冠军概率预测
      </h2>
      
      {/* Champion Prediction */}
      <div className="bg-gradient-to-br from-yellow-700/80 via-yellow-800/80 to-yellow-900/80 rounded-2xl p-8 mb-10 text-center shadow-2xl backdrop-blur-sm border border-yellow-600/30">
        <h3 className="text-2xl font-bold mb-2 flex justify-center items-center">
          <span className="mr-2">🏆</span> 预测冠军
        </h3>
        <p className="text-4xl md:text-5xl font-bold text-yellow-300 mb-4 py-4 bg-black/20 rounded-xl">{data.final_champion}</p>
        <p className="text-lg">基于 {(data.based_on_success_rate * 100).toFixed(2)}% 成功率的预测</p>
      </div>

      {/* Top 5 Champions */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">⭐</span> 夺冠概率前五名
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {sortedChampions.map(([team, probability], index) => (
            <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-5 text-center shadow-lg transform transition duration-300 hover:scale-105 backdrop-blur-sm border border-gray-600/30">
              <div className="text-2xl font-bold mb-2">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </div>
              <div className="font-bold text-lg mb-2 truncate">{team}</div>
              <div className="text-2xl font-bold text-yellow-400">{(probability * 100).toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-orange-400 border-b border-orange-400/50 pb-2 flex items-center">
          <span className="mr-2">📊</span> 详细统计
        </h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-gray-700/50 rounded-lg overflow-hidden">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="py-3 px-4 text-left text-sm md:text-base">队伍</th>
                <th className="py-3 px-4 text-right text-sm md:text-base">夺冠概率</th>
                <th className="py-3 px-4 text-right text-sm md:text-base">进决赛率</th>
                <th className="py-3 px-4 text-right text-sm md:text-base">进四强率</th>

              </tr>
            </thead>
            <tbody>
              {Object.entries(data.probabilities.champion)
                .sort((a, b) => b[1] - a[1])
                .map(([team, champProb], index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-700/30' : 'bg-gray-800/30'}>
                    <td className="py-3 px-4 font-medium flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mr-3 flex items-center justify-center text-xs font-bold">
                        {team.substring(0, 2)}
                      </div>
                      <span className="truncate max-w-[120px] md:max-w-none">{team}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-yellow-400 text-sm md:text-base">{(champProb * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-sm md:text-base">{(data.probabilities.top2[team] * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-sm md:text-base">{(data.probabilities.top4[team] * 100).toFixed(2)}%</td>
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
