"""
CS2 Major 瑞士轮预测系统（Part 3: 最终晋级赛预测）
核心功能：
1. 生成晋级赛对阵
2. 模拟晋级赛
3. 输出晋级赛结果
"""
import json
import itertools
import random
from datetime import datetime
import torch
import sys
import time

def load_prediction_results(file_path):
    """加载预测结果文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_config(config_file="data/config.json"):
    """加载配置文件"""
    with open(config_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_playoff_bracket(prediction_data):
    """生成晋级赛对阵（按固定顺序）"""
    # 获取晋级的队伍
    advancing_teams = prediction_data["best_prediction"]["advances"]
    three_oh_teams = prediction_data["best_prediction"]["3-0"]
    
    # 合并晋级队伍，3-0队伍排在前面，保持顺序
    all_advancing = three_oh_teams + advancing_teams
    
    # 确保我们有8支队伍
    if len(all_advancing) != 8:
        print(f"警告: 晋级队伍数量不为8，实际为{len(all_advancing)}")
    
    # 按照固定顺序生成8进4的对阵 (BO3)
    quarter_finals = []
    for i in range(0, len(all_advancing), 2):
        if i + 1 < len(all_advancing):
            quarter_finals.append({
                "match": f"QF{i//2 + 1}",
                "team1": all_advancing[i],
                "team2": all_advancing[i+1],
                "format": "BO3"
            })
    
    return quarter_finals

class PlayoffSimulator:
    """基于原始算法的晋级赛模拟器"""
    
    def __init__(self, sim_data_file):
        self.load_simulation_data(sim_data_file)
        self.setup_device()
        
    def load_simulation_data(self, filepath):
        """加载模拟数据"""
        print(f"加载模拟数据: {filepath}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.teams = self.data['teams']
        self.team_to_idx = {team: i for i, team in enumerate(self.teams)}
        self.raw_sims = self.data['raw_simulations']
        self.num_sims = len(self.raw_sims)
        
    def setup_device(self):
        """设置计算设备"""
        if torch.cuda.is_available():
            self.device = torch.device('cuda')
            print(f"使用 GPU: {torch.cuda.get_device_name(0)}")
        else:
            self.device = torch.device('cpu')
            print("使用 CPU")
            
    def get_team_advancement_rate(self, team):
        """获取队伍的晋级率"""
        if team not in self.team_to_idx:
            return 0.0
        
        team_idx = self.team_to_idx[team]
        advancement_count = 0
        
        for sim in self.raw_sims:
            # 检查队伍是否晋级（3-0 或 qualified）
            if team in sim['3-0'] or team in sim['qualified']:
                advancement_count += 1
                
        return advancement_count / self.num_sims
    
    def simulate_match(self, team1, team2, format_type="BO3"):
        """模拟两支队伍的对战结果"""
        # 获取两支队伍的晋级率作为实力指标
        rate1 = self.get_team_advancement_rate(team1)
        rate2 = self.get_team_advancement_rate(team2)
        
        # 归一化为胜率
        total = rate1 + rate2
        if total == 0:
            prob1 = 0.5
            prob2 = 0.5
        else:
            prob1 = rate1 / total
            prob2 = rate2 / total
            
        if format_type == "BO3":
            # BO3: 先赢2局者胜
            wins1 = 0
            wins2 = 0
            while wins1 < 2 and wins2 < 2:
                if random.random() < prob1:
                    wins1 += 1
                else:
                    wins2 += 1
            return team1 if wins1 >= 2 else team2
        else:  # BO5
            # BO5: 先赢3局者胜
            wins1 = 0
            wins2 = 0
            while wins1 < 3 and wins2 < 3:
                if random.random() < prob1:
                    wins1 += 1
                else:
                    wins2 += 1
            return team1 if wins1 >= 3 else team2
    
    def show_progress_bar(self, current, total, length=50):
        """显示进度条"""
        percent = current / total
        filled_length = int(length * percent)
        # 使用兼容性更好的字符
        bar = '#' * filled_length + '-' * (length - filled_length)
        return f"\r进度: [{bar}] {current}/{total} ({percent:.1%})"
    
    def simulate_playoff(self, quarter_finals, num_simulations=1000):
        """多次模拟整个晋级赛，统计结果（按照固定对阵顺序）"""
        semifinal_winners = {}
        final_results = {}
        champion_counts = {}
        
        # 预计算所有队伍的晋级率
        team_rates = {}
        for team in self.teams:
            team_rates[team] = self.get_team_advancement_rate(team)
        
        # 计算进度更新间隔
        progress_interval = max(1, num_simulations // 100)  # 最多更新100次进度
        
        for i in range(num_simulations):
            # 更新进度条
            if i % progress_interval == 0 or i == num_simulations - 1:
                progress_bar = self.show_progress_bar(i + 1, num_simulations)
                sys.stdout.write(progress_bar)
                sys.stdout.flush()
            
            # 8进4阶段：前4名产生2名4强，后4名产生2名4强
            # QF1 vs QF2 (前4名中的前2个)
            qf1_winner = self.simulate_match_fast(
                quarter_finals[0]['team1'], quarter_finals[0]['team2'], team_rates, "BO3"
            )
            qf2_winner = self.simulate_match_fast(
                quarter_finals[1]['team1'], quarter_finals[1]['team2'], team_rates, "BO3"
            )
            # QF3 vs QF4 (后4名中的后2个)
            qf3_winner = self.simulate_match_fast(
                quarter_finals[2]['team1'], quarter_finals[2]['team2'], team_rates, "BO3"
            )
            qf4_winner = self.simulate_match_fast(
                quarter_finals[3]['team1'], quarter_finals[3]['team2'], team_rates, "BO3"
            )
            
            # 记录4强队伍（8进4胜者）
            top4_teams = [qf1_winner, qf2_winner, qf3_winner, qf4_winner]
            for winner in top4_teams:
                semifinal_winners[winner] = semifinal_winners.get(winner, 0) + 1
            
            # 4进2阶段：前4名产生的2名4强决出1个2强，后4名产生的2名4强决出1个2强
            sf1_winner = self.simulate_match_fast(qf1_winner, qf2_winner, team_rates, "BO3")
            sf2_winner = self.simulate_match_fast(qf3_winner, qf4_winner, team_rates, "BO3")
            
            # 记录2强队伍（4进2胜者）
            top2_teams = [sf1_winner, sf2_winner]
            for winner in top2_teams:
                final_results[winner] = final_results.get(winner, 0) + 1
            
            # 决赛阶段：BO5
            champion = self.simulate_match_fast(sf1_winner, sf2_winner, team_rates, "BO5")
            champion_counts[champion] = champion_counts.get(champion, 0) + 1
        
        # 完成进度条
        print()  # 换行
        
        # 计算概率
        semifinal_probs = {team: count/num_simulations for team, count in semifinal_winners.items()}
        final_probs = {team: count/num_simulations for team, count in final_results.items()}
        champion_probs = {team: count/num_simulations for team, count in champion_counts.items()}
        
        return {
            "top4": semifinal_probs,      # 4强概率
            "top2": final_probs,           # 2强概率  
            "champion": champion_probs     # 冠军概率
        }
    
    def simulate_match_fast(self, team1, team2, team_rates, format_type="BO3"):
        """快速模拟对战结果（使用预计算的队伍实力）"""
        # 获取两支队伍的实力指标
        rate1 = team_rates.get(team1, 0.0)
        rate2 = team_rates.get(team2, 0.0)
        
        # 归一化为胜率
        total = rate1 + rate2
        if total == 0:
            prob1 = 0.5
        else:
            prob1 = rate1 / total
            
        if format_type == "BO3":
            # BO3的数学公式：P(胜) = prob1^2 + 2*prob1^2*(1-prob1) = prob1^2 * (3 - 2*prob1)
            win_prob = prob1 * prob1 * (3 - 2 * prob1)
            return team1 if random.random() < win_prob else team2
        else:  # BO5
            # BO5的数学公式：P(胜) = prob1^3 + 3*prob1^3*(1-prob1) + 6*prob1^3*(1-prob1)^2
            win_prob = prob1 * prob1 * prob1 * (10 - 15*prob1 + 6*prob1*prob1)
            return team1 if random.random() < win_prob else team2

def generate_playoff_prediction(prediction_data, quarter_finals):
    """生成晋级赛预测（包含最终预测）"""
    # 加载配置
    config = load_config()
    num_simulations = config["simulation_params"]["playoff_simulations"]
    
    # 创建模拟器
    simulator = PlayoffSimulator("output/intermediate_sim_data.json")
    
    # 模拟晋级赛
    print("模拟晋级赛结果...")
    playoff_probs = simulator.simulate_playoff(quarter_finals, num_simulations=num_simulations)
    
    # 基于概率生成具体预测
    # 8进4预测
    qf_predictions = []
    for i, qf in enumerate(quarter_finals):
        rate1 = simulator.get_team_advancement_rate(qf['team1'])
        rate2 = simulator.get_team_advancement_rate(qf['team2'])
        winner = qf['team1'] if rate1 > rate2 else qf['team2']
        prob = max(rate1, rate2) / (rate1 + rate2) if (rate1 + rate2) > 0 else 0.5
        qf_predictions.append({
            "match": qf['match'],
            "team1": qf['team1'],
            "team2": qf['team2'],
            "predicted_winner": winner,
            "win_probability": prob,
            "format": "BO3"
        })
    
    # 4进2预测（按固定顺序：QF1胜者 vs QF2胜者，QF3胜者 vs QF4胜者）
    sf_predictions = []
    
    # SF1: QF1胜者 vs QF2胜者
    sf1_team1 = qf_predictions[0]['predicted_winner']
    sf1_team2 = qf_predictions[1]['predicted_winner']
    sf1_rate1 = simulator.get_team_advancement_rate(sf1_team1)
    sf1_rate2 = simulator.get_team_advancement_rate(sf1_team2)
    sf1_winner = sf1_team1 if sf1_rate1 > sf1_rate2 else sf1_team2
    sf1_prob = max(sf1_rate1, sf1_rate2) / (sf1_rate1 + sf1_rate2) if (sf1_rate1 + sf1_rate2) > 0 else 0.5
    
    sf_predictions.append({
        "match": "SF1",
        "team1": sf1_team1,
        "team2": sf1_team2,
        "predicted_winner": sf1_winner,
        "win_probability": sf1_prob,
        "format": "BO3"
    })
    
    # SF2: QF3胜者 vs QF4胜者
    sf2_team1 = qf_predictions[2]['predicted_winner']
    sf2_team2 = qf_predictions[3]['predicted_winner']
    sf2_rate1 = simulator.get_team_advancement_rate(sf2_team1)
    sf2_rate2 = simulator.get_team_advancement_rate(sf2_team2)
    sf2_winner = sf2_team1 if sf2_rate1 > sf2_rate2 else sf2_team2
    sf2_prob = max(sf2_rate1, sf2_rate2) / (sf2_rate1 + sf2_rate2) if (sf2_rate1 + sf2_rate2) > 0 else 0.5
    
    sf_predictions.append({
        "match": "SF2",
        "team1": sf2_team1,
        "team2": sf2_team2,
        "predicted_winner": sf2_winner,
        "win_probability": sf2_prob,
        "format": "BO3"
    })
    
    # 决赛预测
    final_team1 = sf1_winner
    final_team2 = sf2_winner
    final_rate1 = simulator.get_team_advancement_rate(final_team1)
    final_rate2 = simulator.get_team_advancement_rate(final_team2)
    final_winner = final_team1 if final_rate1 > final_rate2 else final_team2
    final_prob = max(final_rate1, final_rate2) / (final_rate1 + final_rate2) if (final_rate1 + final_rate2) > 0 else 0.5
    
    final_prediction = {
        "match": "Final",
        "team1": final_team1,
        "team2": final_team2,
        "predicted_winner": final_winner,
        "win_probability": final_prob,
        "format": "BO5"
    }
    
    # 最终预测结果
    final_results = {
        "quarter_finals": qf_predictions,
        "semi_finals": sf_predictions,
        "final": final_prediction,
        "final_champion": final_winner,
        "probabilities": playoff_probs,
        "based_on_success_rate": prediction_data["success_rate"]
    }
    
    return final_results

def save_playoff_prediction(playoff_data, output_file):
    """保存晋级赛预测结果"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(playoff_data, f, ensure_ascii=False, indent=2)
    print(f"CS2晋级赛预测已保存到: {output_file}")

