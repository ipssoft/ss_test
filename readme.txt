

Data base info:

$host = 'localhost';
$dbuser = 'root';
$dbpass = '123456';
$dbname = 'ss_test';

CREATE TABLE tree (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  p_id int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (p_id) REFERENCES tree (id)
    ON DELETE CASCADE ON UPDATE CASCADE
)
