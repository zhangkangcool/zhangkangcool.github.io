# SDValue & SDNode
SDNode is like the instruction, and SDvalue is like  the operand.
```c++
class SDValue {
  friend struct DenseMapInfo<SDValue>;
 
  SDNode *Node = nullptr; // The node defining the value we are using.
  /// get the SDNode which holds the desired result
  SDNode *getNode() const { return Node; }
  
   inline SDValue(SDNode *node, unsigned resno)
     : Node(node), ResNo(resno) {
     // Explicitly check for !ResNo to avoid use-after-free, because there are
     // callers that use SDValue(N, 0) with a deleted N to indicate successful
     // combines.
     assert((!Node || !ResNo || ResNo < Node->getNumValues()) &&
            "Invalid result number for the given node!");
     assert(ResNo < -2U && "Cannot use result numbers reserved for DenseMaps.");
 }
  
  // only call the function of SDnode
  inline const SDValue& getOperand(unsigned i) const {
    return Node->getOperand(i);
  }
  
  inline unsigned SDValue::getOpcode() const {
    return Node->getOpcode();
  }
  
  inline unsigned SDValue::getMachineOpcode() const {
    return Node->getMachineOpcode();
  }
}
```

- SDvalue has a private member `SDNode *Node`, the SDValue is defined by Node. You can use `SDValue::getNode()` to get the node.

```c++
%1 = NEG Z
%2 = ADD %1, Y

SDValue X;
X.getOperand(i) == X.getNode()->getOperande(i);
X.getOpCode() == X.getNode(）->getOpcode();
There is no X.getOperand() and X.getOpCode(i)

X.getNode() will rerurn the SDNode, which define X.

If X is %1 here, X.getNode() is the SDNode* (%1 = NEG Z).
```

- If you want to get the result of instruction SDNode, you can call the constructor `SDValue::SDValue(SDNode *node, unsigned resno)`.
SDValue(%1, 0) get the first return SDValue of SDNode * %1.



```cpp
483 /// getVerboseConditionalRegName - This method expands the condition register
484 /// when requested explicitly or targetting Darwin.
485 const char *PPCInstPrinter::getVerboseConditionRegName(unsigned RegNum,
486                                                        unsigned RegEncoding)
487                                                        const {
488   if (!TT.isOSDarwin() && !FullRegNames)
489     return nullptr;
490   if (RegNum < PPC::CR0EQ || RegNum > PPC::CR7UN)
491     return nullptr;
492   const char *CRBits[] = {
493     "lt", "gt", "eq", "un",
494     "4*cr1+lt", "4*cr1+gt", "4*cr1+eq", "4*cr1+un",
495     "4*cr2+lt", "4*cr2+gt", "4*cr2+eq", "4*cr2+un",
496     "4*cr3+lt", "4*cr3+gt", "4*cr3+eq", "4*cr3+un",
497     "4*cr4+lt", "4*cr4+gt", "4*cr4+eq", "4*cr4+un",
498     "4*cr5+lt", "4*cr5+gt", "4*cr5+eq", "4*cr5+un",
499     "4*cr6+lt", "4*cr6+gt", "4*cr6+eq", "4*cr6+un",
500     "4*cr7+lt", "4*cr7+gt", "4*cr7+eq", "4*cr7+un"
501   };
502   return CRBits[RegEncoding];
503 }
```

RegNameInfo

