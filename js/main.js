//hsb转换成rgb
function hsb2rgb(arrHSB) {
	var _l=arrHSB[0],_m=arrHSB[1],_n=arrHSB[2];
	if(_m == 0) {
		_l = _m = _n = Math.round(255*_n/100);
		newR = _l;
		newG = _m;
		newB = _n;
	  } else {
		_m = _m/100;
		_n = _n/100;
		p = Math.floor(_l/60)%6;
		f = _l/60 - p;
		a = _n*(1-_m);
		b = _n*(1-_m*f);
		c = _n*(1-_m*(1-f));
		switch(p) {
		  case 0:
			newR = _n; newG = c; newB = a;
			break;
		  case 1:
			newR = b; newG = _n; newB = a;
			break;
		  case 2:
			newR = a; newG = _n; newB = c;
			break;
		  case 3:
			newR = a; newG = b; newB = _n;
			break;
		  case 4:
			newR = c; newG = a; newB = _n;
			break;
		  case 5:
			newR = _n; newG = a; newB = b;
			break;
		}
		newR = Math.round(255*newR);
		newG = Math.round(255*newG);
		newB = Math.round(255*newB);
	  }
		return newR+','+newG+','+newB;
	}

//获取设定的随机数 nRange是随机数范围 count是返回的随机数个数
function getRandomNo(nRange,count){
	if(!nRange){return [];}
	nRange=parseInt(nRange);

	var num;
	var count=count?count:1;
	var arr=[];
	if(count==nRange){
		for(var i=0;i<count;i++){
			arr.push(i);
		}
	}else{	
		for(var i=0;i<count;i++){
			do{
				num=parseInt(Math.random()*nRange);
			}while($.inArray(num, arr)>-1);
			
			arr.push(num);
		}
	}
	return arr; 
}

//从给定的数组里，随机选出指定的个数
function getRandom(arrContent,count){
	var len=arrContent.length;
	if(len==0){alert('main.js里getRandom方法：arrContent为空');return false;}
	if(len<count){alert('main.js里getRandom方法：数组长度小于需要返回的数组长度');return false;}
	var arr=getRandomNo(len,count);
	var arrTmp=[];
	for(var i=0;i<count;i++){
		arrTmp.push(arrContent[arr[i]]);
	}
	return arrTmp;
}
//返回所有排列组合结果
function combinatArray(arr1,arr2){
	
}
//比对数组是否为指定长度，多截少补
function comparArr(arr,total){
	var arrNew=[],len=arr.length;
	if(len>=total){
		return arr.slice(0,total);
	}else{
		var n=Math.floor(total/len),m=parseInt(total%len);
		for(var i=0;i<n;i++){
			arrNew=arrNew.concat(arr);
		}
		return arrNew.concat(arr.slice(0,m));
	}
}
//随机打乱数组
function randArray(arr){
	arr.sort(function(){ return 0.5 - Math.random() })
	return arr;
}
//查找匹配关键字 参数 关键字 数据源 数据源匹配的key
function autoMatching(tag,arr,keyOfObj){
	var arrTmp=[],arrRemain=[];
	var arrTag=[],len=tag.length;
	for(var i=0;i<len;i++){
		arrTag.push(tag.charAt(i));
	}
	$(arr).each(function(ind,o){
		$(arrTag).each(function(y,word){
			if(o[keyOfObj].indexOf(word)>-1){
				arrTmp.push(o);
				return false;
			}
			if(y==len-1){
				arrRemain.push(o);
			}
		});
	});
	console.log(arrTmp+'xxxxx'+arrRemain);
	//返回 新数组 和排除剩下的数组
	return {'arrNew':arrTmp,'arrRemain':arrRemain};
}
/*
	三：自动生成60种排版
	//排版描述
	
	
	
*/