def main():
    # 读取预测结果
    input_file = "output/swiss_prediction.json"
    prediction_data = load_prediction_results(input_file)
    
    # 生成晋级赛对阵
    quarter_finals = generate_playoff_bracket(prediction_data)
    
    # 生成晋级赛预测
    playoff_prediction = generate_playoff_prediction(prediction_data, quarter_finals)
    
    # 保存结果
    output_file = "output/playoff_prediction_final.json"
    save_playoff_prediction(playoff_prediction, output_file)
    
    # 加载配置以获取初始积分
    config = load_config()
    team_scores = config.get("team_scores", {})
    
    # 获取模拟次数用于显示
    num_simulations = config["simulation_params"]["playoff_simulations"]
    
    # 打印新的格式化输出
    print("\n" + "="*60)
    print("CS2 Major 晋级赛对阵预测")
    print("="*60)
    
    print("\n四分之一决赛 (BO3):")
    for match in playoff_prediction["quarter_finals"]:
        print(f"  {match['match']}: {match['team1']} vs {match['team2']}")
        print(f"    预测胜者: {match['predicted_winner']} (胜率: {match['win_probability']:.1%})")
    
    print("\n半决赛预测 (BO3):")
    for match in playoff_prediction["semi_finals"]:
        print(f"  {match['match']}: {match['team1']} vs {match['team2']}")
        print(f"    预测胜者: {match['predicted_winner']} (胜率: {match['win_probability']:.1%})")
    
    print(f"\n决赛 ({playoff_prediction['final']['format']}):")
    final = playoff_prediction["final"]
    print(f"  {final['match']}: {final['team1']} vs {final['team2']}")
    print(f"    预测胜者: {final['predicted_winner']} (胜率: {final['win_probability']:.1%})")
    
    print("\n" + "="*60)
    print("🏆 最终预测结果")
    print("="*60)
    print(f"\n冠军预测: {playoff_prediction['final_champion']}")
    
    # 新增：按指定格式显示统计数据
    print("\n" + "="*80)
    print(f"淘汰赛模拟结果统计（{num_simulations//10000}万次模拟）")
    print("="*80)
    
    # 表头
    print(f"{'队伍':<20} {'初始积分':<10} {'夺冠概率':<10} {'进决赛率':<10} {'进四强率':<10}")
    print("-"*80)
    
    # 获取所有队伍及其统计数据
    all_teams_stats = []
    champion_probs = playoff_prediction["probabilities"]["champion"]
    final_probs = playoff_prediction["probabilities"]["top2"]
    semifinal_probs = playoff_prediction["probabilities"]["top4"]
    
    # 收集所有队伍的数据
    for team in champion_probs.keys():
        initial_score = team_scores.get(team, 0)
        champ_prob = champion_probs.get(team, 0)
        final_prob = final_probs.get(team, 0)
        semi_prob = semifinal_probs.get(team, 0)
        
        all_teams_stats.append({
            "team": team,
            "initial_score": initial_score,
            "champ_prob": champ_prob,
            "final_prob": final_prob,
            "semi_prob": semi_prob
        })
    
    # 如果某些队伍没有在统计数据中，从配置中添加它们
    for team_name in team_scores.keys():
        if team_name not in [stat["team"] for stat in all_teams_stats]:
            all_teams_stats.append({
                "team": team_name,
                "initial_score": team_scores[team_name],
                "champ_prob": 0.0,
                "final_prob": 0.0,
                "semi_prob": 0.0
            })
    
    # 按夺冠概率排序
    all_teams_stats.sort(key=lambda x: x["champ_prob"], reverse=True)
    
    # 显示所有8支队伍的详细统计数据（8支参赛队伍）
    for i, stats in enumerate(all_teams_stats):
        if i >= 8:  # 只显示前8名（参赛队伍）
            break
        team_display = stats["team"][:20]  # 截断过长的队名
        print(f"{team_display:<20} {stats['initial_score']:<10} {stats['champ_prob']:.2%}   {stats['final_prob']:.2%}   {stats['semi_prob']:.2%}")
    
    print("\n" + "="*80)
    print("📊 夺冠概率前五名队伍")
    print("="*80)
    
    # 显示夺冠概率前5名
    for i, stats in enumerate(all_teams_stats[:5]):
        print(f"{i+1}. {stats['team']}: {stats['champ_prob']:.2%}")

    print(f"\n基于原始预测成功率: {playoff_prediction['based_on_success_rate']:.2%}")
    
    # 晋级路径预测
    print("\n" + "="*60)
    print("🛤️  预测晋级路径")
    print("="*60)
    
    # 上半区路径
    print(f"\n🔸 上半区:")
    qf1 = playoff_prediction["quarter_finals"][0]
    qf2 = playoff_prediction["quarter_finals"][1]
    sf1 = playoff_prediction["semi_finals"][0]
    
    print(f"  四分之一决赛:")
    print(f"    {qf1['match']}: {qf1['team1']} vs {qf1['team2']} → {qf1['predicted_winner']}")
    print(f"    {qf2['match']}: {qf2['team1']} vs {qf2['team2']} → {qf2['predicted_winner']}")
    
    print(f"  半决赛:")
    print(f"    {sf1['match']}: {sf1['team1']} vs {sf1['team2']} → {sf1['predicted_winner']}")
    
    # 下半区路径
    print(f"\n🔸 下半区:")
    qf3 = playoff_prediction["quarter_finals"][2]
    qf4 = playoff_prediction["quarter_finals"][3]
    sf2 = playoff_prediction["semi_finals"][1]
    
    print(f"  四分之一决赛:")
    print(f"    {qf3['match']}: {qf3['team1']} vs {qf3['team2']} → {qf3['predicted_winner']}")
    print(f"    {qf4['match']}: {qf4['team1']} vs {qf4['team2']} → {qf4['predicted_winner']}")
    
    print(f"  半决赛:")
    print(f"    {sf2['match']}: {sf2['team1']} vs {sf2['team2']} → {sf2['predicted_winner']}")
    
    # 冠军路径
    print(f"\n🏆 冠军之路:")
    final = playoff_prediction["final"]
    print(f"  决赛 ({final['format']}): {final['team1']} vs {final['team2']} → {final['predicted_winner']}")
    
    print(f"\n🎯 最终预测冠军: {playoff_prediction['final_champion']}")
    
    # 冠军完整路径
    print(f"\n🏅 {playoff_prediction['final_champion']} 晋级路径:")
    
    # 找出冠军的完整晋级路径
    champion_path = []
    champion = playoff_prediction['final_champion']
    
    # 四分之一决赛
    for i, qf in enumerate(playoff_prediction["quarter_finals"]):
        if qf['predicted_winner'] == champion:
            if i < 2:
                bracket = "上半区"
            else:
                bracket = "下半区"
            champion_path.append(f"  {bracket}QF{i%2+1}: 击败 {qf['team2'] if qf['team1'] == champion else qf['team1']}")
            break
    
    # 半决赛
    for sf in playoff_prediction["semi_finals"]:
        if sf['predicted_winner'] == champion:
            champion_path.append(f"  半决赛: 击败 {sf['team2'] if sf['team1'] == champion else sf['team1']}")
            break
    
    # 决赛
    final_match = playoff_prediction["final"]
    if final_match['predicted_winner'] == champion:
        champion_path.append(f"  决赛: 击败 {final_match['team2'] if final_match['team1'] == champion else final_match['team1']} (BO5)")
    
    for step in champion_path:
        print(step)

if __name__ == "__main__":
    main()