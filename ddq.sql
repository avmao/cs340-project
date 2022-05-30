DROP TABLE IF EXISTS student_spell;
DROP TABLE IF EXISTS master_spell;
DROP TABLE IF EXISTS spell;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS master;
DROP TABLE IF EXISTS class;

CREATE TABLE class (
    class_id INT (11) auto_increment, 
    title varchar(64) NOT NULL,
    danger_level ENUM('Apprentice', 'Adept', 'Expert', 'Legendary', 'Zenith') DEFAULT 'Apprentice' NOT NULL,
    description varchar(256) NOT NULL,
    PRIMARY KEY (class_id));

INSERT INTO class (title, danger_level, description) 
VALUES 
    ('A', 'Legendary', 'Difficult to obtain, almost impossible to achieve in a lifetime'),
    ('Mero', 'Zenith' , 'No words can describe the danger one would face if going up against this absolute power'),
    ('Demon', 'Expert', 'Dangerous but NOT completely hopeless');

CREATE TABLE spell (
    spell_id INT(11) auto_increment,
    class_id INT(11) NOT NULL,
    spell_name varchar(64) NOT NULL,
    element ENUM('Air','Water','Fire','Earth','Light','Dark') NOT NULL,
    cost INT(11) NOT NULL check( cost >= 10 AND cost <= 1000),
    damage INT(11) check( damage >= 0 AND damage <= 10000),
    PRIMARY KEY (spell_id),
    FOREIGN KEY (class_id) REFERENCES class (class_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE);

-- Spell Inserts
INSERT INTO spell (class_id, spell_name, element, cost, damage) 
VALUES 
    ((SELECT class_id FROM class WHERE title = 'Demon'), 'Wind Blast', 'Air', 10, 50),
    ((SELECT class_id FROM class WHERE title = 'A'), 'Fire Bolt', 'Fire', 50, 250),
    ((SELECT class_id FROM class WHERE title = 'Mero'), 'Holy Lightning Flash', 'Light', 500, 10000);

CREATE TABLE master (
    master_id INT(11) auto_increment,
    class_id INT(11) NOT NULL,
    master_name varchar(64) NOT NULL,
    danger_level ENUM('Apprentice', 'Adept', 'Expert', 'Legendary', 'Zenith') DEFAULT 'Expert' NOT NULL,
    date_born DATE NOT NULL,
    species varchar(64) NOT NULL,
    PRIMARY KEY (master_id),
    FOREIGN KEY (class_id) REFERENCES class (class_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE/*,
    FOREIGN KEY (master_spell_id) REFERENCES master_spell (master_spell_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE*/);

INSERT INTO master (master_name, danger_level, date_born, species, class_id)
VALUES
    ('Elrond', 'Expert', '1000-03-13', 'Elf', (SELECT class_id FROM class WHERE title = 'Demon')),
    ('Gandalf', 'Legendary', '0029-10-08', 'Human', (SELECT class_id FROM class WHERE title = 'A'));

CREATE TABLE master_spell (
    master_spell_id INT(11) auto_increment,
    master_id INT(11) NOT NULL,
    spell_id INT(11) NOT NULL,
    PRIMARY KEY (master_spell_id),
    FOREIGN KEY (master_id) REFERENCES master (master_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (spell_id) REFERENCES spell (spell_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE);

INSERT INTO master_spell (master_id, spell_id)
VALUES
    ((SELECT master_id FROM master WHERE master_name = 'Elrond'), (SELECT spell_id FROM spell WHERE spell_name = 'Fire Bolt')),
    ((SELECT master_id FROM master WHERE master_name = 'Elrond'), (SELECT spell_id FROM spell WHERE spell_name = 'Wind Blast'));

-- Query to get the list of master names and their spells.
SELECT master.master_name, spell.spell_name FROM master_spell
JOIN master USING (master_id)
JOIN spell USING (spell_id); 

CREATE TABLE student (
    student_id INT(11) auto_increment,
    class_id INT(11) NOT NULL,
    master_id INT(11) NOT NULL,
    danger_level ENUM('Apprentice', 'Adept', 'Expert', 'Legendary', 'Zenith') DEFAULT 'Apprentice' NOT NULL,
    date_born DATE NOT NULL,
    registration DATE,
    student_name VARCHAR(64) NOT NULL,
    species VARCHAR(64) NOT NULL,
    PRIMARY KEY (student_id),
    FOREIGN KEY (class_id) REFERENCES class (class_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (master_id) REFERENCES master (master_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE);

INSERT INTO student (student_name, danger_level, species, date_born, registration, class_id, master_id)
VALUES
('Geoffry', 'Adept', 'Human', '2000-05-21', '2015-09-01', (SELECT class_id FROM class WHERE title = 'A'), (SELECT master_id FROM master WHERE master_name = 'Elrond')),
('Frodo Baggins', 'Apprentice', 'Hobbit', '0300-01-09', '0320-09-01', (SELECT class_id FROM class WHERE title = 'Mero'), (SELECT master_id FROM master WHERE master_name = 'Gandalf'));

CREATE TABLE student_spell (
    student_spell_id INT(11) auto_increment,
    student_id INT(11) NOT NULL,
    spell_id INT(11) NOT NULL,
    PRIMARY KEY (student_spell_id),
    FOREIGN KEY (student_id) REFERENCES student (student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (spell_id) REFERENCES spell (spell_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE);

INSERT INTO student_spell (student_id, spell_id)
VALUES
    ((SELECT student_id FROM student WHERE student_name = 'Geoffry'), (SELECT spell_id FROM spell WHERE spell_name = 'Fire Bolt'));

-- Query to get the list of master names and their spells.
SELECT student.student_name, spell.spell_name FROM student_spell
JOIN student USING (student_id)
JOIN spell USING (spell_id);
