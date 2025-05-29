# One's complement(反码)
https://en.wikipedia.org/wiki/Ones%27_complement


but in the computer `¬` is same as the `not (RA)`. because the (RA) is stored two's complement in the register.



# Two's complement（补码）
https://en.wikipedia.org/wiki/Two%27s_complement
Conveniently, another way of finding the two's complement of a number is to take its ones' complement and add one: the sum of a number and its ones' complement is all '1' bits, or 2N − 1; and by definition, the sum of a number and its two's complement is 2N.

```
Two's complement = One's complement + 1
X的Two's complement + X的原码 = 2^N
```

# Property

`¬(RA) + 1` is the Two's complement, RA is store the two's complement.
`¬(Y补码) + 1` = `([-Y]补码)`

```
SUB X, Y
```
If `if Y > 0`, `¬([Y补码]) == ¬(RA) == [-Y反码]`

If `if Y < 0`, `¬([Y补码]) == ¬(RA) != [-Y反码]`, because `-Y > 0` and `[-Y原码] =[-Y反码] = [-Y补码]` 
```
subf RT, RA, RB
RT <-- ¬(RA) + (RB) + 1
```

```
NOR RA, RS, RB
RA <--  ¬ ((RA) | (RB))

not Rx,Ry  <==> nor Rx,Ry,Ry
```