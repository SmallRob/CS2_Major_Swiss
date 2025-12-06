"""
CS2 Major 瑞士轮预测系统（Part 1: CPU 数据生成）
核心功能：
1. 自适应ELO系统：根据样本量动态调整权重
2. Buchholz配对算法：完整实现瑞士轮配对规则
3. 蒙特卡洛模拟：生成10万次模拟结果并保存
"""

import sys
import json
import math
import random
import copy
import os
from datetime import datetime, timedelta
from collections import defaultdict
import multiprocessing
import time
import pandas as pd
import numpy as np

# ============================================================================
# 配置区域（从外部JSON文件加载）
# ============================================================================

# 参赛战队（16支队伍）
# ⚠️ 重要：TEAMS 列表的顺序就是初始种子排序（种子1到种子16）
TEAMS = []

# 第一轮对局配对（8场BO1）
ROUND1_MATCHUPS = []

# 战队积分
TEAM_SCORES = {}

# 积分权重参数
SCORING_PARAMS = {}

# 外部数据文件路径
MATCHES_FILE = 'data/cs2_cleaned_matches.csv'  # 历史比赛数据
TEAM_RATINGS_FILE = 'data/hltv_ratings.csv'  # 战队评分数据
TEAM_SCORES_FILE = 'data/team_scores.csv'  # 战队积分数据（统一CSV格式）
ROUND1_MATCHUPS_FILE = 'data/round1_matchups.csv'  # 第一轮对战配置（统一CSV格式）
CONFIG_FILE = 'data/config.json'  # 配置文件

# ELO系统参数
BASE_ELO = 1000
BASE_K_FACTOR = 40
TIME_DECAY_DAYS = 50


def load_teams_from_file(filepath):
    """
    从CSV文件加载队伍列表
    """
    if not os.path.exists(filepath):
        print(f"[错误] 队伍数据文件 {filepath} 不存在")
        return None
    
    try:
        df = pd.read_csv(filepath)
        teams = df['Team'].tolist()
        print(f"[数据] 从 {filepath} 加载了 {len(teams)} 支队伍")
        return teams
    except Exception as e:
        print(f"[错误] 加载队伍数据失败: {e}")
        return None

def load_matchups_from_file(filepath):
    """
    从CSV文件加载第一轮对战配置
    """
    if not os.path.exists(filepath):
        print(f"[错误] 对战配置文件 {filepath} 不存在")
        return None
    
    try:
        df = pd.read_csv(filepath)
        matchups = [(row['Team1'], row['Team2']) for _, row in df.iterrows()]
        print(f"[数据] 从 {filepath} 加载了 {len(matchups)} 场对战")
        return matchups
    except Exception as e:
        print(f"[错误] 加载对战配置失败: {e}")
        return None

def load_scores_from_file(filepath):
    """
    从CSV文件加载战队积分
    """
    if not os.path.exists(filepath):
        print(f"[错误] 积分数据文件 {filepath} 不存在")
        return None
    
    try:
        df = pd.read_csv(filepath)
        scores = {row['Team']: int(row['Score']) for _, row in df.iterrows()}
        print(f"[数据] 从 {filepath} 加载了 {len(scores)} 支队伍的积分")
        return scores
    except Exception as e:
        print(f"[错误] 加载积分数据失败: {e}")
        return None

