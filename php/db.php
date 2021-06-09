
<?php
$host = 'localhost';
$dbuser = 'root';
$dbpass = '123456';
$dbname = 'ss_test';

$type = $_GET["type"];

$conn = connectDB($host, $dbuser, $dbpass, $dbname);

switch ($type) {
  case 'get_node':
    $res = get_node($conn, $_GET["node_id"]);
    echo $res;
  break;
  case 'get_child':
    $res = get_child($conn, $_GET["node_id"]);
    echo $res;
  break;
  case 'get_root':
    $res = get_node($conn, 1);
    echo $res;
  break;
  case 'del_node':
    $res = del_node($conn, $_GET["node_id"]);
    echo $res;
  break;
  case 'add_node':
    $res = add_node($conn,$_GET["name"], $_GET["node_id"]);
    echo $res;
  break;
  case 'update_node':
    $res = update_node($conn, $_GET["name"], $_GET["node_id"]);
    echo $res;
  break;
  case 'del_all':
    $res = del_all($conn);
    echo $res;
  break;
  default:
    // code...
    echo "unknown " + $type;
    break;
}

function del_all($conn){
  $query = 'delete from tree;';
  $query.= 'alter table tree AUTO_INCREMENT = 1;';
  $res = 0;
  if(mysqli_multi_query($conn, $query)){
    $res= 1;
  };
  mysqli_close($conn);
  return json_encode($res);
}

function update_node($conn, $name, $node_id){
  $query = 'update tree set ';
  $query.='name= "'.$name.'" WHERE id = '.$node_id.';';
  $res = 0;
  if(mysqli_query($conn, $query)){
    $res = 1;
  }
  mysqli_close($conn);
  return json_encode($res);
}

function del_node($conn, $node_id){
   $query = 'delete from tree where id = '.$node_id;
   $res = 0;
   if(mysqli_query($conn, $query)){
     $res = 1;
   }
   mysqli_close($conn);
   return json_encode($res);
}

function add_node($conn, $name, $parent_id){
  if($parent_id){
    $query = 'insert into tree (name, p_id) values ("'.$name.'", '.$parent_id.') ;';
  }else{
    $query = 'insert into tree (name, p_id) values ("'.$name.'", NULL) ;';
  }
  if(mysqli_query($conn, $query)){
    $new_id = mysqli_insert_id($conn);
  };
  mysqli_close($conn);
  return json_encode($new_id);
}

function get_child($conn, $node_id){
  $query = "SELECT t.id,".
       "t.name, ".
       "t.p_id,".
       "(SELECT COUNT(*) ".
          "FROM tree t1 ".
         "WHERE t1.p_id = t.id) child ".
  "FROM tree t ".
  "where t.p_id = ".$node_id;

  $result = mysqli_query($conn, $query, MYSQLI_USE_RESULT) or die('Запрос не удался: ' . mysql_error());
  $res = array();

  while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
      $res[] = $line;
  }

  mysqli_free_result($result);
  mysqli_close($conn);
  return json_encode($res);
}

function get_node($conn, $node_id){
  $query = "SELECT t.id,".
       "t.name, ".
       "t.p_id,".
       "(SELECT COUNT(*) ".
          "FROM tree t1 ".
         "WHERE t1.p_id = t.id) child ".
  "FROM tree t ".
  "where t.id = ".$node_id;
  $result = mysqli_query($conn, $query, MYSQLI_USE_RESULT) or die('Запрос не удался: ' . mysql_error());
  $res = mysqli_fetch_row($result);

   mysqli_free_result($result);
   mysqli_close($conn);

   return json_encode($res);
}

function connectDB($host, $dbuser, $dbpass, $dbname){
  $conn = mysqli_connect($host, $dbuser, $dbpass);
  if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
  }
  $db = mysqli_select_db($conn, $dbname);
  print mysqli_error($conn);
  // echo $conn;
  if (!$db) {
      die("DB select Faild" . mysqli_error($connection));
  };
  return $conn;
}
 ?>
