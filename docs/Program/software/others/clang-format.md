<h1 align="center">clang-format</h1>
# Clang-Format格式化选项介绍

https://blog.csdn.net/softimite_zifeng/article/details/78357898 

http://clang.llvm.org/docs/ClangFormatStyleOptions.html

Clang-format tool is in `~/llvm/build/bin/clang-format`.

需要在`clang/tools/CMakeLists.txt`中开启clang-format，该tool需要依赖libclangTooling和libclangFormat。





Clang-Format可用于格式化（排版）多种不同语言的代码，其自带的排版格式主要有：LLVM, Google, Chromium, Mozilla, WebKit。

```shell
USAGE: clang-format [options] [<file> ...]

OPTIONS:

Clang-format options:

  -assume-filename=<string> - When reading from stdin, clang-format assumes this
                              filename to look for a style config file (with
                              -style=file) and to determine the language.
  -cursor=<uint>            - The position of the cursor when invoking
                              clang-format from an editor integration
  -dump-config              - Dump configuration options to stdout and exit.
                              Can be used with -style option.
  -fallback-style=<string>  - The name of the predefined style used as a
                              fallback in case clang-format is invoked with
                              -style=file, but can not find the .clang-format
                              file to use.
                              Use -fallback-style=none to skip formatting.
  -i                        - Inplace edit <file>s, if specified.
  -length=<uint>            - Format a range of this length (in bytes).
                              Multiple ranges can be formatted by specifying
                              several -offset and -length pairs.
                              When only a single -offset is specified without
                              -length, clang-format will format up to the end
                              of the file.
                              Can only be used with one input file.
  -lines=<string>           - <start line>:<end line> - format a range of
                              lines (both 1-based).
                              Multiple ranges can be formatted by specifying
                              several -lines arguments.
                              Can't be used with -offset and -length.
                              Can only be used with one input file.
  -offset=<uint>            - Format a range starting at this byte offset.
                              Multiple ranges can be formatted by specifying
                              several -offset and -length pairs.
                              Can only be used with one input file.
  -output-replacements-xml  - Output replacements as XML.
  -sort-includes            - If set, overrides the include sorting behavior determined by the SortIncludes style flag
  -style=<string>           - Coding style, currently supports:
                                LLVM, Google, Chromium, Mozilla, WebKit.
                              Use -style=file to load style configuration from
                              .clang-format file located in one of the parent
                              directories of the source file (or current
                              directory for stdin).
                              Use -style="{key: value, ...}" to set specific
                              parameters, e.g.:
                                -style="{BasedOnStyle: llvm, IndentWidth: 8}"
  -verbose                  - If set, shows the list of processed files

Generic Options:

  -help                     - Display available options (-help-hidden for more)
  -help-list                - Display list of available options (-help-list-hidden for more)
  -version                  - Display the version of this program
```



### 导出和自定义配置文件

文件名可以取任何名字，一般取`.clang-format`或`_clang-format`，因为自定义的排版格式文件只有取这两种名字之一，才能被`clang-format`识别。如果你取了其它的名字，你需要使用` -assume-filename=<string>`选项。

```shell
clang-format -style=LLVM -dump-config > .clang-format
```

直接将修改后的文件放在和代码文件相同的文件夹中，并且设置格式化选项-style=file，即可以使用自定义的排版格式。

 格式名的取值可以为llvm, google, chromium, mozilla, webkit中的任一种；

_注意，文件名必须为`.clang-format`或`_clang-format`。

 

### Options

默认的`style`是`LLVM`。

#### -i Option

默认修改名字后输出到`stdin`，你可以使用`-i`直接对原始文件进行修改，不输出到`stdin`。



#### -verbose option

`-verbose` will output which file is been modified.

```shell
clang-format -i -verbose test.c
```









### An example for the config file

