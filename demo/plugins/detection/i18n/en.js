/**
 * I18N/en.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-8
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
(function(de){
  var I18N = de.I18N
  if(!I18N){
    var I18N = {};
  }
  I18N['en_us'] = {
    taskType: ['Now', 'Once', 'Periodically'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    from: 'From',
    to: 'To',
    date: 'Date',
    free: 'Free',
    busy: 'Busy',
    grq6: 'Minimum six(6) tests per day.',
    grq9: 'Recommended nine(9) tests per day.'
  }

  de.I18N = I18N;

})(StormDetection);

