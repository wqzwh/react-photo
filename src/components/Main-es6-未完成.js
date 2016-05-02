require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

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

//图片组件 
class ImgFigure extends React.Component{
	render(){
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			)
	}

	
}

class AppComponent extends React.Component{
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
	}
	//根据计算的边界定义一个排布的函数
	//centerIndex指定居中的图片
	rearrange(centerIndex) {
		//console.log("123");
	}
	getInitialStage() {
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
	}
	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {

		// 获取界面的大小
		let stageDom=React.findDOMNode(this.refs.stage),
			stageW=stageDom.scrollWidth,
			stageH=stageDom.scrollHeight,
			halfStageW=Math.ceil(stageW/2),
			halfStageH=Math.ceil(stageH/2);
		// 获取图片组件中每个figure的大小
		let imgFigureDOM=React.findDOMNode(this.refs.imgFigure0),
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
	}
	render() {
		let controllerUnits=[],
			imgFigures=[];

		imageDatas.forEach(function(value,index){

			if(!this.state.imgsArrangeArr[index]){
				this.stage.imgsArrangeArr[index]={
					pos:{
						left:0,
						top:0
					}
				}
			}

			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} />);
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
}

AppComponent.defaultProps = {
};

export default AppComponent;
