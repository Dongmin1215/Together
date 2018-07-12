
// -------------- General initialization -------------- //
var systemTags = []
db_fetch_all_system_tags()



// -------------- Database functions -------------- //
function db_create_new_card(title, summary, timestamp, domLike, excLike, tags) {
  var newCardRef = cardListRef.push();
  newCardRef.set({
    title: title,
    summary: summary,
    date: timestamp,
    domesticLike: domLike,
    exchangeLike: excLike,
  });
  var tagListRef = newCardRef.child('tags');
  for (var i in tags) {
    var newTagRef = tagListRef.push();
    newTagRef.set({
      value: tags[i]
    })
  }
}

function db_create_new_tag(tagname) {
  var newTagRef = tagListRef.push();
  newTagRef.set({
    value: tagname
  })
}

function db_fetch_all_system_tags() {
  return tagListRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childValue = childSnapshot.val().value;
      systemTags.push(childValue)
    })
  })
}

function db_fetch_all_events_and_filter_and_render(){
  $('.event-list').html('')
  var eventList = []

  cardListRef.once('value', function(snapshot){
    snapshot.forEach(function(x) {
      var taglist = []
      var values = Object.keys(x.val().tags).map(function(key){
        taglist.push(x.val().tags[key].value)
      })
      eventList.push({"eventRef":x, "tagList":taglist});
    })

    userTags.reverse()

    for (var i = 0; i < userTags.length; i += 1) {
      var removeIndexList = []
      var currentTag = userTags[i]
      for (var j = 0; j < eventList.length; j += 1) {
        var eventRef = eventList[j]["eventRef"];
        var tagList = eventList[j]["tagList"];
        if (tagList.includes(currentTag)) {
          render_html_card("feed", eventRef, tagList)
          removeIndexList.push(j)
        }
      }
      removeIndexList.reverse()
      for (var n = 0; n < removeIndexList.length; n += 1) {
        eventList.splice(removeIndexList[n], 1)
      }
    }
    userTags.reverse()
  })
}


// -------------- JQuery widget implementation (autocomplete, datepicker) -------------- //
$('#create-tags1').autocomplete({
  source: systemTags,
  minLength: 0,
  select: function(event, ui) {
    document.getElementById('create-tags1').value = ui.item.value
  }
}).on("focus", function () {
    $(this).autocomplete("search");
});

$('#create-tags2').autocomplete({
  source: systemTags,
  minLength: 0,
  select: function(event, ui) {
    document.getElementById('create-tags2').value = ui.item.value
  }
}).on("focus", function () {
    $(this).autocomplete("search");
});

$('#create-tags3').autocomplete({
  source: systemTags,
  minLength: 0,
  select: function(event, ui) {
    document.getElementById('create-tags3').value = ui.item.value
  }
}).on("focus", function () {
    $(this).autocomplete("search");
});

$(function() {
  $("#create-datepicker").datepicker({
    showButtonPanel: true,
    currentText: 'today',
    minDate: 0
  });
});

// -------------- Click listeners -------------- //
$('#tagSearchBarSubmit').click(function () {
  var tagName = document.getElementById('tagSearchBar').value
  if (systemTags.includes(tagName)) {
    if (userTags.includes(tagName)){
      alert(tagName + " is already in your tag list. \nPlease enter a different tag." )
    }
    else{
      userTags.push(tagName)
      db_update_user_tag_list()
      render_html_user_tag_list()
    }
  } else {
    alert("The tag you typed doesn't exist. \nPlease use autocomplete to type a valid tag.")
    document.getElementById('tagSearchBar').value = ''

  }
})

/* This code is for checking validity of fields and showing the feedback of create page */
window.addEventListener('load', function() {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity() || !check_tag_validity_in_create()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);

$('#create-form').submit(function() {
  var fields_for_checking = []

  var create_title = document.getElementById("create-title").value
  var create_detail = document.getElementById("create-detail").value
  var create_datepicker = document.getElementById("create-datepicker").value
  var create_tags1 = document.getElementById("create-tags1").value
  var create_tags2 = document.getElementById("create-tags2").value
  var create_tags3 = document.getElementById("create-tags3").value

  fields_for_checking.push(create_title)
  fields_for_checking.push(create_detail)
  fields_for_checking.push(create_datepicker)
  fields_for_checking.push(create_tags1)

  for (var i in fields_for_checking) {
    if (fields_for_checking[i] == "") {
      return;
    }
  }

  var tags = get_tags_in_create()
  if (!check_tag_validity_in_create(tags)) {
    alert("The tags you entered don't exist. Please use dropdown to choose existing tags.")
    return;
  }

  db_create_new_card(create_title, create_detail, create_datepicker, 5, 23, tags)
})

function get_tags_in_create() {
  var create_tags1 = document.getElementById("create-tags1").value
  var create_tags2 = document.getElementById("create-tags2").value
  var create_tags3 = document.getElementById("create-tags3").value
  var tags = []
  tags.push(create_tags1)
  if (create_tags2 != "") {
    tags.push(create_tags2)
  }
  if (create_tags3 != "") {
    tags.push(create_tags3)
  }
  return tags;
}

function check_tag_validity_in_create(tags = null) {
  if (tags == null) {
    tags = get_tags_in_create();
  }

  for (var i in tags) {
    if (!systemTags.includes(tags[i])) {
      return false;
    }
  }
  return true;
}

