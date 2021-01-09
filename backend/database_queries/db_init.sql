use master
GO
IF EXISTS(SELECT 1 FROM master.dbo.sysdatabases WHERE name='MSGL') DROP DATABASE MSGL
GO
CREATE DATABASE MSGL
GO
USE MSGL
GO
CREATE TABLE client(
	id INT IDENTITY(1,1) NOT NULL,
	create_date DATE NOT NULL,
	birth_date DATE,
	email VARCHAR(30) NOT NULL,
	username VARCHAR(30) NOT NULL,
	password VARCHAR(30) NOT NULL,
	gender VARCHAR(30),
	current_session_token VARCHAR(32),
	CONSTRAINT client_pk PRIMARY KEY CLUSTERED(id),
)
GO

CREATE PROCEDURE create_client(@email VARCHAR(30), @username VARCHAR(30), @password VARCHAR(30))
AS
    INSERT INTO client VALUES
        (GETDATE(), NULL, @email, @username, @password, NULL, NULL)
GO

EXEC create_client 'wolusrdom@gmail.com', 'Woli12', '#Woli1995'
GO

CREATE PROCEDURE reset_client_password(@email VARCHAR(30), @newPassword VARCHAR(30))
AS
    UPDATE client
    SET password=@newPassword
    WHERE email=@email
GO

CREATE TABLE client_refresh_password_token(
    client_id INT NOT NULL,
    token VARCHAR(20) NOT NULL,
    CONSTRAINT fk_client_refresh_password_token_client FOREIGN KEY (client_id) REFERENCES client(id),
)
GO

CREATE PROCEDURE save_password_restart_token(@token VARCHAR(20), @email VARCHAR(30))
AS
    INSERT INTO client_refresh_password_token VALUES
        ((SELECT id FROM client WHERE email=@email), @token)
GO

CREATE FUNCTION verify_password_restart_token(@token VARCHAR(20), @email VARCHAR(30))
RETURNS INT
    AS
    BEGIN
        DECLARE @result INT
        IF EXISTS(SELECT * FROM client_refresh_password_token WHERE client_id=(SELECT id
                                                                               FROM client
                                                                               WHERE email=@email)
                                                              AND token=@token)
            SET @result = 1
        ELSE
            SET @result = 0
        RETURN @result
    END
GO

CREATE PROCEDURE remove_refresh_password_token(@email VARCHAR(30))
AS
    DELETE FROM client_refresh_password_token
    WHERE client_id=(SELECT id
                     FROM client
                     WHERE email=@email)
GO

CREATE FUNCTION check_if_username_is_free(@username VARCHAR(30))
RETURNS INT
    AS
    BEGIN
        DECLARE @result INT
        IF EXISTS(SELECT 1 FROM client WHERE username=@username)
            SET @result = 0
        ELSE
            SET @result = 1
        RETURN @result
    END
GO

CREATE FUNCTION check_if_email_is_free(@email VARCHAR(30))
RETURNS INT
    AS
    BEGIN
        DECLARE @result INT
        IF EXISTS(SELECT 1 FROM client WHERE email=@email)
            SET @result = 0
        ELSE
            SET @result = 1
        RETURN @result
    END
GO

CREATE FUNCTION check_if_password_is_valid(@username VARCHAR(30), @password VARCHAR(30))
RETURNS INT
    AS
    BEGIN
        DECLARE @result INT
        IF EXISTS(SELECT 1 FROM client WHERE username=@username AND password=@password)
            SET @result = 1
        ELSE
            SET @result = 0
        RETURN @result
    END
GO

CREATE PROCEDURE set_token(@token VARCHAR(32), @username VARCHAR(30))
AS
    UPDATE client
    SET current_session_token=@token
    WHERE username=@username
GO

CREATE FUNCTION check_if_token_is_active(@token VARCHAR(32))
RETURNS INT
    AS
    BEGIN
        DECLARE @result INT
        IF EXISTS(SELECT 1 FROM client WHERE current_session_token=@token)
            SET @result = 1
        ELSE
            SET @result = 0
        RETURN @result
    END
