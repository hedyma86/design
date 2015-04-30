//主要方法
var pgW=1080,pgH=1920,pga=12;	//页面宽度
	//九宫格坐标
var posSudoku9=[{left:0,top:0},{left:'center',top:0},{left:'auto',top:0,right:0},{left:0,top:'center'},{left:'center',top:'center'},{left:'auto',top:'center',right:0},{left:0,top:'auto',bottom:0},{left:'center',top:'auto',bottom:0},{left:'auto',right:0,top:'auto',bottom:0}];
//var arrSudoku9=['左上','中上','右上','左中','中中','右中','左下','中下','右下'];
//var arrBleedPos=['左上','中上','右上','左中','右中','左下','中下','右下'];
var arrSudoku9=[0,1,2,3,4,5,6,7,8];
var arrBleedPos=[10];
//出血位置与不出血位置的区别：出血不包含中中位

var allData={};
//一：设计师 designer.json
/**/
allData.scheme={
		//配色方案信息
		colorScheme:{
			//6种颜色,颜色表示为HSB 
			//文字wordClor
			wordClor:[208,0,9],
			//文字背景
			wordBgColr:[196,100,93],
			//点缀和slogon背景
			dianzhuiColr:[56,100,100],
			//页面背景色
			pgBgClor:[208,0,9],
			//主元素颜色
			majorColor:[208,0,9],
			//主元强调元素
			mainOtherColor:[100,100,90]
		},	
		//主元素
		major:{
			//宽度
			width:500,	
			//位置
			pos:5,
			//是否可用配色方案颜色(可用图片加载判断来判断是否可以换颜色)
			changeColor:true,
			url:'main_1_2.svg',
			//主元强调元素 通过图片加载判断是否存在，url与主元素相关
			minor:[{
				url:'main_1_and_0.svg',
				pos:{left:0,top:0}
			}],
			urlNo:1,//地址
			note:'闪电',		
			//透明度
			opacity:0.5,		
			//边距
			margin:4
		},
		//装饰物信息
		decoration:{
			//个数 0/9/16 决定了table的tr和td数
			total:9,
			//装饰物图片地址信息，按td顺序填充
			url:[1,2,3]
		},
		//文字信息
		content:{	
			//主+副+正+强调信息(正文里的标题)+slogan+时地信息 的字号比
			fontSize:[74,24,9,13,9,9],
			arrFontFamily:['微软雅黑','方正大黑','宋体','方正幼线','方正大黑','微软雅黑'],
			//位置
			pos:{
				main:{left:0,top:0},
				other:{left:0,top:0},
				slogan:{left:0,top:0}
			},
			//内容宽度
			width:3/5,
			//主副正宽度比例
			wProp:[1,1,1],
			//文字背景是应用到文字上还是内容上
			wordbg:'contentbg',
			//字间距，行间距
			lineHeight:1.5,
			wordSpacing:-5,
			//主内容边距
			padding:4,
			//时地正边距
			otherPadding:2,
			//文字装饰--不做
			icon:{
				//文字装饰不可以变颜色，按套数分，
					//套数根据文件名区分 
						//font_icon_no_no  第一个no是套数 第二个no是对应的图标  0是时间 1是地点 2是主办单位
				url:'xx.jpg'
			}
		},
		//背景图 值为number 实际解析为 bgimg_number
		bgUrlNo:1
		
	}

