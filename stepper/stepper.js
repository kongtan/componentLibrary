function stepper(obj) {
    var self = this;
    $.extend(this, {
        value: 1,
        minCount: 0,
        maxCount: 5,
        diffValue: 1,
        needInput: false
    }, obj);
    this.diffValue = Math.abs(this.diffValue);
    this.maxCount = this.minCount > this.maxCount ? tis.minCount : this.maxCount;
    this.value = this.value > this.maxCount ? this.maxCount : this.value < this.minCount ? this.minCount : this.value;
    this.update();
    this.init();
}
stepper.prototype = {
    /**
     * 更改数目
     * @param tag delete减少 add增加
     */
    changeCount: function (tag) {
        var self = Stepper,
            objFnc = {
                delete: function () {
                    if (self.value == self.minCount) return;
                    else {
                        self.value -= self.diffValue;
                        self.value = self.value < self.minCount ? self.minCount : self.value;
                    }
                },
                add: function () {
                    console.log(121221)
                    if (self.value == self.maxCount) return;
                    else {
                        self.value += self.diffValue;
                        self.value = self.value > self.maxCount ? self.maxCount : self.value;
                    }
                }
            }
        objFnc[tag] && objFnc[tag]();
        self.update();
    },
    /**
     * 更新状态
     * @param noUpDate 是否需要刷新值 默认为false
     */
    update: function (noUpDate) {
        !noUpDate && this.circleDom.find('.stepper-value').val(this.value);
        this.value >= this.maxCount ? this.circleDom.find('.stepper-add').addClass('stepper-add-normal') : this.circleDom.find('.stepper-add').removeClass('stepper-add-normal');
        this.value <= this.minCount ? this.circleDom.find('.stepper-delete').addClass('stepper-delete-normal') : this.circleDom.find('.stepper-delete').removeClass('stepper-delete-normal');
        this.callback && this.callback(this.value);
    },
    addEvent: function () {
        var self = this;
        self.circleDom.find('.stepper-delete').off('click').on('click', function () {
            self.changeCount('delete');
        });
        self.circleDom.find('.stepper-add').off('click').on('click', function () {
            self.changeCount('add');
        });
        self.circleDom.find('.stepper-value').on('input propertychang', function () {
            var value = $(this).val();
            if (!/\D/g.test(value) && value >= self.minCount && value <= self.maxCount) {
                self.value = +value;
                self.update(true);
            }
            else {
                value = +(value.replace(/\D/g, ''));
                self.value = value > self.minCount ? value < self.maxCount ? value : self.maxCount : self.minCount
                self.update();
            }
        });
    },
    setCss: function () {
        this.needInput && this.circleDom.find('.stepper-value').attr('readonly', null);
    },
    init: function () {
        this.setCss();
        this.addEvent();
    }
}
var Stepper = new stepper({ circleDom: $('.stepper'), value: 3, minCount: 2, maxCount: 6, diffValue: -2, needInput: true, callback: function (value) { console.log(value) } });
