import React from "react";
import {
    Modal,
    View
} from "react-native";
import AppExerciseList from "./AppExerciseList";
import AuthViewSubmitButton from "./AuthViewSubmitButton";

class ModalSelectExercise extends React.Component {
    constructor(props) {
        super(props);
    }
    addToPlan(item) {
        this.props.addToPlan(item);
    }
    closeModal() {
        this.props.closeModal();
    }
    render() {
        return (
            <Modal animationType="slide" transparent={true} visible={this.props.isVisible}>
                <View style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <View style={{
                        height: 550,
                        margin: 10,
                        backgroundColor: this.props.colors.color1,
                        borderRadius: 25,
                        borderColor: this.props.colors.color2,
                        alignItems: 'center',
                        borderWidth: 6,
                        padding: 20,
                    }}>
                        <AppExerciseList
                        title={'Select exercise'}
                        list={this.props.list}
                        headerColor={this.props.colors.color3}
                        bgColor={this.props.colors.color4}
                        dividerColor={this.props.colors.color1}
                        itemTextColor={this.props.colors.color2}
                        onItemLongPress={this.addToPlan.bind(this)}/>
                        <AuthViewSubmitButton
                            title={'Cancel'}
                            textColor={this.props.colors.color3}
                            backgroundColor={this.props.colors.color2}
                            onSubmitButtonClick={this.closeModal.bind(this)}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ModalSelectExercise;