allData.designer=[
	//设计师designer1 包含：N套设计方案  喜欢的主元素尺寸
	{
		dner:'designer1',
		bgImg:5,	//提供的背景图数量
		total:2,	//配色方案数
		//点缀元素的数量 小的不能少于16 大的不限制
		decoration:{
			big:1,
			small:16,
		},
		majors:[{
			key:'成功,设计',
			urlNo:1,
			note:'闪电',
			width:0.53,	//一个主要元素只有一种尺寸
			pos:[4],	//代表常用位置 0-8是对应的九宫格位置
			changeColor:false,	//false 则调取main_1_X的图片，		
			//透明度
			opacity:1,		
			need:2,
			source:5,
			//边距
			margin:4,
			//是否位置可出血
			isBleed:false,			
			minor:2,	//配角元素个数 main_1_and_(0-4)
			minorSource:5	//提供的配角元素数
		},{
			key:'成功,设计',
			urlNo:2,
			note:'面包',
			width:0.8,	
			pos:[0,1,5],
			changeColor:true,
			//透明度
			opacity:1,		
			need:2,
			source:5,
			//边距
			margin:4,
			//是否位置可出血
			isBleed:true,			
			minor:2,	//配角元素个数 main_1_and_(0-4)
			minorSource:5	//提供的配角元素数			
		},{
			key:'成功',
			urlNo:3,
			note:'菱形',
			width:0.8,	
			pos:[0,1,5],
			changeColor:true,
			//透明度
			opacity:1,		
			need:2,
			source:5,
			//边距
			margin:4,
			//是否位置可出血
			isBleed:false,			
			minor:2,	//配角元素个数 main_1_and_(0-4)
			minorSource:5	//提供的配角元素数			
		}],
		content:{
			width:[0.35],
			arrFontFamily:['微软雅黑;方正大黑;宋体;方正幼线;方正大黑;微软雅黑','方正大黑;方正大黑;宋体;方正幼线;方正大黑;微软雅黑','宋体;方正大黑;宋体;方正幼线;方正大黑;微软雅黑'],
			//主+副+正 slogan 字号
			fontSize:['74;24;9;13;9;9','74;24;9;13;9;20'],
			//主副正宽度比例
			wProp:[1,1,1],
			//文字背景是应用到文字上还是内容上
			wordbg:'wordbg',
			//字间距，行间距
			lineHeight:1.5,
			wordSpacing:-5,
			otherPadding:8,
			sloganPadding:2,
			padding:8
		},	
		
		//设计师的配色方案数组 scheme  //包含每种配色方案
		scheme:[
			{
				//配色方案关联设计师
				dner:'designer1',
				//6种颜色,颜色表示为HSB 
				//文字wordClor
				wordClor:[335,0,100],
				//文字背景
				wordBgColr:[196,100,93],
				//点缀和slogon背景
				dianzhuiColr:[56,100,100],
				//页面背景色
				pgBgClor:[0,0,85],
				//主元素颜色
				majorColor:[335,100,100],
				//主元强调元素
				mainOtherColor:[100,100,90]
			},
			{
				dner:'designer1',
				wordClor:[208,0,9],
				wordBgColr:[196,100,93],
				dianzhuiColr:[56,100,100],
				pgBgClor:[208,0,9],
				majorColor:[208,0,9],
				mainOtherColor:[100,100,90]
			}
		]
	},
	{
		dner:'designer2',
		scheme:[
			{
				//配色方案关联设计师
				dner:'dner1',
				//6种颜色,颜色表示为HSB 
				//文字wordClor
				wordClor:[208,0,9],
				//文字背景
				wordBgColr:[196,100,93],
				//点缀和slogon背景
				dianzhuiColr:[56,100,100],
				//页面背景色
				pgBgClor:[208,0,9],
				//主元素颜色
				majorColor:[208,0,9],
				//主元强调元素
				mainOtherColor:[100,100,90]
			},
			{
				dner:'dner1',
				wordClor:[208,0,9],
				wordBgColr:[196,100,93],
				dianzhuiColr:[56,100,100],
				pgBgClor:[208,0,9],
				majorColor:[208,0,9],
				mainOtherColor:[100,100,90]
			}]
	}
]

/*二：根据标题选择主元素 
	--文件名为main_no_0.svg（main_no_no.svg为多余颜色) no范围0-180
	--强调元素为 main_no_other_no(第一个no与关联强调元素一致，后一个no目前是0)
*/
/*
	自动完成，关键字与图片地址匹配， 自动选出10个最优匹配主角元素
	//空缺数据结构
	注意：1、不可以改变颜色的主元，需要提供10种颜色图片 main_1_(0-9).svg 【十种颜色是固定顺序，会跟配色方案关联最终确定具体图】;可以改变颜色的主元，提供1种透明图片 main_1_0.svg
		2、有强调元素的主元，需要提供main_1_and_(0-n).svg ，没有则不提供
	
	//最少十个
*/

/*
	三：自动生成60种排版
	//排版描述
*/
allData.types={
	fontFamily:['微软雅黑','黑体','宋体'],
	//九宫格位置
	pos:arrSudoku9,
	//文字装饰
	icon:[null,{
		url:'xx.jpg',
		note:''
	},{
		url:'xx.jpg',
		note:''	
	}]
}
/*
	四、装饰物 文件命名规则 deco_1.svg,定义有多少个就可以了,最少16个，因为有16宫格布局
*/
allData.decorations=16;
/*
	五、背景图 文件命名规则 bgimg_1.jpg,定义有多少个就可以了，最少1个，
	如果随机生成是bgimg_0,则显示不出，说明没有，则他的实际长度为数值+1(getRandomNo时需要用到)
*/
allData.bgImg=1;

