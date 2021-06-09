function addNodeChild(id, name, p_id, child){
  var out = '';
  out+= '<li class="item" data-p_id='+ p_id + ' data-id = '+id+'>';
  if(child > 0){
    out+=        '<i class="arrow" id="a' + id + '" >&#xf0da </i>';
  }
  out+= '<div class="item-text" data-id="' + id + '">' + name + '</div>';
  out+= '<button type="button" class="btn1" id ="badd" data-id = "'+ id + '">+</button>';
  out+= '<button type="button" class="btn1" id ="bdel" data-id = "'+ id + '">-</button>';
  // if(child > 0){
    out+='<ul class= "child-close" id="child" data-id="' + id + '">';
    out+='</ul>'
  // }
  out+= '</li>';
  return out;
}

function setAllListener(obj){
  var arrow = obj.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", clickToArrow);
  }

  var arrow_dw = obj.querySelectorAll(".arrow-dw");
  for (var i = 0; i < arrow_dw.length; i++) {
    arrow_dw[i].addEventListener("click", clickToArrow);
  }

  var itext = obj.querySelectorAll(".item-text");
  for (var i = 0; i < itext.length; i++) {
    itext[i].addEventListener("click", clickEditNode);
  }

  var badd = obj.querySelectorAll("#badd");
  for (var i = 0; i < badd.length; i++) {
    badd[i].addEventListener("click", clickAddNode);
  }

  var bdel = obj.querySelectorAll("#bdel");
  for (var i = 0; i < bdel.length; i++) {
    bdel[i].addEventListener("click", clickDeleteNode);
  }
}

function loadNodeChild(ul_list){
  var nodeid = ul_list.getAttribute("data-id");
  $.get("php/db.php",{type:"get_child", node_id: nodeid}, function(data){
    let a= JSON.parse(data);
    var out = '';
    for(var i = 0; i < a.length; i++){
      out += addNodeChild(a[i]['id'], a[i]['name'], a[i]['p_id'], a[i]['child']);
    }
    $(ul_list).html(out);
    setAllListener(ul_list);
  });
}

function loadRoot(data){
  let a= JSON.parse(data);
  if ( a == null) return;

  var child = a[3] > 0;
  var out = '';

  out+=  '<ul  class="item-list" data-id = '+a[0]+'>';
  out+=    '<li class="item-root" data-id=1 data-root=true>';
  if(child){
    out+=        '<i class="arrow" id=a"' + a[0] + '" >&#xf0da </i>';
  }
  out+= '<div class="item-text" data-id="' + a[0] + '">' + a[1] + '</div>';
  out+=        '<button type="button" class="btn1" id ="badd" data-id = "'+ a[0] + '">+</button>';
  out+=        '<button type="button" class="btn1" id ="bdel" data-id = "'+ a[0] + '">-</button>';
  out+='<ul class= "child-close" id="child" data-id="' + a[0] + '">';
  out+='</ul>'
  out+=    '</li>';
  out+=  '</ul>';

  $('#ss-tree').html(out);

  let ul = document.querySelector(".item-list");
  setAllListener(ul);
}

function clickToArrow(data){
  let a = this.parentNode;
  var b;
  for (var i =0; a.children.length - 1; i++){
    // console.dir(a.children[i]);
      if(a.children[i].tagName == 'UL'){
        b = a.children[i];
        break;
      }
  }
  if(this.getAttribute('data-open') == 1){
    setClass(this, "arrow");
    setClass(b, "child-close")
    this.setAttribute('data-open', 0);
    $(b).html('');
  }else{
    setClass(this, "arrow-dw");
    setClass(b, "child-open")
    this.setAttribute('data-open', 1);
    loadNodeChild(b);
  }
}

function setClass(cl, newName){
  if(cl != null){
    cl.className = newName;
  }
}
