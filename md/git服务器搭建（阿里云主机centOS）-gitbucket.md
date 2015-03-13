git服务器搭建（阿里云主机centOS）-gitbucket

## 服务器配置
#### 创建目录

```
$ mkdir /aliyundata/gitserver
$ cd /aliyundata/gitserver
```

#### 下载安装jdk
oracle官网下载，替换选择你的版本，url

```
$ curl -v -j -k -L -H "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u25-b17/jdk-8u25-linux-x64.rpm > jdk-8u25-linux-x64.rpm
```

安装，验证

```
$ rpm -ivh jdk-8u25-linux-x64.rpm
$ java -version
```

#### [下载](http://ftp.meisei-u.ac.jp/mirror/apache/dist/tomcat/tomcat-8/v8.0.15/bin/apache-tomcat-8.0.15.tar.gz)、配置tomcat

配置tomcat密码(conf/tomcat-users.xml)，配置端口8080(conf/server.xml)，java的同学都懂得

#### 下载[gitbucket.war](https://github.com/takezoe/gitbucket/releases/tag/2.6)

放到webapps中

```
$ pwd
/alidata/gitserver/apache-tomcat-8.0.15/webapps
$ ls
docs  examples  gitbucket  gitbucket.war  host-manager  manager  ROOT
```

#### gitbucket配置

```
$ cd /alidata/gitserver/apache-tomcat-8.0.15/webapps
$ ./startup.sh
```
浏览器访问  http://ip:8080/gitbucket/ ，root/root
添加 Group, User, 在新建的组中添加Members
添加ssh支持，http://your-ip:8080/gitbucket/admin/system， SSH access
创建repo, 注意选择你新建的组(仓库默认存储在~/.gitbucket)

## 客户端配置
#### 安装git客户端 http://git-scm.com/download/
#### 配置本地信息
``` shell
$ git config --global user.name "stormhouse"
$ git config --global user.email stormhouse@yeah.net
$ git config -l
```
#### 创建SSH密匙
```
$ ssh-keygen -C 'stormhouse@yeah.net' -t rsa
```
将~/.ssh/目录中的id_rsa.pub内容粘到 [http://your-ip:8080/gitbucket/root/_ssh]中

#### 克隆远程项目
```
$ git clone http://your-ip:8080/gitbucket/git/your-groupv/repo-test.git
```

## git常用命令
#### 远程
```
# 远程库
$ git remote -v  # 查看远程库url
$ git remote add github git@github.com:stormhouse/test.git  # 添加远程库
$ git remote remove github  # 删除远程库url
$ git remote set-url origin git@github.com:stormhouse/test.git  # 修改远程库
$ git rename github github2  # 重命名

# 克隆
$ git clone http://your-ip:8080/gitbucket/git/your-groupv/repo-test.git

# pull
$ git pull
$ git fetch origin/github master/branch

# push
$ git push origin/github master/branch
# push所有分支 及 标签
$ git push origin --all / --tags

# 远程分支操作
$ git push origin :develop  # 删除远程分支
$ git branch -a  # 查看远程分支
$ git checkout -b develop origin/develop  # 检出远程分支
```
#### 本地
```
$ git add .
$ git add . -u
$ git commit -m '修改了bug'

# 分支
$ git branch
$ git branch develop  #新建
$ git checkout master #切换
$ git merge develop   #合并develop到master
$ git checkout -b dev master  #基于master创建dev分支，并切换dev分支
```
tag

```
$ git tag
$ git tag -a v1.0 -m 'comment'
$ git push --tags
$ git push origin :refs/tags/v2.0  # 删除远程tagv2.0
```

## 常见错误
```
Error pulling origin: error: Your local changes to the following files would be overwritten by merge
$ git clean -d -fx
```