var oColorScheme={
	//选取配色方案  参数：选取的设计师 需要返回的总项
	get:function(oDner,total){
		var arrPeise=[],othis=this;
		//获取所有配色方案放进arrPeise
		arrPeise=arrPeise.concat(oDner.scheme);
		var len=arrPeise.length;
		//如果选定的设计师的方案>总方案数，则随机选出总方案数;否则随机选出差值再动态衍生(ps：选定的方案数最少为3个，因每个方案最多只能衍生出23种变化)
		if(len>total){
			return getRandom(arrPeise,total);
		}else{
			var iDivider=total/len;
			if(iDivider<2){
				//如果已有方案多于总方案的一半，则随机选出缺少的方案去动态衍生
				var arrDif=getRandom(arrPeise,total-len);
			}else{
				//小于一半，则平均衍生 如需60个,已有10个,则每个衍生6个
				var dif=total-len,per=Math.ceil(total/len),arrNew=[];
				per=per>23?23:per;
				for(var i=0;i<len;i++){
					//新数组-缺少的方案<单个衍生方案值，则延生值为新差值
					var y=dif-arrNew.length;
					if(y<per){
						per=y;
					}
					arrNew=arrNew.concat(othis.associate(arrPeise[i],per));
				}
				arrPeise=arrPeise.concat(arrNew);
			}
		}
		return arrPeise.slice(0,total);
	},
	//衍生 HSB  参数 方案源 H差值
	_changeScheme:function(oldScheme,n){
		var newScheme=$.extend(oldScheme,{});	//clone方案源	
			for (key in newScheme){
				var val=newScheme[key];
				if(val instanceof Array){
					if(val[1]!=0){
						val[0]=val[0]+15*n;
					}
				}
			}
		return newScheme;
	},
	//联想配色方案  参数 obj方案源  init需要的联想方案数  
	associate:function(oColorScheme,count){
		//HSB S为0时，H不用变；否则H以15的倍数递增，循环周期为1-360，所以差值区间为24，避免重复则为23
		var arrScheme=[],newScheme={},oThis=this;
		var arrNo=getRandomNo(23,count);
		for(var i=0;i<count;i++){
			newScheme=oThis._changeScheme(oColorScheme,arrNo[i]);
			arrScheme.push(newScheme);
		}
		
		return arrScheme;
	
	}
}

/*二：根据标题选择主元素 
	--文件名为main_no_0.svg（main_no_no.svg为多余颜色) no范围0-180
	--强调元素为 main_no_other_no(第一个no与关联强调元素一致，后一个no目前是0)
*/
/*
	自动完成，关键字与图片地址匹配， 自动选出10个最优匹配主角元素
*/


