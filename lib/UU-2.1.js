/*
 * 依赖jquery1.7以上版本
 */
var UU = UU || {};
var products = undefined == products ? [] : products;
;(UU.init = function(){

    // 悬浮框处理
    $(window).scroll(function(){
        var topHide = $(document).scrollTop(); //页面上部被卷去高度
        var windowHeight = $(window).height();  //窗口可视区域高度
        var bottomFloatHeight = $('#bottomFloat').height(); //底悬浮高度
        var backTopFloatHeight = $('#backTopFloat').height();
        var bottomTop = windowHeight+topHide-bottomFloatHeight;
        var backTop = windowHeight+topHide-backTopFloatHeight-20;

        //针对IE6不支持fixed的处理start          
        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            $('#bottomFloat').stop().animate({'top':bottomTop},'fast');
            $('#backTopFloat').stop().animate({'top':backTop},'fast');
        }            
        //针对IE6不支持fixed的处理end
       
        //滚动渐隐渐现左右悬浮start
        if(topHide>300){
            $('#leftFloat').show();
            $('#rightFloat').show();
            $('#backTopFloat').show();
        }else{
            $('#leftFloat').hide();
            $('#rightFloat').hide(); 
            $('#backTopFloat').hide();
        }
        //滚动渐隐渐现左右悬浮end            
    });

})();
// tab切
/*
 * paneCount: Number;（tab切面板数量）
 * uevent: String; （触发事件类型，'hover','click','doubleclick'等）
 */
UU.tab = function(elements, options){
    // 默认值
    var defaults = {
        paneCount: 2,
        uevent: 'hover'
    };
    var opts = $.extend({}, defaults, options);
    var paneCount = opts.paneCount;
    var uevent = opts.uevent;

    $(elements).each(function(){
        var tab = $(this);
        var $tabBtn = tab.find('.tab-btn');
        var $tabPane = tab.find('.tab-panes:first > .tab-pane');

        $tabBtn.live(uevent,function(e){
            e.stopPropagation();
            var $this = $(this);
            var index = $this.index();
            $this.addClass('on').siblings().removeClass('on');
            $tabPane.eq(index).addClass('on').siblings().removeClass('on');         
        });
         
    })
    
}

// 焦点图
/*
 * pageWidth: Number; (焦点图宽度)
 * pageHeight: Number; (焦点图高度)
 * pageCount: Number; (焦点图数量)
 * interval: Number; (每张图播放间隔)
 * speed: Number; (每张图播放速度)
 * delay: Number; (悬浮停止后延迟多久恢复自动播放)
 * auto: Boolean; (是否自动播放)
 * easing: String; (动画函数，使用需要引入动画函数脚本或者扩展jquery的easing)
 * pageNumberWidth: Number; (分页按钮宽度)
 */
