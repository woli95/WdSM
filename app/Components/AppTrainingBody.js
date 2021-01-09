import React from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Vibration} from 'react-native';
import { Button, TextInput } from "react-native-paper";
import _ from 'lodash';

class AppTrainingBody extends React.Component {
    constructor(props) {
        super(props);
        let setObjectArray = []
        for (var i = 0; i < props.currentExercise["number_of_sets"]; i++) {
            let x = false;
            if (i === 0)
                x = true
            setObjectArray.push({
                set_nr: i + 1,
                visibility: x,
                weight: '',
                measure: '',
                finished: false,
            });
        }
        this.state = {
            setObjectArray: setObjectArray,
            notes: '',
            timer: null,
            timerType: null,
            secondsCounter: '00',
            startDisable: false,
        }
    }
    timerStart = (mode) => {
        let timer = setInterval(() => {
            var seconds = (Number(this.state.secondsCounter) + 1).toString();
            this.setState({secondsCounter: seconds.length === 1 ? '0' + seconds : seconds });
            if (mode === 'exercise') {
                if (Number(this.state.secondsCounter) === Number(this.props.exerciseBreak)) {
                    this.timerStop();
                    this.timerReset();
                    if (this.props.vibrations === true) {
                        Vibration.vibrate(660);
                    }
                }
            } else if (mode === 'set') {
                if (Number(this.state.secondsCounter) === Number(this.props.currentExercise["time_of_break"])) {
                    this.timerStop();
                    this.timerReset();
                    if (this.props.vibrations === true) {
                        Vibration.vibrate(660);
                    }
                }
            }
        }, 1000);
        this.setState({ timer: timer });
        this.setState({ timerType: mode });
        this.setState({ startDisable: true });
    }
    timerStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false });
    }
    timerReset = () => {
        this.setState({
            timer: null,
            secondsCounter: '00',
            timerType: null,
        });
    }

    styles = StyleSheet.create({
        breakText: {
          alignSelf: 'center',
          color: this.props.colors.color2,
          fontSize: 30,
          fontWeight: 'bold',
          backgroundColor: this.props.colors.color3,
          marginTop: 5,
          padding: 5,
        },
        setLabel: {
            alignSelf: 'center',
            color: this.props.colors.color5
        },
        setNameLabel: {
            fontSize: 22,
            fontStyle: 'italic',
            fontWeight: '100',
            alignSelf: 'center',
            color: this.props.colors.color3
        },
        setView: {
            marginTop: 5,
            borderWidth: 1,
            borderColor: this.props.colors.color2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 5,
            marginRight: 5,
            backgroundColor: this.props.colors.color4
        },
        setButton: {
            backgroundColor: this.props.colors.color1,
            paddingTop: 5,
            paddingBottom: 5,
        },
        hideButton: {
            paddingTop: 5,
            paddingBottom: 5,
            opacity: 0,
        },
        inputField: {
            height: 30,
            width: 50,
            textAlignVertical: 'top',
            paddingTop: 0,
            paddingBottom: 6,
        },
        inputLabel: {
            alignSelf: 'center',
            color: this.props.colors.color3
        }
    });
    endExercise () {
        this.props.onExerciseSubmit(this.state.setObjectArray, this.state.notes);
    }
    async componentDidUpdate(nextProps, nextState, nextContext) {
        if (nextProps !== this.props) {
            let tmp = []
            for (var i = 0; i < this.props.currentExercise["number_of_sets"]; i++) {
                let x = false;
                if (i === 0)
                    x = true
                tmp.push({
                    set_nr: i + 1,
                    visibility: x,
                    weight: '',
                    measure: '',
                    finished: false,
                });
            }
            await this.setState({ setObjectArray: tmp });
            await this.setState({ notes: ''});
            this.timerStart('exercise');
        }
    }

    renderNext = async(i) => {
        let tmp = _.cloneDeep(this.state.setObjectArray);
        tmp[i+1].visibility = true
        tmp[i].finished = true
        await this.setState({setObjectArray: tmp});
    }
    addSet = async(i) => {
        let tmp = _.cloneDeep(this.state.setObjectArray);
        tmp[i].finished = true;
        tmp.push({
            set_nr: i + 2,
            visibility: true,
            weight: '',
            measure: '',
            finished: false,
        });
        this.setState({setObjectArray: tmp});
        this.timerStart('set');
    }
    tryToRender = async (i) => {
        if (this.state.timer !== null) {
            this.timerStop();
            this.timerReset();
        }
        if (i+1 < this.state.setObjectArray.length) {
            this.timerStart('set');
            await this.renderNext(i);
        } else {
            Alert.alert('The assumed number of sets has been executed', 'What to do now ?', [
                {
                    text: 'Do one more set',
                    onPress: async () => this.addSet(i),
                    style: 'default',
                },
                {
                    text: 'Go to next exercise',
                    onPress: () => this.endExercise(),
                    style: 'default'
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                }]);
        }
    }
    valueChange(text, index, what) {
        let tmp = _.cloneDeep(this.state.setObjectArray);
        tmp[index][what] = text;
        this.setState({ setObjectArray: tmp });
    }
    notesChange(text) {
        this.setState({notes: text});
    }
    set = (index) => {
        return <View style={this.styles.setView}>
            <Text style={this.styles.setLabel}> S{index+1}: </Text>
            <Text style={this.styles.inputLabel}>WEIGHT: </Text>
            <TextInput
                style={this.styles.inputField}
                mode={'outlined'}
                keyboardType={'numeric'}
                value={this.state.setObjectArray[index].weight}
                onChangeText={(text) => this.valueChange(text, index, 'weight')}
                theme={{
                    colors: {
                        primary: this.props.colors.color2,
                        text: this.props.colors.color5
                    }
                }}
            />
            <Text style={this.styles.inputLabel}>{this.props.currentExercise.measure.toUpperCase()}: </Text>
            <TextInput
                style={this.styles.inputField}
                keyboardType={'numeric'}
                mode={'outlined'}
                value={this.state.setObjectArray[index].measure}
                onChangeText={text => this.valueChange(text, index, 'measure')}
                theme={{
                    colors: {
                        primary: this.props.colors.color2,
                        text: this.props.colors.color5
                    }
                }}
            />
            {this.state.setObjectArray[index].finished === false ? <Button color={this.props.colors.color2} style={this.styles.setButton} onPress={() => this.tryToRender(index)}>Next</Button> : <Button style={this.styles.hideButton}>Next</Button>}
        </View>
    }
    render() {
        return (
            <View>
                <Text style={this.styles.setNameLabel}>{this.props.currentExercise.name}</Text>
                <FlatList
                    data={this.state.setObjectArray}
                    renderItem={({item, index}) =>
                    {
                            if (item.visibility === true) {
                                    return this.set(index);
                                }
                    }
                    }
                    keyExtractor={(item, index) => item.set_nr.toString()}
                />
                {this.state.secondsCounter === '00' ? <Text> </Text> : <Text style={this.styles.breakText}>{this.state.timerType === 'set' ? 'Set break: '.concat((Number(this.props.currentExercise["time_of_break"]) - Number(this.state.secondsCounter)).toString()) : 'Exercise break: '.concat((Number(this.props.exerciseBreak) - Number(this.state.secondsCounter)).toString())}</Text>}
                <TextInput mode={'outlined'}
                           multiline={true}
                           style={{
                               height: 100,
                               backgroundColor: this.props.colors.color4,
                           }}
                           placeholder={'Exercise notes'}
                           value={this.state.notes}
                           onChangeText={text => this.notesChange(text)}
                           theme={{
                               colors: {
                                   primary: this.props.colors.color2,
                                   text: this.props.colors.color5
                               }
                           }}
                />
            </View>
        );
    }
}

export default AppTrainingBody;