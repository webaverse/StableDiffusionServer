huggingFaceKey = `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`;
prompt = `2D overhead view, full color fantasy height map, mysterious sakura lunar magic forest, trending on artstation, pinterest, studio ghibli`;

//

// Generated by CoffeeScript 1.12.7
// (function() {
  var ColorScheme,
    slice = [].slice;

  ColorScheme = (function() {
    var clone, l, len, ref, typeIsArray, word;

    typeIsArray = Array.isArray || function(value) {
      return {}.toString.call(value) === '[object Array]';
    };

    ColorScheme.SCHEMES = {};

    ref = "mono monochromatic contrast triade tetrade analogic".split(/\s+/);
    for (l = 0, len = ref.length; l < len; l++) {
      word = ref[l];
      ColorScheme.SCHEMES[word] = true;
    }

    ColorScheme.PRESETS = {
      "default": [-1, -1, 1, -0.7, 0.25, 1, 0.5, 1],
      pastel: [0.5, -0.9, 0.5, 0.5, 0.1, 0.9, 0.75, 0.75],
      soft: [0.3, -0.8, 0.3, 0.5, 0.1, 0.9, 0.5, 0.75],
      light: [0.25, 1, 0.5, 0.75, 0.1, 1, 0.5, 1],
      hard: [1, -1, 1, -0.6, 0.1, 1, 0.6, 1],
      pale: [0.1, -0.85, 0.1, 0.5, 0.1, 1, 0.1, 0.75]
    };

    ColorScheme.COLOR_WHEEL = {
      0: [255, 0, 0, 100],
      15: [255, 51, 0, 100],
      30: [255, 102, 0, 100],
      45: [255, 128, 0, 100],
      60: [255, 153, 0, 100],
      75: [255, 178, 0, 100],
      90: [255, 204, 0, 100],
      105: [255, 229, 0, 100],
      120: [255, 255, 0, 100],
      135: [204, 255, 0, 100],
      150: [153, 255, 0, 100],
      165: [51, 255, 0, 100],
      180: [0, 204, 0, 80],
      195: [0, 178, 102, 70],
      210: [0, 153, 153, 60],
      225: [0, 102, 178, 70],
      240: [0, 51, 204, 80],
      255: [25, 25, 178, 70],
      270: [51, 0, 153, 60],
      285: [64, 0, 153, 60],
      300: [102, 0, 153, 60],
      315: [153, 0, 153, 60],
      330: [204, 0, 153, 80],
      345: [229, 0, 102, 90]
    };

    function ColorScheme() {
      var colors, m;
      colors = [];
      for (m = 1; m <= 4; m++) {
        colors.push(new ColorScheme.mutablecolor(60));
      }
      this.col = colors;
      this._scheme = 'mono';
      this._distance = 0.5;
      this._web_safe = false;
      this._add_complement = false;
    }


    /*
    
    colors()
    
    Returns an array of 4, 8, 12 or 16 colors in RRGGBB hexidecimal notation
    (without a leading "#") depending on the color scheme and addComplement
    parameter. For each set of four, the first is usually the most saturated color,
    the second a darkened version, the third a pale version and fourth
    a less-pale version.
    
    For example: With a contrast scheme, "colors()" would return eight colors.
    Indexes 1 and 5 could be background colors, 2 and 6 could be foreground colors.
    
    Trust me, it's much better if you check out the Color Scheme web site, whose
    URL is listed in "Description"
     */

    ColorScheme.prototype.colors = function() {
      var dispatch, h, i, j, m, n, output, ref1, used_colors;
      used_colors = 1;
      h = this.col[0].get_hue();
      dispatch = {
        mono: (function(_this) {
          return function() {};
        })(this),
        contrast: (function(_this) {
          return function() {
            used_colors = 2;
            _this.col[1].set_hue(h);
            return _this.col[1].rotate(180);
          };
        })(this),
        triade: (function(_this) {
          return function() {
            var dif;
            used_colors = 3;
            dif = 60 * _this._distance;
            _this.col[1].set_hue(h);
            _this.col[1].rotate(180 - dif);
            _this.col[2].set_hue(h);
            return _this.col[2].rotate(180 + dif);
          };
        })(this),
        tetrade: (function(_this) {
          return function() {
            var dif;
            used_colors = 4;
            dif = 90 * _this._distance;
            _this.col[1].set_hue(h);
            _this.col[1].rotate(180);
            _this.col[2].set_hue(h);
            _this.col[2].rotate(180 + dif);
            _this.col[3].set_hue(h);
            return _this.col[3].rotate(dif);
          };
        })(this),
        analogic: (function(_this) {
          return function() {
            var dif;
            used_colors = _this._add_complement ? 4 : 3;
            dif = 60 * _this._distance;
            _this.col[1].set_hue(h);
            _this.col[1].rotate(dif);
            _this.col[2].set_hue(h);
            _this.col[2].rotate(360 - dif);
            _this.col[3].set_hue(h);
            return _this.col[3].rotate(180);
          };
        })(this)
      };
      dispatch['monochromatic'] = dispatch['mono'];
      if (dispatch[this._scheme] != null) {
        dispatch[this._scheme]();
      } else {
        throw "Unknown color scheme name: " + this._scheme;
      }
      output = [];
      for (i = m = 0, ref1 = used_colors - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; i = 0 <= ref1 ? ++m : --m) {
        for (j = n = 0; n <= 3; j = ++n) {
          output[i * 4 + j] = this.col[i].get_hex(this._web_safe, j);
        }
      }
      return output;
    };


    /*
    
    colorset()
    
    Returns a list of lists of the colors in groups of four. This method simply
    allows you to reference a color in the scheme by its group isntead of its
    absolute index in the list of colors.  I am assuming that "colorset()"
    will make it easier to use this module with the templating systems that are
    out there.
    
    For example, if you were to follow the synopsis, say you wanted to retrieve
    the two darkest colors from the first two groups of the scheme, which is
    typically the second color in the group. You could retrieve them with
    "colors()"
    
        first_background  = (scheme.colors())[1];
        second_background = (scheme.colors())[5];
    
    Or, with this method,
    
        first_background  = (scheme.colorset())[0][1]
        second_background = (scheme.colorset())[1][1]
     */

    ColorScheme.prototype.colorset = function() {
      var flat_colors, grouped_colors;
      flat_colors = clone(this.colors());
      grouped_colors = [];
      while (flat_colors.length > 0) {
        grouped_colors.push(flat_colors.splice(0, 4));
      }
      return grouped_colors;
    };


    /*
    
    from_hue( degrees )
    
    Sets the base color hue, where 'degrees' is an integer. (Values greater than
    359 and less than 0 wrap back around the wheel.)
    
    The default base hue is 0, or bright red.
     */

    ColorScheme.prototype.from_hue = function(h) {
      if (h == null) {
        throw "from_hue needs an argument";
      }
      this.col[0].set_hue(h);
      return this;
    };

    ColorScheme.prototype.rgb2ryb = function() {
      var blue, green, iN, maxgreen, maxyellow, red, rgb, white, yellow;
      rgb = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if ((rgb[0] != null) && typeIsArray(rgb[0])) {
        rgb = rgb[0];
      }
      red = rgb[0], green = rgb[1], blue = rgb[2];
      white = Math.min(red, green, blue);
      red -= white;
      green -= white;
      blue -= white;
      maxgreen = Math.max(red, green, blue);
      yellow = Math.min(red, green);
      red -= yellow;
      green -= yellow;
      if (blue > 0 && green > 0) {
        blue /= 2;
        green /= 2;
      }
      yellow += green;
      blue += green;
      maxyellow = Math.max(red, yellow, blue);
      if (maxyellow > 0) {
        iN = maxgreen / maxyellow;
        red *= iN;
        yellow *= iN;
        blue *= iN;
      }
      red += white;
      yellow += white;
      blue += white;
      return [Math.floor(red), Math.floor(yellow), Math.floor(blue)];
    };

    ColorScheme.prototype.rgb2hsv = function() {
      var b, d, g, h, max, min, r, rgb, s, v;
      rgb = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if ((rgb[0] != null) && typeIsArray(rgb[0])) {
        rgb = rgb[0];
      }
      r = rgb[0], g = rgb[1], b = rgb[2];
      r /= 255;
      g /= 255;
      b /= 255;
      min = Math.min.apply(Math, [r, g, b]);
      max = Math.max.apply(Math, [r, g, b]);
      d = max - min;
      v = max;
      s;
      if (d > 0) {
        s = d / max;
      } else {
        return [0, 0, v];
      }
      h = (r === max ? (g - b) / d : (g === max ? 2 + (b - r) / d : 4 + (r - g) / d));
      h *= 60;
      h %= 360;
      return [h, s, v];
    };

    ColorScheme.prototype.rgbToHsv = function() {
      var b, d, g, h, max, min, r, rgb, s, v;
      rgb = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if ((rgb[0] != null) && typeIsArray(rgb[0])) {
        rgb = rgb[0];
      }
      r = rgb[0], g = rgb[1], b = rgb[2];
      r /= 255;
      g /= 255;
      b /= 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      v = max;
      d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return [h, s, v];
    };


    /*
    
    from_hex( color )
    
    Sets the base color to the given color, where 'color' is in the hexidecimal
    form RRGGBB. 'color' should not be preceded with a hash (#).
    
    The default base color is the equivalent of #ff0000, or bright red.
     */

    ColorScheme.prototype.from_hex = function(hex) {
      var b, g, h, h0, h1, h2, hsv, i1, i2, num, r, ref1, ref2, rgbcap, s, v;
      if (hex == null) {
        throw "from_hex needs an argument";
      }
      if (!/^([0-9A-F]{2}){3}$/im.test(hex)) {
        throw "from_hex(" + hex + ") - argument must be in the form of RRGGBB";
      }
      rgbcap = /(..)(..)(..)/.exec(hex).slice(1, 4);
      ref1 = (function() {
        var len1, m, results;
        results = [];
        for (m = 0, len1 = rgbcap.length; m < len1; m++) {
          num = rgbcap[m];
          results.push(parseInt(num, 16));
        }
        return results;
      })(), r = ref1[0], g = ref1[1], b = ref1[2];
      ref2 = this.rgb2ryb([r, g, b]), r = ref2[0], g = ref2[1], b = ref2[2];
      hsv = this.rgbToHsv(r, g, b);
      h0 = hsv[0];
      h1 = 0;
      h2 = 1000;
      i1 = null;
      i2 = null;
      h = null;
      s = null;
      v = null;
      h = hsv[0];
      s = hsv[1];
      v = hsv[2];
      this.from_hue(h * 360);
      this._set_variant_preset([s, v, s, v * 0.7, s * 0.25, 1, s * 0.5, 1]);
      return this;
    };


    /*
    
    add_complement( BOOLEAN )
    
    If BOOLEAN is true, an extra set of colors will be produced using the
    complement of the selected color.
    
    This only works with the analogic color scheme. The default is false.
     */

    ColorScheme.prototype.add_complement = function(b) {
      if (b == null) {
        throw "add_complement needs an argument";
      }
      this._add_complement = b;
      return this;
    };


    /*
    
    web_safe( BOOL )
    
    Sets whether the colors returned by L<"colors()"> or L<"colorset()"> will be
    web-safe.
    
    The default is false.
     */

    ColorScheme.prototype.web_safe = function(b) {
      if (b == null) {
        throw "web_safe needs an argument";
      }
      this._web_safe = b;
      return this;
    };


    /*
    
    distance( FLOAT )
    
    'FLOAT'> must be a value from 0 to 1. You might use this with the "triade"
    "tetrade" or "analogic" color schemes.
    
    The default is 0.5.
     */

    ColorScheme.prototype.distance = function(d) {
      if (d == null) {
        throw "distance needs an argument";
      }
      if (d < 0) {
        throw "distance(" + d + ") - argument must be >= 0";
      }
      if (d > 1) {
        throw "distance(" + d + ") - argument must be <= 1";
      }
      this._distance = d;
      return this;
    };


    /*
    
    scheme( name )
    
    'name' must be a valid color scheme name. See "Color Schemes". The default
    is "mono"
     */

    ColorScheme.prototype.scheme = function(name) {
      if (name == null) {
        return this._scheme;
      } else {
        if (ColorScheme.SCHEMES[name] == null) {
          throw "'" + name + "' isn't a valid scheme name";
        }
        this._scheme = name;
        return this;
      }
    };


    /*
    
    variation( name )
    
    'name' must be a valid color variation name. See "Color Variations"
     */

    ColorScheme.prototype.variation = function(v) {
      if (v == null) {
        throw "variation needs an argument";
      }
      if (ColorScheme.PRESETS[v] == null) {
        throw "'$v' isn't a valid variation name";
      }
      this._set_variant_preset(ColorScheme.PRESETS[v]);
      return this;
    };

    ColorScheme.prototype._set_variant_preset = function(p) {
      var i, m, results;
      results = [];
      for (i = m = 0; m <= 3; i = ++m) {
        results.push(this.col[i].set_variant_preset(p));
      }
      return results;
    };

    clone = function(obj) {
      var flags, key, newInstance;
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = clone(obj[key]);
      }
      return newInstance;
    };

    ColorScheme.mutablecolor = (function() {
      mutablecolor.prototype.hue = 0;

      mutablecolor.prototype.saturation = [];

      mutablecolor.prototype.value = [];

      mutablecolor.prototype.base_red = 0;

      mutablecolor.prototype.base_green = 0;

      mutablecolor.prototype.base_saturation = 0;

      mutablecolor.prototype.base_value = 0;

      function mutablecolor(hue) {
        if (hue == null) {
          throw "No hue specified";
        }
        this.saturation = [];
        this.value = [];
        this.base_red = 0;
        this.base_green = 0;
        this.base_blue = 0;
        this.base_saturation = 0;
        this.base_value = 0;
        this.set_hue(hue);
        this.set_variant_preset(ColorScheme.PRESETS['default']);
      }

      mutablecolor.prototype.get_hue = function() {
        return this.hue;
      };

      mutablecolor.prototype.set_hue = function(h) {
        var avrg, color, colorset1, colorset2, d, derivative1, derivative2, en, i, k;
        avrg = function(a, b, k) {
          return a + Math.round((b - a) * k);
        };
        this.hue = Math.round(h % 360);
        d = this.hue % 15 + (this.hue - Math.floor(this.hue));
        k = d / 15;
        derivative1 = this.hue - Math.floor(d);
        derivative2 = (derivative1 + 15) % 360;
        if (derivative1 === 360) {
          derivative1 = 0;
        }
        if (derivative2 === 360) {
          derivative2 = 0;
        }
        colorset1 = ColorScheme.COLOR_WHEEL[derivative1];
        colorset2 = ColorScheme.COLOR_WHEEL[derivative2];
        en = {
          red: 0,
          green: 1,
          blue: 2,
          value: 3
        };
        for (color in en) {
          i = en[color];
          this["base_" + color] = avrg(colorset1[i], colorset2[i], k);
        }
        this.base_saturation = avrg(100, 100, k) / 100;
        return this.base_value /= 100;
      };

      mutablecolor.prototype.rotate = function(angle) {
        var newhue;
        newhue = (this.hue + angle) % 360;
        return this.set_hue(newhue);
      };

      mutablecolor.prototype.get_saturation = function(variation) {
        var s, x;
        x = this.saturation[variation];
        s = x < 0 ? -x * this.base_saturation : x;
        if (s > 1) {
          s = 1;
        }
        if (s < 0) {
          s = 0;
        }
        return s;
      };

      mutablecolor.prototype.get_value = function(variation) {
        var v, x;
        x = this.value[variation];
        v = x < 0 ? -x * this.base_value : x;
        if (v > 1) {
          v = 1;
        }
        if (v < 0) {
          v = 0;
        }
        return v;
      };

      mutablecolor.prototype.set_variant = function(variation, s, v) {
        this.saturation[variation] = s;
        return this.value[variation] = v;
      };

      mutablecolor.prototype.set_variant_preset = function(p) {
        var i, m, results;
        results = [];
        for (i = m = 0; m <= 3; i = ++m) {
          results.push(this.set_variant(i, p[2 * i], p[2 * i + 1]));
        }
        return results;
      };

      mutablecolor.prototype.get_hex = function(web_safe, variation) {
        var c, color, formatted, i, k, len1, len2, m, max, min, n, ref1, rgb, rgbVal, s, str, v;
        max = Math.max.apply(Math, (function() {
          var len1, m, ref1, results;
          ref1 = ['red', 'green', 'blue'];
          results = [];
          for (m = 0, len1 = ref1.length; m < len1; m++) {
            color = ref1[m];
            results.push(this["base_" + color]);
          }
          return results;
        }).call(this));
        min = Math.min.apply(Math, (function() {
          var len1, m, ref1, results;
          ref1 = ['red', 'green', 'blue'];
          results = [];
          for (m = 0, len1 = ref1.length; m < len1; m++) {
            color = ref1[m];
            results.push(this["base_" + color]);
          }
          return results;
        }).call(this));
        v = (variation < 0 ? this.base_value : this.get_value(variation)) * 255;
        s = variation < 0 ? this.base_saturation : this.get_saturation(variation);
        k = max > 0 ? v / max : 0;
        rgb = [];
        ref1 = ['red', 'green', 'blue'];
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          color = ref1[m];
          rgbVal = Math.min.apply(Math, [255, Math.round(v - (v - this["base_" + color] * k) * s)]);
          rgb.push(rgbVal);
        }
        if (web_safe) {
          rgb = (function() {
            var len2, n, results;
            results = [];
            for (n = 0, len2 = rgb.length; n < len2; n++) {
              c = rgb[n];
              results.push(Math.round(c / 51) * 51);
            }
            return results;
          })();
        }
        formatted = "";
        for (n = 0, len2 = rgb.length; n < len2; n++) {
          i = rgb[n];
          str = i.toString(16);
          if (str.length < 2) {
            str = "0" + str;
          }
          formatted += str;
        }
        return formatted;
      };

      return mutablecolor;

    })();

    return ColorScheme;

  })();

