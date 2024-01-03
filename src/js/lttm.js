var atwhoOptions, previewUrl;

atwhoOptions = {
  at: "!",
  tpl: '<li class="lttm" data-value="![${alt}](${imageUrl})"><img src="${imagePreviewUrl}" /></li>',
  limit: 80,
  display_timeout: 1000,
  search_key: null,
  callbacks: {
    matcher: function (flag, subtext) {
      var match, regexp;
      regexp = new XRegExp("(\\s+|^)" + flag + "([\\p{L}_-]+)$", "gi");
      match = regexp.exec(subtext);
      if (!(match && match.length >= 2)) {
        return null;
      }
      return match[2];
    },
    remote_filter: function (query, callback) {
      var kind, task1, task2, task3, url;
      if (!query) {
        return;
      }
      kind = query[0].toLowerCase();
      query = query.slice(1);
      switch (false) {
        case kind !== "l":
          if (location.protocol === "https:") {
            url = 'https://lttm-ssl.herokuapp.com/lgtm';
          } else {
            url = 'http://www.lgtm.in/g';
          }
          task1 = $.getJSON(url + '?' + Math.random()).then();
          task2 = $.getJSON(url + '?' + Math.random()).then();
          task3 = $.getJSON(url + '?' + Math.random()).then();
          return $.when(task1, task2, task3).then(function (a, b, c) {
            var images;
            images = _.map([a[0], b[0], c[0]], function (data) {
              var imageUrl;
              imageUrl = data.actualImageUrl;
              return {
                name: imageUrl,
                imageUrl: imageUrl,
                imagePreviewUrl: previewUrl(imageUrl),
                alt: "LGTM"
              };
            });
            return callback(images);
          });
        case kind !== "t":
          if (query) {
            return $.getJSON("https://d942scftf40wm.cloudfront.net/search.json", {
              q: query
            }, function (data) {
              var images;
              images = [];
              $.each(data, function (k, v) {
                url = "https://img.tiqav.com/" + v.id + "." + v.ext;
                return images.push({
                  name: url,
                  imageUrl: url,
                  imagePreviewUrl: previewUrl(url),
                  alt: "tiqav"
                });
              });
              return callback(images);
            });
          }
          break;
        case kind !== "m":
          return $.getJSON(chrome.runtime.getURL("/config/meigens.json"), function (data) {
            var boys, images;
            boys = [];
            if (query) {
              boys = _.filter(data, function (n) {
                return (n.title && n.title.indexOf(query) > -1) || (n.body && n.body.indexOf(query) > -1);
              });
            } else {
              boys = _.sample(data, 30);
            }
            images = [];
            $.each(boys, function (k, v) {
              var image;
              image = v.image.replace('http://', 'https://');
              return images.push({
                name: image,
                imageUrl: image,
                imagePreviewUrl: previewUrl(image),
                alt: "ミサワ"
              });
            });
            return callback(images);
          });
        case kind !== "i":
          return $.getJSON(chrome.runtime.getURL("/config/irasutoya.json"), function (data) {
            var illustrations, images;
            illustrations = [];
            if (query) {
              illustrations = _.filter(data, function (n) {
                var ref, ref1;
                return (((ref = n.title) != null ? ref.indexOf(query) : void 0) > -1) || (((ref1 = n.description) != null ? ref1.indexOf(query) : void 0) > -1) || (n.categories && n.categories.join().indexOf(query) > -1);
              });
            } else {
              illustrations = _.sample(data, 30);
            }
            images = [];
            $.each(illustrations, function (k, v) {
              var image_url;
              image_url = v.image_url.replace('http://', 'https://');
              return images.push({
                name: image_url,
                imageUrl: image_url,
                imagePreviewUrl: previewUrl(image_url),
                alt: v.title
              });
            });
            return callback(images);
          });
        case kind !== 's':
          return $.getJSON(chrome.runtime.getURL("/config/sushi_list.json"), function (data) {
            var images, sushiList;
            sushiList = [];
            if (query) {
              sushiList = _.filter(data, function (sushi) {
                return !!_.find(sushi.keywords, function (keyword) {
                  return keyword.indexOf(query) > -1;
                });
              });
            } else {
              sushiList = data;
            }
            images = [];
            _.each(sushiList, function (sushi) {
              return images.push({
                name: sushi.url,
                imageUrl: sushi.url,
                imagePreviewUrl: sushi.url,
                alt: `寿司ゆき:${sushi.keywords[0]}`
              });
            });
            return callback(images);
          });
        case kind !== 'j':
          return $.getJSON(chrome.runtime.getURL("/config/js_girls.json"), function (data) {
            var images, js_girls;
            js_girls = [];
            if (query) {
              js_girls = _.filter(data, function (js_girl) {
                return !!_.find(js_girl.keywords, function (keyword) {
                  return keyword.indexOf(query) > -1;
                });
              });
            } else {
              js_girls = data;
            }
            images = [];
            _.each(js_girls, function (js_girl) {
              return images.push({
                name: js_girl.url,
                imageUrl: js_girl.url,
                imagePreviewUrl: js_girl.url,
                alt: `JS Girls:${js_girl.keywords[0]}`
              });
            });
            return callback(images);
          });
        case kind !== 'n':
          return $.getJSON(chrome.runtime.getURL("/config/engineer_homeru_neko.json"), function (data) {
            var images, source;
            source = [];
            if (query) {
              source = _.filter(data, function (js_girl) {
                return !!_.find(js_girl.keywords, function (keyword) {
                  return keyword.indexOf(query) > -1;
                });
              });
            } else {
              source = data;
            }
            images = [];
            _.each(source, function (item) {
              return images.push({
                name: item.url,
                imageUrl: item.url,
                imagePreviewUrl: item.url,
                alt: `エンジニアを褒めるネコ:${item.keywords[0]}`
              });
            });
            return callback(images);
          });
        case kind !== 'd':
          return $.getJSON(chrome.runtime.getURL("/config/decomoji.json"), function (data) {
            var decomojis, images;
            decomojis = [];
            if (query) {
              decomojis = _.filter(data, function (js_girl) {
                return !!_.find(js_girl.keywords, function (keyword) {
                  return keyword.indexOf(query) > -1;
                });
              });
            } else {
              decomojis = data;
            }
            images = [];
            _.each(decomojis, function (decomoji) {
              return images.push({
                name: decomoji.url,
                imageUrl: decomoji.url,
                imagePreviewUrl: decomoji.url,
                alt: `:${decomoji.keywords[0]}`
              });
            });
            return callback(images);
          });
        case kind !== 'r':
          return $.getJSON(chrome.runtime.getURL("/config/sushidot.json"), function (data) {
            var images, sushidots;
            sushidots = [];
            if (query) {
              sushidots = _.filter(data, function (js_girl) {
                return !!_.find(js_girl.keywords, function (keyword) {
                  return keyword.indexOf(query) > -1;
                });
              });
            } else {
              sushidots = data;
            }
            images = [];
            _.each(sushidots, function (sushidot) {
              return images.push({
                name: sushidot.url,
                imageUrl: sushidot.url,
                imagePreviewUrl: sushidot.url,
                alt: `:${sushidot.keywords[0]}`
              });
            });
            return callback(images);
          });
      }
    }
  }
};

