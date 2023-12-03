--@block
CREATE TABLE `students` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `pswd` varchar(45) NOT NULL,
  `attendance` decimal(10,0) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `id_index` (`sid`)
);


--@block
CREATE TABLE `admin` (
  `Name` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `Pswd` varchar(255) DEFAULT NULL
);


--@block
CREATE TABLE `subject_att` (
  `sid` int NOT NULL,
  `ML` int NOT NULL,
  `OOSD` int NOT NULL,
  `DBMS` int NOT NULL,
  `DAA` int NOT NULL,
  `WT` int NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `id_index` (`sid`),
  CONSTRAINT `sid` FOREIGN KEY (`sid`) REFERENCES `students` (`sid`)
)



--@block
SELECT 
    students.sid AS sid,
    students.name AS name,
    students.attendance AS attendance,
    subject_att.ML AS ML,
    subject_att.OOSD AS OOSD,
    subject_att.DBMS AS DBMS,
    subject_att.DAA AS DAA,
    subject_att.WT AS WT
    
FROM students
INNER JOIN subject_att
on students.sid = subject_att.sid;



--@block
ALTER TABLE students
ADD Phone 