function stepper(obj) {
    var self = this;
    $.extend(this, {
        value: 1,
        minCount: 0,
        maxCount: 5,
        diffValue: 1
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
    update: function () {
        this.circleDom.find('.stepper-value').val(this.value);
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
    },
    init: function () {
        this.addEvent();
    }
}
var Stepper = new stepper({ circleDom: $('.stepper'), value: 3, minCount: 1, maxCount: 6, diffValue: -2, callback: function (value) { console.log(value) } });
