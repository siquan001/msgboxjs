# MessageBox.js

## 描述

一个简单的让postMessage信息传递更加方便的js工具。

## 使用方法

### 发送信息

```javascript

var ifr=document.querySelector('iframe');
ifr.onload=function(){
  // 不需要回传信息（单向）
  MessageBox.sendMessage({
    tag:"标识符",
    data:{
      // 内容，可不填
    },
    to:ifr.contentWindow,
    verify:"127.0.0.1" // 发送页面域名限制，默认*
  })

  // 需要回传信息（双向）
  MessageBox.sendMessage({
    tag:"标识符",
    data:{
      // 内容，可不填
    },
    to:ifr.contentWindow,
    verify:"127.0.0.1", // 发送页面域名限制，默认*
    needCallback:true
  }).then(function(res){
    // TODO
  })
}

```

## 接受信息

```javascript
MessageBox.listenMessage('标识符',function(e){
  var data=e.data;
  var from=e.from;
  if(e.callback){
    // 需要回调
    return {/* Something */};
  }
})
```