def load_external_config():
    """
    从外部CSV文件加载队伍、对战配置和积分数据
    """
    global TEAMS, ROUND1_MATCHUPS, TEAM_SCORES, SCORING_PARAMS, BASE_ELO, BASE_K_FACTOR, TIME_DECAY_DAYS
    
    # 1. 从CSV文件加载队伍列表
    teams = load_teams_from_file(TEAM_SCORES_FILE)
    if teams is None:
        return False
    
    # 2. 从CSV文件加载对战配置
    matchups = load_matchups_from_file(ROUND1_MATCHUPS_FILE)
    if matchups is None:
        return False
    
    # 3. 从CSV文件加载积分数据
    scores = load_scores_from_file(TEAM_SCORES_FILE)
    if scores is None:
        return False
    
    # 4. 加载配置文件中的其他参数
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # 加载积分权重参数
            SCORING_PARAMS.update(config.get('scoring_params', {'elo_weight': 0.8, 'score_weight': 0.2}))
            
            # 加载ELO参数
            elo_params = config.get('elo_params', {})
            global BASE_ELO, BASE_K_FACTOR, TIME_DECAY_DAYS
            BASE_ELO = elo_params.get('base_elo', BASE_ELO)
            BASE_K_FACTOR = elo_params.get('base_k_factor', BASE_K_FACTOR)
            TIME_DECAY_DAYS = elo_params.get('time_decay_days', TIME_DECAY_DAYS)
            
            print(f"[配置] 已加载 {CONFIG_FILE}")
        except Exception as e:
            print(f"[警告] 加载配置文件失败: {e}，使用默认参数")
    
    # 5. 验证数据完整性
    if not validate_config_data(teams, matchups, scores):
        print("\n[错误] 数据验证失败，程序退出")
        return False
    
    # 6. 设置全局变量
    TEAMS.extend(teams)
    ROUND1_MATCHUPS.extend(matchups)
    TEAM_SCORES.update(scores)
    
    print("[配置] 数据加载完成")
    return True


def validate_config_data(teams, matchups, scores):
    """
    验证从CSV文件加载的数据是否完整
    """
    if not teams:
        print("[错误] 队伍列表为空")
        print("      请确保 team_scores.csv 文件包含有效的队伍数据")
        return False
        
    if not matchups:
        print("[错误] 第一轮对战配置为空")
        print("      请确保 round1_matchups.csv 文件包含有效的对战配置")
        return False
        
    if not scores:
        print("[错误] 队伍积分数据为空")
        print("      请确保 team_scores.csv 文件包含有效的积分数据")
        return False
        
    if len(teams) != 16:
        print(f"[错误] 队伍数量不正确，应为16支，实际为 {len(teams)} 支")
        return False
        
    if len(matchups) != 8:
        print(f"[错误] 第一轮对战数量不正确，应为8场，实际为 {len(matchups)} 场")
        return False
        
    # 验证第一轮对战中的队伍是否都在队伍列表中
    for matchup in matchups:
        if len(matchup) != 2:
            print(f"[错误] 对战配置格式错误: {matchup}")
            return False
        team1, team2 = matchup
        if team1 not in teams:
            print(f"[错误] 对战配置中的队伍 '{team1}' 不在队伍列表中")
            return False
        if team2 not in teams:
            print(f"[错误] 对战配置中的队伍 '{team2}' 不在队伍列表中")
            return False
    
    # 验证队伍积分配置是否完整
    for team in teams:
        if team not in scores:
            print(f"[错误] 队伍 '{team}' 在队伍积分配置中缺失")
            return False
    
    return True

def validate_config(config):
    """
    验证配置文件是否完整，缺少必要配置则直接退出
    """
    if not config.get('teams'):
        print("[错误] 配置文件中缺少队伍列表 (teams)")
        print("      请确保 config.json 包含有效的队伍配置")
        return False
        
    if not config.get('round1_matchups'):
        print("[错误] 配置文件中缺少第一轮对战配置 (round1_matchups)")
        print("      请确保 config.json 包含有效的第一轮对战配置")
        return False
        
    if not config.get('team_scores'):
        print("[错误] 配置文件中缺少队伍积分 (team_scores)")
        print("      请确保 config.json 包含有效的队伍积分配置")
        return False
        
    if len(config['teams']) != 16:
        print(f"[错误] 队伍数量不正确，应为16支，实际为 {len(config['teams'])} 支")
        return False
        
    if len(config['round1_matchups']) != 8:
        print(f"[错误] 第一轮对战数量不正确，应为8场，实际为 {len(config['round1_matchups'])} 场")
        return False
        
    # 验证第一轮对战中的队伍是否都在队伍列表中
    for matchup in config['round1_matchups']:
        if len(matchup) != 2:
            print(f"[错误] 对战配置格式错误: {matchup}")
            return False
        team1, team2 = matchup
        if team1 not in config['teams']:
            print(f"[错误] 对战配置中的队伍 '{team1}' 不在队伍列表中")
            return False
        if team2 not in config['teams']:
            print(f"[错误] 对战配置中的队伍 '{team2}' 不在队伍列表中")
            return False
    
    # 验证队伍积分配置是否完整
    for team in config['teams']:
        if team not in config['team_scores']:
            print(f"[错误] 队伍 '{team}' 在队伍积分配置中缺失")
            return False
    
    return True