//

materialColors = {
  "red": {
    "50": "#ffebee",
    "100": "#ffcdd2",
    "200": "#ef9a9a",
    "300": "#e57373",
    "400": "#ef5350",
    "500": "#f44336",
    "600": "#e53935",
    "700": "#d32f2f",
    "800": "#c62828",
    "900": "#b71c1c",
    "a100": "#ff8a80",
    "a200": "#ff5252",
    "a400": "#ff1744",
    "a700": "#d50000"
  },
  "pink": {
    "50": "#fce4ec",
    "100": "#f8bbd0",
    "200": "#f48fb1",
    "300": "#f06292",
    "400": "#ec407a",
    "500": "#e91e63",
    "600": "#d81b60",
    "700": "#c2185b",
    "800": "#ad1457",
    "900": "#880e4f",
    "a100": "#ff80ab",
    "a200": "#ff4081",
    "a400": "#f50057",
    "a700": "#c51162"
  },
  "purple": {
    "50": "#f3e5f5",
    "100": "#e1bee7",
    "200": "#ce93d8",
    "300": "#ba68c8",
    "400": "#ab47bc",
    "500": "#9c27b0",
    "600": "#8e24aa",
    "700": "#7b1fa2",
    "800": "#6a1b9a",
    "900": "#4a148c",
    "a100": "#ea80fc",
    "a200": "#e040fb",
    "a400": "#d500f9",
    "a700": "#aa00ff"
  },
  "deeppurple": {
    "50": "#ede7f6",
    "100": "#d1c4e9",
    "200": "#b39ddb",
    "300": "#9575cd",
    "400": "#7e57c2",
    "500": "#673ab7",
    "600": "#5e35b1",
    "700": "#512da8",
    "800": "#4527a0",
    "900": "#311b92",
    "a100": "#b388ff",
    "a200": "#7c4dff",
    "a400": "#651fff",
    "a700": "#6200ea"
  },
  "indigo": {
    "50": "#e8eaf6",
    "100": "#c5cae9",
    "200": "#9fa8da",
    "300": "#7986cb",
    "400": "#5c6bc0",
    "500": "#3f51b5",
    "600": "#3949ab",
    "700": "#303f9f",
    "800": "#283593",
    "900": "#1a237e",
    "a100": "#8c9eff",
    "a200": "#536dfe",
    "a400": "#3d5afe",
    "a700": "#304ffe"
  },
  "blue": {
    "50": "#e3f2fd",
    "100": "#bbdefb",
    "200": "#90caf9",
    "300": "#64b5f6",
    "400": "#42a5f5",
    "500": "#2196f3",
    "600": "#1e88e5",
    "700": "#1976d2",
    "800": "#1565c0",
    "900": "#0d47a1",
    "a100": "#82b1ff",
    "a200": "#448aff",
    "a400": "#2979ff",
    "a700": "#2962ff"
  },
  "lightblue": {
    "50": "#e1f5fe",
    "100": "#b3e5fc",
    "200": "#81d4fa",
    "300": "#4fc3f7",
    "400": "#29b6f6",
    "500": "#03a9f4",
    "600": "#039be5",
    "700": "#0288d1",
    "800": "#0277bd",
    "900": "#01579b",
    "a100": "#80d8ff",
    "a200": "#40c4ff",
    "a400": "#00b0ff",
    "a700": "#0091ea"
  },
  "cyan": {
    "50": "#e0f7fa",
    "100": "#b2ebf2",
    "200": "#80deea",
    "300": "#4dd0e1",
    "400": "#26c6da",
    "500": "#00bcd4",
    "600": "#00acc1",
    "700": "#0097a7",
    "800": "#00838f",
    "900": "#006064",
    "a100": "#84ffff",
    "a200": "#18ffff",
    "a400": "#00e5ff",
    "a700": "#00b8d4"
  },
  "teal": {
    "50": "#e0f2f1",
    "100": "#b2dfdb",
    "200": "#80cbc4",
    "300": "#4db6ac",
    "400": "#26a69a",
    "500": "#009688",
    "600": "#00897b",
    "700": "#00796b",
    "800": "#00695c",
    "900": "#004d40",
    "a100": "#a7ffeb",
    "a200": "#64ffda",
    "a400": "#1de9b6",
    "a700": "#00bfa5"
  },
  "green": {
    "50": "#e8f5e9",
    "100": "#c8e6c9",
    "200": "#a5d6a7",
    "300": "#81c784",
    "400": "#66bb6a",
    "500": "#4caf50",
    "600": "#43a047",
    "700": "#388e3c",
    "800": "#2e7d32",
    "900": "#1b5e20",
    "a100": "#b9f6ca",
    "a200": "#69f0ae",
    "a400": "#00e676",
    "a700": "#00c853"
  },
  "lightgreen": {
    "50": "#f1f8e9",
    "100": "#dcedc8",
    "200": "#c5e1a5",
    "300": "#aed581",
    "400": "#9ccc65",
    "500": "#8bc34a",
    "600": "#7cb342",
    "700": "#689f38",
    "800": "#558b2f",
    "900": "#33691e",
    "a100": "#ccff90",
    "a200": "#b2ff59",
    "a400": "#76ff03",
    "a700": "#64dd17"
  },
  "lime": {
    "50": "#f9fbe7",
    "100": "#f0f4c3",
    "200": "#e6ee9c",
    "300": "#dce775",
    "400": "#d4e157",
    "500": "#cddc39",
    "600": "#c0ca33",
    "700": "#afb42b",
    "800": "#9e9d24",
    "900": "#827717",
    "a100": "#f4ff81",
    "a200": "#eeff41",
    "a400": "#c6ff00",
    "a700": "#aeea00"
  },
  "yellow": {
    "50": "#fffde7",
    "100": "#fff9c4",
    "200": "#fff59d",
    "300": "#fff176",
    "400": "#ffee58",
    "500": "#ffeb3b",
    "600": "#fdd835",
    "700": "#fbc02d",
    "800": "#f9a825",
    "900": "#f57f17",
    "a100": "#ffff8d",
    "a200": "#ffff00",
    "a400": "#ffea00",
    "a700": "#ffd600"
  },
  "amber": {
    "50": "#fff8e1",
    "100": "#ffecb3",
    "200": "#ffe082",
    "300": "#ffd54f",
    "400": "#ffca28",
    "500": "#ffc107",
    "600": "#ffb300",
    "700": "#ffa000",
    "800": "#ff8f00",
    "900": "#ff6f00",
    "a100": "#ffe57f",
    "a200": "#ffd740",
    "a400": "#ffc400",
    "a700": "#ffab00"
  },
  "orange": {
    "50": "#fff3e0",
    "100": "#ffe0b2",
    "200": "#ffcc80",
    "300": "#ffb74d",
    "400": "#ffa726",
    "500": "#ff9800",
    "600": "#fb8c00",
    "700": "#f57c00",
    "800": "#ef6c00",
    "900": "#e65100",
    "a100": "#ffd180",
    "a200": "#ffab40",
    "a400": "#ff9100",
    "a700": "#ff6d00"
  },
  "deeporange": {
    "50": "#fbe9e7",
    "100": "#ffccbc",
    "200": "#ffab91",
    "300": "#ff8a65",
    "400": "#ff7043",
    "500": "#ff5722",
    "600": "#f4511e",
    "700": "#e64a19",
    "800": "#d84315",
    "900": "#bf360c",
    "a100": "#ff9e80",
    "a200": "#ff6e40",
    "a400": "#ff3d00",
    "a700": "#dd2c00"
  },
  "brown": {
    "50": "#efebe9",
    "100": "#d7ccc8",
    "200": "#bcaaa4",
    "300": "#a1887f",
    "400": "#8d6e63",
    "500": "#795548",
    "600": "#6d4c41",
    "700": "#5d4037",
    "800": "#4e342e",
    "900": "#3e2723"
  },
  "grey": {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#eeeeee",
    "300": "#e0e0e0",
    "400": "#bdbdbd",
    "500": "#9e9e9e",
    "600": "#757575",
    "700": "#616161",
    "800": "#424242",
    "900": "#212121"
  },
  "bluegrey": {
    "50": "#eceff1",
    "100": "#cfd8dc",
    "200": "#b0bec5",
    "300": "#90a4ae",
    "400": "#78909c",
    "500": "#607d8b",
    "600": "#546e7a",
    "700": "#455a64",
    "800": "#37474f",
    "900": "#263238"
  }
}

