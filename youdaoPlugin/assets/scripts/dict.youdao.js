// ==UserScript==
// @name        Dict.YouDao.com
// @namespace   DictYouDao
// @Author      leolovenet(http://leolovenet.com)
// @description 增强有道字典(dict.youdao.com)的交互,针对有道单词本(dict.youdao.com/wordbook)加入了一键加入的功能。
// @include     http://dict.youdao.com/search*
// @version     1.0
// ==/UserScript==

jQuery(document).ready(function () {
  function removeAD() {
    var ads = ["#topImgAd", "#ads"];
    ads.forEach(function (e, i) {
      $(e).remove();
    });
    $("#results-contents").css({width: "100%", "box-sizing": "border-box", padding: "7px 0 0 140px", margin: 0});
    $("#results").css({float: "none"});
  };
  removeAD();
  
  function getWordFromPage() {
    var word = $("#phrsListTab  span.keyword").text();
    if (word === "") {
      word = $("input[name='q']").val();
    }
    return word.toLowerCase();
  };
  
  $("#scontainer").before('<div class="c-header" style="height:auto;line-height:normal;"><button id="refreshword" style="width: 100%; height: 50px; font-size: 20px; ">Add To WordBook</button><div class="tipe">快捷键提示: F1英式发音, F2美式发音,F3 加入单词本</div><div class="message"></div></div>');
  $("#refreshword").click(function () {
    var word = getWordFromPage();
    $.ajax({
      type: "GET",
      url: "http://dict.youdao.com/wordbook/ajax?action=addword&q=" + word + "&date=" + Date(),
      cache: false,
      dataType: "json",
      success: function (json) {
        if (json.message == "adddone") {
          $(".message").append("<p>OK >>>> " + word + "</p>");
        } else {
          $(".message").html(json.message);
        }
      }
    });
  });

  var myvo,word;
  $(window).keydown(function(ev){
    switch (ev.keyCode){
      case 112:
        word = getWordFromPage();
        myvo = document.getElementById("dictVoice");
        myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=1";
        myvo.load();
        myvo.play();
      break;
      case 113:
        word = getWordFromPage();
        myvo = document.getElementById("dictVoice");
        myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=2";
        myvo.load();
        myvo.play();
      break;
      case 114:
        $("#refreshword").click();
      break;       
    }    
  });

  if (typeof MutationObserver === "function") {
    var target = document.querySelector('#doc');
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        var a = m.addedNodes;
        if (a.length) {
          for (var i = 0; i < a.length; i++) {
            if (a[i].id === "scontainer") {
              removeAD();
            }
          }
        }
      });
    });
    observer.observe(target, {childList: true});
  }
 
});
