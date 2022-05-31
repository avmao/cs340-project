function updateSpell(spell_id) {
    $.ajax({
        url: "/spell/" + spell_id,
        type: "PUT",
        data: $("#update_spell").serialize(),
        success: function (result) {
            window.location.replace("./");
        },
    });
    window.location.reload();
}