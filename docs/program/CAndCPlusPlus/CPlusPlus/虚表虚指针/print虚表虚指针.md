https://www.zhihu.com/question/389546003/answer/1194780618

https://blog.csdn.net/Poo_Chai/article/details/100316040

https://www.cnblogs.com/biterror/p/7053347.html

https://www.cnblogs.com/malecrab/p/5573368.html

用clang进行dump有两个条件：

```
1. 加上 -emit-llvm   // 测试后该选项可省
2. class必须被使用   
```

```shell
clang++ -Xclang -fdump-record-layouts  test.cpp
clang++ -Xclang -fdump-vtable-layouts  test.cpp



// 下面的方法不推荐，可能会有头文件Not found的错误
// 下面的网页中所使用的方法
// https://eli.thegreenplace.net/2012/12/17/dumping-a-c-objects-memory-layout-with-clang/
clang -cc1 -fdump-vtable-layouts -stdlib=libc++ actress.cpp
clang -cc1 -fdump-record-layouts -stdlib=libc++ actress.cpp
```





```c++
#include <stdio.h>

class Actress {
public:
    Actress(int h, int w, int a):height(h),weight(w),age(a){};

    virtual void desc() {
        printf("height:%d weight:%d age:%d\n", height, weight, age);
    }

    virtual void name() {
        printf("I'm a actress");
    }

    int height; // 身高
    int weight; // 体重
    int age;    // 年龄（注意，这不是数据库，不必一定存储生日）
};

class Sensei: public Actress {
public:
    Sensei(int h, int w, int a, const char* c):Actress(h, w, a){
        snprintf(cup, sizeof(cup), "%s", c);
    };
    virtual void desc() {
        printf("height:%d weight:%d age:%d cup:%s\n", height, weight, age, cup);
    }
    virtual void name() {
        printf("I'm a sensei");
    }
    char cup[4];

};

int main() {
    Sensei s(168, 50, 20, "36D");
    s.desc();

    Actress* a = &s;
    a->desc();

    Actress& a2 = s;
    a2.desc();
    return 0;
}

```



`clang++ -Xclang -fdump-vtable-layouts  test.cpp`

```shell
*** Dumping AST Record Layout
         0 | class Actress
         0 |   (Actress vtable pointer)
         8 |   int height
        12 |   int weight
        16 |   int age
           | [sizeof=24, dsize=20, align=8,
           |  nvsize=20, nvalign=8]

*** Dumping AST Record Layout
         0 | class Sensei
         0 |   class Actress (primary base)
         0 |     (Actress vtable pointer)
         8 |     int height
        12 |     int weight
        16 |     int age
        20 |   char [4] cup
           | [sizeof=24, dsize=24, align=8,
           |  nvsize=24, nvalign=8]
```



`clang++ -Xclang -fdump-record-layouts  test.cpp`

```shell
Vtable for 'Actress' (4 entries).
   0 | offset_to_top (0)
   1 | Actress RTTI
       -- (Actress, 0) vtable address --
   2 | void Actress::desc()
   3 | void Actress::name()

VTable indices for 'Actress' (2 entries).
   0 | void Actress::desc()
   1 | void Actress::name()

Vtable for 'Sensei' (4 entries).
   0 | offset_to_top (0)
   1 | Sensei RTTI
       -- (Actress, 0) vtable address --
       -- (Sensei, 0) vtable address --
   2 | void Sensei::desc()
   3 | void Sensei::name()

VTable indices for 'Sensei' (2 entries).
   0 | void Sensei::desc()
   1 | void Sensei::name()
```





```shell
g++ -fdump-class-hierarchy actress.cpp
cat main.cpp.002t.class
```

```shell
Vtable for Actress
Actress::_ZTV7Actress: 4u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI7Actress)
16    (int (*)(...))Actress::desc
24    (int (*)(...))Actress::name

Class Actress
   size=24 align=8
   base size=20 base align=8
Actress (0x0x7f9b1fa8c960) 0
    vptr=((& Actress::_ZTV7Actress) + 16u)

Vtable for Sensei
Sensei::_ZTV6Sensei: 4u entries
0     (int (*)(...))0
8     (int (*)(...))(& _ZTI6Sensei)
16    (int (*)(...))Sensei::desc
24    (int (*)(...))Sensei::name

Class Sensei
   size=24 align=8
   base size=24 base align=8
Sensei (0x0x7f9b1fa81138) 0
    vptr=((& Sensei::_ZTV6Sensei) + 16u)
  Actress (0x0x7f9b1fa8c9c0) 0
      primary-for Sensei (0x0x7f9b1fa81138)
```



![img](https://pic1.zhimg.com/80/v2-dd07c41d30e7e32f8dcb80ef55b5787a_1440w.jpg?source=1940ef5c)





## empty case

```c++
class Test {

};
Test test;
```

### clang

```shell
*** Dumping AST Record Layout
         0 | class Test (empty)
           | [sizeof=1, dsize=1, align=1,
           |  nvsize=1, nvalign=1]

*** Dumping IRgen Record Layout
Record: CXXRecordDecl 0x10014f79a80 <empty.cpp:1:1, line:3:1> line:1:7 referenced class Test definition
|-DefinitionData pass_in_registers empty aggregate standard_layout trivially_copyable pod trivial literal has_constexpr_non_copy_move_ctor can_const_default_init
| |-DefaultConstructor exists trivial constexpr defaulted_is_constexpr
| |-CopyConstructor simple trivial has_const_param implicit_has_const_param
| |-MoveConstructor exists simple trivial
| |-CopyAssignment simple trivial has_const_param needs_implicit implicit_has_const_param
| |-MoveAssignment exists simple trivial needs_implicit
| `-Destructor simple irrelevant trivial needs_implicit
|-CXXRecordDecl 0x10014f79ba0 <col:1, col:7> col:7 implicit class Test
|-CXXConstructorDecl 0x10014fcb808 <col:7> col:7 implicit used constexpr Test 'void () noexcept' inline default trivial
| `-CompoundStmt 0x10014fcbcf0 <col:7>
|-CXXConstructorDecl 0x10014fcb950 <col:7> col:7 implicit constexpr Test 'void (const Test &)' inline default trivial noexcept-unevaluated 0x10014fcb950
| `-ParmVarDecl 0x10014fcba80 <col:7> col:7 'const Test &'
`-CXXConstructorDecl 0x10014fcbb20 <col:7> col:7 implicit constexpr Test 'void (Test &&)' inline default trivial noexcept-unevaluated 0x10014fcbb20
  `-ParmVarDecl 0x10014fcbc50 <col:7> col:7 'Test &&'

Layout: <CGRecordLayout
  LLVMType:%class.Test = type { i8 }
  NonVirtualBaseLLVMType:%class.Test = type { i8 }
  IsZeroInitializable:1
  BitFields:[
]>
```



```shell
clang -cc1 -fdump-vtable-layouts test.cpp -emit-llvm   # no virtual func, get nothing
```





### gcc

`g++ -fdump-class-hierarchy empty.cpp  -c`

```shell
cat empty.cpp.002t.class
Class Test
   size=1 align=1
   base size=0 base align=1
Test (0x0x3fff9ddf04e0) 0 empty

```



https://www.cnblogs.com/malecrab/p/5573368.html (有多继承等)

```
“offset to top”是指到对象起始地址的偏移值，只有多重继承的情形才有可能不为0，单继承或无继承的情形都为0。
“RTTI information”是一个对象指针，它用于唯一地标识该类型。（注：本系列博文后续会有详细讨论。）
“virtual function pointers”也就是我们之前理解的虚函数表，其中存放着虚函数指针列表。
```

