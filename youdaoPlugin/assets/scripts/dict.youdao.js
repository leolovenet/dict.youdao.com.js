
jQuery(document).ready(function () {
  var host = window.location.host.split('.')[1];

  if ( host == "collinsdictionary") {
      var keyCode = 112;
      var pronunciation = [];

      $(".audio_play_button").each(function(index){
          $(this).after('<span style="font-size:12px;color:red;">F' + (index + 1) + '</span>');
          pronunciation.push({e:this,v:keyCode});
          keyCode ++;
      });

      $(window).keydown(function(ev){
          for(var i = 0, l = pronunciation.length; i < l; i++) {
            if (pronunciation[i].v == ev.keyCode) {
                pronunciation[i].e.click();
            }
          }
      });

  } else if (host == "youdao") {
      function removeAD_163() {
        var ads = ["#topImgAd", "#ads"];
        ads.forEach(function (e, i) {
          $(e).remove();
        });
        $("#results-contents").css({width: "100%", "box-sizing": "border-box", padding: "7px 0 0 140px", margin: 0});
        $("#results").css({float: "none"});
      };
      removeAD_163();

      function getWordFromPage_163() {
        var word = $("#phrsListTab  span.keyword").text();
        if (word === "") {
          word = $("input[name='q']").val();
        }
        return word.toLowerCase();
      };
      $("#scontainer").before('<div class="c-header" style="height:auto;line-height:normal;"><button id="refreshword" style="width: 100%; height: 50px; font-size: 20px; ">Add To WordBook</button><div class="tipe">快捷键提示: F1英式发音, F2美式发音,F3 加入单词本</div><div class="message"></div></div>');
      $("#refreshword").click(function () {
        var word = getWordFromPage_163();
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

      if (typeof MutationObserver === "function") {
        var target = document.querySelector('#doc');
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            var a = m.addedNodes;
            if (a.length) {
              for (var i = 0; i < a.length; i++) {
                if (a[i].id === "scontainer") {
                  removeAD_163();
                }
              }
            }
          });
        });
        observer.observe(target, {childList: true});
      }

      var myvo,word;
      $(window).keydown(function(ev){
        switch (ev.keyCode){
          case 112:
            word = getWordFromPage_163();
            myvo = document.getElementById("dictVoice");
            myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=1";
            myvo.load();
            myvo.play();
          break;
          case 113:
            word = getWordFromPage_163();
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
  } else {
      alert("unknown current site !!!")
      return;
  }
});
