import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View
} from "react-native";
import AuthViewSubmitButton from "./AuthViewSubmitButton";

class ModalAbout extends React.Component {
    constructor(props) {
        super(props);
    }
    onExit() {
        this.props.onExit();
    }
    render() {
        return (
            <Modal animationType="slide" transparent={true} visible={this.props.isVisible}>
                <View style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <View style={{
                        margin: 10,
                        backgroundColor: this.props.backgroundColor,
                        borderRadius: 25,
                        borderColor: this.props.borderColor,
                        borderWidth: 6,
                        padding: 20,
                    }}>
                        <Text style={{
                            textAlign: 'left',
                            fontSize: 15,
                            color: this.props.textColor,
                        }}>
                            <Text style={{fontWeight: 'bold'}}>College:</Text> Łodź University Of Technology{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Project:</Text> Introduction to mobile systems{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Frontend:</Text> Vue/React Native{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Backend:</Text> Python/Flask{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Database:</Text> MSSQL {'\n'}{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Author:</Text> Dawid Wolszczak 224542{'\n'}
                            <Text style={{fontWeight: 'bold'}}>Phone:</Text> 507309173{'\n'}
                        </Text>
                        <AuthViewSubmitButton title="Close"
                                              onSubmitButtonClick={this.onExit.bind(this)}
                                              textColor={this.props.buttonTextColor}
                                              backgroundColor={this.props.buttonBackgroundColor}/>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ModalAbout;