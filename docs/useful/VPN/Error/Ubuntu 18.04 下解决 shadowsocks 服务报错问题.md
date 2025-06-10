<h1 align="center">Ubuntu 18.04 下解决 shadowsocks 服务报错问题</h1>
https://floperry.github.io/2019/02/24/2018-06-25-Ubuntu-18.04-%E4%B8%8B%E8%A7%A3%E5%86%B3-shadowsocks-%E6%9C%8D%E5%8A%A1%E6%8A%A5%E9%94%99%E9%97%AE%E9%A2%98/





本文适用于 Ubuntu 18.04下由于升级 openssl 至1.1.0以上版本导致的 shadowsocks 服务出现 undefined symbol: EVP_CIPHER_CTX_cleanup 错误而无法启动的问题。该问题的具体描述如下：



> Traceback (most recent call last):
> File “/home/feng/.local/bin/sslocal”, line 11, in
> sys.exit(main())
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/local.py”, line 39, in main
> config = shell.get_config(True)
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/shell.py”, line 262, in get_config
> check_config(config, is_local)
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/shell.py”, line 124, in check_config
> encrypt.try_cipher(config[‘password’], config[‘method’])
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/encrypt.py”, line 44, in try_cipher
> Encryptor(key, method)
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/encrypt.py”, line 83, in **init**
> random_string(self._method_info[1]))
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/encrypt.py”, line 109, in get_cipher
> return m[2](https://floperry.github.io/2019/02/24/2018-06-25-Ubuntu-18.04-下解决-shadowsocks-服务报错问题/method, key, iv, op)
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/crypto/openssl.py”, line 76, in **init**
> load_openssl()
> File “/home/feng/.local/lib/python3.6/site-packages/shadowsocks/crypto/openssl.py”, line 52, in load_openssl
> libcrypto.EVP_CIPHER_CTX_cleanup.argtypes = (c_void_p,)
> File “/usr/lib/python3.6/ctypes/**init**.py”, line 361, in **getattr**
> func = self.**getitem**(name)
> File “/usr/lib/python3.6/ctypes/**init**.py”, line 366, in **getitem**
> func = self._FuncPtr((name_or_ordinal, self))
> AttributeError: /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup

如[官网](https://www.openssl.org/docs/man1.1.0/crypto/EVP_CIPHER_CTX_reset.html)中所描述，这是由于在openssl 1.1.0中废弃了 `EVP_CIPHER_CTX_cleanup()` 函数而引入了 `EVE_CIPHER_CTX_reset()` 函数所导致的：

> **EVP_CIPHER_CTX** was made opaque in OpenSSL 1.1.0. As a result, EVP_CIPHER_CTX_reset() appeared and EVP_CIPHER_CTX_cleanup() disappeared. EVP_CIPHER_CTX_init() remains as an alias for EVP_CIPHER_CTX_reset().

因此，可以通过将 `EVP_CIPHER_CTX_cleanup()` 函数替换为 `EVP_CIPHER_CTX_reset()` 函数来解决该问题。具体解决方法如下：

1、根据错误信息定位到文件 /home/feng/.local/lib/python3.6/site-packages/shadowsocks/crypto/openssl.py 。

2、搜索 cleanup 并将其替换为 reset 。

3、重新启动 shadowsocks, 该问题解决。