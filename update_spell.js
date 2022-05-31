function updateSpell(id){
    $.ajax({
        url: '/spell/' + id,
        type: 'PUT',
        data: $('#update-spell').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};