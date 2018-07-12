
var userTagListRef = database.ref("/usertag");
//alert empty tag
var tagAlert = document.getElementById("tag-alert");
var userTags = []
db_fetch_all_user_tags()
db_fetch_all_events_and_filter_and_render()



function db_fetch_all_user_tags(){
  userTagListRef.once('value', function (snapshot){
    snapshot.forEach(function (childSnapshot){
      var childValue = childSnapshot.val().value;
      userTags.push(childValue)
      //$('.taglists').after('<button type = "button" class = "btn tags" id = ' + childValue + '> <i class = "fa fa-close"> </i> <h4 class = "tag-name"> ' + childValue +'</h4> </button>')        
      })
    
    for (var i = userTags.length-1; i>-1; i--){
      $('.taglists').append('<button type = "button" class = "btn tags" id = ' + userTags[i] + '> <i class = "fa fa-close"> </i> <h4 class = "tag-name"> ' + userTags[i] +'</h4> </button>') 
    }

    $(".se-pre-con").fadeOut("fast");

    $('.fa.fa-close').click(function() {
      var index = userTags.indexOf($(this).parent().attr('id'));
      if (index !== -1) {
        userTags.splice(index, 1);
      }
      db_update_user_tag_list()
      render_html_user_tag_list()
      change_stat_of_modal_for_tag_alert()
    })
  change_stat_of_modal_for_tag_alert()
  })
}

// tagname: string of user tag list
// Connection between usertag(= tagname) and DB
function db_update_user_tag_list(){
  userTagListRef.remove()
  for (var i = 0; i < userTags.length; i += 1){
    var newUserTag = userTagListRef.push()
    newUserTag.set({
      value: userTags[i]
    })
  }
  change_stat_of_modal_for_tag_alert()
}

// -------------- JQuery widget implementation (autocomplete, datepicker) -------------- //
$('#tagSearchBar').autocomplete({
  source: systemTags,
  minLength: 0,
  select: function(event, ui) {
    document.getElementById('tagSearchBar').value = ui.item.value
    ui.item.value = ''
    $('#tagSearchBarSubmit').click()
  }
}).on("focus", function () {
    $(this).autocomplete("search");
});

function render_html_user_tag_list() {
  $('.taglists').html('')
  for (var i= userTags.length-1; i > -1; i--){
    $('.taglists').append('<button type = "button" class = "btn tags" id = ' + userTags[i] + '> <i class = "fa fa-close"> </i> <h4 class = "tag-name"> ' + userTags[i] +'</h4> </button>')
  }
  
  db_fetch_all_events_and_filter_and_render()
  change_stat_of_modal_for_tag_alert()
  $('.fa.fa-close').click(function() {
    var index = userTags.indexOf($(this).parent().attr('id'));

    if (index !== -1) {
      userTags.splice(index, 1);
    }
    db_update_user_tag_list()
    render_html_user_tag_list()
    change_stat_of_modal_for_tag_alert()
  })
}



function change_stat_of_modal_for_tag_alert(){
  if(userTags.length==0){
    tagAlert.style.display = "block";
  }
  else{
    tagAlert.style.display = "none";
  }
}

