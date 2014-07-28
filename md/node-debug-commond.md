## node debug test.js

[Node.js Debugger][1]

#### Watchers

```
watch('my_expression')
unwatch('my_expression')
watchers
```
#### Stepping

* cont, c - Continue execution
* next, n - Step next
* step, s - Step in
* out, o - Step out
* pause - Pause running code (like pause button in Developer Tools)

#### Breakpoints

- setBreakpoint(), sb() - Set breakpoint on current line
- setBreakpoint(line), sb(line) - Set breakpoint on specific line
- setBreakpoint('fn()'), sb(...) - Set breakpoint on a first statement in functions body
- setBreakpoint('script.js', 1), sb(...) - Set breakpoint on first line of script.js
- clearBreakpoint, cb(...) - Clear breakpoint

#### Info

- backtrace, bt - Print backtrace of current execution frame
- list(5) - List scripts source code with 5 line context (5 lines before and after)
- watch(expr) - Add expression to watch list
- unwatch(expr) - Remove expression from watch list
- watchers - List all watchers and their values (automatically listed on each breakpoint)
- repl - Open debugger's repl for evaluation in debugging script's context

#### Execution control

- run - Run script (automatically runs on debugger's start)
- restart - Restart script
- kill - Kill script

#### Various

- scripts - List all loaded scripts
- version - Display v8's version

## Advanced Usage

- node debug -p <pid> - Connects to the process via the pid
- node debug <URI> - Connects to the process via the URI such as localhost:5858

[1]:http://nodejs.org/api/debugger.html
