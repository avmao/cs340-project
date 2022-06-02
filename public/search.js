function searchSpell() {
  var search_input = document.getElementById("search_input").value;
  window.location = "/spell/search/" + encodeURI(search_input);
}