function scrollSlide(obj) {
    var defaultObj = {
        startpoi: 0,  //点击时的坐标
        distancepoi: 0,  //移动时的坐标
        callback: function () { },  //回调
        transitionTime: 0.5,  //回调函数
        intervalTime: 3000,  //滑动间隔的时间
        range: 80,  //整屏滑动所需滑动距离
        width: $('body').width(),  //单个容器的宽度
        height: $('body').height() //单个容器的高度
    };
    $.extend(this, defaultObj, obj);
    this.totalcount = this.childDom.length;  //滑动页面数
    this.totalcount == 1 && (this.loop = false);
    this.isScroll = 0; //控制自由滑动的参数 0:初始化 1:轮播滑动 2：普通页面滚动
    this.length = this.horizontal ? this.width : this.height; //垂直滑动则为高度，水平滑动则为宽度
    this.count = !this.loop ? (obj.count ? ((obj.count - 1) % this.totalcount) : 0) : (obj.count ? (obj.count % this.totalcount == 0 ? this.totalcount : obj.count % this.totalcount) : 1); //当前页面，默认从第一个开始
    this.init();
}
scrollSlide.prototype = {
    /**
     *绑定事件
     */
    bindEvents: function () {
        var self = this;
        self.parentDom.on("touchstart", self.startFnc.bind(self));
        self.parentDom.on("touchmove", self.touchFnc.bind(self));
        self.parentDom.on("touchend", self.endFnc.bind(self));
    },
    /**
     * 开始触摸的回调
     */
    startFnc: function (event) {
        var self = this,
            touches = event.touches ? event.touches : event.originalEvent.touches;
        self.isScroll = 0; //每次滑动开始初始化参数
        if (self.loop) {
            self.count == self.totalcount + 1 && (self.count = 1);
            self.count == 0 && (self.count = self.totalcount);
        }
        self.distancepoi = 0; //滑动距离重置，防止点击后直接滑动
        self.startpoi = self.horizontal ? touches[0].pageX : touches[0].pageY;
        self.startpoiReverse = self.horizontal ? touches[0].pageY : touches[0].pageX; //控制横向轮播时上下滑动的参数
        self.movelength = -self.count * self.length;  //记录上次滑动距离
        self.setCssStyle(self.movelength, 0); //防止
    },
    /**
     * 触摸中的回调
     */
    touchFnc: function (event) {
        var self = this,
            touches = event.touches ? event.touches : event.originalEvent.touches;
        if (self.isScroll == 2) {
            console.log(1)
            return;
        }
        self.distancepoi = (self.horizontal ? touches[0].pageX : touches[0].pageY) - self.startpoi;
        if (self.isScroll == 0 ) {
            self.distancepoiReverse = (self.horizontal ? touches[0].pageY : touches[0].pageX) - self.startpoiReverse;
            self.isScroll = Math.abs(self.distancepoiReverse) > Math.abs(self.distancepoi) ? 2 : 1;
            if (self.isScroll == 2) return;
            else event.preventDefault();
        }
        if (!self.loop && !self.resilience && ((self.count == 0 && self.distancepoi > 0) || (self.count == (self.totalcount - 1) && self.distancepoi < 0))) return; //上下两端拉动无效果,禁止回弹
        self.setCssStyle(self.distancepoi + self.movelength, 0);  //滑动中...
    },
    /**
     * 触摸结束的回调
     */
    endFnc: function (event) {
        var self = this, interimCount = self.count;
        if(self.isScroll == 2) return;
        if (!self.loop) {
            if (self.distancepoi >= self.range && self.count > 0) self.count--; //下滑--右划
            else if (self.distancepoi <= -self.range && self.count < self.totalcount - 1) self.count++; //上划--左划
        }
        else {
            if (self.distancepoi >= self.range && self.count > 0) self.count--;//下滑--右划
            else if (self.distancepoi <= -self.range && self.count < self.totalcount + 1) self.count++; //上划--左划
        }
        self.setCssStyle(-self.count * self.length, self.transitionTime); //实时滑动距离
        if (self.auto && self.loop) {
            clearTimeout(self.timer);
            self.timer = setTimeout(self.play.bind(self), self.intervalTime);
        }
        interimCount != self.count && self.callbackloopType != 2 && self.callback(self.count, self.totalcount);
        self.dot && self.totalcount != 1 && self.changeDot();
    },
    /**
     * 自动播放
     */
    autoPlay: function () {
        var self = this;
        self.timer = setTimeout(self.play.bind(self), self.intervalTime);
    },
    /**
     * 自动播放逻辑
     */
    play: function () {
        var self = this;
        if (!self.reverse) {  //自动上滑
            self.count == self.totalcount + 1 && (self.count = 1) && (self.setCssStyle(-self.count * self.length, 0))
            self.count++;
        }
        else {  //自动下滑
            self.count == 0 && (self.count = self.totalcount) && (self.setCssStyle(-self.count * self.length, 0));
            self.count--;
        }
        setTimeout(function () {
            self.setCssStyle(-self.count * self.length, self.transitionTime);
            self.dot && self.totalcount != 1 && self.changeDot();
            clearTimeout(self.timer);
            self.timer = setTimeout(self.play.bind(self), self.intervalTime);
            self.callbackloopType != 1 && self.callback(self.count, self.totalcount);
        }, 50)
    },
    /**
     * 设置css样式
     * @param length
     * @param time
     */
    setCssStyle: function (length, time) {
        var self = this;
        self.parentDom.css({
            'transform': !self.horizontal ? ('translate3d(0,' + length + 'px,0)') : ('translate3d(' + length + 'px,0,0)'),
            '-webkit-transform': !self.horizontal ? ('translate3d(0,' + length + 'px,0)') : ('translate3d(' + length + 'px,0,0)'),
            'transition': time + 's',
            '-webkit-transition': time + 's'
        });
    },
    /**
     * 增加小圆点
     */
    addDot: function () {
        var self = this, dotHtml = '<ul class="dot-list" ontouchmove="return false;">';
        for (var i = 0; i < self.totalcount; i++) {
            dotHtml += '<li class="dot"></li>';
        }
        dotHtml += '</ul>';
        self.outDom.append(dotHtml);
        !self.loop ? ($(self.outDom.find('.dot')[self.count]).addClass('active')) : ($(self.outDom.find('.dot')[self.count - 1]).addClass('active')); //此时的count为初始态count，标志着起初页面为第几个
    },
    /**
     * 初始化方法
     */
    init: function () {
        //初始化监听事件和圆点
        this.parentDom.off();
        this.outDom.find('.dot-list').remove();
        this.dot && this.totalcount != 1 && this.addDot();
        this.childDom.css({ 'height': this.height + 'px', 'width': this.width + 'px' });
        this.outDom.css({ 'height': this.height + 'px', 'width': this.width + 'px' });
        this.parentDom.css('width', (this.loop ? this.width * (this.totalcount + 2) : (this.width * this.totalcount)) + 'px');
        this.horizontal && (this.parentDom.css({ 'display': '-webkit-box' }));
        this.loop && (this.parentDom.append(this.childDom[0].outerHTML)) && ($(this.childDom[this.totalcount - 1].outerHTML).insertBefore(this.childDom[0])); //可循环则新增一个元素
        this.setCssStyle(-this.count * this.length, 0);
        this.firstCallback && this.callback(this.count, this.totalcount);
        this.loop && this.auto && this.totalcount != 1 && this.autoPlay();
        !this.bantouch && this.totalcount != 1 && this.bindEvents();
    }
    ,
    /**
     * 更新dot状态
     */
    changeDot: function () {
        var self = this, activeCount;
        activeCount = self.loop ? (self.count == 0 ? (self.totalcount - 1) : (self.count == (self.totalcount + 1) ? 0 : self.count - 1)) : self.count;
        $(self.outDom.find('.dot')[activeCount]).addClass('active').siblings().removeClass('active');
    }
}
