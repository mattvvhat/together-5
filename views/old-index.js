<!DOCTYPE html>
<!--
7777777777777777I?I77$$$$$$$$$$$$777??I777777777777777777II~I7777777777777I=7777$$$$$$$$$??+$$$$$$$$$$$$$$$$7$=I777777II
7777777777777777I???7777$$$$$$$777I??III77777777777IIII??=~I777777$$$$77777I=I777$$$$$$$I+?$$$$$$$$$$$$$$$7$7$,7IIIIIII7
I77777777777777I???++=+7777777I??????????+++++??IIIIIII?+,~I777777$$77777777I??I77777777?:$7$$$$$$$$$$$$$$7+77I+===+??II
I???II777777II?+++??II777I7III?IIIIIIIIIII777777777777I?+?II7I?+I7777777III???+++==I777$$$++=?7777I?I77$$$77$77I?I777777
7777I?++++++++++??I777777777777IIIIIIIII7777777777777I??I77777777III77777777II?=:777$$7$$$$$77:7777$$$$$$$$$$77?I7777777
777777II?????+++?I77777$$$$777777I?++?I777777777777I??I7777777777777777777777777~7$$$$$$$$$7$77=777$$$$$$$$$$77=77777777
777777IIIIIIII?++I777777$$$7777777II=~+II77777IIIIIIII7777777777777777777$$$7$7$I?7$$$$$$$$$$77+I777$$$$$7$777II77777777
777777??IIIIIIII?++II777777777777III?+~~+??II777777777777777777777777777$$77$7777~,$$7$$$$$$$77=IIIIIIII??+=::=I77777777
7777II=+?IIIIIIII7II??II777777IIIIIIII?~+I7777777777777777777777777I7777777777IIII7I:+$$$$777I=?II7777777777II?I77777777
77I+I7I+=?II777777777III????IIII77777II+=?I777777777777IIIIIIII??????III7IIIII7777777777=+I?~+I77777$$$$$777777I77777777
7777$7777III777777777777IIIIII7777777II:?IIII???IIIIIII?+~+II7777777I?=?III77777777$777777I?=+I77777$$$$$777777I777777++
$$$7$$77$777777777777777III777777777II:$77$7$$$$$$7777I+~I77$$$$$$$$777I+II777777$7777777777II?+I77777777777777I??=?77$$
$$$$$$$$777777777777777IIII777777777I=$$$$$$$$$$$$$$$$777777$$$$$$$$7777+?I77777777$$777777777II???II7777777?=~,,I777$$$
$$$$$$$$$7777777777777I++++???IIIIIII:7$$$$$$$$$$$$$$$$7777$7$$$$$$7??=~$$$I:+777777777777777I7I?+=+?II77777777I?=I77$$$
$$$$$$$777777777II+:,$$7$7$777777777I:$$$$$$$$$$$$$$$$$$7$7+7777?+++7$$7$$7$77$$7+77777777777I?~+??II777777777777I?I77$$
7$77777I77III??+~$7$$$$$$$$$$$$$$$$$7I=Z$$$$$$$$$$$$$$7777II+,7$$$$$$$$$$$$$$$$$$$77$++7++:7$$7$$$7777II7777777777II??I7
I7II777777I??+?=7777$$$$$$$$$$$$$$$$777,77777777$7777777777I?~7777$$$$$$$$$$$$$$$$$$777=I7$$$$$$$$$$$$$$7$++IIIII?==?77I
77777777777777I~777$$$$$$$$$$$$$$$$$7I?777=+7777777777777777I+I7$$$$$$$$$$$$$$$$$$7777?=7$$$$$$$$$$$$$$$$$777~I777777777
-->
<html>
  <head>
    <title>Together Festival ___ art, technology, music</title>
    <!-- Debugging, etc.  -->
    <script src="/public/js/vendor/live.js"               type="text/javascript"></script>
    <script src="/public/js/vendor/dat.gui.min.js"        type="text/javascript"></script>

    <!-- CDN -->

    <!-- Important to app -->
    <script src="/public/js/vendor/glMatrix-0.9.5.min.js" ></script>
    <!--
      <script src="/public/js/custom/webgl.js"              ></script>
      <script src="/public/js/custom/MaskedPlane.js"        ></script>
      <script src="/public/js/custom/TogetherLogo.js"       ></script>
      <script src="/public/js/custom/app.js"                ></script>
    -->
    <script src="/public/js/custom/Wave.js"       ></script>

    <!-- Shader -->
    <script type="x-shader/x-vertex" id="vert-simple">
      attribute vec3 aPosition;
      attribute vec4 aColor;
      uniform mat4 uPMatrix;
      uniform mat4 uMVMatrix;
      varying vec4 vColor;
      varying vec2 vTexCoord;
      void main () {
        vColor = aColor;
        vTexCoord = aTexCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.);
      }
    </script>
    <script type="x-shader/x-fragment" id="frag-simple">
      precision mediump float;
      varying vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    </script>
    <!-- PASS VERT -->
    <script type="x-shader/x-vertex" id="vert-pass">
      attribute vec3 aPosition;
      attribute vec4 aColor;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      uniform mat3 uNMatrix;
      uniform vec3 uLightDir;
      uniform vec3 uAmbientCol;
      uniform vec3 uDirectionalCol;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightDir;
      varying vec3 vLightWeighting;
      varying vec2 vTexCoord;
      void main() {
        vec3 transformedNormal = uNMatrix * aNormal;
        float directionalLightWeighting = max(dot(transformedNormal, uLightDir), 0.0);
        vLightWeighting = uAmbientCol + uDirectionalCol * directionalLightWeighting;
        vColor = aColor;
        vNormal = aNormal;
        vLightDir = uLightDir;
        vTexCoord = aTexCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
      }
    </script>
    <!-- PASS FRAG -->
    <script type="x-shader/x-fragment" id="frag-pass">
      precision mediump float;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightDir;
      varying vec3 vLightWeighting;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = vColor;
        float d = length(vTexCoord);
        float w = 1.;
        gl_FragColor = vColor;
      }
    </script>
    <!-- VERT: Texture + Shadow -->
    <script type="x-shader/x-vertex" id="vert-mask">
      attribute vec3 aPosition;
      attribute vec4 aColor;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      uniform mat3 uNMatrix;
      uniform vec3 uLightDir;
      uniform vec3 uAmbientCol;
      uniform vec3 uDirectionalCol;
      varying vec2 vTexCoord;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightingDirection;
      varying vec3 vLightWeighting;
      void main() {
        vec3 transformedNormal = uNMatrix * aNormal;
        float directionalLightWeighting = max(dot(transformedNormal, uLightDir), 0.0);
        vLightWeighting = uAmbientCol + uDirectionalCol * directionalLightWeighting;
        // Compute on-screen position
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
        vNormal = aNormal;
        vLightingDirection = uLightDir;
        vTexCoord = aTexCoord;
      }
    </script>
    <!-- FRAG: Texture + Shadow -->
    <script type="x-shader/x-fragment" id="frag-mask">
      precision mediump float;
      varying vec2 vTexCoord;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightWeighting;
      uniform sampler2D uSamplerTexture;
      float luminance (vec3 rgb) {
        return dot(vec3(0.2126, 0.7152, 0.0722), rgb);
      }
      void main() {
        vec4 textureColor = texture2D(uSamplerTexture, vTexCoord.xy);
        gl_FragColor.rgb = vColor.rgb;
        gl_FragColor.a = pow(luminance(textureColor.rgb), 0.9);
      }
    </script>
    <!-- VERT: Transparency Mask + Pattern Mask -->
    <script type="x-shader/x-vertex" id="vert-pattern-mask">
      attribute vec3 aPosition;
      attribute vec4 aColor;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      uniform mat3 uNMatrix;
      uniform vec3 uLightDir;
      uniform vec3 uAmbientCol;
      uniform vec3 uDirectionalCol;
      varying vec2 vTexCoord;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightingDirection;
      varying vec3 vLightWeighting;
      void main() {
        vec3 transformedNormal = uNMatrix * aNormal;
        float directionalLightWeighting = max(dot(transformedNormal, uLightDir), 0.0);
        vLightWeighting = uAmbientCol + uDirectionalCol * directionalLightWeighting;
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
        vNormal = aNormal;
        vLightingDirection = uLightDir;
        vTexCoord = aTexCoord;
      }
    </script>
    <!-- FRAG: Texture + Shadow -->
    <script type="x-shader/x-fragment" id="frag-pattern-mask">
      precision mediump float;
      varying vec2 vTexCoord;
      varying vec4 vColor;
      varying vec3 vNormal;
      varying vec3 vLightWeighting;
      uniform sampler2D uMaskTexture;
      uniform sampler2D uPatternTexture;

      float luminance (vec3 rgb) {
        return dot(vec3(0.2126, 0.7152, 0.0722), rgb);
      }
      vec4 solidColor (vec2 p, float weight) {
        vec4 col;
        col.rgb = vColor.rgb;
        col.a = weight;
        return col;
      }
      vec4 moirePattern (vec2 p, float weight) {
        float g = .95 * .5 * (1. + sin(900. * p.x) + cos(900. * p.y));
        g = g > .5 ? .5 : g;
        vec4 col;
        col.rgb = vColor.rgb;
        col.a = .40 * weight;
        return col;
      }
      void main() {
        vec4 maskColor = texture2D(uMaskTexture, vTexCoord.xy);
        vec4 patternColor = texture2D(uPatternTexture, vTexCoord.xy);
        float maskWeight = luminance(maskColor.rgb);
        float patternWeight = luminance(patternColor.rgb);
        vec4 solidColor = solidColor(vTexCoord, maskWeight);
        vec4 moireColor = moirePattern(vTexCoord, patternWeight);
        gl_FragColor = 0.75 * solidColor + 0.25 * moireColor;
      }
    </script>

    <!--
          MAIN SCRIPT
    -->

    <style>
      body, html {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        background-color: black;
      }
      #container {
        margin: 0 auto;
        width: 800px;
        height: 100%;
      }
      #wavethanks {
        background-color: rgba(0, 0, 0, .2);
        padding: 10px;
      }
      #pleasefeeldeepthanks {
        background-color: black;
        background-color: white;
        position: relative;
        height: 100%;
        margin: 0 auto;
      }
      .overlay {
        height: 100%;
        position: absolute;
        top: 30%;
        left: 0;
        color: black;
        width: 80%;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <!-- Canvas -->
    <div id="container">
      <canvas width="700" height="700" id="pleasefeeldeepthanks">WebGL is unsupported.</canvas>
    </div>
    <script type="text/javascript">
      var gl = undefined;
      var context = undefined;
      var svvim = undefined;

      function main() {
        canvas = document.getElementById("pleasefeeldeepthanks");
        ctx = canvas.getContext("2d") || canvas.getContext("exoerimental-2d");

        function h (y) {
          return 2 * y;
        }

        function w () {
          return 2 * x;
        }

        var pos = 

        ctx.rect(-50, -50, 100, 100);

        ctx.fillStyle="#FF0000";
        ctx.fillRect(20,20,150,100);
        ctx.stroke();
        // gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        // svvim = app("pleasefeeldeepthanks");
        // svvim.init();
        // svvim.play();
      }

      window.onload = main;
    </script>
    <script type="text/javascript">
      var mouseListener = (function () {
        var prev = { x : undefined, y : undefined };
        return function (ev) {
          var pos = { x : ev.clientX, y : ev.clientY };
          var dx = pos.x - prev.x;
          var dy = pos.y - prev.y;
          prev = pos;
          svvim.addMovement(dx, dy);
        };
      })();
      // $(window).mousemove(mouseListener);
    </script>
    <!-- <script src="http://codeorigin.jquery.com/jquery-2.0.3.min.js"></script> -->
  </body>
</html>
