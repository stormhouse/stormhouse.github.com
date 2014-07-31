## 安装Package Control

``` Control + ` ```打开控制台，输入：

```
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
```

重起，Preferences -> Package Settings -> Package Control

## 安装markdown preview

`cmd+shift+p` -> `install Pakage` -> `markdown preview`
#### 使用markdown preview

`cmd+shift+p` -> `Preview in Browser`

设置快捷键，`Preferences` -> `Key Bindings User`

```
{ "keys": ["alt+m"], "command": "markdown_preview", "args": { "target": "browser"} }
```
设置语法高亮和mathjax支持,`Preferences` -> `Package Settings` -> `Markdown Preview` -> `Setting Default` 中的第31行和36行：

```
"enable_mathjax": true,
"enable_highlight": true,
```




[1]: http://blog.guorunmin.cn/blog/2014/03/12/sublime-text-2-xia-de-markdownxie-zuo/
