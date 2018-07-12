//piechart
function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}
function addSlice(sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  $("."+sliceID).css({
    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
  });
  $("."+sliceID+" span").css({
    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
    "background-color": color
  });
}
function iterateSlices(tag, version, sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = tag+"-"+version+"-"+"s"+dataCount+"-"+sliceCount;
  var maxSize = 179;
  if(sliceSize<=maxSize) {
    addSlice(sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(maxSize, pieElement, offset, sliceID, color);
    iterateSlices(tag, version, sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}

var color = [
  "#F4CFB0",
  "#F4CCCC",
  "#CD5C5C",
  "#aaa",
  "FA8072"
]
var color2 = [
  "CornflowerBlue", 
  "OliveDrab", 
  "orange", 
  "tomato", 
  "crimson", 
  "purple", 
  "turquoise", 
  "forestgreen", 
  "navy", 
  "gray"
];


function createPie(tag, version, dataElement, pieElement) {
  var listData = [];
  
  //discard repetition: from here
  var idx_rep_init=[];
  var n;
  $(dataElement+" span").each(function() {
    var ele = Number($(this).html());
    listData.push(ele);
  });
  var listData_length = listData.length;
  var listRemain = listData.slice(1,listData_length);
  if (listRemain.includes(listData[0])){
    for (i=0;i<listRemain.length;i++){
      if (listData[0]==listRemain[i]){
        idx_rep_init.push(i+1);
        break;
      }
    }
  }
  var rep_length=idx_rep_init[0];
  var isReplicated = 1;
  for(i=0;i<rep_length;i++){
    if (listData[i]!=listData[idx_rep_init[0]+i]){
      isReplicated =0;
    }
  }
  if(isReplicated){
    listData=listData.slice(0,idx_rep_init[0]);
  }
  // to here
  
  var listTotal = 0;
  for(var i=0; i<listData.length; i++) {
    listTotal += listData[i];
  }
  var offset = 0;
  for(var i=0; i<listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(tag, version, size, pieElement, offset, i, 0, color[i]);
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
    offset += size;
  }
}

function showStatistics(mytagObject) {
  mytag=mytagObject.innerHTML.toString().split('<')[3].split('>')[1].split(" ")[1];
  var x = document.getElementById("tag_statistics_"+mytag);
  if (x.style.display === "none") {
      x.style.display = "block";
  }
  tagBtn = true
}

function hideStatistics(){
  var x = document.getElementsByClassName("modal");
  for (i=0;i<x.length;i++){
    if (x[i].style.display == "block"){
      x[i].style.display="none";
    }
  }
}

function loadTagStats(tagref, tag, age){
  var totalNum=0;
  var ageNum=age.slice();
  for (i=0;i<age.length;i++){
    totalNum +=age[i];
  }
  for (i=0;i<age.length;i++){
    age[i] =(age[i]/totalNum*100).toString()+"%";
    ageNum[i]=ageNum[i].toString();
  }
    $('.tag-stats').append(
      `
      <div id="tag_statistics_${tag}" class="modal" style="display:None;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${tag}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="hideStatistics()" >
              <span aria-hidden="true" style="float: right;">&times;</span>
            </button>
          </div>
          <div class="row" style="box-shadow: 0px 0px 0px 0px rgba(0,0,0,0); margin-left:50px; margin-right:20px; height:30%;"> 
            <div class="col-sm-6">
            <i class="fa fa-angle-double-right"></i> Gender <br>
              <section style="margin-top:50px">
                <div id="${tag}" class="pieID  1 pie"> 
                </div>
                <ul id="${tag}" class="pieID 1 legend">
                  <li>
                    <em>male</em>
                    <span>${tagref.val().male}</span>
                  </li>
                  <li>
                    <em>female</em>
                    <span>${tagref.val().female}</span>
                  </li>
                </ul>
              </section>
            </div>
            <div class="col-sm-6">
            <i class="fa fa-angle-double-right"></i> Academic Status <br>
              <section style="margin-top:50px">
                <div id="${tag}" class="pieID 2 pie"> 
                </div>
                <ul id="${tag}" class="pieID  2 legend">
                  <li>
                    <em>undergraduate</em>
                    <span>${tagref.val().undergraduate}</span>
                  </li>
                  <li>
                    <em>graduate</em>
                    <span>${tagref.val().graduate}</span>
                  </li>
                  <li>
                    <em>post-doc</em>
                    <span>${tagref.val().postdoc}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div class="row" style="box-shadow: 0px 0px 0px 0px rgba(0,0,0,0); margin-left:50px; margin-right:20px; height:50%;"> 
            <div class="col-sm-1">
            <i class="fa fa-angle-double-right" style="margin-top:150px;"></i> Age <br>
            </div>
            <div class="col-sm-11">
              <section style="margin-left:0px; ">
                <ul class="chart">
                  <li>
                    <span class="bar" style="height:${age[0]}" title="11-14" >
                      <div class="showme">${ageNum[0]}</div>
                    </span>
                  </li>
                  <li>
                    <span class="bar" style="height:${age[1]}" title="15-19" >
                      <div class="showme">${ageNum[1]}</div>
                    </span>
                  </li>
                  <li>
                    <span class="bar" style="height:${age[2]}" title="20-24">
                      <div class="showme">${ageNum[2]}</div>
                    </span>
                  </li>
                  <li>
                    <span class="bar" style="height:${age[3]}" title="25-29">
                      <div class="showme">${ageNum[3]}</div>
                    </span>
                  </li>
                  <li>
                    <span class="bar" style="height:${age[4]}" title="30-34">
                      <div class="showme">${ageNum[4]}</div>
                    </span>
                  </li>
                  <li>
                    <span class="bar" style="height:${age[5]}" title="35-39">
                      <div class="showme">${ageNum[5]}</div>
                    </span>
                  </li>
                </ul>    
              </section>
            </div>
          </div>

        </div>
      </div>
      `
    )
    createPie(tag, '1', "#"+tag+".pieID.1.legend", "#"+tag+".pieID.1.pie");
    createPie(tag, '2', "#"+tag+".pieID.2.legend", "#"+tag+".pieID.2.pie");
  }

function loadTagStatsNull(tag){
  $('.tag-stats').append(
    `
    <div id="tag_statistics_${tag}" class="modal" style="display:None;">
      <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title">${tag}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="hideStatistics()" >
          <span aria-hidden="true" style="float: right;">&times;</span>
        </button>
        </div>
      <p style="margin-left:10px; margin-top:30px;">  Statistical Information Is Not Available At The moment . Please Refer To DB </p>
      </div>
    </div>
    `
  )
}