previewUrl = function (url) {
  var hmac, shaObj;
  if (location.protocol === "http:") {
    return url;
  }
  if (url.indexOf('https:') === 0) {
    return url;
  }
  shaObj = new jsSHA("SHA-1", 'TEXT');
  shaObj.setHMACKey('lttmlttm', 'TEXT');
  shaObj.update(url);
  hmac = shaObj.getHMAC('HEX');
  return `https://lttmcamo.herokuapp.com/${hmac}?url=${url}`;
};

$(document).on('focusin', function (ev) {
  var $this;
  $this = $(ev.target);
  if (!$this.is('textarea')) {
    return;
  }
  return $this.atwho(atwhoOptions);
});

$(document).on('keyup.atwhoInner', function (ev) {
  return setTimeout(function () {
    var $currentItem, $parent, offset;
    $currentItem = $('.atwho-view .cur');
    if ($currentItem.length === 0) {
      return;
    }
    $parent = $($currentItem.parents('.atwho-view')[0]);
    offset = Math.floor($currentItem.offset().top - $parent.offset().top) - 1;
    if ((offset < 0) || (offset > 250)) {
      return setTimeout(function () {
        var row;
        offset = Math.floor($currentItem.offset().top - $parent.offset().top) - 1;
        row = Math.floor(offset / 150);
        return $parent.scrollTop($parent.scrollTop() + row * 150 - 75);
      }, 100);
    }
  });
});
