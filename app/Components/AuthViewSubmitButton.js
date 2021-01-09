import React from 'react';
import { Button } from 'react-native-paper';
class AuthViewSubmitButton extends React.Component {
    constructor(props) {
        super(props);
    }
    onSubmitButtonClick = () => {
        this.props.onSubmitButtonClick();
    }
    render() {
        return (
            <Button
                labelStyle={{
                    color: this.props.textColor
                }}
                mode={'contained'}
                theme={{
                    colors: {
                        primary:this.props.backgroundColor,
                    }
                }}
                style={{
                    width:300,
                    marginTop:10,
                }}
                onPress={this.onSubmitButtonClick.bind(this)}
            >{this.props.title}</Button>
        );
    }
}
export default AuthViewSubmitButton;