var oMajor={
	//所有主角元素的地址，宽度，位置描述  [{width:100,url:main_1_0,pos:{left:0,top:0}},{width:100,url:main_1_0,pos:{left:0,top:0}}]
	items:[],
	//选取主角元素 参数：标题
	get:function(oDner,tag,maxCount){
		var arrMajor=[]
		//根据标题匹配主角元素
		var objMajors=autoMatching(tag,oDner.majors,'key');
		console.log(objMajors);
		//大于total，则随机total个，小于total个不做处理
		arrMajor=objMajors['arrNew'];
		if(arrMajor.length>maxCount){
			arrMajor=getRandom(arrMajor,maxCount);
		}
		if(arrMajor.length==0){
			alert(oDner.dner+'没有匹配的主元素！！');	
		}
		
		return arrMajor;
	},
	//设置主要元素的大小 参数 主要元素源 每个需要生成的数量 //生成关于图片和尺寸的描述
	getSizeAndPos:function(arrMajor,count){
		var arrNewMajor=[],arrBakMajor=[],obj={};
		//主元素 生成所有位置
		if(arrMajor.length==count){
			$(arrMajor).each(function(i,oMajor){
				if(!oMajor){return;}
				var minor=getRandomNo(oMajor.minorSource,oMajor.minor);
				var obj=$.extend({},oMajor);
				obj=$.extend(obj,{
					//位置
					pos:getRandom(oMajor.pos,1)[0],
					//配角元素
					minor:minor
				});
				arrNewMajor.push(obj);
			});			
		}else{
			//否则是小于count ，get里已经做了限制，不可能大于count
			var per=Math.ceil(count/arrMajor.length);
			$(arrMajor).each(function(i,oMajor){
				var arPos=oMajor.pos.concat([]);
				if(oMajor.isBleed){arPos=arPos.concat(arrBleedPos)}
				for(var i=0;i<arPos.length;i++){
					var obj=$.extend({},oMajor);
					var obj=$.extend(obj,{
						//位置
						pos:arPos[i],
						//配角元素
						minor:getRandomNo(oMajor.minorSource,oMajor.minor)
					});
					//循环所有的位置，将per数量以内的放到新数组里，多余的放到bak里备选
					if(i<per){
						arrNewMajor.push(obj);
					}else{
						arrBakMajor.push(obj);
					}
				}
			});	
			//判断arrNewMajor的个数
			//小于需要的数量，则从备选里追加，还不够则复制
			var len=arrNewMajor.length;
			if(len>count){
				arrNewMajor=arrNewMajor.slice(0,count);
			}else if(len<count){
				if(len+arrBakMajor.length<count){
					arrNewMajor=arrNewMajor.concat(arrBakMajor);
					arrNewMajor=comparArr(arrNewMajor,count);
				}else{
					arrNewMajor=arrNewMajor.concat(arrBakMajor.slice(0,count-len));
				}
			}
		}

		return arrNewMajor;
	},
	//设置主要元素的位置
	getPos:function(){
		
		/*var contentW=Math.floor(pgW/3),contentH=pgH/2;	//内容宽度
		var xCenter=pgW/2-contentW/2; //水平居中的x坐标
		var yCenter=pgH/2-contentH/2;	//
		var arrX=[0,xCenter,pgW-contentW],arrY=[0,yCenter,pgH-contentH];*/
		
	}
}
//文字内容排版（文字块的宽度是固定的）
var oContent={
	w:pgW/3,	//内容宽度
	total:10,
	//生成所有排版 参数 设计师  标题
	get:function(oDner,title,subTitle,total){
		var arrType=[],arrTypeBak=[];
		var oThis=this;
		oThis.total=total;
		//生成60种随机位置组合方案
		var arrPos=oThis.getPos();
		//console.log(arrPos)
		var arrFontFamily=oDner.content.arrFontFamily;
		//生成所有宽度+字号比例的组合
		var arrWidthAndFontsize=[],oDnerContent=oDner.content;
		var arrW=oDnerContent.width,arrFs=oDnerContent.fontSize;
		var padding=oDnerContent.padding,lineHeight=oDnerContent.lineHeight,wordSpacing=oDnerContent.wordSpacing;
		var otherPadding=oDnerContent.otherPadding,sloganPadding=oDnerContent.sloganPadding;
		$(arrW).each(function(i,n){
			$(arrFs).each(function(x,v){
				arrWidthAndFontsize.push({
					width:n,
					fontSizeProp:v,
					padding:padding,
					lineHeight:lineHeight,
					otherPadding:otherPadding,
					sloganPadding:sloganPadding,
					wordSpacing:wordSpacing					
				});
			});
			
		});
	//	console.log('宽度和字号比组合项arrWidthAndFontsize：'+arrWidthAndFontsize.length);

		//组合 位置>宽+字号比>字体  因为位置是肯定不相同的，所以优先位置不重复
		var wLenth=arrWidthAndFontsize.length;
		var pointTmp;//活动的指针
		$(arrPos).each(function(i,n){
			pointTmp=arrType; //每循环一次位置，将指针指向arrType
			$(arrWidthAndFontsize).each(function(x,y){
				$(arrFontFamily).each(function(a,b){
					var o=$.extend({pos:n,arrFontFamily:b},y);	
					pointTmp.push(o);	//arrType添加一次，则将指针指向arrTypeBak
					pointTmp=arrTypeBak;
				});
			});
		});
 		if(arrType.length>total){
			arrType=arrType.slice(0,total);
		}else{
			arrType=arrType.concat(arrTypeBak.slice(0,total-arrType.length));
			//arrType=arrType.concat(arrType.slice(0,total-arrType.length));
		}
		return arrType;
	},
	//生成随机字体
	getfontFamily:function(){
		//返回一个随机字体
		return getRandom(allData.types.fontFamily,1)[0];
	},
	//生成所有内容位置组合
	getAllPos:function(){
	
	},
	//直接生成所有文字内容排版组合
	getPos:function(){
		//从九宫格中选择三种位置，分别放置 内容块+时间块+slogan，生成total种方案（后期可设定为固定方案）
		//三种内容的方位描述，返回值数组长度为(total里设定的)	格式pos:[{main:{left:0,top:0},other:{left:,top:},slogan:{left:,y}},xxxx]
		var arrAllPos=[],n0,n1,n2;
		var arrRadom,strTmp,arrPos=[];
		for(var i=0;i<this.total;i++){
			//去重,保证选择出的10种方案，没有重复的
			do{
				arrRadom=getRandomNo(9,3);
				strTmp=arrRadom.join('');
			}while(!$.inArray(strTmp,arrAllPos));
			n0=arrRadom[0],n1=arrRadom[1],n2=arrRadom[2];
			switch(n0){
				case 0:
					if(n1==1||n2==1){
						arrRadom[1]=8;
						arrRadom[2]=2;
						//console.log('0位');
					}
					
					break;
				case 1:
					if($.inArray(n1,[0,2,4])>=0||$.inArray(n2,[2,4])>=0){
						arrRadom[1]=6;
						arrRadom[2]=8;	
						//console.log('1位');						
					}
					
					break;
				case 2:
					if(n1==1||n2==1){
						arrRadom[1]=8;
						arrRadom[2]=0;
						//console.log('2位');
					}
					
					break;
				case 3:
					if(n1==4||n2==4){
						arrRadom[1]=6;
						arrRadom[2]=0;	//console.log('3位');					
					}
					
					break;	
				case 4:
					if($.inArray(n1,[3,5])>=0||$.inArray(n2,[3,5])>=0){
						arrRadom[1]=7;
						arrRadom[2]=0;//console.log('4位');
					}
					
					break;
				case 5:
					if(n1==4||n2==4){
						arrRadom[1]=8;
						arrRadom[2]=0;		//console.log('5位');				
					}
					
					break;
				case 6:
					if(n1==7||n2==7){
						arrRadom[1]=2;
						arrRadom[2]=0;//console.log('6位');
					}
					
					break;
				case 7:
					if($.inArray(n1,[6,8])>=0||$.inArray(n2,[6,8])>=0){
						arrRadom[1]=2;
						arrRadom[2]=0;		//console.log('7位');				
					}
					
					break;	
				case 8:
					if(n1==7||n2==7){
						arrRadom[1]=6;
						arrRadom[2]=0;	//console.log('8位');
					break;						
					}
					
				default:
					break;
			}
			strTmp=arrRadom.join('');
			arrAllPos.push(strTmp);	//保存当前位置方案
			
			
			arrPos.push({
				main:arrSudoku9[arrRadom[0]],
				other:arrSudoku9[arrRadom[1]],
				slogan:arrSudoku9[arrRadom[2]]
				}
			)
		};
		return arrPos;
	},
	//计算标题字号（字体随机选）字号是由内容宽度和文字长度决定
	getTitleSize:function(contentWidth,title,subtitle){
		var prop=[72,24,9];
		//优先宽度能放下，再次才考虑完美比例字号
		//主标题字号 考虑字间距2px
		var nSizeH1=Math.floor(contentWidth/title.length)-2;
		var nSizeH2=Math.floor(contentWidth/subtitle.length)-2;	//？增加比例计算
		var nSizeP=Math.ceil(nSizeH1/8);
		return [nSizeH1,nSizeH2,nSizeP];
	}
}

