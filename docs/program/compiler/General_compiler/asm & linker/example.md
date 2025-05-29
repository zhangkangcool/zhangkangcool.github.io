`~/test/asm_linker/linker`

## 1. Source code

### `main.c`

```c++
int add(int a, int b);

int main() {
  int a = 10, b = 11;
  printf("result: %d\n", add(a, b));
  return 0;
}

```



### `foo.c`

```c++
int add(int a, int b) {
  return a + b;
}
```





## 2. Command

```shell

clang foo.c -S -o foo.s
clang main.c -S -o main.s
clang foo.s main.s -o a.out


clang foo.c -c -o foo.o
clang main.c -c -o main.o
clang main.c foo.c -o a.out

```





```shell
clang main.c foo.c -o a.out -V

clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)
Target: x86_64-unknown-linux-gnu
Thread model: posix
InstalledDir: /home/ken/workspace/llvm/build/bin
Found candidate GCC installation: /usr/lib/gcc/x86_64-linux-gnu/9
Selected GCC installation: /usr/lib/gcc/x86_64-linux-gnu/9
Candidate multilib: .;@m64
Selected multilib: .;@m64
 "/home/ken/workspace/llvm/build/bin/clang-12" -cc1 -triple x86_64-unknown-linux-gnu -emit-obj -mrelax-all --mrelax-relocations -disable-free -main-file-name main.c -mrelocation-model static -mframe-pointer=all -fmath-errno -fno-rounding-math -mconstructor-aliases -munwind-tables -target-cpu x86-64 -tune-cpu generic -fno-split-dwarf-inlining -debugger-tuning=gdb -v -resource-dir /home/ken/workspace/llvm/build/lib/clang/12.0.0 -internal-isystem /usr/local/include -internal-isystem /home/ken/workspace/llvm/build/lib/clang/12.0.0/include -internal-externc-isystem /usr/include/x86_64-linux-gnu -internal-externc-isystem /include -internal-externc-isystem /usr/include -fdebug-compilation-dir /home/ken/test/asm_linker/linker -ferror-limit 19 -fgnuc-version=4.2.1 -faddrsig -o /tmp/main-a6666a.o -x c main.c
clang -cc1 version 12.0.0 based upon LLVM 12.0.0git default target x86_64-unknown-linux-gnu
ignoring nonexistent directory "/include"
#include "..." search starts here:
#include <...> search starts here:
 /usr/local/include
 /home/ken/workspace/llvm/build/lib/clang/12.0.0/include
 /usr/include/x86_64-linux-gnu
 /usr/include
End of search list.
 "/home/ken/workspace/llvm/build/bin/clang-12" -cc1 -triple x86_64-unknown-linux-gnu -emit-obj -mrelax-all --mrelax-relocations -disable-free -main-file-name foo.c -mrelocation-model static -mframe-pointer=all -fmath-errno -fno-rounding-math -mconstructor-aliases -munwind-tables -target-cpu x86-64 -tune-cpu generic -fno-split-dwarf-inlining -debugger-tuning=gdb -v -resource-dir /home/ken/workspace/llvm/build/lib/clang/12.0.0 -internal-isystem /usr/local/include -internal-isystem /home/ken/workspace/llvm/build/lib/clang/12.0.0/include -internal-externc-isystem /usr/include/x86_64-linux-gnu -internal-externc-isystem /include -internal-externc-isystem /usr/include -fdebug-compilation-dir /home/ken/test/asm_linker/linker -ferror-limit 19 -fgnuc-version=4.2.1 -faddrsig -o /tmp/foo-51c971.o -x c foo.c
clang -cc1 version 12.0.0 based upon LLVM 12.0.0git default target x86_64-unknown-linux-gnu
ignoring nonexistent directory "/include"
#include "..." search starts here:
#include <...> search starts here:
 /usr/local/include
 /home/ken/workspace/llvm/build/lib/clang/12.0.0/include
 /usr/include/x86_64-linux-gnu
 /usr/include
End of search list.
 "/usr/bin/ld" -z relro --hash-style=gnu --eh-frame-hdr -m elf_x86_64 -dynamic-linker /lib64/ld-linux-x86-64.so.2 -o a.out /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crt1.o /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crti.o /usr/lib/gcc/x86_64-linux-gnu/9/crtbegin.o -L/usr/lib/gcc/x86_64-linux-gnu/9 -L/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu -L/usr/lib/gcc/x86_64-linux-gnu/9/../../../../lib64 -L/lib/x86_64-linux-gnu -L/lib/../lib64 -L/usr/lib/x86_64-linux-gnu -L/usr/lib/../lib64 -L/usr/lib/x86_64-linux-gnu/../../lib64 -L/usr/lib/gcc/x86_64-linux-gnu/9/../../.. -L/home/ken/workspace/llvm/build/bin/../lib -L/lib -L/usr/lib /tmp/main-a6666a.o /tmp/foo-51c971.o -lgcc --as-needed -lgcc_s --no-as-needed -lc -lgcc --as-needed -lgcc_s --no-as-needed /usr/lib/gcc/x86_64-linux-gnu/9/crtend.o /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crtn.o

```





