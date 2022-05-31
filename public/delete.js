function deleteSpell(id) {
    $.ajax({
        url: "/spell/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}