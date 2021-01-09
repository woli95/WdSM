import React from 'react';
import {
    Modal,
    Text,
    View
} from "react-native";
import AuthViewSubmitButton from "./AuthViewSubmitButton";
import AppExerciseList from "./AppExerciseList";

class ModalSelectPlan extends React.Component {
    constructor(props) {
        super(props);
    }
    itemLongPress(planSelected) {
        this.props.onItemLongPress(planSelected);
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
                    alignItems: 'center',
                }}>
                    <View style={{
                        height: 300,
                        margin: 10,
                        backgroundColor: this.props.backgroundColor,
                        borderRadius: 25,
                        borderColor: this.props.borderColor,
                        alignItems: 'center',
                        borderWidth: 6,
                        padding: 20,
                    }}>
                        <AppExerciseList
                            title={this.props.listTitle}
                            list={this.props.list}
                            headerColor={this.props.listHeaderColor}
                            bgColor={this.props.listBackgroundColor}
                            dividerColor={this.props.backgroundColor}
                            itemTextColor={this.props.listItemTextColor}
                            onItemLongPress={this.itemLongPress.bind(this)}/>
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


export default ModalSelectPlan;