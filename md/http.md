## 报文(纯文本)格式

- <request line> \r\n
- <request headers> \r\n
- <blank line> \r\n
- [<request-body>] \r\n

```
    // GET
    GET /books/?name=Professional%20Ajax HTTP/1.1
    Host: www.wrox.com
    User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
    Gecko/20050225 Firefox/1.0.1
    Connection: Keep-Alive
    
    // POST
    POST / HTTP/1.1
    Host: www.wrox.com
    User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
    Gecko/20050225 Firefox/1.0.1
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 40
    Connection: Keep-Alive
         （----此处空一行----）
    name=Professional%20Ajax&publisher=Wiley
```

- <status line> \r\n
- <respopnse header> \r\n
- <blank line> \r\n
- <entity-body> \r\n
## telnet 模拟

```
telnet www.baidu.com 80

GET / HTTP/1.1
HOST:
User-Agent: Mozilla/5.0
// enter

```

## socket 模拟
```
var net = require('net');
var client = net.connect({port: 80, host: 'cn.bing.com'}, function() {
  client.write('GET / HTTP/1.1\r\n');
  client.write('HOST: cn.bing.com\r\n');
  client.write('User-Agent: Mozilla/5.0\r\n');
  client.write('\r\n');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('disconnected');
});
```


## 状态码

#### 常用

```
	* 100 - 提供一些信息
	* 200 - 请求成功
	* 300 - 重定向
	* 400 - 请求出现问题
	* 500 - 服务器出现问题

100 - Continue
200 - Ok
201 - Created PUT请求
206 - 请求某范围之内的文件，通常被用来进行下载管理，断点续传或者文件分块下载
301 - Moved Permanently 永久移动
302 - Found 临时移动（Moved Temporarily）重定向Location，客户端请求中恢复原来URL
304 - Not Modified 通过使用If-Mofified-Since和If-None-Match确定客户端是否请求最新版本资源
400 - Bad Request
401 - 未经授权（Unauthorized）
403 - 被禁止（Forbidden）
404 - Not Found
405 - Method Not Allowed 如PUT方法不被支持
413 - Request Entity Too Large 请求主体过长
414 - Request URI Too Long URL过长
500 - Internal Server Error
503 - Service Unavailable

```

#### 常用消息头：
```
Connection - 告诉通信的另一端，完成http传输后是否关闭TCP
Content-Encoding - 消息主体编码形式，如gzip
Content-Length - 主体字节长度
Content-Type - 消息主体的内容，如text/html
Transfer-Encoding - 
```

#### 请求消息头：
````
Accept - 告诉服务器客户端能接受哪些内容
Accept-Encoing - 能接受哪些编码
Authorization - 内置http身份验证
Cookie - 
Host - 
If-Modified-Since - 
If-None-Match - 
Origin - 
Referer - 
User-Agent - 
```

#### 响应消息头：
```
Access-Control-Allow-Origin - 
Cache-Control - 
ETag - 
Expires - 
Location - 
Pragma - 
Server - 
Set-Cookie - 
WWW-Authenticate - 
X-Frame-Options - 
```

