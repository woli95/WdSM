import React from 'react';
import { Button } from 'react-native-paper';

class MainMenuButton extends React.Component {
    constructor(props) {
        super(props);
    }
    onClick() {
        this.props.onClick();
    }
    render() {
        return (
            <Button
                labelStyle={{
                    color: this.props.fontColor,
                    fontSize: 15,
                }}
                mode={'contained'}
                theme={{
                    colors: {
                        primary: this.props.bgColor,
                    }
                }}
                style={{
                    justifyContent: 'center',
                    width:300,
                    height: 45,
                    marginTop:10,
                    marginBottom: 10,
                }}
                onPress={this.onClick.bind(this)}
            >{this.props.title}</Button>
        );
    }
}
export default MainMenuButton;