## 3. asm

### foo.s

```shell
       .text
        .file   "foo.c"
        .globl  add                             # -- Begin function add
        .p2align        4, 0x90
        .type   add,@function
add:                                    # @add
        .cfi_startproc
# %bb.0:                                # %entry
        pushq   %rbp
        .cfi_def_cfa_offset 16
        .cfi_offset %rbp, -16
        movq    %rsp, %rbp
        .cfi_def_cfa_register %rbp
        movl    %edi, -4(%rbp)
        movl    %esi, -8(%rbp)
        movl    -4(%rbp), %eax
        addl    -8(%rbp), %eax
        popq    %rbp
        .cfi_def_cfa %rsp, 8
        retq
.Lfunc_end0:
        .size   add, .Lfunc_end0-add
        .cfi_endproc
                                        # -- End function
        .ident  "clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)"
        .section        ".note.GNU-stack","",@progbits
        .addrsig

```







### `main.s`

```shell
        .text
        .file   "main.c"
        .globl  main                            # -- Begin function main
        .p2align        4, 0x90
        .type   main,@function
main:                                   # @main
        .cfi_startproc
# %bb.0:                                # %entry
        pushq   %rbp
        .cfi_def_cfa_offset 16
        .cfi_offset %rbp, -16
        movq    %rsp, %rbp
        .cfi_def_cfa_register %rbp
        subq    $16, %rsp
        movl    $0, -4(%rbp)
        movl    $10, -8(%rbp)
        movl    $11, -12(%rbp)
        movl    -8(%rbp), %edi   // 将参数放到指令的位置
        movl    -12(%rbp), %esi
        callq   add             // 调用foo.s中的add函数
        movabsq $.L.str, %rdi
        movl    %eax, %esi
        movb    $0, %al
        callq   printf          // 调用printf函数
        xorl    %ecx, %ecx
        movl    %eax, -16(%rbp)                 # 4-byte Spill
        movl    %ecx, %eax
        addq    $16, %rsp
        popq    %rbp
        .cfi_def_cfa %rsp, 8
        retq
.Lfunc_end0:
        .size   main, .Lfunc_end0-main
        .cfi_endproc
                                        # -- End function
        .type   .L.str,@object                  # @.str
        .section        .rodata.str1.1,"aMS",@progbits,1
.L.str:
        .asciz  "result: %d\n"
        .size   .L.str, 12

        .ident  "clang version 12.0.0 (https://github.com/llvm/llvm-project.git 154860af338f7b0c82cb04e91d6f199aa72cfdff)"
        .section        ".note.GNU-stack","",@progbits
        .addrsig
        .addrsig_sym printf
        .addrsig_sym add

```





##  4. linker

用多个.o文件和库文件组装成可执行文件。

```
clang main.s foo.s -o a.out
objdump -d a.out > a.dis
```

### a.dis

