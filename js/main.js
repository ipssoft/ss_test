$(document).ready(function(){
  console.log('start');
  var arrow_dw = document.querySelectorAll(".arrow");
  var i;

  var b = document.querySelector("#create-root");
  b.addEventListener("click", clickCreateRoot);

  var d = document.querySelector("#delete-all");
  if (d) {
    d.addEventListener("click", clickDeleteAll);
  }

  $.get("php/db.php",{type:"get_root"}, loadRoot);
})

function clickAddNode(data){
  let a = this.parentNode;
  var d = BootstrapDialog.show({
      title: 'Add node',
      message: 'Edit node name: <input type="text" class="form-control">',
      type: BootstrapDialog.TYPE_DEFAULT,
      size: BootstrapDialog.SIZE_LARGE,
      onhide: function(dialog){
      },
      buttons: [
        {
              label: 'Yes I am',
              cssClass: 'btn-primary' ,
              // cssClass: 'btn-primary',
              id: 'byes',
              action: function(dialog) {
                let t = dialog.getModalBody().find('input').val();
                if(t == ""){
                  t = "--undef--";
                }
                let arrow = a.querySelector(".arrow");
                let arrow_dw = a.querySelector(".arrow-dw");
                let p_id = a.getAttribute("data-id");
                $.get("php/db.php",{type:"add_node", name:t, node_id: p_id}, function(data){
                  let res = JSON.parse(data);
                  let out = '';
                  if((arrow == null) && (arrow_dw == null)){
                    out = '<i class="arrow-dw" id=a"' + res[0] + '" data-open = 1>&#xf0da </i>';
                    out += $(a).html();
                    $(a).html(out);
                  }else{
                    if(arrow){
                      arrow.setAttribute('data-open', 1);
                      arrow.className = 'arrow-dw';
                    }
                  }
                  let ul = a.querySelector('#child');
                  loadNodeChild(ul);
                  out = addNodeChild(res[0], t, 0);
                  out = $(ul).html() + out;
                  $(ul).html(out);
                  ul.className = "child-open";

                  setAllListener(a);
                });

              dialog.close();
            }
        }, {
              label: 'No',
              cssClass: 'btnDialog' ,
              id: 'bno',
              action: function(dialog) {
                dialog.close();
              }
      }]
  });
}

function clickEditNode(data){
  let li = this.parentNode;
  var t, curNode;
  for (var i = 0; i < li.childNodes.length; i++) {
      curNode = li.childNodes[i];
      if (curNode.className === "item-text") {
          t = curNode.innerText;
          break;
      }
  };
  var d = BootstrapDialog.show({
      title: 'Edit node',
      message: 'Edit node name: <input type="text" class="form-control">',
      type: BootstrapDialog.TYPE_DEFAULT,
      size: BootstrapDialog.SIZE_LARGE,
      onshow:function(dialog){
        dialog.getModalBody().find('input').val(t);
      },
      buttons: [
        {
              label: 'Yes I am',
              cssClass: 'btn-primary' ,
              // cssClass: 'btn-primary',
              id: 'byes',
              action: function(dialog) {
                 let id = li.getAttribute("data-id");
                 let t = dialog.getModalBody().find('input').val();
                 $.get("php/db.php",{type:"update_node", name:t, node_id: id}, function(data){
                   curNode.innerText= t;
                 });
                 dialog.close();
              }
        }, {
              label: 'No',
              cssClass: 'btnDialog' ,
              id: 'bno',
              action: function(dialog) {
                 dialog.close();
              }
      }]
  });
}

function clickDeleteNode(data){
  var node_id = this.getAttribute("data-id");
  let li = this.parentNode;
  BootstrapDialog.show({
    type: BootstrapDialog.TYPE_DEFAULT,
    size: BootstrapDialog.SIZE_LARGE,
    title: 'Delete confirmation',
    bootom:'qq',
    message: "This is very dangerous, you shouldn't do it! Are you really really sure?",
    buttons: [{
      label: '',
      cssClass: 'btnCountDw' ,
      id: 'caption'
    },
    {
        label: 'Yes I am',
        cssClass: 'btn-primary',
        action: function(dialog) {
          let id = li.getAttribute("data-id");
          let root = li.getAttribute("data-root");
          if(root){
            clickDeleteAll();
          }else{
            $.get("php/db.php",{type:"del_node", node_id: id}, function(data){
                li.remove();
            });
          }
          dialog.close();
       }
    }, {
        label: 'No',
        action: function(dialog) {
          dialog.close();
        }
    }],
    onshow:function(dialog){
      var secs = 21;
      var btn = dialog.getButton('caption');
      btn.disable();
      btn.text(secs);
      var update = function() {
          --secs;
          btn.text(secs);
          if(secs <= 0){
            dialog.close();
          }
      };
      update();
      setInterval(update, 1000);
    }
  });
}

function clickCreateRoot(data){
  $.get("php/db.php",{type:"add_node", name:'root', node_id: null}, function(data){
    $.get("php/db.php",{type:"get_root"}, loadRoot);
  });
}

function clickDeleteAll(data){
  $.get("php/db.php",{type:"del_all"}, function(data){
    $('#ss-tree').html("");
  });
}