//

createSeedImage = (
  w, // width
  h, // height
  rw, // radius width
  rh, // radius height
  p, // power distribution of radius
  n, // number of rectangles
  {
    color = null,
    monochrome = false,
    // blur = 0,
  } = {},
) => {
  const rng = () => (Math.random() * 2) - 1;
  const baseColors = Object.keys(materialColors).map(k => materialColors[k][400].slice(1));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  // ctx.filter = blur ? `blur(${blur}px) saturate(1.5)` : '';
  
  const baseColor = color ?? baseColors[Math.floor(Math.random() * baseColors.length)];
  const scheme = new ColorScheme();
  scheme.from_hex(baseColor)
    .scheme(monochrome ? 'mono' : 'triade')   
    // .variation('hard');
  const colors = scheme.colors();

  for (let i = 0; i < n; i++) {
    const x = w / 2 + rng() * rw;
    const y = h / 2 + rng() * rh;
    const sw = Math.pow(Math.random(), p) * rw;
    const sh = Math.pow(Math.random(), p) * rh;
    ctx.fillStyle = '#' + colors[Math.floor(Math.random() * colors.length)];

    ctx.fillRect(x - sw / 2, y - sh / 2, sw, sh);
  }

  return canvas;
};
makeCharacterSeedImage = () => {
  return createSeedImage(512, 512, 64, 128, 1, 256);
};
createFullSeedImage = () => {
  const rng = () => (Math.random() * 2) - 1;
  const baseColors = Object.keys(materialColors).map(k => materialColors[k][400].slice(1));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  // ctx.filter = blur ? `blur(${blur}px) saturate(1.5)` : '';

  const minSize = 64;
  
  const baseColor = color ?? baseColors[Math.floor(Math.random() * baseColors.length)];
  const scheme = new ColorScheme();
  scheme.from_hex(baseColor)
    .scheme(monochrome ? 'mono' : 'triade')   
    // .variation('hard');
  const colors = scheme.colors();

  for (let i = 0; i < n; i++) {
    const x = w / 2 + rng() * rw;
    const y = h / 2 + rng() * rh;
    const sw = Math.pow(Math.random(), p) * rw;
    const sh = Math.pow(Math.random(), p) * rh;
    ctx.fillStyle = '#' + colors[Math.floor(Math.random() * colors.length)];

    ctx.fillRect(x - sw / 2, y - sh / 2, sw, sh);
  }

  return canvas;
};

