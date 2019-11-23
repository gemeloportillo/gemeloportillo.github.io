
window.onscroll = function() {myFunction(), myFunction2()};

var navbar = document.getElementById("navbar");
var searchContainer = document.getElementById("searchContainer");
var iconsContainer = document.getElementById("iconsContainer")
var sticky = navbar.offsetTop;
var stickySearch = searchContainer.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    
  } else {
    navbar.classList.remove("sticky");
  }
}
function myFunction2() {
  if (window.pageYOffset >= stickySearch) {
    searchContainer.classList.add("sticky");
    iconsContainer.classList.add("sticky");
  } else {
    searchContainer.classList.remove("sticky");
    iconsContainer.classList.remove("sticky");
  }
}            



function hideMenuElements() {
var x = document.getElementById("main-menu");
if (x.className === "topnav") {
  x.className += " responsive";
} else {
  x.className = "topnav";
}
}
