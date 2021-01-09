import React, { Component } from 'react';
import { TextInput } from 'react-native-paper';
class AuthViewInputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            val: '',
            keyboardType: 'default'
        }
        if (props.initialValue !== undefined) {
            this.state.val = props.initialValue;
        }
        if (props.keyboardType)
            this.state.keyboardType = props.keyboardType;
    }
    onTextChange = (text) => {
        this.setState({val: text} );
        this.props.onTextInputValueChange(text, this.props.name);
    }
    render() {
        return (
            <TextInput
                mode={'outlined'}
                keyboardType={this.state.keyboardType}
                left={<TextInput.Icon
                    name={this.props.icon}
                    style={{
                        width: 25,
                        height: 25,
                        position: 'absolute',
                        top: -2,
                    }}
                    color={this.props.textColor} />}
                theme={{
                    colors: {
                        primary: this.props.borderColor,
                        text: this.props.textColor,
                    }
                }}
                style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    height: 43,
                    width: 250,
                    backgroundColor: this.props.fieldBackgroundColor,
                }}
                placeholder={this.props.name}
                placeholderTextColor={this.props.textColor}
                maxLength={40}
                editable={true}
                multiline={false}
                onChangeText = {this.onTextChange}
                value = {this.state.val}
                secureTextEntry={this.props.isPassword}
            />
        );
    }
}
export default AuthViewInputField;
