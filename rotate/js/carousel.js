;
(function($) {
  var Carousel = function(poster) {
    var _self = this;
    // 保存单个旋转木马对象
    this.poster = poster;
    this.posterItemMain = poster.find("ul.poster-list");
    this.nextBtn = poster.find("div.poster-next-btn");
    this.prevBtn = poster.find("div.poster-prev-btn");
    this.posterItems = poster.find('li.poster-item');
    // 解决偶数帧问题
    if (this.posterItems.size() % 2 == 0) {
      this.posterItemMain.append(this.posterItems.eq(0).clone());
      this.posterItems = this.posterItemMain.children();
    }
    this.posterFirstItem = this.posterItems.first();
    this.posterLastItem = this.posterItems.last();
    this.rotateFlag = true;
    // 默认配置参数
    this.setting = {
      "width": 1000, // 幻灯片宽度
      "height": 270, // 幻灯片高度
      "posterWidth": 640, // 幻灯片第一帧的宽度
      "posterHeight": 270, // 幻灯片第一帧的高度
      "verticalAlign": "middle", // top bottom
      "scale": 0.9, // 记录显示比例关系
      "speed": 500, // 图片切换速度
      "autoPlay": false, // 是否自动轮播
      "delay": 5000 //自动轮播延迟
    };
    $.extend(this.setting, this.getSetting());
    this.setSettingValue();
    this.setPosterPos();

    //点击事件
    this.nextBtn.click(function() {
      // 解决多次鼠标点击切换时的bug
      if (_self.rotateFlag) {
        _self.rotateFlag = false;
        _self.carouselRotate("left");
      }

    });
    this.prevBtn.click(function() {
      if (_self.rotateFlag) {
        _self.rotateFlag = false;
        _self.carouselRotate("right");
      }
    });

    // 是否开启自动轮播
    if (this.setting.autoPlay) {
      this.autoPlay();
      this.poster.hover(function() {
        window.clearInterval(_self.timer);
      }, function() {
        _self.autoPlay();
      });
    }
  };
  Carousel.prototype = {
      //自动轮播
      autoPlay: function() {
        var _this = this;
        this.timer = window.setInterval(function() {
          _this.nextBtn.click();
        }, this.setting.delay);
      },

      // 旋转
      carouselRotate: function(dir) {
        var _this = this;
        var zIndexArr = [];
        if (dir === 'left') {
          this.posterItems.each(function() {
            var self = $(this);
            var prev = self.prev().get(0) ? self.prev() : _this.posterLastItem;
            var width = prev.width(),
              height = prev.height(),
              zIndex = prev.css('zIndex'),
              opacity = prev.css('opacity'),
              left = prev.css('left'),
              top = prev.css('top')
            zIndexArr.push(zIndex);

            self.animate({
              width: width,
              height: height,
              // zIndex: zIndex,
              opacity: opacity,
              left: left,
              top: top
            }, _this.setting.speed, function() {
              _this.rotateFlag = true;
            });
          })
          this.posterItems.each(function(i) {
            $(this).css('zIndex', zIndexArr[i]);
          })
        } else if (dir === 'right') {
          this.posterItems.each(function() {
            var self = $(this);
            var next = self.next().get(0) ? self.next() : _this.posterFirstItem;
            var width = next.width(),
              height = next.height(),
              zIndex = next.css('zIndex'),
              opacity = next.css('opacity'),
              left = next.css('left'),
              top = next.css('top')
            zIndexArr.push(zIndex);

            self.animate({
              width: width,
              height: height,
              // zIndex: zIndex,
              opacity: opacity,
              left: left,
              top: top
            }, _this.setting.speed, function() {
              _this.rotateFlag = true;
            });
          })
        };
        this.posterItems.each(function(i) {
          $(this).css('zIndex', zIndexArr[i]);
        })
      },

      //设置剩余的帧的位置关系
      setPosterPos: function() {
        var _self = this;
        var sliceItems = this.posterItems.slice(1);
        var sliceSize = sliceItems.size() / 2;
        var rightSlice = sliceItems.slice(0, sliceSize);
        var level = Math.floor(this.posterItems.size() / 2);
        //左边帧的散列关系
        var leftSlice = sliceItems.slice(sliceSize);
        // 设置右边帧的位置关系，宽度 高度 top
        //右边第一帧的宽度
        var rightWidth = this.setting.posterWidth,
          rightHeight = this.setting.posterHeight,
          //每一帧的间隙
          gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;

        var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
        var fixOffsetLeft = firstLeft + rightWidth
        rightSlice.each(function(i) {
          level--;
          rightWidth = rightWidth * _self.setting.scale;
          rightHeight = rightHeight * _self.setting.scale;
          var j = i;

          $(this).css({
            zIndex: level,
            width: rightWidth,
            height: rightHeight,
            opacity: 1 / (++j),
            left: fixOffsetLeft + (++i) * gap - rightWidth,
            top: _self.setVerticalAlign(rightHeight)
          })
        });

        //设置左边的位置关系
        var leftWidth = rightSlice.last().width();
        var leftHeight = rightSlice.last().height();
        var oloop = Math.floor(this.posterItems.size() / 2)
        leftSlice.each(function(i) {

          $(this).css({
            zIndex: i,
            width: leftWidth,
            height: leftHeight,
            opacity: 1 / oloop,
            left: i * gap,
            top: _self.setVerticalAlign(leftHeight)

          });
          leftWidth = leftWidth / _self.setting.scale;
          leftHeight = leftHeight / _self.setting.scale
          oloop--;
        })
        console.log(level);
      },

      // 设置垂直排列对齐
      setVerticalAlign: function(height) {

        var verticalType = this.setting.verticalAlign;
        var top = 0;
        /*
        if (verticalType === 'middle') {
          top = (this.setting.height - height) / 2;
        } else if (verticalType === 'top') {
          top = 0;
        } else if (verticalType === 'bottom') {
          top = this.setting.height - height;
        } else {
          top = (this.setting.height - height) / 2;
        }*/
        switch (verticalType) {
          case 'middle':
            top = (this.setting.height - height) / 2
            break;
          case 'top':
            top = 0;
            break;
          case 'bottom':
            top = this.setting.height - height;
            break;
          default:
            top = (this.setting.height - height) / 2;
        }

        return top;
      },

      // 设置配置参数值与控制基本的宽度高度
      setSettingValue: function() {
        this.poster.css({
          width: this.setting.width,
          height: this.setting.height
        });
        this.posterItemMain.css({
          width: this.setting.width,
          height: this.setting.height
        });
        //计算上下切换按钮的宽度
        var w = (this.setting.width - this.setting.posterWidth) / 2;
        this.nextBtn.css({
          width: w,
          height: this.setting.height,
          zIndex: Math.ceil(this.posterItems.size() / 2)
        });
        this.prevBtn.css({
          width: w,
          height: this.setting.height,
          zIndex: Math.ceil(this.posterItems.size() / 2)
        });
        this.posterFirstItem.css({
          width: this.setting.posterWidth,
          height: this.setting.posterHeight,
          left: w,
          //第一帧z-index是所有items数量除以2向下取整，因为最底部z-index索引为0
          zIndex: Math.floor(this.posterItems.size() / 2)
        })
      },

      //获取人工配制
      getSetting: function() {
        var setting = this.poster.attr('data-setting');
        if (setting && setting != '') {
          return $.parseJSON(setting);
        } else {
          return {};
        };
        return setting;
      }
    }
    // 初始化函数，传递参数为一个集合
  Carousel.init = function(posters) {
    var _this = this;
    posters.each(function() {
      new _this($(this));
    })
  }

  window['Carousel'] = Carousel;
})(jQuery);