```shell
110 0000000000401130 <main>:
111   401130:   55                      push   %rbp
112   401131:   48 89 e5                mov    %rsp,%rbp
113   401134:   48 83 ec 10             sub    $0x10,%rsp
114   401138:   c7 45 fc 00 00 00 00    movl   $0x0,-0x4(%rbp)
115   40113f:   c7 45 f8 0a 00 00 00    movl   $0xa,-0x8(%rbp)
116   401146:   c7 45 f4 0b 00 00 00    movl   $0xb,-0xc(%rbp)
117   40114d:   8b 7d f8                mov    -0x8(%rbp),%edi
118   401150:   8b 75 f4                mov    -0xc(%rbp),%esi
119   401153:   e8 28 00 00 00          callq  401180 <add>  // add函数
120   401158:   48 bf 04 20 40 00 00    movabs $0x402004,%rdi
121   40115f:   00 00 00
122   401162:   89 c6                   mov    %eax,%esi
123   401164:   b0 00                   mov    $0x0,%al
124   401166:   e8 c5 fe ff ff          callq  401030 <printf@plt>  // 动态库中的printf函数
125   40116b:   31 c9                   xor    %ecx,%ecx
126   40116d:   89 45 f0                mov    %eax,-0x10(%rbp)
127   401170:   89 c8                   mov    %ecx,%eax
128   401172:   48 83 c4 10             add    $0x10,%rsp
129   401176:   5d                      pop    %rbp
130   401177:   c3                      retq
131   401178:   0f 1f 84 00 00 00 00    nopl   0x0(%rax,%rax,1)
132   40117f:   00
133
134 0000000000401180 <add>:
135   401180:   55                      push   %rbp
136   401181:   48 89 e5                mov    %rsp,%rbp
137   401184:   89 7d fc                mov    %edi,-0x4(%rbp)
138   401187:   89 75 f8                mov    %esi,-0x8(%rbp)
139   40118a:   8b 45 fc                mov    -0x4(%rbp),%eax
140   40118d:   03 45 f8                add    -0x8(%rbp),%eax
141   401190:   5d                      pop    %rbp
142   401191:   c3                      r etq
143   401192:   66 2e 0f 1f 84 00 00    nopw   %cs:0x0(%rax,%rax,1)
144   401199:   00 00 00
145   40119c:   0f 1f 40 00             nopl   0x0(%rax)

...

 24 0000000000401030 <printf@plt>:    // GLIBC中的printf函数
 25   401030:   ff 25 e2 2f 00 00       jmpq   *0x2fe2(%rip)        # 404018 <printf@GLIBC_2.2.5>
 26   401036:   68 00 00 00 00          pushq  $0x0
 27   40103b:   e9 e0 ff ff ff          jmpq   401020 <.plt>

```



### 链接脚本文件

