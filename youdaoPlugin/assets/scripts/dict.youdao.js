// ==UserScript==
// @name        Dict.YouDao.com
// @namespace   DictYouDao
// @Author      leolovenet(http://leolovenet.com)
// @description 增强有道字典(dict.youdao.com)的交互,针对有道单词本(dict.youdao.com/wordbook)加入了一键加入的功能。
// @include     http://dict.youdao.com/search*
// @version     1.0
// ==/UserScript==


/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function (jQuery) {
  jQuery.hotkeys = {
    version: "0.8",
    specialKeys: {
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },

    shiftNums: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ": ",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    options: {
      filterTextInputs: true
    }
  };

  function keyHandler(handleObj) {
    if (typeof handleObj.data === "string") {
      handleObj.data = {
        keys: handleObj.data
      };
    }

    // Only care when a possible input has been specified
    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
      return;
    }

    var origHandler = handleObj.handler,
        keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function (event) {
      //      Don't fire in text-accepting inputs that we didn't directly bind to
      if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
          (jQuery.hotkeys.options.filterTextInputs &&
          jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
        return;
      }

      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
          character = String.fromCharCode(event.which).toLowerCase(),
          modif = "",
          possible = {};

      jQuery.each(["alt", "ctrl", "shift"], function (index, specialKey) {

        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });

      // metaKey is triggered off ctrlKey erronously
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
        modif += "meta+";
      }

      if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
        modif = modif.replace("alt+ctrl+shift+", "hyper+");
      }

      if (special) {
        possible[modif + special] = true;
      }
      else {
        possible[modif + character] = true;
        possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+") {
          possible[jQuery.hotkeys.shiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++) {
        if (possible[keys[i]]) {
          return origHandler.apply(this, arguments);
        }
      }
    };
  }

  jQuery.each(["keydown", "keyup", "keypress"], function () {
    jQuery.event.special[this] = {
      add: keyHandler
    };
  });
})(jQuery || this.jQuery || window.jQuery);

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

function Greasemonkey_main() {
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
};

jQuery(document).ready(function () {
  Greasemonkey_main();
  var myvo;
  $(document).bind('keydown', 'f1', function () {
    var word = getWordFromPage();
    myvo = document.getElementById("dictVoice");
    myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=1";
    myvo.load();
    myvo.play();
  }).bind('keydown', 'f2', function () {
    var word = getWordFromPage();
    myvo = document.getElementById("dictVoice");
    myvo.src = "http://dict.youdao.com/dictvoice?audio=" + word + "&type=2";
    myvo.load();
    myvo.play();
  }).bind('keydown', 'f3', function () {
    $("#refreshword").click();
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
