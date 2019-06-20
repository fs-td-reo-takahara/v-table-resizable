export default {
  install(Vue, getOptions) {
    Vue.directive('resizable', {
      inserted(el) {
        var options = getOptions();
        const nodeName = el.nodeName;
        const rOpt = options.resizable;
        if (['table', 'th'].indexOf(rOpt) < 0) return;
        if (['TABLE', 'THEAD'].indexOf(nodeName) < 0) return;

        const table = nodeName === 'TABLE' ? el : el.parentElement;
        const thead = table.querySelector('thead');
        const ths = thead.querySelectorAll('th');
        var prevX = 0;
        var movementX = 0;
        function mousemove(e) {
            movementX = (prevX ? e.screenX - prevX : 0);
            prevX = e.screenX;
        }

        const resizeContainer = document.createElement('div');
        table.style.position = 'relative';
        resizeContainer.style.position = 'relative';
        resizeContainer.style.width = table.offsetWidth + 'px';
        resizeContainer.className = "vue-columns-resizable";
        table.parentElement.insertBefore(resizeContainer, table);

        let moving = false;
        let movingIndex = 0;
        const doResize = () => {
          const resizeContainer = document.getElementsByClassName("vue-columns-resizable")[0];
          while (resizeContainer.firstChild) {
            resizeContainer.removeChild(resizeContainer.firstChild);
          }
          ths.forEach((th, index) => {
            const trs = table.querySelectorAll("tr");
            trs.forEach((tr, i) => {
              if (i !== 0 && tr) {
               const td = tr.cells[index];
               if (td) {
                  td.style.width = th.offsetWidth + 'px';
               }
              }
            });
            th.style.width = th.offsetWidth + 'px';
  
            if (index + 1 >= ths.length) return;
  
            const nextTh = ths[index + 1];
            const bar = document.createElement('div');
            const barHeight = rOpt === 'th' ? th.offsetHeight : table.offsetHeight;
            bar.style.position = 'absolute';
            bar.style.left = nextTh.offsetLeft - 4 + 'px';
            bar.style.top = 0;
            bar.style.height = barHeight + 'px';
            bar.style.width = '8px';
            bar.style.cursor = 'col-resize';
            bar.style.zIndex = 1;
            bar.className = 'columns-resize-bar';
  
            bar.addEventListener('mousedown', () => {
              moving = true;
              movingIndex = index;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            });
  
            resizeContainer.appendChild(bar);
          });
        };
        doResize();
        if (options.addResizeCallback)
        {
          if (typeof options.addResizeCallback === 'function') {
            options.addResizeCallback(doResize);
          }
          else
          {
            options.addResizeCallback(() => {});
          }
        }

        const bars = resizeContainer.querySelectorAll('.columns-resize-bar');

        document.addEventListener('mouseup', () => {
          if (!moving) return;
          
          moving = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          doResize();
        });

        const cutPx = str => +str.replace('px', '');

        const handleResize = e => {
          if (moving) {
            const th = ths[movingIndex];
            const nextTh = ths[movingIndex + 1];
            const bar = bars[movingIndex];
            const trs = table.querySelectorAll("tr");
            mousemove(e);
            trs.forEach((tr, index) => {
              if (index !== 0 && tr) {
               const td = tr.cells[movingIndex];
               const nextTd = tr.cells[movingIndex + 1];
               if (td) {
                td.style.width = cutPx(th.style.width) +(e.movementX ? e.movementX : movementX) + 'px';
               }
               if (nextTd)
               {
                nextTd.style.width = cutPx(nextTh.style.width) - (e.movementX ? e.movementX : movementX) + 'px';
               }
              }
            });
            th.style.width = cutPx(th.style.width) + e.movementX + 'px';
            nextTh.style.width = cutPx(nextTh.style.width) - e.movementX + 'px';
            bar.style.height = (rOpt === 'th' ? th.offsetHeight : table.offsetHeight) + 'px';
            bar.style.left = nextTh.offsetLeft - 4 + e.movementX + 'px';
            doResize();
          }
        };
        
        resizeContainer.addEventListener('mousemove', handleResize);
        table.addEventListener('mousemove', handleResize);
      },
    });

  },
};
