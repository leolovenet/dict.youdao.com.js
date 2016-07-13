
jQuery(document).ready(function () {
  Messenger.options = {
      extraClasses: 'messenger-fixed messenger-on-top messenger-on-left',
      theme: 'flat'
  };
  var host = window.location.host.split('.')[1];

  if (host == "collinsdictionary") {
      var keyCode = 112;
      var pronunciation = [];
      var max = 12;

      jQuery(document).ready(function($) {
        $("#ad_topslot").remove();
        $("#ad_btmslot_a").remove();
        $("#ad_leftslot_b").remove();
      });

      $(".audio_play_button").each(function(index){
          if (index < max) {
              $(this).after('<span style="font-size:12px;color:red;">F' + (index + 1) + '</span>');
              pronunciation.push({e:this,v:keyCode});
              keyCode ++;
          }
      });

      $(window).keydown(function(ev) {
         var l = pronunciation.length;
          for(var i = 0; i < max && pronunciation[i]; i++) {
            if (pronunciation[i].v == ev.keyCode) {
                pronunciation[i].e.click();
                var lang = $(pronunciation[i].e).siblings(".lang").text();
                if (lang) {
                    Messenger().post({
                        type: "success",
                        hideAfter: 2,
                        showCloseButton: true,
                        message: lang+ " Pronunciation."
                    });
                }
            }
          }
      });

  } else if (host == "youdao") {

      var myvo,word;
      jQuery(document).ready(function($) {
        $("#topImgAd").after('<div>快捷键提示: F1英式发音, F2美式发音,F3 加入单词本</div>').remove();
      });

      function getWordFromPage_163() {
        var word = $("#phrsListTab  span.keyword").text();
        if (word === "") {
          word = $("input[name='q']").val();
        }
        if (!word && (typeof wordnow != "undefined")) {
            word = wordnow;
        }
        return word.toLowerCase();
      };

      jQuery(window).keydown(function(ev){
        switch (ev.keyCode){
          case 112:
            word = getWordFromPage_163();
            myvo = document.getElementById("dictVoice");
            myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=1";
            myvo.load();
            myvo.play();
            Messenger().post({
                type: "success",
                hideAfter: 2,
                showCloseButton: true,
                message: "英式发音<br>English Pronunciation."
            });
          break;
          case 113:
            word = getWordFromPage_163();
            myvo = document.getElementById("dictVoice");
            myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=2";
            myvo.load();
            myvo.play();
            Messenger().post({
                type: "success",
                hideAfter: 2,
                showCloseButton: true,
                message: "美式发音<br>American Pronunciation."
            });
          break;
          case 114:
            var word = getWordFromPage_163();
            $.ajax({
              type: "GET",
              url: "http://dict.youdao.com/wordbook/ajax?action=addword&q=" + word + "&date=" + Date(),
              cache: false,
              dataType: "json",
              success: function (json) {
                if (json.message == "adddone") {
                  Messenger().post({
                      type: "success",
                      hideAfter: 4,
                      showCloseButton: true,
                      message: "成功添加单词 " + word + " 到单词本"
                  });
                } else {
                  Messenger().post({
                      type: "error",
                      hideAfter: 4,
                      showCloseButton: true,
                      message: "添加单词 " + word + " 到单词本失败<br>" + json.message
                  });
                }
              }
            });
          break;
        }
      });
  } else {
      Messenger().post("unknown current site !!!");
      return;
  }
});