def load_config():
    """
    加载配置文件，获取模拟次数
    """
    config = {
        'simulation': {
            'num_simulations': 100000 
        }
    }
    
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                user_config = json.load(f)
                if user_config and isinstance(user_config, dict):
                    if 'simulation_params' in user_config and isinstance(user_config['simulation_params'], dict):
                        # 更新配置
                        if 'num_simulations' in user_config['simulation_params']:
                            config['simulation']['num_simulations'] = user_config['simulation_params']['num_simulations']
                print(f"[配置] 已加载 {CONFIG_FILE}")
        except json.JSONDecodeError as e:
            print(f"[警告] 配置文件格式错误: {e}，将使用默认值")
        except Exception as e:
            print(f"[警告] 加载配置文件失败: {e}，将使用默认值")
    else:
        print(f"[提示] 未找到 {CONFIG_FILE}，使用默认设置 (100,000次)")
        
    return config

def load_team_ratings_from_file(filepath):
    """
    从CSV文件加载战队评分（考虑样本量置信度）
    """
    try:
        df = pd.read_csv(filepath)
        global_mean_rating = df['Rating'].mean()
        MIN_MAPS_FOR_FULL_CONFIDENCE = 80
        MIN_MAPS_THRESHOLD = 20
        
        ratings = {}
        
        for _, row in df.iterrows():
            team_name = row['Team']
            raw_rating = float(row['Rating'])
            maps_played = int(row['Maps'])
            
            if maps_played >= MIN_MAPS_FOR_FULL_CONFIDENCE:
                confidence = 1.0
            elif maps_played >= MIN_MAPS_THRESHOLD:
                confidence = 0.25 + (maps_played - MIN_MAPS_THRESHOLD) / (MIN_MAPS_FOR_FULL_CONFIDENCE - MIN_MAPS_THRESHOLD) * 0.75
            else:
                confidence = max(0.1, maps_played / MIN_MAPS_THRESHOLD * 0.25)
            
            adjusted_rating = confidence * raw_rating + (1 - confidence) * global_mean_rating
            ratings[team_name] = adjusted_rating
        
        print(f"[数据] 从 {filepath} 加载了 {len(ratings)} 支队伍的评分")
        return ratings
    
    except Exception as e:
        print(f"[ERROR] 加载战队评分失败: {e}")
        return {team: 1.0 for team in TEAMS}


