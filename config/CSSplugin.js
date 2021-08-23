let defaultSettings = require('./defaultSettings');

module.exports = {
  install: function(less, pluginManager, functions) {
    functions.add('headerHeight', function() {
      return new less.tree.Dimension(defaultSettings.default.headerHeight, 'px')
    })
    functions.add('siderWidth', function() {
      return new less.tree.Dimension(defaultSettings.default.siderWidth, 'px')
    })
  }
}
