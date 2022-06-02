function deleteSpell(id) {
    $.ajax({
        url: "/spell/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}

function deleteClass(id) {
    $.ajax({
        url: "/class/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}

function deleteMaster(id) {
    $.ajax({
        url: "/master/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}

function deleteStudent(id) {
    $.ajax({
        url: "/student/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}

function deleteMasterSpell(id) {
    $.ajax({
        url: "/master_spell/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}

function deleteStudentSpell(id) {
    $.ajax({
        url: "/student_spell/" + id,
        type: "DELETE",
        success: function (result) {
            window.location.reload(true);
        },
    });
}