def calculate_elo_ratings(matches_df, initial_ratings, base_k_factor=40, time_decay_days=50):
    """
    基于历史比赛计算ELO评分
    """
    ratings = initial_ratings.copy()
    matches_df = matches_df.sort_values('date')
    latest_date = matches_df['date'].max()
    
    team_csv_matches = defaultdict(int)
    for _, match in matches_df.iterrows():
        if match['team1'] in ratings:
            team_csv_matches[match['team1']] += 1
        if match['team2'] in ratings:
            team_csv_matches[match['team2']] += 1
    
    opponent_strength = defaultdict(list)
    elo_changes = defaultdict(list)
    
    for _, match in matches_df.iterrows():
        team1, team2 = match['team1'], match['team2']
        if team1 not in ratings or team2 not in ratings:
            continue
        
        score1, score2 = int(match['score1']), int(match['score2'])
        match_format = match['format']
        
        r1_before, r2_before = ratings[team1], ratings[team2]
        opponent_strength[team1].append(r2_before)
        opponent_strength[team2].append(r1_before)
        
        csv_count1 = team_csv_matches.get(team1, 0)
        csv_count2 = team_csv_matches.get(team2, 0)
        
        k1 = 50 if csv_count1 < 15 else (40 if csv_count1 < 30 else 30)
        k2 = 50 if csv_count2 < 15 else (40 if csv_count2 < 30 else 30)
        adaptive_k = (k1 + k2) / 2
        
        days_ago = (latest_date - match['date']).days
        time_weight = math.exp(-days_ago / time_decay_days)
        
        format_weight = {'bo1': 1.0, 'bo3': 1.2, 'bo5': 1.5}.get(match_format, 1.0)
        k = adaptive_k * format_weight * time_weight
        
        r1, r2 = ratings[team1], ratings[team2]
        e1 = 1 / (1 + math.pow(10, (r2 - r1) / 400))
        s1 = 1 if score1 > score2 else (0 if score1 < score2 else 0.5)
        
        ratings[team1] = r1 + k * (s1 - e1)
        ratings[team2] = r2 + k * ((1-s1) - (1-e1))
        
        elo_changes[team1].append(ratings[team1] - r1_before)
        elo_changes[team2].append(ratings[team2] - r2_before)
    
    print("\n[ELO] 最终评分统计（参赛队伍）：")
    print(f"{'队伍':<20} {'初始':<8} {'最终':<8} {'变化':<8} {'对局':<6} {'对手均值':<10}")
    print("-" * 70)
    
    team_stats = []
    for team in TEAMS:
        if team in ratings:
            initial = initial_ratings.get(team, 1000)
            final = ratings[team]
            change = final - initial
            matches_count = len(opponent_strength.get(team, []))
            avg_opponent = sum(opponent_strength.get(team, [1000])) / max(len(opponent_strength.get(team, [])), 1)
            
            team_stats.append({
                'team': team,
                'initial': initial,
                'final': final,
                'change': change,
                'matches': matches_count,
                'avg_opponent': avg_opponent
            })
    
    team_stats.sort(key=lambda x: x['final'], reverse=True)
    
    for stat in team_stats:
        direction = "+" if stat['change'] >= 0 else ""
        strength = "强" if stat['avg_opponent'] > 1020 else ("中" if stat['avg_opponent'] > 980 else "弱")
        print(f"{stat['team']:<20} {stat['initial']:<8.1f} {stat['final']:<8.1f} "
              f"{direction}{stat['change']:<7.1f} {stat['matches']:<6} {stat['avg_opponent']:<7.1f} [{strength}]")
    
    return ratings


def calculate_winrate(score_a, score_b):
    """根据两支队伍的积分计算胜率，使用加权平均和sigmoid函数相结合的方式"""
    # 基础胜率基于积分比例
    total_score = score_a + score_b
    
    # 避免除零错误
    if total_score == 0:
        return 50.0  # 如果两队积分都为0，则胜率为50%
    
    # 基于积分比例的基础胜率
    base_winrate = (score_a / total_score) * 100
    
    # 使用sigmoid函数调整胜率差，使结果更平滑
    diff = score_a - score_b
    adjustment_factor = 25 * (diff / (abs(diff) + 50))  # 调整因子
    
    # 加权平均：基础胜率占70%，调整因子占30%
    winrate = 0.7 * base_winrate + 0.3 * (50 + adjustment_factor)
    
    # 确保胜率在0-100之间
    return max(0, min(100, winrate))


