## Package Control

``` Control + ` ```打开控制台，输入：

```
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
```

重起，Preferences -> Package Settings -> Package Control

## Plugins
#### markdown preview

`cmd+shift+p` -> `install Pakage` -> `markdown preview`
使用markdown preview

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

##Front-End

-- Alignment
-- Emmet 
-- **[Java​Script & Node​JS Snippets][0]**
-- **[SublimeText-Nodejs][1]**

```
{
  "cmd": ["${NODE_PATH}/node", "$file", "$file_base_name"],
  "working_dir": "${project_path:${folder}}",
  "selector": "*.js"
}
```


## C

** SublimeClang **

```
{
  "cmd": ["gcc", "${file}", "-o", "${file_path}/${file_base_name}"],
  "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
  "working_dir": "${file_path}",
  "selector": "source.c",

  "variants":
  [
    {
      "name": "Run",
      "cmd": ["bash", "-c", "gcc '${file}' -o '${file_path}/${file_base_name}' &&     '${file_path}/${file_base_name}'"]
    }
  ]
}
```


[0]:https://sublime.wbond.net/packages/JavaScript%20%26%20NodeJS%20Snippets
[1]:https://github.com/tanepiper/SublimeText-Nodejs/tree/sublime-text-3
