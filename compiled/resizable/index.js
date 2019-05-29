'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  install: function install(Vue) {
    Vue.directive('resizable', {
      inserted: function inserted(el) {
        var nodeName = el.nodeName;
        var rOpt = el.dataset.rOpt;
        if (['table', 'th'].indexOf(rOpt) < 0) return;
        if (['TABLE', 'THEAD'].indexOf(nodeName) < 0) return;

        var table = nodeName === 'TABLE' ? el : el.parentElement;
        var thead = table.querySelector('thead');
        var ths = thead.querySelectorAll('th');
        var barHeight = rOpt === 'th' ? thead.offsetHeight : table.offsetHeight;

        var resizeContainer = document.createElement('div');
        table.style.position = 'relative';
        resizeContainer.style.position = 'relative';
        resizeContainer.style.width = table.offsetWidth + 'px';
        resizeContainer.className = "vue-columns-resizable";
        table.parentElement.insertBefore(resizeContainer, table);

        var moving = false;
        var movingIndex = 0;

        ths.forEach(function (th, index) {
          th.style.width = th.offsetWidth + 'px';

          if (index + 1 >= ths.length) return;

          var nextTh = ths[index + 1];
          var bar = document.createElement('div');

          bar.style.position = 'absolute';
          bar.style.left = nextTh.offsetLeft - 4 + 'px';
          bar.style.top = 0;
          bar.style.height = barHeight + 'px';
          bar.style.width = '8px';
          bar.style.cursor = 'col-resize';
          bar.style.zIndex = 1;
          bar.className = 'columns-resize-bar';

          bar.addEventListener('mousedown', function () {
            moving = true;
            movingIndex = index;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          });

          resizeContainer.appendChild(bar);
        });

        var bars = resizeContainer.querySelectorAll('.columns-resize-bar');

        document.addEventListener('mouseup', function () {
          if (!moving) return;

          moving = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';

          bars.forEach(function (bar, index) {
            var th = ths[index];
            var nextTh = ths[index + 1];
            th.style.width = th.offsetWidth + 'px';
            bar.style.left = nextTh.offsetLeft - 4 + 'px';
          });
        });

        var cutPx = function cutPx(str) {
          return +str.replace('px', '');
        };

        var handleResize = function handleResize(e) {
          if (moving) {
            var th = ths[movingIndex];
            var nextTh = ths[movingIndex + 1];
            var bar = bars[movingIndex];
            th.style.width = cutPx(th.style.width) + e.movementX + 'px';
            nextTh.style.width = cutPx(nextTh.style.width) - e.movementX + 'px';
            bar.style.left = nextTh.offsetLeft - 4 + e.movementX + 'px';
          }
        };

        resizeContainer.addEventListener('mousemove', handleResize);
        table.addEventListener('mousemove', handleResize);
      }
    });
  }
};