GO

CREATE PROCEDURE logout_client(@token VARCHAR(32))
AS
    UPDATE client
    SET current_session_token=''
    WHERE current_session_token=@token
GO

CREATE PROCEDURE update_client(@token VARCHAR(32), @attribute VARCHAR(30), @newValue VARCHAR(30))
AS
    IF @attribute='gender'
        UPDATE client SET gender=@newValue WHERE current_session_token=@token
    ELSE IF @attribute='username'
        UPDATE client SET username=@newValue WHERE current_session_token=@token
    ELSE IF @attribute='password'
        UPDATE client SET password=@newValue WHERE current_session_token=@token
    ELSE IF @attribute='email'
        UPDATE client SET email=@newValue WHERE current_session_token=@token
    ELSE IF @attribute='birth_date'
        UPDATE client SET birth_date=@newValue WHERE current_session_token=@token
GO

CREATE FUNCTION get_client_by_token(@token VARCHAR(32))
RETURNS TABLE
AS
    RETURN
        SELECT * FROM client WHERE current_session_token=@token
GO

CREATE PROCEDURE delete_client(@token VARCHAR(32))
AS
    DELETE FROM workout_exercise
    WHERE client_id = (SELECT id FROM client WHERE current_session_token=@token)

    DELETE FROM workout
    WHERE client_id= (SELECT id FROM client WHERE current_session_token=@token)

    DELETE FROM client
    WHERE current_session_token=@token
GO

CREATE TABLE exercise(
    id INT IDENTITY(1,1) NOT NULL,
    name VARCHAR(30) NOT NULL,
    measure VARCHAR(30) NOT NULL,
    category VARCHAR(30),
    CONSTRAINT exercise_pk PRIMARY KEY CLUSTERED(id)
)
GO

CREATE TABLE client_exercise(
    client_id INT NOT NULL,
    exercise_id INT NOT NULL,
    CONSTRAINT fk_client_client_exercise FOREIGN KEY (client_id) REFERENCES client(id),
    CONSTRAINT fk_exercise_client_exercise FOREIGN KEY (exercise_id) REFERENCES exercise(id)
)
GO

CREATE PROCEDURE create_exercise(@name VARCHAR(30), @measure VARCHAR(30), @category VARCHAR(30), @token VARCHAR(32))
AS
    DECLARE @clientId INT
    SET @clientId = (SELECT id FROM client WHERE current_session_token=@token)
    INSERT INTO exercise VALUES
        (@name, @measure, @category)
    INSERT INTO client_exercise VALUES
        (@clientId, SCOPE_IDENTITY())
GO

CREATE FUNCTION get_client_exercises (@token VARCHAR(32))
RETURNS TABLE
AS
    RETURN
        SELECT exercise.*
        FROM exercise
        INNER JOIN client_exercise ON client_exercise.exercise_id = exercise.id
        INNER JOIN client ON client_exercise.client_id = client.id
        WHERE client.current_session_token=@token
GO

CREATE PROCEDURE update_exercise(@exerciseId INT, @attribute VARCHAR(30), @newValue VARCHAR(30))
AS
    IF @attribute='category'
        UPDATE exercise SET category=@newValue WHERE id=@exerciseId
    ELSE IF @attribute='measure'
        UPDATE exercise SET measure=@newValue WHERE id=@exerciseId
    ELSE IF @attribute='name'
        UPDATE exercise SET name=@newValue WHERE id=@exerciseId
GO

CREATE PROCEDURE delete_exercise(@exerciseId INT)
AS
    DELETE FROM workout_exercise
    WHERE exercise_id=@exerciseId

    DELETE FROM client_exercise
    WHERE exercise_id=@exerciseId

    DELETE FROM exercise
    WHERE id=@exerciseId
GO

CREATE TABLE workout(
    id INT IDENTITY(1, 1) NOT NULL,
    client_id INT NOT NULL,
    name VARCHAR(30) UNIQUE NOT NULL,
    break_between_exercises INT NOT NULL,
    CONSTRAINT workout_pk PRIMARY KEY CLUSTERED(id),
    CONSTRAINT fk_client_workout FOREIGN KEY (client_id) REFERENCES client(id)
)
GO

