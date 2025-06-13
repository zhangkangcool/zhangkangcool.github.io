<h1 align="center">JAX安装</h1>




# 以下是pip3安装方式

最好先弄个虚拟环境

```asm
pip3 install jax -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host https://pypi.tuna.tsinghua.edu.cn

pip3 install jaxlib -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host https://pypi.tuna.tsinghua.edu.cn
```





# 以下是源码安装方式

https://jax.readthedocs.io/en/latest/developer.html#building-from-source



```asm
python3 build/build.py --bazel_options=--override_repository=org_tensorflow=/home/ken/workspace/tensorflow/tensorflow
这样不用编译时下载tensorflow

Bazel binary path: /usr/local/bin/bazel
Bazel version: 5.1.1
Python binary path: /usr/bin/python3
Python version: 3.7
NumPy version: 1.21.6
MKL-DNN enabled: yes
Target CPU: x86_64
Target CPU features: release
CUDA enabled: no
TPU enabled: no
Remote TPU enabled: no
ROCm enabled: no
```



```asm
pip3 install pybind11
pip3 install ducc0
```





```python
 python3 build/build.py --bazel_options="--override_repository=org_tensorflow=/home/ken/workspace/tensorflow/tensorflow --override_repository=bazel_skylib=/home/ken/workspace/jax_dep/bazel-skylib-1.2.1 --override_repository=local_config_cuda=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_cuda --override_repository=local_config_tensorrt=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_tensorrt --override_repository=local_config_rocm=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_rocm --override_repository=local_config_remote_execution=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_remote_execution --override_repository=com_github_grpc_grpc=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_github_grpc_grpc --override_repository=com_google_protobuf=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_google_protobuf"

```



```python
python3 build/build.py --bazel_options="--override_repository=bazel_skylib=/home/ken/workspace/jax_dep/bazel-skylib-1.2.1 --override_repository=local_config_cuda=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_cuda --override_repository=local_config_tensorrt=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_tensorrt --override_repository=local_config_rocm=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_rocm --override_repository=local_config_remote_execution=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_remote_execution --override_repository=com_github_grpc_grpc=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_github_grpc_grpc --override_repository=com_google_protobuf=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_google_protobuf --override_repository=flatbuffers=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/flatbuffers --override_repository=build_bazel_rules_android=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/build_bazel_rules_android --override_repository=absl_py=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/absl_py --override_repository=llvm-project=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/llvm-project --override_repository=pybind11=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/pybind11 --override_repository=six_archive=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/six_archive --override_repository=local_config_python=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_python --override_repository=com_google_absl=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_google_absl"

```



```c++
 python3 build/build.py --bazel_options="--override_repository=bazel_skylib=/home/ken/workspace/jax_dep/bazel-skylib-1.2.1 --override_repository=local_config_cuda=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_cuda --override_repository=local_config_tensorrt=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_tensorrt --override_repository=local_config_rocm=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_rocm --override_repository=local_config_remote_execution=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_remote_execution --override_repository=com_github_grpc_grpc=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_github_grpc_grpc --override_repository=com_google_protobuf=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_google_protobuf --override_repository=flatbuffers=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/flatbuffers --override_repository=build_bazel_rules_android=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/build_bazel_rules_android --override_repository=absl_py=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/absl_py --override_repository=llvm-project=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/llvm-project --override_repository=pybind11=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/pybind11 --override_repository=six_archive=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/six_archive --override_repository=local_config_python=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/local_config_python --override_repository=com_google_absl=/home/ken/.cache/bazel/_bazel_ken/7958fc4ffdc3fda57f47c66f5611f525/external/com_google_absl --override_repository=ducc=/home/ken/workspace/jax_dep/ducc-356d619a4b5f6f8940d15913c14a043355ef23be"
```





```asm
https://storage.googleapis.com/mirror.tensorflow.org/github.com/llvm/llvm-project/archive/0538e5431afdb1fa05bdcedf70ee502ccfcd112a.tar.gz
```

