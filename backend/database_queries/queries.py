from main import create_connection


def save_password_restart_token(password_restart_token, email_address):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC save_password_restart_token '{}', '{}'".format(password_restart_token, email_address))
        connection.commit()
        return True
    except:
        return False


def verify_password_restart_token(password_restart_token, email_address):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.verify_password_restart_token('{}', '{}')".format(password_restart_token,
                                                                                     email_address))
        result = cursor.fetchall()[0][0]
        if result == 1:
            return True
        else:
            return False
    except:
        return False


def reset_client_password_and_remove_refresh_password_token(email, new_password):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC reset_client_password '{}', '{}'".format(email, new_password))
        cursor.execute("EXEC remove_refresh_password_token '{}'".format(email))
        connection.commit()
        return True
    except:
        return False


def create_new_client(data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC create_client '{}', '{}', '{}' ".format(data["email"], data["username"], data["password"]))
        connection.commit()
        connection.close()
        return True
    except:
        return False


def check_if_username_is_free(username):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.check_if_username_is_free('{}')".format(username))
        if cursor.fetchall()[0][0] == 0:
            return False
        else:
            return True
    except:
        return None


def check_if_email_is_free(email):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.check_if_email_is_free('{}')".format(email))
        if cursor.fetchall()[0][0] == 0:
            return False
        else:
            return True
    except:
        return None


def check_if_password_is_valid(username, password):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.check_if_password_is_valid('{}', '{}')".format(username, password))
        if cursor.fetchall()[0][0] == 1:
            return True
        else:
            return False
    except:
        return None


def set_token(token, username):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC set_token '{}', '{}'".format(token, username))
        connection.commit()
        return True
    except:
        return False


def check_if_token_is_active(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.check_if_token_is_active('{}')".format(token))
        if cursor.fetchall()[0][0] == 1:
            return True
        else:
            return False
    except:
        return None


def logout_client(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC logout_client '{}'".format(token))
        return True
    except:
        return False


def update_client(data, token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC update_client '{}', '{}', '{}'".format(token, data["what"], data["new"]))
        connection.commit()
        return True
    except:
        return False


def get_client_by_token(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM dbo.get_client_by_token('{}')".format(token))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return None


def delete_client(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC delete_client '{}'".format(token))
        connection.commit()
        return True
    except:
        return False


def get_client_exercises(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM dbo.get_client_exercises('{}')".format(token))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False


def create_exercise(token, data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC create_exercise '{}', '{}', '{}', '{}'".format(data["name"], data["measure"],
                                                                            data["category"], token))
        connection.commit()
        return True
    except:
        return False


def update_exercise(exercise_id, data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC update_exercise {}, '{}', '{}'".format(exercise_id, data["what"], data["newValue"]))
        connection.commit()
        return True
    except:
        return False


def delete_exercise(exercise_id):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC delete_exercise {}".format(exercise_id))
        connection.commit()
        return True
    except:
        return False


def create_plan(token, data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT dbo.check_workout_name('{}', '{}')".format(data["name"], token))
        if cursor.fetchone()[0] == 0:
            return 'unique name error'
        cursor.execute("EXEC create_workout '{}', '{}', {}".format(data["name"], token, data["break_time"]))
        for i in range(0, len(data["exerciseList"])):
            cursor.execute("EXEC add_exercise_to_workout '{}', {}, {}, {}, {}, '{}'".format(data["name"],
                                                                                            data["exerciseList"][i][
                                                                                                "id"],
                                                                                            data["setsAndBreaks"][i][
                                                                                                "break"],
                                                                                            data["setsAndBreaks"][i][
                                                                                                "sets"],
                                                                                            i + 1,
                                                                                            token))
        connection.commit()
        return True
    except:
        return False


def get_client_plans(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM get_client_workouts('{}')".format(token))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False


def get_plan_exercises(plan_id):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM get_workout_exercises({})".format(plan_id))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False


def delete_plan(plan_id):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC delete_workout {}".format(plan_id))
        connection.commit()
        return True
    except:
        return False


def update_plan(plan_id, data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        old_exercises = get_plan_exercises(plan_id)
        new_list_found_flags = [False in range(0, len(data["exerciseList"]))]
        old_list_found_flags = [False in range(0, len(old_exercises))]
        for i in range(0, len(data["exerciseList"])):
            for j in range(0, len(old_exercises)):
                if data["exerciseList"][i]["exercise_id"] == old_exercises[j]["exercise_id"]:
                    cursor.execute("EXEC update_exercise_in_workout {}, {}, {}, {}".format(
                        data["exerciseList"][i]["exercise_id"],
                        i + 1,
                        data["setsAndBreaks"][i]["sets"],
                        data["setsAndBreaks"][i]["break"]))
                    connection.commit()
                    new_list_found_flags[i] = True
                    old_list_found_flags[j] = True
        for i in range(0, len(old_list_found_flags)):
            if old_list_found_flags[i] is False:
                cursor.execute("EXEC delete_exercise_from_workout {}, {}".format(plan_id,
                                                                                 old_exercises[i]["exercise_id"]))
        for i in range(0, len(new_list_found_flags)):
            if new_list_found_flags[i] is False:
                cursor.execute("EXEC add_exercise_to_workout2 {}, {}, {}, {}, {}".format(plan_id,
                                                                                         data["exerciseList"][i][
                                                                                             "exercise_id"],
                                                                                         data["setsAndBreaks"][i][
                                                                                             "break"],
                                                                                         data["setsAndBreaks"][i][
                                                                                             "sets"], i + 1))
        cursor.execute("EXEC update_workout {}, '{}', {}".format(plan_id, data["name"], data["break_time"]))
        connection.commit()
        return True
    except:
        return False


def create_training(token, data):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("EXEC create_training '{}', '{}', '{}'".format(token, data["duration"], data["workoutName"]))
        cursor.execute("SELECT @@IDENTITY")
        training_id = cursor.fetchone()[0]
        for i in range(0, len(data['sets_data'])):
            cursor.execute("EXEC create_training_unit {}, {}, '{}'".format(training_id,
                                                                           data['plan'][i]['exercise_id'],
                                                                           data['notes'][i]))
            cursor.execute("SELECT @@IDENTITY")
            unit_id = cursor.fetchone()[0]
            for j in range(0, len(data['sets_data'][i])):
                cursor.execute("EXEC create_training_set {}, {}, {}".format(data['sets_data'][i][j]['weight'],
                                                                            data['sets_data'][i][j]['measure'],
                                                                            j + 1))
                cursor.execute("SELECT @@IDENTITY")
                set_id = cursor.fetchone()[0]
                cursor.execute("EXEC add_training_set_to_training_unit {}, {}".format(set_id, unit_id))
        connection.commit()
        return True
    except:
        return False


def get_training_list_for_client(token):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM get_training_list_for_client('{}')".format(token))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False


def get_training_unit_list(training_id):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM get_training_unit_list({})".format(training_id))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False


def get_training_unit_set_list(unit_id):
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM get_training_unit_set_list({})".format(unit_id))
        results = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        return False
