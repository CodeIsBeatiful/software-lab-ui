<template>
  <div>
    <div id="terminal" ref="terminal"/>
  </div>
</template>

<script>

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
// import { AttachAddon } from 'xterm-addon-attach'
import { WebLinksAddon } from 'xterm-addon-web-links'
// 这个特别重要,一定要在开头就引入css,否则可能会导致样式错误
import 'xterm/css/xterm.css'

export default {
  name: 'WebShell',
  data() {
    return {
      socket: '',
      term: null
    }
  },
  mounted() {
    // 实例化终端并设置参数
    this.term = new Terminal({
      cursorBlink: true
    })

    // 加载自适应组件
    this.fitAddon = new FitAddon()
    this.term.loadAddon(this.fitAddon)

    // 加载weblink组件
    this.term.loadAddon(new WebLinksAddon())

    // 在绑定的组件上初始化窗口
    this.term.open(this.$refs.terminal)

    // 窗口初始化后,按照浏览器窗口自适应大小
    this.fitAddon.fit()

    // 聚焦
    this.term.focus()

    // 创建ws实例
    // 这里还把窗口的column和row传入后端,使其能自动针对前端窗口边框改为输出
    // this.socket = new WebSocket(`ws://127.0.0.1:8080/api/ws/test?cols=${this.term.cols}&rows=${this.term.rows}'`)
    // xterm的socket组件与websocket实例结合
    // const attachAddon = new AttachAddon(this.socket)
    // this.term.loadAddon(attachAddon)

    // 参考官方demo
    // https://github.com/xtermjs/xterm.js/blob/master/demo/client.ts
    this.term.prompt = () => {
      this.term.write('\r\n$ ')
    }

    this.term.writeln('Welcome to Software Lab')
    this.term.writeln('Software Lab allows you to quickly get an application with one click')
    this.term.writeln('')
    this.term.prompt()

    this.term.onKey((e) => {
      const ev = e.domEvent
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey

      if (ev.keyCode === 13) { // Enter
        this.term.prompt()
        // todo do some
      } else if (ev.keyCode === 8) { // Backspace
        // Do not delete the prompt
        if (this.term._core.buffer.x > 2) {
          this.term.write('\b \b')
        }
      } else if (printable) {
        this.term.write(e.key)
      }
    })

    this.term.onLineFeed((obj) => {
      console.info(obj)
    })

    // 监听resize,当窗口拖动的时候,监听事件,实时改变xterm窗口
    window.addEventListener('resize', this.debounce(this.resizeScreen, 1500), false)
  },
  methods: {
    // 节流,避免拖动时候频繁向后端请求更新
    debounce(fn, wait) {
      let timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    },
    // 页面重新resize的时候,需要重新告诉后端cols和rows
    resizeScreen() {
      // 对xterm的窗口重新fit,获取新的cols和rows
      this.fitAddon.fit()
      this.socket.send(JSON.stringify([this.term.cols, this.term.rows]))
    }
  }

}
</script>