```cpp
107 #define PPC_REGS0_31(X)                                                        \
108   {                                                                            \
109     X##0, X##1, X##2, X##3, X##4, X##5, X##6, X##7, X##8, X##9, X##10, X##11,  \
110         X##12, X##13, X##14, X##15, X##16, X##17, X##18, X##19, X##20, X##21,  \
111         X##22, X##23, X##24, X##25, X##26, X##27, X##28, X##29, X##30, X##31   \
112   }
113
114 #define PPC_REGS_NO0_31(Z, X)                                                  \
115   {                                                                            \
116     Z, X##1, X##2, X##3, X##4, X##5, X##6, X##7, X##8, X##9, X##10, X##11,     \
117         X##12, X##13, X##14, X##15, X##16, X##17, X##18, X##19, X##20, X##21,  \
118         X##22, X##23, X##24, X##25, X##26, X##27, X##28, X##29, X##30, X##31   \
119   }
120
121 #define PPC_REGS_LO_HI(LO, HI)                                                 \
122   {                                                                            \
123     LO##0, LO##1, LO##2, LO##3, LO##4, LO##5, LO##6, LO##7, LO##8, LO##9,      \
124         LO##10, LO##11, LO##12, LO##13, LO##14, LO##15, LO##16, LO##17,        \
125         LO##18, LO##19, LO##20, LO##21, LO##22, LO##23, LO##24, LO##25,        \
126         LO##26, LO##27, LO##28, LO##29, LO##30, LO##31, HI##0, HI##1, HI##2,   \
127         HI##3, HI##4, HI##5, HI##6, HI##7, HI##8, HI##9, HI##10, HI##11,       \
128         HI##12, HI##13, HI##14, HI##15, HI##16, HI##17, HI##18, HI##19,        \
129         HI##20, HI##21, HI##22, HI##23, HI##24, HI##25, HI##26, HI##27,        \
130         HI##28, HI##29, HI##30, HI##31                                         \
131   }
132
133 using llvm::MCPhysReg;
134
135 #define DEFINE_PPC_REGCLASSES \
136   static const MCPhysReg RRegs[32] = PPC_REGS0_31(PPC::R); \
137   static const MCPhysReg XRegs[32] = PPC_REGS0_31(PPC::X); \
138   static const MCPhysReg FRegs[32] = PPC_REGS0_31(PPC::F); \
139   static const MCPhysReg SPERegs[32] = PPC_REGS0_31(PPC::S); \
140   static const MCPhysReg VFRegs[32] = PPC_REGS0_31(PPC::VF); \
141   static const MCPhysReg VRegs[32] = PPC_REGS0_31(PPC::V); \
142   static const MCPhysReg QFRegs[32] = PPC_REGS0_31(PPC::QF); \
143   static const MCPhysReg RRegsNoR0[32] = \
144     PPC_REGS_NO0_31(PPC::ZERO, PPC::R); \
145   static const MCPhysReg XRegsNoX0[32] = \
146     PPC_REGS_NO0_31(PPC::ZERO8, PPC::X); \
147   static const MCPhysReg VSRegs[64] = \
148     PPC_REGS_LO_HI(PPC::VSL, PPC::V); \
149   static const MCPhysReg VSFRegs[64] = \
150     PPC_REGS_LO_HI(PPC::F, PPC::VF); \
151   static const MCPhysReg VSSRegs[64] = \
152     PPC_REGS_LO_HI(PPC::F, PPC::VF); \
153   static const MCPhysReg CRBITRegs[32] = { \
154     PPC::CR0LT, PPC::CR0GT, PPC::CR0EQ, PPC::CR0UN, \
155     PPC::CR1LT, PPC::CR1GT, PPC::CR1EQ, PPC::CR1UN, \
156     PPC::CR2LT, PPC::CR2GT, PPC::CR2EQ, PPC::CR2UN, \
157     PPC::CR3LT, PPC::CR3GT, PPC::CR3EQ, PPC::CR3UN, \
158     PPC::CR4LT, PPC::CR4GT, PPC::CR4EQ, PPC::CR4UN, \
159     PPC::CR5LT, PPC::CR5GT, PPC::CR5EQ, PPC::CR5UN, \
160     PPC::CR6LT, PPC::CR6GT, PPC::CR6EQ, PPC::CR6UN, \
161     PPC::CR7LT, PPC::CR7GT, PPC::CR7EQ, PPC::CR7UN}; \
162   static const MCPhysReg CRRegs[8] = { \
163     PPC::CR0, PPC::CR1, PPC::CR2, PPC::CR3, \
164     PPC::CR4, PPC::CR5, PPC::CR6, PPC::CR7}
165
```

