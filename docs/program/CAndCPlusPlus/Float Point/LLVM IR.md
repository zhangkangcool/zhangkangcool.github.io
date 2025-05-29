





```
    /// Returns platform specific canonical encoding of a floating point number.
    FCANONICALIZE,
    
    /// FMINNUM/FMAXNUM - Perform floating-point minimum or maximum on two
    /// values.
    //
    /// In the case where a single input is a NaN (either signaling or quiet),
    /// the non-NaN input is returned.
    ///
    /// The return value of (FMINNUM 0.0, -0.0) could be either 0.0 or -0.0.
    FMINNUM, FMAXNUM,

    /// FMINNUM_IEEE/FMAXNUM_IEEE - Perform floating-point minimum or maximum on
    /// two values, following the IEEE-754 2008 definition. This differs from
    /// FMINNUM/FMAXNUM in the handling of signaling NaNs. If one input is a
    /// signaling NaN, returns a quiet NaN.
    FMINNUM_IEEE, FMAXNUM_IEEE,

    /// FMINIMUM/FMAXIMUM - NaN-propagating minimum/maximum that also treat -0.0
    /// as less than 0.0. While FMINNUM_IEEE/FMAXNUM_IEEE follow IEEE 754-2008
    /// semantics, FMINIMUM/FMAXIMUM follow IEEE 754-2018 draft semantics.
    FMINIMUM, FMAXIMUM,
```



IEEE-2008

```
For equal:
  totalOrder(−0, +0) = true.
  totalOrder(+0, −0) = false.
For all:
  totalOrder(−NaN, y) = true     // -NaN = QNaN
  totalOrder(x, +NaN) = true     // +NaN = SNaN
  
```







###    FMINNUM, FMAXNUM

NAN：A single input is a NaN, the non-NaN input is returned.

Signed-Zero:  The return value of (FMINNUM 0.0, -0.0) could be either 0.0 or -0.0.



### FMINNUM_IEEE, FMAXNUM_IEEE（xsmaxdp, xsmindp）

Following the IEEE-754 2008 definition. 

This differs from FMINNUM/FMAXNUM in the handling of signaling NaNs. 

If one input is a signaling NaN, returns a quiet NaN.

```
--enable-unsafe-fp-math  --enable-no-signed-zeros-fp-math  --enable-no-nans-fp-math

// Can change
xsmaxdp(+0, -0) = +0
xsmaxdp(QNaN, x) = x        // xsmaxdp(-NaN, x) = x
xsmaxdp(SNaN, x) = QNaN     // xsmaxdp(+NaN, x) = -NaN

```



###    FMINIMUM, FMAXIMUM

 Following IEEE 754-2018 draft semantics.

 NaN-propagating minimum/maximum that also treat -0.0 as less than 0.0. While FMINNUM_IEEE/FMAXNUM_IEEE follow IEEE 754-2008 semantics, FMINIMUM/FMAXIMUM





xsmaxcdp

```
If src1 or src2 is a SNaN, an exception occurs.
If either src1 or src2 is a NaN, resul t is src2.
```

