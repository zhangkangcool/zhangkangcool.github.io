# SNAP设置http代理



### 使用 `snap set` 命令（官方推荐，永久有效的方法）

这是配置 `snap` 代理的标准方法，它会直接修改 `snapd` 服务的配置。

1. **设置 HTTP 和 HTTPS 代理**打开终端，将 `http://your-proxy-address:port` 和 `http://your-proxy-address:port` 替换为你的实际代理地址和端口，然后执行以下命令：

   ```bash
   # 设置 HTTP 代理
   sudo snap set system proxy.http="http://your-proxy-address:port"
   
   # 设置 HTTPS 代理
   sudo snap set system proxy.https="http://your-proxy-address:port"
   ```

   

   **注意**：即使是 `https` 代理，这里的地址通常也以 `http://` 开头。

   

2. **（可选）设置不使用代理的地址**如果你希望某些地址（如本地地址、公司内部地址）不通过代理，可以设置 `no-proxy`：

   ```bash
   sudo snap set system proxy.no-proxy="localhost,127.0.0.1,*.some-internal-domain.com"
   ```

   

3. **重启 `snapd` 服务**为了让配置立即生效，你需要重启 `snapd` 服务：

   ```bash
   sudo systemctl restart snapd
   ```

   

4. **验证配置是否生效**你可以使用以下命令来查看当前的 `snap` 系统配置，确认代理是否已成功设置：

   ```bash
   snap get system proxy
   ```

   