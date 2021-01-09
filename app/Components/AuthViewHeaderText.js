import React from 'react';
import { Text } from 'react-native';

class AuthViewHeaderText extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Text style={{
                fontSize: 35,
                fontWeight: '100',
                color: this.props.titleColor,
                padding: 20,
            }}>{ this.props.title }</Text>
        );
    }
}
export default AuthViewHeaderText;
