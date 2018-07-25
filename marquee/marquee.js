class Marquee {
    constructor(obj){
        const defaultObj={
            speed:0.3
        }
        Object.assign(this,defaultObj,obj);
        this.init();
    }
    init(){
        this.bindEvent();
        this.setCss();
        this.createHtml();
        this.startAni();
    }
    bindEvent(){
        this.getDom('.'+this.parentClass).addEventListener('touchmove',(e)=>{e.preventDefault();});
    }
    getDom(tag){
        return document.querySelector(tag);
    }
    setCss(){
        Object.assign(this.getDom('.' + this.parentClass).style , {
            'display': '-webkit-box',
            'overflow-x': 'auto',
            '-webkit-box-align': 'center'
        });
        this.getDom('.'+this.childClass).style['min-width']=this.getDom('.'+this.parentClass).offsetWidth+'px';
    }
    createHtml(){
        const dom=this.getDom('.'+this.parentClass).innerHTML;
        this.getDom('.'+this.parentClass).innerHTML=dom+dom;
    }
    startAni(){
        let distance = 0,
        length = this.getDom('.'+this.childClass).offsetWidth,
        timer = setInterval(() => {
          distance==length&&(distance=0);
          distance+=this.speed;
          distance=distance>length?length:distance;
          this.getDom('.'+this.parentClass).scrollLeft=distance;
        }, 0);
    }
}