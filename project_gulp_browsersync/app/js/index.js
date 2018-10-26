var WELCOME = function (tips){
    this.tips = tips;
}
WELCOME.prototype = {
    showTips:function(){
        alert(this.tips);
    }
};
function welTips(){

}

welTips.prototype = new WELCOME("Hello World!");
var tips = new welTips();
tips.showTips();