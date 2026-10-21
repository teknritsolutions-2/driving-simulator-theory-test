(function () {
  try {
    var t = localStorage.getItem("dl-theme") || "light",
      d = localStorage.getItem("dl-dir") || "ltr";
    document.documentElement.dataset.theme = t;
    document.documentElement.dir = d;
  } catch (e) {}
})();