//装饰物 分为：有/无  有分为：9宫格/16宫格/1格 几十个装饰物随机调  每种情况等分
var oDecoration={
	get:function(oDner,total){
		var arrDec=[];
		var nDecBig=oDner.decoration.big;
		var arrDecType=nDecBig>0?[16,9,0,1]:[16,9,0];
		var iCount=0,perTotal=Math.ceil(total/arrDecType.length);
		//每种类型平均分
		for(var i=0;i<total;i++){
			//随机 无/9/16
			iCount=arrDecType[Math.floor(i/perTotal)];
			switch(iCount){
				case 0:
					arrDec.push({
						total:0
					});
					break;
				case 1:
					arrDec.push({
						total:1,
						url:getRandomNo(nDecBig,1)
					});				
					break;
				default :
					//如果是9/16宫格，则从所有装饰物里随机生成9/16个
					arrDec.push({
						total:iCount,
						url:getRandomNo(oDner.decoration.small,iCount)
					});						
			}
		}
		
		//arrDec=arrDec.length>=total?arrDec.slice(0,total):arrDec.concat(arrDec.slice(0,total-arrDec.length));
		//console.log('arrDec的长度是'+arrDec.length);
		//console.log(arrDec);
		
		return comparArr(arrDec,total);
	}
	
}
//背景图
var oBackgroundImg={
	//随机生成背景数组 返回值为60个背景图地址  如果为0，则bgimg_0调取不到，代表为空
	get:function(oDner,total){
		var iBgImg=oDner.bgImg;
		if(iBgImg+1>total){
			//如果大于则随机调取
			return getRandomNo(iBgImg+1,total);
		}else{
			var arrBgImg=[],per=parseInt(total/iBgImg);
			for(var i=0;i<total;i++){
				arrBgImg.push(Math.floor(i/per));
			}
		}
		return arrBgImg;
	}
}
//总体匹配,返回60种方案描述
function joinAllStyle(max,arrColorScheme,arrMajors,arrType,arrDec,arrbgUrl){
	var arrO=[];
	var len=max>arrColorScheme.length?arrColorScheme.length:max;
	for(var i=0;i<len;i++){
		var scheme={
			//配色方案信息
			colorScheme:arrColorScheme[i],	
			//主元素
			major:arrMajors[i],
			//装饰物信息
			decoration:arrDec[i],
			//文字信息
			content:arrType[i],
			//背景图
			bgUrlNo:arrbgUrl[i]
		}
		arrO.push(scheme);
	}
	return arrO;
}
//计算字号
function getTitleSize(contentWidth,title,subtitle,prop){
	var propH1=prop[0];
	//优先宽度能放下，再次才考虑完美比例字号
	//主标题字号 考虑字间距2px
	var nSizeH1=Math.floor(contentWidth/title.length)-2;
	var nSizeH2=Math.floor(contentWidth/subtitle.length)-2;	//？增加比例计算
	var nSizeP=Math.ceil(nSizeH1/(propH1/prop[2]));
	var nSizeH3=Math.ceil(nSizeH1/(propH1/prop[3]));
	var nSizeS=Math.ceil(nSizeH1/(propH1/prop[4]));
	var nSizeTime=Math.ceil(nSizeH1/(propH1/prop[5]));
	return [nSizeH1,nSizeH2,nSizeP,nSizeH3,nSizeS,nSizeTime];
}
//设置svg颜色
function setSvgCl(domEmbed,r,g,b,majorPos){
		var rgb=r+','+g+','+b;
		var svg=domEmbed.getSVGDocument();
		var path=$('polygon,path,line,ellipse,circle',svg);
		$(path).css({"fill":'rgb('+rgb+')'});
}
//计算位置
function getPos(nPos,dom){
	var wDom,hDom;

	var dom=$(dom);
	var nPadding=parseInt(dom.css('padding'))*2;
	wDom=dom.width()+nPadding?nPadding:0;
	hDom=dom.height()+nPadding?nPadding:0;

	if(nPos<9){
		//不出血
		var pos=$.extend({},posSudoku9[nPos]);
		if(pos.left&&pos.left=='center'){
			pos.left=pgW/2-wDom/2+'px';
		}
		if(pos.top&&pos.top=='center'){
			pos.top=pgH/2-hDom/2+'px';
		}		
	}
	
	return pos;
}
//计算主角位置
function getMajorPos(nPos,domEmbed,otherPos,solganPos){
	var domEmbed=$(domEmbed);
	var hDom=domEmbed.height();
	var wDom=domEmbed.width();
	if(nPos<9){
		//不出血，需要计算的是居中位置
		var pos=$.extend({},posSudoku9[nPos]);
		if(pos.left&&pos.left=='center'){
			pos.left=pgW/2-wDom/2+'px';
		}
		if(pos.top&&pos.top=='center'){
			pos.top=pgH/2-hDom/2+'px';
		}		
	}else{
		//出血主角元素扩大1.2倍
		wDom=wDom*1.2,hDom=hDom*1.2;
		domEmbed.css('width',wDom);
		//出血则查找slogan和时间之外的一个位置
		var arrTmp=[];
		for(var i=0;i<9;i++){
			if(i!=4&&i!=otherPos&&i!=solganPos){
				arrTmp.push(i);
			}
		}
		//获取新的位置
		var n=getRandom(arrTmp,1)[0];
		console.log(n);
		//出血需要计算的是0位
		var pos=$.extend({},posSudoku9[n]);
		console.log(pos.left+'x'+pos.top+'xx'+pos.right+'xx'+pos.bottom);
		if(pos.left==0){
			pos.left=-(wDom*0.2)+'px';
		}
		if(pos.top==0){
			pos.top=-(hDom*0.2)+'px';
		}	
		if(pos.right==0){
			pos.right=-(wDom*0.2)+'px';
		}
		if(pos.bottom==0){
			pos.bottom=-(hDom*0.2)+'px';
		}
		console.log(pos.left+'x'+pos.top+'x'+pos.right+'x'+pos.bottom);
	}
	
	domEmbed.parent().css(pos);
}

