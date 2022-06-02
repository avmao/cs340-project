function updateSpell(i) {
    id = document.getElementById("update_spell_id").value;
    window.location = "/spell/update/" + encodeURI(id);
}