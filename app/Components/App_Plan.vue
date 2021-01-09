<template>
  <view :style="{
    flex: 1,
    padding: 40,
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1}">
    <SettingsEditText
        title="Plan name"
        dialogDescription="Enter plan name"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="planNameChange"
        :value="plan.name"
        :containerStyle="{
          borderWidth: 1,
          width: 300,
          borderColor: $root.$data.appOpts.colorStyle.color2,
          margin: 5,
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          color: $root.$data.appOpts.colorStyle.color3,
          fontWeight: 'bold',
        }"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
    />
    <AppExerciseList
                     :title="'Exercises in plan'"
                     :list="plan.exerciseList"
                     :headerColor="$root.$data.appOpts.colorStyle.color3"
                     :bgColor="$root.$data.appOpts.colorStyle.color4"
                     :itemTextColor="$root.$data.appOpts.colorStyle.color2"
                     :dividerColor="$root.$data.appOpts.colorStyle.color1"
                     :onItemLongPress="editOrDeleteExerciseFromPlan"/>
    <MainMenuButton
                    :bgColor="$root.$data.appOpts.colorStyle.color4"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Add exercise to plan"
                    :onClick="addExerciseToPlan"/>
    <MainMenuButton
                    :bgColor="$root.$data.appOpts.colorStyle.color2"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Go to advance options"
                    :onClick="goToAdvancedPlanView"/>
    <ModalSelectExercise v-if="modalSelectExerciseVisibility === true"
                         :list="$root.$data.clientExercises"
                         :colors="$root.$data.appOpts.colorStyle"
                         :addToPlan="addToPlan"
                         :closeModal="closeModal"/>

  </view>
</template>

<script>
import AppExerciseList from "./AppExerciseList";
import MainMenuButton from "./MainMenuButton";
import { ScrollView, Alert } from 'react-native';
import { SettingsEditText } from "react-native-settings-components";
import ModalSelectExercise from "./ModalSelectExercise";
import axios from 'axios';

export default {
  name: 'App_Plan',
  components: { ScrollView, SettingsEditText, AppExerciseList, MainMenuButton, ModalSelectExercise },
  data() {
    return {
      modalSelectExerciseVisibility: false,
      plan: {
        name: '',
        exerciseList: [],
        planId: '',
        break_between_exercises: 0,
      }
    }
  },
  props: {
    navigation: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.modalSelectExerciseVisibility = false;
    },
    editOrDeleteExerciseFromPlan(value) {
      let id = value["exercise_id"];
      if (id === undefined)
        id = value["id"];
      Alert.alert('Choose action for ', ''.concat(value["name"].toString()),[
        {
          text: 'Remove exercise from this plan',
          onPress: async () => this.removeExerciseFromPlan(id),
          style: 'default',
        },
        {
          text: 'Move up',
          onPress: () => this.moveExerciseUpInPlan(id),
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }]);
    },
    removeExerciseFromPlan(id) {
      for(var i = 0; i < this.plan.exerciseList.length; i++) {
        if (this.plan.exerciseList[i]["exercise_id"] === id) {
          this.plan.exerciseList.splice(i, 1);
          this.$forceUpdate();
          return;
        }
      }
    },
    moveExerciseUpInPlan(id) {
      for(var i = 0; i < this.plan.exerciseList.length; i++) {
        if (this.plan.planId !== '') {
          if (this.plan.exerciseList[i]["exercise_id"] === id) {
            if (i > 0) {
              const tmp = this.plan.exerciseList[i - 1];
              this.plan.exerciseList[i - 1] = this.plan.exerciseList[i];
              this.plan.exerciseList[i] = tmp;
              this.$forceUpdate();
              return;
            } else
              Alert.alert('This exercise is on the top of the list');
          }
        }
        else {
          if (this.plan.exerciseList[i]["id"] === id) {
            if (i > 0) {
              const tmp = this.plan.exerciseList[i - 1];
              this.plan.exerciseList[i - 1] = this.plan.exerciseList[i];
              this.plan.exerciseList[i] = tmp;
              this.$forceUpdate();
              return;
            } else
              Alert.alert('This exercise is on the top of the list');
          }
        }
      }
    },
    planNameChange(value) {
      this.plan.name = value;
    },
    addExerciseToPlan() {
      if (this.$root.$data.clientExercises.length === 0) {
        Alert.alert('You have not created any exercise', 'Create some to be able to add them to your workout');
      } else
        this.modalSelectExerciseVisibility = !this.modalSelectExerciseVisibility;
    },
    addToPlan(exercise) {
      for(let i = 0; i < this.plan.exerciseList.length; i++) {
        if (this.plan.exerciseList[i] === exercise) {
          Alert.alert('This list already contains this exercise');
          return;
        }
      }
      this.plan.exerciseList.push(exercise);
      this.modalSelectExerciseVisibility = false;
    },
    goToAdvancedPlanView(){
      if (this.plan.name === '') {
        Alert.alert('This plan is unnamed', 'Name it to enter this section');
      } else if(this.plan.exerciseList.length < 2) {
          Alert.alert('This plan does not contain at least 2 exercises', 'Add some to enter this section');
      } else {
          this.navigation.navigate('PlanAdvancedScreen', {plan: this.plan, isUpdate: this.navigation.state.params.isUpdate});
      }
    },
    //UPDATE FUNCTIONS
    async getExerciseListForWorkout(id) {
      await axios.get(this.$root.$data.backend_url.concat('/plan/', id, '/get_exercises')).then((response) => {
        if (response.data !== 'FAILURE') {
          this.plan.exerciseList = response.data;
        } else {
          Alert.alert('Error while loading plan\'s exercise list', response.data);
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
    },
  },
  async created() {
    if (this.navigation.state.params.item !== null) {
      this.plan.planId = this.navigation.state.params.item["id"];
      this.plan.name=this.navigation.state.params.item["name"];
      this.plan.break_between_exercises = this.navigation.state.params.item["break_between_exercises"];
      await this.getExerciseListForWorkout(this.plan.planId);
    }
  }
}
</script>

<style scoped>

</style>