



## 1. 修改脚本

```diff
diff --git a/presubmit.sh b/presubmit.sh
index 4cef68e..1c0e3a4 100755
--- a/presubmit.sh
+++ b/presubmit.sh
@@ -3,9 +3,9 @@
 set -e
 
 export TOP=$(pwd)
-export DRIVER=/home/xsw/GPU_Src_drv
-export DRIVER_PATH=${DRIVER}/build/sdk/drivers
-export INCLUDE_PATH=${DRIVER}/build/sdk/include
+export DRIVER=/home/ken/workspace/pocl
+export DRIVER_PATH=${DRIVER}/install/lib
+export INCLUDE_PATH=${DRIVER}/include
 
 #TOOLCHAIN_URL_arm="https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/arm-linux-gnueabihf/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf.tar.xz"
 #TOOLCHAIN_URL_aarch64="https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz"
@@ -82,6 +82,6 @@ cmake -DCL_INCLUDE_DIR=$INCLUDE_PATH \
          -DCMAKE_BUILD_TYPE=debug \
          -DCLConform_GLES_LIBRARIES_DIR=$LD_LIBRARY_PATH \
       ..
-make -j8
+make -j8 --trace VERBOSE=2
 echo "DRIVER_PATH:$DRIVER_PATH"
 echo "INCLUDE_PATH:$INCLUDE_PATH"
diff --git a/test_conformance/CMakeLists.txt b/test_conformance/CMakeLists.txt
index a58bcc9..58c77d1 100644
--- a/test_conformance/CMakeLists.txt
+++ b/test_conformance/CMakeLists.txt
@@ -4,7 +4,7 @@ set( CLConf_Install_Base_Dir "${CMAKE_CURRENT_SOURCE_DIR}" )
 set(HARNESS_LIB harness)
 
 # add_subdirectory( allocations )
-# add_subdirectory( api )
+add_subdirectory( api )
 # add_subdirectory( atomics )
 # add_subdirectory( basic )
 # add_subdirectory( buffers )
@@ -54,7 +54,7 @@ set(HARNESS_LIB harness)
 #     add_subdirectory( clcpp )
 # endif()
 add_subdirectory( spirv_new )
-add_subdirectory( spir )
+#add_subdirectory( spir )
 
 file(GLOB CSV_FILES "opencl_conformance_tests_*.csv")
```



## 2. 编译

```shell
./presubmit.sh
```







## 3. 测试

#### 3.1 api测试

```shell
cd /home/ken/workspace/OpenCL-CTS-2021-03-25-00/build/test_conformance/api
./test_api
```





一个错误项，这里只列出了一个错误项，如果不编译`SPIRV-LLVM-Translator`的话，`clCreateProgramWithIL`也会错误。

```shell

The CL_KERNEL_MAX_SUB_GROUP_SIZE_FOR_NDRANGE for the kernel is 4096.
The CL_KERNEL_SUB_GROUP_COUNT_FOR_NDRANGE for the kernel is 1.
ERROR: Incorrect value returned for CL_KERNEL_LOCAL_SIZE_FOR_SUB_GROUP_COUNT!sub_group_dispatch FAILED                                                                                                             
clone_kernel...
clone_kernel passed
zero_sized_enqueue...
```



### 3.2 spirv测试

生成spv文件

```shell
# 不指定--output-dir则会在当前目录产生spirv_bin文件
cd /home/ken/workspace/OpenCL-CTS-2021-03-25-00
./test_conformance/spirv_new/assemble_spirv.py --source-dir test_conformance/spirv_new/spirv_asm --output-dir ./build/test_conformance/spirv_new/spirv_bin -v    
```



测试

```shell
cd ~/workspace/OpenCL-CTS-2021-03-25-00/build/test_conformance/spirv_new
./gen_log.sh
```



以下为测试结果，这里只列出了不支持项。

```
[ext_cl_khr_spirv_no_integer_wrap_decoration_fadd_int] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fsub_int] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fmul_int] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fshiftleft_int] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fnegate_int] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fadd_uint] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fsub_uint] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fmul_uint] 测试结果:指令不支持
[ext_cl_khr_spirv_no_integer_wrap_decoration_fshiftleft_uint] 测试结果:指令不支持 


passed: 198
notSupported: 9
FAILED: 0

```





以下为`gen_log.sh`的内容

