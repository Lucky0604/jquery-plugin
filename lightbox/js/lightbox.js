;(function($) {

  alert(1)
  // 声明类
  var LightBox = function() {
    var _self = this;

    // 创建遮罩和弹出框
    this.popupMask = $('<div id="G-lightbox-mask">');
    this.popupWin = $('<div id="G-lightbox-popup">');

    // 保存BODY
    this.bodyNode = $(document.body);

    // 渲染剩余的DOM， 并且插入到BODY
    this.renderDOM();

    // 准备开发委托事件，获取组数据

  };

  // 给类原型添加一系列方法
  LightBox.prototype = {
    renderDOM: function() {
      var strDOM = '<div class="lightbox-pic-view">' +
                      '<span class="lightbox-btn lightbox-prev-btn"></span>' +
                      '<img src="images/2-2.jpg" alt="" class="lightbox-image" width="100%"/>' +
                      '<span class="lightbox-btn lightbox-next-btn"></span>' +
                    '</div>' +
                    '<div class="lightbox-pic-caption">' +
                      '<div class="lightbox-caption-area">' +
                        '<p class="lightbox-pic-desc"></p>' +
                        '<span class="lightbox-of-index">当前索引：0 of 0</span>' +
                      '</div>' +
                      '<span class="lightbox-close-btn"></span>' +
                    '</div>';
      // 插入到popupWin.html(strDOM)
      this.popupWin.html(strDOM);
      // 把遮罩和弹出框插入到BODY对象中
      this.bodyNode.append(this.popupMask, this.popupWin);
    }
  };

  // 注册到全局变量
  window['LightBox'] = LightBox;

})(jQuery)
