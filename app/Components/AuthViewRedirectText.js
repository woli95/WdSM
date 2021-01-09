import React from 'react';
import { Text } from 'react-native';
class AuthViewRedirectText extends React.Component {
    constructor(props) {
        super(props);
    }
    redirectTo = () => {
        this.props.redirectTo(this.props.destination.toString());
    }
    render() {
        return (
            <Text
                style={{
                    marginTop: 15,
                    fontStyle: 'italic',
                    color: this.props.textColor,
                    textDecorationLine: 'underline'
                }}
                onPress={this.redirectTo.bind(this)}
            >{this.props.textContent}</Text>
        );
    }
}
export default AuthViewRedirectText;
