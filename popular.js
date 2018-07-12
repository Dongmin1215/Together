
// -------------- General initialization -------------- //
db_fetch_all_popular_tags()
db_fetch_all_popular_cards()

function db_fetch_all_popular_tags() {
  return popularTagListRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var tagName = childSnapshot.val().value;
      render_html_popular_tag(tagName)
      get_tagstats_from_db(tagName)
    })
  })
}

function db_fetch_all_popular_cards() {
  return popularCardListRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {

      var childValue = childSnapshot.val().value;

      var key = childSnapshot.key;
      var title = childSnapshot.val().title;
      var summary = childSnapshot.val().summary;
      var date = childSnapshot.val().date;
      var domLike = childSnapshot.val().domesticLike;
      var excLike = childSnapshot.val().exchangeLike;

      var taglist = []
      var values = Object.keys(childSnapshot.val().tags).map(function(key){
        taglist.push(childSnapshot.val().tags[key].value)
      })

      render_html_card("popular", childSnapshot, taglist)
    })
    $(".se-pre-con").fadeOut("fast");
  })
}

function render_html_popular_tag(tagName) {
  $('#popular-tag-list').append(
    `
    <button type = "button" class = "btn tags" onclick="showStatistics(this)" id = "${tagName}">
    <i class="far fa-chart-bar"></i>
    <h4 class = "tag-name"> ${tagName} </h4> </button>
    `
  )
}


function add_tagstats(tag, male, female, undergraduate, graduate, postdoc, age0, age1, age2,age3,age4, age5) {
  var newTagStatRef = tagStatsRef.push();
  newTagStatRef.set({
    tag: tag,
    male: male,
    female: female,
    undergraduate: undergraduate,
    graduate: graduate,
    postdoc: postdoc,
    age0:age0, //10-14
    age1: age1, //15-19
    age2: age2, //20-24
    age3: age3, //25-29
    age4: age4, //30-34
    age5: age5, //35-39
  });
}


