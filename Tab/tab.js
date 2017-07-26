function tab(obj) {
    $.extend(this, {
        isDropdown: false,
        number: 0,
        speed: 150
    }, obj);
    this.init();
}
tab.prototype = {
    innerHTML: function () {
        var self = this,
            html = '',
            dropDownDom = '';
        self.circleDom = $('.' + self.circleDomClass);
        $.each(self.data, function (index, item) {
            html += '<li class="tab-list oneline" index="' + index + '">' + item[self.nodeName] + '</li>';
            dropDownDom += '<li class="main-list oneline" index="' + index + '">' + item[self.nodeName] + '</li>';
        })
        html = '<ul class="tab">' + html + '</ul>';
        // 加入下拉模块
        if (self.isDropdown) {
            // 加入箭头
            html += '<div class="arrow-circle"><img src="./arrow.png" class="arrow"></div>';
            // 加入下拉元素
            html += '<ul class="main-block clear none">' + dropDownDom + '</div>';
        }
        self.circleDom[0].innerHTML = html;
        self.tabDom = self.circleDom.find('.tab');
        self._width = self.circleDom.width();
        self.tabWidth = self.tabDom.width();
        self.isNeedSlide = self.tabDom[0].scrollWidth > self.tabWidth;  // 判断元素自由长度时是否不足容器宽度、是：true,不是：false
        self.setCss();
        self.addEvents();
        self.tabDom.find('li').eq(self.number).click();
    },
    addEvents: function () {
        var self = this;
        // 点击tab元素
        self.tabDom.find('li').off('click').on('click', function (e) {
            //隐藏下拉元素
            if (self.isDropdown && self.circleDom.find('.arrow').hasClass('arrow-trans')) {
                self.circleDom.find('.arrow').removeClass('arrow-trans');
                self.circleDom.find('.main-block').addClass('none');
                //隐藏回调
                self.arrowHideCallback && self.arrowHideCallback();
            }
            self.number = $(e.target).attr('index');
            self.timer && clearInterval(self.timer); //清除计时器
            // 切换活跃状态
            $(this).addClass('active').siblings().removeClass('active');
            // 更改下拉元素css
            $(self.circleDom.find('.main-list')[self.number]).addClass('active').siblings().removeClass('active');
            if (self.isNeedSlide) {
                // 滑动效果
                var distance = this.offsetLeft - (self.tabWidth - $(this).width()) / 2, // 元素应当滑动的位置
                    nowScrollLeft = self.tabDom.scrollLeft(),  // 最外层元素现在的滑动距离
                    diff = nowScrollLeft - distance, // 距离差
                    speed = diff > 0 ? -self.tabWidth / self.speed : self.tabWidth / self.speed; // 速度
                self.timer = setInterval(function () {
                    nowScrollLeft += speed;
                    self.tabDom.scrollLeft(nowScrollLeft);
                    if (nowScrollLeft <= distance && diff > 0) clearInterval(self.timer);
                    else if (nowScrollLeft > distance && diff < 0) clearInterval(self.timer);
                }, 0)
            }

            self.tabCallback && self.tabCallback($(e.target), self.number) // 回调
        });
        // 点击下拉箭头
        self.circleDom.find('.arrow-circle').off('click').on('click', function () {
            if (self.circleDom.find('.arrow').hasClass('arrow-trans')) {
                self.circleDom.find('.arrow').removeClass('arrow-trans');
                self.circleDom.find('.main-block').addClass('none');
                //隐藏回调
                self.arrowHideCallback && self.arrowHideCallback();
            } else {
                self.circleDom.find('.arrow').addClass('arrow-trans');
                self.circleDom.find('.main-block').removeClass('none');
                //展开回调
                self.arrowShowCallback && self.arrowShowCallback();
            }
        })
        // 点击下拉元素
        self.circleDom.find('.main-list').off('click').on('click', function (e) {
            self.number = $(e.target).attr('index');
            self.tabDom.find('li').eq(self.number).click();  //触发滑动点击
        })
    },
    /**
     * 设置初始化css
     */
    setCss: function () {
        var self = this;
        //判断是否自由扩展宽度
        !self.isNeedSlide && self.tabDom.find('li').css({ '-webkit-box-flex': '1', 'width': '0' })
        self.circleDom.find('.main-list').css({ width: Math.floor((self._width - 60) / 4) + 'px' })
    },
    init: function () {
        this.innerHTML();
    }
}
var dataList = [{ text: 'tab1' }, { text: 'tab2' }, { text: 'tab3' }, { text: 'tab4' }, { text: 'tab5' }, { text: 'tab6' }, { text: 'tab7' }]
var Tab = new tab({ circleDomClass: 'tab-circle', data: dataList, nodeName: 'text', speed: 150, number: 4, tabCallback: function (e, index) { console.log(e, index) }, isDropdown: false, arrowShowCallback: function () { console.log('show') }, arrowHideCallback: function () { console.log('hide') } });