//解析content
function analyzeConten(title,subtitle,oContent){

	var w=oContent.width*pgW;
	var arrFontSize=getTitleSize(w,title,subtitle,oContent.fontSizeProp.split(';'));
	var oNewContent=$.extend(oContent,{
		width:w,
		arrFontSize:arrFontSize,
		arrFontFamily:oContent.arrFontFamily.split(';')
	});
	return oNewContent;
}
//解析方案，绘制海报
function drawPg(arrScheme,opt,minSub,maxSub){
	console.log(arrScheme);
	var opt=$.extend({
		dner:['designer1'],
		title:'设计箴言',
		subtitle:'副标题副标题副标题',
		slogan:'中国设计周系列活动之大师讲座'
		
	},opt||{});	
	var title=opt.title,subtitle=opt.subtitle;
	var domWrap=$('.wrap');
	//渲染基本html
	domWrap.find('h1 span').html(title);
	domWrap.find('h2 span').html(subtitle);
	domWrap.find('.slogon').html(opt.slogan);
	domWrap.find('dd:first').html(opt.time);
	domWrap.find('dd').eq(1).html(opt.place);
	//循环绘制
	for(var i=minSub;i<maxSub;i++){
		//绘制背景色
		var s=arrScheme[i];
		//console.log(arrScheme[i]);
		if(!s||!s.content){continue;}
		//console.log('渲染第'+i+'个方案');
		domWrap.clone().appendTo($('body')).attr({'id':'scheme'+i});
		var id='#scheme'+i,dWrap=$(id);
		if(i!=minSub){
				//dWrap.hide();
		}else{
			dWrap.addClass('newwrapon');
		}
		var oContent=analyzeConten(title,subtitle,s.content);
		dWrap.addClass('newwrap').css({'font-family':oContent.arrFontFamily[0],'font-size':oContent.arrFontSize[2],'color':'rgb('+hsb2rgb(s.colorScheme.wordClor)+')'});


		//内容位置
		var mainpos=s.content.pos.main,other=s.content.pos.other,slogan=s.content.pos.slogan;

		var domContentwrap=dWrap.find('.contentwrap'),domOtherwrap=dWrap.find('.otherwrap'),domSlogon=dWrap.find('.slogon');
		domContentwrap.css({'width':oContent.width,'padding':oContent.padding*pga}).css(getPos(mainpos,domContentwrap));
		
		domContentwrap.find('h1').css('font-size',oContent.arrFontSize[0]);
		domContentwrap.find('h2').css('font-size',oContent.arrFontSize[1]);		
		
		domOtherwrap.css('padding',oContent.otherPadding*pga).css(getPos(other,domOtherwrap));
		domSlogon.css('padding',oContent.sloganPadding*pga).css(getPos(slogan,domSlogon));
		//渲染颜色	
		dWrap.css('background-color','rgb('+hsb2rgb(s.colorScheme.pgBgClor)+')');	

		if(s.content.wordbg=='contentbg'){
			domContentwrap.css({'background':'rgba('+hsb2rgb(s.colorScheme.wordBgColr)+',0.5)'});
		}else{
			dWrap.find('span').css({'background':'rgba('+hsb2rgb(s.colorScheme.wordBgColr)+',0.5)'});
		}
		//渲染主角
		var domMajor=dWrap.find('i'),strOnloadFn='';
		var urlDesigner='images/'+s.colorScheme.dner;
		var urlMajor=urlDesigner+'/major/m_'+s.major.urlNo;
		//判断是改变颜色还是调取相应svg图
		if(s.major.changeColor){
			urlMajor+='.svg';
			strOnloadFn='onload="getMajorPos('+s.major.pos+',this,'+other+','+slogan+');setSvgCl(this,'+hsb2rgb(s.colorScheme.majorColor)+')"'
		}else{
			var majorColr=s.colorScheme.majorColor[0];
			majorColr=majorColr>360?majorColr%360:majorColr;
			urlMajor+='_'+Math.floor(majorColr/60)+'.svg';
			strOnloadFn='onload="getMajorPos('+s.major.pos+',this,'+other+','+slogan+')"';
		}	
		domMajor.html('<embed '+strOnloadFn+ 'src="'+urlMajor+'" style="opacity:'+s.major.opacity+'" width="'+pgW*s.major.width+'" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />')
		//装饰物
		var sDec=s.decoration,total=sDec.total;
		//console.log(total);
		if(total>1){
			var row=total==9?3:4,wDec=parseInt(pgW/row);
			var arrStr=['<tr>'];
				for(var y=0;y<total;y++){
					if(y!=0&&y%row==0){
						arrStr.push('</tr><tr>');
					}
					sDec.url[i]=sDec.url[i]==0?1:sDec.url[i];
					arrStr.push('<td><embed onload="setSvgCl(this,'+hsb2rgb(s.colorScheme.dianzhuiColr)+',\'dec\')" src="'+urlDesigner+'/dec/deco_'+sDec.url[i]+'.svg" width="'+wDec+'" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" /></td>');
				}
				arrStr.push('</tr>');
			dWrap.find('table').html(arrStr.join(''));
		}else if(total==1){
			dWrap.find('table').html('<tr><td><embed onload="setSvgCl(this,'+hsb2rgb(s.colorScheme.dianzhuiColr)+')" src="'+urlDesigner+'/dec/big/dec_b_'+sDec.url[0]+'.svg" width="100%" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" /></td></tr>');
		}
		//背景图片
		if(s.bgUrlNo!=0){
			dWrap.find('.bgimg').css('background','url('+urlDesigner+'/bg/bg_'+s.bgUrlNo+'.jpg)');			
		}
		//console.log('渲染第'+i+'个方案结束');

	}	
	domWrap.hide();	
	//循环切换
	//focus();
	//});
}
function focus(){
	setTimeout(function(){
		var curTab=$('.newwrapon'),newTab=curTab.next();
		if(newTab.length==0){
			newTab=$('.newwrap').first();
		}
		curTab.fadeOut().removeClass('newwrapon');
		newTab.fadeIn().addClass('newwrapon');
		focus();
	},3000);
	
}

