/*
    Author:It小莫(liyu);
    date:2014-06-02;
    QQ:414329354;
    blog:http://smallmo.com/;
*/

function LoveAtFirstSight(json) {
    return new LoveAtFirstSight.fn.init(json);
};


LoveAtFirstSight.fn = LoveAtFirstSight.prototype = {
    init: function(json) {
        this.json = json;
        this.obj = this.json.box;
        this.size = 1;
        this.rotation = null;
        this.timer = null;
        this.step = 1;
        this.sword = null;
        this.paper = null;
        this.elem = [];
        this.flag = false;
        this.fuzz = [];
        this.creatLink();
    },
    loadFuzz: function() {
        var number = 20,
            fuzzImages = this.$$('fuzz', this.obj),
            pa = this.$('gong');
        this.paper = Raphael(this.obj, '100%', '100%');
        this.doc = document.documentElement;
        this.ds = {
            w: this.doc.clientWidth,
            h: this.doc.clientHeight
        };
        if (this.checkMobile()) {
            this.size = 2;
            number = 6;
        } else {
            this.size = 1;
            number = 9;
        }
        var array = [];
        var positions = [];
        var xx = (126 / this.size);
        var yy = (119 / this.size);
        var wlen = this.ds.w / (126 / this.size);
        var hlen = (this.ds.h - (283 / this.size)) / (110 / this.size);
        for (var i = 0; i < number; i++) {
            var index = fuzzImages[this.getRandomNum(0, fuzzImages.length - 1)],
                x = this.getRandomNum(0, parseInt(wlen)),
                y = this.getRandomNum(0, parseInt(hlen) - 1),
                rotate = ['25', '30', '-30', '15', '-15', '2', '0'],
                angels = rotate[this.getRandomNum(0, rotate.length - 1)],
                topLeft = (this.ds.w - (126 / this.size)) / 2;
            if (!this.isHasOne([x, y], array)) {
                var fuzzs = this.paper.image(index.src, topLeft, -200, index.width / this.size, index.height / this.size);
                this.fuzz.push(fuzzs);
                array.push([x, y]);
                positions.push({
                    x: x * xx,
                    y: y * yy
                });
            } else {
                var fuzzs = this.paper.image(index.src, topLeft, -200, index.width / this.size, index.height / this.size);
                this.fuzz.push(fuzzs);
                array.push([x, y]);
                positions.push({
                    x: x * xx + (126 / this.size),
                    y: y * yy + (283 / this.size)
                });
            }
        };
        for (var i = 0, ii = this.fuzz.length; i < ii; i++) {
            if (this.json.animation) {
                this.fuzz[i].animate({
                    x: positions[i]['x'],
                    y: positions[i]['y']
                }, 4000, 'linear');
            } else {
                this.fuzz[i].attr({
                    x: positions[i]['x'],
                    y: positions[i]['y']
                });
            }
        };
        this.paper.image(pa.src, (this.ds.w - (pa.width / this.size)) / 2, (this.ds.h - (pa.height / this.size)) - 10 / this.size, pa.width / this.size, pa.height / this.size);
        this.loadBow();
    },
    w: function(a, b) {
        return ((this.ds.w - (a / this.size)) - b) / this.size;
    },
    creatLink: function() {
        if (this.checkMobile()) {
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = "css/csss.css";
            document.head.appendChild(link);
        };
        this.$("bottombg").style.display = 'block';
        this.loadFuzz();
    },
    loadBow: function() {
        var that = this,
            toghter = this.$$('items', this.obj);
        for (var i = 0, ii = toghter.length; i < ii; i++) {
            var obj = toghter[i],
                size = that.addMiddle(obj.width, obj.height),
                elem = this.paper.image(obj.src, size.x, size.y, size.w, size.h);
            elem.data('name', obj.id);
            if (toghter[i].id == 'sword') {
                that.sword = elem;
            } else if (toghter[i].id == 'cicles') {
                that.cicles = elem;
                elem.attr('y', elem.attr('y') - (68 / that.size))
            } else if (toghter[i].id == 'light') {
                elem.attr('y', elem.attr('y') - (68 / that.size))
            };
            that.elem.push(elem);
        };
        this.rotatIng();
    },
    isHasOne: function(a, b) {
        for (var i = 0; i < b.length; i++) {
            if (b[i][0] == a[0] && b[i][1] == a[1]) {
                return true
            }
        }
        return false;
    },
    addMiddle: function(w, h) {
        var that = this;
        return {
            x: (that.ds.w - (w / that.size)) / 2,
            y: (that.ds.h - (h / that.size)),
            w: w / that.size,
            h: h / that.size
        }
    },
    rotatIng: function() {
        var that = this;
        window.clearInterval(that.rotation);
        for (var i = 1; i < that.elem.length; i++) {
            (function(i) {
                var now = that.elem[i];
                if (now.data('name') == 'cicles' || now.data('name') == 'light') {
                    var x = now.attr('x') + (now.attr('width') / 2);
                    var y = now.attr('y') + now.attr('height');
                } else {
                    var x = now.attr('x') + (now.attr('width') / 2);
                    var y = now.attr('y') + now.attr('height') - (68 / that.size);
                };
                clockwise(now, x, y);
            })(i);
        };

        function anticlockwise(el, x, y) {
            el.animate({
                transform: 'r' + '-55' + ',' + x + ',' + y
            }, 6000, 'linear', function() {
                clockwise(el, x, y);
            });
        };

        function clockwise(el, x, y) {
            el.animate({
                transform: 'r' + '55' + ',' + x + ',' + y
            }, 7000, 'linear', function() {
                anticlockwise(el, x, y);
            });
        };
        this.addEvent();
    },
    endShooted: function(obj, array) {
         var objs = obj.getBBox(),
                x = objs.x,
                y = objs.y,
                j = 10 / this.size,
                jj = 20 / this.size;

        for (var i = 0, ii = array.length; i < ii; i++) {
                var z = array[i].getBBox();
            if ((x >= z.x + jj) && (x <= z.x2 - j) && (y >= z.y + j) && (y <= z.y2 - j)) {
                return array[i];
            }
        }
        return null;
    },
    addEvent: function() {
        var that = this;
        this.cicles.attr({
            cursor: "pointer"
        });
        this.cicles.click(function() {
            that.shootings();
        })
    },
    $: function(obj, parent) {
        if (arguments.length >= 2) {
            return parent.getElementsByTagName(obj);
        } else {
            return document.getElementById(obj);
        }
    },
    $$: function(className, oParent) {
        var aEle = this.$(oParent).getElementsByTagName('*'),
            aResult = [],
            re = new RegExp('\\b' + className + '\\b', 'i'),
            i = 0;
        for (i = 0; i < aEle.length; i++) {
            if (re.test(aEle[i].className)) {
                aResult.push(aEle[i]);
            }
        }
        return aResult;
    },
    parsueRotation:function(){
        for (var i = 1; i < this.elem.length; i++) {
            this.elem[i].stop();
        };
    },
    shootings:function(){
        window.elem=this.elem;
        this.parsueRotation();
        var that = this;

        window.clearInterval(this.timer);

        var sword = that.sword;
        var sx = sword.attr('x');
        var sy = sword.attr('y');
        //箭的角度
        var angel = +that.elem[1].transform().toString().split(',')[0].replace('r', '');
        //箭轨迹在 x 轴上的坐标
        var lx = (1 + Math.tan(angel)) * sx;
        if(angel > 0) {
            lx = sx + sy * Math.tan(angel * Math.PI / 180);
        } else {
            lx = sx - sy * Math.tan(-1 * angel * Math.PI / 180);
        }
        var nearest;

        that.fuzz.forEach(function(v, i) {
            var box = v.getBBox();
            var fx  = box.cx;
            var fy  = box.cy;

            //直线上的一个点，纵坐标与桃心相同，用来判断桃心在直线的哪一侧
            var crossX = lx - Math.tan(Math.abs(angel)) * fy;

            var offsetX = Math.abs(lx - fx);

            //桃心中点与 lx 所夹的角度
            var fa = Math.atan(fy/offsetX) * 180 / Math.PI;
            //桃心中点与轨迹所夹的角
            var flAngle = (Math.PI / 180) * ((fx > crossX) ? (90 + angel) : (90 - angel) - fa);

            var dist = Math.sin(flAngle) * Math.sqrt(fy * fy + offsetX * offsetX);
            //桃心距离箭太远
            if(dist > 50) return;

            if(!nearest || nearest.y < fy) {
                nearest = {
                    y: fy,
                    fuzz: v
                }
            }
        })

        console.log(nearest && nearest.fuzz[0]);

        this.timer = window.setInterval(function() {
            ++that.step;
            (angel > 0) && (angel = -angel);
            var x = that.sword.attr('x');
            var y = that.sword.attr('y') + that.step / Math.tan(((Math.PI * 2) / 360) * angel);
            that.sword.animate({x:x,y:y},0,'linear',function(){
                var near = that.endShooted(that.sword, that.fuzz);
                /*var near=that.findNearest(that.sword);*/
                if (near) {
                    that.clearShoot();
                    console.log(that.sword.attr('y'));
                   /* if(that.sword.attr('y')>0){

                        that.sword.attr('y',that.sword.attr('y')-100);
                         console.log(that.sword.attr('y'),'>0',angel);
                    }else{

                        that.sword.attr('y',that.sword.attr('y')+100);
                         console.log(that.sword.attr('y'),'<0');
                    };*/
                    that.json.success(near,that.sword,that);
                };
                if (y < -that.doc.clientHeight) {
                    that.clearShoot();
                    that.json.fail();
                };
           });
        }, 50)
    },
    shooting: function() {
        window.clearInterval(this.timer);
        window.elem=this.elem
        for (var i = 1; i < this.elem.length; i++) {
            this.elem[i].stop();
        }
        var that = this;
        var angel = that.elem[1].transform().toString().split(',')[0].replace('r', '');
        this.timer = window.setInterval(function() {
            that.step += 1;
              console.log(that.sword.getBBox());
            (angel > 0) && (angel = -angel);
            var x = that.sword.attr('x');
            var y = that.sword.attr('y') + that.step / Math.tan(((Math.PI * 2) / 360) * angel);
            that.sword.attr({
                x: x,
                y: y
            });
            var near = that.endShooted(that.sword, that.fuzz);
            /*var near=that.findNearest(that.sword);*/
            if (near) {
                that.clearShoot();
                that.json.success(near,that.sword,that);
            };
            if (y < -that.doc.clientHeight) {
                that.clearShoot();
                that.json.fail();
            };
        }, 50)
    },
    test: function(obj1, obj2) {
        var obj = obj1.getBBox();
        var objs = obj2.getBBox();
        var l1 = obj.x;
        var r1 = l1 + obj.width;
        var t1 = obj.y;
        var b1 = t1 + obj.height;
        var l2 = objs.x;
        var r2 = l2 + objs.width;
        var t2 = objs.y;
        var b2 = t2 + objs.height;
        if (r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2) {
            return false;
        } else {
            return true;
        }
    },
    findNearest: function(obj) {
        var iMin = 999999999;
        var iMinIndex = -1;
        for (var i = 0, ii = this.fuzz.length; i < ii; i++) {
            if (obj == this.fuzz[i]) continue;
            if (this.test(obj, this.fuzz[i])) {
                return this.fuzz[i];
                /*
                var dis = this.getDis(obj, this.fuzz[i]);
                    if (iMin > dis) {
                        iMin = dis;
                        iMinIndex = i;
                    }
                */
            }
        }
        if (iMinIndex == -1) {
            return null;
        } else {
            return this.fuzz[iMinIndex];
        }
    },
    getDis: function(obj1, obj2) {
        var a = obj1.attr('x') + obj1.matrix.split().dx + obj1.attr('width') - obj2.attr('x') - obj2.attr('width');
        var b = obj1.attr('y') + obj1.matrix.split().dy + obj1.attr('height') - obj2.attr('y') - obj2.attr('height');
        return Math.sqrt(a * a + b * b);
    },
    getRandomNum: function(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    clearShoot: function() {
        window.clearInterval(this.timer);
        /*this.sword.hide();*/
    },
    ShootEnd: function(obj) {
        /*
         console.log(obj)
         window.alert('一见钟情');
         this.clearShoot();
         obj.attr('src','about:blank');

        */
    },
    checkMobile: function() {
        var flag = false;
        var agent = navigator.userAgent.toLowerCase();
        var keywords = ["android", "iphone", "ipod", "ipad", "windows phone", "mqqbrowser"];
        /*  排除 Windows 桌面系统  */
        if (!(agent.indexOf("windows nt") > -1) || (agent.indexOf("windows nt") > -1 && agent.indexOf("compatible; msie 9.0;") > -1)) {
            /*  排除苹果桌面系统  */
            if (!(agent.indexOf("windows nt") > -1) && !agent.indexOf("macintosh") > -1) {
                for (var i = 0; i < keywords.length; i++) {
                    if (agent.indexOf(keywords[i]) != -1) {
                        flag = true;
                        break;
                    }
                }
            }
        }
        return flag;
    }
};

LoveAtFirstSight.fn.init.prototype = LoveAtFirstSight.prototype;