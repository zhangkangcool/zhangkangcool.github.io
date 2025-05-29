# 1. c++filt
In the disassembly file, you can see below instruction:
```
75c:   01 00 00 48     bl      75c <_ZSt16__once_call_implISt12_Bind_simpleIFSt7_Mem_fnIMNSt13__future_base11_State_baseEFvRSt8functionIFSt10unique_ptrINS2_12_Result_baseENS6_8_DeleterEEvEERbEEPS3_St17reference_wrapperISA_ESH_IbEEEEvv+0x6c>
```
Now, you want to know the jump function.
You can use c++filt like below:
```
c++filt _ZSt16__once_call_implISt12_Bind_simpleIFSt7_Mem_fnIMNSt13__future_base11_State_baseEFvRSt8functionIFSt10unique_ptrINS2_12_Result_baseENS6_8_DeleterEEvEERbEEPS3_St17reference_wrapperISA_ESH_IbEEEEvv
```

You will get below result:
```
void std::__once_call_impl<std::_Bind_simple<std::_Mem_fn<void (std::__future_base::_State_base::*)(std::function<std::unique_ptr<std::__future_base::_Result_base, std::__future_base::_Result_base::_Deleter> ()>&, bool&)> (std::__future_base::_State_base*, std::reference_wrapper<std::function<std::unique_ptr<std::__future_base::_Result_base, std::__future_base::_Result_base::_Deleter> ()> >, std::reference_wrapper<bool>)> >()
```

If you have the assembly file, you can use below command:
```
cat a.0-wcode.s |c++filt >ab.s
```

