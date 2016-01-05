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

#### 通用

#### 请求

#### 响应
