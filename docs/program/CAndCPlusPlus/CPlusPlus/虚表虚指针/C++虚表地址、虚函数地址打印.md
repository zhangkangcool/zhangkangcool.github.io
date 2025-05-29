

```c++
#include <iostream>
using namespace std;

class Base
{
public :
    int base_data;
    Base() { base_data = 1; }
    virtual void func1() { cout << "base_func1" << endl; }
    virtual void func2() { cout << "base_func2" << endl; }
    virtual void func3() { cout << "base_func3" << endl; }
};

class Derive : public Base
{
public :
    int derive_data;
    Derive() { derive_data = 2; }
    virtual void func1() { cout << "derive_func1" << endl; }
    virtual void func2() { cout << "derive_func2" << endl; }
};

typedef void (*func)();

int main()
{
    Base base;
    cout << "&base: " << &base << endl;
    cout << "&base.base_data: " << &base.base_data << endl;
    cout << "----------------------------------------" << endl;

    Derive derive;
    cout << "&derive: " << &derive << endl;
    cout << "&derive.base_data: " << &derive.base_data << endl;
    cout << "&derive.derive_data: " << &derive.derive_data << endl;
    cout << "----------------------------------------" << endl;

    for(int i=0; i<3; i++)
    {
        // &base : base首地址
        // (unsigned long*)&base : base的首地址，vptr的地址
        // (*(unsigned long*)&base) : vptr的内容，即vtable的地址，指向第一个虚函数的slot的地址
        // (unsigned long*)(*(unsigned long*)&base) : vtable的地址，指向第一个虚函数的slot的地址
        // vtbl : 指向虚函数slot的地址
        // *vtbl : 虚函数的地址
        unsigned long* vtbl = (unsigned long*)(*(unsigned long*)&base) + i;
        cout << "slot address: " << vtbl << endl;
        cout << "func address: 0x" << hex << *vtbl << endl;
        func pfunc = (func)*(vtbl);
        pfunc();
        cout << endl;
    }
    cout << "----------------------------------------" << endl;

    for(int i=0; i<3; i++)
    {
        unsigned long* vtbl = (unsigned long*)(*(unsigned long*)&derive) + i;
        cout << "slot address: " << vtbl << endl;
        cout << "func address: 0x" << hex << *vtbl << endl;
        func pfunc = (func)*(vtbl);
        pfunc();
        cout << endl;
    }
    cout << "----------------------------------------" << endl;
    return 1;
}
```



64位系统一个ptr占8个字节，vptr是在第一个位置，在数据成员之前的。



输出结果

```shell
&base: 0x3fffc82b6d80
&base.base_data: 0x3fffc82b6d88
----------------------------------------
&derive: 0x3fffc82b6d70
&derive.base_data: 0x3fffc82b6d78
&derive.derive_data: 0x3fffc82b6d7c
----------------------------------------
slot address: 0x1001fc78
func address: 0x10001170
base_func1

slot address: 0x1001fc80
func address: 0x100011e0
base_func2

slot address: 0x1001fc88
func address: 0x10001250
base_func3

----------------------------------------
slot address: 0x1001fcb0
func address: 0x100012c0
derive_func1

slot address: 0x1001fcb8
func address: 0x10001330
derive_func2

slot address: 0x1001fcc0
func address: 0x10001250
base_func3

----------------------------------------
```





`g++ -fdump-class-hierarchy test.cpp -c`

```shell
Vtable for Base
Base::_ZTV4Base: 5u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI4Base)
16    (int (*)(...))Base::func1
24    (int (*)(...))Base::func2
32    (int (*)(...))Base::func3

Class Base
   size=16 align=8
   base size=12 base align=8
Base (0x0x3fff78d28b80) 0
    vptr=((& Base::_ZTV4Base) + 16u)

Vtable for Derive
Derive::_ZTV6Derive: 5u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI6Derive)
16    (int (*)(...))Derive::func1
24    (int (*)(...))Derive::func2
32    (int (*)(...))Base::func3

Class Derive
   size=16 align=8
   base size=16 base align=8
Derive (0x0x3fff78d16c10) 0
    vptr=((& Derive::_ZTV6Derive) + 16u)
  Base (0x0x3fff78d28be0) 0
      primary-for Derive (0x0x3fff78d16c10)
```



行13，可以看到对虚指令的设置

```
vptr=((& Base::_ZTV4Base) + 16u)
```

