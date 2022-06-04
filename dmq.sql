-- Queries for add new functionality with $ character denoting variables that will have data from backend

-- get class info to populate table
SELECT * FROM class;

-- get class names to populate class dropdowns
SELECT class_id, title FROM class;


-- add spell
INSERT INTO spell (class, name, element, cost, damage)
    VALUES ($class_id, $spellname, $elementname, $cost, $damage);

-- update spell
UPDATE spell SET class=$class_id, name=$spell_name, element=$element_name, cost=$spell_cost, damage=$spell_damage WHERE id=$spell_id_dropdown;

-- remove a spell
DELETE FROM spell WHERE id=$spell_id;


-- add class
INSERT INTO class (title, danger_level, description)
    VALUES ($title, $danger_level, $description);

-- update class
UPDATE class SET title=$class_title, danger_level=$danger_level_dropdown, description=$class_description WHERE id=$class_id_dropdown;

-- remove a class
DELETE FROM class where id=$class_id;


-- add master
INSERT INTO master (class, spells, students, name, birthdate, species, level)
    VALUES ($class_id, $spell_roster, $student_roster, $mastername, $birthdate, $species, $danger_level);

-- update master
UPDATE master SET class=$class_id, name=$master_name, birthdate=$master_birthdate, species=$master_species, level=$danger_level_dropdown WHERE id=$master_id_dropdown;

-- remove a master
DELETE FROM master where id=$master_id;


-- add student
INSERT INTO student (class, spells, master, name, birthdate, species, level)
    VALUES ($class_id, $spell_roster, $master_id, $name, $birthdate, $species, $level);

-- update student
UPDATE student SET class=$class_id, master=$student_master, name=$student_name, birthdate=$student_birthdate, species=$student_species, level=$danger_level_dropdown WHERE id=$student_id_dropdown;

-- remove a student
DELETE FROM student where id=$student_id;


-- associate a spell with a student (M:M addition)
INSERT INTO student_spell (student_id, spell_id)
    VALUES ($student_id_dropdown, $spell_id_dropdown);

-- associate a spell with a master (M:M addition)
INSERT INTO master_spell (master_id, spell_id)
    VALUES (master_id_dropdown, $spell_id_dropdown);

-- remove spell-student association (M:M deletion)
DELETE FROM student_spell WHERE student_id=$student_id_dropdown AND spell_id=$spell_id_dropdown;

-- remove spell-master association (M:M deletion)
DELETE FROM master_spell WHERE master_id=$master_id_dropdown AND spell_id=$spell_id_dropdown;