```shell
---
# 语言: None, Cpp, Java, JavaScript, ObjC, Proto, TableGen, TextProto
Language:	Cpp
# BasedOnStyle:	LLVM
# 访问说明符(public、private等)的偏移
AccessModifierOffset:	-4
# 开括号(开圆括号、开尖括号、开方括号)后的对齐: Align, DontAlign, AlwaysBreak(总是在开括号后换行)
AlignAfterOpenBracket:	Align
# 连续赋值时，对齐所有等号
AlignConsecutiveAssignments:	true
# 连续声明时，对齐所有声明的变量名
AlignConsecutiveDeclarations:	true
# 左对齐逃脱换行(使用反斜杠换行)的反斜杠
AlignEscapedNewlinesLeft:	true
# 水平对齐二元和三元表达式的操作数
AlignOperands:	true
# 对齐连续的尾随的注释
AlignTrailingComments:	true
# 允许函数声明的所有参数在放在下一行
AllowAllParametersOfDeclarationOnNextLine:	true
# 允许短的块放在同一行
AllowShortBlocksOnASingleLine:	false
# 允许短的case标签放在同一行
AllowShortCaseLabelsOnASingleLine:	false
# 允许短的函数放在同一行: None, InlineOnly(定义在类中), Empty(空函数), Inline(定义在类中，空函数), All
AllowShortFunctionsOnASingleLine:	Empty
# 允许短的if语句保持在同一行
AllowShortIfStatementsOnASingleLine:	false
# 允许短的循环保持在同一行
AllowShortLoopsOnASingleLine:	false
# 总是在定义返回类型后换行(deprecated)
AlwaysBreakAfterDefinitionReturnType:	None
# 总是在返回类型后换行: None, All, TopLevel(顶级函数，不包括在类中的函数), 
#   AllDefinitions(所有的定义，不包括声明), TopLevelDefinitions(所有的顶级函数的定义)
AlwaysBreakAfterReturnType:	None
# 总是在多行string字面量前换行
AlwaysBreakBeforeMultilineStrings:	false
# 总是在template声明后换行
AlwaysBreakTemplateDeclarations:	false
# false表示函数实参要么都在同一行，要么都各自一行
BinPackArguments:	true
# false表示所有形参要么都在同一行，要么都各自一行
BinPackParameters:	true
# 大括号换行，只有当BreakBeforeBraces设置为Custom时才有效
BraceWrapping:   
  # class定义后面
  AfterClass:	false
  # 控制语句后面
  AfterControlStatement:	false
  # enum定义后面
  AfterEnum:	false
  # 函数定义后面
  AfterFunction:	false
  # 命名空间定义后面
  AfterNamespace:	false
  # ObjC定义后面
  AfterObjCDeclaration:	false
  # struct定义后面
  AfterStruct:	false
  # union定义后面
  AfterUnion:	false
  # catch之前
  BeforeCatch:	true
  # else之前
  BeforeElse:	true
  # 缩进大括号
  IndentBraces:	false
# 在二元运算符前换行: None(在操作符后换行), NonAssignment(在非赋值的操作符前换行), All(在操作符前换行)
BreakBeforeBinaryOperators:	NonAssignment
# 在大括号前换行: Attach(始终将大括号附加到周围的上下文), Linux(除函数、命名空间和类定义，与Attach类似), 
#   Mozilla(除枚举、函数、记录定义，与Attach类似), Stroustrup(除函数定义、catch、else，与Attach类似), 
#   Allman(总是在大括号前换行), GNU(总是在大括号前换行，并对于控制语句的大括号增加额外的缩进), WebKit(在函数前换行), Custom
#   注：这里认为语句块也属于函数
BreakBeforeBraces:	Custom
# 在三元运算符前换行
BreakBeforeTernaryOperators:	true
# 在构造函数的初始化列表的逗号前换行
BreakConstructorInitializersBeforeComma:	false
# 每行字符的限制，0表示没有限制
ColumnLimit:	80
# 描述具有特殊意义的注释的正则表达式，它不应该被分割为多行或以其它方式改变
CommentPragmas:	'^ IWYU pragma:'
# 构造函数的初始化列表要么都在同一行，要么都各自一行
ConstructorInitializerAllOnOneLineOrOnePerLine:	false
# 构造函数的初始化列表的缩进宽度
ConstructorInitializerIndentWidth:	4
# 延续的行的缩进宽度
ContinuationIndentWidth:	4
# 去除C++11的列表初始化的大括号{后和}前的空格
Cpp11BracedListStyle:	false
# 继承最常用的指针和引用的对齐方式
DerivePointerAlignment:	false
# 关闭格式化
DisableFormat:	false
# 自动检测函数的调用和定义是否被格式为每行一个参数(Experimental)
ExperimentalAutoDetectBinPacking:	false
# 需要被解读为foreach循环而不是函数调用的宏
ForEachMacros:	[ foreach, Q_FOREACH, BOOST_FOREACH ]
# 对#include进行排序，匹配了某正则表达式的#include拥有对应的优先级，匹配不到的则默认优先级为INT_MAX(优先级越小排序越靠前)，
#   可以定义负数优先级从而保证某些#include永远在最前面
IncludeCategories: 
  - Regex:	'^"(llvm|llvm-c|clang|clang-c)/'
    Priority:	2
  - Regex:	'^(<|"(gtest|isl|json)/)'
    Priority:	3
  - Regex:	'.*'
    Priority:	1
# 缩进case标签
IndentCaseLabels:	true     # 默认是false
# 缩进宽度
IndentWidth:	4
# 函数返回类型换行时，缩进函数声明或函数定义的函数名
IndentWrappedFunctionNames:	false
# 保留在块开始处的空行
KeepEmptyLinesAtTheStartOfBlocks:	true
# 开始一个块的宏的正则表达式
MacroBlockBegin:	''
# 结束一个块的宏的正则表达式
MacroBlockEnd:	''
# 连续空行的最大数量
MaxEmptyLinesToKeep:	1
# 命名空间的缩进: None, Inner(缩进嵌套的命名空间中的内容), All
NamespaceIndentation:	Inner
# 使用ObjC块时缩进宽度
ObjCBlockIndentWidth:	4
# 在ObjC的@property后添加一个空格
ObjCSpaceAfterProperty:	false
# 在ObjC的protocol列表前添加一个空格
ObjCSpaceBeforeProtocolList:	true
# 在call(后对函数调用换行的penalty
PenaltyBreakBeforeFirstCallParameter:	19
# 在一个注释中引入换行的penalty
PenaltyBreakComment:	300
# 第一次在<<前换行的penalty
PenaltyBreakFirstLessLess:	120
# 在一个字符串字面量中引入换行的penalty
PenaltyBreakString:	1000
# 对于每个在行字符数限制之外的字符的penalty
PenaltyExcessCharacter:	1000000
# 将函数的返回类型放到它自己的行的penalty
PenaltyReturnTypeOnItsOwnLine:	60
# 指针和引用的对齐: Left, Right, Middle
PointerAlignment:	Left
# 允许重新排版注释
ReflowComments:	true
# 允许排序#include
SortIncludes:	true
# 在C风格类型转换后添加空格
SpaceAfterCStyleCast:	false
# 在赋值运算符之前添加空格
SpaceBeforeAssignmentOperators:	true
# 开圆括号之前添加一个空格: Never, ControlStatements, Always
SpaceBeforeParens:	ControlStatements
# 在空的圆括号中添加空格
SpaceInEmptyParentheses:	false
# 在尾随的评论前添加的空格数(只适用于//)
SpacesBeforeTrailingComments:	2
# 在尖括号的<后和>前添加空格
SpacesInAngles:	true
# 在容器(ObjC和JavaScript的数组和字典等)字面量中添加空格
SpacesInContainerLiterals:	true
# 在C风格类型转换的括号中添加空格
SpacesInCStyleCastParentheses:	true
# 在圆括号的(后和)前添加空格
SpacesInParentheses:	true
# 在方括号的[后和]前添加空格，lamda表达式和未指明大小的数组的声明不受影响
SpacesInSquareBrackets:	true
# 标准: Cpp03, Cpp11, Auto
Standard:	Cpp11
# tab宽度
TabWidth:	4
# 使用tab字符: Never, ForIndentation, ForContinuationAndIndentation, Always
UseTab:	Never
...
```





