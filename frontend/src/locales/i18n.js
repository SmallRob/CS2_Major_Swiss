// 国际化配置文件 - 支持中英文

const translations = {
  // 通用文本
  common: {
    loading: { 'zh-CN': '加载中...', 'en-US': 'Loading...' },
    theme: { 'zh-CN': '主题', 'en-US': 'Theme' },
    language: { 'zh-CN': '语言', 'en-US': 'Language' },
    chinese: { 'zh-CN': '中文', 'en-US': 'Chinese' },
    english: { 'zh-CN': '英文', 'en-US': 'English' },
    success: { 'zh-CN': '成功', 'en-US': 'Success' },
    error: { 'zh-CN': '错误', 'en-US': 'Error' },
    updateTime: { 'zh-CN': '更新时间', 'en-US': 'Update Time' },
    probability: { 'zh-CN': '概率', 'en-US': 'Probability' },
    team: { 'zh-CN': '队伍', 'en-US': 'Team' },
    champion: { 'zh-CN': '冠军', 'en-US': 'Champion' },
    prediction: { 'zh-CN': '预测', 'en-US': 'Prediction' },
    rate: { 'zh-CN': '成功率', 'en-US': 'Success Rate' }
  },

  // 页面标题和描述
  app: {
    title: { 'zh-CN': 'CS2 Major 瑞士轮预测系统', 'en-US': 'CS2 Major Swiss Round Prediction System' },
    subtitle: { 'zh-CN': '基于ELO评分和蒙特卡洛模拟的赛事预测', 'en-US': 'Tournament prediction based on ELO rating and Monte Carlo simulation' },
    footer: { 'zh-CN': 'CS2 Major 瑞士轮预测系统 © 2025', 'en-US': 'CS2 Major Swiss Round Prediction System © 2025' },
    footerDesc: { 'zh-CN': '基于数据科学和机器学习的电竞赛事预测', 'en-US': 'Esports prediction based on data science and machine learning' }
  },

  // 标签页标题
  tabs: {
    preresult: { 'zh-CN': '初始对战模拟', 'en-US': 'Initial Match Simulation' },
    swiss: { 'zh-CN': '瑞士轮预测', 'en-US': 'Swiss Round Prediction' },
    final: { 'zh-CN': '淘汰赛预测', 'en-US': 'Playoff Prediction' },
    champions: { 'zh-CN': '冠军预测', 'en-US': 'Champion Prediction' }
  },

  // 信息卡片内容
  infoCards: {
    eloTitle: { 'zh-CN': 'ELO评分系统', 'en-US': 'ELO Rating System' },
    eloDesc1: { 'zh-CN': 'ELO评分系统是一种衡量竞技游戏水平的数学方法，最初由Arpad Elo为国际象棋设计。', 'en-US': 'The ELO rating system is a mathematical method for measuring competitive game skill, originally designed by Arpad Elo for chess.' },
    eloDesc2: { 'zh-CN': '在CS2中，每支队伍都有一个动态ELO评分，比赛结果会根据双方评分差异和比赛表现调整评分。', 'en-US': 'In CS2, each team has a dynamic ELO rating, which is adjusted based on match results and performance differences between teams.' },
    eloModel: { 'zh-CN': '我们的模型：基于队伍历史表现和当前ELO评分，通过蒙特卡洛模拟10万次预测比赛结果。', 'en-US': 'Our model: Predicts match outcomes through 100,000 Monte Carlo simulations based on team historical performance and current ELO ratings.' },
    
    swissTitle: { 'zh-CN': '瑞士轮制', 'en-US': 'Swiss System' },
    swissDesc1: { 'zh-CN': '瑞士轮制是一种非淘汰制的比赛形式，确保每位选手都能参加预设数量的比赛，避免过早被淘汰。', 'en-US': 'The Swiss system is a non-elimination tournament format that ensures each participant plays a predetermined number of matches, avoiding early elimination.' },
    swissDesc2: { 'zh-CN': '在CS2 Major中，16支队伍进行3轮瑞士轮，根据胜负记录进行智能配对，保证竞争公平性。', 'en-US': 'In CS2 Major, 16 teams compete in 3 Swiss rounds with intelligent pairing based on win-loss records to ensure fair competition.' },
    swissTech: { 'zh-CN': '技术细节：遵循Valve官方规则，采用Buchholz配对算法优化，结合GPU加速的蒙特卡洛模拟提高预测准确性。', 'en-US': 'Technical details: Follows Valve official rules, uses optimized Buchholz pairing algorithm, and combines GPU-accelerated Monte Carlo simulations for improved prediction accuracy.' },

    playoffTitle: { 'zh-CN': '淘汰赛制', 'en-US': 'Playoff System' },
    playoffDesc1: { 'zh-CN': '淘汰赛是单败制比赛形式，每场比赛的负者将被淘汰出局，胜者晋级下一轮。', 'en-US': 'Playoffs use a single-elimination format where losers are eliminated from the tournament while winners advance to the next round.' },
    playoffDesc2: { 'zh-CN': '在CS2 Major中，瑞士轮结束后前8名队伍进入淘汰赛阶段，进行四分之一决赛、半决赛和总决赛。', 'en-US': 'In CS2 Major, the top 8 teams from the Swiss round advance to playoffs, competing in quarterfinals, semifinals, and finals.' },
    playoffModel: { 'zh-CN': '预测模型：基于队伍当前状态、历史交锋记录和ELO评分差异，计算每场比赛的胜率。', 'en-US': 'Prediction model: Calculates win probabilities for each match based on current team form, historical matchups, and ELO rating differences.' },

    championTitle: { 'zh-CN': '冠军预测模型', 'en-US': 'Champion Prediction Model' },
    championDesc1: { 'zh-CN': '冠军预测基于整个淘汰赛阶段的完整模拟，综合考虑队伍实力、当前状态和对阵形势。', 'en-US': 'Champion prediction is based on complete simulations of the entire playoff stage, considering team strength, current form, and matchup scenarios.' },
    championDesc2: { 'zh-CN': '我们的模型通过数百万次模拟计算每支队伍最终夺冠的概率，提供最科学的预测结果。', 'en-US': 'Our model calculates each team\'s championship probability through millions of simulations, providing scientifically-based prediction results.' },
    championTech: { 'zh-CN': '核心技术：蒙特卡洛模拟 + ELO评分系统 + Buchholz配对算法 + GPU加速计算', 'en-US': 'Core technology: Monte Carlo simulation + ELO rating system + Buchholz pairing algorithm + GPU accelerated computing' }
  },

  // 表格和列表标题
  tableHeaders: {
    team: { 'zh-CN': '队伍', 'en-US': 'Team' },
    eloRating: { 'zh-CN': 'ELO评分', 'en-US': 'ELO Rating' },
    threeZero: { 'zh-CN': '3-0概率', 'en-US': '3-0 Probability' },
    threeOneTwo: { 'zh-CN': '3-1/3-2概率', 'en-US': '3-1/3-2 Probability' },
    qualification: { 'zh-CN': '晋级概率', 'en-US': 'Qualification Probability' },
    zeroThree: { 'zh-CN': '0-3概率', 'en-US': '0-3 Probability' },
    championProb: { 'zh-CN': '夺冠概率', 'en-US': 'Champion Probability' },
    finalProb: { 'zh-CN': '进决赛率', 'en-US': 'Final Probability' },
    semifinalProb: { 'zh-CN': '进四强率', 'en-US': 'Semifinal Probability' }
  },

  // 预测结果相关
  predictions: {
    mostLikely30: { 'zh-CN': '最可能3-0队伍', 'en-US': 'Most Likely 3-0 Teams' },
    highestQualification: { 'zh-CN': '晋级概率最高', 'en-US': 'Highest Qualification' },
    mostLikely03: { 'zh-CN': '最可能0-3队伍', 'en-US': 'Most Likely 0-3 Teams' },
    predictedChampion: { 'zh-CN': '预测冠军', 'en-US': 'Predicted Champion' },
    basedOnSuccess: { 'zh-CN': '基于成功率的预测', 'en-US': 'Prediction based on success rate' },
    top5Champions: { 'zh-CN': '夺冠概率前五名', 'en-US': 'Top 5 Championship Probabilities' },
    detailedStats: { 'zh-CN': '详细统计', 'en-US': 'Detailed Statistics' },
    simulationInfo: { 'zh-CN': '模拟统计信息', 'en-US': 'Simulation Statistics' },
    monteCarloSimulations: { 'zh-CN': '基于蒙特卡洛模拟', 'en-US': 'Based on Monte Carlo simulations' }
  },

  // 比赛阶段
  matchStages: {
    quarterFinals: { 'zh-CN': '四分之一决赛 (BO3)', 'en-US': 'Quarter Finals (BO3)' },
    semiFinals: { 'zh-CN': '半决赛 (BO3)', 'en-US': 'Semi Finals (BO3)' },
    final: { 'zh-CN': '总决赛', 'en-US': 'Grand Final' },
    predictedWinner: { 'zh-CN': '预测胜者', 'en-US': 'Predicted Winner' },
    winProbability: { 'zh-CN': '胜率', 'en-US': 'Win Probability' },
    match: { 'zh-CN': '比赛', 'en-US': 'Match' },
    format: { 'zh-CN': '赛制', 'en-US': 'Format' },
    progress: { 'zh-CN': '晋级进度', 'en-US': 'Progress' },
    stage8to4: { 'zh-CN': '8进4阶段', 'en-US': '8 to 4 Stage' },
    stage4to2: { 'zh-CN': '4进2阶段', 'en-US': '4 to 2 Stage' },
    stage2to1: { 'zh-CN': '2进1阶段', 'en-US': '2 to 1 Stage' },
    quarterFinalsShort: { 'zh-CN': '四分之一决赛', 'en-US': 'Quarter Finals' },
    semiFinalsShort: { 'zh-CN': '半决赛', 'en-US': 'Semi Finals' },
    finalShort: { 'zh-CN': '决赛', 'en-US': 'Final' },
    treeViewDescription: { 'zh-CN': '树形视图展示淘汰赛对阵情况和晋级路径', 'en-US': 'Tree view showing playoff matchups and advancement paths' },
    result30: { 'zh-CN': '3-0结果', 'en-US': '3-0 Result' },
    result03: { 'zh-CN': '0-3结果', 'en-US': '0-3 Result' },
    advanceToSemifinals: { 'zh-CN': '晋级半决赛', 'en-US': 'Advance to Semifinals' },
    advanceToFinal: { 'zh-CN': '晋级总决赛', 'en-US': 'Advance to Final' }
  },

  // 投币相关
  pickem: {
    pick30: { 'zh-CN': '3-0 投币队伍', 'en-US': '3-0 Pick\'em Teams' },
    pickAdvances: { 'zh-CN': '晋级投币队伍', 'en-US': 'Advance Pick\'em Teams' },
    pick03: { 'zh-CN': '0-3 投币队伍', 'en-US': '0-3 Pick\'em Teams' },
    successRate: { 'zh-CN': '预测成功率', 'en-US': 'Prediction Success Rate' }
  }
};

// 国际化工具函数
export const i18n = {
  // 获取当前语言下的文本
  t: (key, locale = 'zh-CN') => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    return value?.[locale] || value?.['zh-CN'] || key;
  },

  // 获取所有支持的语言
  getSupportedLocales: () => ['zh-CN', 'en-US'],

  // 获取语言显示名称
  getLocaleDisplayName: (locale) => {
    const names = {
      'zh-CN': '中文',
      'en-US': 'English'
    };
    return names[locale] || locale;
  }
};

export default translations;