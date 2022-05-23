function filterPeopleByHomeworld() {
    //get the id of the selected homeworld from the filter dropdown
    var homeworld_id = document.getElementById('homeworld_filter').value
    //construct the URL and redirect to it
    window.location = '/people/filter/' + parseInt(homeworld_id)
}