//



















//

function blob2img(blob) {
  const img = new Image();
  const u = URL.createObjectURL(blob);
  const promise = new Promise((accept, reject) => {
    function cleanup() {
      URL.revokeObjectURL(u);
    }
    img.onload = () => {
      accept(img);
      cleanup();
    };
    img.onerror = err => {
      reject(err);
      cleanup();
    };
  });
  img.crossOrigin = 'Anonymous';
  img.src = u;
  img.blob = blob;
  return promise;
}
function canvas2blob(canvas) {
  return new Promise((accept, reject) => {
    canvas.toBlob(accept, 'image/png');
  });
}

(async () => {
  const canvasSize = 2048;
  const tileSize = 512;

  const getFormData = (prompt, w, h) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('width', w);
    formData.append('height', h);
    return formData;
  };
  const fillNoise = (canvas, ctx) => {
    // fills a canvas with noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      data[i + 0] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  };
  const fillCanvasFromClips = (dstCanvas, dstCtx, srcCanvases) => {
    const numClips = 300;
    const minClipSize = 128;
    const maxClipSize = 256;
    // fill dstCtx with numClips rectangle clips from srcCanvas, placed randomly
    for (let i = 0; i < numClips; i++) {
      const srcCanvas = srcCanvases[Math.floor(Math.random() * srcCanvases.length)];
      const clipW = Math.floor(Math.random() * (maxClipSize - minClipSize) + minClipSize);
      const clipH = Math.floor(Math.random() * (maxClipSize - minClipSize) + minClipSize);
      const clipX = Math.floor(Math.random() * (srcCanvas.width + clipW));
      const clipY = Math.floor(Math.random() * (srcCanvas.height - clipH));
      const dstX = Math.floor(-clipW + Math.random() * (dstCanvas.width + clipW));
      const dstY = Math.floor(-clipH + Math.random() * (dstCanvas.height + clipH));
      dstCtx.drawImage(srcCanvas, clipX, clipY, clipW, clipH, dstX, dstY, clipW, clipH);
      // console.log('draw clip', srcCanvas, clipX, clipY, clipW, clipH, dstX, dstY, clipW, clipH);
    }
  };
  async function getDepth(blob) {
    const res = await fetch('https://depth.webaverse.com/depth', {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "image/png",
      },
      mode: 'cors',
    });
    const result = await res.blob();
    return result;
  }
  async function genImg(prompt) {
    const fd = getFormData(prompt, tileSize, tileSize);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {method: 'POST', body: fd});
    const b = await res.blob();
    const i = await blob2img(b);
    return i;
  }
  async function editImg(srcCanvas, prompt, maskCanvas) {
    const fd = getFormData(prompt, tileSize, tileSize);
    
    // opt.prompt,
    // // seed        = orig_opt.seed,    # uncomment to make it deterministic
    // sampler     = self.generate.sampler,
    // steps       = opt.steps,
    // cfg_scale   = opt.cfg_scale,
    // ddim_eta    = self.generate.ddim_eta,
    // width       = extended_image.width,
    // height      = extended_image.height,
    // init_img    = extended_image,
    // init_mask    = opt.init_mask,
    // strength    = opt.strength,
    // image_callback = wrapped_callback,
    // inpaint_replace = opt.inpaint_replace,
    const srcCanvasBlob = await canvas2blob(srcCanvas);
    fd.append('init_img', srcCanvasBlob);
    if (maskCanvas) {
      const maskCanvasBlob = await canvas2blob(maskCanvas);
      fd.append('init_mask', maskCanvasBlob, 'init_mask.png');
      fd.append('inpaint_replace', '1.0');
    }
    
    console.log('edit form data', fd);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {
      method: 'POST',
      body: fd,
    });
    const b = await res.blob();
    const i = await blob2img(b);
    return i;
  }

  // canvases
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  const depthCanvas = document.createElement('canvas');
  depthCanvas.width = canvasSize;
  depthCanvas.height = canvasSize;
  const depthCtx = depthCanvas.getContext('2d');
  document.body.appendChild(depthCanvas);

  const tiles = [];
  const _initialTile = async () => {
    const baseImg = await genImg(prompt, tileSize, tileSize);
    const baseImgPosition = [
      canvasSize / 2,
      canvasSize / 2,
    ];
    ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

    const depthResult = await getDepth(baseImg.blob);
    const image = await blob2img(depthResult);
    depthCtx.drawImage(image, baseImgPosition[0], baseImgPosition[1]);
    
    const tile = {
      img: baseImg,
      position: baseImgPosition,
    };
    tiles.push(tile);
  };
  await _initialTile();

  const _drawTile = async (tiles, viewport, {
    debug = false,
  } = {}) => {
    const x = viewport[0];
    const y = viewport[1];
    const w = viewport[2] - viewport[0];
    const h = viewport[3] - viewport[1];

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = w;
    srcCanvas.height = h;
    srcCanvas.classList.add('srcCanvas');
    const srcCtx = srcCanvas.getContext('2d');
    debug && document.body.appendChild(srcCanvas);

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = w;
    maskCanvas.height = h;
    maskCanvas.classList.add('maskCanvas');
    const maskCtx = maskCanvas.getContext('2d');
    debug && document.body.appendChild(maskCanvas);

    // fillNoise(srcCanvas, srcCtx);
    const srcCanvases = tiles.map(t => t.img);
    fillCanvasFromClips(srcCanvas, srcCtx, srcCanvases);

    const _drawMask = (srcCanvas, srcCtx, maskCanvas, maskCtx, tiles) => {
      for (const tile of tiles) {
        const {img, position} = tile;
        
        // compute position within the viewport
        const x1 = position[0] - x;
        const y1 = position[1] - y;
        const x2 = x1 + img.width;
        const y2 = y1 + img.height;
        const w = x2 - x1;
        const h = y2 - y1;

        // draw the image at the offset location within the viewport
        srcCtx.drawImage(img, x1, y1);

        // the image data covering this mask area
        // note that x1 and y1 might be negative, so we need to offset the values a bit
        const imageData = maskCtx.getImageData(x1, y1, w, h);

        // fill the image data based on the distance to the center
        const cx = w / 2;
        const cy = h / 2;
        for (let x = 0; x < imageData.width; x++) {
          for (let y = 0; y < imageData.height; y++) {
            const d = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            const maxD = imageData.width / 2;
            const r = (1 - ((d / maxD) ** 3)) * 255;
            const g = r;
            const b = r;
            const a = r;
            
            const i = (y * imageData.width + x) * 4;
            imageData.data[i + 0] = Math.max(r, imageData.data[i + 0]);
            imageData.data[i + 1] = Math.max(g, imageData.data[i + 1]);
            imageData.data[i + 2] = 1;
            imageData.data[i + 3] = Math.max(a, imageData.data[i + 3]);
          }
        }
        // draw the image data back into the mask
        maskCtx.putImageData(imageData, x1, y1);
      }
    };
    _drawMask(srcCanvas, srcCtx, maskCanvas, maskCtx, tiles);

    // render image
    const baseImg = await editImg(srcCanvas, prompt, maskCanvas);
    const baseImgPosition = [
      x,
      y,
    ];
    // draw image
    ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

    // render depth
    const depthResult = await getDepth(baseImg.blob);
    const image = await blob2img(depthResult);
    // draw depth
    depthCtx.drawImage(image, baseImgPosition[0], baseImgPosition[1]);

    const tile = {
      img: baseImg,
      position: baseImgPosition,
    };
    tiles.push(tile);
  };
  // draw tiles
  await _drawTile(tiles.slice(), [
    canvasSize / 2 + tileSize / 2,
    canvasSize / 2 + tileSize / 2,
    canvasSize / 2 + tileSize / 2 + tileSize,
    canvasSize / 2 + tileSize / 2 + tileSize,
  ], {
    debug: false,
  });
  await _drawTile(tiles.slice(), [
    canvasSize / 2 + tileSize / 2,
    canvasSize / 2 - tileSize,
    canvasSize / 2 + tileSize / 2 + tileSize,
    canvasSize / 2 + tileSize / 2,
  ], {
    debug: true,
  });

  const cssText = `\
    position: fixed;
    top: 0;
    left: 0;
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
    z-index: 100;
    visibility: hidden;
  `;
  canvas.style.cssText = cssText;
  depthCanvas.style.cssText = cssText;

  canvas.style.visibility = 'visible';

  let currentHeight = 0;
  window.addEventListener('keydown', e => {
    if (!e.repeat) {
      if (e.code === 'PageDown') {
        currentHeight--;
        
        e.preventDefault();
        e.stopPropagation();
      } else if (e.code === 'PageUp') {
        currentHeight++;

        e.preventDefault();
        e.stopPropagation();
      }
    }

    const _updateVisibility = () => {
      canvas.style.visibility = 'hidden';
      depthCanvas.style.visibility = 'hidden';
      if (currentHeight === 0) {
        canvas.style.visibility = 'visible';
      } else if (currentHeight === -1) {
        depthCanvas.style.visibility = 'visible';
      }
    };
    _updateVisibility();
  });

  return canvas;
})().then(console.log, console.warn);