var cardListRef = database.ref("/card");
var tagListRef = database.ref("/tag");
var tagStatsRef = database.ref("/tagstats");
var popularTagListRef = database.ref("/popular-tag");
var popularCardListRef = database.ref("/popular-card");

var cardsUnionTags = []

var tagBtn = false;

/* create_cards: create event 하는 modal */
var create_cards = document.getElementById('create_cards');
/* create: + 버튼 */
var create = document.getElementById("create") || [];
var tag_statistics = document.getElementsByClassName('modal');
var tag = document.getElementsByClassName("tag");
/* closeButtons: modal 안의 X버튼 */
var closeButtons = document.getElementsByClassName("close");
var card_detail_modal = document.getElementById("card-detail-modal");
var card_detail_content = document.getElementById("card-detail-content");
var content_detail = document.getElementById("contents_detail");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  for (i=0;i<tag_statistics.length;i++){
    if (event.target == tag_statistics[i]) {
        tag_statistics[i].style.display = "none";
    }
  }
  if (event.target == create_cards){
    create_cards.style.display = "none";
  }
  if (event.target == card_detail_modal){
    card_detail_modal.style.display = "none";
  }
}

create.onclick = function() {
  create_cards.style.display = "block";
}



for (i=0;i<closeButtons.length;i++){
  closeButtons[i].onclick = function() {
    create_cards.style.display = "none";
    card_detail_modal.style.display = "none";
  }
}

/* ----------------------------------------------------------------------- */


function shorten(contents) {
  var threshold = 130;
  if (contents.length > threshold) {
    return contents.substr(0, threshold).concat(" ... ")
  } else {
    return contents
  }
}

function render_html_card(type, cardref, taglist){
  //load tags in all cards

  for (i=0;i<taglist.length;i++){
    if (!(cardsUnionTags.includes(taglist[i]))){
      cardsUnionTags.push(taglist[i]);
      get_tagstats_from_db(taglist[i]);
    }
  }


  var key = cardref.key;
  var title = cardref.val().title;
  var summary = cardref.val().summary;
  var date = cardref.val().date;
  var domLike = cardref.val().domesticLike;
  var excLike = cardref.val().exchangeLike;

  var summary_shortened = shorten(summary);
  var cardWidthClass = "card-width";
  cardWidthClass = type + "-" + cardWidthClass;

  var card_tagPart_html = ``;
  for (var i in taglist) {
    card_tagPart_html +=
      `
      <div class="tag">
        <h4 class = 'tag-name'> ${taglist[i]} </h4>
      </div>
      `
  }
  var card_html = 
    `
    <div class="row ${cardWidthClass}" onclick="display_card_detail_modal(this)" id="${key}">
      <div class="col-sm-8" >
        <card-title> ${title} </card-title> 
        <div class="tags_bar">`
        + card_tagPart_html +
        `
        </div>
        <card-content class="card-content"> ${summary_shortened}</card-content> 
      </div>
      <div class="col-sm-4" >  
        <div class="date_bar">
          <i class="far fa-calendar-alt"></i> ${date}
        </div>
        <div class="like_bar">
          <i class="far fa-thumbs-up"></i> Domestic: ${domLike} <br>
          <i class="far fa-thumbs-up"></i> Exchange: ${excLike}
        </div> 
      </div>
    </div>
    `

  if (type == "popular") {
  	$('#popular-event-list').append(card_html)
  } else if (type == "feed") {
  	$('.event-list').append(card_html)
  }
  
}

function close_card_detail_modal(){
  card_detail_modal.style.display = "none";
}


