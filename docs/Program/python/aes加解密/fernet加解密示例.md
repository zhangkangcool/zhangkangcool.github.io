# python fernet加解密示例



```python
#!/usr/bin/env python3

from cryptography.fernet import Fernet
import base64



'''
Fernet必须使用的秘钥必须满足以下要求:
保证字符串长度足够（至少 32 字节），若不够就用字符串自身重复填充。
把字符串编码成字节。
对字节进行 Base64 编码，从而生成 Fernet 可用的密钥。

# 自动产生秘钥
def generate_key():
    return Fernet.generate_key()
'''
def generate_key_from_string(custom_string):
    # 确保字符串长度足够，如果不够则用 0 填充
    padded_string = (custom_string * (32 // len(custom_string) + 1))[:32]
    # 将字符串编码为字节
    key_bytes = padded_string.encode()
    # 进行 Base64 编码生成 Fernet 可用的密钥
    fernet_key = base64.urlsafe_b64encode(key_bytes)
    return fernet_key


def encrypt_message(message, key):
    f = Fernet(key)
    encrypted = f.encrypt(message.encode())
    return encrypted


def decrypt_message(encrypted_message, key):
    f = Fernet(key)
    decrypted = f.decrypt(encrypted_message).decode()
    return decrypted


if __name__ == "__main__":
    # 自定义字符串作为密钥
    custom_string = "your_custom_key_string"
    key = generate_key_from_string(custom_string)
    print(f"生成的密钥: {key}")

    # 要加密的消息
    original_message = "这是一个需要加密的消息。"
    print(f"原始消息: {original_message}")

    # 加密消息
    encrypted = encrypt_message(original_message, key)
    print(f"加密后的消息: {encrypted}")

    # 解密消息
    decrypted = decrypt_message(encrypted, key)
    print(f"解密后的消息: {decrypted}")

```

