from main import app
from flask import request, jsonify
import database_queries.queries as queries
from mail import send_auth_mail_to_reset_password, send_mail_with_new_password
import json
import secrets


@app.route('/test', methods=['GET'])
def test():
    return jsonify('DZIALA'), 200


@app.route('/mail/<email_address>/<token>', methods=['GET'])
@app.route('/mail/<email_address>/send/link', methods=['GET'])
def mail(token=None, email_address=None):
    if request.path == '/mail/{}/send/link'.format(email_address):
        password_restart_token = send_auth_mail_to_reset_password(email_address)
        if password_restart_token is False:
            return jsonify('FAILURE')
        else:
            if queries.save_password_restart_token(password_restart_token, email_address) is True:
                return jsonify('OK'), 200
            else:
                return jsonify('FAILURE')
    elif request.path == '/mail/{}/{}'.format(email_address, token):
        if queries.verify_password_restart_token(token, email_address) is True:
            new_password = secrets.token_hex(5)
            if queries.reset_client_password_and_remove_refresh_password_token(email_address, new_password) is True:
                if send_mail_with_new_password(email_address, new_password) is True:
                    return 'Password has been changed. New password has been sent to your email address'
                else:
                    return 'Password has been changed, but error has been raised while sending mail'
            else:
                return 'error while removing token'
        else:
            return 'DATABASE ERROR'
    else:
        return 'BLEE'


@app.route('/client/register', methods=['POST'])
@app.route('/client/login', methods=['POST'])
@app.route('/client/<token>/login', methods=['GET'])
@app.route('/client/<token>/logout', methods=['GET'])
@app.route('/client/<token>/get', methods=['GET'])
@app.route('/client/<token>/update', methods=['PUT'])
@app.route('/client/<token>/delete', methods=['GET'])
def client(token=None):
    if request.path == '/client/register':
        data = json.loads(request.data)
        if queries.check_if_username_is_free(data["username"]) is True:
            if queries.check_if_email_is_free(data["email"]) is True:
                if queries.create_new_client(data) is True:
                    return jsonify('OK'), 200
                else:
                    return jsonify('Cannot create account')
            else:
                return jsonify('Email is used')
        else:
            return jsonify('Login is used'), 200
    elif request.path == '/client/login':
        data = json.loads(request.data)
        if queries.check_if_password_is_valid(data["username"], data["password"]) is True:
            generated_token = secrets.token_hex(16)
            queries.set_token(generated_token, data["username"])
            return jsonify(generated_token), 200
        else:
            return jsonify('Invalid credentials')
    elif request.path == '/client/{}/login'.format(token):
        if queries.check_if_token_is_active(token) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('Token not valid')
    elif request.path == '/client/{}/logout'.format(token):
        if queries.logout_client(token) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('Failure')
    elif request.path == '/client/{}/get'.format(token):
        result = queries.get_client_by_token(token)
        if result is None:
            return jsonify('Token expired')
        else:
            return jsonify(result), 200
    elif request.path == '/client/{}/update'.format(token):
        data = json.loads(request.data)
        if queries.update_client(data, token) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/client/{}/delete'.format(token):
        if queries.delete_client(token) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')


@app.route('/exercise/create/<token>', methods=['POST'])
@app.route('/exercise/getlist/<token>', methods=['GET'])
@app.route('/exercise/<exercise_id>/delete', methods=['PUT'])
@app.route('/exercise/<exercise_id>/update', methods=['PUT'])
def exercise(token=None, exercise_id=None):
    if request.path == '/exercise/getlist/{}'.format(token):
        result = queries.get_client_exercises(token)
        if queries.get_client_exercises(token) is not False:
            return jsonify(result)
        else:
            return jsonify('FAILURE')
    elif request.path == '/exercise/create/{}'.format(token):
        data = json.loads(request.data)
        if queries.create_exercise(token, data) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/exercise/{}/delete'.format(exercise_id):
        if queries.delete_exercise(exercise_id) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/exercise/{}/update'.format(exercise_id):
        data = json.loads(request.data)
        if queries.update_exercise(exercise_id, data) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')


@app.route('/plan/create/<token>', methods=['POST'])
@app.route('/plan/getlist/<token>', methods=['GET'])
@app.route('/plan/<plan_id>/get_exercises', methods=['GET'])
@app.route('/plan/<plan_id>/delete', methods=['PUT'])
@app.route('/plan/<plan_id>/update', methods=['PUT'])
def plan(token=None, plan_id=None):
    if request.path == '/plan/create/{}'.format(token):
        result = queries.create_plan(token, json.loads(request.data))
        if result is True:
            return jsonify('OK'), 200
        elif result == 'unique name error':
            return jsonify('Unique name error')
        else:
            return jsonify('FAILURE')
    elif request.path == '/plan/getlist/{}'.format(token):
        result = queries.get_client_plans(token)
        if result is not False:
            return jsonify(result), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/plan/{}/get_exercises'.format(plan_id):
        result = queries.get_plan_exercises(plan_id)
        if result is not False:
            return jsonify(result), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/plan/{}/delete'.format(plan_id):
        if queries.delete_plan(plan_id) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/plan/{}/update'.format(plan_id):
        if queries.update_plan(plan_id, json.loads(request.data)) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')


@app.route('/training/<client_token>/create', methods=['POST'])
@app.route('/training/<client_token>/get_training_list', methods=['GET'])
@app.route('/training/<training_id>/get_training_unit_list', methods=['GET'])
@app.route('/training/<training_unit_id>/get_training_unit_set_list', methods=['GET'])
@app.route('/training/<client_token>/<training_id>/delete', methods=['PUT'])
def training(client_token=None, training_id=0, training_unit_id=0):
    if request.path == '/training/{}/create'.format(client_token):
        if queries.create_training(client_token, json.loads(request.data)) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/training/{}/get_training_list'.format(client_token):
        result = queries.get_training_list_for_client(client_token)
        print(result)
        if result is not False:
            return jsonify(result), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/training/{}/get_training_unit_list'.format(training_id):
        result = queries.get_training_unit_list(training_id)
        if result is not False:
            return jsonify(result), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/training/{}/get_training_unit_set_list'.format(training_unit_id):
        result = queries.get_training_unit_set_list(training_unit_id)
        if result is not False:
            return jsonify(result), 200
        else:
            return jsonify('FAILURE')
    elif request.path == '/training/{}/{}/delete'.format(client_token, training_id):
        if queries.delete_training(training_id) is True:
            return jsonify('OK'), 200
        else:
            return jsonify('FAILURE'), 202
