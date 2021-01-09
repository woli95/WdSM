import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AuthViewInputField from "./AuthViewInputField";
import MainMenuButton from "./MainMenuButton";
import { Alert } from 'react-native';
import _ from 'lodash';
export default class AppPlanAdvancedTable extends React.Component {
    constructor(props) {
        super(props);
        console.log('XAXAXA')
        console.log(props);
        this.state = {
            tableHead: ['Exercise', 'Sets', 'Breaks', 'Category'],
            widthArr: [100, 50, 70, 100],
            tableData: [],
            set_break: [],
            break_between_exercises: 0,
            button_title: 'Create plan',
        }
        for (let i = 0; i < this.props.list.length; i++) {
            this.state.set_break.push({
                sets: 0,
                break: 0,
            });
        }
        if (this.props.isUpdate === true) {
            let tmp = [];
            for(let i = 0; i < this.props.list.length ; i++) {
                tmp.push({
                    sets: this.props.list[i]["number_of_sets"],
                    break: this.props.list[i]["time_of_break"],
                });
            }
            this.state.break_between_exercises = props.break_between_exercises;
            this.state.set_break = tmp;
            this.state.button_title =  'Update plan';
        }
        this.createData();
    }
    createData = () => {
        this.setState({tableData: []})
        for (let i = 0; i < this.props.list.length; i++) {
            let rowData = [];
            rowData.push(<Text style={this.styles.tableNotEditableItem}>{this.props.list[i]["name"].toString()}</Text>);
            rowData.push(<TouchableOpacity onPress={() => this.changeSetValue(i) }><Text
                style={this.styles.tableEditableItem}>{this.state.set_break[i]["sets"].toString()}</Text></TouchableOpacity>);
            rowData.push(<TouchableOpacity onPress={() => this.changeBreakValue(i)}><Text
                style={this.styles.tableEditableItem}>{this.state.set_break[i]["break"].toString()} s</Text></TouchableOpacity>);
            rowData.push(<Text style={this.styles.tableNotEditableItem}>{this.props.list[i]["category"].toString()}</Text>);
            this.state.tableData.push(rowData);
        }
    }
    changeSetValue = (i) => {
        Alert.prompt('Enter number', 'of sets',
            [
                {
                    text: 'Cancel',
                    onPress: () => void(0),
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: (value) => this.changeExerciseData(value, i, 'set'),
                }
            ],
            'plain-text'
        );
    }
    changeBreakValue = (i) => {
        Alert.prompt('Enter time amount', 'of break in seconds',
            [
                {
                    text: 'Cancel',
                    onPress: () => void(0),
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: (value) => this.changeExerciseData(value, i, 'break'),
                }
            ],
            'plain-text'
        );
    }
    changeExerciseData = (value, i, what) => {
        if (!(parseInt(value) >= 0 && parseInt(value) <= 1000))
            Alert.alert('Error while updating plan', 'You have to enter integer number while updating sets or break')
        else {
            const tmp = _.cloneDeep(this.state.set_break);
            if (what === 'set')
                tmp[i]["sets"] = value;
            else if (what === 'break')
                tmp[i]["break"] = value;
            this.setState({set_break: tmp});
            this.createData();
            this.forceUpdate();
        }
    }
    async changeBreakBetweenExercises(value, trash) {
        if (!(parseInt(value) >= 0 && parseInt(value) <= 1000 || value === ''))
            Alert.alert('Error while updating plan', 'You have to enter integer number while updating break time');
        await this.setState({break_between_exercises: parseInt(value) });
    }
    styles = StyleSheet.create({
        tableEditableItem: {
            fontSize: 18,
            textAlign: 'center',
            color: this.props.textEditableItemColor,
        },
        tableNotEditableItem: {
            fontSize: 18,
            textAlign: 'center',
            color: this.props.textNotEditableItemColor,
        }
    });
    addPlan = () => {
        this.props.addPlan(this.props.name, this.props.list, this.state.break_between_exercises, this.state.set_break, this.props.isUpdate);
    }

    render() {
            return (
                <View style={{
                    flex: 1,
                    padding: 15,
                    paddingTop: 20,
                    alignItems: 'center',
                    backgroundColor: this.props.tableBackgroundColor
                }}>
                    <View style={{
                        flex: 1,
                        alignItems: 'center'
                    }}>
                        <Table borderStyle={{
                            borderWidth: 1, borderColor: this.props.borderColor
                        }}>
                            <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={{
                                height: 50,
                                backgroundColor: this.props.headerBackgroundColor,
                            }}
                                 textStyle={{
                                     textAlign: 'center',
                                     color: this.props.textColor,
                                     fontSize: 22,
                                 }}/>
                        </Table>
                        <ScrollView>
                            <Table
                                borderStyle={{
                                    borderWidth: 1,
                                    borderColor: this.props.borderColor
                                }}>
                                {this.state.tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={this.state.widthArr}
                                        style={{
                                            height: 40,
                                        }}
                                    />
                                ))}
                            </Table>
                        </ScrollView>
                        <AuthViewInputField name={'Break between exercises'}
                                            icon={'timer'}
                                            keyboardType={'numeric'}
                                            onTextInputValueChange={this.changeBreakBetweenExercises.bind(this)}
                                            borderColor={this.props.headerBackgroundColor}
                                            textColor={this.props.textNotEditableItemColor}
                                            initialValue={this.props.break_between_exercises.toString()}
                                            fieldBackgroundColor={this.props.button2BackgroundColor}/>
                        <MainMenuButton
                            bgColor={this.props.buttonBackgroundColor}
                            fontColor={this.props.buttonTextColor}
                            title={this.state.button_title}
                            onClick={this.addPlan}/>
                    </View>
                </View>
            );
        }
}