function update_card_detail_contents (title, date, taglist, summary, translate, liked, key) {
  var tag_html=``;
  var clicked="";
  var likedIcon="";
  for (i=0; i<taglist.length; i++){
    tag_html = tag_html + `
                <div class="tag">
                  <h4 class='tag-name'> ${taglist[i]} </h4>
                </div>`
    }
  if (liked=="false"){
    clicked="notClicked";
    likedIcon="far fa-heart";
  }
  else {
    clicked="Clicked";
    likedIcon="fas fa-heart";
  }
  card_detail_content.innerHTML = `
            <span class="close" onclick="close_card_detail_modal()">&times;</span>
            <div id="content_title" class="content_title"> ${title} </div>
            <div> <hr class="hr-content"> </div>
              <div class="tags_bar_content">`+ tag_html +
            `<div class="translate_box">
              <p class="translate"> TRANSLATE </p>
              <label class="switch">
                <input type="checkbox" id="toggle" value="OFF" onclick="toggle(this)">
                <span class="slider round">
                  <div id=summary_hide style="display:None;"> ${summary} </div>
                  <div id=translate_hide style="display:None;"> ${translate} </div>
                </span>
              </label>
            </div>
          </div>
        <div class="contents_date"><i class="far fa-calendar-alt"></i> ${date} </div>
        <div class="contents_detail" id="contents_detail">
          ${summary}
        </div>
        <hr class="hr-content">
        <div>
          <button class="show_interest" id="interest" value="${clicked}" onclick="show_interest(this)"> <i class=" ${likedIcon} "></i> </button>
          <div id="interest_key" style="display:None;">${key}</div>
        </div>
      </div>
     `
}

function display_card_detail_modal(card) {
  if (tagBtn == true) {
    card_detail_modal.style.display = "none";
    tagBtn = false;
    return;
  }
  if (card_detail_modal.style.display === "none") {
      card_detail_modal.style.display = "block";
  }
  var title;
  var date;
  var tags;
  var summary;
  var translate;
  var liked;
  var key = card.id;
  cardListRef.once('value', function(snapshot){
    snapshot.forEach(function(x) {
      if (x.key == key){
        var taglist=[]
        title = x.val().title
        date = x.val().date
        tags = x.val().tags
        summary = x.val().summary
        translate = x.val().translate
        liked = x.val().liked
        var values = Object.keys(x.val().tags).map(function(key){
          taglist.push(x.val().tags[key].value)
        })
        update_card_detail_contents (title, date, taglist, summary, translate, liked, key);
      }  
    })
  })
}

function get_tagstats_from_db(mytag){
	var tagStatRef = database.ref("/tagstats/" + mytag);
  return tagStatRef.once('value', function (snapshot) {
  	if (!snapshot.exists()) {
  		loadTagStatsNull(mytag);
  	} else {
  		var age = []
  		var value = snapshot.val();
  		age.push(value.age0)
  		age.push(value.age1)
  		age.push(value.age2)
  		age.push(value.age3)
  		age.push(value.age4)
  		age.push(value.age5)

      loadTagStats(snapshot, mytag, age);
  	}
  })
}


function close_create_event_modal() {
  create_cards.style.display = "none";
}

//toggle translate button
function toggle(button) {
  var content_detail = document.getElementById("contents_detail");
  var summary = document.getElementById("summary_hide").innerText;
  var translate = document.getElementById("translate_hide").innerText;
  if (button.value == "OFF") {
    button.value = "ON";
    content_detail.innerHTML=translate;
    
  } else {
    button.value = "OFF";
    content_detail.innerHTML=summary;
  }
}

function show_interest(button) {
  var key = document.getElementById("interest_key").innerText;
  var updates = {};
  var btn_val = "";
  var btn_icon = "";
  var additional_like = 0;
  var liked_val = "";

  if (button.value == "notClicked"){
    btn_val = "Clicked";
    btn_icon = "<i class=\"fas fa-heart\"></i>";
    additional_like = 1;
    liked_val = "true";
  }
  else {
    btn_val = "notClicked";
    btn_icon = "<i class=\"far fa-heart\"></i>";
    additional_like = -1;
    liked_val = "false";
  }

  cardListRef.once('value', function(snapshot){
      snapshot.forEach(function(x) {
        if (x.key === key){
          var like = x.val().exchangeLike;
          button.value = btn_val;
          button.innerHTML = btn_icon;
          updates[key+'/exchangeLike'] = like+additional_like;
          updates[key+'/liked'] = liked_val;
          return cardListRef.update(updates);
        }  
      })
    })
  }


