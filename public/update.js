function updateSpell(id) {
    $.ajax({
      url: "/spell/" + id,
      type: "PUT",
      data: $("#update_spell").serialize(),
      success: function (result) {
        window.location.replace("./");
      },
    });
    window.location.reload();
  }