def predict_match(team1, team2, ratings, bo_format='bo1'):
    """
    预测比赛胜率（结合ELO评分和战队积分）
    """
    # 获取权重参数
    elo_weight = SCORING_PARAMS.get('elo_weight', 0.7)
    score_weight = SCORING_PARAMS.get('score_weight', 0.3)
    
    # 如果ELO权重为0且积分权重为0，则返回均等概率
    if elo_weight == 0 and score_weight == 0:
        return 0.5, 0.5
    
    # 1. 基于ELO评分的胜率
    r1, r2 = ratings.get(team1, 1000), ratings.get(team2, 1000)
    elo_prob1 = 1 / (1 + math.pow(10, (r2 - r1) / 400))
    
    # 如果积分权重为0，则只使用ELO评分
    if score_weight == 0:
        if bo_format == 'bo1':
            prob1 = 0.5 + (elo_prob1 - 0.5) * 0.85
        else:
            prob1 = elo_prob1
        return prob1, 1 - prob1
    
    # 2. 基于战队积分的胜率
    # 严格检查：如果队伍积分不存在，则返回均等概率
    if team1 not in TEAM_SCORES or team2 not in TEAM_SCORES:
        print(f"[警告] 队伍积分数据缺失，使用均等胜率: {team1} vs {team2}")
        return 0.5, 0.5
    
    score1 = TEAM_SCORES[team1]
    score2 = TEAM_SCORES[team2]
    score_prob1 = calculate_winrate(score1, score2) / 100  # 转换为0-1范围
    
    # 3. 根据权重参数组合两种预测
    combined_prob1 = elo_weight * elo_prob1 + score_weight * score_prob1
    
    # 4. 根据比赛格式调整（原逻辑保留）
    if bo_format == 'bo1':
        prob1 = 0.5 + (combined_prob1 - 0.5) * 0.85
    else:
        prob1 = combined_prob1
    
    return prob1, 1 - prob1


