const fs = require("fs");
const path = require("path");
const minify = require("html-minifier").minify;

const SHOW_DELAY_MS = 3000;
class DOMParser {} // not available in NodeJS

try {
  const html = fs.readFileSync(path.join(__dirname, "document.html"), "utf-8");
  const minifiedHtml = minify(html, {
    collapseWhitespace: true,
    minifyCSS: true,
    quoteCharacter: "'",
  });

  const script = function () {
    var parser = new DOMParser();
    var el = parser.parseFromString(`__minifiedHtml__`, "text/html");

    setTimeout(() => {
      document
        .querySelector("body")
        .insertAdjacentElement("beforeend", el.body.firstChild);

      var wrapper = document.querySelector(".re");
      var closeEl = document.querySelector(".re_close");
      var panel = document.querySelector(".re_c");

      var openFunc = function (e) {
        e.stopPropagation();
        wrapper.classList.remove("closed");
        panel.removeEventListener("click", openFunc);
        closeEl.addEventListener("click", closeFunc);
      };

      var closeFunc = function (e) {
        e.stopPropagation();
        wrapper.classList.add("closed");
        closeEl.removeEventListener("click", closeFunc);
        panel.addEventListener("click", openFunc);
      };

      closeEl.addEventListener("click", closeFunc);
    }, __SHOW_DELAY_MS__);
  };

  const res = script
    .toString()
    .replace("__minifiedHtml__", minifiedHtml)
    .replace("__SHOW_DELAY_MS__", SHOW_DELAY_MS);

  const minifiedScript = minify("(" + res + ")()", {
    collapseWhitespace: true,
    minifyJS: true,
  });

  fs.writeFileSync(path.join(__dirname, "dist", "script.js"), minifiedScript);

  console.log("Built successfully!");
} catch (e) {
  console.log("Something went wrong: " + e);
}
