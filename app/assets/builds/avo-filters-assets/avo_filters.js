(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/urijs/src/punycode.js
  var require_punycode = __commonJS({
    "node_modules/urijs/src/punycode.js"(exports, module) {
      (function(root) {
        var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
        var freeModule = typeof module == "object" && module && !module.nodeType && module;
        var freeGlobal = typeof global == "object" && global;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
          root = freeGlobal;
        }
        var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
          "overflow": "Overflow: input needs wider integers to process",
          "not-basic": "Illegal input >= 0x80 (not a basic code point)",
          "invalid-input": "Invalid input"
        }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
        function error(type) {
          throw new RangeError(errors[type]);
        }
        function map(array, fn) {
          var length = array.length;
          var result = [];
          while (length--) {
            result[length] = fn(array[length]);
          }
          return result;
        }
        function mapDomain(string, fn) {
          var parts = string.split("@");
          var result = "";
          if (parts.length > 1) {
            result = parts[0] + "@";
            string = parts[1];
          }
          string = string.replace(regexSeparators, ".");
          var labels = string.split(".");
          var encoded = map(labels, fn).join(".");
          return result + encoded;
        }
        function ucs2decode(string) {
          var output = [], counter = 0, length = string.length, value, extra;
          while (counter < length) {
            value = string.charCodeAt(counter++);
            if (value >= 55296 && value <= 56319 && counter < length) {
              extra = string.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }
        function ucs2encode(array) {
          return map(array, function(value) {
            var output = "";
            if (value > 65535) {
              value -= 65536;
              output += stringFromCharCode(value >>> 10 & 1023 | 55296);
              value = 56320 | value & 1023;
            }
            output += stringFromCharCode(value);
            return output;
          }).join("");
        }
        function basicToDigit(codePoint) {
          if (codePoint - 48 < 10) {
            return codePoint - 22;
          }
          if (codePoint - 65 < 26) {
            return codePoint - 65;
          }
          if (codePoint - 97 < 26) {
            return codePoint - 97;
          }
          return base;
        }
        function digitToBasic(digit, flag) {
          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        }
        function adapt(delta, numPoints, firstTime) {
          var k = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; delta > baseMinusTMin * tMax >> 1; k += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        }
        function decode(input) {
          var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
          basic = input.lastIndexOf(delimiter);
          if (basic < 0) {
            basic = 0;
          }
          for (j = 0; j < basic; ++j) {
            if (input.charCodeAt(j) >= 128) {
              error("not-basic");
            }
            output.push(input.charCodeAt(j));
          }
          for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
            for (oldi = i, w = 1, k = base; ; k += base) {
              if (index >= inputLength) {
                error("invalid-input");
              }
              digit = basicToDigit(input.charCodeAt(index++));
              if (digit >= base || digit > floor((maxInt - i) / w)) {
                error("overflow");
              }
              i += digit * w;
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (digit < t) {
                break;
              }
              baseMinusT = base - t;
              if (w > floor(maxInt / baseMinusT)) {
                error("overflow");
              }
              w *= baseMinusT;
            }
            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi == 0);
            if (floor(i / out) > maxInt - n) {
              error("overflow");
            }
            n += floor(i / out);
            i %= out;
            output.splice(i++, 0, n);
          }
          return ucs2encode(output);
        }
        function encode(input) {
          var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
          input = ucs2decode(input);
          inputLength = input.length;
          n = initialN;
          delta = 0;
          bias = initialBias;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < 128) {
              output.push(stringFromCharCode(currentValue));
            }
          }
          handledCPCount = basicLength = output.length;
          if (basicLength) {
            output.push(delimiter);
          }
          while (handledCPCount < inputLength) {
            for (m = maxInt, j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }
            handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
              error("overflow");
            }
            delta += (m - n) * handledCPCountPlusOne;
            n = m;
            for (j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue < n && ++delta > maxInt) {
                error("overflow");
              }
              if (currentValue == n) {
                for (q = delta, k = base; ; k += base) {
                  t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  qMinusT = q - t;
                  baseMinusT = base - t;
                  output.push(
                    stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                  );
                  q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }
            ++delta;
            ++n;
          }
          return output.join("");
        }
        function toUnicode(input) {
          return mapDomain(input, function(string) {
            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
          });
        }
        function toASCII(input) {
          return mapDomain(input, function(string) {
            return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
          });
        }
        punycode = {
          "version": "1.3.2",
          "ucs2": {
            "decode": ucs2decode,
            "encode": ucs2encode
          },
          "decode": decode,
          "encode": encode,
          "toASCII": toASCII,
          "toUnicode": toUnicode
        };
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          define("punycode", function() {
            return punycode;
          });
        } else if (freeExports && freeModule) {
          if (module.exports == freeExports) {
            freeModule.exports = punycode;
          } else {
            for (key in punycode) {
              punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
            }
          }
        } else {
          root.punycode = punycode;
        }
      })(exports);
    }
  });

  // node_modules/urijs/src/IPv6.js
  var require_IPv6 = __commonJS({
    "node_modules/urijs/src/IPv6.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof module === "object" && module.exports) {
          module.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define(factory);
        } else {
          root.IPv6 = factory(root);
        }
      })(exports, function(root) {
        "use strict";
        var _IPv6 = root && root.IPv6;
        function bestPresentation(address) {
          var _address = address.toLowerCase();
          var segments = _address.split(":");
          var length = segments.length;
          var total = 8;
          if (segments[0] === "" && segments[1] === "" && segments[2] === "") {
            segments.shift();
            segments.shift();
          } else if (segments[0] === "" && segments[1] === "") {
            segments.shift();
          } else if (segments[length - 1] === "" && segments[length - 2] === "") {
            segments.pop();
          }
          length = segments.length;
          if (segments[length - 1].indexOf(".") !== -1) {
            total = 7;
          }
          var pos;
          for (pos = 0; pos < length; pos++) {
            if (segments[pos] === "") {
              break;
            }
          }
          if (pos < total) {
            segments.splice(pos, 1, "0000");
            while (segments.length < total) {
              segments.splice(pos, 0, "0000");
            }
          }
          var _segments;
          for (var i = 0; i < total; i++) {
            _segments = segments[i].split("");
            for (var j = 0; j < 3; j++) {
              if (_segments[0] === "0" && _segments.length > 1) {
                _segments.splice(0, 1);
              } else {
                break;
              }
            }
            segments[i] = _segments.join("");
          }
          var best = -1;
          var _best = 0;
          var _current = 0;
          var current = -1;
          var inzeroes = false;
          for (i = 0; i < total; i++) {
            if (inzeroes) {
              if (segments[i] === "0") {
                _current += 1;
              } else {
                inzeroes = false;
                if (_current > _best) {
                  best = current;
                  _best = _current;
                }
              }
            } else {
              if (segments[i] === "0") {
                inzeroes = true;
                current = i;
                _current = 1;
              }
            }
          }
          if (_current > _best) {
            best = current;
            _best = _current;
          }
          if (_best > 1) {
            segments.splice(best, _best, "");
          }
          length = segments.length;
          var result = "";
          if (segments[0] === "") {
            result = ":";
          }
          for (i = 0; i < length; i++) {
            result += segments[i];
            if (i === length - 1) {
              break;
            }
            result += ":";
          }
          if (segments[length - 1] === "") {
            result += ":";
          }
          return result;
        }
        function noConflict() {
          if (root.IPv6 === this) {
            root.IPv6 = _IPv6;
          }
          return this;
        }
        return {
          best: bestPresentation,
          noConflict
        };
      });
    }
  });

  // node_modules/urijs/src/SecondLevelDomains.js
  var require_SecondLevelDomains = __commonJS({
    "node_modules/urijs/src/SecondLevelDomains.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof module === "object" && module.exports) {
          module.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define(factory);
        } else {
          root.SecondLevelDomains = factory(root);
        }
      })(exports, function(root) {
        "use strict";
        var _SecondLevelDomains = root && root.SecondLevelDomains;
        var SLD = {
          list: {
            "ac": " com gov mil net org ",
            "ae": " ac co gov mil name net org pro sch ",
            "af": " com edu gov net org ",
            "al": " com edu gov mil net org ",
            "ao": " co ed gv it og pb ",
            "ar": " com edu gob gov int mil net org tur ",
            "at": " ac co gv or ",
            "au": " asn com csiro edu gov id net org ",
            "ba": " co com edu gov mil net org rs unbi unmo unsa untz unze ",
            "bb": " biz co com edu gov info net org store tv ",
            "bh": " biz cc com edu gov info net org ",
            "bn": " com edu gov net org ",
            "bo": " com edu gob gov int mil net org tv ",
            "br": " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",
            "bs": " com edu gov net org ",
            "bz": " du et om ov rg ",
            "ca": " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
            "ck": " biz co edu gen gov info net org ",
            "cn": " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",
            "co": " com edu gov mil net nom org ",
            "cr": " ac c co ed fi go or sa ",
            "cy": " ac biz com ekloges gov ltd name net org parliament press pro tm ",
            "do": " art com edu gob gov mil net org sld web ",
            "dz": " art asso com edu gov net org pol ",
            "ec": " com edu fin gov info med mil net org pro ",
            "eg": " com edu eun gov mil name net org sci ",
            "er": " com edu gov ind mil net org rochest w ",
            "es": " com edu gob nom org ",
            "et": " biz com edu gov info name net org ",
            "fj": " ac biz com info mil name net org pro ",
            "fk": " ac co gov net nom org ",
            "fr": " asso com f gouv nom prd presse tm ",
            "gg": " co net org ",
            "gh": " com edu gov mil org ",
            "gn": " ac com gov net org ",
            "gr": " com edu gov mil net org ",
            "gt": " com edu gob ind mil net org ",
            "gu": " com edu gov net org ",
            "hk": " com edu gov idv net org ",
            "hu": " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
            "id": " ac co go mil net or sch web ",
            "il": " ac co gov idf k12 muni net org ",
            "in": " ac co edu ernet firm gen gov i ind mil net nic org res ",
            "iq": " com edu gov i mil net org ",
            "ir": " ac co dnssec gov i id net org sch ",
            "it": " edu gov ",
            "je": " co net org ",
            "jo": " com edu gov mil name net org sch ",
            "jp": " ac ad co ed go gr lg ne or ",
            "ke": " ac co go info me mobi ne or sc ",
            "kh": " com edu gov mil net org per ",
            "ki": " biz com de edu gov info mob net org tel ",
            "km": " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
            "kn": " edu gov net org ",
            "kr": " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",
            "kw": " com edu gov net org ",
            "ky": " com edu gov net org ",
            "kz": " com edu gov mil net org ",
            "lb": " com edu gov net org ",
            "lk": " assn com edu gov grp hotel int ltd net ngo org sch soc web ",
            "lr": " com edu gov net org ",
            "lv": " asn com conf edu gov id mil net org ",
            "ly": " com edu gov id med net org plc sch ",
            "ma": " ac co gov m net org press ",
            "mc": " asso tm ",
            "me": " ac co edu gov its net org priv ",
            "mg": " com edu gov mil nom org prd tm ",
            "mk": " com edu gov inf name net org pro ",
            "ml": " com edu gov net org presse ",
            "mn": " edu gov org ",
            "mo": " com edu gov net org ",
            "mt": " com edu gov net org ",
            "mv": " aero biz com coop edu gov info int mil museum name net org pro ",
            "mw": " ac co com coop edu gov int museum net org ",
            "mx": " com edu gob net org ",
            "my": " com edu gov mil name net org sch ",
            "nf": " arts com firm info net other per rec store web ",
            "ng": " biz com edu gov mil mobi name net org sch ",
            "ni": " ac co com edu gob mil net nom org ",
            "np": " com edu gov mil net org ",
            "nr": " biz com edu gov info net org ",
            "om": " ac biz co com edu gov med mil museum net org pro sch ",
            "pe": " com edu gob mil net nom org sld ",
            "ph": " com edu gov i mil net ngo org ",
            "pk": " biz com edu fam gob gok gon gop gos gov net org web ",
            "pl": " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",
            "pr": " ac biz com edu est gov info isla name net org pro prof ",
            "ps": " com edu gov net org plo sec ",
            "pw": " belau co ed go ne or ",
            "ro": " arts com firm info nom nt org rec store tm www ",
            "rs": " ac co edu gov in org ",
            "sb": " com edu gov net org ",
            "sc": " com edu gov net org ",
            "sh": " co com edu gov net nom org ",
            "sl": " com edu gov net org ",
            "st": " co com consulado edu embaixada gov mil net org principe saotome store ",
            "sv": " com edu gob org red ",
            "sz": " ac co org ",
            "tr": " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",
            "tt": " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
            "tw": " club com ebiz edu game gov idv mil net org ",
            "mu": " ac co com gov net or org ",
            "mz": " ac co edu gov org ",
            "na": " co com ",
            "nz": " ac co cri geek gen govt health iwi maori mil net org parliament school ",
            "pa": " abo ac com edu gob ing med net nom org sld ",
            "pt": " com edu gov int net nome org publ ",
            "py": " com edu gov mil net org ",
            "qa": " com edu gov mil net org ",
            "re": " asso com nom ",
            "ru": " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
            "rw": " ac co com edu gouv gov int mil net ",
            "sa": " com edu gov med net org pub sch ",
            "sd": " com edu gov info med net org tv ",
            "se": " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",
            "sg": " com edu gov idn net org per ",
            "sn": " art com edu gouv org perso univ ",
            "sy": " com edu gov mil net news org ",
            "th": " ac co go in mi net or ",
            "tj": " ac biz co com edu go gov info int mil name net nic org test web ",
            "tn": " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
            "tz": " ac co go ne or ",
            "ua": " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",
            "ug": " ac co go ne or org sc ",
            "uk": " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
            "us": " dni fed isa kids nsn ",
            "uy": " com edu gub mil net org ",
            "ve": " co com edu gob info mil net org web ",
            "vi": " co com k12 net org ",
            "vn": " ac biz com edu gov health info int name net org pro ",
            "ye": " co com gov ltd me net org plc ",
            "yu": " ac co edu gov org ",
            "za": " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",
            "zm": " ac co com edu gov net org sch ",
            "com": "ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ",
            "net": "gb jp se uk ",
            "org": "ae",
            "de": "com "
          },
          has: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return false;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
              return false;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return false;
            }
            return sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") >= 0;
          },
          is: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return false;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset >= 0) {
              return false;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return false;
            }
            return sldList.indexOf(" " + domain.slice(0, tldOffset) + " ") >= 0;
          },
          get: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return null;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
              return null;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return null;
            }
            if (sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") < 0) {
              return null;
            }
            return domain.slice(sldOffset + 1);
          },
          noConflict: function() {
            if (root.SecondLevelDomains === this) {
              root.SecondLevelDomains = _SecondLevelDomains;
            }
            return this;
          }
        };
        return SLD;
      });
    }
  });

  // node_modules/urijs/src/URI.js
  var require_URI = __commonJS({
    "node_modules/urijs/src/URI.js"(exports, module) {
      (function(root, factory) {
        "use strict";
        if (typeof module === "object" && module.exports) {
          module.exports = factory(require_punycode(), require_IPv6(), require_SecondLevelDomains());
        } else if (typeof define === "function" && define.amd) {
          define(["./punycode", "./IPv6", "./SecondLevelDomains"], factory);
        } else {
          root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
        }
      })(exports, function(punycode, IPv6, SLD, root) {
        "use strict";
        var _URI = root && root.URI;
        function URI2(url, base) {
          var _urlSupplied = arguments.length >= 1;
          var _baseSupplied = arguments.length >= 2;
          if (!(this instanceof URI2)) {
            if (_urlSupplied) {
              if (_baseSupplied) {
                return new URI2(url, base);
              }
              return new URI2(url);
            }
            return new URI2();
          }
          if (url === void 0) {
            if (_urlSupplied) {
              throw new TypeError("undefined is not a valid argument for URI");
            }
            if (typeof location !== "undefined") {
              url = location.href + "";
            } else {
              url = "";
            }
          }
          if (url === null) {
            if (_urlSupplied) {
              throw new TypeError("null is not a valid argument for URI");
            }
          }
          this.href(url);
          if (base !== void 0) {
            return this.absoluteTo(base);
          }
          return this;
        }
        function isInteger(value) {
          return /^[0-9]+$/.test(value);
        }
        URI2.version = "1.19.11";
        var p = URI2.prototype;
        var hasOwn = Object.prototype.hasOwnProperty;
        function escapeRegEx(string) {
          return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        }
        function getType(value) {
          if (value === void 0) {
            return "Undefined";
          }
          return String(Object.prototype.toString.call(value)).slice(8, -1);
        }
        function isArray(obj) {
          return getType(obj) === "Array";
        }
        function filterArrayValues(data, value) {
          var lookup = {};
          var i, length;
          if (getType(value) === "RegExp") {
            lookup = null;
          } else if (isArray(value)) {
            for (i = 0, length = value.length; i < length; i++) {
              lookup[value[i]] = true;
            }
          } else {
            lookup[value] = true;
          }
          for (i = 0, length = data.length; i < length; i++) {
            var _match = lookup && lookup[data[i]] !== void 0 || !lookup && value.test(data[i]);
            if (_match) {
              data.splice(i, 1);
              length--;
              i--;
            }
          }
          return data;
        }
        function arrayContains(list, value) {
          var i, length;
          if (isArray(value)) {
            for (i = 0, length = value.length; i < length; i++) {
              if (!arrayContains(list, value[i])) {
                return false;
              }
            }
            return true;
          }
          var _type = getType(value);
          for (i = 0, length = list.length; i < length; i++) {
            if (_type === "RegExp") {
              if (typeof list[i] === "string" && list[i].match(value)) {
                return true;
              }
            } else if (list[i] === value) {
              return true;
            }
          }
          return false;
        }
        function arraysEqual(one, two) {
          if (!isArray(one) || !isArray(two)) {
            return false;
          }
          if (one.length !== two.length) {
            return false;
          }
          one.sort();
          two.sort();
          for (var i = 0, l = one.length; i < l; i++) {
            if (one[i] !== two[i]) {
              return false;
            }
          }
          return true;
        }
        function trimSlashes(text) {
          var trim_expression = /^\/+|\/+$/g;
          return text.replace(trim_expression, "");
        }
        URI2._parts = function() {
          return {
            protocol: null,
            username: null,
            password: null,
            hostname: null,
            urn: null,
            port: null,
            path: null,
            query: null,
            fragment: null,
            preventInvalidHostname: URI2.preventInvalidHostname,
            duplicateQueryParameters: URI2.duplicateQueryParameters,
            escapeQuerySpace: URI2.escapeQuerySpace
          };
        };
        URI2.preventInvalidHostname = false;
        URI2.duplicateQueryParameters = false;
        URI2.escapeQuerySpace = true;
        URI2.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
        URI2.idn_expression = /[^a-z0-9\._-]/i;
        URI2.punycode_expression = /(xn--)/i;
        URI2.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        URI2.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        URI2.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
        URI2.findUri = {
          start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
          end: /[\s\r\n]|$/,
          trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
          parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g
        };
        URI2.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
        URI2.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
        URI2.defaultPorts = {
          http: "80",
          https: "443",
          ftp: "21",
          gopher: "70",
          ws: "80",
          wss: "443"
        };
        URI2.hostProtocols = [
          "http",
          "https"
        ];
        URI2.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
        URI2.domAttributes = {
          "a": "href",
          "blockquote": "cite",
          "link": "href",
          "base": "href",
          "script": "src",
          "form": "action",
          "img": "src",
          "area": "href",
          "iframe": "src",
          "embed": "src",
          "source": "src",
          "track": "src",
          "input": "src",
          "audio": "src",
          "video": "src"
        };
        URI2.getDomAttribute = function(node) {
          if (!node || !node.nodeName) {
            return void 0;
          }
          var nodeName = node.nodeName.toLowerCase();
          if (nodeName === "input" && node.type !== "image") {
            return void 0;
          }
          return URI2.domAttributes[nodeName];
        };
        function escapeForDumbFirefox36(value) {
          return escape(value);
        }
        function strictEncodeURIComponent(string) {
          return encodeURIComponent(string).replace(/[!'()*]/g, escapeForDumbFirefox36).replace(/\*/g, "%2A");
        }
        URI2.encode = strictEncodeURIComponent;
        URI2.decode = decodeURIComponent;
        URI2.iso8859 = function() {
          URI2.encode = escape;
          URI2.decode = unescape;
        };
        URI2.unicode = function() {
          URI2.encode = strictEncodeURIComponent;
          URI2.decode = decodeURIComponent;
        };
        URI2.characters = {
          pathname: {
            encode: {
              expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
              map: {
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
              }
            },
            decode: {
              expression: /[\/\?#]/g,
              map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
              }
            }
          },
          reserved: {
            encode: {
              expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
              map: {
                "%3A": ":",
                "%2F": "/",
                "%3F": "?",
                "%23": "#",
                "%5B": "[",
                "%5D": "]",
                "%40": "@",
                "%21": "!",
                "%24": "$",
                "%26": "&",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "="
              }
            }
          },
          urnpath: {
            encode: {
              expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
              map: {
                "%21": "!",
                "%24": "$",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%40": "@"
              }
            },
            decode: {
              expression: /[\/\?#:]/g,
              map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23",
                ":": "%3A"
              }
            }
          }
        };
        URI2.encodeQuery = function(string, escapeQuerySpace) {
          var escaped = URI2.encode(string + "");
          if (escapeQuerySpace === void 0) {
            escapeQuerySpace = URI2.escapeQuerySpace;
          }
          return escapeQuerySpace ? escaped.replace(/%20/g, "+") : escaped;
        };
        URI2.decodeQuery = function(string, escapeQuerySpace) {
          string += "";
          if (escapeQuerySpace === void 0) {
            escapeQuerySpace = URI2.escapeQuerySpace;
          }
          try {
            return URI2.decode(escapeQuerySpace ? string.replace(/\+/g, "%20") : string);
          } catch (e) {
            return string;
          }
        };
        var _parts = { "encode": "encode", "decode": "decode" };
        var _part;
        var generateAccessor = function(_group, _part2) {
          return function(string) {
            try {
              return URI2[_part2](string + "").replace(URI2.characters[_group][_part2].expression, function(c) {
                return URI2.characters[_group][_part2].map[c];
              });
            } catch (e) {
              return string;
            }
          };
        };
        for (_part in _parts) {
          URI2[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
          URI2[_part + "UrnPathSegment"] = generateAccessor("urnpath", _parts[_part]);
        }
        var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
          return function(string) {
            var actualCodingFunc;
            if (!_innerCodingFuncName) {
              actualCodingFunc = URI2[_codingFuncName];
            } else {
              actualCodingFunc = function(string2) {
                return URI2[_codingFuncName](URI2[_innerCodingFuncName](string2));
              };
            }
            var segments = (string + "").split(_sep);
            for (var i = 0, length = segments.length; i < length; i++) {
              segments[i] = actualCodingFunc(segments[i]);
            }
            return segments.join(_sep);
          };
        };
        URI2.decodePath = generateSegmentedPathFunction("/", "decodePathSegment");
        URI2.decodeUrnPath = generateSegmentedPathFunction(":", "decodeUrnPathSegment");
        URI2.recodePath = generateSegmentedPathFunction("/", "encodePathSegment", "decode");
        URI2.recodeUrnPath = generateSegmentedPathFunction(":", "encodeUrnPathSegment", "decode");
        URI2.encodeReserved = generateAccessor("reserved", "encode");
        URI2.parse = function(string, parts) {
          var pos;
          if (!parts) {
            parts = {
              preventInvalidHostname: URI2.preventInvalidHostname
            };
          }
          string = string.replace(URI2.leading_whitespace_expression, "");
          string = string.replace(URI2.ascii_tab_whitespace, "");
          pos = string.indexOf("#");
          if (pos > -1) {
            parts.fragment = string.substring(pos + 1) || null;
            string = string.substring(0, pos);
          }
          pos = string.indexOf("?");
          if (pos > -1) {
            parts.query = string.substring(pos + 1) || null;
            string = string.substring(0, pos);
          }
          string = string.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://");
          string = string.replace(/^[/\\]{2,}/i, "//");
          if (string.substring(0, 2) === "//") {
            parts.protocol = null;
            string = string.substring(2);
            string = URI2.parseAuthority(string, parts);
          } else {
            pos = string.indexOf(":");
            if (pos > -1) {
              parts.protocol = string.substring(0, pos) || null;
              if (parts.protocol && !parts.protocol.match(URI2.protocol_expression)) {
                parts.protocol = void 0;
              } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, "/") === "//") {
                string = string.substring(pos + 3);
                string = URI2.parseAuthority(string, parts);
              } else {
                string = string.substring(pos + 1);
                parts.urn = true;
              }
            }
          }
          parts.path = string;
          return parts;
        };
        URI2.parseHost = function(string, parts) {
          if (!string) {
            string = "";
          }
          string = string.replace(/\\/g, "/");
          var pos = string.indexOf("/");
          var bracketPos;
          var t;
          if (pos === -1) {
            pos = string.length;
          }
          if (string.charAt(0) === "[") {
            bracketPos = string.indexOf("]");
            parts.hostname = string.substring(1, bracketPos) || null;
            parts.port = string.substring(bracketPos + 2, pos) || null;
            if (parts.port === "/") {
              parts.port = null;
            }
          } else {
            var firstColon = string.indexOf(":");
            var firstSlash = string.indexOf("/");
            var nextColon = string.indexOf(":", firstColon + 1);
            if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
              parts.hostname = string.substring(0, pos) || null;
              parts.port = null;
            } else {
              t = string.substring(0, pos).split(":");
              parts.hostname = t[0] || null;
              parts.port = t[1] || null;
            }
          }
          if (parts.hostname && string.substring(pos).charAt(0) !== "/") {
            pos++;
            string = "/" + string;
          }
          if (parts.preventInvalidHostname) {
            URI2.ensureValidHostname(parts.hostname, parts.protocol);
          }
          if (parts.port) {
            URI2.ensureValidPort(parts.port);
          }
          return string.substring(pos) || "/";
        };
        URI2.parseAuthority = function(string, parts) {
          string = URI2.parseUserinfo(string, parts);
          return URI2.parseHost(string, parts);
        };
        URI2.parseUserinfo = function(string, parts) {
          var _string = string;
          var firstBackSlash = string.indexOf("\\");
          if (firstBackSlash !== -1) {
            string = string.replace(/\\/g, "/");
          }
          var firstSlash = string.indexOf("/");
          var pos = string.lastIndexOf("@", firstSlash > -1 ? firstSlash : string.length - 1);
          var t;
          if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
            t = string.substring(0, pos).split(":");
            parts.username = t[0] ? URI2.decode(t[0]) : null;
            t.shift();
            parts.password = t[0] ? URI2.decode(t.join(":")) : null;
            string = _string.substring(pos + 1);
          } else {
            parts.username = null;
            parts.password = null;
          }
          return string;
        };
        URI2.parseQuery = function(string, escapeQuerySpace) {
          if (!string) {
            return {};
          }
          string = string.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "");
          if (!string) {
            return {};
          }
          var items = {};
          var splits = string.split("&");
          var length = splits.length;
          var v, name, value;
          for (var i = 0; i < length; i++) {
            v = splits[i].split("=");
            name = URI2.decodeQuery(v.shift(), escapeQuerySpace);
            value = v.length ? URI2.decodeQuery(v.join("="), escapeQuerySpace) : null;
            if (name === "__proto__") {
              continue;
            } else if (hasOwn.call(items, name)) {
              if (typeof items[name] === "string" || items[name] === null) {
                items[name] = [items[name]];
              }
              items[name].push(value);
            } else {
              items[name] = value;
            }
          }
          return items;
        };
        URI2.build = function(parts) {
          var t = "";
          var requireAbsolutePath = false;
          if (parts.protocol) {
            t += parts.protocol + ":";
          }
          if (!parts.urn && (t || parts.hostname)) {
            t += "//";
            requireAbsolutePath = true;
          }
          t += URI2.buildAuthority(parts) || "";
          if (typeof parts.path === "string") {
            if (parts.path.charAt(0) !== "/" && requireAbsolutePath) {
              t += "/";
            }
            t += parts.path;
          }
          if (typeof parts.query === "string" && parts.query) {
            t += "?" + parts.query;
          }
          if (typeof parts.fragment === "string" && parts.fragment) {
            t += "#" + parts.fragment;
          }
          return t;
        };
        URI2.buildHost = function(parts) {
          var t = "";
          if (!parts.hostname) {
            return "";
          } else if (URI2.ip6_expression.test(parts.hostname)) {
            t += "[" + parts.hostname + "]";
          } else {
            t += parts.hostname;
          }
          if (parts.port) {
            t += ":" + parts.port;
          }
          return t;
        };
        URI2.buildAuthority = function(parts) {
          return URI2.buildUserinfo(parts) + URI2.buildHost(parts);
        };
        URI2.buildUserinfo = function(parts) {
          var t = "";
          if (parts.username) {
            t += URI2.encode(parts.username);
          }
          if (parts.password) {
            t += ":" + URI2.encode(parts.password);
          }
          if (t) {
            t += "@";
          }
          return t;
        };
        URI2.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
          var t = "";
          var unique, key, i, length;
          for (key in data) {
            if (key === "__proto__") {
              continue;
            } else if (hasOwn.call(data, key)) {
              if (isArray(data[key])) {
                unique = {};
                for (i = 0, length = data[key].length; i < length; i++) {
                  if (data[key][i] !== void 0 && unique[data[key][i] + ""] === void 0) {
                    t += "&" + URI2.buildQueryParameter(key, data[key][i], escapeQuerySpace);
                    if (duplicateQueryParameters !== true) {
                      unique[data[key][i] + ""] = true;
                    }
                  }
                }
              } else if (data[key] !== void 0) {
                t += "&" + URI2.buildQueryParameter(key, data[key], escapeQuerySpace);
              }
            }
          }
          return t.substring(1);
        };
        URI2.buildQueryParameter = function(name, value, escapeQuerySpace) {
          return URI2.encodeQuery(name, escapeQuerySpace) + (value !== null ? "=" + URI2.encodeQuery(value, escapeQuerySpace) : "");
        };
        URI2.addQuery = function(data, name, value) {
          if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                URI2.addQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            if (data[name] === void 0) {
              data[name] = value;
              return;
            } else if (typeof data[name] === "string") {
              data[name] = [data[name]];
            }
            if (!isArray(value)) {
              value = [value];
            }
            data[name] = (data[name] || []).concat(value);
          } else {
            throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
          }
        };
        URI2.setQuery = function(data, name, value) {
          if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                URI2.setQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            data[name] = value === void 0 ? null : value;
          } else {
            throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
          }
        };
        URI2.removeQuery = function(data, name, value) {
          var i, length, key;
          if (isArray(name)) {
            for (i = 0, length = name.length; i < length; i++) {
              data[name[i]] = void 0;
            }
          } else if (getType(name) === "RegExp") {
            for (key in data) {
              if (name.test(key)) {
                data[key] = void 0;
              }
            }
          } else if (typeof name === "object") {
            for (key in name) {
              if (hasOwn.call(name, key)) {
                URI2.removeQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            if (value !== void 0) {
              if (getType(value) === "RegExp") {
                if (!isArray(data[name]) && value.test(data[name])) {
                  data[name] = void 0;
                } else {
                  data[name] = filterArrayValues(data[name], value);
                }
              } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
                data[name] = void 0;
              } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
              }
            } else {
              data[name] = void 0;
            }
          } else {
            throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
          }
        };
        URI2.hasQuery = function(data, name, value, withinArray) {
          switch (getType(name)) {
            case "String":
              break;
            case "RegExp":
              for (var key in data) {
                if (hasOwn.call(data, key)) {
                  if (name.test(key) && (value === void 0 || URI2.hasQuery(data, key, value))) {
                    return true;
                  }
                }
              }
              return false;
            case "Object":
              for (var _key in name) {
                if (hasOwn.call(name, _key)) {
                  if (!URI2.hasQuery(data, _key, name[_key])) {
                    return false;
                  }
                }
              }
              return true;
            default:
              throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
          }
          switch (getType(value)) {
            case "Undefined":
              return name in data;
            case "Boolean":
              var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
              return value === _booly;
            case "Function":
              return !!value(data[name], name, data);
            case "Array":
              if (!isArray(data[name])) {
                return false;
              }
              var op = withinArray ? arrayContains : arraysEqual;
              return op(data[name], value);
            case "RegExp":
              if (!isArray(data[name])) {
                return Boolean(data[name] && data[name].match(value));
              }
              if (!withinArray) {
                return false;
              }
              return arrayContains(data[name], value);
            case "Number":
              value = String(value);
            case "String":
              if (!isArray(data[name])) {
                return data[name] === value;
              }
              if (!withinArray) {
                return false;
              }
              return arrayContains(data[name], value);
            default:
              throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
          }
        };
        URI2.joinPaths = function() {
          var input = [];
          var segments = [];
          var nonEmptySegments = 0;
          for (var i = 0; i < arguments.length; i++) {
            var url = new URI2(arguments[i]);
            input.push(url);
            var _segments = url.segment();
            for (var s = 0; s < _segments.length; s++) {
              if (typeof _segments[s] === "string") {
                segments.push(_segments[s]);
              }
              if (_segments[s]) {
                nonEmptySegments++;
              }
            }
          }
          if (!segments.length || !nonEmptySegments) {
            return new URI2("");
          }
          var uri = new URI2("").segment(segments);
          if (input[0].path() === "" || input[0].path().slice(0, 1) === "/") {
            uri.path("/" + uri.path());
          }
          return uri.normalize();
        };
        URI2.commonPath = function(one, two) {
          var length = Math.min(one.length, two.length);
          var pos;
          for (pos = 0; pos < length; pos++) {
            if (one.charAt(pos) !== two.charAt(pos)) {
              pos--;
              break;
            }
          }
          if (pos < 1) {
            return one.charAt(0) === two.charAt(0) && one.charAt(0) === "/" ? "/" : "";
          }
          if (one.charAt(pos) !== "/" || two.charAt(pos) !== "/") {
            pos = one.substring(0, pos).lastIndexOf("/");
          }
          return one.substring(0, pos + 1);
        };
        URI2.withinString = function(string, callback, options) {
          options || (options = {});
          var _start = options.start || URI2.findUri.start;
          var _end = options.end || URI2.findUri.end;
          var _trim = options.trim || URI2.findUri.trim;
          var _parens = options.parens || URI2.findUri.parens;
          var _attributeOpen = /[a-z0-9-]=["']?$/i;
          _start.lastIndex = 0;
          while (true) {
            var match = _start.exec(string);
            if (!match) {
              break;
            }
            var start = match.index;
            if (options.ignoreHtml) {
              var attributeOpen = string.slice(Math.max(start - 3, 0), start);
              if (attributeOpen && _attributeOpen.test(attributeOpen)) {
                continue;
              }
            }
            var end = start + string.slice(start).search(_end);
            var slice = string.slice(start, end);
            var parensEnd = -1;
            while (true) {
              var parensMatch = _parens.exec(slice);
              if (!parensMatch) {
                break;
              }
              var parensMatchEnd = parensMatch.index + parensMatch[0].length;
              parensEnd = Math.max(parensEnd, parensMatchEnd);
            }
            if (parensEnd > -1) {
              slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, "");
            } else {
              slice = slice.replace(_trim, "");
            }
            if (slice.length <= match[0].length) {
              continue;
            }
            if (options.ignore && options.ignore.test(slice)) {
              continue;
            }
            end = start + slice.length;
            var result = callback(slice, start, end, string);
            if (result === void 0) {
              _start.lastIndex = end;
              continue;
            }
            result = String(result);
            string = string.slice(0, start) + result + string.slice(end);
            _start.lastIndex = start + result.length;
          }
          _start.lastIndex = 0;
          return string;
        };
        URI2.ensureValidHostname = function(v, protocol) {
          var hasHostname = !!v;
          var hasProtocol = !!protocol;
          var rejectEmptyHostname = false;
          if (hasProtocol) {
            rejectEmptyHostname = arrayContains(URI2.hostProtocols, protocol);
          }
          if (rejectEmptyHostname && !hasHostname) {
            throw new TypeError("Hostname cannot be empty, if protocol is " + protocol);
          } else if (v && v.match(URI2.invalid_hostname_characters)) {
            if (!punycode) {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
            }
            if (punycode.toASCII(v).match(URI2.invalid_hostname_characters)) {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
            }
          }
        };
        URI2.ensureValidPort = function(v) {
          if (!v) {
            return;
          }
          var port = Number(v);
          if (isInteger(port) && port > 0 && port < 65536) {
            return;
          }
          throw new TypeError('Port "' + v + '" is not a valid port');
        };
        URI2.noConflict = function(removeAll) {
          if (removeAll) {
            var unconflicted = {
              URI: this.noConflict()
            };
            if (root.URITemplate && typeof root.URITemplate.noConflict === "function") {
              unconflicted.URITemplate = root.URITemplate.noConflict();
            }
            if (root.IPv6 && typeof root.IPv6.noConflict === "function") {
              unconflicted.IPv6 = root.IPv6.noConflict();
            }
            if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === "function") {
              unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
            }
            return unconflicted;
          } else if (root.URI === this) {
            root.URI = _URI;
          }
          return this;
        };
        p.build = function(deferBuild) {
          if (deferBuild === true) {
            this._deferred_build = true;
          } else if (deferBuild === void 0 || this._deferred_build) {
            this._string = URI2.build(this._parts);
            this._deferred_build = false;
          }
          return this;
        };
        p.clone = function() {
          return new URI2(this);
        };
        p.valueOf = p.toString = function() {
          return this.build(false)._string;
        };
        function generateSimpleAccessor(_part2) {
          return function(v, build) {
            if (v === void 0) {
              return this._parts[_part2] || "";
            } else {
              this._parts[_part2] = v || null;
              this.build(!build);
              return this;
            }
          };
        }
        function generatePrefixAccessor(_part2, _key) {
          return function(v, build) {
            if (v === void 0) {
              return this._parts[_part2] || "";
            } else {
              if (v !== null) {
                v = v + "";
                if (v.charAt(0) === _key) {
                  v = v.substring(1);
                }
              }
              this._parts[_part2] = v;
              this.build(!build);
              return this;
            }
          };
        }
        p.protocol = generateSimpleAccessor("protocol");
        p.username = generateSimpleAccessor("username");
        p.password = generateSimpleAccessor("password");
        p.hostname = generateSimpleAccessor("hostname");
        p.port = generateSimpleAccessor("port");
        p.query = generatePrefixAccessor("query", "?");
        p.fragment = generatePrefixAccessor("fragment", "#");
        p.search = function(v, build) {
          var t = this.query(v, build);
          return typeof t === "string" && t.length ? "?" + t : t;
        };
        p.hash = function(v, build) {
          var t = this.fragment(v, build);
          return typeof t === "string" && t.length ? "#" + t : t;
        };
        p.pathname = function(v, build) {
          if (v === void 0 || v === true) {
            var res = this._parts.path || (this._parts.hostname ? "/" : "");
            return v ? (this._parts.urn ? URI2.decodeUrnPath : URI2.decodePath)(res) : res;
          } else {
            if (this._parts.urn) {
              this._parts.path = v ? URI2.recodeUrnPath(v) : "";
            } else {
              this._parts.path = v ? URI2.recodePath(v) : "/";
            }
            this.build(!build);
            return this;
          }
        };
        p.path = p.pathname;
        p.href = function(href, build) {
          var key;
          if (href === void 0) {
            return this.toString();
          }
          this._string = "";
          this._parts = URI2._parts();
          var _URI2 = href instanceof URI2;
          var _object = typeof href === "object" && (href.hostname || href.path || href.pathname);
          if (href.nodeName) {
            var attribute = URI2.getDomAttribute(href);
            href = href[attribute] || "";
            _object = false;
          }
          if (!_URI2 && _object && href.pathname !== void 0) {
            href = href.toString();
          }
          if (typeof href === "string" || href instanceof String) {
            this._parts = URI2.parse(String(href), this._parts);
          } else if (_URI2 || _object) {
            var src = _URI2 ? href._parts : href;
            for (key in src) {
              if (key === "query") {
                continue;
              }
              if (hasOwn.call(this._parts, key)) {
                this._parts[key] = src[key];
              }
            }
            if (src.query) {
              this.query(src.query, false);
            }
          } else {
            throw new TypeError("invalid input");
          }
          this.build(!build);
          return this;
        };
        p.is = function(what) {
          var ip = false;
          var ip4 = false;
          var ip6 = false;
          var name = false;
          var sld = false;
          var idn = false;
          var punycode2 = false;
          var relative = !this._parts.urn;
          if (this._parts.hostname) {
            relative = false;
            ip4 = URI2.ip4_expression.test(this._parts.hostname);
            ip6 = URI2.ip6_expression.test(this._parts.hostname);
            ip = ip4 || ip6;
            name = !ip;
            sld = name && SLD && SLD.has(this._parts.hostname);
            idn = name && URI2.idn_expression.test(this._parts.hostname);
            punycode2 = name && URI2.punycode_expression.test(this._parts.hostname);
          }
          switch (what.toLowerCase()) {
            case "relative":
              return relative;
            case "absolute":
              return !relative;
            case "domain":
            case "name":
              return name;
            case "sld":
              return sld;
            case "ip":
              return ip;
            case "ip4":
            case "ipv4":
            case "inet4":
              return ip4;
            case "ip6":
            case "ipv6":
            case "inet6":
              return ip6;
            case "idn":
              return idn;
            case "url":
              return !this._parts.urn;
            case "urn":
              return !!this._parts.urn;
            case "punycode":
              return punycode2;
          }
          return null;
        };
        var _protocol = p.protocol;
        var _port = p.port;
        var _hostname = p.hostname;
        p.protocol = function(v, build) {
          if (v) {
            v = v.replace(/:(\/\/)?$/, "");
            if (!v.match(URI2.protocol_expression)) {
              throw new TypeError('Protocol "' + v + `" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]`);
            }
          }
          return _protocol.call(this, v, build);
        };
        p.scheme = p.protocol;
        p.port = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v !== void 0) {
            if (v === 0) {
              v = null;
            }
            if (v) {
              v += "";
              if (v.charAt(0) === ":") {
                v = v.substring(1);
              }
              URI2.ensureValidPort(v);
            }
          }
          return _port.call(this, v, build);
        };
        p.hostname = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v !== void 0) {
            var x = { preventInvalidHostname: this._parts.preventInvalidHostname };
            var res = URI2.parseHost(v, x);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            v = x.hostname;
            if (this._parts.preventInvalidHostname) {
              URI2.ensureValidHostname(v, this._parts.protocol);
            }
          }
          return _hostname.call(this, v, build);
        };
        p.origin = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            var protocol = this.protocol();
            var authority = this.authority();
            if (!authority) {
              return "";
            }
            return (protocol ? protocol + "://" : "") + this.authority();
          } else {
            var origin = URI2(v);
            this.protocol(origin.protocol()).authority(origin.authority()).build(!build);
            return this;
          }
        };
        p.host = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            return this._parts.hostname ? URI2.buildHost(this._parts) : "";
          } else {
            var res = URI2.parseHost(v, this._parts);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            this.build(!build);
            return this;
          }
        };
        p.authority = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            return this._parts.hostname ? URI2.buildAuthority(this._parts) : "";
          } else {
            var res = URI2.parseAuthority(v, this._parts);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            this.build(!build);
            return this;
          }
        };
        p.userinfo = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            var t = URI2.buildUserinfo(this._parts);
            return t ? t.substring(0, t.length - 1) : t;
          } else {
            if (v[v.length - 1] !== "@") {
              v += "@";
            }
            URI2.parseUserinfo(v, this._parts);
            this.build(!build);
            return this;
          }
        };
        p.resource = function(v, build) {
          var parts;
          if (v === void 0) {
            return this.path() + this.search() + this.hash();
          }
          parts = URI2.parse(v);
          this._parts.path = parts.path;
          this._parts.query = parts.query;
          this._parts.fragment = parts.fragment;
          this.build(!build);
          return this;
        };
        p.subdomain = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var end = this._parts.hostname.length - this.domain().length - 1;
            return this._parts.hostname.substring(0, end) || "";
          } else {
            var e = this._parts.hostname.length - this.domain().length;
            var sub = this._parts.hostname.substring(0, e);
            var replace = new RegExp("^" + escapeRegEx(sub));
            if (v && v.charAt(v.length - 1) !== ".") {
              v += ".";
            }
            if (v.indexOf(":") !== -1) {
              throw new TypeError("Domains cannot contain colons");
            }
            if (v) {
              URI2.ensureValidHostname(v, this._parts.protocol);
            }
            this._parts.hostname = this._parts.hostname.replace(replace, v);
            this.build(!build);
            return this;
          }
        };
        p.domain = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v === "boolean") {
            build = v;
            v = void 0;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var t = this._parts.hostname.match(/\./g);
            if (t && t.length < 2) {
              return this._parts.hostname;
            }
            var end = this._parts.hostname.length - this.tld(build).length - 1;
            end = this._parts.hostname.lastIndexOf(".", end - 1) + 1;
            return this._parts.hostname.substring(end) || "";
          } else {
            if (!v) {
              throw new TypeError("cannot set domain empty");
            }
            if (v.indexOf(":") !== -1) {
              throw new TypeError("Domains cannot contain colons");
            }
            URI2.ensureValidHostname(v, this._parts.protocol);
            if (!this._parts.hostname || this.is("IP")) {
              this._parts.hostname = v;
            } else {
              var replace = new RegExp(escapeRegEx(this.domain()) + "$");
              this._parts.hostname = this._parts.hostname.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.tld = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v === "boolean") {
            build = v;
            v = void 0;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var pos = this._parts.hostname.lastIndexOf(".");
            var tld = this._parts.hostname.substring(pos + 1);
            if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
              return SLD.get(this._parts.hostname) || tld;
            }
            return tld;
          } else {
            var replace;
            if (!v) {
              throw new TypeError("cannot set TLD empty");
            } else if (v.match(/[^a-zA-Z0-9-]/)) {
              if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
              } else {
                throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
              }
            } else if (!this._parts.hostname || this.is("IP")) {
              throw new ReferenceError("cannot set TLD on non-domain host");
            } else {
              replace = new RegExp(escapeRegEx(this.tld()) + "$");
              this._parts.hostname = this._parts.hostname.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.directory = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0 || v === true) {
            if (!this._parts.path && !this._parts.hostname) {
              return "";
            }
            if (this._parts.path === "/") {
              return "/";
            }
            var end = this._parts.path.length - this.filename().length - 1;
            var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");
            return v ? URI2.decodePath(res) : res;
          } else {
            var e = this._parts.path.length - this.filename().length;
            var directory = this._parts.path.substring(0, e);
            var replace = new RegExp("^" + escapeRegEx(directory));
            if (!this.is("relative")) {
              if (!v) {
                v = "/";
              }
              if (v.charAt(0) !== "/") {
                v = "/" + v;
              }
            }
            if (v && v.charAt(v.length - 1) !== "/") {
              v += "/";
            }
            v = URI2.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
            this.build(!build);
            return this;
          }
        };
        p.filename = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v !== "string") {
            if (!this._parts.path || this._parts.path === "/") {
              return "";
            }
            var pos = this._parts.path.lastIndexOf("/");
            var res = this._parts.path.substring(pos + 1);
            return v ? URI2.decodePathSegment(res) : res;
          } else {
            var mutatedDirectory = false;
            if (v.charAt(0) === "/") {
              v = v.substring(1);
            }
            if (v.match(/\.?\//)) {
              mutatedDirectory = true;
            }
            var replace = new RegExp(escapeRegEx(this.filename()) + "$");
            v = URI2.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
            if (mutatedDirectory) {
              this.normalizePath(build);
            } else {
              this.build(!build);
            }
            return this;
          }
        };
        p.suffix = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0 || v === true) {
            if (!this._parts.path || this._parts.path === "/") {
              return "";
            }
            var filename = this.filename();
            var pos = filename.lastIndexOf(".");
            var s, res;
            if (pos === -1) {
              return "";
            }
            s = filename.substring(pos + 1);
            res = /^[a-z0-9%]+$/i.test(s) ? s : "";
            return v ? URI2.decodePathSegment(res) : res;
          } else {
            if (v.charAt(0) === ".") {
              v = v.substring(1);
            }
            var suffix = this.suffix();
            var replace;
            if (!suffix) {
              if (!v) {
                return this;
              }
              this._parts.path += "." + URI2.recodePath(v);
            } else if (!v) {
              replace = new RegExp(escapeRegEx("." + suffix) + "$");
            } else {
              replace = new RegExp(escapeRegEx(suffix) + "$");
            }
            if (replace) {
              v = URI2.recodePath(v);
              this._parts.path = this._parts.path.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.segment = function(segment, v, build) {
          var separator = this._parts.urn ? ":" : "/";
          var path = this.path();
          var absolute = path.substring(0, 1) === "/";
          var segments = path.split(separator);
          if (segment !== void 0 && typeof segment !== "number") {
            build = v;
            v = segment;
            segment = void 0;
          }
          if (segment !== void 0 && typeof segment !== "number") {
            throw new Error('Bad segment "' + segment + '", must be 0-based integer');
          }
          if (absolute) {
            segments.shift();
          }
          if (segment < 0) {
            segment = Math.max(segments.length + segment, 0);
          }
          if (v === void 0) {
            return segment === void 0 ? segments : segments[segment];
          } else if (segment === null || segments[segment] === void 0) {
            if (isArray(v)) {
              segments = [];
              for (var i = 0, l = v.length; i < l; i++) {
                if (!v[i].length && (!segments.length || !segments[segments.length - 1].length)) {
                  continue;
                }
                if (segments.length && !segments[segments.length - 1].length) {
                  segments.pop();
                }
                segments.push(trimSlashes(v[i]));
              }
            } else if (v || typeof v === "string") {
              v = trimSlashes(v);
              if (segments[segments.length - 1] === "") {
                segments[segments.length - 1] = v;
              } else {
                segments.push(v);
              }
            }
          } else {
            if (v) {
              segments[segment] = trimSlashes(v);
            } else {
              segments.splice(segment, 1);
            }
          }
          if (absolute) {
            segments.unshift("");
          }
          return this.path(segments.join(separator), build);
        };
        p.segmentCoded = function(segment, v, build) {
          var segments, i, l;
          if (typeof segment !== "number") {
            build = v;
            v = segment;
            segment = void 0;
          }
          if (v === void 0) {
            segments = this.segment(segment, v, build);
            if (!isArray(segments)) {
              segments = segments !== void 0 ? URI2.decode(segments) : void 0;
            } else {
              for (i = 0, l = segments.length; i < l; i++) {
                segments[i] = URI2.decode(segments[i]);
              }
            }
            return segments;
          }
          if (!isArray(v)) {
            v = typeof v === "string" || v instanceof String ? URI2.encode(v) : v;
          } else {
            for (i = 0, l = v.length; i < l; i++) {
              v[i] = URI2.encode(v[i]);
            }
          }
          return this.segment(segment, v, build);
        };
        var q = p.query;
        p.query = function(v, build) {
          if (v === true) {
            return URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          } else if (typeof v === "function") {
            var data = URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
            var result = v.call(this, data);
            this._parts.query = URI2.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
            this.build(!build);
            return this;
          } else if (v !== void 0 && typeof v !== "string") {
            this._parts.query = URI2.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
            this.build(!build);
            return this;
          } else {
            return q.call(this, v, build);
          }
        };
        p.setQuery = function(name, value, build) {
          var data = URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          if (typeof name === "string" || name instanceof String) {
            data[name] = value !== void 0 ? value : null;
          } else if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                data[key] = name[key];
              }
            }
          } else {
            throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
          }
          this._parts.query = URI2.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.addQuery = function(name, value, build) {
          var data = URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          URI2.addQuery(data, name, value === void 0 ? null : value);
          this._parts.query = URI2.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.removeQuery = function(name, value, build) {
          var data = URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          URI2.removeQuery(data, name, value);
          this._parts.query = URI2.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.hasQuery = function(name, value, withinArray) {
          var data = URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          return URI2.hasQuery(data, name, value, withinArray);
        };
        p.setSearch = p.setQuery;
        p.addSearch = p.addQuery;
        p.removeSearch = p.removeQuery;
        p.hasSearch = p.hasQuery;
        p.normalize = function() {
          if (this._parts.urn) {
            return this.normalizeProtocol(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
          }
          return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
        };
        p.normalizeProtocol = function(build) {
          if (typeof this._parts.protocol === "string") {
            this._parts.protocol = this._parts.protocol.toLowerCase();
            this.build(!build);
          }
          return this;
        };
        p.normalizeHostname = function(build) {
          if (this._parts.hostname) {
            if (this.is("IDN") && punycode) {
              this._parts.hostname = punycode.toASCII(this._parts.hostname);
            } else if (this.is("IPv6") && IPv6) {
              this._parts.hostname = IPv6.best(this._parts.hostname);
            }
            this._parts.hostname = this._parts.hostname.toLowerCase();
            this.build(!build);
          }
          return this;
        };
        p.normalizePort = function(build) {
          if (typeof this._parts.protocol === "string" && this._parts.port === URI2.defaultPorts[this._parts.protocol]) {
            this._parts.port = null;
            this.build(!build);
          }
          return this;
        };
        p.normalizePath = function(build) {
          var _path = this._parts.path;
          if (!_path) {
            return this;
          }
          if (this._parts.urn) {
            this._parts.path = URI2.recodeUrnPath(this._parts.path);
            this.build(!build);
            return this;
          }
          if (this._parts.path === "/") {
            return this;
          }
          _path = URI2.recodePath(_path);
          var _was_relative;
          var _leadingParents = "";
          var _parent, _pos;
          if (_path.charAt(0) !== "/") {
            _was_relative = true;
            _path = "/" + _path;
          }
          if (_path.slice(-3) === "/.." || _path.slice(-2) === "/.") {
            _path += "/";
          }
          _path = _path.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/");
          if (_was_relative) {
            _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || "";
            if (_leadingParents) {
              _leadingParents = _leadingParents[0];
            }
          }
          while (true) {
            _parent = _path.search(/\/\.\.(\/|$)/);
            if (_parent === -1) {
              break;
            } else if (_parent === 0) {
              _path = _path.substring(3);
              continue;
            }
            _pos = _path.substring(0, _parent).lastIndexOf("/");
            if (_pos === -1) {
              _pos = _parent;
            }
            _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
          }
          if (_was_relative && this.is("relative")) {
            _path = _leadingParents + _path.substring(1);
          }
          this._parts.path = _path;
          this.build(!build);
          return this;
        };
        p.normalizePathname = p.normalizePath;
        p.normalizeQuery = function(build) {
          if (typeof this._parts.query === "string") {
            if (!this._parts.query.length) {
              this._parts.query = null;
            } else {
              this.query(URI2.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
            }
            this.build(!build);
          }
          return this;
        };
        p.normalizeFragment = function(build) {
          if (!this._parts.fragment) {
            this._parts.fragment = null;
            this.build(!build);
          }
          return this;
        };
        p.normalizeSearch = p.normalizeQuery;
        p.normalizeHash = p.normalizeFragment;
        p.iso8859 = function() {
          var e = URI2.encode;
          var d = URI2.decode;
          URI2.encode = escape;
          URI2.decode = decodeURIComponent;
          try {
            this.normalize();
          } finally {
            URI2.encode = e;
            URI2.decode = d;
          }
          return this;
        };
        p.unicode = function() {
          var e = URI2.encode;
          var d = URI2.decode;
          URI2.encode = strictEncodeURIComponent;
          URI2.decode = unescape;
          try {
            this.normalize();
          } finally {
            URI2.encode = e;
            URI2.decode = d;
          }
          return this;
        };
        p.readable = function() {
          var uri = this.clone();
          uri.username("").password("").normalize();
          var t = "";
          if (uri._parts.protocol) {
            t += uri._parts.protocol + "://";
          }
          if (uri._parts.hostname) {
            if (uri.is("punycode") && punycode) {
              t += punycode.toUnicode(uri._parts.hostname);
              if (uri._parts.port) {
                t += ":" + uri._parts.port;
              }
            } else {
              t += uri.host();
            }
          }
          if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== "/") {
            t += "/";
          }
          t += uri.path(true);
          if (uri._parts.query) {
            var q2 = "";
            for (var i = 0, qp = uri._parts.query.split("&"), l = qp.length; i < l; i++) {
              var kv = (qp[i] || "").split("=");
              q2 += "&" + URI2.decodeQuery(kv[0], this._parts.escapeQuerySpace).replace(/&/g, "%26");
              if (kv[1] !== void 0) {
                q2 += "=" + URI2.decodeQuery(kv[1], this._parts.escapeQuerySpace).replace(/&/g, "%26");
              }
            }
            t += "?" + q2.substring(1);
          }
          t += URI2.decodeQuery(uri.hash(), true);
          return t;
        };
        p.absoluteTo = function(base) {
          var resolved = this.clone();
          var properties = ["protocol", "username", "password", "hostname", "port"];
          var basedir, i, p2;
          if (this._parts.urn) {
            throw new Error("URNs do not have any generally defined hierarchical components");
          }
          if (!(base instanceof URI2)) {
            base = new URI2(base);
          }
          if (resolved._parts.protocol) {
            return resolved;
          } else {
            resolved._parts.protocol = base._parts.protocol;
          }
          if (this._parts.hostname) {
            return resolved;
          }
          for (i = 0; p2 = properties[i]; i++) {
            resolved._parts[p2] = base._parts[p2];
          }
          if (!resolved._parts.path) {
            resolved._parts.path = base._parts.path;
            if (!resolved._parts.query) {
              resolved._parts.query = base._parts.query;
            }
          } else {
            if (resolved._parts.path.substring(-2) === "..") {
              resolved._parts.path += "/";
            }
            if (resolved.path().charAt(0) !== "/") {
              basedir = base.directory();
              basedir = basedir ? basedir : base.path().indexOf("/") === 0 ? "/" : "";
              resolved._parts.path = (basedir ? basedir + "/" : "") + resolved._parts.path;
              resolved.normalizePath();
            }
          }
          resolved.build();
          return resolved;
        };
        p.relativeTo = function(base) {
          var relative = this.clone().normalize();
          var relativeParts, baseParts, common, relativePath, basePath;
          if (relative._parts.urn) {
            throw new Error("URNs do not have any generally defined hierarchical components");
          }
          base = new URI2(base).normalize();
          relativeParts = relative._parts;
          baseParts = base._parts;
          relativePath = relative.path();
          basePath = base.path();
          if (relativePath.charAt(0) !== "/") {
            throw new Error("URI is already relative");
          }
          if (basePath.charAt(0) !== "/") {
            throw new Error("Cannot calculate a URI relative to another relative URI");
          }
          if (relativeParts.protocol === baseParts.protocol) {
            relativeParts.protocol = null;
          }
          if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
            return relative.build();
          }
          if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
            return relative.build();
          }
          if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
            relativeParts.hostname = null;
            relativeParts.port = null;
          } else {
            return relative.build();
          }
          if (relativePath === basePath) {
            relativeParts.path = "";
            return relative.build();
          }
          common = URI2.commonPath(relativePath, basePath);
          if (!common) {
            return relative.build();
          }
          var parents = baseParts.path.substring(common.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
          relativeParts.path = parents + relativeParts.path.substring(common.length) || "./";
          return relative.build();
        };
        p.equals = function(uri) {
          var one = this.clone();
          var two = new URI2(uri);
          var one_map = {};
          var two_map = {};
          var checked = {};
          var one_query, two_query, key;
          one.normalize();
          two.normalize();
          if (one.toString() === two.toString()) {
            return true;
          }
          one_query = one.query();
          two_query = two.query();
          one.query("");
          two.query("");
          if (one.toString() !== two.toString()) {
            return false;
          }
          if (one_query.length !== two_query.length) {
            return false;
          }
          one_map = URI2.parseQuery(one_query, this._parts.escapeQuerySpace);
          two_map = URI2.parseQuery(two_query, this._parts.escapeQuerySpace);
          for (key in one_map) {
            if (hasOwn.call(one_map, key)) {
              if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                  return false;
                }
              } else if (!arraysEqual(one_map[key], two_map[key])) {
                return false;
              }
              checked[key] = true;
            }
          }
          for (key in two_map) {
            if (hasOwn.call(two_map, key)) {
              if (!checked[key]) {
                return false;
              }
            }
          }
          return true;
        };
        p.preventInvalidHostname = function(v) {
          this._parts.preventInvalidHostname = !!v;
          return this;
        };
        p.duplicateQueryParameters = function(v) {
          this._parts.duplicateQueryParameters = !!v;
          return this;
        };
        p.escapeQuerySpace = function(v) {
          this._parts.escapeQuerySpace = !!v;
          return this;
        };
        return URI2;
      });
    }
  });

  // node_modules/@yaireo/tagify/dist/tagify.min.js
  var require_tagify_min = __commonJS({
    "node_modules/@yaireo/tagify/dist/tagify.min.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Tagify = e();
      }(exports, function() {
        "use strict";
        function t(t2, e2) {
          var i2 = Object.keys(t2);
          if (Object.getOwnPropertySymbols) {
            var s2 = Object.getOwnPropertySymbols(t2);
            e2 && (s2 = s2.filter(function(e3) {
              return Object.getOwnPropertyDescriptor(t2, e3).enumerable;
            })), i2.push.apply(i2, s2);
          }
          return i2;
        }
        function e(e2) {
          for (var s2 = 1; s2 < arguments.length; s2++) {
            var a2 = null != arguments[s2] ? arguments[s2] : {};
            s2 % 2 ? t(Object(a2), true).forEach(function(t2) {
              i(e2, t2, a2[t2]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(a2)) : t(Object(a2)).forEach(function(t2) {
              Object.defineProperty(e2, t2, Object.getOwnPropertyDescriptor(a2, t2));
            });
          }
          return e2;
        }
        function i(t2, e2, i2) {
          return (e2 = function(t3) {
            var e3 = function(t4, e4) {
              if ("object" != typeof t4 || null === t4)
                return t4;
              var i3 = t4[Symbol.toPrimitive];
              if (void 0 !== i3) {
                var s2 = i3.call(t4, e4 || "default");
                if ("object" != typeof s2)
                  return s2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === e4 ? String : Number)(t4);
            }(t3, "string");
            return "symbol" == typeof e3 ? e3 : String(e3);
          }(e2)) in t2 ? Object.defineProperty(t2, e2, { value: i2, enumerable: true, configurable: true, writable: true }) : t2[e2] = i2, t2;
        }
        const s = (t2, e2, i2, s2) => (t2 = "" + t2, e2 = "" + e2, s2 && (t2 = t2.trim(), e2 = e2.trim()), i2 ? t2 == e2 : t2.toLowerCase() == e2.toLowerCase()), a = (t2, e2) => t2 && Array.isArray(t2) && t2.map((t3) => n(t3, e2));
        function n(t2, e2) {
          var i2, s2 = {};
          for (i2 in t2)
            e2.indexOf(i2) < 0 && (s2[i2] = t2[i2]);
          return s2;
        }
        function o(t2) {
          var e2 = document.createElement("div");
          return t2.replace(/\&#?[0-9a-z]+;/gi, function(t3) {
            return e2.innerHTML = t3, e2.innerText;
          });
        }
        function r(t2) {
          return new DOMParser().parseFromString(t2.trim(), "text/html").body.firstElementChild;
        }
        function l(t2, e2) {
          for (e2 = e2 || "previous"; t2 = t2[e2 + "Sibling"]; )
            if (3 == t2.nodeType)
              return t2;
        }
        function d(t2) {
          return "string" == typeof t2 ? t2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/`|'/g, "&#039;") : t2;
        }
        function h(t2) {
          var e2 = Object.prototype.toString.call(t2).split(" ")[1].slice(0, -1);
          return t2 === Object(t2) && "Array" != e2 && "Function" != e2 && "RegExp" != e2 && "HTMLUnknownElement" != e2;
        }
        function g(t2, e2, i2) {
          function s2(t3, e3) {
            for (var i3 in e3)
              if (e3.hasOwnProperty(i3)) {
                if (h(e3[i3])) {
                  h(t3[i3]) ? s2(t3[i3], e3[i3]) : t3[i3] = Object.assign({}, e3[i3]);
                  continue;
                }
                if (Array.isArray(e3[i3])) {
                  t3[i3] = Object.assign([], e3[i3]);
                  continue;
                }
                t3[i3] = e3[i3];
              }
          }
          return t2 instanceof Object || (t2 = {}), s2(t2, e2), i2 && s2(t2, i2), t2;
        }
        function p() {
          const t2 = [], e2 = {};
          for (let i2 of arguments)
            for (let s2 of i2)
              h(s2) ? e2[s2.value] || (t2.push(s2), e2[s2.value] = 1) : t2.includes(s2) || t2.push(s2);
          return t2;
        }
        function c(t2) {
          return String.prototype.normalize ? "string" == typeof t2 ? t2.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : void 0 : t2;
        }
        var u = () => /(?=.*chrome)(?=.*android)/i.test(navigator.userAgent);
        function m() {
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (t2) => (t2 ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> t2 / 4).toString(16));
        }
        function v(t2) {
          return t2 && t2.classList && t2.classList.contains(this.settings.classNames.tag);
        }
        function f(t2, e2) {
          var i2 = window.getSelection();
          return e2 = e2 || i2.getRangeAt(0), "string" == typeof t2 && (t2 = document.createTextNode(t2)), e2 && (e2.deleteContents(), e2.insertNode(t2)), t2;
        }
        function T(t2, e2, i2) {
          return t2 ? (e2 && (t2.__tagifyTagData = i2 ? e2 : g({}, t2.__tagifyTagData || {}, e2)), t2.__tagifyTagData) : (console.warn("tag element doesn't exist", t2, e2), e2);
        }
        function w(t2) {
          if (t2 && t2.parentNode) {
            var e2 = t2, i2 = window.getSelection(), s2 = i2.getRangeAt(0);
            i2.rangeCount && (s2.setStartAfter(e2), s2.collapse(true), i2.removeAllRanges(), i2.addRange(s2));
          }
        }
        function b(t2, e2) {
          t2.forEach((t3) => {
            if (T(t3.previousSibling) || !t3.previousSibling) {
              var i2 = document.createTextNode("\u200B");
              t3.before(i2), e2 && w(i2);
            }
          });
        }
        var y = { delimiters: ",", pattern: null, tagTextProp: "value", maxTags: 1 / 0, callbacks: {}, addTagOnBlur: true, addTagOn: ["blur", "tab", "enter"], onChangeAfterBlur: true, duplicates: false, whitelist: [], blacklist: [], enforceWhitelist: false, userInput: true, keepInvalidTags: false, createInvalidTags: true, mixTagsAllowedAfter: /,|\.|\:|\s/, mixTagsInterpolator: ["[[", "]]"], backspace: true, skipInvalid: false, pasteAsTags: true, editTags: { clicks: 2, keepInvalid: true }, transformTag: () => {
        }, trim: true, a11y: { focusableTags: false }, mixMode: { insertAfterTag: "\xA0" }, autoComplete: { enabled: true, rightKey: false, tabKey: false }, classNames: { namespace: "tagify", mixMode: "tagify--mix", selectMode: "tagify--select", input: "tagify__input", focus: "tagify--focus", tagNoAnimation: "tagify--noAnim", tagInvalid: "tagify--invalid", tagNotAllowed: "tagify--notAllowed", scopeLoading: "tagify--loading", hasMaxTags: "tagify--hasMaxTags", hasNoTags: "tagify--noTags", empty: "tagify--empty", inputInvalid: "tagify__input--invalid", dropdown: "tagify__dropdown", dropdownWrapper: "tagify__dropdown__wrapper", dropdownHeader: "tagify__dropdown__header", dropdownFooter: "tagify__dropdown__footer", dropdownItem: "tagify__dropdown__item", dropdownItemActive: "tagify__dropdown__item--active", dropdownItemHidden: "tagify__dropdown__item--hidden", dropdownInital: "tagify__dropdown--initial", tag: "tagify__tag", tagText: "tagify__tag-text", tagX: "tagify__tag__removeBtn", tagLoading: "tagify__tag--loading", tagEditing: "tagify__tag--editable", tagFlash: "tagify__tag--flash", tagHide: "tagify__tag--hide" }, dropdown: { classname: "", enabled: 2, maxItems: 10, searchKeys: ["value", "searchBy"], fuzzySearch: true, caseSensitive: false, accentedSearch: true, includeSelectedTags: false, escapeHTML: true, highlightFirst: false, closeOnSelect: true, clearOnSelect: true, position: "all", appendTarget: null }, hooks: { beforeRemoveTag: () => Promise.resolve(), beforePaste: () => Promise.resolve(), suggestionClick: () => Promise.resolve(), beforeKeyDown: () => Promise.resolve() } };
        function x() {
          this.dropdown = {};
          for (let t2 in this._dropdown)
            this.dropdown[t2] = "function" == typeof this._dropdown[t2] ? this._dropdown[t2].bind(this) : this._dropdown[t2];
          this.dropdown.refs();
        }
        var O = { refs() {
          this.DOM.dropdown = this.parseTemplate("dropdown", [this.settings]), this.DOM.dropdown.content = this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-wrapper']");
        }, getHeaderRef() {
          return this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-header']");
        }, getFooterRef() {
          return this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-footer']");
        }, getAllSuggestionsRefs() {
          return [...this.DOM.dropdown.content.querySelectorAll(this.settings.classNames.dropdownItemSelector)];
        }, show(t2) {
          var e2, i2, a2, n2 = this.settings, o2 = "mix" == n2.mode && !n2.enforceWhitelist, r2 = !n2.whitelist || !n2.whitelist.length, l2 = "manual" == n2.dropdown.position;
          if (t2 = void 0 === t2 ? this.state.inputText : t2, !(r2 && !o2 && !n2.templates.dropdownItemNoMatch || false === n2.dropdown.enable || this.state.isLoading || this.settings.readonly)) {
            if (clearTimeout(this.dropdownHide__bindEventsTimeout), this.suggestedListItems = this.dropdown.filterListItems(t2), t2 && !this.suggestedListItems.length && (this.trigger("dropdown:noMatch", t2), n2.templates.dropdownItemNoMatch && (a2 = n2.templates.dropdownItemNoMatch.call(this, { value: t2 }))), !a2) {
              if (this.suggestedListItems.length)
                t2 && o2 && !this.state.editing.scope && !s(this.suggestedListItems[0].value, t2) && this.suggestedListItems.unshift({ value: t2 });
              else {
                if (!t2 || !o2 || this.state.editing.scope)
                  return this.input.autocomplete.suggest.call(this), void this.dropdown.hide();
                this.suggestedListItems = [{ value: t2 }];
              }
              i2 = "" + (h(e2 = this.suggestedListItems[0]) ? e2.value : e2), n2.autoComplete && i2 && 0 == i2.indexOf(t2) && this.input.autocomplete.suggest.call(this, e2);
            }
            this.dropdown.fill(a2), n2.dropdown.highlightFirst && this.dropdown.highlightOption(this.DOM.dropdown.content.querySelector(n2.classNames.dropdownItemSelector)), this.state.dropdown.visible || setTimeout(this.dropdown.events.binding.bind(this)), this.state.dropdown.visible = t2 || true, this.state.dropdown.query = t2, this.setStateSelection(), l2 || setTimeout(() => {
              this.dropdown.position(), this.dropdown.render();
            }), setTimeout(() => {
              this.trigger("dropdown:show", this.DOM.dropdown);
            });
          }
        }, hide(t2) {
          var e2 = this.DOM, i2 = e2.scope, s2 = e2.dropdown, a2 = "manual" == this.settings.dropdown.position && !t2;
          if (s2 && document.body.contains(s2) && !a2)
            return window.removeEventListener("resize", this.dropdown.position), this.dropdown.events.binding.call(this, false), i2.setAttribute("aria-expanded", false), s2.parentNode.removeChild(s2), setTimeout(() => {
              this.state.dropdown.visible = false;
            }, 100), this.state.dropdown.query = this.state.ddItemData = this.state.ddItemElm = this.state.selection = null, this.state.tag && this.state.tag.value.length && (this.state.flaggedTags[this.state.tag.baseOffset] = this.state.tag), this.trigger("dropdown:hide", s2), this;
        }, toggle(t2) {
          this.dropdown[this.state.dropdown.visible && !t2 ? "hide" : "show"]();
        }, render() {
          var t2, e2, i2, s2 = (t2 = this.DOM.dropdown, (i2 = t2.cloneNode(true)).style.cssText = "position:fixed; top:-9999px; opacity:0", document.body.appendChild(i2), e2 = i2.clientHeight, i2.parentNode.removeChild(i2), e2), a2 = this.settings;
          return "number" == typeof a2.dropdown.enabled && a2.dropdown.enabled >= 0 ? (this.DOM.scope.setAttribute("aria-expanded", true), document.body.contains(this.DOM.dropdown) || (this.DOM.dropdown.classList.add(a2.classNames.dropdownInital), this.dropdown.position(s2), a2.dropdown.appendTarget.appendChild(this.DOM.dropdown), setTimeout(() => this.DOM.dropdown.classList.remove(a2.classNames.dropdownInital))), this) : this;
        }, fill(t2) {
          t2 = "string" == typeof t2 ? t2 : this.dropdown.createListHTML(t2 || this.suggestedListItems);
          var e2, i2 = this.settings.templates.dropdownContent.call(this, t2);
          this.DOM.dropdown.content.innerHTML = (e2 = i2) ? e2.replace(/\>[\r\n ]+\</g, "><").split(/>\s+</).join("><").trim() : "";
        }, fillHeaderFooter() {
          var t2 = this.dropdown.filterListItems(this.state.dropdown.query), e2 = this.parseTemplate("dropdownHeader", [t2]), i2 = this.parseTemplate("dropdownFooter", [t2]), s2 = this.dropdown.getHeaderRef(), a2 = this.dropdown.getFooterRef();
          e2 && s2?.parentNode.replaceChild(e2, s2), i2 && a2?.parentNode.replaceChild(i2, a2);
        }, refilter(t2) {
          t2 = t2 || this.state.dropdown.query || "", this.suggestedListItems = this.dropdown.filterListItems(t2), this.dropdown.fill(), this.suggestedListItems.length || this.dropdown.hide(), this.trigger("dropdown:updated", this.DOM.dropdown);
        }, position(t2) {
          var e2 = this.settings.dropdown;
          if ("manual" != e2.position) {
            var i2, s2, a2, n2, o2, r2, l2, d2, h2, g2 = this.DOM.dropdown, p2 = e2.RTL, c2 = e2.appendTarget === document.body, u2 = c2 ? window.pageYOffset : e2.appendTarget.scrollTop, m2 = document.fullscreenElement || document.webkitFullscreenElement || document.documentElement, v2 = m2.clientHeight, f2 = Math.max(m2.clientWidth || 0, window.innerWidth || 0) > 480 ? e2.position : "all", T2 = this.DOM["input" == f2 ? "input" : "scope"];
            if (t2 = t2 || g2.clientHeight, this.state.dropdown.visible) {
              if ("text" == f2 ? (a2 = (i2 = function() {
                const t3 = document.getSelection();
                if (t3.rangeCount) {
                  const e3 = t3.getRangeAt(0), i3 = e3.startContainer, s3 = e3.startOffset;
                  let a3, n3;
                  if (s3 > 0)
                    return n3 = document.createRange(), n3.setStart(i3, s3 - 1), n3.setEnd(i3, s3), a3 = n3.getBoundingClientRect(), { left: a3.right, top: a3.top, bottom: a3.bottom };
                  if (i3.getBoundingClientRect)
                    return i3.getBoundingClientRect();
                }
                return { left: -9999, top: -9999 };
              }()).bottom, s2 = i2.top, n2 = i2.left, o2 = "auto") : (r2 = function(t3) {
                for (var e3 = 0, i3 = 0; t3 && t3 != m2; )
                  e3 += t3.offsetTop || 0, i3 += t3.offsetLeft || 0, t3 = t3.parentNode;
                return { top: e3, left: i3 };
              }(e2.appendTarget), s2 = (i2 = T2.getBoundingClientRect()).top - r2.top, a2 = i2.bottom - 1 - r2.top, n2 = i2.left - r2.left, o2 = i2.width + "px"), !c2) {
                let t3 = function() {
                  for (var t4 = 0, i3 = e2.appendTarget.parentNode; i3; )
                    t4 += i3.scrollTop || 0, i3 = i3.parentNode;
                  return t4;
                }();
                s2 += t3, a2 += t3;
              }
              s2 = Math.floor(s2), a2 = Math.ceil(a2), d2 = ((l2 = e2.placeAbove ?? v2 - i2.bottom < t2) ? s2 : a2) + u2, h2 = `left: ${n2 + (p2 && i2.width || 0) + window.pageXOffset}px;`, g2.style.cssText = `${h2}; top: ${d2}px; min-width: ${o2}; max-width: ${o2}`, g2.setAttribute("placement", l2 ? "top" : "bottom"), g2.setAttribute("position", f2);
            }
          }
        }, events: { binding() {
          let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          var e2 = this.dropdown.events.callbacks, i2 = this.listeners.dropdown = this.listeners.dropdown || { position: this.dropdown.position.bind(this, null), onKeyDown: e2.onKeyDown.bind(this), onMouseOver: e2.onMouseOver.bind(this), onMouseLeave: e2.onMouseLeave.bind(this), onClick: e2.onClick.bind(this), onScroll: e2.onScroll.bind(this) }, s2 = t2 ? "addEventListener" : "removeEventListener";
          "manual" != this.settings.dropdown.position && (document[s2]("scroll", i2.position, true), window[s2]("resize", i2.position), window[s2]("keydown", i2.onKeyDown)), this.DOM.dropdown[s2]("mouseover", i2.onMouseOver), this.DOM.dropdown[s2]("mouseleave", i2.onMouseLeave), this.DOM.dropdown[s2]("mousedown", i2.onClick), this.DOM.dropdown.content[s2]("scroll", i2.onScroll);
        }, callbacks: { onKeyDown(t2) {
          if (this.state.hasFocus && !this.state.composing) {
            var e2 = this.settings, i2 = this.DOM.dropdown.querySelector(e2.classNames.dropdownItemActiveSelector), s2 = this.dropdown.getSuggestionDataByNode(i2), a2 = "mix" == e2.mode;
            e2.hooks.beforeKeyDown(t2, { tagify: this }).then((n2) => {
              switch (t2.key) {
                case "ArrowDown":
                case "ArrowUp":
                case "Down":
                case "Up":
                  t2.preventDefault();
                  var o2 = this.dropdown.getAllSuggestionsRefs(), r2 = "ArrowUp" == t2.key || "Up" == t2.key;
                  i2 && (i2 = this.dropdown.getNextOrPrevOption(i2, !r2)), i2 && i2.matches(e2.classNames.dropdownItemSelector) || (i2 = o2[r2 ? o2.length - 1 : 0]), this.dropdown.highlightOption(i2, true);
                  break;
                case "Escape":
                case "Esc":
                  this.dropdown.hide();
                  break;
                case "ArrowRight":
                  if (this.state.actions.ArrowLeft)
                    return;
                case "Tab": {
                  let n3 = !e2.autoComplete.rightKey || !e2.autoComplete.tabKey;
                  if (!a2 && i2 && n3 && !this.state.editing) {
                    t2.preventDefault();
                    var l2 = this.dropdown.getMappedValue(s2);
                    return this.input.autocomplete.set.call(this, l2), false;
                  }
                  return true;
                }
                case "Enter":
                  t2.preventDefault(), e2.hooks.suggestionClick(t2, { tagify: this, tagData: s2, suggestionElm: i2 }).then(() => {
                    if (i2)
                      return this.dropdown.selectOption(i2), i2 = this.dropdown.getNextOrPrevOption(i2, !r2), void this.dropdown.highlightOption(i2);
                    this.dropdown.hide(), a2 || this.addTags(this.state.inputText.trim(), true);
                  }).catch((t3) => t3);
                  break;
                case "Backspace": {
                  if (a2 || this.state.editing.scope)
                    return;
                  const t3 = this.input.raw.call(this);
                  "" != t3 && 8203 != t3.charCodeAt(0) || (true === e2.backspace ? this.removeTags() : "edit" == e2.backspace && setTimeout(this.editTag.bind(this), 0));
                }
              }
            });
          }
        }, onMouseOver(t2) {
          var e2 = t2.target.closest(this.settings.classNames.dropdownItemSelector);
          this.dropdown.highlightOption(e2);
        }, onMouseLeave(t2) {
          this.dropdown.highlightOption();
        }, onClick(t2) {
          if (0 == t2.button && t2.target != this.DOM.dropdown && t2.target != this.DOM.dropdown.content) {
            var e2 = t2.target.closest(this.settings.classNames.dropdownItemSelector), i2 = this.dropdown.getSuggestionDataByNode(e2);
            this.state.actions.selectOption = true, setTimeout(() => this.state.actions.selectOption = false, 50), this.settings.hooks.suggestionClick(t2, { tagify: this, tagData: i2, suggestionElm: e2 }).then(() => {
              e2 ? this.dropdown.selectOption(e2, t2) : this.dropdown.hide();
            }).catch((t3) => console.warn(t3));
          }
        }, onScroll(t2) {
          var e2 = t2.target, i2 = e2.scrollTop / (e2.scrollHeight - e2.parentNode.clientHeight) * 100;
          this.trigger("dropdown:scroll", { percentage: Math.round(i2) });
        } } }, getSuggestionDataByNode(t2) {
          var e2 = t2 && t2.getAttribute("value");
          return this.suggestedListItems.find((t3) => t3.value == e2) || null;
        }, getNextOrPrevOption(t2) {
          let e2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          var i2 = this.dropdown.getAllSuggestionsRefs(), s2 = i2.findIndex((e3) => e3 === t2);
          return e2 ? i2[s2 + 1] : i2[s2 - 1];
        }, highlightOption(t2, e2) {
          var i2, s2 = this.settings.classNames.dropdownItemActive;
          if (this.state.ddItemElm && (this.state.ddItemElm.classList.remove(s2), this.state.ddItemElm.removeAttribute("aria-selected")), !t2)
            return this.state.ddItemData = null, this.state.ddItemElm = null, void this.input.autocomplete.suggest.call(this);
          i2 = this.dropdown.getSuggestionDataByNode(t2), this.state.ddItemData = i2, this.state.ddItemElm = t2, t2.classList.add(s2), t2.setAttribute("aria-selected", true), e2 && (t2.parentNode.scrollTop = t2.clientHeight + t2.offsetTop - t2.parentNode.clientHeight), this.settings.autoComplete && (this.input.autocomplete.suggest.call(this, i2), this.dropdown.position());
        }, selectOption(t2, e2) {
          var i2 = this.settings, s2 = i2.dropdown, a2 = s2.clearOnSelect, n2 = s2.closeOnSelect;
          if (!t2)
            return this.addTags(this.state.inputText, true), void (n2 && this.dropdown.hide());
          e2 = e2 || {};
          var o2 = t2.getAttribute("value"), r2 = "noMatch" == o2, l2 = this.suggestedListItems.find((t3) => (t3.value ?? t3) == o2);
          if (this.trigger("dropdown:select", { data: l2, elm: t2, event: e2 }), o2 && (l2 || r2)) {
            if (this.state.editing) {
              let t3 = this.normalizeTags([l2])[0];
              l2 = i2.transformTag.call(this, t3) || t3, this.onEditTagDone(null, g({ __isValid: true }, l2));
            } else
              this["mix" == i2.mode ? "addMixTags" : "addTags"]([l2 || this.input.raw.call(this)], a2);
            this.DOM.input.parentNode && (setTimeout(() => {
              this.DOM.input.focus(), this.toggleFocusClass(true);
            }), n2 && setTimeout(this.dropdown.hide.bind(this)), t2.addEventListener("transitionend", () => {
              this.dropdown.fillHeaderFooter(), setTimeout(() => t2.remove(), 100);
            }, { once: true }), t2.classList.add(this.settings.classNames.dropdownItemHidden));
          } else
            n2 && setTimeout(this.dropdown.hide.bind(this));
        }, selectAll(t2) {
          this.suggestedListItems.length = 0, this.dropdown.hide(), this.dropdown.filterListItems("");
          var e2 = this.dropdown.filterListItems("");
          return t2 || (e2 = this.state.dropdown.suggestions), this.addTags(e2, true), this;
        }, filterListItems(t2, e2) {
          var i2, s2, a2, n2, o2, r2 = this.settings, l2 = r2.dropdown, d2 = (e2 = e2 || {}, []), g2 = [], p2 = r2.whitelist, u2 = l2.maxItems >= 0 ? l2.maxItems : 1 / 0, m2 = l2.searchKeys, v2 = 0;
          if (!(t2 = "select" == r2.mode && this.value.length && this.value[0][r2.tagTextProp] == t2 ? "" : t2) || !m2.length)
            return d2 = l2.includeSelectedTags ? p2 : p2.filter((t3) => !this.isTagDuplicate(h(t3) ? t3.value : t3)), this.state.dropdown.suggestions = d2, d2.slice(0, u2);
          function f2(t3, e3) {
            return e3.toLowerCase().split(" ").every((e4) => t3.includes(e4.toLowerCase()));
          }
          for (o2 = l2.caseSensitive ? "" + t2 : ("" + t2).toLowerCase(); v2 < p2.length; v2++) {
            let t3, r3;
            i2 = p2[v2] instanceof Object ? p2[v2] : { value: p2[v2] };
            let u3 = !Object.keys(i2).some((t4) => m2.includes(t4)) ? ["value"] : m2;
            l2.fuzzySearch && !e2.exact ? (a2 = u3.reduce((t4, e3) => t4 + " " + (i2[e3] || ""), "").toLowerCase().trim(), l2.accentedSearch && (a2 = c(a2), o2 = c(o2)), t3 = 0 == a2.indexOf(o2), r3 = a2 === o2, s2 = f2(a2, o2)) : (t3 = true, s2 = u3.some((t4) => {
              var s3 = "" + (i2[t4] || "");
              return l2.accentedSearch && (s3 = c(s3), o2 = c(o2)), l2.caseSensitive || (s3 = s3.toLowerCase()), r3 = s3 === o2, e2.exact ? s3 === o2 : 0 == s3.indexOf(o2);
            })), n2 = !l2.includeSelectedTags && this.isTagDuplicate(h(i2) ? i2.value : i2), s2 && !n2 && (r3 && t3 ? g2.push(i2) : "startsWith" == l2.sortby && t3 ? d2.unshift(i2) : d2.push(i2));
          }
          return this.state.dropdown.suggestions = g2.concat(d2), "function" == typeof l2.sortby ? l2.sortby(g2.concat(d2), o2) : g2.concat(d2).slice(0, u2);
        }, getMappedValue(t2) {
          var e2 = this.settings.dropdown.mapValueTo;
          return e2 ? "function" == typeof e2 ? e2(t2) : t2[e2] || t2.value : t2.value;
        }, createListHTML(t2) {
          return g([], t2).map((t3, i2) => {
            "string" != typeof t3 && "number" != typeof t3 || (t3 = { value: t3 });
            var s2 = this.dropdown.getMappedValue(t3);
            return s2 = "string" == typeof s2 && this.settings.dropdown.escapeHTML ? d(s2) : s2, this.settings.templates.dropdownItem.apply(this, [e(e({}, t3), {}, { mappedValue: s2 }), this]);
          }).join("");
        } };
        const D = "@yaireo/tagify/";
        var M, I = { empty: "empty", exceed: "number of tags exceeded", pattern: "pattern mismatch", duplicate: "already exists", notAllowed: "not allowed" }, N = { wrapper: (t2, e2) => `<tags class="${e2.classNames.namespace} ${e2.mode ? `${e2.classNames[e2.mode + "Mode"]}` : ""} ${t2.className}"
                    ${e2.readonly ? "readonly" : ""}
                    ${e2.disabled ? "disabled" : ""}
                    ${e2.required ? "required" : ""}
                    ${"select" === e2.mode ? "spellcheck='false'" : ""}
                    tabIndex="-1">
            <span ${!e2.readonly && e2.userInput ? "contenteditable" : ""} tabIndex="0" data-placeholder="${e2.placeholder || "&#8203;"}" aria-placeholder="${e2.placeholder || ""}"
                class="${e2.classNames.input}"
                role="textbox"
                aria-autocomplete="both"
                aria-multiline="${"mix" == e2.mode}"></span>
                &#8203;
        </tags>`, tag(t2, e2) {
          let i2 = e2.settings;
          return `<tag title="${t2.title || t2.value}"
                    contenteditable='false'
                    spellcheck='false'
                    tabIndex="${i2.a11y.focusableTags ? 0 : -1}"
                    class="${i2.classNames.tag} ${t2.class || ""}"
                    ${this.getAttributes(t2)}>
            <x title='' class="${i2.classNames.tagX}" role='button' aria-label='remove tag'></x>
            <div>
                <span class="${i2.classNames.tagText}">${t2[i2.tagTextProp] || t2.value}</span>
            </div>
        </tag>`;
        }, dropdown(t2) {
          var e2 = t2.dropdown;
          return `<div class="${"manual" == e2.position ? "" : t2.classNames.dropdown} ${e2.classname}" role="listbox" aria-labelledby="dropdown" dir="${e2.RTL ? "rtl" : ""}">
                    <div data-selector='tagify-suggestions-wrapper' class="${t2.classNames.dropdownWrapper}"></div>
                </div>`;
        }, dropdownContent(t2) {
          var e2 = this.settings.templates, i2 = this.state.dropdown.suggestions;
          return `
            ${e2.dropdownHeader.call(this, i2)}
            ${t2}
            ${e2.dropdownFooter.call(this, i2)}
        `;
        }, dropdownItem(t2) {
          return `<div ${this.getAttributes(t2)}
                    class='${this.settings.classNames.dropdownItem} ${t2.class || ""}'
                    tabindex="0"
                    role="option">${t2.mappedValue || t2.value}</div>`;
        }, dropdownHeader(t2) {
          return `<header data-selector='tagify-suggestions-header' class="${this.settings.classNames.dropdownHeader}"></header>`;
        }, dropdownFooter(t2) {
          var e2 = t2.length - this.settings.dropdown.maxItems;
          return e2 > 0 ? `<footer data-selector='tagify-suggestions-footer' class="${this.settings.classNames.dropdownFooter}">
                ${e2} more items. Refine your search.
            </footer>` : "";
        }, dropdownItemNoMatch: null };
        var S = { customBinding() {
          this.customEventsList.forEach((t2) => {
            this.on(t2, this.settings.callbacks[t2]);
          });
        }, binding() {
          let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          var e2, i2 = this.events.callbacks, s2 = t2 ? "addEventListener" : "removeEventListener";
          if (!this.state.mainEvents || !t2) {
            for (var a2 in this.state.mainEvents = t2, t2 && !this.listeners.main && (this.events.bindGlobal.call(this), this.settings.isJQueryPlugin && jQuery(this.DOM.originalInput).on("tagify.removeAllTags", this.removeAllTags.bind(this))), e2 = this.listeners.main = this.listeners.main || { focus: ["input", i2.onFocusBlur.bind(this)], keydown: ["input", i2.onKeydown.bind(this)], click: ["scope", i2.onClickScope.bind(this)], dblclick: ["scope", i2.onDoubleClickScope.bind(this)], paste: ["input", i2.onPaste.bind(this)], drop: ["input", i2.onDrop.bind(this)], compositionstart: ["input", i2.onCompositionStart.bind(this)], compositionend: ["input", i2.onCompositionEnd.bind(this)] })
              this.DOM[e2[a2][0]][s2](a2, e2[a2][1]);
            clearInterval(this.listeners.main.originalInputValueObserverInterval), this.listeners.main.originalInputValueObserverInterval = setInterval(i2.observeOriginalInputValue.bind(this), 500);
            var n2 = this.listeners.main.inputMutationObserver || new MutationObserver(i2.onInputDOMChange.bind(this));
            n2.disconnect(), "mix" == this.settings.mode && n2.observe(this.DOM.input, { childList: true });
          }
        }, bindGlobal(t2) {
          var e2, i2 = this.events.callbacks, s2 = t2 ? "removeEventListener" : "addEventListener";
          if (this.listeners && (t2 || !this.listeners.global))
            for (e2 of (this.listeners.global = this.listeners.global || [{ type: this.isIE ? "keydown" : "input", target: this.DOM.input, cb: i2[this.isIE ? "onInputIE" : "onInput"].bind(this) }, { type: "keydown", target: window, cb: i2.onWindowKeyDown.bind(this) }, { type: "blur", target: this.DOM.input, cb: i2.onFocusBlur.bind(this) }, { type: "click", target: document, cb: i2.onClickAnywhere.bind(this) }], this.listeners.global))
              e2.target[s2](e2.type, e2.cb);
        }, unbindGlobal() {
          this.events.bindGlobal.call(this, true);
        }, callbacks: { onFocusBlur(t2) {
          var e2 = this.settings, i2 = t2.target ? this.trim(t2.target.textContent) : "", s2 = this.value?.[0]?.[e2.tagTextProp], a2 = t2.type, n2 = e2.dropdown.enabled >= 0, o2 = { relatedTarget: t2.relatedTarget }, r2 = this.state.actions.selectOption && (n2 || !e2.dropdown.closeOnSelect), l2 = this.state.actions.addNew && n2, d2 = t2.relatedTarget && v.call(this, t2.relatedTarget) && this.DOM.scope.contains(t2.relatedTarget);
          if ("blur" == a2) {
            if (t2.relatedTarget === this.DOM.scope)
              return this.dropdown.hide(), void this.DOM.input.focus();
            this.postUpdate(), e2.onChangeAfterBlur && this.triggerChangeEvent();
          }
          if (!r2 && !l2)
            if (this.state.hasFocus = "focus" == a2 && +new Date(), this.toggleFocusClass(this.state.hasFocus), "mix" != e2.mode) {
              if ("focus" == a2)
                return this.trigger("focus", o2), void (0 !== e2.dropdown.enabled && e2.userInput || this.dropdown.show(this.value.length ? "" : void 0));
              "blur" == a2 && (this.trigger("blur", o2), this.loading(false), "select" == e2.mode && (d2 && (this.removeTags(), i2 = ""), s2 === i2 && (i2 = "")), i2 && !this.state.actions.selectOption && e2.addTagOnBlur && e2.addTagOn.includes("blur") && this.addTags(i2, true)), this.DOM.input.removeAttribute("style"), this.dropdown.hide();
            } else
              "focus" == a2 ? this.trigger("focus", o2) : "blur" == t2.type && (this.trigger("blur", o2), this.loading(false), this.dropdown.hide(), this.state.dropdown.visible = void 0, this.setStateSelection());
        }, onCompositionStart(t2) {
          this.state.composing = true;
        }, onCompositionEnd(t2) {
          this.state.composing = false;
        }, onWindowKeyDown(t2) {
          var e2, i2 = document.activeElement, s2 = v.call(this, i2) && this.DOM.scope.contains(document.activeElement), a2 = s2 && i2.hasAttribute("readonly");
          if (s2 && !a2)
            switch (e2 = i2.nextElementSibling, t2.key) {
              case "Backspace":
                this.settings.readonly || (this.removeTags(i2), (e2 || this.DOM.input).focus());
                break;
              case "Enter":
                setTimeout(this.editTag.bind(this), 0, i2);
            }
        }, onKeydown(t2) {
          var e2 = this.settings;
          if (!this.state.composing && e2.userInput) {
            "select" == e2.mode && e2.enforceWhitelist && this.value.length && "Tab" != t2.key && t2.preventDefault();
            var i2 = this.trim(t2.target.textContent);
            this.trigger("keydown", { event: t2 }), e2.hooks.beforeKeyDown(t2, { tagify: this }).then((s2) => {
              if ("mix" == e2.mode) {
                switch (t2.key) {
                  case "Left":
                  case "ArrowLeft":
                    this.state.actions.ArrowLeft = true;
                    break;
                  case "Delete":
                  case "Backspace":
                    if (this.state.editing)
                      return;
                    var a2 = document.getSelection(), n2 = "Delete" == t2.key && a2.anchorOffset == (a2.anchorNode.length || 0), r2 = a2.anchorNode.previousSibling, d2 = 1 == a2.anchorNode.nodeType || !a2.anchorOffset && r2 && 1 == r2.nodeType && a2.anchorNode.previousSibling;
                    o(this.DOM.input.innerHTML);
                    var h2, g2, p2, c2 = this.getTagElms(), m2 = 1 === a2.anchorNode.length && a2.anchorNode.nodeValue == String.fromCharCode(8203);
                    if ("edit" == e2.backspace && d2)
                      return h2 = 1 == a2.anchorNode.nodeType ? null : a2.anchorNode.previousElementSibling, setTimeout(this.editTag.bind(this), 0, h2), void t2.preventDefault();
                    if (u() && d2 instanceof Element)
                      return p2 = l(d2), d2.hasAttribute("readonly") || d2.remove(), this.DOM.input.focus(), void setTimeout(() => {
                        w(p2), this.DOM.input.click();
                      });
                    if ("BR" == a2.anchorNode.nodeName)
                      return;
                    if ((n2 || d2) && 1 == a2.anchorNode.nodeType ? g2 = 0 == a2.anchorOffset ? n2 ? c2[0] : null : c2[Math.min(c2.length, a2.anchorOffset) - 1] : n2 ? g2 = a2.anchorNode.nextElementSibling : d2 instanceof Element && (g2 = d2), 3 == a2.anchorNode.nodeType && !a2.anchorNode.nodeValue && a2.anchorNode.previousElementSibling && t2.preventDefault(), (d2 || n2) && !e2.backspace)
                      return void t2.preventDefault();
                    if ("Range" != a2.type && !a2.anchorOffset && a2.anchorNode == this.DOM.input && "Delete" != t2.key)
                      return void t2.preventDefault();
                    if ("Range" != a2.type && g2 && g2.hasAttribute("readonly"))
                      return void w(l(g2));
                    "Delete" == t2.key && m2 && T(a2.anchorNode.nextSibling) && this.removeTags(a2.anchorNode.nextSibling), clearTimeout(M), M = setTimeout(() => {
                      var t3 = document.getSelection();
                      o(this.DOM.input.innerHTML), !n2 && t3.anchorNode.previousSibling, this.value = [].map.call(c2, (t4, e3) => {
                        var i3 = T(t4);
                        if (t4.parentNode || i3.readonly)
                          return i3;
                        this.trigger("remove", { tag: t4, index: e3, data: i3 });
                      }).filter((t4) => t4);
                    }, 20);
                }
                return true;
              }
              var v2 = "manual" == e2.dropdown.position;
              switch (t2.key) {
                case "Backspace":
                  "select" == e2.mode && e2.enforceWhitelist && this.value.length ? this.removeTags() : this.state.dropdown.visible && "manual" != e2.dropdown.position || "" != t2.target.textContent && 8203 != i2.charCodeAt(0) || (true === e2.backspace ? this.removeTags() : "edit" == e2.backspace && setTimeout(this.editTag.bind(this), 0));
                  break;
                case "Esc":
                case "Escape":
                  if (this.state.dropdown.visible)
                    return;
                  t2.target.blur();
                  break;
                case "Down":
                case "ArrowDown":
                  this.state.dropdown.visible || this.dropdown.show();
                  break;
                case "ArrowRight": {
                  let t3 = this.state.inputSuggestion || this.state.ddItemData;
                  if (t3 && e2.autoComplete.rightKey)
                    return void this.addTags([t3], true);
                  break;
                }
                case "Tab": {
                  let s3 = "select" == e2.mode;
                  if (!i2 || s3)
                    return true;
                  t2.preventDefault();
                }
                case "Enter":
                  if (this.state.dropdown.visible && !v2)
                    return;
                  t2.preventDefault(), setTimeout(() => {
                    this.state.dropdown.visible && !v2 || this.state.actions.selectOption || !e2.addTagOn.includes(t2.key.toLowerCase()) || this.addTags(i2, true);
                  });
              }
            }).catch((t3) => t3);
          }
        }, onInput(t2) {
          this.postUpdate();
          var e2 = this.settings;
          if ("mix" == e2.mode)
            return this.events.callbacks.onMixTagsInput.call(this, t2);
          var i2 = this.input.normalize.call(this, void 0, { trim: false }), s2 = i2.length >= e2.dropdown.enabled, a2 = { value: i2, inputElm: this.DOM.input }, n2 = this.validateTag({ value: i2 });
          "select" == e2.mode && this.toggleScopeValidation(n2), a2.isValid = n2, console.log(this.state.inputText, i2), this.state.inputText != i2 && (this.input.set.call(this, i2, false), -1 != i2.search(e2.delimiters) ? this.addTags(i2) && this.input.set.call(this) : e2.dropdown.enabled >= 0 && this.dropdown[s2 ? "show" : "hide"](i2), this.trigger("input", a2));
        }, onMixTagsInput(t2) {
          var e2, i2, s2, a2, n2, o2, r2, l2, d2 = this.settings, h2 = this.value.length, p2 = this.getTagElms(), c2 = document.createDocumentFragment(), m2 = window.getSelection().getRangeAt(0), v2 = [].map.call(p2, (t3) => T(t3).value);
          if ("deleteContentBackward" == t2.inputType && u() && this.events.callbacks.onKeydown.call(this, { target: t2.target, key: "Backspace" }), b(this.getTagElms()), this.value.slice().forEach((t3) => {
            t3.readonly && !v2.includes(t3.value) && c2.appendChild(this.createTagElem(t3));
          }), c2.childNodes.length && (m2.insertNode(c2), this.setRangeAtStartEnd(false, c2.lastChild)), p2.length != h2)
            return this.value = [].map.call(this.getTagElms(), (t3) => T(t3)), void this.update({ withoutChangeEvent: true });
          if (this.hasMaxTags())
            return true;
          if (window.getSelection && (o2 = window.getSelection()).rangeCount > 0 && 3 == o2.anchorNode.nodeType) {
            if ((m2 = o2.getRangeAt(0).cloneRange()).collapse(true), m2.setStart(o2.focusNode, 0), s2 = (e2 = m2.toString().slice(0, m2.endOffset)).split(d2.pattern).length - 1, (i2 = e2.match(d2.pattern)) && (a2 = e2.slice(e2.lastIndexOf(i2[i2.length - 1]))), a2) {
              if (this.state.actions.ArrowLeft = false, this.state.tag = { prefix: a2.match(d2.pattern)[0], value: a2.replace(d2.pattern, "") }, this.state.tag.baseOffset = o2.baseOffset - this.state.tag.value.length, l2 = this.state.tag.value.match(d2.delimiters))
                return this.state.tag.value = this.state.tag.value.replace(d2.delimiters, ""), this.state.tag.delimiters = l2[0], this.addTags(this.state.tag.value, d2.dropdown.clearOnSelect), void this.dropdown.hide();
              n2 = this.state.tag.value.length >= d2.dropdown.enabled;
              try {
                r2 = (r2 = this.state.flaggedTags[this.state.tag.baseOffset]).prefix == this.state.tag.prefix && r2.value[0] == this.state.tag.value[0], this.state.flaggedTags[this.state.tag.baseOffset] && !this.state.tag.value && delete this.state.flaggedTags[this.state.tag.baseOffset];
              } catch (t3) {
              }
              (r2 || s2 < this.state.mixMode.matchedPatternCount) && (n2 = false);
            } else
              this.state.flaggedTags = {};
            this.state.mixMode.matchedPatternCount = s2;
          }
          setTimeout(() => {
            this.update({ withoutChangeEvent: true }), this.trigger("input", g({}, this.state.tag, { textContent: this.DOM.input.textContent })), this.state.tag && this.dropdown[n2 ? "show" : "hide"](this.state.tag.value);
          }, 10);
        }, onInputIE(t2) {
          var e2 = this;
          setTimeout(function() {
            e2.events.callbacks.onInput.call(e2, t2);
          });
        }, observeOriginalInputValue() {
          this.DOM.originalInput.parentNode || this.destroy(), this.DOM.originalInput.value != this.DOM.originalInput.tagifyValue && this.loadOriginalValues();
        }, onClickAnywhere(t2) {
          t2.target == this.DOM.scope || this.DOM.scope.contains(t2.target) || (this.toggleFocusClass(false), this.state.hasFocus = false);
        }, onClickScope(t2) {
          var e2 = this.settings, i2 = t2.target.closest("." + e2.classNames.tag), s2 = +new Date() - this.state.hasFocus;
          if (t2.target != this.DOM.scope) {
            if (!t2.target.classList.contains(e2.classNames.tagX))
              return i2 ? (this.trigger("click", { tag: i2, index: this.getNodeIndex(i2), data: T(i2), event: t2 }), void (1 !== e2.editTags && 1 !== e2.editTags.clicks || this.events.callbacks.onDoubleClickScope.call(this, t2))) : void (t2.target == this.DOM.input && ("mix" == e2.mode && this.fixFirefoxLastTagNoCaret(), s2 > 500) ? this.state.dropdown.visible ? this.dropdown.hide() : 0 === e2.dropdown.enabled && "mix" != e2.mode && this.dropdown.show(this.value.length ? "" : void 0) : "select" != e2.mode || 0 !== e2.dropdown.enabled || this.state.dropdown.visible || this.dropdown.show());
            this.removeTags(t2.target.parentNode);
          } else
            this.DOM.input.focus();
        }, onPaste(t2) {
          t2.preventDefault();
          var e2, i2, s2 = this.settings;
          if ("select" == s2.mode && s2.enforceWhitelist || !s2.userInput)
            return false;
          s2.readonly || (e2 = t2.clipboardData || window.clipboardData, i2 = e2.getData("Text"), s2.hooks.beforePaste(t2, { tagify: this, pastedText: i2, clipboardData: e2 }).then((e3) => {
            void 0 === e3 && (e3 = i2), e3 && (this.injectAtCaret(e3, window.getSelection().getRangeAt(0)), "mix" == this.settings.mode ? this.events.callbacks.onMixTagsInput.call(this, t2) : this.settings.pasteAsTags ? this.addTags(this.state.inputText + e3, true) : (this.state.inputText = e3, this.dropdown.show(e3)));
          }).catch((t3) => t3));
        }, onDrop(t2) {
          t2.preventDefault();
        }, onEditTagInput(t2, e2) {
          var i2 = t2.closest("." + this.settings.classNames.tag), s2 = this.getNodeIndex(i2), a2 = T(i2), n2 = this.input.normalize.call(this, t2), o2 = { [this.settings.tagTextProp]: n2, __tagId: a2.__tagId }, r2 = this.validateTag(o2);
          this.editTagChangeDetected(g(a2, o2)) || true !== t2.originalIsValid || (r2 = true), i2.classList.toggle(this.settings.classNames.tagInvalid, true !== r2), a2.__isValid = r2, i2.title = true === r2 ? a2.title || a2.value : r2, n2.length >= this.settings.dropdown.enabled && (this.state.editing && (this.state.editing.value = n2), this.dropdown.show(n2)), this.trigger("edit:input", { tag: i2, index: s2, data: g({}, this.value[s2], { newValue: n2 }), event: e2 });
        }, onEditTagPaste(t2, e2) {
          var i2 = (e2.clipboardData || window.clipboardData).getData("Text");
          e2.preventDefault();
          var s2 = f(i2);
          this.setRangeAtStartEnd(false, s2);
        }, onEditTagFocus(t2) {
          this.state.editing = { scope: t2, input: t2.querySelector("[contenteditable]") };
        }, onEditTagBlur(t2) {
          if (this.state.editing && (this.state.hasFocus || this.toggleFocusClass(), this.DOM.scope.contains(t2))) {
            var e2, i2, s2 = this.settings, a2 = t2.closest("." + s2.classNames.tag), n2 = T(a2), o2 = this.input.normalize.call(this, t2), r2 = { [s2.tagTextProp]: o2, __tagId: n2.__tagId }, l2 = n2.__originalData, d2 = this.editTagChangeDetected(g(n2, r2)), h2 = this.validateTag(r2);
            if (o2)
              if (d2) {
                if (e2 = this.hasMaxTags(), i2 = g({}, l2, { [s2.tagTextProp]: this.trim(o2), __isValid: h2 }), s2.transformTag.call(this, i2, l2), true !== (h2 = (!e2 || true === l2.__isValid) && this.validateTag(i2))) {
                  if (this.trigger("invalid", { data: i2, tag: a2, message: h2 }), s2.editTags.keepInvalid)
                    return;
                  s2.keepInvalidTags ? i2.__isValid = h2 : i2 = l2;
                } else
                  s2.keepInvalidTags && (delete i2.title, delete i2["aria-invalid"], delete i2.class);
                this.onEditTagDone(a2, i2);
              } else
                this.onEditTagDone(a2, l2);
            else
              this.onEditTagDone(a2);
          }
        }, onEditTagkeydown(t2, e2) {
          if (!this.state.composing)
            switch (this.trigger("edit:keydown", { event: t2 }), t2.key) {
              case "Esc":
              case "Escape":
                this.state.editing = false, e2.parentNode.replaceChild(e2.__tagifyTagData.__originalHTML, e2);
                break;
              case "Enter":
              case "Tab":
                t2.preventDefault(), t2.target.blur();
            }
        }, onDoubleClickScope(t2) {
          var e2, i2, s2 = t2.target.closest("." + this.settings.classNames.tag), a2 = T(s2), n2 = this.settings;
          s2 && n2.userInput && false !== a2.editable && (e2 = s2.classList.contains(this.settings.classNames.tagEditing), i2 = s2.hasAttribute("readonly"), "select" == n2.mode || n2.readonly || e2 || i2 || !this.settings.editTags || this.editTag(s2), this.toggleFocusClass(true), this.trigger("dblclick", { tag: s2, index: this.getNodeIndex(s2), data: T(s2) }));
        }, onInputDOMChange(t2) {
          t2.forEach((t3) => {
            t3.addedNodes.forEach((t4) => {
              if ("<div><br></div>" == t4.outerHTML)
                t4.replaceWith(document.createElement("br"));
              else if (1 == t4.nodeType && t4.querySelector(this.settings.classNames.tagSelector)) {
                let e3 = document.createTextNode("");
                3 == t4.childNodes[0].nodeType && "BR" != t4.previousSibling.nodeName && (e3 = document.createTextNode("\n")), t4.replaceWith(e3, ...[...t4.childNodes].slice(0, -1)), w(e3);
              } else if (v.call(this, t4))
                if (3 != t4.previousSibling?.nodeType || t4.previousSibling.textContent || t4.previousSibling.remove(), t4.previousSibling && "BR" == t4.previousSibling.nodeName) {
                  t4.previousSibling.replaceWith("\n\u200B");
                  let e3 = t4.nextSibling, i2 = "";
                  for (; e3; )
                    i2 += e3.textContent, e3 = e3.nextSibling;
                  i2.trim() && w(t4.previousSibling);
                } else
                  t4.previousSibling && !T(t4.previousSibling) || t4.before("\u200B");
            }), t3.removedNodes.forEach((t4) => {
              t4 && "BR" == t4.nodeName && v.call(this, e2) && (this.removeTags(e2), this.fixFirefoxLastTagNoCaret());
            });
          });
          var e2 = this.DOM.input.lastChild;
          e2 && "" == e2.nodeValue && e2.remove(), e2 && "BR" == e2.nodeName || this.DOM.input.appendChild(document.createElement("br"));
        } } };
        function E(t2, e2) {
          if (!t2) {
            console.warn("Tagify:", "input element not found", t2);
            const e3 = new Proxy(this, { get: () => () => e3 });
            return e3;
          }
          if (t2.__tagify)
            return console.warn("Tagify: ", "input element is already Tagified - Same instance is returned.", t2), t2.__tagify;
          var i2;
          g(this, function(t3) {
            var e3 = document.createTextNode("");
            function i3(t4, i4, s2) {
              s2 && i4.split(/\s+/g).forEach((i5) => e3[t4 + "EventListener"].call(e3, i5, s2));
            }
            return { off(t4, e4) {
              return i3("remove", t4, e4), this;
            }, on(t4, e4) {
              return e4 && "function" == typeof e4 && i3("add", t4, e4), this;
            }, trigger(i4, s2, a2) {
              var n2;
              if (a2 = a2 || { cloneData: true }, i4)
                if (t3.settings.isJQueryPlugin)
                  "remove" == i4 && (i4 = "removeTag"), jQuery(t3.DOM.originalInput).triggerHandler(i4, [s2]);
                else {
                  try {
                    var o2 = "object" == typeof s2 ? s2 : { value: s2 };
                    if ((o2 = a2.cloneData ? g({}, o2) : o2).tagify = this, s2.event && (o2.event = this.cloneEvent(s2.event)), s2 instanceof Object)
                      for (var r2 in s2)
                        s2[r2] instanceof HTMLElement && (o2[r2] = s2[r2]);
                    n2 = new CustomEvent(i4, { detail: o2 });
                  } catch (t4) {
                    console.warn(t4);
                  }
                  e3.dispatchEvent(n2);
                }
            } };
          }(this)), this.isFirefox = /firefox|fxios/i.test(navigator.userAgent) && !/seamonkey/i.test(navigator.userAgent), this.isIE = window.document.documentMode, e2 = e2 || {}, this.getPersistedData = (i2 = e2.id, (t3) => {
            let e3, s2 = "/" + t3;
            if (1 == localStorage.getItem(D + i2 + "/v", 1))
              try {
                e3 = JSON.parse(localStorage[D + i2 + s2]);
              } catch (t4) {
              }
            return e3;
          }), this.setPersistedData = ((t3) => t3 ? (localStorage.setItem(D + t3 + "/v", 1), (e3, i3) => {
            let s2 = "/" + i3, a2 = JSON.stringify(e3);
            e3 && i3 && (localStorage.setItem(D + t3 + s2, a2), dispatchEvent(new Event("storage")));
          }) : () => {
          })(e2.id), this.clearPersistedData = ((t3) => (e3) => {
            const i3 = D + "/" + t3 + "/";
            if (e3)
              localStorage.removeItem(i3 + e3);
            else
              for (let t4 in localStorage)
                t4.includes(i3) && localStorage.removeItem(t4);
          })(e2.id), this.applySettings(t2, e2), this.state = { inputText: "", editing: false, composing: false, actions: {}, mixMode: {}, dropdown: {}, flaggedTags: {} }, this.value = [], this.listeners = {}, this.DOM = {}, this.build(t2), x.call(this), this.getCSSVars(), this.loadOriginalValues(), this.events.customBinding.call(this), this.events.binding.call(this), t2.autofocus && this.DOM.input.focus(), t2.__tagify = this;
        }
        return E.prototype = { _dropdown: O, getSetTagData: T, helpers: { sameStr: s, removeCollectionProp: a, omit: n, isObject: h, parseHTML: r, escapeHTML: d, extend: g, concatWithoutDups: p, getUID: m, isNodeTag: v }, customEventsList: ["change", "add", "remove", "invalid", "input", "click", "keydown", "focus", "blur", "edit:input", "edit:beforeUpdate", "edit:updated", "edit:start", "edit:keydown", "dropdown:show", "dropdown:hide", "dropdown:select", "dropdown:updated", "dropdown:noMatch", "dropdown:scroll"], dataProps: ["__isValid", "__removed", "__originalData", "__originalHTML", "__tagId"], trim(t2) {
          return this.settings.trim && t2 && "string" == typeof t2 ? t2.trim() : t2;
        }, parseHTML: r, templates: N, parseTemplate(t2, e2) {
          return r((t2 = this.settings.templates[t2] || t2).apply(this, e2));
        }, set whitelist(t2) {
          const e2 = t2 && Array.isArray(t2);
          this.settings.whitelist = e2 ? t2 : [], this.setPersistedData(e2 ? t2 : [], "whitelist");
        }, get whitelist() {
          return this.settings.whitelist;
        }, generateClassSelectors(t2) {
          for (let e2 in t2) {
            let i2 = e2;
            Object.defineProperty(t2, i2 + "Selector", { get() {
              return "." + this[i2].split(" ")[0];
            } });
          }
        }, applySettings(t2, i2) {
          y.templates = this.templates;
          var s2 = g({}, y, "mix" == i2.mode ? { dropdown: { position: "text" } } : {}), a2 = this.settings = g({}, s2, i2);
          if (a2.disabled = t2.hasAttribute("disabled"), a2.readonly = a2.readonly || t2.hasAttribute("readonly"), a2.placeholder = d(t2.getAttribute("placeholder") || a2.placeholder || ""), a2.required = t2.hasAttribute("required"), this.generateClassSelectors(a2.classNames), void 0 === a2.dropdown.includeSelectedTags && (a2.dropdown.includeSelectedTags = a2.duplicates), this.isIE && (a2.autoComplete = false), ["whitelist", "blacklist"].forEach((e2) => {
            var i3 = t2.getAttribute("data-" + e2);
            i3 && (i3 = i3.split(a2.delimiters)) instanceof Array && (a2[e2] = i3);
          }), "autoComplete" in i2 && !h(i2.autoComplete) && (a2.autoComplete = y.autoComplete, a2.autoComplete.enabled = i2.autoComplete), "mix" == a2.mode && (a2.pattern = a2.pattern || /@/, a2.autoComplete.rightKey = true, a2.delimiters = i2.delimiters || null, a2.tagTextProp && !a2.dropdown.searchKeys.includes(a2.tagTextProp) && a2.dropdown.searchKeys.push(a2.tagTextProp)), t2.pattern)
            try {
              a2.pattern = new RegExp(t2.pattern);
            } catch (t3) {
            }
          if (a2.delimiters) {
            a2._delimiters = a2.delimiters;
            try {
              a2.delimiters = new RegExp(this.settings.delimiters, "g");
            } catch (t3) {
            }
          }
          a2.disabled && (a2.userInput = false), this.TEXTS = e(e({}, I), a2.texts || {}), ("select" != a2.mode || i2.dropdown?.enabled) && a2.userInput || (a2.dropdown.enabled = 0), a2.dropdown.appendTarget = i2.dropdown?.appendTarget || document.body;
          let n2 = this.getPersistedData("whitelist");
          Array.isArray(n2) && (this.whitelist = Array.isArray(a2.whitelist) ? p(a2.whitelist, n2) : n2);
        }, getAttributes(t2) {
          var e2, i2 = this.getCustomAttributes(t2), s2 = "";
          for (e2 in i2)
            s2 += " " + e2 + (void 0 !== t2[e2] ? `="${i2[e2]}"` : "");
          return s2;
        }, getCustomAttributes(t2) {
          if (!h(t2))
            return "";
          var e2, i2 = {};
          for (e2 in t2)
            "__" != e2.slice(0, 2) && "class" != e2 && t2.hasOwnProperty(e2) && void 0 !== t2[e2] && (i2[e2] = d(t2[e2]));
          return i2;
        }, setStateSelection() {
          var t2 = window.getSelection(), e2 = { anchorOffset: t2.anchorOffset, anchorNode: t2.anchorNode, range: t2.getRangeAt && t2.rangeCount && t2.getRangeAt(0) };
          return this.state.selection = e2, e2;
        }, getCSSVars() {
          var t2 = getComputedStyle(this.DOM.scope, null);
          var e2;
          this.CSSVars = { tagHideTransition: ((t3) => {
            let e3 = t3.value;
            return "s" == t3.unit ? 1e3 * e3 : e3;
          })(function(t3) {
            if (!t3)
              return {};
            var e3 = (t3 = t3.trim().split(" ")[0]).split(/\d+/g).filter((t4) => t4).pop().trim();
            return { value: +t3.split(e3).filter((t4) => t4)[0].trim(), unit: e3 };
          }((e2 = "tag-hide-transition", t2.getPropertyValue("--" + e2)))) };
        }, build(t2) {
          var e2 = this.DOM;
          this.settings.mixMode.integrated ? (e2.originalInput = null, e2.scope = t2, e2.input = t2) : (e2.originalInput = t2, e2.originalInput_tabIndex = t2.tabIndex, e2.scope = this.parseTemplate("wrapper", [t2, this.settings]), e2.input = e2.scope.querySelector(this.settings.classNames.inputSelector), t2.parentNode.insertBefore(e2.scope, t2), t2.tabIndex = -1);
        }, destroy() {
          this.events.unbindGlobal.call(this), this.DOM.scope.parentNode.removeChild(this.DOM.scope), this.DOM.originalInput.tabIndex = this.DOM.originalInput_tabIndex, delete this.DOM.originalInput.__tagify, this.dropdown.hide(true), clearTimeout(this.dropdownHide__bindEventsTimeout), clearInterval(this.listeners.main.originalInputValueObserverInterval);
        }, loadOriginalValues(t2) {
          var e2, i2 = this.settings;
          if (this.state.blockChangeEvent = true, void 0 === t2) {
            const e3 = this.getPersistedData("value");
            t2 = e3 && !this.DOM.originalInput.value ? e3 : i2.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value;
          }
          if (this.removeAllTags(), t2)
            if ("mix" == i2.mode)
              this.parseMixTags(t2), (e2 = this.DOM.input.lastChild) && "BR" == e2.tagName || this.DOM.input.insertAdjacentHTML("beforeend", "<br>");
            else {
              try {
                JSON.parse(t2) instanceof Array && (t2 = JSON.parse(t2));
              } catch (t3) {
              }
              this.addTags(t2, true).forEach((t3) => t3 && t3.classList.add(i2.classNames.tagNoAnimation));
            }
          else
            this.postUpdate();
          this.state.lastOriginalValueReported = i2.mixMode.integrated ? "" : this.DOM.originalInput.value;
        }, cloneEvent(t2) {
          var e2 = {};
          for (var i2 in t2)
            "path" != i2 && (e2[i2] = t2[i2]);
          return e2;
        }, loading(t2) {
          return this.state.isLoading = t2, this.DOM.scope.classList[t2 ? "add" : "remove"](this.settings.classNames.scopeLoading), this;
        }, tagLoading(t2, e2) {
          return t2 && t2.classList[e2 ? "add" : "remove"](this.settings.classNames.tagLoading), this;
        }, toggleClass(t2, e2) {
          "string" == typeof t2 && this.DOM.scope.classList.toggle(t2, e2);
        }, toggleScopeValidation(t2) {
          var e2 = true === t2 || void 0 === t2;
          !this.settings.required && t2 && t2 === this.TEXTS.empty && (e2 = true), this.toggleClass(this.settings.classNames.tagInvalid, !e2), this.DOM.scope.title = e2 ? "" : t2;
        }, toggleFocusClass(t2) {
          this.toggleClass(this.settings.classNames.focus, !!t2);
        }, triggerChangeEvent: function() {
          if (!this.settings.mixMode.integrated) {
            var t2 = this.DOM.originalInput, e2 = this.state.lastOriginalValueReported !== t2.value, i2 = new CustomEvent("change", { bubbles: true });
            e2 && (this.state.lastOriginalValueReported = t2.value, i2.simulated = true, t2._valueTracker && t2._valueTracker.setValue(Math.random()), t2.dispatchEvent(i2), this.trigger("change", this.state.lastOriginalValueReported), t2.value = this.state.lastOriginalValueReported);
          }
        }, events: S, fixFirefoxLastTagNoCaret() {
        }, setRangeAtStartEnd(t2, e2) {
          if (e2) {
            t2 = "number" == typeof t2 ? t2 : !!t2, e2 = e2.lastChild || e2;
            var i2 = document.getSelection();
            if (i2.focusNode instanceof Element && !this.DOM.input.contains(i2.focusNode))
              return true;
            try {
              i2.rangeCount >= 1 && ["Start", "End"].forEach((s2) => i2.getRangeAt(0)["set" + s2](e2, t2 || e2.length));
            } catch (t3) {
              console.warn("Tagify: ", t3);
            }
          }
        }, insertAfterTag(t2, e2) {
          if (e2 = e2 || this.settings.mixMode.insertAfterTag, t2 && t2.parentNode && e2)
            return e2 = "string" == typeof e2 ? document.createTextNode(e2) : e2, t2.parentNode.insertBefore(e2, t2.nextSibling), e2;
        }, editTagChangeDetected(t2) {
          var e2 = t2.__originalData;
          for (var i2 in e2)
            if (!this.dataProps.includes(i2) && t2[i2] != e2[i2])
              return true;
          return false;
        }, getTagTextNode(t2) {
          return t2.querySelector(this.settings.classNames.tagTextSelector);
        }, setTagTextNode(t2, e2) {
          this.getTagTextNode(t2).innerHTML = d(e2);
        }, editTag(t2, e2) {
          t2 = t2 || this.getLastTag(), e2 = e2 || {}, this.dropdown.hide();
          var i2 = this.settings, s2 = this.getTagTextNode(t2), a2 = this.getNodeIndex(t2), n2 = T(t2), o2 = this.events.callbacks, r2 = true;
          if (s2) {
            if (!(n2 instanceof Object && "editable" in n2) || n2.editable)
              return n2 = T(t2, { __originalData: g({}, n2), __originalHTML: t2.cloneNode(true) }), T(n2.__originalHTML, n2.__originalData), s2.setAttribute("contenteditable", true), t2.classList.add(i2.classNames.tagEditing), s2.addEventListener("focus", o2.onEditTagFocus.bind(this, t2)), s2.addEventListener("blur", o2.onEditTagBlur.bind(this, this.getTagTextNode(t2))), s2.addEventListener("input", o2.onEditTagInput.bind(this, s2)), s2.addEventListener("paste", o2.onEditTagPaste.bind(this, s2)), s2.addEventListener("keydown", (e3) => o2.onEditTagkeydown.call(this, e3, t2)), s2.addEventListener("compositionstart", o2.onCompositionStart.bind(this)), s2.addEventListener("compositionend", o2.onCompositionEnd.bind(this)), e2.skipValidation || (r2 = this.editTagToggleValidity(t2)), s2.originalIsValid = r2, this.trigger("edit:start", { tag: t2, index: a2, data: n2, isValid: r2 }), s2.focus(), this.setRangeAtStartEnd(false, s2), this;
          } else
            console.warn("Cannot find element in Tag template: .", i2.classNames.tagTextSelector);
        }, editTagToggleValidity(t2, e2) {
          var i2;
          if (e2 = e2 || T(t2))
            return (i2 = !("__isValid" in e2) || true === e2.__isValid) || this.removeTagsFromValue(t2), this.update(), t2.classList.toggle(this.settings.classNames.tagNotAllowed, !i2), e2.__isValid = i2, e2.__isValid;
          console.warn("tag has no data: ", t2, e2);
        }, onEditTagDone(t2, e2) {
          t2 = t2 || this.state.editing.scope, e2 = e2 || {};
          var i2, s2 = { tag: t2, index: this.getNodeIndex(t2), previousData: T(t2), data: e2 }, a2 = this.settings;
          this.trigger("edit:beforeUpdate", s2, { cloneData: false }), this.state.editing = false, delete e2.__originalData, delete e2.__originalHTML, t2 && ((i2 = e2[a2.tagTextProp]) ? i2.trim() && i2 : a2.tagTextProp in e2 ? void 0 : e2.value) ? (t2 = this.replaceTag(t2, e2), this.editTagToggleValidity(t2, e2), a2.a11y.focusableTags ? t2.focus() : w(t2)) : t2 && this.removeTags(t2), this.trigger("edit:updated", s2), this.dropdown.hide(), this.settings.keepInvalidTags && this.reCheckInvalidTags();
        }, replaceTag(t2, e2) {
          e2 && e2.value || (e2 = t2.__tagifyTagData), e2.__isValid && 1 != e2.__isValid && g(e2, this.getInvalidTagAttrs(e2, e2.__isValid));
          var i2 = this.createTagElem(e2);
          return t2.parentNode.replaceChild(i2, t2), this.updateValueByDOMTags(), i2;
        }, updateValueByDOMTags() {
          this.value.length = 0, [].forEach.call(this.getTagElms(), (t2) => {
            t2.classList.contains(this.settings.classNames.tagNotAllowed.split(" ")[0]) || this.value.push(T(t2));
          }), this.update();
        }, injectAtCaret(t2, e2) {
          if (!(e2 = e2 || this.state.selection?.range) && t2)
            return this.appendMixTags(t2), this;
          let i2 = f(t2, e2);
          return this.setRangeAtStartEnd(false, i2), this.updateValueByDOMTags(), this.update(), this;
        }, input: { set() {
          let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", e2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          var i2 = this.settings.dropdown.closeOnSelect;
          this.state.inputText = t2, e2 && (this.DOM.input.innerHTML = d("" + t2)), !t2 && i2 && this.dropdown.hide.bind(this), this.input.autocomplete.suggest.call(this), this.input.validate.call(this);
        }, raw() {
          return this.DOM.input.textContent;
        }, validate() {
          var t2 = !this.state.inputText || true === this.validateTag({ value: this.state.inputText });
          return this.DOM.input.classList.toggle(this.settings.classNames.inputInvalid, !t2), t2;
        }, normalize(t2, e2) {
          var i2 = t2 || this.DOM.input, s2 = [];
          i2.childNodes.forEach((t3) => 3 == t3.nodeType && s2.push(t3.nodeValue)), s2 = s2.join("\n");
          try {
            s2 = s2.replace(/(?:\r\n|\r|\n)/g, this.settings.delimiters.source.charAt(0));
          } catch (t3) {
          }
          return s2 = s2.replace(/\s/g, " "), e2?.trim ? this.trim(s2) : s2;
        }, autocomplete: { suggest(t2) {
          if (this.settings.autoComplete.enabled) {
            "string" == typeof (t2 = t2 || { value: "" }) && (t2 = { value: t2 });
            var e2 = this.dropdown.getMappedValue(t2);
            if ("number" != typeof e2) {
              var i2 = e2.substr(0, this.state.inputText.length).toLowerCase(), s2 = e2.substring(this.state.inputText.length);
              e2 && this.state.inputText && i2 == this.state.inputText.toLowerCase() ? (this.DOM.input.setAttribute("data-suggest", s2), this.state.inputSuggestion = t2) : (this.DOM.input.removeAttribute("data-suggest"), delete this.state.inputSuggestion);
            }
          }
        }, set(t2) {
          var e2 = this.DOM.input.getAttribute("data-suggest"), i2 = t2 || (e2 ? this.state.inputText + e2 : null);
          return !!i2 && ("mix" == this.settings.mode ? this.replaceTextWithNode(document.createTextNode(this.state.tag.prefix + i2)) : (this.input.set.call(this, i2), this.setRangeAtStartEnd(false, this.DOM.input)), this.input.autocomplete.suggest.call(this), this.dropdown.hide(), true);
        } } }, getTagIdx(t2) {
          return this.value.findIndex((e2) => e2.__tagId == (t2 || {}).__tagId);
        }, getNodeIndex(t2) {
          var e2 = 0;
          if (t2)
            for (; t2 = t2.previousElementSibling; )
              e2++;
          return e2;
        }, getTagElms() {
          for (var t2 = arguments.length, e2 = new Array(t2), i2 = 0; i2 < t2; i2++)
            e2[i2] = arguments[i2];
          var s2 = "." + [...this.settings.classNames.tag.split(" "), ...e2].join(".");
          return [].slice.call(this.DOM.scope.querySelectorAll(s2));
        }, getLastTag() {
          var t2 = this.DOM.scope.querySelectorAll(`${this.settings.classNames.tagSelector}:not(.${this.settings.classNames.tagHide}):not([readonly])`);
          return t2[t2.length - 1];
        }, isTagDuplicate(t2, e2, i2) {
          var a2 = 0;
          if ("select" == this.settings.mode)
            return false;
          for (let n2 of this.value) {
            s(this.trim("" + t2), n2.value, e2) && i2 != n2.__tagId && a2++;
          }
          return a2;
        }, getTagIndexByValue(t2) {
          var e2 = [], i2 = this.settings.dropdown.caseSensitive;
          return this.getTagElms().forEach((a2, n2) => {
            a2.__tagifyTagData && s(this.trim(a2.__tagifyTagData.value), t2, i2) && e2.push(n2);
          }), e2;
        }, getTagElmByValue(t2) {
          var e2 = this.getTagIndexByValue(t2)[0];
          return this.getTagElms()[e2];
        }, flashTag(t2) {
          t2 && (t2.classList.add(this.settings.classNames.tagFlash), setTimeout(() => {
            t2.classList.remove(this.settings.classNames.tagFlash);
          }, 100));
        }, isTagBlacklisted(t2) {
          return t2 = this.trim(t2.toLowerCase()), this.settings.blacklist.filter((e2) => ("" + e2).toLowerCase() == t2).length;
        }, isTagWhitelisted(t2) {
          return !!this.getWhitelistItem(t2);
        }, getWhitelistItem(t2, e2, i2) {
          e2 = e2 || "value";
          var a2, n2 = this.settings;
          return (i2 = i2 || n2.whitelist).some((i3) => {
            var o2 = "string" == typeof i3 ? i3 : i3[e2] || i3.value;
            if (s(o2, t2, n2.dropdown.caseSensitive, n2.trim))
              return a2 = "string" == typeof i3 ? { value: i3 } : i3, true;
          }), a2 || "value" != e2 || "value" == n2.tagTextProp || (a2 = this.getWhitelistItem(t2, n2.tagTextProp, i2)), a2;
        }, validateTag(t2) {
          var e2 = this.settings, i2 = "value" in t2 ? "value" : e2.tagTextProp, s2 = this.trim(t2[i2] + "");
          return (t2[i2] + "").trim() ? "mix" != e2.mode && e2.pattern && e2.pattern instanceof RegExp && !e2.pattern.test(s2) ? this.TEXTS.pattern : !e2.duplicates && this.isTagDuplicate(s2, e2.dropdown.caseSensitive, t2.__tagId) ? this.TEXTS.duplicate : this.isTagBlacklisted(s2) || e2.enforceWhitelist && !this.isTagWhitelisted(s2) ? this.TEXTS.notAllowed : !e2.validate || e2.validate(t2) : this.TEXTS.empty;
        }, getInvalidTagAttrs(t2, e2) {
          return { "aria-invalid": true, class: `${t2.class || ""} ${this.settings.classNames.tagNotAllowed}`.trim(), title: e2 };
        }, hasMaxTags() {
          return this.value.length >= this.settings.maxTags && this.TEXTS.exceed;
        }, setReadonly(t2, e2) {
          var i2 = this.settings;
          document.activeElement.blur(), i2[e2 || "readonly"] = t2, this.DOM.scope[(t2 ? "set" : "remove") + "Attribute"](e2 || "readonly", true), this.settings.userInput = true, this.setContentEditable(!t2);
        }, setContentEditable(t2) {
          this.settings.userInput && (this.DOM.input.contentEditable = t2, this.DOM.input.tabIndex = t2 ? 0 : -1);
        }, setDisabled(t2) {
          this.setReadonly(t2, "disabled");
        }, normalizeTags(t2) {
          var e2 = this.settings, i2 = e2.whitelist, s2 = e2.delimiters, a2 = e2.mode, n2 = e2.tagTextProp, o2 = [], r2 = !!i2 && i2[0] instanceof Object, l2 = Array.isArray(t2), d2 = l2 && t2[0].value, h2 = (t3) => (t3 + "").split(s2).filter((t4) => t4).map((t4) => ({ [n2]: this.trim(t4), value: this.trim(t4) }));
          if ("number" == typeof t2 && (t2 = t2.toString()), "string" == typeof t2) {
            if (!t2.trim())
              return [];
            t2 = h2(t2);
          } else
            l2 && (t2 = [].concat(...t2.map((t3) => null != t3.value ? t3 : h2(t3))));
          return r2 && !d2 && (t2.forEach((t3) => {
            var e3 = o2.map((t4) => t4.value), i3 = this.dropdown.filterListItems.call(this, t3[n2], { exact: true });
            this.settings.duplicates || (i3 = i3.filter((t4) => !e3.includes(t4.value)));
            var s3 = i3.length > 1 ? this.getWhitelistItem(t3[n2], n2, i3) : i3[0];
            s3 && s3 instanceof Object ? o2.push(s3) : "mix" != a2 && (null == t3.value && (t3.value = t3[n2]), o2.push(t3));
          }), o2.length && (t2 = o2)), t2;
        }, parseMixTags(t2) {
          var e2 = this.settings, i2 = e2.mixTagsInterpolator, s2 = e2.duplicates, a2 = e2.transformTag, n2 = e2.enforceWhitelist, o2 = e2.maxTags, r2 = e2.tagTextProp, l2 = [];
          t2 = t2.split(i2[0]).map((t3, e3) => {
            var d3, h2, g2, p2 = t3.split(i2[1]), c2 = p2[0], u2 = l2.length == o2;
            try {
              if (c2 == +c2)
                throw Error;
              h2 = JSON.parse(c2);
            } catch (t4) {
              h2 = this.normalizeTags(c2)[0] || { value: c2 };
            }
            if (a2.call(this, h2), u2 || !(p2.length > 1) || n2 && !this.isTagWhitelisted(h2.value) || !s2 && this.isTagDuplicate(h2.value)) {
              if (t3)
                return e3 ? i2[0] + t3 : t3;
            } else
              h2[d3 = h2[r2] ? r2 : "value"] = this.trim(h2[d3]), g2 = this.createTagElem(h2), l2.push(h2), g2.classList.add(this.settings.classNames.tagNoAnimation), p2[0] = g2.outerHTML, this.value.push(h2);
            return p2.join("");
          }).join(""), this.DOM.input.innerHTML = t2, this.DOM.input.appendChild(document.createTextNode("")), this.DOM.input.normalize();
          var d2 = this.getTagElms();
          return d2.forEach((t3, e3) => T(t3, l2[e3])), this.update({ withoutChangeEvent: true }), b(d2, this.state.hasFocus), t2;
        }, replaceTextWithNode(t2, e2) {
          if (this.state.tag || e2) {
            e2 = e2 || this.state.tag.prefix + this.state.tag.value;
            var i2, s2, a2 = this.state.selection || window.getSelection(), n2 = a2.anchorNode, o2 = this.state.tag.delimiters ? this.state.tag.delimiters.length : 0;
            return n2.splitText(a2.anchorOffset - o2), -1 == (i2 = n2.nodeValue.lastIndexOf(e2)) ? true : (s2 = n2.splitText(i2), t2 && n2.parentNode.replaceChild(t2, s2), true);
          }
        }, selectTag(t2, e2) {
          var i2 = this.settings;
          if (!i2.enforceWhitelist || this.isTagWhitelisted(e2.value)) {
            this.input.set.call(this, e2[i2.tagTextProp] || e2.value, true), this.state.actions.selectOption && setTimeout(() => this.setRangeAtStartEnd(false, this.DOM.input));
            var s2 = this.getLastTag();
            return s2 ? this.replaceTag(s2, e2) : this.appendTag(t2), this.value[0] = e2, this.update(), this.trigger("add", { tag: t2, data: e2 }), [t2];
          }
        }, addEmptyTag(t2) {
          var e2 = g({ value: "" }, t2 || {}), i2 = this.createTagElem(e2);
          T(i2, e2), this.appendTag(i2), this.editTag(i2, { skipValidation: true });
        }, addTags(t2, e2, i2) {
          var s2 = [], a2 = this.settings, n2 = [], o2 = document.createDocumentFragment();
          if (i2 = i2 || a2.skipInvalid, !t2 || 0 == t2.length)
            return s2;
          switch (t2 = this.normalizeTags(t2), a2.mode) {
            case "mix":
              return this.addMixTags(t2);
            case "select":
              e2 = false, this.removeAllTags();
          }
          return this.DOM.input.removeAttribute("style"), t2.forEach((t3) => {
            var e3, r2 = {}, l2 = Object.assign({}, t3, { value: t3.value + "" });
            if (t3 = Object.assign({}, l2), a2.transformTag.call(this, t3), t3.__isValid = this.hasMaxTags() || this.validateTag(t3), true !== t3.__isValid) {
              if (i2)
                return;
              if (g(r2, this.getInvalidTagAttrs(t3, t3.__isValid), { __preInvalidData: l2 }), t3.__isValid == this.TEXTS.duplicate && this.flashTag(this.getTagElmByValue(t3.value)), !a2.createInvalidTags)
                return void n2.push(t3.value);
            }
            if ("readonly" in t3 && (t3.readonly ? r2["aria-readonly"] = true : delete t3.readonly), e3 = this.createTagElem(t3, r2), s2.push(e3), "select" == a2.mode)
              return this.selectTag(e3, t3);
            o2.appendChild(e3), t3.__isValid && true === t3.__isValid ? (this.value.push(t3), this.trigger("add", { tag: e3, index: this.value.length - 1, data: t3 })) : (this.trigger("invalid", { data: t3, index: this.value.length, tag: e3, message: t3.__isValid }), a2.keepInvalidTags || setTimeout(() => this.removeTags(e3, true), 1e3)), this.dropdown.position();
          }), this.appendTag(o2), this.update(), t2.length && e2 && (this.input.set.call(this, a2.createInvalidTags ? "" : n2.join(a2._delimiters)), this.setRangeAtStartEnd(false, this.DOM.input)), a2.dropdown.enabled && this.dropdown.refilter(), s2;
        }, addMixTags(t2) {
          if ((t2 = this.normalizeTags(t2))[0].prefix || this.state.tag)
            return this.prefixedTextToTag(t2[0]);
          var e2 = document.createDocumentFragment();
          return t2.forEach((t3) => {
            var i2 = this.createTagElem(t3);
            e2.appendChild(i2);
          }), this.appendMixTags(e2), e2;
        }, appendMixTags(t2) {
          var e2 = !!this.state.selection;
          e2 ? this.injectAtCaret(t2) : (this.DOM.input.focus(), (e2 = this.setStateSelection()).range.setStart(this.DOM.input, e2.range.endOffset), e2.range.setEnd(this.DOM.input, e2.range.endOffset), this.DOM.input.appendChild(t2), this.updateValueByDOMTags(), this.update());
        }, prefixedTextToTag(t2) {
          var e2, i2 = this.settings, s2 = this.state.tag.delimiters;
          if (i2.transformTag.call(this, t2), t2.prefix = t2.prefix || this.state.tag ? this.state.tag.prefix : (i2.pattern.source || i2.pattern)[0], e2 = this.createTagElem(t2), this.replaceTextWithNode(e2) || this.DOM.input.appendChild(e2), setTimeout(() => e2.classList.add(this.settings.classNames.tagNoAnimation), 300), this.value.push(t2), this.update(), !s2) {
            var a2 = this.insertAfterTag(e2) || e2;
            setTimeout(w, 0, a2);
          }
          return this.state.tag = null, this.trigger("add", g({}, { tag: e2 }, { data: t2 })), e2;
        }, appendTag(t2) {
          var e2 = this.DOM, i2 = e2.input;
          e2.scope.insertBefore(t2, i2);
        }, createTagElem(t2, i2) {
          t2.__tagId = m();
          var s2, a2 = g({}, t2, e({ value: d(t2.value + "") }, i2));
          return function(t3) {
            for (var e2, i3 = document.createNodeIterator(t3, NodeFilter.SHOW_TEXT, null, false); e2 = i3.nextNode(); )
              e2.textContent.trim() || e2.parentNode.removeChild(e2);
          }(s2 = this.parseTemplate("tag", [a2, this])), T(s2, t2), s2;
        }, reCheckInvalidTags() {
          var t2 = this.settings;
          this.getTagElms(t2.classNames.tagNotAllowed).forEach((e2, i2) => {
            var s2 = T(e2), a2 = this.hasMaxTags(), n2 = this.validateTag(s2), o2 = true === n2 && !a2;
            if ("select" == t2.mode && this.toggleScopeValidation(n2), o2)
              return s2 = s2.__preInvalidData ? s2.__preInvalidData : { value: s2.value }, this.replaceTag(e2, s2);
            e2.title = a2 || n2;
          });
        }, removeTags(t2, e2, i2) {
          var s2, a2 = this.settings;
          if (t2 = t2 && t2 instanceof HTMLElement ? [t2] : t2 instanceof Array ? t2 : t2 ? [t2] : [this.getLastTag()], s2 = t2.reduce((t3, e3) => {
            e3 && "string" == typeof e3 && (e3 = this.getTagElmByValue(e3));
            var i3 = T(e3);
            return e3 && i3 && !i3.readonly && t3.push({ node: e3, idx: this.getTagIdx(i3), data: T(e3, { __removed: true }) }), t3;
          }, []), i2 = "number" == typeof i2 ? i2 : this.CSSVars.tagHideTransition, "select" == a2.mode && (i2 = 0, this.input.set.call(this)), 1 == s2.length && "select" != a2.mode && s2[0].node.classList.contains(a2.classNames.tagNotAllowed) && (e2 = true), s2.length)
            return a2.hooks.beforeRemoveTag(s2, { tagify: this }).then(() => {
              function t3(t4) {
                t4.node.parentNode && (t4.node.parentNode.removeChild(t4.node), e2 ? a2.keepInvalidTags && this.trigger("remove", { tag: t4.node, index: t4.idx }) : (this.trigger("remove", { tag: t4.node, index: t4.idx, data: t4.data }), this.dropdown.refilter(), this.dropdown.position(), this.DOM.input.normalize(), a2.keepInvalidTags && this.reCheckInvalidTags()));
              }
              i2 && i2 > 10 && 1 == s2.length ? function(e3) {
                e3.node.style.width = parseFloat(window.getComputedStyle(e3.node).width) + "px", document.body.clientTop, e3.node.classList.add(a2.classNames.tagHide), setTimeout(t3.bind(this), i2, e3);
              }.call(this, s2[0]) : s2.forEach(t3.bind(this)), e2 || (this.removeTagsFromValue(s2.map((t4) => t4.node)), this.update(), "select" == a2.mode && this.setContentEditable(true));
            }).catch((t3) => {
            });
        }, removeTagsFromDOM() {
          [].slice.call(this.getTagElms()).forEach((t2) => t2.parentNode.removeChild(t2));
        }, removeTagsFromValue(t2) {
          (t2 = Array.isArray(t2) ? t2 : [t2]).forEach((t3) => {
            var e2 = T(t3), i2 = this.getTagIdx(e2);
            i2 > -1 && this.value.splice(i2, 1);
          });
        }, removeAllTags(t2) {
          t2 = t2 || {}, this.value = [], "mix" == this.settings.mode ? this.DOM.input.innerHTML = "" : this.removeTagsFromDOM(), this.dropdown.refilter(), this.dropdown.position(), this.state.dropdown.visible && setTimeout(() => {
            this.DOM.input.focus();
          }), "select" == this.settings.mode && (this.input.set.call(this), this.setContentEditable(true)), this.update(t2);
        }, postUpdate() {
          this.state.blockChangeEvent = false;
          var t2 = this.settings, e2 = t2.classNames, i2 = "mix" == t2.mode ? t2.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value.trim() : this.value.length + this.input.raw.call(this).length;
          this.toggleClass(e2.hasMaxTags, this.value.length >= t2.maxTags), this.toggleClass(e2.hasNoTags, !this.value.length), this.toggleClass(e2.empty, !i2), "select" == t2.mode && this.toggleScopeValidation(this.value?.[0]?.__isValid);
        }, setOriginalInputValue(t2) {
          var e2 = this.DOM.originalInput;
          this.settings.mixMode.integrated || (e2.value = t2, e2.tagifyValue = e2.value, this.setPersistedData(t2, "value"));
        }, update(t2) {
          clearTimeout(this.debouncedUpdateTimeout), this.debouncedUpdateTimeout = setTimeout(function() {
            var e2 = this.getInputValue();
            this.setOriginalInputValue(e2), this.settings.onChangeAfterBlur && (t2 || {}).withoutChangeEvent || this.state.blockChangeEvent || this.triggerChangeEvent();
            this.postUpdate();
          }.bind(this), 100);
        }, getInputValue() {
          var t2 = this.getCleanValue();
          return "mix" == this.settings.mode ? this.getMixedTagsAsString(t2) : t2.length ? this.settings.originalInputValueFormat ? this.settings.originalInputValueFormat(t2) : JSON.stringify(t2) : "";
        }, getCleanValue(t2) {
          return a(t2 || this.value, this.dataProps);
        }, getMixedTagsAsString() {
          var t2 = "", e2 = this, i2 = this.settings, s2 = i2.originalInputValueFormat || JSON.stringify, a2 = i2.mixTagsInterpolator;
          return function i3(o2) {
            o2.childNodes.forEach((o3) => {
              if (1 == o3.nodeType) {
                const r2 = T(o3);
                if ("BR" == o3.tagName && (t2 += "\r\n"), r2 && v.call(e2, o3)) {
                  if (r2.__removed)
                    return;
                  t2 += a2[0] + s2(n(r2, e2.dataProps)) + a2[1];
                } else
                  o3.getAttribute("style") || ["B", "I", "U"].includes(o3.tagName) ? t2 += o3.textContent : "DIV" != o3.tagName && "P" != o3.tagName || (t2 += "\r\n", i3(o3));
              } else
                t2 += o3.textContent;
            });
          }(this.DOM.input), t2;
        } }, E.prototype.removeTag = E.prototype.removeTags, E;
      });
    }
  });

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outlet = this.outlets.find(name);
          if (outlet) {
            const outletController = this.application.getControllerForElementAndIdentifier(outlet, name);
            if (outletController) {
              return outletController;
            } else {
              throw new Error(`Missing "data-controller=${name}" attribute on outlet element for "${this.identifier}" controller`);
            }
          }
          throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outlet) => {
              const controller = this.application.getControllerForElementAndIdentifier(outlet, name);
              if (controller) {
                return controller;
              } else {
                console.warn(`The provided outlet element is missing the outlet controller "${name}" for "${this.identifier}"`, outlet);
              }
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outlet = this.outlets.find(name);
          if (outlet) {
            return outlet;
          } else {
            throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const typeFromObject = parseValueTypeConstant(payload.typeObject.type);
    if (!typeFromObject)
      return;
    const defaultValueType = parseValueTypeDefault(payload.typeObject.default);
    if (typeFromObject !== defaultValueType) {
      const propertyPath = payload.controller ? `${payload.controller}.${payload.token}` : payload.token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${payload.typeObject.default}" is of type "${defaultValueType}".`);
    }
    return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const typeFromObject = parseValueTypeObject({
      controller: payload.controller,
      token: payload.token,
      typeObject: payload.typeDefinition
    });
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeDefinition);
    const typeFromConstant = parseValueTypeConstant(payload.typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = payload.controller ? `${payload.controller}.${payload.typeDefinition}` : payload.token;
    throw new Error(`Unknown value type "${propertyPath}" for "${payload.token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const key = `${dasherize(payload.token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(payload.typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(payload.typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/avo_filter_controller.js
  var avo_filter_controller_default = class extends Controller {
    connect() {
      var _a;
      const filterElement = this.context.element;
      const value = (_a = this.context.element.querySelector("#condition_selector")) == null ? void 0 : _a.value;
      if (filterElement && value) {
        this.evaluateConditionChange(filterElement, value);
      }
    }
    onConditionChange(e) {
      const { value } = e.target;
      const filterElement = e.target.closest("[data-filter-id]");
      this.evaluateConditionChange(filterElement, value);
    }
    evaluateConditionChange(filterElement, value) {
      const valueField = filterElement.querySelector('[data-control="value"]');
      const noValueConditions = ["is_present", "is_blank", "is_true", "is_false", "is_null", "is_not_null"];
      if (noValueConditions.includes(value)) {
        valueField.classList.add("hidden");
      } else {
        valueField.classList.remove("hidden");
      }
    }
  };

  // node_modules/el-transition/index.js
  async function enter(element, transitionName = null) {
    element.classList.remove("hidden");
    await transition("enter", element, transitionName);
  }
  async function leave(element, transitionName = null) {
    await transition("leave", element, transitionName);
    element.classList.add("hidden");
  }
  async function toggle(element, transitionName = null) {
    if (element.classList.contains("hidden")) {
      await enter(element, transitionName);
    } else {
      await leave(element, transitionName);
    }
  }
  async function transition(direction, element, animation) {
    const dataset = element.dataset;
    const animationClass = animation ? `${animation}-${direction}` : direction;
    let transition2 = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
    const genesis = dataset[transition2] ? dataset[transition2].split(" ") : [animationClass];
    const start = dataset[`${transition2}Start`] ? dataset[`${transition2}Start`].split(" ") : [`${animationClass}-start`];
    const end = dataset[`${transition2}End`] ? dataset[`${transition2}End`].split(" ") : [`${animationClass}-end`];
    addClasses(element, genesis);
    addClasses(element, start);
    await nextFrame();
    removeClasses(element, start);
    addClasses(element, end);
    await afterTransition(element);
    removeClasses(element, end);
    removeClasses(element, genesis);
  }
  function addClasses(element, classes) {
    element.classList.add(...classes);
  }
  function removeClasses(element, classes) {
    element.classList.remove(...classes);
  }
  function nextFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }
  function afterTransition(element) {
    return new Promise((resolve) => {
      const computedDuration = getComputedStyle(element).transitionDuration.split(",")[0];
      const duration2 = Number(computedDuration.replace("s", "")) * 1e3;
      setTimeout(() => {
        resolve();
      }, duration2);
    });
  }

  // app/javascript/controllers/avo_filters_controller.js
  var import_urijs = __toESM(require_URI());
  var avo_filters_controller_default = class extends Controller {
    get paramKey() {
      return window.Avo.configuration.avo_filters.param_key;
    }
    get inTurboFrame() {
      return true;
    }
    apply() {
      let url;
      if (this.turboFrameValue) {
        url = new import_urijs.default(document.querySelector(`turbo-frame#${this.turboFrameValue}`).src);
      } else {
        url = new import_urijs.default();
      }
      url.removeSearch(new RegExp(`${this.paramKey}`));
      url.removeSearch("page");
      this.filterTargets.forEach((el) => {
        const id = el.dataset.fieldId;
        const condition = el.querySelector("[data-control='condition']").value;
        const { value } = el.querySelector("[data-control='value']");
        url.setSearch(`${this.paramKey}[${id}][${condition}][]=${encodeURIComponent(value)}`);
      });
      const finalUrl = url.readable().toString();
      if (this.turboFrameValue) {
        document.querySelector(`turbo-frame#${this.turboFrameValue}`).src = finalUrl;
      } else {
        window.Turbo.visit(finalUrl);
      }
    }
    toggleFilter() {
      this.containerTarget.classList.toggle("hidden");
    }
    get containerTarget() {
      return document.getElementById(this.dynamicFiltersComponentIdValue);
    }
    toggleFiltersArea() {
      return __async(this, null, function* () {
        if (this.containerTarget) {
          yield toggle(this.containerTarget);
          const isOpen = !this.containerTarget.classList.contains("hidden");
          if (isOpen) {
            document.querySelector(
              `#${this.dynamicFiltersComponentIdValue} [data-avo-filters-target="add-filter-button"]`
            ).click();
          }
        }
      });
    }
    removeFilter(e) {
      e.target.closest("[data-avo-filters-target='filter']").remove();
      this.apply();
    }
    resetFilters() {
      const url = new import_urijs.default();
      url.removeSearch(new RegExp(`${this.paramKey}`));
      window.Turbo.visit(url.readable().toString());
    }
  };
  __publicField(avo_filters_controller_default, "targets", ["filter"]);
  __publicField(avo_filters_controller_default, "values", {
    turboFrame: String,
    dynamicFiltersComponentId: String
  });

  // node_modules/flatpickr/dist/esm/types/options.js
  var HOOKS = [
    "onChange",
    "onClose",
    "onDayCreate",
    "onDestroy",
    "onKeyDown",
    "onMonthChange",
    "onOpen",
    "onParseConfig",
    "onReady",
    "onValueUpdate",
    "onYearChange",
    "onPreCalendarPosition"
  ];
  var defaults = {
    _disable: [],
    allowInput: false,
    allowInvalidPreload: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    autoFillDefaultTime: true,
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enableSeconds: false,
    enableTime: false,
    errorHandler: function(err) {
      return typeof console !== "undefined" && console.warn(err);
    },
    getWeek: function(givenDate) {
      var date = new Date(givenDate.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      var week1 = new Date(date.getFullYear(), 0, 4);
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 864e5 - 3 + (week1.getDay() + 6) % 7) / 7);
    },
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    monthSelectorType: "dropdown",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: void 0,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false
  };

  // node_modules/flatpickr/dist/esm/l10n/default.js
  var english = {
    weekdays: {
      shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      longhand: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    },
    months: {
      shorthand: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      longhand: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: function(nth) {
      var s = nth % 100;
      if (s > 3 && s < 21)
        return "th";
      switch (s % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year",
    monthAriaLabel: "Month",
    hourAriaLabel: "Hour",
    minuteAriaLabel: "Minute",
    time_24hr: false
  };
  var default_default = english;

  // node_modules/flatpickr/dist/esm/utils/index.js
  var pad = function(number, length) {
    if (length === void 0) {
      length = 2;
    }
    return ("000" + number).slice(length * -1);
  };
  var int = function(bool) {
    return bool === true ? 1 : 0;
  };
  function debounce(fn, wait) {
    var t;
    return function() {
      var _this = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function() {
        return fn.apply(_this, args);
      }, wait);
    };
  }
  var arrayify = function(obj) {
    return obj instanceof Array ? obj : [obj];
  };

  // node_modules/flatpickr/dist/esm/utils/dom.js
  function toggleClass(elem, className, bool) {
    if (bool === true)
      return elem.classList.add(className);
    elem.classList.remove(className);
  }
  function createElement(tag, className, content) {
    var e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== void 0)
      e.textContent = content;
    return e;
  }
  function clearNode(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }
  function findParent(node, condition) {
    if (condition(node))
      return node;
    else if (node.parentNode)
      return findParent(node.parentNode, condition);
    return void 0;
  }
  function createNumberInput(inputClassName, opts) {
    var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
      numInput.type = "number";
    } else {
      numInput.type = "text";
      numInput.pattern = "\\d*";
    }
    if (opts !== void 0)
      for (var key in opts)
        numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
  }
  function getEventTarget(event) {
    try {
      if (typeof event.composedPath === "function") {
        var path = event.composedPath();
        return path[0];
      }
      return event.target;
    } catch (error) {
      return event.target;
    }
  }

  // node_modules/flatpickr/dist/esm/utils/formatting.js
  var doNothing = function() {
    return void 0;
  };
  var monthToStr = function(monthNumber, shorthand, locale) {
    return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
  };
  var revFormat = {
    D: doNothing,
    F: function(dateObj, monthName, locale) {
      dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function(dateObj, hour) {
      dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    H: function(dateObj, hour) {
      dateObj.setHours(parseFloat(hour));
    },
    J: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    K: function(dateObj, amPM, locale) {
      dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function(dateObj, shortMonth, locale) {
      dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    U: function(_, unixSeconds) {
      return new Date(parseFloat(unixSeconds) * 1e3);
    },
    W: function(dateObj, weekNum, locale) {
      var weekNumber = parseInt(weekNum);
      var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
      date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
      return date;
    },
    Y: function(dateObj, year) {
      dateObj.setFullYear(parseFloat(year));
    },
    Z: function(_, ISODate) {
      return new Date(ISODate);
    },
    d: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    h: function(dateObj, hour) {
      dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    i: function(dateObj, minutes) {
      dateObj.setMinutes(parseFloat(minutes));
    },
    j: function(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: function(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    u: function(_, unixMillSeconds) {
      return new Date(parseFloat(unixMillSeconds));
    },
    w: doNothing,
    y: function(dateObj, year) {
      dateObj.setFullYear(2e3 + parseFloat(year));
    }
  };
  var tokenRegex = {
    D: "",
    F: "",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    u: "(.+)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})"
  };
  var formats = {
    Z: function(date) {
      return date.toISOString();
    },
    D: function(date, locale, options) {
      return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function(date, locale, options) {
      return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function(date, locale, options) {
      return pad(formats.h(date, locale, options));
    },
    H: function(date) {
      return pad(date.getHours());
    },
    J: function(date, locale) {
      return locale.ordinal !== void 0 ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
    },
    K: function(date, locale) {
      return locale.amPM[int(date.getHours() > 11)];
    },
    M: function(date, locale) {
      return monthToStr(date.getMonth(), true, locale);
    },
    S: function(date) {
      return pad(date.getSeconds());
    },
    U: function(date) {
      return date.getTime() / 1e3;
    },
    W: function(date, _, options) {
      return options.getWeek(date);
    },
    Y: function(date) {
      return pad(date.getFullYear(), 4);
    },
    d: function(date) {
      return pad(date.getDate());
    },
    h: function(date) {
      return date.getHours() % 12 ? date.getHours() % 12 : 12;
    },
    i: function(date) {
      return pad(date.getMinutes());
    },
    j: function(date) {
      return date.getDate();
    },
    l: function(date, locale) {
      return locale.weekdays.longhand[date.getDay()];
    },
    m: function(date) {
      return pad(date.getMonth() + 1);
    },
    n: function(date) {
      return date.getMonth() + 1;
    },
    s: function(date) {
      return date.getSeconds();
    },
    u: function(date) {
      return date.getTime();
    },
    w: function(date) {
      return date.getDay();
    },
    y: function(date) {
      return String(date.getFullYear()).substring(2);
    }
  };

  // node_modules/flatpickr/dist/esm/utils/dates.js
  var createDateFormatter = function(_a) {
    var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
    return function(dateObj, frmt, overrideLocale) {
      var locale = overrideLocale || l10n;
      if (config.formatDate !== void 0 && !isMobile) {
        return config.formatDate(dateObj, frmt, locale);
      }
      return frmt.split("").map(function(c, i, arr) {
        return formats[c] && arr[i - 1] !== "\\" ? formats[c](dateObj, locale, config) : c !== "\\" ? c : "";
      }).join("");
    };
  };
  var createDateParser = function(_a) {
    var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c;
    return function(date, givenFormat, timeless, customLocale) {
      if (date !== 0 && !date)
        return void 0;
      var locale = customLocale || l10n;
      var parsedDate;
      var dateOrig = date;
      if (date instanceof Date)
        parsedDate = new Date(date.getTime());
      else if (typeof date !== "string" && date.toFixed !== void 0)
        parsedDate = new Date(date);
      else if (typeof date === "string") {
        var format = givenFormat || (config || defaults).dateFormat;
        var datestr = String(date).trim();
        if (datestr === "today") {
          parsedDate = new Date();
          timeless = true;
        } else if (config && config.parseDate) {
          parsedDate = config.parseDate(date, format);
        } else if (/Z$/.test(datestr) || /GMT$/.test(datestr)) {
          parsedDate = new Date(date);
        } else {
          var matched = void 0, ops = [];
          for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
            var token = format[i];
            var isBackSlash = token === "\\";
            var escaped = format[i - 1] === "\\" || isBackSlash;
            if (tokenRegex[token] && !escaped) {
              regexStr += tokenRegex[token];
              var match = new RegExp(regexStr).exec(date);
              if (match && (matched = true)) {
                ops[token !== "Y" ? "push" : "unshift"]({
                  fn: revFormat[token],
                  val: match[++matchIndex]
                });
              }
            } else if (!isBackSlash)
              regexStr += ".";
          }
          parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
          ops.forEach(function(_a2) {
            var fn = _a2.fn, val = _a2.val;
            return parsedDate = fn(parsedDate, val, locale) || parsedDate;
          });
          parsedDate = matched ? parsedDate : void 0;
        }
      }
      if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
        config.errorHandler(new Error("Invalid date provided: " + dateOrig));
        return void 0;
      }
      if (timeless === true)
        parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    };
  };
  function compareDates(date1, date2, timeless) {
    if (timeless === void 0) {
      timeless = true;
    }
    if (timeless !== false) {
      return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
    }
    return date1.getTime() - date2.getTime();
  }
  var isBetween = function(ts, ts1, ts2) {
    return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
  };
  var calculateSecondsSinceMidnight = function(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
  };
  var parseSeconds = function(secondsSinceMidnight) {
    var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
    return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
  };
  var duration = {
    DAY: 864e5
  };
  function getDefaultHours(config) {
    var hours = config.defaultHour;
    var minutes = config.defaultMinute;
    var seconds = config.defaultSeconds;
    if (config.minDate !== void 0) {
      var minHour = config.minDate.getHours();
      var minMinutes = config.minDate.getMinutes();
      var minSeconds = config.minDate.getSeconds();
      if (hours < minHour) {
        hours = minHour;
      }
      if (hours === minHour && minutes < minMinutes) {
        minutes = minMinutes;
      }
      if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
        seconds = config.minDate.getSeconds();
    }
    if (config.maxDate !== void 0) {
      var maxHr = config.maxDate.getHours();
      var maxMinutes = config.maxDate.getMinutes();
      hours = Math.min(hours, maxHr);
      if (hours === maxHr)
        minutes = Math.min(maxMinutes, minutes);
      if (hours === maxHr && minutes === maxMinutes)
        seconds = config.maxDate.getSeconds();
    }
    return { hours, minutes, seconds };
  }

  // node_modules/flatpickr/dist/esm/utils/polyfills.js
  if (typeof Object.assign !== "function") {
    Object.assign = function(target) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
      if (!target) {
        throw TypeError("Cannot convert undefined or null to object");
      }
      var _loop_1 = function(source2) {
        if (source2) {
          Object.keys(source2).forEach(function(key) {
            return target[key] = source2[key];
          });
        }
      };
      for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var source = args_1[_a];
        _loop_1(source);
      }
      return target;
    };
  }

  // node_modules/flatpickr/dist/esm/index.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __spreadArrays = function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
  var DEBOUNCED_CHANGE_MS = 300;
  function FlatpickrInstance(element, instanceConfig) {
    var self2 = {
      config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
      l10n: default_default
    };
    self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
    self2._handlers = [];
    self2.pluginElements = [];
    self2.loadedPlugins = [];
    self2._bind = bind;
    self2._setHoursFromDate = setHoursFromDate;
    self2._positionCalendar = positionCalendar;
    self2.changeMonth = changeMonth;
    self2.changeYear = changeYear;
    self2.clear = clear;
    self2.close = close;
    self2.onMouseOver = onMouseOver;
    self2._createElement = createElement;
    self2.createDay = createDay;
    self2.destroy = destroy;
    self2.isEnabled = isEnabled;
    self2.jumpToDate = jumpToDate;
    self2.updateValue = updateValue;
    self2.open = open;
    self2.redraw = redraw;
    self2.set = set;
    self2.setDate = setDate;
    self2.toggle = toggle2;
    function setupHelperFunctions() {
      self2.utils = {
        getDaysInMonth: function(month, yr) {
          if (month === void 0) {
            month = self2.currentMonth;
          }
          if (yr === void 0) {
            yr = self2.currentYear;
          }
          if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0))
            return 29;
          return self2.l10n.daysInMonth[month];
        }
      };
    }
    function init() {
      self2.element = self2.input = element;
      self2.isOpen = false;
      parseConfig();
      setupLocale();
      setupInputs();
      setupDates();
      setupHelperFunctions();
      if (!self2.isMobile)
        build();
      bindEvents();
      if (self2.selectedDates.length || self2.config.noCalendar) {
        if (self2.config.enableTime) {
          setHoursFromDate(self2.config.noCalendar ? self2.latestSelectedDateObj : void 0);
        }
        updateValue(false);
      }
      setCalendarWidth();
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (!self2.isMobile && isSafari) {
        positionCalendar();
      }
      triggerEvent("onReady");
    }
    function getClosestActiveElement() {
      var _a;
      return ((_a = self2.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode()).activeElement || document.activeElement;
    }
    function bindToInstance(fn) {
      return fn.bind(self2);
    }
    function setCalendarWidth() {
      var config = self2.config;
      if (config.weekNumbers === false && config.showMonths === 1) {
        return;
      } else if (config.noCalendar !== true) {
        window.requestAnimationFrame(function() {
          if (self2.calendarContainer !== void 0) {
            self2.calendarContainer.style.visibility = "hidden";
            self2.calendarContainer.style.display = "block";
          }
          if (self2.daysContainer !== void 0) {
            var daysWidth = (self2.days.offsetWidth + 1) * config.showMonths;
            self2.daysContainer.style.width = daysWidth + "px";
            self2.calendarContainer.style.width = daysWidth + (self2.weekWrapper !== void 0 ? self2.weekWrapper.offsetWidth : 0) + "px";
            self2.calendarContainer.style.removeProperty("visibility");
            self2.calendarContainer.style.removeProperty("display");
          }
        });
      }
    }
    function updateTime(e) {
      if (self2.selectedDates.length === 0) {
        var defaultDate = self2.config.minDate === void 0 || compareDates(new Date(), self2.config.minDate) >= 0 ? new Date() : new Date(self2.config.minDate.getTime());
        var defaults2 = getDefaultHours(self2.config);
        defaultDate.setHours(defaults2.hours, defaults2.minutes, defaults2.seconds, defaultDate.getMilliseconds());
        self2.selectedDates = [defaultDate];
        self2.latestSelectedDateObj = defaultDate;
      }
      if (e !== void 0 && e.type !== "blur") {
        timeWrapper(e);
      }
      var prevValue = self2._input.value;
      setHoursFromInputs();
      updateValue();
      if (self2._input.value !== prevValue) {
        self2._debouncedChange();
      }
    }
    function ampm2military(hour, amPM) {
      return hour % 12 + 12 * int(amPM === self2.l10n.amPM[1]);
    }
    function military2ampm(hour) {
      switch (hour % 24) {
        case 0:
        case 12:
          return 12;
        default:
          return hour % 12;
      }
    }
    function setHoursFromInputs() {
      if (self2.hourElement === void 0 || self2.minuteElement === void 0)
        return;
      var hours = (parseInt(self2.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self2.minuteElement.value, 10) || 0) % 60, seconds = self2.secondElement !== void 0 ? (parseInt(self2.secondElement.value, 10) || 0) % 60 : 0;
      if (self2.amPM !== void 0) {
        hours = ampm2military(hours, self2.amPM.textContent);
      }
      var limitMinHours = self2.config.minTime !== void 0 || self2.config.minDate && self2.minDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.minDate, true) === 0;
      var limitMaxHours = self2.config.maxTime !== void 0 || self2.config.maxDate && self2.maxDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.maxDate, true) === 0;
      if (self2.config.maxTime !== void 0 && self2.config.minTime !== void 0 && self2.config.minTime > self2.config.maxTime) {
        var minBound = calculateSecondsSinceMidnight(self2.config.minTime.getHours(), self2.config.minTime.getMinutes(), self2.config.minTime.getSeconds());
        var maxBound = calculateSecondsSinceMidnight(self2.config.maxTime.getHours(), self2.config.maxTime.getMinutes(), self2.config.maxTime.getSeconds());
        var currentTime = calculateSecondsSinceMidnight(hours, minutes, seconds);
        if (currentTime > maxBound && currentTime < minBound) {
          var result = parseSeconds(minBound);
          hours = result[0];
          minutes = result[1];
          seconds = result[2];
        }
      } else {
        if (limitMaxHours) {
          var maxTime = self2.config.maxTime !== void 0 ? self2.config.maxTime : self2.config.maxDate;
          hours = Math.min(hours, maxTime.getHours());
          if (hours === maxTime.getHours())
            minutes = Math.min(minutes, maxTime.getMinutes());
          if (minutes === maxTime.getMinutes())
            seconds = Math.min(seconds, maxTime.getSeconds());
        }
        if (limitMinHours) {
          var minTime = self2.config.minTime !== void 0 ? self2.config.minTime : self2.config.minDate;
          hours = Math.max(hours, minTime.getHours());
          if (hours === minTime.getHours() && minutes < minTime.getMinutes())
            minutes = minTime.getMinutes();
          if (minutes === minTime.getMinutes())
            seconds = Math.max(seconds, minTime.getSeconds());
        }
      }
      setHours(hours, minutes, seconds);
    }
    function setHoursFromDate(dateObj) {
      var date = dateObj || self2.latestSelectedDateObj;
      if (date && date instanceof Date) {
        setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      }
    }
    function setHours(hours, minutes, seconds) {
      if (self2.latestSelectedDateObj !== void 0) {
        self2.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
      }
      if (!self2.hourElement || !self2.minuteElement || self2.isMobile)
        return;
      self2.hourElement.value = pad(!self2.config.time_24hr ? (12 + hours) % 12 + 12 * int(hours % 12 === 0) : hours);
      self2.minuteElement.value = pad(minutes);
      if (self2.amPM !== void 0)
        self2.amPM.textContent = self2.l10n.amPM[int(hours >= 12)];
      if (self2.secondElement !== void 0)
        self2.secondElement.value = pad(seconds);
    }
    function onYearInput(event) {
      var eventTarget = getEventTarget(event);
      var year = parseInt(eventTarget.value) + (event.delta || 0);
      if (year / 1e3 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
        changeYear(year);
      }
    }
    function bind(element2, event, handler, options) {
      if (event instanceof Array)
        return event.forEach(function(ev) {
          return bind(element2, ev, handler, options);
        });
      if (element2 instanceof Array)
        return element2.forEach(function(el) {
          return bind(el, event, handler, options);
        });
      element2.addEventListener(event, handler, options);
      self2._handlers.push({
        remove: function() {
          return element2.removeEventListener(event, handler, options);
        }
      });
    }
    function triggerChange() {
      triggerEvent("onChange");
    }
    function bindEvents() {
      if (self2.config.wrap) {
        ["open", "close", "toggle", "clear"].forEach(function(evt) {
          Array.prototype.forEach.call(self2.element.querySelectorAll("[data-" + evt + "]"), function(el) {
            return bind(el, "click", self2[evt]);
          });
        });
      }
      if (self2.isMobile) {
        setupMobile();
        return;
      }
      var debouncedResize = debounce(onResize, 50);
      self2._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
      if (self2.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
        bind(self2.daysContainer, "mouseover", function(e) {
          if (self2.config.mode === "range")
            onMouseOver(getEventTarget(e));
        });
      bind(self2._input, "keydown", onKeyDown);
      if (self2.calendarContainer !== void 0) {
        bind(self2.calendarContainer, "keydown", onKeyDown);
      }
      if (!self2.config.inline && !self2.config.static)
        bind(window, "resize", debouncedResize);
      if (window.ontouchstart !== void 0)
        bind(window.document, "touchstart", documentClick);
      else
        bind(window.document, "mousedown", documentClick);
      bind(window.document, "focus", documentClick, { capture: true });
      if (self2.config.clickOpens === true) {
        bind(self2._input, "focus", self2.open);
        bind(self2._input, "click", self2.open);
      }
      if (self2.daysContainer !== void 0) {
        bind(self2.monthNav, "click", onMonthNavClick);
        bind(self2.monthNav, ["keyup", "increment"], onYearInput);
        bind(self2.daysContainer, "click", selectDate);
      }
      if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0) {
        var selText = function(e) {
          return getEventTarget(e).select();
        };
        bind(self2.timeContainer, ["increment"], updateTime);
        bind(self2.timeContainer, "blur", updateTime, { capture: true });
        bind(self2.timeContainer, "click", timeIncrement);
        bind([self2.hourElement, self2.minuteElement], ["focus", "click"], selText);
        if (self2.secondElement !== void 0)
          bind(self2.secondElement, "focus", function() {
            return self2.secondElement && self2.secondElement.select();
          });
        if (self2.amPM !== void 0) {
          bind(self2.amPM, "click", function(e) {
            updateTime(e);
          });
        }
      }
      if (self2.config.allowInput) {
        bind(self2._input, "blur", onBlur);
      }
    }
    function jumpToDate(jumpDate, triggerChange2) {
      var jumpTo = jumpDate !== void 0 ? self2.parseDate(jumpDate) : self2.latestSelectedDateObj || (self2.config.minDate && self2.config.minDate > self2.now ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate < self2.now ? self2.config.maxDate : self2.now);
      var oldYear = self2.currentYear;
      var oldMonth = self2.currentMonth;
      try {
        if (jumpTo !== void 0) {
          self2.currentYear = jumpTo.getFullYear();
          self2.currentMonth = jumpTo.getMonth();
        }
      } catch (e) {
        e.message = "Invalid date supplied: " + jumpTo;
        self2.config.errorHandler(e);
      }
      if (triggerChange2 && self2.currentYear !== oldYear) {
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      if (triggerChange2 && (self2.currentYear !== oldYear || self2.currentMonth !== oldMonth)) {
        triggerEvent("onMonthChange");
      }
      self2.redraw();
    }
    function timeIncrement(e) {
      var eventTarget = getEventTarget(e);
      if (~eventTarget.className.indexOf("arrow"))
        incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
    }
    function incrementNumInput(e, delta, inputElem) {
      var target = e && getEventTarget(e);
      var input = inputElem || target && target.parentNode && target.parentNode.firstChild;
      var event = createEvent("increment");
      event.delta = delta;
      input && input.dispatchEvent(event);
    }
    function build() {
      var fragment = window.document.createDocumentFragment();
      self2.calendarContainer = createElement("div", "flatpickr-calendar");
      self2.calendarContainer.tabIndex = -1;
      if (!self2.config.noCalendar) {
        fragment.appendChild(buildMonthNav());
        self2.innerContainer = createElement("div", "flatpickr-innerContainer");
        if (self2.config.weekNumbers) {
          var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
          self2.innerContainer.appendChild(weekWrapper);
          self2.weekNumbers = weekNumbers;
          self2.weekWrapper = weekWrapper;
        }
        self2.rContainer = createElement("div", "flatpickr-rContainer");
        self2.rContainer.appendChild(buildWeekdays());
        if (!self2.daysContainer) {
          self2.daysContainer = createElement("div", "flatpickr-days");
          self2.daysContainer.tabIndex = -1;
        }
        buildDays();
        self2.rContainer.appendChild(self2.daysContainer);
        self2.innerContainer.appendChild(self2.rContainer);
        fragment.appendChild(self2.innerContainer);
      }
      if (self2.config.enableTime) {
        fragment.appendChild(buildTime());
      }
      toggleClass(self2.calendarContainer, "rangeMode", self2.config.mode === "range");
      toggleClass(self2.calendarContainer, "animate", self2.config.animate === true);
      toggleClass(self2.calendarContainer, "multiMonth", self2.config.showMonths > 1);
      self2.calendarContainer.appendChild(fragment);
      var customAppend = self2.config.appendTo !== void 0 && self2.config.appendTo.nodeType !== void 0;
      if (self2.config.inline || self2.config.static) {
        self2.calendarContainer.classList.add(self2.config.inline ? "inline" : "static");
        if (self2.config.inline) {
          if (!customAppend && self2.element.parentNode)
            self2.element.parentNode.insertBefore(self2.calendarContainer, self2._input.nextSibling);
          else if (self2.config.appendTo !== void 0)
            self2.config.appendTo.appendChild(self2.calendarContainer);
        }
        if (self2.config.static) {
          var wrapper = createElement("div", "flatpickr-wrapper");
          if (self2.element.parentNode)
            self2.element.parentNode.insertBefore(wrapper, self2.element);
          wrapper.appendChild(self2.element);
          if (self2.altInput)
            wrapper.appendChild(self2.altInput);
          wrapper.appendChild(self2.calendarContainer);
        }
      }
      if (!self2.config.static && !self2.config.inline)
        (self2.config.appendTo !== void 0 ? self2.config.appendTo : window.document.body).appendChild(self2.calendarContainer);
    }
    function createDay(className, date, _dayNumber, i) {
      var dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", className, date.getDate().toString());
      dayElement.dateObj = date;
      dayElement.$i = i;
      dayElement.setAttribute("aria-label", self2.formatDate(date, self2.config.ariaDateFormat));
      if (className.indexOf("hidden") === -1 && compareDates(date, self2.now) === 0) {
        self2.todayDateElem = dayElement;
        dayElement.classList.add("today");
        dayElement.setAttribute("aria-current", "date");
      }
      if (dateIsEnabled) {
        dayElement.tabIndex = -1;
        if (isDateSelected(date)) {
          dayElement.classList.add("selected");
          self2.selectedDateElem = dayElement;
          if (self2.config.mode === "range") {
            toggleClass(dayElement, "startRange", self2.selectedDates[0] && compareDates(date, self2.selectedDates[0], true) === 0);
            toggleClass(dayElement, "endRange", self2.selectedDates[1] && compareDates(date, self2.selectedDates[1], true) === 0);
            if (className === "nextMonthDay")
              dayElement.classList.add("inRange");
          }
        }
      } else {
        dayElement.classList.add("flatpickr-disabled");
      }
      if (self2.config.mode === "range") {
        if (isDateInRange(date) && !isDateSelected(date))
          dayElement.classList.add("inRange");
      }
      if (self2.weekNumbers && self2.config.showMonths === 1 && className !== "prevMonthDay" && i % 7 === 6) {
        self2.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self2.config.getWeek(date) + "</span>");
      }
      triggerEvent("onDayCreate", dayElement);
      return dayElement;
    }
    function focusOnDayElem(targetNode) {
      targetNode.focus();
      if (self2.config.mode === "range")
        onMouseOver(targetNode);
    }
    function getFirstAvailableDay(delta) {
      var startMonth = delta > 0 ? 0 : self2.config.showMonths - 1;
      var endMonth = delta > 0 ? self2.config.showMonths : -1;
      for (var m = startMonth; m != endMonth; m += delta) {
        var month = self2.daysContainer.children[m];
        var startIndex = delta > 0 ? 0 : month.children.length - 1;
        var endIndex = delta > 0 ? month.children.length : -1;
        for (var i = startIndex; i != endIndex; i += delta) {
          var c = month.children[i];
          if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
            return c;
        }
      }
      return void 0;
    }
    function getNextAvailableDay(current, delta) {
      var givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self2.currentMonth;
      var endMonth = delta > 0 ? self2.config.showMonths : -1;
      var loopDelta = delta > 0 ? 1 : -1;
      for (var m = givenMonth - self2.currentMonth; m != endMonth; m += loopDelta) {
        var month = self2.daysContainer.children[m];
        var startIndex = givenMonth - self2.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
        var numMonthDays = month.children.length;
        for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
          var c = month.children[i];
          if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta))
            return focusOnDayElem(c);
        }
      }
      self2.changeMonth(loopDelta);
      focusOnDay(getFirstAvailableDay(loopDelta), 0);
      return void 0;
    }
    function focusOnDay(current, offset) {
      var activeElement = getClosestActiveElement();
      var dayFocused = isInView(activeElement || document.body);
      var startElem = current !== void 0 ? current : dayFocused ? activeElement : self2.selectedDateElem !== void 0 && isInView(self2.selectedDateElem) ? self2.selectedDateElem : self2.todayDateElem !== void 0 && isInView(self2.todayDateElem) ? self2.todayDateElem : getFirstAvailableDay(offset > 0 ? 1 : -1);
      if (startElem === void 0) {
        self2._input.focus();
      } else if (!dayFocused) {
        focusOnDayElem(startElem);
      } else {
        getNextAvailableDay(startElem, offset);
      }
    }
    function buildMonthDays(year, month) {
      var firstOfMonth = (new Date(year, month, 1).getDay() - self2.l10n.firstDayOfWeek + 7) % 7;
      var prevMonthDays = self2.utils.getDaysInMonth((month - 1 + 12) % 12, year);
      var daysInMonth = self2.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self2.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
      var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
      for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
      }
      for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
      }
      for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self2.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
        days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
      }
      var dayContainer = createElement("div", "dayContainer");
      dayContainer.appendChild(days);
      return dayContainer;
    }
    function buildDays() {
      if (self2.daysContainer === void 0) {
        return;
      }
      clearNode(self2.daysContainer);
      if (self2.weekNumbers)
        clearNode(self2.weekNumbers);
      var frag = document.createDocumentFragment();
      for (var i = 0; i < self2.config.showMonths; i++) {
        var d = new Date(self2.currentYear, self2.currentMonth, 1);
        d.setMonth(self2.currentMonth + i);
        frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
      }
      self2.daysContainer.appendChild(frag);
      self2.days = self2.daysContainer.firstChild;
      if (self2.config.mode === "range" && self2.selectedDates.length === 1) {
        onMouseOver();
      }
    }
    function buildMonthSwitch() {
      if (self2.config.showMonths > 1 || self2.config.monthSelectorType !== "dropdown")
        return;
      var shouldBuildMonth = function(month2) {
        if (self2.config.minDate !== void 0 && self2.currentYear === self2.config.minDate.getFullYear() && month2 < self2.config.minDate.getMonth()) {
          return false;
        }
        return !(self2.config.maxDate !== void 0 && self2.currentYear === self2.config.maxDate.getFullYear() && month2 > self2.config.maxDate.getMonth());
      };
      self2.monthsDropdownContainer.tabIndex = -1;
      self2.monthsDropdownContainer.innerHTML = "";
      for (var i = 0; i < 12; i++) {
        if (!shouldBuildMonth(i))
          continue;
        var month = createElement("option", "flatpickr-monthDropdown-month");
        month.value = new Date(self2.currentYear, i).getMonth().toString();
        month.textContent = monthToStr(i, self2.config.shorthandCurrentMonth, self2.l10n);
        month.tabIndex = -1;
        if (self2.currentMonth === i) {
          month.selected = true;
        }
        self2.monthsDropdownContainer.appendChild(month);
      }
    }
    function buildMonth() {
      var container = createElement("div", "flatpickr-month");
      var monthNavFragment = window.document.createDocumentFragment();
      var monthElement;
      if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
        monthElement = createElement("span", "cur-month");
      } else {
        self2.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
        self2.monthsDropdownContainer.setAttribute("aria-label", self2.l10n.monthAriaLabel);
        bind(self2.monthsDropdownContainer, "change", function(e) {
          var target = getEventTarget(e);
          var selectedMonth = parseInt(target.value, 10);
          self2.changeMonth(selectedMonth - self2.currentMonth);
          triggerEvent("onMonthChange");
        });
        buildMonthSwitch();
        monthElement = self2.monthsDropdownContainer;
      }
      var yearInput = createNumberInput("cur-year", { tabindex: "-1" });
      var yearElement = yearInput.getElementsByTagName("input")[0];
      yearElement.setAttribute("aria-label", self2.l10n.yearAriaLabel);
      if (self2.config.minDate) {
        yearElement.setAttribute("min", self2.config.minDate.getFullYear().toString());
      }
      if (self2.config.maxDate) {
        yearElement.setAttribute("max", self2.config.maxDate.getFullYear().toString());
        yearElement.disabled = !!self2.config.minDate && self2.config.minDate.getFullYear() === self2.config.maxDate.getFullYear();
      }
      var currentMonth = createElement("div", "flatpickr-current-month");
      currentMonth.appendChild(monthElement);
      currentMonth.appendChild(yearInput);
      monthNavFragment.appendChild(currentMonth);
      container.appendChild(monthNavFragment);
      return {
        container,
        yearElement,
        monthElement
      };
    }
    function buildMonths() {
      clearNode(self2.monthNav);
      self2.monthNav.appendChild(self2.prevMonthNav);
      if (self2.config.showMonths) {
        self2.yearElements = [];
        self2.monthElements = [];
      }
      for (var m = self2.config.showMonths; m--; ) {
        var month = buildMonth();
        self2.yearElements.push(month.yearElement);
        self2.monthElements.push(month.monthElement);
        self2.monthNav.appendChild(month.container);
      }
      self2.monthNav.appendChild(self2.nextMonthNav);
    }
    function buildMonthNav() {
      self2.monthNav = createElement("div", "flatpickr-months");
      self2.yearElements = [];
      self2.monthElements = [];
      self2.prevMonthNav = createElement("span", "flatpickr-prev-month");
      self2.prevMonthNav.innerHTML = self2.config.prevArrow;
      self2.nextMonthNav = createElement("span", "flatpickr-next-month");
      self2.nextMonthNav.innerHTML = self2.config.nextArrow;
      buildMonths();
      Object.defineProperty(self2, "_hidePrevMonthArrow", {
        get: function() {
          return self2.__hidePrevMonthArrow;
        },
        set: function(bool) {
          if (self2.__hidePrevMonthArrow !== bool) {
            toggleClass(self2.prevMonthNav, "flatpickr-disabled", bool);
            self2.__hidePrevMonthArrow = bool;
          }
        }
      });
      Object.defineProperty(self2, "_hideNextMonthArrow", {
        get: function() {
          return self2.__hideNextMonthArrow;
        },
        set: function(bool) {
          if (self2.__hideNextMonthArrow !== bool) {
            toggleClass(self2.nextMonthNav, "flatpickr-disabled", bool);
            self2.__hideNextMonthArrow = bool;
          }
        }
      });
      self2.currentYearElement = self2.yearElements[0];
      updateNavigationCurrentMonth();
      return self2.monthNav;
    }
    function buildTime() {
      self2.calendarContainer.classList.add("hasTime");
      if (self2.config.noCalendar)
        self2.calendarContainer.classList.add("noCalendar");
      var defaults2 = getDefaultHours(self2.config);
      self2.timeContainer = createElement("div", "flatpickr-time");
      self2.timeContainer.tabIndex = -1;
      var separator = createElement("span", "flatpickr-time-separator", ":");
      var hourInput = createNumberInput("flatpickr-hour", {
        "aria-label": self2.l10n.hourAriaLabel
      });
      self2.hourElement = hourInput.getElementsByTagName("input")[0];
      var minuteInput = createNumberInput("flatpickr-minute", {
        "aria-label": self2.l10n.minuteAriaLabel
      });
      self2.minuteElement = minuteInput.getElementsByTagName("input")[0];
      self2.hourElement.tabIndex = self2.minuteElement.tabIndex = -1;
      self2.hourElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getHours() : self2.config.time_24hr ? defaults2.hours : military2ampm(defaults2.hours));
      self2.minuteElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getMinutes() : defaults2.minutes);
      self2.hourElement.setAttribute("step", self2.config.hourIncrement.toString());
      self2.minuteElement.setAttribute("step", self2.config.minuteIncrement.toString());
      self2.hourElement.setAttribute("min", self2.config.time_24hr ? "0" : "1");
      self2.hourElement.setAttribute("max", self2.config.time_24hr ? "23" : "12");
      self2.hourElement.setAttribute("maxlength", "2");
      self2.minuteElement.setAttribute("min", "0");
      self2.minuteElement.setAttribute("max", "59");
      self2.minuteElement.setAttribute("maxlength", "2");
      self2.timeContainer.appendChild(hourInput);
      self2.timeContainer.appendChild(separator);
      self2.timeContainer.appendChild(minuteInput);
      if (self2.config.time_24hr)
        self2.timeContainer.classList.add("time24hr");
      if (self2.config.enableSeconds) {
        self2.timeContainer.classList.add("hasSeconds");
        var secondInput = createNumberInput("flatpickr-second");
        self2.secondElement = secondInput.getElementsByTagName("input")[0];
        self2.secondElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getSeconds() : defaults2.seconds);
        self2.secondElement.setAttribute("step", self2.minuteElement.getAttribute("step"));
        self2.secondElement.setAttribute("min", "0");
        self2.secondElement.setAttribute("max", "59");
        self2.secondElement.setAttribute("maxlength", "2");
        self2.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
        self2.timeContainer.appendChild(secondInput);
      }
      if (!self2.config.time_24hr) {
        self2.amPM = createElement("span", "flatpickr-am-pm", self2.l10n.amPM[int((self2.latestSelectedDateObj ? self2.hourElement.value : self2.config.defaultHour) > 11)]);
        self2.amPM.title = self2.l10n.toggleTitle;
        self2.amPM.tabIndex = -1;
        self2.timeContainer.appendChild(self2.amPM);
      }
      return self2.timeContainer;
    }
    function buildWeekdays() {
      if (!self2.weekdayContainer)
        self2.weekdayContainer = createElement("div", "flatpickr-weekdays");
      else
        clearNode(self2.weekdayContainer);
      for (var i = self2.config.showMonths; i--; ) {
        var container = createElement("div", "flatpickr-weekdaycontainer");
        self2.weekdayContainer.appendChild(container);
      }
      updateWeekdays();
      return self2.weekdayContainer;
    }
    function updateWeekdays() {
      if (!self2.weekdayContainer) {
        return;
      }
      var firstDayOfWeek = self2.l10n.firstDayOfWeek;
      var weekdays = __spreadArrays(self2.l10n.weekdays.shorthand);
      if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
        weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
      }
      for (var i = self2.config.showMonths; i--; ) {
        self2.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
      }
    }
    function buildWeeks() {
      self2.calendarContainer.classList.add("hasWeeks");
      var weekWrapper = createElement("div", "flatpickr-weekwrapper");
      weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self2.l10n.weekAbbreviation));
      var weekNumbers = createElement("div", "flatpickr-weeks");
      weekWrapper.appendChild(weekNumbers);
      return {
        weekWrapper,
        weekNumbers
      };
    }
    function changeMonth(value, isOffset) {
      if (isOffset === void 0) {
        isOffset = true;
      }
      var delta = isOffset ? value : value - self2.currentMonth;
      if (delta < 0 && self2._hidePrevMonthArrow === true || delta > 0 && self2._hideNextMonthArrow === true)
        return;
      self2.currentMonth += delta;
      if (self2.currentMonth < 0 || self2.currentMonth > 11) {
        self2.currentYear += self2.currentMonth > 11 ? 1 : -1;
        self2.currentMonth = (self2.currentMonth + 12) % 12;
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      buildDays();
      triggerEvent("onMonthChange");
      updateNavigationCurrentMonth();
    }
    function clear(triggerChangeEvent, toInitial) {
      if (triggerChangeEvent === void 0) {
        triggerChangeEvent = true;
      }
      if (toInitial === void 0) {
        toInitial = true;
      }
      self2.input.value = "";
      if (self2.altInput !== void 0)
        self2.altInput.value = "";
      if (self2.mobileInput !== void 0)
        self2.mobileInput.value = "";
      self2.selectedDates = [];
      self2.latestSelectedDateObj = void 0;
      if (toInitial === true) {
        self2.currentYear = self2._initialDate.getFullYear();
        self2.currentMonth = self2._initialDate.getMonth();
      }
      if (self2.config.enableTime === true) {
        var _a = getDefaultHours(self2.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
        setHours(hours, minutes, seconds);
      }
      self2.redraw();
      if (triggerChangeEvent)
        triggerEvent("onChange");
    }
    function close() {
      self2.isOpen = false;
      if (!self2.isMobile) {
        if (self2.calendarContainer !== void 0) {
          self2.calendarContainer.classList.remove("open");
        }
        if (self2._input !== void 0) {
          self2._input.classList.remove("active");
        }
      }
      triggerEvent("onClose");
    }
    function destroy() {
      if (self2.config !== void 0)
        triggerEvent("onDestroy");
      for (var i = self2._handlers.length; i--; ) {
        self2._handlers[i].remove();
      }
      self2._handlers = [];
      if (self2.mobileInput) {
        if (self2.mobileInput.parentNode)
          self2.mobileInput.parentNode.removeChild(self2.mobileInput);
        self2.mobileInput = void 0;
      } else if (self2.calendarContainer && self2.calendarContainer.parentNode) {
        if (self2.config.static && self2.calendarContainer.parentNode) {
          var wrapper = self2.calendarContainer.parentNode;
          wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
          if (wrapper.parentNode) {
            while (wrapper.firstChild)
              wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.parentNode.removeChild(wrapper);
          }
        } else
          self2.calendarContainer.parentNode.removeChild(self2.calendarContainer);
      }
      if (self2.altInput) {
        self2.input.type = "text";
        if (self2.altInput.parentNode)
          self2.altInput.parentNode.removeChild(self2.altInput);
        delete self2.altInput;
      }
      if (self2.input) {
        self2.input.type = self2.input._type;
        self2.input.classList.remove("flatpickr-input");
        self2.input.removeAttribute("readonly");
      }
      [
        "_showTimeInput",
        "latestSelectedDateObj",
        "_hideNextMonthArrow",
        "_hidePrevMonthArrow",
        "__hideNextMonthArrow",
        "__hidePrevMonthArrow",
        "isMobile",
        "isOpen",
        "selectedDateElem",
        "minDateHasTime",
        "maxDateHasTime",
        "days",
        "daysContainer",
        "_input",
        "_positionElement",
        "innerContainer",
        "rContainer",
        "monthNav",
        "todayDateElem",
        "calendarContainer",
        "weekdayContainer",
        "prevMonthNav",
        "nextMonthNav",
        "monthsDropdownContainer",
        "currentMonthElement",
        "currentYearElement",
        "navigationCurrentMonth",
        "selectedDateElem",
        "config"
      ].forEach(function(k) {
        try {
          delete self2[k];
        } catch (_) {
        }
      });
    }
    function isCalendarElem(elem) {
      return self2.calendarContainer.contains(elem);
    }
    function documentClick(e) {
      if (self2.isOpen && !self2.config.inline) {
        var eventTarget_1 = getEventTarget(e);
        var isCalendarElement = isCalendarElem(eventTarget_1);
        var isInput = eventTarget_1 === self2.input || eventTarget_1 === self2.altInput || self2.element.contains(eventTarget_1) || e.path && e.path.indexOf && (~e.path.indexOf(self2.input) || ~e.path.indexOf(self2.altInput));
        var lostFocus = !isInput && !isCalendarElement && !isCalendarElem(e.relatedTarget);
        var isIgnored = !self2.config.ignoredFocusElements.some(function(elem) {
          return elem.contains(eventTarget_1);
        });
        if (lostFocus && isIgnored) {
          if (self2.config.allowInput) {
            self2.setDate(self2._input.value, false, self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
          }
          if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0 && self2.input.value !== "" && self2.input.value !== void 0) {
            updateTime();
          }
          self2.close();
          if (self2.config && self2.config.mode === "range" && self2.selectedDates.length === 1)
            self2.clear(false);
        }
      }
    }
    function changeYear(newYear) {
      if (!newYear || self2.config.minDate && newYear < self2.config.minDate.getFullYear() || self2.config.maxDate && newYear > self2.config.maxDate.getFullYear())
        return;
      var newYearNum = newYear, isNewYear = self2.currentYear !== newYearNum;
      self2.currentYear = newYearNum || self2.currentYear;
      if (self2.config.maxDate && self2.currentYear === self2.config.maxDate.getFullYear()) {
        self2.currentMonth = Math.min(self2.config.maxDate.getMonth(), self2.currentMonth);
      } else if (self2.config.minDate && self2.currentYear === self2.config.minDate.getFullYear()) {
        self2.currentMonth = Math.max(self2.config.minDate.getMonth(), self2.currentMonth);
      }
      if (isNewYear) {
        self2.redraw();
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
    }
    function isEnabled(date, timeless) {
      var _a;
      if (timeless === void 0) {
        timeless = true;
      }
      var dateToCheck = self2.parseDate(date, void 0, timeless);
      if (self2.config.minDate && dateToCheck && compareDates(dateToCheck, self2.config.minDate, timeless !== void 0 ? timeless : !self2.minDateHasTime) < 0 || self2.config.maxDate && dateToCheck && compareDates(dateToCheck, self2.config.maxDate, timeless !== void 0 ? timeless : !self2.maxDateHasTime) > 0)
        return false;
      if (!self2.config.enable && self2.config.disable.length === 0)
        return true;
      if (dateToCheck === void 0)
        return false;
      var bool = !!self2.config.enable, array = (_a = self2.config.enable) !== null && _a !== void 0 ? _a : self2.config.disable;
      for (var i = 0, d = void 0; i < array.length; i++) {
        d = array[i];
        if (typeof d === "function" && d(dateToCheck))
          return bool;
        else if (d instanceof Date && dateToCheck !== void 0 && d.getTime() === dateToCheck.getTime())
          return bool;
        else if (typeof d === "string") {
          var parsed = self2.parseDate(d, void 0, true);
          return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
        } else if (typeof d === "object" && dateToCheck !== void 0 && d.from && d.to && dateToCheck.getTime() >= d.from.getTime() && dateToCheck.getTime() <= d.to.getTime())
          return bool;
      }
      return !bool;
    }
    function isInView(elem) {
      if (self2.daysContainer !== void 0)
        return elem.className.indexOf("hidden") === -1 && elem.className.indexOf("flatpickr-disabled") === -1 && self2.daysContainer.contains(elem);
      return false;
    }
    function onBlur(e) {
      var isInput = e.target === self2._input;
      var valueChanged = self2._input.value.trimEnd() !== getDateStr();
      if (isInput && valueChanged && !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
        self2.setDate(self2._input.value, true, e.target === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
      }
    }
    function onKeyDown(e) {
      var eventTarget = getEventTarget(e);
      var isInput = self2.config.wrap ? element.contains(eventTarget) : eventTarget === self2._input;
      var allowInput = self2.config.allowInput;
      var allowKeydown = self2.isOpen && (!allowInput || !isInput);
      var allowInlineKeydown = self2.config.inline && isInput && !allowInput;
      if (e.keyCode === 13 && isInput) {
        if (allowInput) {
          self2.setDate(self2._input.value, true, eventTarget === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
          self2.close();
          return eventTarget.blur();
        } else {
          self2.open();
        }
      } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
        var isTimeObj = !!self2.timeContainer && self2.timeContainer.contains(eventTarget);
        switch (e.keyCode) {
          case 13:
            if (isTimeObj) {
              e.preventDefault();
              updateTime();
              focusAndClose();
            } else
              selectDate(e);
            break;
          case 27:
            e.preventDefault();
            focusAndClose();
            break;
          case 8:
          case 46:
            if (isInput && !self2.config.allowInput) {
              e.preventDefault();
              self2.clear();
            }
            break;
          case 37:
          case 39:
            if (!isTimeObj && !isInput) {
              e.preventDefault();
              var activeElement = getClosestActiveElement();
              if (self2.daysContainer !== void 0 && (allowInput === false || activeElement && isInView(activeElement))) {
                var delta_1 = e.keyCode === 39 ? 1 : -1;
                if (!e.ctrlKey)
                  focusOnDay(void 0, delta_1);
                else {
                  e.stopPropagation();
                  changeMonth(delta_1);
                  focusOnDay(getFirstAvailableDay(1), 0);
                }
              }
            } else if (self2.hourElement)
              self2.hourElement.focus();
            break;
          case 38:
          case 40:
            e.preventDefault();
            var delta = e.keyCode === 40 ? 1 : -1;
            if (self2.daysContainer && eventTarget.$i !== void 0 || eventTarget === self2.input || eventTarget === self2.altInput) {
              if (e.ctrlKey) {
                e.stopPropagation();
                changeYear(self2.currentYear - delta);
                focusOnDay(getFirstAvailableDay(1), 0);
              } else if (!isTimeObj)
                focusOnDay(void 0, delta * 7);
            } else if (eventTarget === self2.currentYearElement) {
              changeYear(self2.currentYear - delta);
            } else if (self2.config.enableTime) {
              if (!isTimeObj && self2.hourElement)
                self2.hourElement.focus();
              updateTime(e);
              self2._debouncedChange();
            }
            break;
          case 9:
            if (isTimeObj) {
              var elems = [
                self2.hourElement,
                self2.minuteElement,
                self2.secondElement,
                self2.amPM
              ].concat(self2.pluginElements).filter(function(x) {
                return x;
              });
              var i = elems.indexOf(eventTarget);
              if (i !== -1) {
                var target = elems[i + (e.shiftKey ? -1 : 1)];
                e.preventDefault();
                (target || self2._input).focus();
              }
            } else if (!self2.config.noCalendar && self2.daysContainer && self2.daysContainer.contains(eventTarget) && e.shiftKey) {
              e.preventDefault();
              self2._input.focus();
            }
            break;
          default:
            break;
        }
      }
      if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
        switch (e.key) {
          case self2.l10n.amPM[0].charAt(0):
          case self2.l10n.amPM[0].charAt(0).toLowerCase():
            self2.amPM.textContent = self2.l10n.amPM[0];
            setHoursFromInputs();
            updateValue();
            break;
          case self2.l10n.amPM[1].charAt(0):
          case self2.l10n.amPM[1].charAt(0).toLowerCase():
            self2.amPM.textContent = self2.l10n.amPM[1];
            setHoursFromInputs();
            updateValue();
            break;
        }
      }
      if (isInput || isCalendarElem(eventTarget)) {
        triggerEvent("onKeyDown", e);
      }
    }
    function onMouseOver(elem, cellClass) {
      if (cellClass === void 0) {
        cellClass = "flatpickr-day";
      }
      if (self2.selectedDates.length !== 1 || elem && (!elem.classList.contains(cellClass) || elem.classList.contains("flatpickr-disabled")))
        return;
      var hoverDate = elem ? elem.dateObj.getTime() : self2.days.firstElementChild.dateObj.getTime(), initialDate = self2.parseDate(self2.selectedDates[0], void 0, true).getTime(), rangeStartDate = Math.min(hoverDate, self2.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self2.selectedDates[0].getTime());
      var containsDisabled = false;
      var minRange = 0, maxRange = 0;
      for (var t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
        if (!isEnabled(new Date(t), true)) {
          containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
          if (t < initialDate && (!minRange || t > minRange))
            minRange = t;
          else if (t > initialDate && (!maxRange || t < maxRange))
            maxRange = t;
        }
      }
      var hoverableCells = Array.from(self2.rContainer.querySelectorAll("*:nth-child(-n+" + self2.config.showMonths + ") > ." + cellClass));
      hoverableCells.forEach(function(dayElem) {
        var date = dayElem.dateObj;
        var timestamp = date.getTime();
        var outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
        if (outOfRange) {
          dayElem.classList.add("notAllowed");
          ["inRange", "startRange", "endRange"].forEach(function(c) {
            dayElem.classList.remove(c);
          });
          return;
        } else if (containsDisabled && !outOfRange)
          return;
        ["startRange", "inRange", "endRange", "notAllowed"].forEach(function(c) {
          dayElem.classList.remove(c);
        });
        if (elem !== void 0) {
          elem.classList.add(hoverDate <= self2.selectedDates[0].getTime() ? "startRange" : "endRange");
          if (initialDate < hoverDate && timestamp === initialDate)
            dayElem.classList.add("startRange");
          else if (initialDate > hoverDate && timestamp === initialDate)
            dayElem.classList.add("endRange");
          if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && isBetween(timestamp, initialDate, hoverDate))
            dayElem.classList.add("inRange");
        }
      });
    }
    function onResize() {
      if (self2.isOpen && !self2.config.static && !self2.config.inline)
        positionCalendar();
    }
    function open(e, positionElement) {
      if (positionElement === void 0) {
        positionElement = self2._positionElement;
      }
      if (self2.isMobile === true) {
        if (e) {
          e.preventDefault();
          var eventTarget = getEventTarget(e);
          if (eventTarget) {
            eventTarget.blur();
          }
        }
        if (self2.mobileInput !== void 0) {
          self2.mobileInput.focus();
          self2.mobileInput.click();
        }
        triggerEvent("onOpen");
        return;
      } else if (self2._input.disabled || self2.config.inline) {
        return;
      }
      var wasOpen = self2.isOpen;
      self2.isOpen = true;
      if (!wasOpen) {
        self2.calendarContainer.classList.add("open");
        self2._input.classList.add("active");
        triggerEvent("onOpen");
        positionCalendar(positionElement);
      }
      if (self2.config.enableTime === true && self2.config.noCalendar === true) {
        if (self2.config.allowInput === false && (e === void 0 || !self2.timeContainer.contains(e.relatedTarget))) {
          setTimeout(function() {
            return self2.hourElement.select();
          }, 50);
        }
      }
    }
    function minMaxDateSetter(type) {
      return function(date) {
        var dateObj = self2.config["_" + type + "Date"] = self2.parseDate(date, self2.config.dateFormat);
        var inverseDateObj = self2.config["_" + (type === "min" ? "max" : "min") + "Date"];
        if (dateObj !== void 0) {
          self2[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
        }
        if (self2.selectedDates) {
          self2.selectedDates = self2.selectedDates.filter(function(d) {
            return isEnabled(d);
          });
          if (!self2.selectedDates.length && type === "min")
            setHoursFromDate(dateObj);
          updateValue();
        }
        if (self2.daysContainer) {
          redraw();
          if (dateObj !== void 0)
            self2.currentYearElement[type] = dateObj.getFullYear().toString();
          else
            self2.currentYearElement.removeAttribute(type);
          self2.currentYearElement.disabled = !!inverseDateObj && dateObj !== void 0 && inverseDateObj.getFullYear() === dateObj.getFullYear();
        }
      };
    }
    function parseConfig() {
      var boolOpts = [
        "wrap",
        "weekNumbers",
        "allowInput",
        "allowInvalidPreload",
        "clickOpens",
        "time_24hr",
        "enableTime",
        "noCalendar",
        "altInput",
        "shorthandCurrentMonth",
        "inline",
        "static",
        "enableSeconds",
        "disableMobile"
      ];
      var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
      var formats2 = {};
      self2.config.parseDate = userConfig.parseDate;
      self2.config.formatDate = userConfig.formatDate;
      Object.defineProperty(self2.config, "enable", {
        get: function() {
          return self2.config._enable;
        },
        set: function(dates) {
          self2.config._enable = parseDateRules(dates);
        }
      });
      Object.defineProperty(self2.config, "disable", {
        get: function() {
          return self2.config._disable;
        },
        set: function(dates) {
          self2.config._disable = parseDateRules(dates);
        }
      });
      var timeMode = userConfig.mode === "time";
      if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
        var defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
        formats2.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
      }
      if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
        var defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
        formats2.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
      }
      Object.defineProperty(self2.config, "minDate", {
        get: function() {
          return self2.config._minDate;
        },
        set: minMaxDateSetter("min")
      });
      Object.defineProperty(self2.config, "maxDate", {
        get: function() {
          return self2.config._maxDate;
        },
        set: minMaxDateSetter("max")
      });
      var minMaxTimeSetter = function(type) {
        return function(val) {
          self2.config[type === "min" ? "_minTime" : "_maxTime"] = self2.parseDate(val, "H:i:S");
        };
      };
      Object.defineProperty(self2.config, "minTime", {
        get: function() {
          return self2.config._minTime;
        },
        set: minMaxTimeSetter("min")
      });
      Object.defineProperty(self2.config, "maxTime", {
        get: function() {
          return self2.config._maxTime;
        },
        set: minMaxTimeSetter("max")
      });
      if (userConfig.mode === "time") {
        self2.config.noCalendar = true;
        self2.config.enableTime = true;
      }
      Object.assign(self2.config, formats2, userConfig);
      for (var i = 0; i < boolOpts.length; i++)
        self2.config[boolOpts[i]] = self2.config[boolOpts[i]] === true || self2.config[boolOpts[i]] === "true";
      HOOKS.filter(function(hook) {
        return self2.config[hook] !== void 0;
      }).forEach(function(hook) {
        self2.config[hook] = arrayify(self2.config[hook] || []).map(bindToInstance);
      });
      self2.isMobile = !self2.config.disableMobile && !self2.config.inline && self2.config.mode === "single" && !self2.config.disable.length && !self2.config.enable && !self2.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      for (var i = 0; i < self2.config.plugins.length; i++) {
        var pluginConf = self2.config.plugins[i](self2) || {};
        for (var key in pluginConf) {
          if (HOOKS.indexOf(key) > -1) {
            self2.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self2.config[key]);
          } else if (typeof userConfig[key] === "undefined")
            self2.config[key] = pluginConf[key];
        }
      }
      if (!userConfig.altInputClass) {
        self2.config.altInputClass = getInputElem().className + " " + self2.config.altInputClass;
      }
      triggerEvent("onParseConfig");
    }
    function getInputElem() {
      return self2.config.wrap ? element.querySelector("[data-input]") : element;
    }
    function setupLocale() {
      if (typeof self2.config.locale !== "object" && typeof flatpickr.l10ns[self2.config.locale] === "undefined")
        self2.config.errorHandler(new Error("flatpickr: invalid locale " + self2.config.locale));
      self2.l10n = __assign(__assign({}, flatpickr.l10ns.default), typeof self2.config.locale === "object" ? self2.config.locale : self2.config.locale !== "default" ? flatpickr.l10ns[self2.config.locale] : void 0);
      tokenRegex.D = "(" + self2.l10n.weekdays.shorthand.join("|") + ")";
      tokenRegex.l = "(" + self2.l10n.weekdays.longhand.join("|") + ")";
      tokenRegex.M = "(" + self2.l10n.months.shorthand.join("|") + ")";
      tokenRegex.F = "(" + self2.l10n.months.longhand.join("|") + ")";
      tokenRegex.K = "(" + self2.l10n.amPM[0] + "|" + self2.l10n.amPM[1] + "|" + self2.l10n.amPM[0].toLowerCase() + "|" + self2.l10n.amPM[1].toLowerCase() + ")";
      var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
      if (userConfig.time_24hr === void 0 && flatpickr.defaultConfig.time_24hr === void 0) {
        self2.config.time_24hr = self2.l10n.time_24hr;
      }
      self2.formatDate = createDateFormatter(self2);
      self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
    }
    function positionCalendar(customPositionElement) {
      if (typeof self2.config.position === "function") {
        return void self2.config.position(self2, customPositionElement);
      }
      if (self2.calendarContainer === void 0)
        return;
      triggerEvent("onPreCalendarPosition");
      var positionElement = customPositionElement || self2._positionElement;
      var calendarHeight = Array.prototype.reduce.call(self2.calendarContainer.children, function(acc, child) {
        return acc + child.offsetHeight;
      }, 0), calendarWidth = self2.calendarContainer.offsetWidth, configPos = self2.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
      var top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
      toggleClass(self2.calendarContainer, "arrowTop", !showOnTop);
      toggleClass(self2.calendarContainer, "arrowBottom", showOnTop);
      if (self2.config.inline)
        return;
      var left = window.pageXOffset + inputBounds.left;
      var isCenter = false;
      var isRight = false;
      if (configPosHorizontal === "center") {
        left -= (calendarWidth - inputBounds.width) / 2;
        isCenter = true;
      } else if (configPosHorizontal === "right") {
        left -= calendarWidth - inputBounds.width;
        isRight = true;
      }
      toggleClass(self2.calendarContainer, "arrowLeft", !isCenter && !isRight);
      toggleClass(self2.calendarContainer, "arrowCenter", isCenter);
      toggleClass(self2.calendarContainer, "arrowRight", isRight);
      var right = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
      var rightMost = left + calendarWidth > window.document.body.offsetWidth;
      var centerMost = right + calendarWidth > window.document.body.offsetWidth;
      toggleClass(self2.calendarContainer, "rightMost", rightMost);
      if (self2.config.static)
        return;
      self2.calendarContainer.style.top = top + "px";
      if (!rightMost) {
        self2.calendarContainer.style.left = left + "px";
        self2.calendarContainer.style.right = "auto";
      } else if (!centerMost) {
        self2.calendarContainer.style.left = "auto";
        self2.calendarContainer.style.right = right + "px";
      } else {
        var doc = getDocumentStyleSheet();
        if (doc === void 0)
          return;
        var bodyWidth = window.document.body.offsetWidth;
        var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
        var centerBefore = ".flatpickr-calendar.centerMost:before";
        var centerAfter = ".flatpickr-calendar.centerMost:after";
        var centerIndex = doc.cssRules.length;
        var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
        toggleClass(self2.calendarContainer, "rightMost", false);
        toggleClass(self2.calendarContainer, "centerMost", true);
        doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
        self2.calendarContainer.style.left = centerLeft + "px";
        self2.calendarContainer.style.right = "auto";
      }
    }
    function getDocumentStyleSheet() {
      var editableSheet = null;
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (!sheet.cssRules)
          continue;
        try {
          sheet.cssRules;
        } catch (err) {
          continue;
        }
        editableSheet = sheet;
        break;
      }
      return editableSheet != null ? editableSheet : createStyleSheet();
    }
    function createStyleSheet() {
      var style = document.createElement("style");
      document.head.appendChild(style);
      return style.sheet;
    }
    function redraw() {
      if (self2.config.noCalendar || self2.isMobile)
        return;
      buildMonthSwitch();
      updateNavigationCurrentMonth();
      buildDays();
    }
    function focusAndClose() {
      self2._input.focus();
      if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== void 0) {
        setTimeout(self2.close, 0);
      } else {
        self2.close();
      }
    }
    function selectDate(e) {
      e.preventDefault();
      e.stopPropagation();
      var isSelectable = function(day) {
        return day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
      };
      var t = findParent(getEventTarget(e), isSelectable);
      if (t === void 0)
        return;
      var target = t;
      var selectedDate = self2.latestSelectedDateObj = new Date(target.dateObj.getTime());
      var shouldChangeMonth = (selectedDate.getMonth() < self2.currentMonth || selectedDate.getMonth() > self2.currentMonth + self2.config.showMonths - 1) && self2.config.mode !== "range";
      self2.selectedDateElem = target;
      if (self2.config.mode === "single")
        self2.selectedDates = [selectedDate];
      else if (self2.config.mode === "multiple") {
        var selectedIndex = isDateSelected(selectedDate);
        if (selectedIndex)
          self2.selectedDates.splice(parseInt(selectedIndex), 1);
        else
          self2.selectedDates.push(selectedDate);
      } else if (self2.config.mode === "range") {
        if (self2.selectedDates.length === 2) {
          self2.clear(false, false);
        }
        self2.latestSelectedDateObj = selectedDate;
        self2.selectedDates.push(selectedDate);
        if (compareDates(selectedDate, self2.selectedDates[0], true) !== 0)
          self2.selectedDates.sort(function(a, b) {
            return a.getTime() - b.getTime();
          });
      }
      setHoursFromInputs();
      if (shouldChangeMonth) {
        var isNewYear = self2.currentYear !== selectedDate.getFullYear();
        self2.currentYear = selectedDate.getFullYear();
        self2.currentMonth = selectedDate.getMonth();
        if (isNewYear) {
          triggerEvent("onYearChange");
          buildMonthSwitch();
        }
        triggerEvent("onMonthChange");
      }
      updateNavigationCurrentMonth();
      buildDays();
      updateValue();
      if (!shouldChangeMonth && self2.config.mode !== "range" && self2.config.showMonths === 1)
        focusOnDayElem(target);
      else if (self2.selectedDateElem !== void 0 && self2.hourElement === void 0) {
        self2.selectedDateElem && self2.selectedDateElem.focus();
      }
      if (self2.hourElement !== void 0)
        self2.hourElement !== void 0 && self2.hourElement.focus();
      if (self2.config.closeOnSelect) {
        var single = self2.config.mode === "single" && !self2.config.enableTime;
        var range = self2.config.mode === "range" && self2.selectedDates.length === 2 && !self2.config.enableTime;
        if (single || range) {
          focusAndClose();
        }
      }
      triggerChange();
    }
    var CALLBACKS = {
      locale: [setupLocale, updateWeekdays],
      showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
      minDate: [jumpToDate],
      maxDate: [jumpToDate],
      positionElement: [updatePositionElement],
      clickOpens: [
        function() {
          if (self2.config.clickOpens === true) {
            bind(self2._input, "focus", self2.open);
            bind(self2._input, "click", self2.open);
          } else {
            self2._input.removeEventListener("focus", self2.open);
            self2._input.removeEventListener("click", self2.open);
          }
        }
      ]
    };
    function set(option, value) {
      if (option !== null && typeof option === "object") {
        Object.assign(self2.config, option);
        for (var key in option) {
          if (CALLBACKS[key] !== void 0)
            CALLBACKS[key].forEach(function(x) {
              return x();
            });
        }
      } else {
        self2.config[option] = value;
        if (CALLBACKS[option] !== void 0)
          CALLBACKS[option].forEach(function(x) {
            return x();
          });
        else if (HOOKS.indexOf(option) > -1)
          self2.config[option] = arrayify(value);
      }
      self2.redraw();
      updateValue(true);
    }
    function setSelectedDate(inputDate, format) {
      var dates = [];
      if (inputDate instanceof Array)
        dates = inputDate.map(function(d) {
          return self2.parseDate(d, format);
        });
      else if (inputDate instanceof Date || typeof inputDate === "number")
        dates = [self2.parseDate(inputDate, format)];
      else if (typeof inputDate === "string") {
        switch (self2.config.mode) {
          case "single":
          case "time":
            dates = [self2.parseDate(inputDate, format)];
            break;
          case "multiple":
            dates = inputDate.split(self2.config.conjunction).map(function(date) {
              return self2.parseDate(date, format);
            });
            break;
          case "range":
            dates = inputDate.split(self2.l10n.rangeSeparator).map(function(date) {
              return self2.parseDate(date, format);
            });
            break;
          default:
            break;
        }
      } else
        self2.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
      self2.selectedDates = self2.config.allowInvalidPreload ? dates : dates.filter(function(d) {
        return d instanceof Date && isEnabled(d, false);
      });
      if (self2.config.mode === "range")
        self2.selectedDates.sort(function(a, b) {
          return a.getTime() - b.getTime();
        });
    }
    function setDate(date, triggerChange2, format) {
      if (triggerChange2 === void 0) {
        triggerChange2 = false;
      }
      if (format === void 0) {
        format = self2.config.dateFormat;
      }
      if (date !== 0 && !date || date instanceof Array && date.length === 0)
        return self2.clear(triggerChange2);
      setSelectedDate(date, format);
      self2.latestSelectedDateObj = self2.selectedDates[self2.selectedDates.length - 1];
      self2.redraw();
      jumpToDate(void 0, triggerChange2);
      setHoursFromDate();
      if (self2.selectedDates.length === 0) {
        self2.clear(false);
      }
      updateValue(triggerChange2);
      if (triggerChange2)
        triggerEvent("onChange");
    }
    function parseDateRules(arr) {
      return arr.slice().map(function(rule) {
        if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
          return self2.parseDate(rule, void 0, true);
        } else if (rule && typeof rule === "object" && rule.from && rule.to)
          return {
            from: self2.parseDate(rule.from, void 0),
            to: self2.parseDate(rule.to, void 0)
          };
        return rule;
      }).filter(function(x) {
        return x;
      });
    }
    function setupDates() {
      self2.selectedDates = [];
      self2.now = self2.parseDate(self2.config.now) || new Date();
      var preloadedDate = self2.config.defaultDate || ((self2.input.nodeName === "INPUT" || self2.input.nodeName === "TEXTAREA") && self2.input.placeholder && self2.input.value === self2.input.placeholder ? null : self2.input.value);
      if (preloadedDate)
        setSelectedDate(preloadedDate, self2.config.dateFormat);
      self2._initialDate = self2.selectedDates.length > 0 ? self2.selectedDates[0] : self2.config.minDate && self2.config.minDate.getTime() > self2.now.getTime() ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate.getTime() < self2.now.getTime() ? self2.config.maxDate : self2.now;
      self2.currentYear = self2._initialDate.getFullYear();
      self2.currentMonth = self2._initialDate.getMonth();
      if (self2.selectedDates.length > 0)
        self2.latestSelectedDateObj = self2.selectedDates[0];
      if (self2.config.minTime !== void 0)
        self2.config.minTime = self2.parseDate(self2.config.minTime, "H:i");
      if (self2.config.maxTime !== void 0)
        self2.config.maxTime = self2.parseDate(self2.config.maxTime, "H:i");
      self2.minDateHasTime = !!self2.config.minDate && (self2.config.minDate.getHours() > 0 || self2.config.minDate.getMinutes() > 0 || self2.config.minDate.getSeconds() > 0);
      self2.maxDateHasTime = !!self2.config.maxDate && (self2.config.maxDate.getHours() > 0 || self2.config.maxDate.getMinutes() > 0 || self2.config.maxDate.getSeconds() > 0);
    }
    function setupInputs() {
      self2.input = getInputElem();
      if (!self2.input) {
        self2.config.errorHandler(new Error("Invalid input element specified"));
        return;
      }
      self2.input._type = self2.input.type;
      self2.input.type = "text";
      self2.input.classList.add("flatpickr-input");
      self2._input = self2.input;
      if (self2.config.altInput) {
        self2.altInput = createElement(self2.input.nodeName, self2.config.altInputClass);
        self2._input = self2.altInput;
        self2.altInput.placeholder = self2.input.placeholder;
        self2.altInput.disabled = self2.input.disabled;
        self2.altInput.required = self2.input.required;
        self2.altInput.tabIndex = self2.input.tabIndex;
        self2.altInput.type = "text";
        self2.input.setAttribute("type", "hidden");
        if (!self2.config.static && self2.input.parentNode)
          self2.input.parentNode.insertBefore(self2.altInput, self2.input.nextSibling);
      }
      if (!self2.config.allowInput)
        self2._input.setAttribute("readonly", "readonly");
      updatePositionElement();
    }
    function updatePositionElement() {
      self2._positionElement = self2.config.positionElement || self2._input;
    }
    function setupMobile() {
      var inputType = self2.config.enableTime ? self2.config.noCalendar ? "time" : "datetime-local" : "date";
      self2.mobileInput = createElement("input", self2.input.className + " flatpickr-mobile");
      self2.mobileInput.tabIndex = 1;
      self2.mobileInput.type = inputType;
      self2.mobileInput.disabled = self2.input.disabled;
      self2.mobileInput.required = self2.input.required;
      self2.mobileInput.placeholder = self2.input.placeholder;
      self2.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";
      if (self2.selectedDates.length > 0) {
        self2.mobileInput.defaultValue = self2.mobileInput.value = self2.formatDate(self2.selectedDates[0], self2.mobileFormatStr);
      }
      if (self2.config.minDate)
        self2.mobileInput.min = self2.formatDate(self2.config.minDate, "Y-m-d");
      if (self2.config.maxDate)
        self2.mobileInput.max = self2.formatDate(self2.config.maxDate, "Y-m-d");
      if (self2.input.getAttribute("step"))
        self2.mobileInput.step = String(self2.input.getAttribute("step"));
      self2.input.type = "hidden";
      if (self2.altInput !== void 0)
        self2.altInput.type = "hidden";
      try {
        if (self2.input.parentNode)
          self2.input.parentNode.insertBefore(self2.mobileInput, self2.input.nextSibling);
      } catch (_a) {
      }
      bind(self2.mobileInput, "change", function(e) {
        self2.setDate(getEventTarget(e).value, false, self2.mobileFormatStr);
        triggerEvent("onChange");
        triggerEvent("onClose");
      });
    }
    function toggle2(e) {
      if (self2.isOpen === true)
        return self2.close();
      self2.open(e);
    }
    function triggerEvent(event, data) {
      if (self2.config === void 0)
        return;
      var hooks = self2.config[event];
      if (hooks !== void 0 && hooks.length > 0) {
        for (var i = 0; hooks[i] && i < hooks.length; i++)
          hooks[i](self2.selectedDates, self2.input.value, self2, data);
      }
      if (event === "onChange") {
        self2.input.dispatchEvent(createEvent("change"));
        self2.input.dispatchEvent(createEvent("input"));
      }
    }
    function createEvent(name) {
      var e = document.createEvent("Event");
      e.initEvent(name, true, true);
      return e;
    }
    function isDateSelected(date) {
      for (var i = 0; i < self2.selectedDates.length; i++) {
        var selectedDate = self2.selectedDates[i];
        if (selectedDate instanceof Date && compareDates(selectedDate, date) === 0)
          return "" + i;
      }
      return false;
    }
    function isDateInRange(date) {
      if (self2.config.mode !== "range" || self2.selectedDates.length < 2)
        return false;
      return compareDates(date, self2.selectedDates[0]) >= 0 && compareDates(date, self2.selectedDates[1]) <= 0;
    }
    function updateNavigationCurrentMonth() {
      if (self2.config.noCalendar || self2.isMobile || !self2.monthNav)
        return;
      self2.yearElements.forEach(function(yearElement, i) {
        var d = new Date(self2.currentYear, self2.currentMonth, 1);
        d.setMonth(self2.currentMonth + i);
        if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
          self2.monthElements[i].textContent = monthToStr(d.getMonth(), self2.config.shorthandCurrentMonth, self2.l10n) + " ";
        } else {
          self2.monthsDropdownContainer.value = d.getMonth().toString();
        }
        yearElement.value = d.getFullYear().toString();
      });
      self2._hidePrevMonthArrow = self2.config.minDate !== void 0 && (self2.currentYear === self2.config.minDate.getFullYear() ? self2.currentMonth <= self2.config.minDate.getMonth() : self2.currentYear < self2.config.minDate.getFullYear());
      self2._hideNextMonthArrow = self2.config.maxDate !== void 0 && (self2.currentYear === self2.config.maxDate.getFullYear() ? self2.currentMonth + 1 > self2.config.maxDate.getMonth() : self2.currentYear > self2.config.maxDate.getFullYear());
    }
    function getDateStr(specificFormat) {
      var format = specificFormat || (self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
      return self2.selectedDates.map(function(dObj) {
        return self2.formatDate(dObj, format);
      }).filter(function(d, i, arr) {
        return self2.config.mode !== "range" || self2.config.enableTime || arr.indexOf(d) === i;
      }).join(self2.config.mode !== "range" ? self2.config.conjunction : self2.l10n.rangeSeparator);
    }
    function updateValue(triggerChange2) {
      if (triggerChange2 === void 0) {
        triggerChange2 = true;
      }
      if (self2.mobileInput !== void 0 && self2.mobileFormatStr) {
        self2.mobileInput.value = self2.latestSelectedDateObj !== void 0 ? self2.formatDate(self2.latestSelectedDateObj, self2.mobileFormatStr) : "";
      }
      self2.input.value = getDateStr(self2.config.dateFormat);
      if (self2.altInput !== void 0) {
        self2.altInput.value = getDateStr(self2.config.altFormat);
      }
      if (triggerChange2 !== false)
        triggerEvent("onValueUpdate");
    }
    function onMonthNavClick(e) {
      var eventTarget = getEventTarget(e);
      var isPrevMonth = self2.prevMonthNav.contains(eventTarget);
      var isNextMonth = self2.nextMonthNav.contains(eventTarget);
      if (isPrevMonth || isNextMonth) {
        changeMonth(isPrevMonth ? -1 : 1);
      } else if (self2.yearElements.indexOf(eventTarget) >= 0) {
        eventTarget.select();
      } else if (eventTarget.classList.contains("arrowUp")) {
        self2.changeYear(self2.currentYear + 1);
      } else if (eventTarget.classList.contains("arrowDown")) {
        self2.changeYear(self2.currentYear - 1);
      }
    }
    function timeWrapper(e) {
      e.preventDefault();
      var isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
      if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
        self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
      }
      var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
      var newValue = curValue + step * delta;
      if (typeof input.value !== "undefined" && input.value.length === 2) {
        var isHourElem = input === self2.hourElement, isMinuteElem = input === self2.minuteElement;
        if (newValue < min) {
          newValue = max + newValue + int(!isHourElem) + (int(isHourElem) && int(!self2.amPM));
          if (isMinuteElem)
            incrementNumInput(void 0, -1, self2.hourElement);
        } else if (newValue > max) {
          newValue = input === self2.hourElement ? newValue - max - int(!self2.amPM) : min;
          if (isMinuteElem)
            incrementNumInput(void 0, 1, self2.hourElement);
        }
        if (self2.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
          self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
        }
        input.value = pad(newValue);
      }
    }
    init();
    return self2;
  }
  function _flatpickr(nodeList, config) {
    var nodes = Array.prototype.slice.call(nodeList).filter(function(x) {
      return x instanceof HTMLElement;
    });
    var instances = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      try {
        if (node.getAttribute("data-fp-omit") !== null)
          continue;
        if (node._flatpickr !== void 0) {
          node._flatpickr.destroy();
          node._flatpickr = void 0;
        }
        node._flatpickr = FlatpickrInstance(node, config || {});
        instances.push(node._flatpickr);
      } catch (e) {
        console.error(e);
      }
    }
    return instances.length === 1 ? instances[0] : instances;
  }
  if (typeof HTMLElement !== "undefined" && typeof HTMLCollection !== "undefined" && typeof NodeList !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(config) {
      return _flatpickr(this, config);
    };
    HTMLElement.prototype.flatpickr = function(config) {
      return _flatpickr([this], config);
    };
  }
  var flatpickr = function(selector, config) {
    if (typeof selector === "string") {
      return _flatpickr(window.document.querySelectorAll(selector), config);
    } else if (selector instanceof Node) {
      return _flatpickr([selector], config);
    } else {
      return _flatpickr(selector, config);
    }
  };
  flatpickr.defaultConfig = {};
  flatpickr.l10ns = {
    en: __assign({}, default_default),
    default: __assign({}, default_default)
  };
  flatpickr.localize = function(l10n) {
    flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
  };
  flatpickr.setDefaults = function(config) {
    flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
  };
  flatpickr.parseDate = createDateParser({});
  flatpickr.formatDate = createDateFormatter({});
  flatpickr.compareDates = compareDates;
  if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
    jQuery.fn.flatpickr = function(config) {
      return _flatpickr(this, config);
    };
  }
  Date.prototype.fp_incr = function(days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
  };
  if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
  }
  var esm_default = flatpickr;

  // app/javascript/controllers/date_filter_controller.js
  var date_filter_controller_default = class extends Controller {
    constructor() {
      super(...arguments);
      __publicField(this, "pickerOptions", {
        onChange: this.pickerOnChange
      });
    }
    get filterId() {
      return this.filterContainer.dataset.filterId;
    }
    get filterContainer() {
      return this.context.element.closest("[data-filter-id]");
    }
    get conditionTarget() {
      var _a;
      return (_a = this.filterContainer) == null ? void 0 : _a.querySelector("[data-control='condition'");
    }
    get pickerModeFromCondition() {
      return this.conditionTarget.value === "is_within" ? "range" : "single";
    }
    connect() {
      this.initFlatpickr();
    }
    initFlatpickr(extraOptions = {}) {
      const options = {
        mode: this.pickerModeFromCondition
      };
      const allOptions = __spreadValues(__spreadValues(__spreadValues({}, options), this.pickerOptionsValue), extraOptions);
      this.pickerInstance = esm_default(this.inputTarget, allOptions);
    }
    destroyFlatpickr() {
      if (this.pickerInstance) {
        this.pickerInstance.destroy();
      }
    }
    reloadFlatpickr(extraOptions) {
      this.destroyFlatpickr();
      this.initFlatpickr(extraOptions);
    }
    onConditionChange() {
      this.reloadFlatpickr();
    }
    closePicker() {
      if (this.pickerInstance.isOpen) {
        setTimeout(() => {
          this.pickerInstance.close();
        }, 1);
      }
    }
  };
  __publicField(date_filter_controller_default, "targets", ["input"]);
  __publicField(date_filter_controller_default, "values", {
    pickerOptions: Object
  });

  // app/javascript/controllers/tags_filter_controller.js
  var import_tagify = __toESM(require_tagify_min());
  function tagTemplate(tagData) {
    const suggestions = this.settings.whitelist || [];
    const possibleSuggestion = suggestions.find(
      (item) => item.value == tagData.value
    );
    const possibleLabel = possibleSuggestion ? possibleSuggestion.label : tagData.value;
    return `
<tag title="${tagData.value}"
  contenteditable='false'
  spellcheck='false'
  tabIndex="-1"
  class="tagify__tag ${tagData.class ? tagData.class : ""} !mb-1"
  ${this.getAttributes(tagData)}
>
  <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
  <div>
      <span class='tagify__tag-text'>${possibleLabel}</span>
  </div>
</tag>
`;
  }
  function suggestionItemTemplate(tagData) {
    return `
<div ${this.getAttributes(tagData)}
  class='tagify__dropdown__item flex items-center ${tagData.class ? tagData.class : ""}'
  tabindex="0"
  role="option">
  ${tagData.avatar ? `
  <div class='rounded w-8 h-8 block mr-2'>
      <img onerror="this.style.visibility='hidden'" class="w-full" src="${tagData.avatar}">
  </div>` : ""}
  <span>${tagData.value}</span>
</div>
`;
  }
  var tags_filter_controller_default = class extends Controller {
    get tagifyOptions() {
      const options = {
        whitelist: this.whitelistItemsValue,
        enforceWhitelist: this.enforceSuggestionsValue || this.fetchValuesFromValue,
        dropdown: {
          maxItems: 20,
          enabled: 0,
          closeOnSelect: false
        },
        templates: {
          tag: tagTemplate,
          dropdownItem: suggestionItemTemplate
        },
        originalInputValueFormat: (valuesArr) => valuesArr.map((item) => item.value)
      };
      return options;
    }
    connect() {
      this.initTagify();
    }
    initTagify() {
      this.tagify = new import_tagify.default(this.inputTarget, this.tagifyOptions);
    }
  };
  __publicField(tags_filter_controller_default, "targets", ["input"]);
  __publicField(tags_filter_controller_default, "values", {
    whitelistItems: { type: Array, default: [] },
    enforceSuggestions: { type: Boolean, default: false }
  });

  // app/javascript/controllers/index.js
  var application = window.Stimulus;
  application.register("avo-filters", avo_filters_controller_default);
  application.register("avo-filter", avo_filter_controller_default);
  application.register("date-filter", date_filter_controller_default);
  application.register("tags-filter", tags_filter_controller_default);
})();
/*! Bundled license information:

urijs/src/punycode.js:
  (*! https://mths.be/punycode v1.4.0 by @mathias *)

urijs/src/IPv6.js:
  (*!
   * URI.js - Mutating URLs
   * IPv6 Support
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)

urijs/src/SecondLevelDomains.js:
  (*!
   * URI.js - Mutating URLs
   * Second Level Domain (SLD) Support
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)

urijs/src/URI.js:
  (*!
   * URI.js - Mutating URLs
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)
*/
//# sourceMappingURL=avo_filters.js.map
