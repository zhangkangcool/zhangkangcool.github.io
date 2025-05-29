
#### 1. first old, second new
```
diff -uNr github_go_origin/src/ google_go/src > go_diff.patch    

cd google_go
patch -p1 -R < ../go_diff.patch
```

#### 2. first old, second new
```
diff -uNr src_origin/math/ src_patch/math/ > diff_math.patch
cd src
patch -p1 < ~/twomathcompare/diff_math.patch
```

```
diff -uNr swift_origin/stdlib/ swift_patch/stdlib/ > swift_diff.patch
cd swift_origin
patch -p1 < ../swift_diff.patch
```
