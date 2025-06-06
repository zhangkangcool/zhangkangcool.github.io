<h1 align="center">Instruction Format</h1>




```c++
class CSKYInst<AddrMode am, int sz, dag outs, dag ins, string asmstr, list<dag> pattern>
  : Instruction {
  let Namespace = "CSKY";
  int Size = sz;
  AddrMode AM = am;

  let OutOperandList = outs;
  let InOperandList = ins;
  let AsmString = asmstr;
  let Pattern = pattern;
  let Itinerary = NoItinerary;
  let TSFlags{4-0} = AM.Value;
}


class CSKYInst<AddrMode am, int sz, dag outs, dag ins, string asmstr, list<dag> pattern>
  : Instruction {
  let Namespace = "CSKY";
  int Size = sz;
  AddrMode AM = am;

  let OutOperandList = outs;
  let InOperandList = ins;
  let AsmString = asmstr;
  let Pattern = pattern;
  let Itinerary = NoItinerary;
  let TSFlags{4-0} = AM.Value;
}


// Format< OP[6] | RZ[5] | SOP[3] | OFFSET[18] >
// Instructions(7): grs, lrs32.b, lrs32.h, lrs32.w, srs32.b, srs32.h, srs32.w
class I_18_Z_L<bits<3> sop, string op, Operand operand, list<dag> pattern>
  : CSKY32Inst<AddrModeNone, 0x33, (outs GPR:$rz), (ins operand:$offset),
  !strconcat(op, "\t$rz, $offset"), pattern> {
  bits<5> rz;
  bits<18> offset;
  let Inst{25 - 21} = rz;   
  let Inst{20 - 18} = sop;
  let Inst{17 - 0} = offset;
}

bits<4> x;  // 定义x占4位
let Inst{m - n} = x;   // 定义x占用CSKY32Inst指令中的哪4位
```

