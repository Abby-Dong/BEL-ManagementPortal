#!/usr/bin/env python3
import json

def compact_monthly_data():
    """將monthlyData格式化為更緊湊的形式，每個月一行"""
    
    # 讀取原始數據
    with open('data/belProfiles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("🔄 正在重新格式化monthlyData...")
    
    # 計算原始行數
    original_json = json.dumps(data, indent=2, ensure_ascii=False)
    original_lines = len(original_json.split('\n'))
    
    # 重新格式化JSON，使用自定義縮進
    def format_json_compact(obj, indent=0):
        """自定義JSON格式化函數，將monthlyData壓縮"""
        spaces = '  ' * indent
        
        if isinstance(obj, dict):
            if all(isinstance(v, dict) and 
                   set(v.keys()) == {'clicks', 'orders', 'revenue', 'c2oCvr'} 
                   for v in obj.values() if isinstance(v, dict)):
                # 這是monthlyData的月份層級，使用緊湊格式
                lines = ['{']
                for key, value in obj.items():
                    if isinstance(value, dict) and set(value.keys()) == {'clicks', 'orders', 'revenue', 'c2oCvr'}:
                        # 單行格式化月份數據
                        compact_line = f'    "{key}": {{"clicks": {value["clicks"]}, "orders": {value["orders"]}, "revenue": {value["revenue"]}, "c2oCvr": {value["c2oCvr"]}}}'
                        lines.append(compact_line + (',' if key != list(obj.keys())[-1] else ''))
                    else:
                        # 正常格式化其他數據
                        lines.append(f'    "{key}": {format_json_compact(value, indent + 2)},')
                lines.append('  }')
                return '\n'.join(lines)
            else:
                # 正常字典格式化
                if not obj:
                    return '{}'
                lines = ['{']
                items = list(obj.items())
                for i, (key, value) in enumerate(items):
                    comma = ',' if i < len(items) - 1 else ''
                    if isinstance(value, (dict, list)):
                        lines.append(f'{spaces}  "{key}": {format_json_compact(value, indent + 1)}{comma}')
                    else:
                        lines.append(f'{spaces}  "{key}": {json.dumps(value, ensure_ascii=False)}{comma}')
                lines.append(f'{spaces}}}')
                return '\n'.join(lines)
        
        elif isinstance(obj, list):
            if not obj:
                return '[]'
            lines = ['[']
            for i, item in enumerate(obj):
                comma = ',' if i < len(obj) - 1 else ''
                lines.append(f'{spaces}  {format_json_compact(item, indent + 1)}{comma}')
            lines.append(f'{spaces}]')
            return '\n'.join(lines)
        
        else:
            return json.dumps(obj, ensure_ascii=False)
    
    # 格式化並寫入文件
    formatted_json = format_json_compact(data)
    
    with open('data/belProfiles.json', 'w', encoding='utf-8') as f:
        f.write(formatted_json)
    
    # 計算新的行數
    new_lines = len(formatted_json.split('\n'))
    saved_lines = original_lines - new_lines
    
    print(f"✅ 格式化完成!")
    print(f"📊 原始行數: {original_lines:,}")
    print(f"📊 新的行數: {new_lines:,}")
    print(f"🎯 節省行數: {saved_lines:,} ({saved_lines/original_lines*100:.1f}%)")

if __name__ == "__main__":
    compact_monthly_data()
