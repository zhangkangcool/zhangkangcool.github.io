<h1 align="center">signal</h1>


捕获到SIGQUIT之后，程序仍可运行。在测试中如果是SIGTRAP的话，则会不停输出`in_handler:`



```c++
// RUN: %clangxx -O1 %s -o %t && %env_tool_opts=handle_SIGQUIT=1 %run %t 2>&1 | FileCheck %s

// __builtin_debugtrap() does not raise SIGQUIT on these platforms.
// UNSUPPORTED: s390

#include <assert.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

int in_handler;

void handler(int signo, siginfo_t *info, void *uctx) {
  fprintf(stderr, "in_handler: %d\n", in_handler);
  fflush(stderr);
  // CHECK: in_handler: 1
//  _Exit(0);
}

int main() {

  sigset_t news, old, pend;
  signal(SIGQUIT, handler);
  in_handler = 2;
  sigemptyset(&news);
  sigaddset(&news, SIGQUIT);
//  sigprocmask(SIG_BLOCK, &news, &old);

  in_handler = 3;


  sleep(5);

//  __builtin_trap();
  in_handler = 4;
  printf("SIGQUIT unblocked\n");
  sigprocmask(SIG_SETMASK, &old, NULL);
  kill(0, 3);  // 3 is SIGQUIT, 5 is SIGTRAP
  //__builtin_trap();
  printf("SIGQUIT 123\n");

  in_handler = 5;
  sleep(10);

  in_handler = 6;


//  fprintf(stderr, "UNREACHABLE\n");
  return 1;
}
```



### output

```shell
SIGQUIT unblocked
in_handler: 4
SIGQUIT 123
```







```shell
kill -l
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
63) SIGRTMAX-1	64) SIGRTMAX
```

