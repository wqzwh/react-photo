require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDom from 'react-dom';

let imageDatas=require('../data/imageDatas.json');

// 获取图片地址定义的方法
imageDatas=(function getImagesUrl(imageDatasArr){
		for(let i=0,j=imageDatasArr.length;i<j;i++){
			let singleImageData=imageDatasArr[i];
			singleImageData.imageURL=require('../images/'+singleImageData.fileName);
			imageDatasArr[i]=singleImageData;
		}
		return imageDatasArr;
	})(imageDatas);

// 给定范围后随机函数定义

function getRangeRandom(low,hight){
	return Math.ceil(Math.random()*(hight-low)+low);
};

//图片组件 
let ImgFigure=React.createClass({
	render:function(){
		let styleObj={};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;

		}

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			)
	}

	
})

let AppComponent=React.createClass({
	Constant:{
		// 定义常量
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{	//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{	//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	//根据计算的边界定义一个排布的函数
	//centerIndex指定居中的图片
	rearrange:function(centerIndex) {
		let imgsArrangeArr=this.state.imgsArrangeArr,
			Constant=this.Constant,
			centerPos=Constant.centerPos,
			hPosRange=Constant.hPosRange,
			vPosRange=Constant.vPosRange,
			hPosRangeLeftSecX=hPosRange.leftSecX,
			hPosRangeRightSecX=hPosRange.rightSecX,
			hPosRangeY=hPosRange.y,
			vPosRangeTopY=vPosRange.topY,
			vPosRangeX=vPosRange.x,

			imgsArrangeTopArr=[],
			topImgNum=Math.ceil(Math.random()*2),//取一个或者不取
			topImgSpliceIndex=0,
			imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

			// 首先居中centerIndex的图片
			imgsArrangeCenterArr[0].pos=centerPos;

			// 取出要布局上侧的图片的状态信息
			topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));

			imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index].pos={
					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				};
			});

			// 布局左右两侧的图片
			for(let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
				// 申明一个变量，左边或者右边区域
				let hPosRangeLORX=null;

				// 前半部分布局左边，右半部分布局右边
				if(i<k){
					hPosRangeLORX=hPosRangeLeftSecX;
				}else{
					hPosRangeLORX=hPosRangeRightSecX
				}

				imgsArrangeArr[i].pos={
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				};
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			};

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});

	},
	getInitialState:function() {
		return {
			imgsArrangeArr:[
				// {
				// 	pos:{
				// 		left:'0',
				// 		top:'0'
				// 	}
				// }
			]
		}
	},
	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount:function() {

		// 获取界面的大小
		let stageDom=ReactDom.findDOMNode(this.refs.stage),
			stageW=stageDom.scrollWidth,
			stageH=stageDom.scrollHeight,
			halfStageW=Math.ceil(stageW/2),
			halfStageH=Math.ceil(stageH/2);
		// 获取图片组件中每个figure的大小
		let imgFigureDOM=ReactDom.findDOMNode(this.refs.imgFigure0),
			imgW=imgFigureDOM.scrollWidth,
			imgH=imgFigureDOM.scrollHeight,
			halfImgW=Math.ceil(imgW/2),
			halfImgH=Math.ceil(imgH/2);
		// 居中的位置
		this.Constant.centerPos={
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		};
		// 计算左侧，右侧的边界位置
		this.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0]=(halfStageW+halfImgW);
		this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
		this.Constant.hPosRange.y[0]=-halfImgH;
		this.Constant.hPosRange.y[0]=stageH-halfImgH;
		// 计算上侧的边界位置
		this.Constant.vPosRange.topY[0]=-halfImgH;
		this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;
		this.Constant.vPosRange.x[0]=halfImgW-imgW;
		this.Constant.vPosRange.x[1]=halfImgW;

		// 调用排布函数
		this.rearrange(0);
	},
	render:function() {
		let controllerUnits=[],
			imgFigures=[];
		imageDatas.forEach(function(value,index){

			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index]={
					pos:{
						left:0,
						top:0
					}
				}
			}

			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} />);
		}.bind(this));	
			
	return (
		<section className="stage" ref="stage">
			<section className="img-sec">
				{imgFigures}
			</section>
			<nav className="controller-nav">
				{controllerUnits}
			</nav>
		</section>
		);
	}
})

AppComponent.defaultProps = {
};

export default AppComponent;