UU.slideFocus = function(elements, options){
    var defaults = {
        pageWidth: 1000,
        pageHeight: 500,
        pageCount: 3,
        interval: 3000,
        delay: 5000,
        speed: 500,
        auto: true,
        easing: 'linear',
        pageNumWidth: 12
    };
    var opts = $.extend({}, defaults, options);
    var pageWidth = opts.pageWidth;
    var pageHeight = opts.pageHeight;
    var pageCount = opts.pageCount;
    var interval = opts.interval;
    var delay = opts.delay;
    var speed = opts.speed;
    var auto = opts.auto;
    var easing = opts.easing;
    var pageNumWidth = opts.pageNumWidth;
    var timer = null;

    $(elements).each(function(){
        var slide = $(this);
        var btn = slide.find('.btn');
        var btnL = slide.find(".prev");
        var btnR = slide.find(".next");
        var nums = slide.find(".nums");
        var num = nums.find('.num');
        var picBox = slide.find(".box");
        var scrollContent = slide.find(".content");
        var page = slide.find(".page");       

        var init = function(){
            var numsWidth = (pageNumWidth+4)*pageCount;
            nums.css({'width':numsWidth,'marginLeft':-numsWidth/2});
            picBox.css({'width':pageWidth,'height':pageHeight,'overflow':'hidden'});
            scrollContent.css({'width':pageWidth*pageCount*2,'left':-pageWidth*pageCount});
            page.css({'width':pageWidth,'height':pageHeight});
            scrollContent.append(scrollContent.html());
        }();
        var move = function(){
            scrollContent.stop().animate({left:[-pageWidth*(pageCount+1),easing]},speed,function(){
                var lis = scrollContent.find(".page");
                scrollContent.append(lis.eq(0).clone());
                lis.eq(0).remove();
                scrollContent.css({left:-pageWidth*pageCount});
                lightNum();

            })
        };
        var lightNum = function(){                   
            var activePageNum = slide.find('.page').eq(pageCount).attr('data-page');
            slide.find('.num').eq(activePageNum-1).addClass('on').siblings().removeClass('on');
        };

        if (auto) {
            timer = setInterval(move,interval);
            slide.hover(function(){
                clearInterval(timer);
            },function(){
                timer = setTimeout(function(){timer = setInterval(move,interval);},delay);                       
            });                    
        };

        btnR.click(function(){
            scrollContent.stop().animate({left:[-pageWidth*(pageCount+1),easing]},speed,function(){
                var lis = scrollContent.find(".page");
                scrollContent.append(lis.eq(0).clone());
                lis.eq(0).remove();
                scrollContent.css({left:-pageWidth*pageCount});
                lightNum();
            })
        })
        btnL.click(function(){
            scrollContent.stop().animate({left:[-pageWidth*(pageCount-1),easing]},speed,function(){
                var lis = scrollContent.find(".page");
                var lastPageIndex = pageCount*2 -1;
                scrollContent.prepend(lis.eq(lastPageIndex).clone());//这里的eq值等于page*2-1
                lis.eq(lastPageIndex).remove();
                scrollContent.css({left:-pageWidth*pageCount});
                lightNum();
            })
        });
        num.click(function(){
            var _this = $(this);
            var toPageNum = _this.index()+1;
            var fromPageNum = slide.find('.page').eq(pageCount).attr('data-page');
            var left = -pageWidth*pageCount - (toPageNum - fromPageNum)*pageWidth;
            _this.addClass('on').siblings().removeClass('on');
            scrollContent.stop().animate({left:[left,easing]},speed);            
        });

    })
}

// 轮播商品图
/*
 * pageWidth: Number; (焦点图宽度)
 * pageHeight: Number; (焦点图高度)
 * pageCount: Number; (焦点图数量)
 * interval: Number; (每张图播放间隔)
 * speed: Number; (每张图播放速度)
 * delay: Number; (悬浮停止后延迟多久恢复自动播放)
 * auto: Boolean; (是否自动播放)
 * easing: String; (动画函数，使用需要引入动画函数脚本或者扩展jquery的easing)
 * pageNumberWidth: Number; (分页按钮宽度)
 */
