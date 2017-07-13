function tab(obj) {
    $.extend(this, {
        startNumber: 0,
        speed: 150
    }, obj);
    this.circleDom = $('.' + this.circleDomClass);
    this._width = this.circleDom.width();
    this.isNeedSlide = this.circleDom.find('ul')[0].scrollWidth > this.circleDom.find('ul').width();  // 判断元素自由长度时是否不足容器宽度、是：true,不是：false
    this.init();
}
tab.prototype = {
    addEvents: function () {
        var self = this;
        self.circleDom.find('li').off('click').on('click', function (e) {
            self.timer && clearInterval(self.timer); //清除计时器
            // 切换活跃状态
            $(this).addClass('active').siblings().removeClass('active');
            if (self.isNeedSlide) {
                // 滑动效果
                var distance = this.offsetLeft - (self._width - $(this).width()) / 2, // 元素应当滑动的位置
                    nowScrollLeft = self.circleDom.scrollLeft(),  // 最外层元素现在的滑动距离
                    diff = nowScrollLeft - distance, // 距离差
                    speed = diff > 0 ? -self._width / self.speed : self._width / self.speed; // 速度
                self.timer = setInterval(function () {
                    nowScrollLeft += speed;
                    self.circleDom.scrollLeft(nowScrollLeft);
                    if (nowScrollLeft <= distance && diff > 0) clearInterval(self.timer);
                    else if (nowScrollLeft > distance && diff < 0) clearInterval(self.timer);
                }, 0)
            }
            self.callback && self.callback($(e.target)) // 回调
        })
    },
    /**
     * 设置初始化css
     */
    setCss: function () {
        var self = this;
        //判断是否自由扩展宽度
        !self.isNeedSlide && self.circleDom.find('li').css({ '-webkit-box-flex': '1', 'width': '0' })
    },
    init: function () {
        this.setCss();
        this.addEvents();
        this.circleDom.find('li').eq(this.startNumber).click()
    }
}
var Tab = new tab({ circleDomClass: 'tab', speed: 150, startNumber: 4, callback: function (e) { console.log(e) } });