CREATE TABLE workout_exercise(
    workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    exercise_position INT NOT NULL,
    number_of_sets INT,
    time_of_break INT,
    CONSTRAINT fk_exercise_workout_exercise FOREIGN KEY (exercise_id) REFERENCES exercise(id),
    CONSTRAINT fk_workout_workout_exercise FOREIGN KEY (workout_id) REFERENCES workout(id)
)
GO

CREATE PROCEDURE create_workout (@workout_name VARCHAR(30), @token VARCHAR(32), @break_time INT)
AS
    DECLARE @clientId INT
    SET @clientId = (SELECT id FROM client WHERE current_session_token=@token)
    INSERT INTO workout VALUES
        (@clientId, @workout_name, @break_time)
GO

CREATE PROCEDURE add_exercise_to_workout(@workout_name VARCHAR(30), @exerciseId INT, @exercise_break_time INT, @exercise_sets_value INT, @position_on_list INT, @token VARCHAR(32))
AS
    INSERT INTO workout_exercise VALUES
        ((SELECT id FROM workout WHERE name=@workout_name AND client_id=(SELECT id FROM client WHERE current_session_token=@token)), @exerciseId, @position_on_list, @exercise_sets_value, @exercise_break_time)
GO

CREATE PROCEDURE add_exercise_to_workout2(@workoutId INT, @exerciseId INT, @exercise_break_time INT, @exercise_sets_value INT, @pos INT)
AS
    INSERT INTO workout_exercise VALUES
        (@workoutId, @exerciseId, @pos, @exercise_sets_value, @exercise_break_time)
GO

CREATE FUNCTION check_workout_name (@workout_name VARCHAR(30), @token VARCHAR(32))
RETURNS INT
AS
    BEGIN
        DECLARE @result INT
        IF EXISTS (SELECT name
               FROM workout
               WHERE client_id=(SELECT id
                                FROM client
                                WHERE current_session_token=@token)
                                      AND name=@workout_name)
            SET @result=0
        ELSE
            SET @result=1
        RETURN @result
    END
GO

CREATE FUNCTION get_client_workouts(@token VARCHAR(32))
RETURNS TABLE
AS
    RETURN
        SELECT *
        FROM workout
        WHERE client_id=(SELECT id
                         FROM client
                         WHERE current_session_token=@token)
GO

CREATE FUNCTION get_workout_exercises(@workout_id INT)
RETURNS TABLE
AS
    RETURN
        SELECT workout_exercise.*, exercise.name, exercise.category, exercise.measure
        FROM workout_exercise
        INNER JOIN exercise ON exercise.id=workout_exercise.exercise_id
        WHERE workout_id=@workout_id
GO

CREATE PROCEDURE delete_workout(@workout_id INT)
AS
    DELETE FROM workout_exercise
    WHERE workout_id=@workout_id

    DELETE FROM workout
    WHERE id=@workout_id
GO

CREATE PROCEDURE update_workout(@workout_id INT, @workoutNewName VARCHAR(30), @workoutNewBreak INT)
AS
    UPDATE workout
    SET name=@workoutNewName, break_between_exercises=@workoutNewBreak
    WHERE id=@workout_id
GO

CREATE PROCEDURE update_exercise_in_workout(@exerciseId INT, @newPosition INT, @newSetsValue INT, @newBreakTime INT)
AS
    UPDATE workout_exercise
    SET exercise_position=@newPosition,
        number_of_sets=@newSetsValue,
        time_of_break=@newBreakTime
    WHERE exercise_id=@exerciseId
GO

CREATE PROCEDURE delete_exercise_from_workout(@workoutId INT, @exerciseId INT)
AS
    DELETE FROM workout_exercise
    WHERE workout_id=@workoutID AND exercise_id=@exerciseId
GO

