!function(e,t){
  if(!e){ throw new Error('MessageBox need to run in a browser.'); }
  e.MessageBox = t(e);
}(window,function(e){

  var baseIndex=0;
  var db={};

  /**
   * 发送消息
   * @param {Object} options 
   * @param {any} options.data
   * @param {Window} options.to
   * @param {String} options.verify?
   * @param {String} options.tag
   * @param {Boolean} options.needCallback?
   */
  function sendMessage(options,nbdy){
    if(!nbdy){
      if(!options.to||!options.to.postMessage){
        throw new Error('MessageBox need a \'postMessage\' to post');
      }
      if(!options.verify){
        console.warn('If you don\'t set \'verify\' attribute,MessageBox will send message by "*"');
      }
    }
    var messageWillPost={
      __MESSAGEBOX_SEND__:true,
      tag:options.tag||'default',
      data:options.data,
      sendFrom:e.location.href
    };
    var cf;
    if(options.needCallback){
      cf='msgcf_'+getRandomString(6)+baseIndex;
      messageWillPost.callback=cf;
    }
    options.to.postMessage(messageWillPost,options.verify||'*');
    if(cf){
      return {
        then:function(fn){
          db[cf]=fn;
        }
      }
    }

  }

  function listenMessage(tag,callback,options){
    listenevents[tag]=callback;
  }

  function getRandomString(len){
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  var listenevents={};

  e.addEventListener('message',function(e){
    if(e.data.__MESSAGEBOX_SEND__){
      if(e.data.tag=='callback_tag'){
        if(db[e.data.data.tocallback]){
          db[e.data.data.tocallback](e.data.data.data);
        }
      }else{
        if(listenevents[e.data.tag]){
          if(e.data.callback){
            var ret=listenevents[e.data.tag]({
              data:e.data.data,
              from:e.data.sendFrom,
              callback:e.data.callback
            });
            if(ret instanceof Promise){
              ret.then(function(res){
                sendMessage({
                  tag:"callback_tag",
                  tocallback:e.data.callback,
                  data:{
                    tocallback:e.data.callback,
                    data:res
                  },
                  to:e.source
                },true);
              })
            }else{
              sendMessage({
                tag:"callback_tag",
                data:{
                  tocallback:e.data.callback,
                  data:ret
                },
                to:e.source
              },true);
            }
          }         
        }
      }
    }
  })
  
  return {
    sendMessage,
    listenMessage
  }
})