UU.slideProduct = function(elements, options){
    var defaults = {
        pageWidth: 1000,
        pageHeight: 500,
        pageCount: 3,
        interval: 3000,
        delay: 5000,
        speed: 500,
        auto: true,
        easing: 'linear',
        pageNumWidth: 12
    };
    var opts = $.extend({}, defaults, options);
    var pageWidth = opts.pageWidth;
    var pageHeight = opts.pageHeight;
    var pageCount = opts.pageCount;
    var interval = opts.interval;
    var delay = opts.delay;
    var speed = opts.speed;
    var auto = opts.auto;
    var easing = opts.easing;
    var pageNumWidth = opts.pageNumWidth;
    var timer = null, activePageIndex = 0;

    $(elements).each(function(){
        var slide = $(this);
        var btn = slide.find('.btn');
        var btnL = slide.find(".prev");
        var btnR = slide.find(".next");
        var nums = slide.find(".nums");
        var num = nums.find('.num');
        var picBox = slide.find(".box");
        var scrollContent = slide.find(".content");
        var page = slide.find(".page");     

        var init = function(){
            var numsWidth = (pageNumWidth+4)*pageCount;
            nums.css({'width':numsWidth,'marginLeft':-numsWidth/2});
            picBox.css({'width':pageWidth,'height':pageHeight,'overflow':'hidden'});
            scrollContent.css({'width':pageWidth*pageCount});
            page.css({'width':pageWidth,'height':pageHeight});
        }();
        var move = function(direction){
            if (direction === 'prev') {
                activePageIndex = activePageIndex === 0 ? pageCount-1 : activePageIndex-1;
            } else{
                activePageIndex = activePageIndex === pageCount-1 ? 0 : activePageIndex+1;                       
            };
            scrollContent.stop().animate({left:[-pageWidth*activePageIndex,easing]},speed,function(){
                lightNum(activePageIndex);
            })
        };
        var lightNum = function(activePageIndex){                   
            slide.find('.nums').find('li').eq(activePageIndex).addClass('on').siblings().removeClass('on');

        };
        if (auto) {
            timer = setInterval(move,interval);
            slide.hover(function(){
                clearInterval(timer);
            },function(){
                timer = setTimeout(function(){timer = setInterval(move,interval);},delay);                       
            });                    
        };
        btnL.click(function(){
            move('prev');
        });
        btnR.click(function(){
            move('next');
        })
        num.click(function(){
            var _this = $(this);
            var left = -pageWidth*_this.index();
            _this.addClass('on').siblings().removeClass('on');
            scrollContent.stop().animate({left:[left,easing]},speed);            
        });

    })
}

// 不间断滚屏效果
/*
 * itemWidth: Number; (条目宽度)
 * itemHeight: Number; (条目高度)
 * itemCount: Number; (条目数量)
 * speed: Number; (滚屏速度)
 * step: Number; (滚屏跨度)
 * auto: Boolean; (是否自动播放)
 * easing: String; (动画函数，使用需要引入动画函数脚本或者扩展jquery的easing)
 * direction: String; (滚屏方向)
 */
UU.roll = function(elements, options){
    var defaults = {
        itemWidth: 150,
        itemHeight: 40,
        itemCount: 10,
        speed: 20,
        step: 1,
        auto: true,
        easing: 'linear',
        direction: 'right-to-left'
    };
    var opts = $.extend({}, defaults, options);
    var itemWidth = opts.itemWidth;
    var itemHeight = opts.itemHeight;
    var itemCount = opts.itemCount;       
    var speed = opts.speed;
    var step = opts.step;
    var auto = opts.auto;
    var direction = opts.direction;
    var pageWidth = 0, pageHeight = 0, timer = null;
    $(elements).each(function(){
        var roll = $(this);
        var rollBox = roll.find('.roll-box');
        var rollContent = roll.find('.roll-content');
        var rollList = roll.find('.roll-list');
        var rollItem = rollList.find('li');
        var rollPrev = roll.find('.prev');
        var rollNext = roll.find('.next');

        var init = function(){
            rollBox.css({'overflow': 'hidden'});
            rollItem.css({'width': itemWidth, 'height': itemHeight, 'overflow': 'hidden'});
           
            if (direction === 'right-to-left' || direction === 'left-to-right') {
                // 左右滚动
                pageWidth = itemWidth*itemCount;
                pageHeight = itemHeight;
                rollList.css({'width':pageWidth,'height':pageHeight});
                rollContent.append(rollContent.html()).css({'width':pageWidth*2, 'height':pageHeight, 'left': -pageWidth});
            }else{
                // 上下滚动
                pageWidth = itemWidth;
                pageHeight = itemHeight*itemCount; 
                rollList.css({'width':pageWidth,'height':pageHeight});
                rollContent.append(rollContent.html()).css({'width':pageWidth, 'height':pageHeight*2, 'top': -pageHeight});                               
            }            
            
        }();

        var play = function(direction){
            if (direction === 'left-to-right') {
                clearInterval(timer);
                timer = setInterval(function(){
                        var left = parseInt(rollContent.css('left'));
                        if (left >= 0) {
                            rollContent.css('left',-pageWidth);
                        }else{
                            rollContent.css('left',left+step);
                        }                        
                    },speed);      
            }else if(direction === 'right-to-left'){
                clearInterval(timer);
                timer = setInterval(function(){
                    var left = parseInt(rollContent.css('left'));
                    if (left <= -pageWidth) {
                        rollContent.css('left',0);
                    }else{
                        rollContent.css('left',left-step);
                    }  
                },speed);                    
            }else if(direction === 'top-to-bottom'){
                clearInterval(timer);
                timer = setInterval(function(){
                    var top = parseInt(rollContent.css('top'));
                    if (top >= 0) {
                        rollContent.css('top', -pageHeight);
                    }else{
                        rollContent.css('top',top+step);
                    }  
                },speed);  
            }else{
                clearInterval(timer);
                timer = setInterval(function(){
                    var top = parseInt(rollContent.css('top'));
                    if (top <= -pageHeight) {
                        rollContent.css('top',0);
                    }else{
                        rollContent.css('top',top-step);
                    }  
                },speed);  
            }
        };

        roll.hover(function(){
            clearInterval(timer);
        },function(){
            play(direction);
        });
        // rollPrev.click(function(){
        //     direction = 'left-to-right';
        //     play(direction);
        // });
        // rollNext.click(function(){
        //     direction = 'right-to-left';
        //     play(direction);
        // })
        if (auto) {
            timer = setInterval(function(){
                play(direction);
            },speed);
        }

    })

}

