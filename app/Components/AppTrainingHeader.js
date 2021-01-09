import React from 'react';
import { Text, View, StyleSheet, Alert  } from 'react-native';
import AuthViewSubmitButton from "./AuthViewSubmitButton";

class AppTrainingHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            hoursCounter: '00',
            minutesCounter: '00',
            secondsCounter: '00',
            startDisable: false
        }
    }
    componentDidMount() {
        this.timerStart();
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }
    timerStart = () => {
        let timer = setInterval(() => {
            var num = (Number(this.state.secondsCounter) + 1).toString();
            var count = this.state.minutesCounter;
            var hour = this.state.hoursCounter;
            if (Number(this.state.secondsCounter) === 59) {
                count = (Number(this.state.minutesCounter) + 1).toString();
                num = '00';
            }
            if (Number(this.state.minutesCounter) === 59 && Number(this.state.secondsCounter) === 59) {
                count = '00';
                num = '00';
                hour = (Number(this.state.hoursCounter) +1).toString();
            }
            this.setState({
                hourCounter: hour.length === 1 ? '0' + hour : hour,
                minutesCounter: count.length === 1 ? '0' + count : count,
                secondsCounter: num.length === 1 ? '0' + num : num
            });
            this.props.trainingTimeUpdate(this.state.hourCounter, this.state.minutesCounter, this.state.secondsCounter);
        }, 1000);
        this.setState({ timer });
        this.setState({ startDisable: true });
    }
    timerStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false });
    }
    timerReset = () => {
        this.setState({
            timer: null,
            minutesCounter: '00',
            secondsCounter: '00'
        });
    }
    styles = StyleSheet.create({
        labelText: {
            fontSize: 15,
            margin: 5,
            textAlign: 'left',
            color: this.props.colors.color3,
        },
        importantText: {
            fontSize: 15,
            margin: 5,
            textAlign: 'left',
            color: this.props.colors.color2,
        }
    });
    cancelWorkout = () => {
        Alert.alert('Are you sure to abandon this training ?', '', [
            {
                text: 'Abandon',
                onPress: () => this.backToMainMenu(),
                style: 'cancel',
            },
            {
                text: 'No, stay here',
                onPress: void(0),
                style: 'default'
            }
        ]);
    }
    backToMainMenu = () => {
        this.props.abandonWorkout();
    }
    render() {
        return (
            <View style={{
                flex: 1,
                marginBottom: 5,
            }}>
                <View style={{
                    backgroundColor: this.props.colors.color4,
                    flex: 1,
                    paddingTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View>
                        <Text style={this.styles.labelText}>Workout in use:</Text>
                        <Text style={this.styles.labelText}>Training timer:</Text>
                    </View>
                    <View style={{
                        alignItems: 'left',
                    }}>
                        <Text style={this.styles.importantText}>{this.props.planName.toUpperCase()}</Text>
                        <Text style={this.styles.importantText}>{this.state.hourCounter}:{this.state.minutesCounter}:{this.state.secondsCounter}</Text>

                    </View>
                </View>
                <AuthViewSubmitButton
                    title={'Cancel workout'}
                    textColor={this.props.colors.color2}
                    backgroundColor={this.props.colors.color4}
                    onSubmitButtonClick={this.cancelWorkout}
                />
            </View>
        );
    }
}

export default AppTrainingHeader;