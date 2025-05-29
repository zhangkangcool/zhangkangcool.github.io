# Natural Loop

https://web.cs.wpi.edu/~kal/PLT/PLT8.6.4.html

The *natural loop* of the back edge is defined to be the *smallest set of nodes* that 
includes the back edge and has no predecessors outside the set except for the predecessor
of the header. Natural loops are the loops for which we find optimizations.

 Header：从外面进入循环的结点（在循环内）。

PreHeader：从外面进入循环的结点（在循环外），Header的前一个结点。

自然循环是只有一个PreHeader的循环。