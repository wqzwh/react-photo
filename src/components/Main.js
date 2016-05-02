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

class AppComponent extends React.Component {
  render() {
    return (
		<section className="stage">
			<section className="img-sec">我的第一个react项目应用</section>
			<nav className="controller-nav"></nav>
		</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