```shell
ld --verbose
GNU ld (GNU Binutils for Ubuntu) 2.34
  Supported emulations:
   elf_x86_64
   elf32_x86_64
   elf_i386
   elf_iamcu
   elf_l1om
   elf_k1om
   i386pep
   i386pe
using internal linker script:
==================================================
/* Script for -z combreloc -z separate-code */
/* Copyright (C) 2014-2020 Free Software Foundation, Inc.
   Copying and distribution of this script, with or without modification,
   are permitted in any medium without royalty provided the copyright
   notice and this notice are preserved.  */
OUTPUT_FORMAT("elf64-x86-64", "elf64-x86-64",
              "elf64-x86-64")
OUTPUT_ARCH(i386:x86-64)
ENTRY(_start)
SEARCH_DIR("=/usr/local/lib/x86_64-linux-gnu"); SEARCH_DIR("=/lib/x86_64-linux-gnu"); SEARCH_DIR("=/usr/lib/x86_64-linux-gnu"); SEARCH_DIR("=/usr/lib/x86_64-linux-gnu64"); SEARCH_DIR("=/usr/local/lib64"); SEARCH_DIR("=/lib64"); SEARCH_DIR("=/usr/lib64"); SEARCH_DIR("=/usr/local/lib"); SEARCH_DIR("=/lib"); SEARCH_DIR("=/usr/lib"); SEARCH_DIR("=/usr/x86_64-linux-gnu/lib64"); SEARCH_DIR("=/usr/x86_64-linux-gnu/lib");
SECTIONS
{
  PROVIDE (__executable_start = SEGMENT_START("text-segment", 0x400000)); . = SEGMENT_START("text-segment", 0x400000) + SIZEOF_HEADERS;
  .interp         : { *(.interp) }
  .note.gnu.build-id  : { *(.note.gnu.build-id) }
  .hash           : { *(.hash) }
  .gnu.hash       : { *(.gnu.hash) }
  .dynsym         : { *(.dynsym) }
  .dynstr         : { *(.dynstr) }
  .gnu.version    : { *(.gnu.version) }
  .gnu.version_d  : { *(.gnu.version_d) }
  .gnu.version_r  : { *(.gnu.version_r) }
  .rela.dyn       :
    {
      *(.rela.init)
      *(.rela.text .rela.text.* .rela.gnu.linkonce.t.*)
      *(.rela.fini)
      *(.rela.rodata .rela.rodata.* .rela.gnu.linkonce.r.*)
      *(.rela.data .rela.data.* .rela.gnu.linkonce.d.*)
      *(.rela.tdata .rela.tdata.* .rela.gnu.linkonce.td.*)
      *(.rela.tbss .rela.tbss.* .rela.gnu.linkonce.tb.*)
      *(.rela.ctors)
      *(.rela.dtors)
      *(.rela.got)
      *(.rela.bss .rela.bss.* .rela.gnu.linkonce.b.*)
      *(.rela.ldata .rela.ldata.* .rela.gnu.linkonce.l.*)
      *(.rela.lbss .rela.lbss.* .rela.gnu.linkonce.lb.*)
      *(.rela.lrodata .rela.lrodata.* .rela.gnu.linkonce.lr.*)
      *(.rela.ifunc)
    }
  .rela.plt       :
    {
      *(.rela.plt)
      PROVIDE_HIDDEN (__rela_iplt_start = .);
      *(.rela.iplt)
      PROVIDE_HIDDEN (__rela_iplt_end = .);
    }
  . = ALIGN(CONSTANT (MAXPAGESIZE));
  .init           :
  {
    KEEP (*(SORT_NONE(.init)))
  }
  .plt            : { *(.plt) *(.iplt) }
.plt.got        : { *(.plt.got) }
.plt.sec        : { *(.plt.sec) }
  .text           :
  {
    *(.text.unlikely .text.*_unlikely .text.unlikely.*)
    *(.text.exit .text.exit.*)
    *(.text.startup .text.startup.*)
    *(.text.hot .text.hot.*)
    *(SORT(.text.sorted.*))
    *(.text .stub .text.* .gnu.linkonce.t.*)
    /* .gnu.warning sections are handled specially by elf.em.  */
    *(.gnu.warning)
  }
  .fini           :
  {
    KEEP (*(SORT_NONE(.fini)))
  }
  PROVIDE (__etext = .);
  PROVIDE (_etext = .);
  PROVIDE (etext = .);
  . = ALIGN(CONSTANT (MAXPAGESIZE));
  /* Adjust the address for the rodata segment.  We want to adjust up to
     the same address within the page on the next page up.  */
  . = SEGMENT_START("rodata-segment", ALIGN(CONSTANT (MAXPAGESIZE)) + (. & (CONSTANT (MAXPAGESIZE) - 1)));
  .rodata         : { *(.rodata .rodata.* .gnu.linkonce.r.*) }
  .rodata1        : { *(.rodata1) }
  .eh_frame_hdr   : { *(.eh_frame_hdr) *(.eh_frame_entry .eh_frame_entry.*) }
  .eh_frame       : ONLY_IF_RO { KEEP (*(.eh_frame)) *(.eh_frame.*) }
  .gcc_except_table   : ONLY_IF_RO { *(.gcc_except_table .gcc_except_table.*) }
  .gnu_extab   : ONLY_IF_RO { *(.gnu_extab*) }
  /* These sections are generated by the Sun/Oracle C++ compiler.  */
  .exception_ranges   : ONLY_IF_RO { *(.exception_ranges*) }
  /* Adjust the address for the data segment.  We want to adjust up to
     the same address within the page on the next page up.  */
  . = DATA_SEGMENT_ALIGN (CONSTANT (MAXPAGESIZE), CONSTANT (COMMONPAGESIZE));
  /* Exception handling  */
  .eh_frame       : ONLY_IF_RW { KEEP (*(.eh_frame)) *(.eh_frame.*) }
  .gnu_extab      : ONLY_IF_RW { *(.gnu_extab) }
  .gcc_except_table   : ONLY_IF_RW { *(.gcc_except_table .gcc_except_table.*) }
  .exception_ranges   : ONLY_IF_RW { *(.exception_ranges*) }
  /* Thread Local Storage sections  */
  .tdata          :
   {
     PROVIDE_HIDDEN (__tdata_start = .);
     *(.tdata .tdata.* .gnu.linkonce.td.*)
   }
  .tbss           : { *(.tbss .tbss.* .gnu.linkonce.tb.*) *(.tcommon) }
  .preinit_array    :
  {
    PROVIDE_HIDDEN (__preinit_array_start = .);
    KEEP (*(.preinit_array))
    PROVIDE_HIDDEN (__preinit_array_end = .);
  }
  .init_array    :
  {
    PROVIDE_HIDDEN (__init_array_start = .);
    KEEP (*(SORT_BY_INIT_PRIORITY(.init_array.*) SORT_BY_INIT_PRIORITY(.ctors.*)))
    KEEP (*(.init_array EXCLUDE_FILE (*crtbegin.o *crtbegin?.o *crtend.o *crtend?.o ) .ctors))
    PROVIDE_HIDDEN (__init_array_end = .);
  }
  .fini_array    :
  {
    PROVIDE_HIDDEN (__fini_array_start = .);
    KEEP (*(SORT_BY_INIT_PRIORITY(.fini_array.*) SORT_BY_INIT_PRIORITY(.dtors.*)))
    KEEP (*(.fini_array EXCLUDE_FILE (*crtbegin.o *crtbegin?.o *crtend.o *crtend?.o ) .dtors))
    PROVIDE_HIDDEN (__fini_array_end = .);
  }
  .ctors          :
  {
    /* gcc uses crtbegin.o to find the start of
       the constructors, so we make sure it is
       first.  Because this is a wildcard, it
       doesn't matter if the user does not
       actually link against crtbegin.o; the
       linker won't look for a file to match a
       wildcard.  The wildcard also means that it
       doesn't matter which directory crtbegin.o
       is in.  */
    KEEP (*crtbegin.o(.ctors))
    KEEP (*crtbegin?.o(.ctors))
    /* We don't want to include the .ctor section from
       the crtend.o file until after the sorted ctors.
       The .ctor section from the crtend file contains the
       end of ctors marker and it must be last */
    KEEP (*(EXCLUDE_FILE (*crtend.o *crtend?.o ) .ctors))
    KEEP (*(SORT(.ctors.*)))
    KEEP (*(.ctors))
  }
  .dtors          :
  {
    KEEP (*crtbegin.o(.dtors))
    KEEP (*crtbegin?.o(.dtors))
    KEEP (*(EXCLUDE_FILE (*crtend.o *crtend?.o ) .dtors))
    KEEP (*(SORT(.dtors.*)))
    KEEP (*(.dtors))
  }
  .jcr            : { KEEP (*(.jcr)) }
  .data.rel.ro : { *(.data.rel.ro.local* .gnu.linkonce.d.rel.ro.local.*) *(.data.rel.ro .data.rel.ro.* .gnu.linkonce.d.rel.ro.*) }
  .dynamic        : { *(.dynamic) }
  .got            : { *(.got) *(.igot) }
  . = DATA_SEGMENT_RELRO_END (SIZEOF (.got.plt) >= 24 ? 24 : 0, .);
  .got.plt        : { *(.got.plt) *(.igot.plt) }
  .data           :
  {
    *(.data .data.* .gnu.linkonce.d.*)
    SORT(CONSTRUCTORS)
  }
  .data1          : { *(.data1) }
  _edata = .; PROVIDE (edata = .);
  . = .;
  __bss_start = .;
  .bss            :
  {
   *(.dynbss)
   *(.bss .bss.* .gnu.linkonce.b.*)
   *(COMMON)
   /* Align here to ensure that the .bss section occupies space up to
      _end.  Align after .bss to ensure correct alignment even if the
      .bss section disappears because there are no input sections.
      FIXME: Why do we need it? When there is no .bss section, we do not
      pad the .data section.  */
   . = ALIGN(. != 0 ? 64 / 8 : 1);
  }
  .lbss   :
  {
    *(.dynlbss)
    *(.lbss .lbss.* .gnu.linkonce.lb.*)
    *(LARGE_COMMON)
  }
  . = ALIGN(64 / 8);
  . = SEGMENT_START("ldata-segment", .);
  .lrodata   ALIGN(CONSTANT (MAXPAGESIZE)) + (. & (CONSTANT (MAXPAGESIZE) - 1)) :
  {
    *(.lrodata .lrodata.* .gnu.linkonce.lr.*)
  }
  .ldata   ALIGN(CONSTANT (MAXPAGESIZE)) + (. & (CONSTANT (MAXPAGESIZE) - 1)) :
  {
    *(.ldata .ldata.* .gnu.linkonce.l.*)
    . = ALIGN(. != 0 ? 64 / 8 : 1);
  }
  . = ALIGN(64 / 8);
  _end = .; PROVIDE (end = .);
  . = DATA_SEGMENT_END (.);
  /* Stabs debugging sections.  */
  .stab          0 : { *(.stab) }
  .stabstr       0 : { *(.stabstr) }
  .stab.excl     0 : { *(.stab.excl) }
  .stab.exclstr  0 : { *(.stab.exclstr) }
  .stab.index    0 : { *(.stab.index) }
  .stab.indexstr 0 : { *(.stab.indexstr) }
  .comment       0 : { *(.comment) }
  .gnu.build.attributes : { *(.gnu.build.attributes .gnu.build.attributes.*) }
  /* DWARF debug sections.
     Symbols in the DWARF debugging sections are relative to the beginning
     of the section so we begin them at 0.  */
  /* DWARF 1 */
  .debug          0 : { *(.debug) }
  .line           0 : { *(.line) }
  /* GNU DWARF 1 extensions */
  .debug_srcinfo  0 : { *(.debug_srcinfo) }
  .debug_sfnames  0 : { *(.debug_sfnames) }
  /* DWARF 1.1 and DWARF 2 */
  .debug_aranges  0 : { *(.debug_aranges) }
  .debug_pubnames 0 : { *(.debug_pubnames) }
  /* DWARF 2 */
  .debug_info     0 : { *(.debug_info .gnu.linkonce.wi.*) }
  .debug_abbrev   0 : { *(.debug_abbrev) }
  .debug_line     0 : { *(.debug_line .debug_line.* .debug_line_end) }
  .debug_frame    0 : { *(.debug_frame) }
  .debug_str      0 : { *(.debug_str) }
  .debug_loc      0 : { *(.debug_loc) }
  .debug_macinfo  0 : { *(.debug_macinfo) }
  /* SGI/MIPS DWARF 2 extensions */
  .debug_weaknames 0 : { *(.debug_weaknames) }
  .debug_funcnames 0 : { *(.debug_funcnames) }
  .debug_typenames 0 : { *(.debug_typenames) }
  .debug_varnames  0 : { *(.debug_varnames) }
  /* DWARF 3 */
  .debug_pubtypes 0 : { *(.debug_pubtypes) }
  .debug_ranges   0 : { *(.debug_ranges) }
  /* DWARF Extension.  */
  .debug_macro    0 : { *(.debug_macro) }
  .debug_addr     0 : { *(.debug_addr) }
  .gnu.attributes 0 : { KEEP (*(.gnu.attributes)) }
  /DISCARD/ : { *(.note.GNU-stack) *(.gnu_debuglink) *(.gnu.lto_*) }
}


==================================================

```

