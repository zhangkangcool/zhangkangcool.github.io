







```shell
python3 ./fork.py --order 从上一个优化开始
python3 ./fork.py         每次都从input.ll开始
python3 ./fork.py  myinput.ll  
```



```python
#/usr/bin/env python3
# pass请修改pass_list

import subprocess
import os
import argparse
import tempfile

# 检查工具是否可用
def check_tool_available(tool_name):
    try:
        subprocess.run([tool_name, "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except subprocess.CalledProcessError:
        raise RuntimeError(f"{tool_name} not found. Please ensure LLVM is installed and {tool_name} is in your PATH.")

# 运行 opt 并返回输出文件路径
def run_opt_pass(input_file, pass_name):
    output_file = "output_" + pass_name + ".ll"

    # 构建并运行 opt 命令
    cmd = ["opt", "-S", f"-{pass_name}", input_file, "-o", output_file]
    print(f"Running opt command: {' '.join(cmd)}")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    if result.returncode != 0:
        print(f"Error running pass {pass_name}: {result.stderr}")
        os.remove(output_file)
        return None
    
    return output_file

# 使用 llvm-diff 比较两个 IR 文件
def compare_ir_with_llvm_diff(file1, file2):
    cmd = ["llvm-diff", file1, file2]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # llvm-diff 返回 0 表示文件相同，非 0 表示有差异
    return result.returncode == 0

# 主函数：分析哪些 Pass 起作用
# order 表面是依次执行，还是每次的输入都是Input.ll
def analyze_passes(input_file, pass_list, order):
    effective_passes = []
    ineffective_passes = []
    
    # 逐个运行 Pass 并检查效果
    for pass_name in pass_list:
        print(f"\nAnalyzing pass: {pass_name}")
        output_file = run_opt_pass(input_file, pass_name)
        
        if output_file is None:
            print(f"Skipping {pass_name} due to execution error.")
            ineffective_passes.append(pass_name)
            continue
        
        # 使用 llvm-diff 比较
        is_identical = compare_ir_with_llvm_diff(input_file, output_file)
        
        if is_identical:
            ineffective_passes.append(pass_name)
            print(f"Pass {pass_name} had no effect (IR unchanged).")
        else:
            effective_passes.append(pass_name)
            print(f"Pass {pass_name} modified the IR.")
        
        # 删除临时文件
        # os.remove(output_file)
        if (order):
            input_file = output_file
    
    return effective_passes, ineffective_passes

# 打印结果
def print_results(effective_passes, ineffective_passes):
    print("\n=== Results ===")
    print("Passes that had an effect:")
    for p in effective_passes:
        print(f"  - {p}")
    print("Passes that had no effect:")
    for p in ineffective_passes:
        print(f"  - {p}")

# 命令行参数解析
def main():
    parser = argparse.ArgumentParser(description="Analyze which LLVM passes affect a given .ll file using llvm-diff.")
    parser.add_argument("input_file", nargs = '?', help="Path to the input .ll file", default = "input.ll")
    parser.add_argument("--order", action="store_true", help="Order execute the arg passes, default is false")
    args = parser.parse_args()

    input_file = args.input_file
    order = args.order

    pass_list = ["bdce", "dce", "inline", "simplifycfg"]
    print(f"pass_list: {pass_list}")

    # 验证输入文件是否存在
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        return
    
    # 检查 opt 和 llvm-diff 工具
    check_tool_available("opt")
    check_tool_available("llvm-diff")

    # 分析 Pass
    effective_passes, ineffective_passes = analyze_passes(input_file, pass_list, order)
    
    # 输出结果
    print_results(effective_passes, ineffective_passes)

if __name__ == "__main__":
    main()

```