def simulate_full_swiss(ratings, num_simulations=100000):
    """
    完整瑞士轮模拟（实现Buchholz配对系统）
    """
    team_results = defaultdict(lambda: {'3-0': 0, 'qualified': 0, '0-3': 0, 'total': 0})
    all_simulations = []
    
    print(f"[模拟] 开始运行 {num_simulations} 次瑞士轮模拟...")
    
    for sim in range(num_simulations):
        records = {team: (0, 0) for team in TEAMS}
        match_history = {team: [] for team in TEAMS}
        
        # 第一轮（BO1）
        for team1, team2 in ROUND1_MATCHUPS:
            prob1, _ = predict_match(team1, team2, ratings, 'bo1')
            winner = team1 if random.random() < prob1 else team2
            loser = team2 if winner == team1 else team1
            
            w, l = records[winner]
            records[winner] = (w + 1, l)
            w, l = records[loser]
            records[loser] = (w, l + 1)
            
            match_history[team1].append(team2)
            match_history[team2].append(team1)
        
        # 后续轮次
        for round_num in range(2, 6):
            groups = defaultdict(list)
            for team, (wins, losses) in records.items():
                if wins < 3 and losses < 3:
                    groups[(wins, losses)].append(team)
            
            if not groups:
                break
            
            for record, teams in groups.items():
                difficulty = {}
                for team in teams:
                    diff = 0
                    for opponent in match_history[team]:
                        opp_wins, opp_losses = records[opponent]
                        diff += (opp_wins - opp_losses)
                    difficulty[team] = diff
                
                teams.sort(key=lambda t: (-difficulty[t], TEAMS.index(t)))
                
                # Round 2-3 配对逻辑
                if round_num in [2, 3]:
                    remaining = teams.copy()
                    while len(remaining) >= 2:
                        team1 = remaining.pop(0)
                        matched = False
                        team2 = None
                        for i in range(len(remaining) - 1, -1, -1):
                            team2_candidate = remaining[i]
                            if team2_candidate not in match_history[team1]:
                                team2 = remaining.pop(i)
                                matched = True
                                break
                        if not matched:
                            team2 = remaining.pop()
                        
                        wins1, losses1 = records[team1]
                        wins2, losses2 = records[team2]
                        is_elimination_or_advancement = (wins1 == 2 or losses1 == 2 or wins2 == 2 or losses2 == 2)
                        bo_format = 'bo3' if is_elimination_or_advancement else 'bo1'
                        
                        prob1, _ = predict_match(team1, team2, ratings, bo_format)
                        winner = team1 if random.random() < prob1 else team2
                        loser = team2 if winner == team1 else team1
                        
                        w, l = records[winner]
                        records[winner] = (w + 1, l)
                        w, l = records[loser]
                        records[loser] = (w, l + 1)
                        
                        match_history[team1].append(team2)
                        match_history[team2].append(team1)
                
                # Round 4-5 配对逻辑（使用优先级表）
                else:
                    PAIRING_PRIORITY = [
                        [(0, 5), (1, 4), (2, 3)], [(0, 5), (1, 3), (2, 4)],
                        [(0, 4), (1, 5), (2, 3)], [(0, 4), (1, 3), (2, 5)],
                        [(0, 3), (1, 5), (2, 4)], [(0, 3), (1, 4), (2, 5)],
                        [(0, 5), (1, 2), (3, 4)], [(0, 4), (1, 2), (3, 5)],
                        [(0, 2), (1, 5), (3, 4)], [(0, 2), (1, 4), (3, 5)],
                        [(0, 3), (1, 2), (4, 5)], [(0, 2), (1, 3), (4, 5)],
                        [(0, 1), (2, 5), (3, 4)], [(0, 1), (2, 4), (3, 5)],
                        [(0, 1), (2, 3), (4, 5)],
                    ]
                    
                    matched_pairs = None
                    for priority_pattern in PAIRING_PRIORITY:
                        valid = True
                        test_pairs = []
                        for idx1, idx2 in priority_pattern:
                            if idx1 >= len(teams) or idx2 >= len(teams):
                                valid = False
                                break
                            team1, team2 = teams[idx1], teams[idx2]
                            if team2 in match_history[team1]:
                                valid = False
                                break
                            test_pairs.append((team1, team2))
                        if valid:
                            matched_pairs = test_pairs
                            break
                    
                    if matched_pairs is None:
                        matched_pairs = []
                        for idx1, idx2 in PAIRING_PRIORITY[0]:
                            if idx1 < len(teams) and idx2 < len(teams):
                                matched_pairs.append((teams[idx1], teams[idx2]))
                    
                    for team1, team2 in matched_pairs:
                        wins1, losses1 = records[team1]
                        wins2, losses2 = records[team2]
                        is_elimination_or_advancement = (wins1 == 2 or losses1 == 2 or wins2 == 2 or losses2 == 2)
                        bo_format = 'bo3' if is_elimination_or_advancement else 'bo1'
                        
                        prob1, _ = predict_match(team1, team2, ratings, bo_format)
                        winner = team1 if random.random() < prob1 else team2
                        loser = team2 if winner == team1 else team1
                        
                        w, l = records[winner]
                        records[winner] = (w + 1, l)
                        w, l = records[loser]
                        records[loser] = (w, l + 1)
                        
                        match_history[team1].append(team2)
                        match_history[team2].append(team1)
        
        sim_result = {'3-0': set(), 'qualified': set(), '0-3': set()}
        for team, (wins, losses) in records.items():
            team_results[team]['total'] += 1
            if wins == 3 and losses == 0:
                team_results[team]['3-0'] += 1
                team_results[team]['qualified'] += 1
                sim_result['3-0'].add(team)
                sim_result['qualified'].add(team)
            elif wins == 3:
                team_results[team]['qualified'] += 1
                sim_result['qualified'].add(team)
            elif losses == 3 and wins == 0:
                team_results[team]['0-3'] += 1
                sim_result['0-3'].add(team)
        
        all_simulations.append(sim_result)
        
        if (sim + 1) % 10000 == 0:
            print(f"完成 {sim + 1}/{num_simulations} 次模拟")
    
    results = {}
    for team, stats in team_results.items():
        total = stats['total']
        results[team] = {
            '3-0': stats['3-0'] / total,
            'qualified': stats['qualified'] / total,
            '0-3': stats['0-3'] / total,
            '3-1-or-3-2': (stats['qualified'] - stats['3-0']) / total
        }
    
    return results, all_simulations


# ============================================================================
# 主流程
# ============================================================================

def check_required_files():
    """
    检查所有必需的数据文件是否存在
    """
    required_files = [
        TEAM_SCORES_FILE,
        ROUND1_MATCHUPS_FILE,
        MATCHES_FILE,
        TEAM_RATINGS_FILE
    ]
    
    missing_files = []
    for filepath in required_files:
        if not os.path.exists(filepath):
            missing_files.append(filepath)
    
    if missing_files:
        print("\n[错误] 以下必需文件不存在：")
        for filepath in missing_files:
            print(f"  - {filepath}")
        print("\n请确保所有数据文件都存在于正确位置")
        return False
    
    return True