以下为clang-format自动生成配置，但修改了几个默认值，搜索默认可知被修改的值

```c++
本patch中的clang-format会设置：
1. 一行最多120个字符            ColumnLimit:     120           # 默认为80
2. 缩进为4个字符           IndentWidth:     4       # 缩进宽度,默认为2
3. 大括号换行    BreakBeforeBraces: Allman     # 默认为attach
4. case缩进              IndentCaseLabels: true   # 默认为false
5. 访问说明符号缩进4      AccessModifierOffset: -4           # 默认为-2
6. TabWidth:        4                     # tab宽度, 默认是8
其它使用LLVM风格的默认值
```



```shell
---
Language:        Cpp
# BasedOnStyle:  LLVM
# 访问说明符(public、private等)的偏移
AccessModifierOffset: -4           # 默认为-2

# 开括号(开圆括号、开尖括号、开方括号)后的对齐: Align, DontAlign, AlwaysBreak(总是在开括号后换行)
AlignAfterOpenBracket: Align

# 连续宏时，对齐所有宏
AlignConsecutiveMacros: false

# 连续赋值时，对齐所有等号
AlignConsecutiveAssignments: false

# 连续声明时，对齐所有声明的变量名
AlignConsecutiveDeclarations: false

# 左对齐逃脱换行(使用反斜杠换行)的反斜杠
AlignEscapedNewlines: Right

# 水平对齐二元和三元表达式的操作数
AlignOperands:   true

# 对齐连续的尾随的注释
AlignTrailingComments: true

# 允许函数的所有参数在放在下一行
AllowAllArgumentsOnNextLine: true

# 允许所有构造初始化在放在下一行
AllowAllConstructorInitializersOnNextLine: true

# 允许函数声明的所有参数在放在下一行
AllowAllParametersOfDeclarationOnNextLine: true

# 允许短的块放在同一行
AllowShortBlocksOnASingleLine: false

# 允许短的case标签放在同一行
AllowShortCaseLabelsOnASingleLine: false

# 允许短的函数放在同一行: None, InlineOnly(定义在类中), Empty(空函数), Inline(定义在类中，空函数), All
AllowShortFunctionsOnASingleLine: All

# 允许短的Lambda语句保持在同一行
AllowShortLambdasOnASingleLine: All

# 允许短的if语句保持在同一行
AllowShortIfStatementsOnASingleLine: Never

# 允许短的Loop语句保持在同一行
AllowShortLoopsOnASingleLine: false

# 总是在定义返回类型后换行(deprecated)
AlwaysBreakAfterDefinitionReturnType: None

# 总是在返回类型后换行: None, All, TopLevel(顶级函数，不包括在类中的函数),
# #   AllDefinitions(所有的定义，不包括声明), TopLevelDefinitions(所有的顶级函数的定义)
AlwaysBreakAfterReturnType: None

# 总是在多行string字面量前换行
AlwaysBreakBeforeMultilineStrings: false

# 总是在多行string字面量前换行
AlwaysBreakTemplateDeclarations: MultiLine

# false表示所有形参要么都在同一行，要么都各自一行
BinPackArguments: true

# false表示所有形参要么都在同一行，要么都各自一行
BinPackParameters: true

# 大括号换行，只有当BreakBeforeBraces设置为Custom时才有效
BraceWrapping:
  AfterCaseLabel:  false             # case: 后面
  AfterClass:      false             # class定义后面
  AfterControlStatement: false       # 控制语句后面
  AfterEnum:       false             # enum后面
  AfterFunction:   false             # 函数后面
  AfterNamespace:  false             # namespace后面
  AfterObjCDeclaration: false        # ObjC声明后面
  AfterStruct:     false             # struct后面
  AfterUnion:      false             # union后面
  AfterExternBlock: false            # 外部block后面
  BeforeCatch:     false             # catch前面
  BeforeElse:      false             # Else前面
  IndentBraces:    false             # 大括号缩进
  SplitEmptyFunction: true           # 拆分空函数
  SplitEmptyRecord: true             # 拆分空Record
  SplitEmptyNamespace: true          # 拆分空namespace

# 在二元运算符前换行: None(在操作符后换行),
# NonAssignment(在非赋值的操作符前换行), All(在操作符前换行)
BreakBeforeBinaryOperators: None

# 在大括号前换行: Attach(始终将大括号附加到周围的上下文), Linux(除函数、命名空间和类定义，与Attach类似),
# Mozilla(除枚举、函数、记录定义，与Attach类似), Stroustrup(除函数定义、catch、else，与Attach类似),
# Allman(总是在大括号前换行), GNU(总是在大括号前换行，并对于控制语句的大括号增加额外的缩进), WebKit(在函数前换行), Custom
# 注：这里认为语句块也属于函数
BreakBeforeBraces: Allman     # 默认为attach

# 在继承逗号前换行
BreakBeforeInheritanceComma: false

# 在继承列表前换行
BreakInheritanceList: BeforeColon

# 在三元运算符前换行
BreakBeforeTernaryOperators: true

# 在构造函数的初始化列表的逗号前换行
BreakConstructorInitializersBeforeComma: false

# 在构造函数的初始化列表的前换行
BreakConstructorInitializers: BeforeColon

BreakAfterJavaFieldAnnotations: false

# 长字符换行行为
BreakStringLiterals: true

# 每行字符的限制，0表示没有限制
ColumnLimit:     120           # 默认为80

# 描述具有特殊意义的注释的正则表达式，它不应该被分割为多行或以其它方式改变
CommentPragmas:  '^ IWYU pragma:'

# namespace的紧凑性
CompactNamespaces: false

# 描述具有特殊意义的注释的正则表达式，它不应该被分割为多行或以其它方式改变
ConstructorInitializerAllOnOneLineOrOnePerLine: false

# 构造函数的初始化列表的缩进宽度
ConstructorInitializerIndentWidth: 4

# 延续的行的缩进宽度
ContinuationIndentWidth: 4

# 去除C++11的列表初始化的大括号{后和}前的空格
Cpp11BracedListStyle: true

# 继承最常用的指针和引用的对齐方式
DerivePointerAlignment: false

DisableFormat:   false   # 关闭格式化

# 自动检测函数的调用和定义是否被格式为每行一个参数(Experimental)
ExperimentalAutoDetectBinPacking: false

# 是否修复namespace注释
FixNamespaceComments: true

# 需要被解读为foreach循环而不是函数调用的宏
ForEachMacros:
  - foreach
  - Q_FOREACH
  - BOOST_FOREACH

# 控制include的格式化方式
IncludeBlocks:   Preserve

# 对#include进行排序，匹配了某正则表达式的#include拥有对应的优先级，
# 匹配不到的则默认优先级为INT_MAX(优先级越小排序越靠前)，
# 可以定义负数优先级从而保证某些#include永远在最前面
IncludeCategories:
  - Regex:           '^"(llvm|llvm-c|clang|clang-c)/'
    Priority:        2
  - Regex:           '^(<|"(gtest|gmock|isl|json)/)'
    Priority:        3
  - Regex:           '.*'
    Priority:        1
IncludeIsMainRegex: '(Test)?$'

# 缩进case标签
IndentCaseLabels: true   # 默认为false

# 预处理命令的缩进方式
IndentPPDirectives: None

IndentWidth:     4       # 缩进宽度,默认为2

# 函数返回类型换行时，缩进函数声明或函数定义的函数名
IndentWrappedFunctionNames: false

JavaScriptQuotes: Leave
JavaScriptWrapImports: true

# 保留在块开始处的空行
KeepEmptyLinesAtTheStartOfBlocks: true

# 开始一个块的宏的正则表达式
MacroBlockBegin: ''

# 结束一个块的宏的正则表达式
MacroBlockEnd:   ''

# 连续空行的最大数量
MaxEmptyLinesToKeep: 1

# 命名空间的缩进: None, Inner(缩进嵌套的命名空间中的内容), All
NamespaceIndentation: None

ObjCBinPackProtocolList: Auto
ObjCBlockIndentWidth: 2             # 使用ObjC块时缩进宽度
ObjCSpaceAfterProperty: false       # 在ObjC的@property后添加一个空格
ObjCSpaceBeforeProtocolList: true   # 在ObjC的protocol列表前添加一个空格

# 赋值操作中，分行的penalty
PenaltyBreakAssignment: 2

# 在call(后对函数调用换行的penalty
PenaltyBreakBeforeFirstCallParameter: 19

# 在一个注释中引入换行的penalty
PenaltyBreakComment: 300

# 第一次在<<前换行的penalty
PenaltyBreakFirstLessLess: 120

# 在一个字符串字面量中引入换行的penalty
PenaltyBreakString: 1000

# 声明模版时换行的penalty
PenaltyBreakTemplateDeclaration: 10

# 对于每个在行字符数限制之外的字符的penalty
PenaltyExcessCharacter: 1000000

# 将函数的返回类型放到它自己的行的penalty
PenaltyReturnTypeOnItsOwnLine: 60

# 指针和引用的对齐: Left, Right, Middle
PointerAlignment: Right

ReflowComments:  true                        # 允许重新排版注释
SortIncludes:    true                        # 允许排序#include
SortUsingDeclarations: true
SpaceAfterCStyleCast: false                  # 在C风格类型转换后添加空格
SpaceAfterLogicalNot: false
SpaceAfterTemplateKeyword: true
SpaceBeforeAssignmentOperators: true       # 在赋值运算符之前添加空格
SpaceBeforeCpp11BracedList: false
SpaceBeforeCtorInitializerColon: true
SpaceBeforeInheritanceColon: true

# 开圆括号之前添加一个空格: Never, ControlStatements, Always
SpaceBeforeParens: ControlStatements

# range for loop前添加空格
SpaceBeforeRangeBasedForLoopColon: true

# 在空的圆括号中添加空格
SpaceInEmptyParentheses: false

# 在尾随的评论前添加的空格数(只适用于//)
SpacesBeforeTrailingComments: 1

# 在尖括号的<后和>前添加空格
SpacesInAngles:  false

# 在容器(ObjC和JavaScript的数组和字典等)字面量中添加空格
SpacesInContainerLiterals: true

# 在C风格类型转换的括号中添加空格
SpacesInCStyleCastParentheses: false

# 在圆括号的(后和)前添加空格
SpacesInParentheses: false

# 在方括号的[后和]前添加空格，lamda表达式和未指明大小的数组的声明不受影响
SpacesInSquareBrackets: false

# 标准: Cpp03, Cpp11, Auto
Standard:        Cpp11

# 语句宏的处理方式
StatementMacros:
  - Q_UNUSED
  - QT_REQUIRE_VERSION
TabWidth:        4                     # tab宽度, 默认是8

# 使用tab字符: Never, ForIndentation, ForContinuationAndIndentation, Always
UseTab:          Never
...

```







### git clang-format

I don't know how to use this tools now.

```shell
clang-format 87a8f3c7bcf1113d9b8c5c9c7a75d75288b7fb81 -v
Ignoring changes in the following files (wrong extension):
    clang/docs/LanguageExtensions.rst
    clang/include/clang/Basic/BuiltinsPPC.def
Running clang-format on the following files:
    clang/test/CodeGen/builtins-ppc.c
old tree: 9932c5d686283ae4cd32d0c5603341d8e7320f81
new tree: c8361cbdcac649b990b699ade31ed8bdd4c71368
changed files:
    clang/test/CodeGen/builtins-ppc.c
```

