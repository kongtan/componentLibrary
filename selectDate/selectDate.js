function selectDate(obj={}) {
    var defaultObj = {
        type:'day',
        startYear: new Date().getFullYear() - 20,
        endYear: new Date().getFullYear() + 20,
        rubSpeed: 1500, //惯性加速度
        defaultDate: obj.importDate ? new Date(obj.importDate.replace(/-/g, '/')) : new Date(),
        data: []
    };
    Object.assign(this,defaultObj,obj);
    //清楚dom
    let dom=document.querySelector('.cl-date-circle');
    if(dom) document.querySelector('body').removeChild(dom);
    this.insertDom();
    this.trueDate = [this.defaultDate.getFullYear(),this.defaultDate.getMonth()+1,this.defaultDate.getDate()];
    this.unitHeight = this.get('.cl-year').clientHeight;
    this.circleHeight = this.get('.cl-year-lists').clientHeight;
    const dateArr=[{className:'cl-year',day:this.endYear-this.startYear+1},{className:'cl-month',day:12},{className:'cl-day',day:31}]
    dateArr.map((item,index)=>{
        let arrItem={
            value:this.trueDate[index],
            distance: ((this.circleHeight - this.unitHeight) / 2)-this.get('.'+item.className+'[tag="'+this.trueDate[index]+'"]').offsetTop,
            className: item.className,
            maxDis: (this.circleHeight - this.unitHeight) / 2,
            minDis: -(this.unitHeight*item.day - (this.circleHeight + this.unitHeight) / 2),
        };
        this.data.push(arrItem);
    })
    this.init();
}
selectDate.prototype = {
    get(tag) {
        return document.querySelector(tag);
    },
    /**
     *绑定事件
     */
    bindEvents: function () {
        this.data.map(item=>{
            this.get('.' + item.className + '-lists').addEventListener('touchstart', () => { this.startFnc.apply(this, [item, event]) });
            this.get('.' + item.className + '-lists').addEventListener('touchmove', () => { this.touchFnc.apply(this, [item, event]) });
            this.get('.' + item.className + '-lists').addEventListener('touchend', () => { this.endFnc.apply(this, [item, event]) });
            this.setCssStyle(item.className, item.distance, 0);
        })
        this.get('.cl-select-title-right').addEventListener('click', this.confirm.bind(this));
        this.get('.cl-select-title-left').addEventListener('click', this.cancel.bind(this));
        this.get('.cl-shade').addEventListener('click', this.cancel.bind(this));
    },
    /**
     * 开始触摸的回调
     */
    startFnc: function (item, event) {
        event.preventDefault();
        item.startTime = +new Date();
        const touches = event.touches ? event.touches[0] : event.originalEvent.touches[0];
        item.distancepoi = 0; //滑动距离重置，防止点击后直接滑动
        item.startpoi = touches.pageY;
        this.setCssStyle(item.className, item.distance, 0); //防止
    },
    /**
     * 触摸中的回调
     */
    touchFnc: function (item, event) {
        const touches = event.touches ? event.touches[0] : event.originalEvent.touches[0];
        item.distancepoi = touches.pageY - item.startpoi;
        this.setCssStyle(item.className, item.distance + item.distancepoi, 0); //滑动中...
    },
    /**
     * 触摸结束的回调
     */
    endFnc: function (item, event) {
        const endTime = +new Date(),
            timeDiff = (endTime - item.startTime) / 1000,
            v2 = item.distancepoi / timeDiff,
            time = Math.abs(v2 / this.rubSpeed);
        item.distance = v2 * Math.abs(v2) / (2 * this.rubSpeed) + item.distancepoi + item.distance;
        const originDiff = item.distance - item.maxDis;
        item.distance = (parseInt(originDiff / this.unitHeight) - (originDiff % this.unitHeight <= -this.unitHeight / 2 ? 1 : 0)) * this.unitHeight + item.maxDis;
        if (item.distancepoi > 0 && item.distance > item.maxDis) item.distance = item.maxDis;
        else if (item.distancepoi < 0 && item.distance < item.minDis) item.distance = item.minDis;
        const index = Math.abs(item.distance - item.maxDis) / this.unitHeight;
        item.value = +document.querySelectorAll('.' + item.className)[index].getAttribute('tag');
        this.setCssStyle(item.className, item.distance, time); //实时滑动距离
        if (item.className == 'cl-month' || item.className == 'cl-year') this.changeRange(item.className, item.value);
    },
    /**
     * 设置css样式
     * @param length
     * @param time
     */
    setCssStyle: function (className, length, time) {
        this.get('.' + className + '-list').style["transform"] = "translate3d(0," + length + "px,0)";
        this.get('.' + className + '-list').style["-webkit-transform"] = "translate3d(0," + length + "px,0)";
        this.get('.' + className + '-list').style["transition"] = time + "s ease-out";
        this.get('.' + className + '-list').style["-webkit-transition"] = time + "s ease-out";
    },
    judgeMonth(year) {
        const condition1 = year % 4 == 0,
            condition2 = year % 100 != 0,
            condition3 = year % 400 == 0;
        if ((condition1 && condition2) || condition3) return true;
    },
    changeRange(className, value) {
        let day = 31,
            item = this.data[2];
        if (className == 'cl-year') {
            if (this.data[1].value == 2) {
                day = this.judgeMonth(value) ? 29 : 28;
            }
            else return;
        }
        else {
            switch (value) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    day = 31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    day = 30;
                    break;
                case 2:
                    day=this.judgeMonth(this.data[0].value)?29:28;
                    break;
            }
        }
        item.minDis = -(this.unitHeight * day - (this.circleHeight + this.unitHeight) / 2);
        if (item.distance < item.minDis) {
            item.distance = item.minDis;
            this.setCssStyle(item.className, item.distance, 0.3); //防止
        }
    },
    confirm(){
        const date=this.data.map(item=>item.value).join('-');
        this.trueDate=date.split('-');
        this.callback&&this.callback(this.trueDate.slice(0,this.type=='year'?1:(this.type=='month'?2:3)));
        this.toggle();
    },
    cancel(){
        this.data.map((item,index)=>{
            item.value=this.trueDate[index];
            item.distance= ((this.circleHeight - this.unitHeight) / 2)-this.get('.'+item.className+'[tag="'+this.trueDate[index]+'"]').offsetTop;
            this.setCssStyle(item.className, item.distance, 0);
        })
        this.toggle();
    },
    toggle(){
        this.get('.cl-date-circle').style.display=this.get('.cl-date-circle').style.display=='none'?'-webkit-box':'none';
    },
    insertDom(){
        let yearDom="",
            monthDom="",
            dayDom="";
        for (let i=this.startYear;i<=this.endYear;i++){
            yearDom+='<li class="cl-year" tag="'+i+'">'+i+'</li>';
        }
        for (let i=1;i<=12;i++){
            monthDom+='<li class="cl-month" tag="'+i+'">'+i+'</li>';
        }
        for (let i=1;i<=31;i++){
            dayDom+='<li class="cl-day" tag="'+i+'">'+i+'</li>';
        }
        var dom=`<p class="cl-shade" ontouchmove="return false;"></p>
                <div class="cl-select-main">
                    <div class="cl-select-title" ontouchmove="return false;">
                        <p class="cl-select-title-left">取消</p>
                        <p class="cl-select-title-right">确定</p>
                    </div>
                        <div class="cl-select">
                            <div class="cl-year-lists">
                                <div class="cl-year-lists-pop"></div>
                                <ul class="cl-year-list">`
                                    + yearDom +
                                `</ul>
                            </div>
                            <div class="cl-month-lists">
                                    <div class="cl-month-lists-pop"></div>
                                <ul class="cl-month-list">`
                                    + monthDom +
                                `</ul>
                            </div>
                            <div class="cl-day-lists">
                                    <div class="cl-day-lists-pop"></div>
                                <ul class="cl-day-list">`
                                    + dayDom +
                                `</ul>
                            </div>
                        </div>
                </div>`;
        const newElement=document.createElement('div');
        newElement.className="cl-date-circle"
        newElement.innerHTML=dom;
        document.body.appendChild(newElement);
        if(this.type=='month') this.get('.cl-day-lists').style['-webkit-box-flex']=0;
        if(this.type=='year') {
            this.get('.cl-day-lists').style['-webkit-box-flex']=0;
            this.get('.cl-month-lists').style['-webkit-box-flex']=0;
        }
    },
    /**
     * 初始化方法
     */
    init: function () {
        //初始化监听事件和圆点
        this.bindEvents();
    },
};
