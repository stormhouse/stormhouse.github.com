/**
 * I18N/zh.js
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-8
 * Time: 上午9:50
 * To change this template use File | Settings | File Templates.
 */
(function(de){
  var I18N = de.I18N
  if(!I18N){
    var I18N = {};
  }
  I18N['zh_cn'] = {
    taskType: ['立即任务', '定时任务', '循环任务'],
    month: '月',
    day: '日',
    from: '从',
    to: '到',
    date: '日期',
    free: '空闲',
    busy: '占用',
    grq6: '每天至少测试6次.',
    grq9: '每天推荐测试9次.'
  }

  de.I18N = I18N;

})(StormDetection);