// 弹出框
/* 主要用于促销页面弹出图片
 * dialogWidth: Number; (弹出框宽度)
 * dialogHeight: Number; (弹出框高度)
 * uevent: String; (触发事件类型，'hover','click','doubleclick'等)
 */
UU.dialog = function(elements, options){
    var defaults = {
        dialogWidth: 500,
        dialogHeight: 400,
        uevent: 'click'
    };
    var opts = $.extend({}, defaults, options);
    var dialogWidth = opts.dialogWidth;
    var dialogHeight = opts.dialogHeight; 
    var uevent = opts.uevent;
    var UU_mask = $('#UU_mask'), UU_close = $('#UU_close'), UU_dialogCoat = $('#UU_dialogCoat'), UU_dialogContent = $('#UU_dialogContent');
    
    var init = function(){
        var initHtml = '<div id="UU_mask" style="width:100%;height:100%;position:fixed;z-index:999;left:0;top:0;background-color:#000;opacity:0.5;display:none;"></div>'
                        +'<div id="UU_dialogCoat" style="display:none;">'
                        +'<a href="javascript:void(0)" id="UU_close" style="width:100px;height:100px;position:absolute;right:0;top:0;z-index:2;"></a>'
                        +'<div id="UU_dialogContent" style="width:100%;height:100%;position:relative;"></div>'
                        +'</div>';
        if ($('#UU_mask').length <= 0) {
            $('body').append(initHtml);
            UU_mask = $('#UU_mask'), UU_close = $('#UU_close'), UU_dialogCoat = $('#UU_dialogCoat'), UU_dialogContent = $('#UU_dialogContent');
        }                      

    }();

    $(elements).live(uevent,function(){
        var _this = $(this);
        UU_dialogCoat.css({'width':dialogWidth,'height':dialogHeight,'position':'fixed','z-index':'1000','left':'50%','margin-left':-dialogWidth/2,'top':'50%','margin-top':-dialogHeight/2});
        UU_dialogContent.html('<img src="' + _this.attr('data-src') + '">');
        UU_mask.fadeIn();
        UU_dialogCoat.fadeIn();
    }) 
    UU_close.live('click',function(){
        UU_dialogCoat.fadeOut();
        UU_mask.fadeOut();
    })

}