-------------------------------NEW CONTENT
CREATE TABLE training (
    id INT IDENTITY(1,1) NOT NULL,
    client_id INT NOT NULL,
    training_date DATE NOT NULL,
    duration DATETIME NOT NULL,
    workout_id INT NOT NULL,
    CONSTRAINT training_pk PRIMARY KEY CLUSTERED(id),
    CONSTRAINT fk_training_workout FOREIGN KEY (workout_id) REFERENCES workout(id),
    CONSTRAINT fk_training_client FOREIGN KEY (client_id) REFERENCES client(id)
)
GO
CREATE TABLE training_unit (
    id INT IDENTITY(1,1) NOT NULL,
    training_id INT NOT NULL,
    exercise_id INT NOT NULL,
    notes VARCHAR(1000),
    CONSTRAINT training_unit_pk PRIMARY KEY CLUSTERED(id),
    CONSTRAINT fk_training_unit_training FOREIGN KEY (training_id) REFERENCES training(id),
    CONSTRAINT fk_training_unit_exercise FOREIGN KEY (exercise_id) REFERENCES exercise(id)
)
GO
CREATE TABLE training_training_unit (
    training_id INT NOT NULL,
    training_unit_id INT NOT NULL,
    CONSTRAINT fk_training_training_unit_training FOREIGN KEY (training_id) REFERENCES training(id),
    CONSTRAINT fk_training_training_unit_training_unit FOREIGN KEY (training_unit_id) REFERENCES training_unit(id)
)
GO

CREATE TABLE training_set (
    id INT IDENTITY(1,1) NOT NULL,
    weight FLOAT NOT NULL DEFAULT(0.0),
    measure INT NOT NULL,
    set_nr INT NOT NULL,
    CONSTRAINT training_set_pk PRIMARY KEY CLUSTERED(id)
)
GO

CREATE TABLE training_unit_training_set (
    training_unit_id INT NOT NULL,
    training_set_id INT NOT NULL,
    CONSTRAINT fk_training_unit_training_set_training_unit FOREIGN KEY (training_unit_id) REFERENCES training_unit(id),
    CONSTRAINT fk_training_unit_training_set_training_set FOREIGN KEY (training_set_id) REFERENCES training_set(id)
)
GO
CREATE PROCEDURE create_training (@token VARCHAR(32), @duration DATETIME, @workoutName VARCHAR(30))
AS
    INSERT INTO training VALUES
        ((SELECT id FROM client WHERE current_session_token=@token), GETDATE(), @duration, (SELECT id from workout WHERE name=@workoutName))
GO
CREATE PROCEDURE create_training_unit (@trainingId INT, @exerciseId INT, @notes VARCHAR(1000))
AS
    INSERT INTO training_unit VALUES
        (@trainingId, @exerciseId, @notes)
GO
CREATE PROCEDURE create_training_set (@weight FLOAT, @measure INT, @nr INT)
AS
    INSERT INTO training_set VALUES
        (@weight, @measure, @nr)
GO
CREATE PROCEDURE add_training_set_to_training_unit (@setId INT, @unitId INT)
AS
    INSERT INTO training_unit_training_set VALUES
        (@unitId, @setId)
GO
--history functions
CREATE FUNCTION get_training_list_for_client(@token VARCHAR(32))
RETURNS TABLE
AS
    RETURN
        SELECT training.*, workout.name
        FROM training
        INNER JOIN client on client.id = training.client_id
        INNER JOIN workout on training.workout_id = workout.id
        WHERE current_session_token=@token
GO
CREATE FUNCTION get_training_unit_list(@trainingId INT)
RETURNS TABLE
AS
    RETURN
        SELECT training_unit.*, exercise.name, exercise.measure
        FROM training_unit
        INNER JOIN exercise on exercise.id = training_unit.exercise_id
        WHERE training_id = @trainingId
GO
CREATE FUNCTION get_training_unit_set_list(@trainingUnitId INT)
RETURNS TABLE
AS
    RETURN
        SELECT training_set.*
        FROM training_set
        INNER JOIN training_unit_training_set on training_unit_training_set.training_set_id = training_set.id
        WHERE training_unit_training_set.training_unit_id = @trainingUnitId
GO