//表单页保存数据，生成描述方案
function initSaveForm(opts){
	var opt=$.extend({
		dner:['designer1'],
		title:'设计箴言',
		subtitle:'副标题副标题副标题',
		slogan:'中国设计周系列活动之大师讲座',
		total:10,//	返回的方案数
		
	},opts||{});
	//var nMajorNumber=10;//限制主要元素的个数（不需要）
	var arrAllScheme=[]
	//平均每个设计师需要生成的方案数
	var dner=opt.dner,title=opt.title,subTitle=opt.subtitle,total=opt.total;
	$(dner).each(function(i,desinerName){
		var obj={};
		var nPerTotal=total/dner.length;
		//var nPerNumber=nMajorNumber/dner.length;

		var oDner=$.extend({},allData.designer[parseInt(desinerName.replace('designer',''))-1]);
		//1、生成设计方案
		var arrColorScheme=oColorScheme.get(oDner,nPerTotal);
		//2、生成主要元素
		var majors=oMajor.get(oDner,title,nPerTotal);
		//console.log(majors);
		var arrMajors=oMajor.getSizeAndPos(majors,nPerTotal);
		//3、生成nPerTotal种排版方式
		var arrType=oContent.get(oDner,title,subTitle,nPerTotal);
		//console.log(arrType);
		//4、生成装饰物
		var arrDec=oDecoration.get(oDner,nPerTotal);

		//5、生成背景图
		var arrbgUrl=oBackgroundImg.get(oDner,nPerTotal);	
		

		//6、组合数据
		var arrScheme=joinAllStyle(nPerTotal,arrColorScheme,arrMajors,arrType,arrDec,arrbgUrl);	
		
		arrAllScheme=arrAllScheme.concat(arrScheme);
	});

	//console.log(arrAllScheme);
	//7、随机打乱顺序
	//oScheme=randArray(arrAllScheme);
	//console.log(arrAllScheme);
	//7、保存至本地存储	
	//更新定时器检测值
	localStorage.setItem("designScheme", JSON.stringify(arrAllScheme));
	localStorage.setItem("designFormInfo",JSON.stringify(opt));
	localStorage.setItem("designRefreshTime",new Date);
}
	//渲染
function initDraw(){
		//读取本地localstorage获取基本信息
		var oScheme=JSON.parse(localStorage.getItem("designScheme"));
		var opt=JSON.parse(localStorage.getItem("designFormInfo"));
		if(!oScheme||!opt){
			return false;
		}
		console.log('drawPg');
		//渲染
		var minsub=0,maxsub=15;
		var per=Math.floor(oScheme.length/4);
		var hash=parseInt(location.hash.replace('#',''))-1;
		if(isNaN(hash)||hash<0){hash=0}
		drawPg(oScheme,opt,hash*per,(hash+1)*per);
}
//展示页渲染数据
function initShowPg(){
	var designRefreshTime=localStorage.getItem("designRefreshTime");
	//设定定时器，定时检测
	var testRefresh=function(){
		setTimeout(function(){
			//console.log('test');
			if(localStorage.getItem("designRefreshTime")!=designRefreshTime){
				designRefreshTime=localStorage.getItem("designRefreshTime");
				location.reload();
			}
			testRefresh();
		},500);
	}
	initDraw();
	testRefresh();
}
