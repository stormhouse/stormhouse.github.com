## ssh公钥登录vps
公私钥"认证的方式来进行ssh登录
客户端上创建一对公私钥

* 公钥文件：~/.ssh/id_rsa.pub
* 私钥文件：~/.ssh/id_rsa

把公钥放到服务器上（~/.ssh/authorized_keys）, 自己保留好私钥
在使用ssh登录时,ssh程序会发送私钥去和服务器上的公钥做匹配.如果匹配成功就自动登录了

#### 生成 -> 服务器
```
ssh-keygen -t dsa
// 拷贝公钥到服务器
scp  ~/.ssh/id_dsa.pub root@remotehost:/

// 登陆到服务器安装公钥
cat id_dsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
rm  id_dsa.pub
```
#### 配置
```
vim /etc/ssh/sshd_config

PubkeyAuthentication yes  
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM no

```
#### 重启
```
service sshd restart
```

## ubuntu设置ufw
#### 安装
```
apt-get install ufw 
ufw enable  # 开启
ufw default deny  # 开机自动开启
```
#### 配置
```
ufw allow 9999/tcp
ufw deny 80/tcp
```
