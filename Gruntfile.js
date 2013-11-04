
module.exports = function(grunt) {

  var path = require("path")

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    concat: {
      easyui: {
        files: {
          '<%= eui_css_build %>/jquery-eui.css': '<%=css_files %>',
//          '<%= eui_js_build %>/common.eui.panel/src/common.eui.panel.js': ['<%= eui_js_src %>/ht/head.js', '<%= eui_js_src %>/panel.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.accordion/src/common.eui.accordion.js': ['<%= eui_js_src %>/ht/accordion-h.js', '<%= eui_js_src %>/accordion.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.combo/src/common.eui.combo.js': ['<%= eui_js_src %>/ht/combo-h.js', '<%= eui_js_src %>/combo.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.combobox/src/common.eui.combobox.js': ['<%= eui_js_src %>/ht/combobox-h.js', '<%= eui_js_src %>/combobox.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.calendar/src/common.eui.calendar.js': ['<%= eui_js_src %>/ht/calendar-h.js', '<%= eui_js_src %>/calendar.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.datebox/src/common.eui.datebox.js': ['<%= eui_js_src %>/ht/datebox-h.js', '<%= eui_js_src %>/datebox.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.validatebox/src/common.eui.validatebox.js': ['<%= eui_js_src %>/ht/validatebox-h.js', '<%= eui_js_src %>/validatebox.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.spinner/src/common.eui.spinner.js': ['<%= eui_js_src %>/ht/spinner-h.js', '<%= eui_js_src %>/spinner.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.timespinner/src/common.eui.timespinner.js': ['<%= eui_js_src %>/ht/timespinner-h.js', '<%= eui_js_src %>/timespinner.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.eui.tooltip/src/common.eui.tooltip.js': ['<%= eui_js_src %>/ht/tooltip-h.js', '<%= eui_js_src %>/tooltip.js', '<%= eui_js_src %>/ht/tail.js'],
          '<%= eui_js_build %>/common.frequency/src/common.frequency.js': ['<%= eui_js_src %>/ht/frequency-h.js', '<%= eui_js_src %>/frequency.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.taskcreate.wizard/src/common.taskcreate.wizard.js': ['<%= eui_js_src %>/ht/head.js', '<%= eui_js_src %>/wizard.js', '<%= eui_js_src %>/ht/tail.js'],
//          '<%= eui_js_build %>/common.comboflag/src/common.comboflag.js': ['<%= eui_js_src %>/ht/head.js', '<%= eui_js_src %>/comboflag.js', '<%= eui_js_src %>/ht/tail.js']
        }
      },
      detection: {
        files: {
          '<%= eui_css_build %>/detection.css': '<%=d_css %>',
          "<%= eui_js_build %>/common.detection/src/common.detection.js": '<%=d_files%>'
        }
      },
//      seajs: {
//        src: [
//          "src/aa.js",
//          "src/bb.js"
//        ],
//        dest: "dist/build.js"
//      }
    },
//    css_files: ['<%= eui_css_src %>/eui-validatebox.css', '<%= eui_css_src %>/eui-panel.css', '<%= eui_css_src %>/eui-accordion.css', '<%= eui_css_src %>/eui-combo.css', '<%= eui_css_src %>/eui-combobox.css', '<%= eui_css_src %>/eui-calendar.css', '<%= eui_css_src %>/eui-datebox.css', '<%= eui_css_src %>/eui-spinner.css', '<%= eui_css_src %>/eui-tooltip.css', '<%= eui_css_src %>/eui-frequency.css', '<%= eui_css_src %>/jquery.taskcreate.wizard.css'],
    eui_css_src: "demo/plugins/easyui/css",
    d_src: 'demo/plugins/detection',
    d_css: 'demo/plugins/detection/css/detection.css',
    d_files: ['<%= d_src %>/head.js', '<%= d_src %>/js/storm.js', '<%= d_src %>/js/platform.js', '<%= d_src %>/js/dom.js', '<%= d_src %>/js/graphics.js', '<%= d_src %>/js/date-time.js', '<%= d_src %>/js/sorted-array.js', '<%= d_src %>/js/event-index.js', '<%= d_src %>/js/unit.js', '<%= d_src %>/storm-detection.js', '<%= d_src %>/i18n/zh.js', '<%= d_src %>/i18n/en.js', '<%= d_src %>/band.js', '<%= d_src %>/left-part.js', '<%= d_src %>/right-part.js', '<%= d_src %>/themes.js', '<%= d_src %>/ethers.js', '<%= d_src %>/ether-painters.js', '<%= d_src %>/original-painter.js', '<%= d_src %>/labellers.js', '<%= d_src %>/sources.js', '<%= d_src %>/event-utils.js', '<%= d_src %>/unit.js', '<%= d_src %>/tail.js' ],
    css_files: '<%= eui_css_src %>/*.css',
    "eui_js_src": "demo/plugins/easyui/js",
//    "eui_css_build": "src/easyui/build",
//    "eui_js_build": "src/easyui/build",
    "eui_css_build": "E:/work/roamer-space/roamer-parent/roamer-web-customer/src/main/webapp/style/default/css",
    "eui_js_build": "E:/work/roamer-space/roamer-parent/roamer-web-customer/src/main/webapp/assets/ra-modules/common",
  })
  grunt.loadNpmTasks("grunt-contrib-concat")

}

