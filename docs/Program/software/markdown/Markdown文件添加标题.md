<h1 align="center">Markdown文件添加标题</h1>





```python
import os
import sys
from pathlib import Path

def add_title_to_markdown(file_path: Path) -> None:
    """为单个Markdown文件添加标题"""
    try:
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取文件名（不含扩展名）
        title = file_path.stem
        
        # 检查是否已存在标题
        if content.startswith('# ') or content.startswith('<h1 align="center">'):
            existing_title = content.split('\n', 1)[0]
            if existing_title.startswith('# '):
                existing_title = existing_title.lstrip('# ').strip()
            else:
                # 提取HTML标题内容
                existing_title = existing_title.replace('<h1 align="center">', '').replace('</h1>', '').strip()
            
            if existing_title == title:
                print(f"跳过已正确设置标题的文件: {file_path}")
                return
            else:
                print(f"警告: {file_path} 已有不同的标题: {existing_title}")
                # 可选: 取消下面的注释以覆盖现有标题
                # content = content.split('\n', 1)[1] if len(content.split('\n')) > 1 else ''
        
        # 使用HTML格式添加居中标题
        new_title = f'<h1 align="center">{title}</h1>'
        new_content = f"{new_title}\n{content}"
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"成功添加居中标题到: {file_path}")
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")

def process_directory(directory: Path) -> None:
    """递归处理目录下的所有Markdown文件"""
    if not directory.is_dir():
        print(f"错误: 指定的路径不是目录 - {directory}")
        return
    
    # 处理当前目录下的所有.md文件
    md_files = directory.glob('*.md')
    for file in md_files:
        add_title_to_markdown(file)
    
    # 递归处理所有子目录
    subdirectories = [d for d in directory.iterdir() if d.is_dir()]
    for subdir in subdirectories:
        process_directory(subdir)

if __name__ == "__main__":
    # 获取命令行参数或使用当前目录
    target_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    
    print(f"开始处理目录: {target_dir}")
    process_directory(target_dir)
    print("处理完成!")    %                                          
```

