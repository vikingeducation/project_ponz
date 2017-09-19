$(document).ready(() => {
  trianglePlacer();
	$(window).resize(() => {
    trianglePlacer();
  });
});

const trianglePlacer = function(){
  let $left = $(".triangle-left");
  let $right = $(".triangle-right");
  let triContainer = $(".pyramid-container");
  let width = triContainer.width()/2
  let height = triContainer.height()
  $left.css({"border-width": `${height}px ${width}px 0 0`})
  $right.css({"border-width": `0 ${width}px ${height}px 0`})
  }