// 倒计时
/* 可以实现“天时分秒”、“时分秒”、“分秒”倒计时
 * fromStart: String; (倒计时颗粒度'day'/'hour'/'minute')
 * endDate: String; (截止时间，注意格式'2018/06/15 00:00:00')
 */
UU.timedown = function(elements,options){
    var defaults = {
        fromStart: 'day',
        endDate: '2018/06/15 00:00:00'
    };
    var opts = $.extend({}, defaults, options);
    var fromStart = opts.fromStart;
    var endDate = opts.endDate; 
    var spacing = opts.spacing;
      
    var formatNum = function(num){
        return num.toString().replace(/^(\d)$/, "0$1");
    }
    var validateDate = function(dateString){
        var reg = /^(\d{1,4})(\/|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var r = dateString.match(reg);
        if(r==null){
            alert("日期格式不正确,请重新输入");
            return false;
        }else{
            return true;
        }
    };
    $(elements).each(function(){
        var timedown = $(this);
        if (!validateDate(endDate)) {
            return false;
        };
        var endTime = new Date(endDate).getTime();
        var nowTime = new Date().getTime(); 
        var timer = null;

        if (endTime > nowTime) {
            var tdTime = (endTime - nowTime)/1000;
            timer = setInterval(play,1000);
        } else{
            switch(fromStart){                
                case 'hour':
                timedown.html('<span class="hour">00</span><span class="minute">00</span><span class="second">00</span>');
                break;
                case 'minute':
                timedown.html('<span class="minute">00</span><span class="second">00</span>');     
                break;           
                default:
                timedown.html('<span class="day">00</span><span class="hour">00</span><span class="minute">00</span><span class="second">00</span>');
            }            
        }

        function play(){
            if (tdTime > 0) {
                var _D = Math.floor(tdTime / 86400)
                var _H = Math.floor((tdTime - 86400 * _D) / 3600);
                var _M = Math.floor((tdTime - _D * 86400 - _H * 3600) / 60);
                var _S = Math.floor(tdTime % 60);
                

                switch(fromStart){                
                    case 'hour':
                    timedown.html('<span class="hour">'+formatNum(_H + _D*24)+'</span><span class="minute">'+formatNum(_M)+'</span><span class="second">'+formatNum(_S)+'</span>');
                    break;
                    case 'minute':
                    timedown.html('<span class="minute">'+formatNum(_M + _H*60+ _D*24*60)+'</span><span>'+formatNum(_S)+'</span>');  
                    break;              
                    default:
                    timedown.html('<span class="day">'+formatNum(_D)+'</span><span class="hour">'+formatNum(_H)+'</span><span class="minute">'+formatNum(_M)+'</span><span class="second">'+formatNum(_S)+'</span>');
                } 
                tdTime--;
                
            } else{
                clearInterval(timer);
            }
        }

    })
}

// 添加多媒体
/* 实现添加flash，微博，html片段等多媒体
 * mediaType: String; (要添加的多媒体类型)
 * mediaContent: String; (多媒体内容，flash是地址链接，微博直播是话题，其他是html代码片段);
 * width：Number; (展示宽度)
 * height: Number; (展示高度)
 * uid: String; (新浪微博：用户UID)
 * listid: String; (新浪微博：指定分组ID，“特别推荐”标签中显示指定人员列表的微博, 可通过微集体管理器添加分组)
 */
UU.addMedia = function(element,options){
    var defaults = {
        mediaType: 'flash',
        mediaContent: '',
        width: 500,
        height: 400,
        uid: '', //新浪微博：用户UID
        listid: '' //新浪微博：指定分组ID，“特别推荐”标签中显示指定人员列表的微博, 可通过微集体管理器添加分组
    };
    var opts = $.extend({}, defaults, options); 
    var mediaType = opts.mediaType;
    var mediaContent = opts.mediaContent; 
    var width = opts.width;
    var height = opts.height;
    // 如果是新浪微博还得有以下两个参数
    var uid = opts.uid;
    var listid = opts.listid;

    switch(mediaType){
        case 'flash':
            var flashHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'">'
                            +'<param name="allowScriptAccess" value="always" />'
                            +'<param name="allowFullScreen" value="false" />'
                            +'<param name="movie" value="'+mediaContent+'" />'
                            +'<param name="quality" value="high" />'
                            +'<param name="wmode" value="transparent" />'
                            +'<param name="flashvars" value="ap=0" />'
                            +'<embed src="'+mediaContent+'" quality="high" wmode="transparent" width="'+width+'" height="'+height+'" name="focusshow" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" flashvars="ap=0"></embed>'
                            +'</object>';

            $(element).html(flashHtml);
            break;
        case 'weibo':
            var weml = '<wb:livestream skin="silver" topic="'+mediaContent+'" width="'+width+'" height="'+height+'" uid="'+uid+'" listid="'+listid+'" ></wb:livestream>';
            $('html').attr('xmlns:wb','http://open.weibo.com/wb');
            $('head').append('<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=" type="text/javascript" charset="utf-8"></script>');
            $(element).html(weml);
            break;
        default:
            $(element).html(mediaContent);
    }   
}
// 懒加载
/* 实现图片、伪动态商品模块等的懒加载
 * threshold: Number; (设置临界点)
 * uevent: String; (触发时间类型，'scroll','click'等);
 * dataAttribute：String; (图片懒加载中保存图片地址的属性名)
 * placeholder: String; (占位图)
 * callback: Function; (回调函数名)
 * data: JSON; (伪动态商品数据)
 */
UU.lazyload = function(elements, options){
    var defaults = {
        threshold       : 0,
        uevent          : "scroll",
        dataAttribute   : "src2",
        placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",
        callback        : null,
        data            : []
    };
    var opts = $.extend({}, defaults, options); 
    var $window = $(window);
    var $elements = $(elements);
    var threshold = opts.threshold;
    var dataAttribute = opts.dataAttribute;
    var uevent = opts.uevent;
    var placeholder = opts.placeholder;
    var data = opts.data;
    var callback = opts.callback;

    var inviewport = function(element) {
        var $element = $(element);
        var leftFold = $window.scrollLeft();
        var topFold = $window.scrollTop();
        var winWidth = $window.width();
        var winHeight = $window.height();
        var eleX = $element.offset().left;
        var eleY = $element.offset().top;

        return ((eleX-threshold) < (winWidth+leftFold)) && ((eleY-threshold) < (winHeight+topFold));
    };


    function update() {
        $elements.each(function() {
            if (inviewport(this)) {
                $(this).trigger("appear");
            }
        });
    }

    $elements.each(function(index, element) {
        var self = this;
        var $self = $(self);

        self.loaded = false;

        if (!callback) {
            if ($self.is("img")) {
                $self.attr("src", placeholder);
            }else{
                $self.css("background-image", "url('" + placeholder + "')");
            }             
        }
        // 进入可视区域时触发加载
        $self.one("appear", function() {
            if (!this.loaded) {
                if (!callback) {
                    var original = $self.attr(dataAttribute);
                    if ($self.is("img")) {
                        $self.attr("src", original);
                    } else {
                        $self.css("background-image", "url('" + original + "')");
                    } 
                } else{
                    if (undefined == data[index]) {
                        // console.log('productDoms:' + $elements.length + '  jsProducts:' + data.length);
                        return false;
                    }else{
                        callback($self, data[index]);
                    }
                    
                };
           
                self.loaded = true;
                // 移除已经加载的图片，以免下次循环再触发
                elements = $.grep(elements, function(element) {
                    return !element.loaded;
                });                
            }
        });

    });

    $window.bind(uevent+' resize', function() {
        update();
    });        
    $(document).ready(function() {
        update();
    });    
}