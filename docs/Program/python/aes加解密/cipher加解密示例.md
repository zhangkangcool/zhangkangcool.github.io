<h1 align="center">python cipher加解密示例</h1>

```python
#!/usr/bin/env python3

from Crypto.Cipher import AES

# data is str
def alignSize(size, data):
  add_0_count = size - len(data) % size
  data_align = data
  if (add_0_count):
    data_align = data.rjust(len(data) + add_0_count, ' ')
#  print("After align: {}".format(data_align))
  return data_align

# data is str. return bytes
def cryptoData(data, password):
  data_align     = alignSize(16, data)
  password_align = alignSize(16, password)
  data_b         = data_align.encode('utf-8')
  password_b     = password_align.encode('utf-8')

  aes = AES.new(password_b,AES.MODE_ECB) #创建一个aes对象
  en_text = aes.encrypt(data_b) #加密明文
#  print("after crypto: {}".format(en_text))
  return en_text


# data is bytes and align 16, password is str, return str
def decryptoData(data, password):
  password_align = alignSize(16, password)
  password_b     = password_align.encode('utf-8')
  aes = AES.new(password_b, AES.MODE_ECB) #创建一个aes对象

  den_text = aes.decrypt(data) # 解密密文
  den_text_str = den_text.decode('utf-8')
#  print("after crypto: {}".format(den_text))
#  print("after crypto: {}".format(den_text_str))

  # Remove the left space
  return den_text_str.strip()

'''
password = "8ken"
data = cryptoData("zhangkang", "8ken")
print(len(data))
print(data)

len = len(decryptoData(data, "8ken"))
print(len)
'''
```