```shell
#!/bin/bash

test_array=(
# 和扩展有关
ext_cl_khr_spirv_no_integer_wrap_decoration_fadd_int 
ext_cl_khr_spirv_no_integer_wrap_decoration_fsub_int 
ext_cl_khr_spirv_no_integer_wrap_decoration_fmul_int 
ext_cl_khr_spirv_no_integer_wrap_decoration_fshiftleft_int
ext_cl_khr_spirv_no_integer_wrap_decoration_fnegate_int
ext_cl_khr_spirv_no_integer_wrap_decoration_fadd_uint
ext_cl_khr_spirv_no_integer_wrap_decoration_fsub_uint
ext_cl_khr_spirv_no_integer_wrap_decoration_fmul_uint
ext_cl_khr_spirv_no_integer_wrap_decoration_fshiftleft_uint
# decorate指令
decorate_restrict
decorate_aliased
decorate_alignment
decorate_constant
decorate_saturated_conversion_char
decorate_saturated_conversion_uchar
decorate_saturated_conversion_short
decorate_saturated_conversion_ushort
decorate_saturated_conversion_int
decorate_saturated_conversion_uint
decorate_fp_rounding_mode_rte_float_int
decorate_fp_rounding_mode_rtz_float_int
decorate_fp_rounding_mode_rtp_float_int
decorate_fp_rounding_mode_rtn_float_int
decorate_fp_rounding_mode_rte_double_long
decorate_fp_rounding_mode_rtz_double_long
decorate_fp_rounding_mode_rtp_double_long
decorate_fp_rounding_mode_rtn_double_long
get_program_il
linkage_export_function_compile
linkage_import_function_compile
linkage_import_function_link
op_atomic_inc_global
op_atomic_dec_global
op_label_simple
op_branch_simple
op_unreachable_simple
op_branch_conditional
op_branch_conditional_weighted
op_composite_construct_int4
op_composite_construct_struct
op_constant_true_simple
op_constant_false_simple
op_constant_int_simple
op_constant_uint_simple
op_constant_char_simple
op_constant_uchar_simple
op_constant_ushort_simple
op_constant_long_simple
op_constant_ulong_simple
op_constant_short_simple
op_constant_float_simple
op_constant_double_simple
op_constant_int4_simple
op_constant_int3_simple
op_constant_struct_int_float_simple
op_constant_struct_int_char_simple
op_constant_struct_struct_simple
op_constant_half_simple
op_copy_int_simple
op_copy_uint_simple
op_copy_char_simple
op_copy_uchar_simple
op_copy_ushort_simple
op_copy_long_simple
op_copy_ulong_simple
op_copy_short_simple
op_copy_float_simple
op_copy_double_simple
op_copy_int4_simple
op_copy_int3_simple
op_copy_struct_int_float_simple
op_copy_struct_int_char_simple
op_copy_struct_struct_simple
op_copy_half_simple
op_fadd_float_regular
op_fsub_float_regular
op_fmul_float_regular
op_fdiv_float_regular
op_frem_float_regular
op_fmod_float_regular
op_fadd_float_fast
op_fsub_float_fast
op_fmul_float_fast
op_fdiv_float_fast
op_frem_float_fast
op_fmod_float_fast
op_fadd_double_regular
op_fsub_double_regular
op_fmul_double_regular
op_fdiv_double_regular
op_frem_double_regular
op_fmod_double_regular
op_fadd_double_fast
op_fsub_double_fast
op_fmul_double_fast
op_fdiv_double_fast
op_frem_double_fast
op_fmod_double_fast
op_fadd_float4_regular
op_fsub_float4_regular
op_fmul_float4_regular
op_fdiv_float4_regular
op_frem_float4_regular
op_fmod_float4_regular
op_fadd_float4_fast
op_fsub_float4_fast
op_fmul_float4_fast
op_fdiv_float4_fast
op_frem_float4_fast
op_fmod_float4_fast
op_fadd_double2_regular
op_fsub_double2_regular
op_fmul_double2_regular
op_fdiv_double2_regular
op_frem_double2_regular
op_fmod_double2_regular
op_fadd_double2_fast
op_fsub_double2_fast
op_fmul_double2_fast
op_fdiv_double2_fast
op_frem_double2_fast
op_fmod_double2_fast
op_fadd_half_regular
op_fsub_half_regular
op_fmul_half_regular
op_fdiv_half_regular
op_frem_half_regular
op_fmod_half_regular
op_fadd_half_fast
op_fsub_half_fast
op_fmul_half_fast
op_fdiv_half_fast
op_frem_half_fast
op_fmod_half_fast
function_none
function_inline
function_noinline
function_pure
function_const
function_pure_ptr
op_lifetime_simple
op_loop_merge_branch_none
op_loop_merge_branch_unroll
op_loop_merge_branch_dont_unroll
op_loop_merge_branch_conditional_none
op_loop_merge_branch_conditional_unroll
op_loop_merge_branch_conditional_dont_unroll
op_neg_float
op_neg_double
op_neg_int
op_neg_long
op_not_int
op_not_long
op_neg_short
op_not_short
op_neg_float4
op_neg_int4
op_not_int4
op_type_opaque_simple
op_phi_2_blocks
op_phi_3_blocks
op_phi_4_blocks
op_selection_merge_if_none
op_selection_merge_if_flatten
op_selection_merge_if_dont_flatten
op_selection_merge_swith_none
op_selection_merge_swith_flatten
op_selection_merge_swith_dont_flatten
op_spec_constant_uint_simple
op_spec_constant_uchar_simple
op_spec_constant_ushort_simple
op_spec_constant_ulong_simple
op_spec_constant_float_simple
op_spec_constant_half_simple
op_spec_constant_double_simple
op_spec_constant_true_simple
op_spec_constant_false_simple
op_undef_true_simple
op_undef_false_simple
op_undef_int_simple
op_undef_uint_simple
op_undef_char_simple
op_undef_uchar_simple
op_undef_ushort_simple
op_undef_long_simple
op_undef_ulong_simple
op_undef_short_simple
op_undef_float_simple
op_undef_double_simple
op_undef_int4_simple
op_undef_int3_simple
op_undef_struct_int_float_simple
op_undef_struct_int_char_simple
op_undef_struct_struct_simple
op_undef_half_simple
op_vector_int4_extract
op_vector_float4_extract
op_vector_long2_extract
op_vector_double2_extract
op_vector_char16_extract
op_vector_int4_insert
op_vector_float4_insert
op_vector_long2_insert
op_vector_double2_insert
op_vector_char16_insert
op_vector_times_scalar_float
op_vector_times_scalar_double
)

# 删除原来的文件
rm gen_log.txt
rm -r log
mkdir log

# Used for Compiler_6434
# export LD_LIBRARY_PATH=/home/wzh/Compiler_6434/build/sdk/drivers
# export VC_OPTION=-DUMP:ALL

# Used for pocl
export LD_LIBRARY_PATH=/home/ken/workspace/pocl/install/lib

total=207
passed=0
notSupported=0
FAILED=0

echo "生成 log..." | tee gen_log.txt
for item in "${test_array[@]}"
do
	echo -n "[$item] 测试结果:" | tee -a gen_log.txt

	./test_spirv_new $item > log/$item.txt 2>&1
	
	prefix=""

	if grep -q "not supported;" log/$item.txt; 
	then
		((notSupported++))
		echo -n "指令不支持 " | tee -a gen_log.txt
		prefix+="[notSupported]"
	fi
	
	if grep -q "PASSED test." log/$item.txt && ! grep -q "not supported;" log/$item.txt; 
	then
		((passed++))
		echo -n "PASSED " | tee -a gen_log.txt
		prefix+="[PASSED]"
	fi
	
	if grep -q "FAILED test." log/$item.txt && ! grep -q "not supported;" log/$item.txt; 
	then
		((FAILED++))
		echo -n "!!! FAILED !!!" | tee -a gen_log.txt
		prefix+="[FAILED]"
	fi
	
	# 如果上面的情况都没有命中，也视为失败
	if [ "$prefix" == "" ];
	then
		((FAILED++))
		echo -n "!!! FAILED (may segment fault) !!!" | tee -a gen_log.txt
		prefix+="[FAILED]"
	fi
	
	# 重命名log
	mv log/$item.txt log/$prefix$item.txt
	# 换行
	echo  " " | tee -a gen_log.txt
done

echo "passed: $passed" | tee -a gen_log.txt
echo "notSupported: $notSupported" | tee -a gen_log.txt
echo "FAILED: $FAILED" | tee -a gen_log.txt
```







