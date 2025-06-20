<h1 align="center">比特币UXTO中的解锁脚本的签名如何计算的</h1>







在比特币的UTXO（未花费交易输出）模型中，解锁脚本（`scriptSig`）中的签名是通过对交易的特定数据使用私钥进行数字签名计算得出的。这个过程基于椭圆曲线数字签名算法（ECDSA），比特币采用的是secp256k1曲线。以下是详细的计算步骤：

---

### 签名计算步骤

#### 1. 准备要签名的数据（签名哈希）
签名的对象不是整个交易的原始数据，而是一个经过处理的“签名哈希”（`SigHash`）。这个哈希根据交易的输入和输出构造，并受`SIGHASH`类型的影响（常见的是`SIGHASH_ALL`）。具体步骤如下：

- **构造临时交易数据**：
  1. 复制当前交易的结构，包括版本号、输入列表、输出列表和锁定时间。
  2. 对于当前要签名的输入，将其`scriptSig`替换为对应的UTXO中的`scriptPubKey`（锁定脚本，例如P2PKH中的`OP_DUP OP_HASH160 <pubkeyhash> OP_EQUALVERIFY OP_CHECKSIG`）。
  3. 将其他输入的`scriptSig`清空（设为`0x00`）。
  4. 根据`SIGHASH`类型调整数据：
     - `SIGHASH_ALL`：保留所有输入和输出，表示签名覆盖整个交易。
     - `SIGHASH_SINGLE`或`SIGHASH_ANYONECANPAY`：调整输入或输出的包含范围（较少使用）。
  5. 在交易数据末尾附加4字节的`SIGHASH`标志（例如，`0x01`表示`SIGHASH_ALL`）。
  
- **计算签名哈希**：
  - 对构造好的临时交易数据进行双重SHA-256哈希：
    
```shell
    SigHash = SHA256(SHA256(临时交易数据))
```
    
  - 结果是一个32字节的哈希值，作为ECDSA签名的输入。

#### 2. 使用私钥进行ECDSA签名
- **输入**：
  - 私钥（32字节的随机数，符合secp256k1要求）。
  - 上一步计算得到的签名哈希（32字节）。
- **ECDSA签名过程**：
  1. 随机生成一个临时 nonce（`k`），必须是安全的随机数。
  2. 计算点`R = k * G`（`G`是secp256k1的生成点），取`R`的x坐标作为`r`。
  3. 计算`s = k⁻¹ * (Hash + r * PrivKey) mod n`，其中`n`是secp256k1的阶。
  4. 如果`s`值过高（大于`n/2`），通常会调整为较低值以符合比特币的“低s值”规范。
- **输出**：
  - 签名由`r`和`s`组成，通常以DER格式编码：
```shell
    30 <总长度> 02 <r长度> <r值> 02 <s长度> <s值>
```
  - DER编码后的签名长度通常为70-72字节。

#### 3. 附加SIGHASH标志
- 在DER编码的签名后附加1字节的`SIGHASH`类型，例如`0x01`（`SIGHASH_ALL`）。
- 最终的签名数据可能是这样的：
```shell
  30440220...0220...01
```

#### 4. 放入解锁脚本
- 将签名与公钥一起放入`scriptSig`，例如：
```shell
  <签名> <公钥>
```
- 公钥可以是压缩格式（33字节，以`02`或`03`开头）或未压缩格式（65字节，以`04`开头）。

---

### 示例计算流程
假设有一个简单的单输入单输出交易：
- **输入**：花费一个P2PKH UTXO。
- **UTXO的scriptPubKey**：`OP_DUP OP_HASH160 1a91e3dace36e2be3bf030a2cf1a5e7c1d21e3f4 OP_EQUALVERIFY OP_CHECKSIG`。
- **私钥**：`0x18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725`。
- **公钥**（压缩格式）：`0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352`。

#### 步骤：
1. **构造临时交易数据**：
   - 替换当前输入的`scriptSig`为`scriptPubKey`。
   
   - 清空其他输入的`scriptSig`（假设单输入）。
   
   - 附加`SIGHASH_ALL`（`0x01000000`）。
   
   - 示例交易数据（简化）： 
     
```shell
     01000000 (版本)
     01 (输入数量)
     <prev_txid> <vout> <scriptPubKey> <sequence>
     01 (输出数量)
     <value> <scriptPubKey>
     00000000 (锁定时间)
     01000000 (SIGHASH_ALL)
```
   
2. **计算签名哈希**：
   - 双重SHA-256，结果可能是：
```shell
     e907831f80848d1069a5371b402410364bdf1c5f8307b0084c55f1ce2dca10ef
```

3. **ECDSA签名**：
   - 使用私钥和签名哈希，生成`r`和`s`：
```shell
     r = 0x37206a0610995c58074999cb9767b87af4c4978db68c06e8e6e81d282047a7c6
     s = 0x8ca63759c1157ebeaec0d03cecca119fc9a75bf8e6d0fa65c841c8e2738cdaec
```
   - DER编码：
```shell
     3045022037206a0610995c58074999cb9767b87af4c4978db68c06e8e6e81d282047a7c60221008ca63759c1157ebeaec0d03cecca119fc9a75bf8e6d0fa65c841c8e2738cdaec
```
   - 附加`SIGHASH_ALL`：
```shell
     3045022037206a0610995c58074999cb9767b87af4c4978db68c06e8e6e81d282047a7c60221008ca63759c1157ebeaec0d03cecca119fc9a75bf8e6d0fa65c841c8e2738cdaec01
```

4. **解锁脚本**：
```shell
   3045022037206a0610995c58074999cb9767b87af4c4978db68c06e8e6e81d282047a7c60221008ca63759c1157ebeaec0d03cecca119fc9a75bf8e6d0fa65c841c8e2738cdaec01 0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
```

---

### 验证过程
- 节点收到交易后，用公钥和签名哈希验证签名的有效性，确保签名是由私钥持有者生成的。

希望这个详细的计算过程清楚地回答了您的问题！如果需要更具体的例子或代码实现，请告诉我。