def main():
    print("=" * 60)
    print("CS2 Major 瑞士轮预测系统数据生成")
    print("=" * 60)
    print(f"[LOG] {datetime.now().strftime('%H:%M:%S')} - 程序启动", flush=True)
    
    # 检查必需文件是否存在
    if not check_required_files():
        print("\n[错误] 必需文件检查失败，程序退出")
        sys.exit(1)
    
    # 加载外部配置
    if not load_external_config():
        print("\n[错误] 配置加载失败，程序退出")
        sys.exit(1)
    
    print(f"[配置] 已加载 {len(TEAMS)} 支队伍")
    print(f"[配置] 已加载 {len(ROUND1_MATCHUPS)} 场第一轮对局")
    
    config = load_config()
    num_sims = config['simulation']['num_simulations']
    print(f"[配置] 模拟次数设定为: {num_sims:,}")
    
    print("\n[1/4] 加载外部数据...")
    matches_df = pd.read_csv(MATCHES_FILE, header=0,
                             names=['date', 'team1', 'score1', 'score2', 'team2', 'tournament', 'format'])
    matches_df['date'] = pd.to_datetime(matches_df['date'])
    team_ratings = load_team_ratings_from_file(TEAM_RATINGS_FILE)
    
    print("\n[2/4] 计算ELO评分...")
    team_csv_matches = defaultdict(int)
    for _, match in matches_df.iterrows():
        if match['team1'] in TEAMS:
            team_csv_matches[match['team1']] += 1
        if match['team2'] in TEAMS:
            team_csv_matches[match['team2']] += 1
    
    initial_ratings = {}
    for team in TEAMS:
        external_rating = team_ratings.get(team, 1.0)
        csv_matches = team_csv_matches.get(team, 0)
        
        if csv_matches < 10:
            rating_influence = 70
        elif csv_matches < 20:
            rating_influence = 70 - (csv_matches - 10) * 3.5
        elif csv_matches < 30:
            rating_influence = 35 - (csv_matches - 20) * 1.5
        else:
            rating_influence = 20
        rating_adjustment = (external_rating - 1.03) * rating_influence * 10
        rating_adjustment = max(-rating_influence, min(rating_influence, rating_adjustment))
        initial_ratings[team] = BASE_ELO + rating_adjustment
        
    elo_ratings = calculate_elo_ratings(matches_df, initial_ratings)
    
    print(f"\n[3/4] 运行{num_sims:,}次瑞士轮模拟...")
    probabilities, all_simulations = simulate_full_swiss(elo_ratings, num_simulations=num_sims)
    
    print("\n模拟结果摘要:")
    sorted_results = sorted(probabilities.items(), key=lambda x: x[1]['qualified'], reverse=True)
    for team, probs in sorted_results:
        print(f"{team:<20} {probs['3-0']:>8.1%} {probs['qualified']:>8.1%} "
              f"{probs['0-3']:>8.1%} {probs['3-1-or-3-2']:>8.1%}")
    
    print("\n[4/4] 保存模拟数据供后续步骤使用...")
    
    serialized_simulations = []
    for sim in all_simulations:
        serialized_simulations.append({
            '3-0': list(sim['3-0']),
            'qualified': list(sim['qualified']),
            '0-3': list(sim['0-3'])
        })
    
    intermediate_data = {
        'teams': TEAMS,
        'elo_ratings': dict(elo_ratings),
        'simulation_results': dict(probabilities),
        'raw_simulations': serialized_simulations,
        'timestamp': datetime.now().isoformat(),

    }
    

    output_dir = 'output'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_file = os.path.join(output_dir, 'intermediate_sim_data.json')

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(intermediate_data, f, indent=None)
        print(f"[SUCCESS] 数据已保存至: {output_file}")
        print(f"包含 {len(serialized_simulations)} 条模拟记录，可用于GPU加速优化。")
    except Exception as e:
        print(f"[ERROR] 保存失败: {e}")

if __name__ == "__main__":
    main()