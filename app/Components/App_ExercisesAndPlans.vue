<template>
  <view :style="{
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1
  }">
    <view :style="{
      marginTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height:50,
    }">
      <TouchableOpacity v-if="activeView === 'Exercises'"
          :style="{
            width: 160,
            height: 40,
            backgroundColor: $root.$data.appOpts.colorStyle.color2,
            justifyContent: 'center'}"
          :onPress="() => changeView('Exercises')">
        <Text :style="{
          color: $root.$data.appOpts.colorStyle.color3,
          textAlign: 'center',
          fontSize: 20,
          }">Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity v-if="activeView === 'Exercises'"
          :style="{
            width: 160,
            height: 40,
            backgroundColor: $root.$data.appOpts.colorStyle.color4,
            justifyContent: 'center',
      }"
          :onPress="() => changeView('Plans')">
        <Text :style="{
          textAlign: 'center',
          color: $root.$data.appOpts.colorStyle.color3,
          fontSize: 20,
        }">Plans</Text>
      </TouchableOpacity>
      <TouchableOpacity v-if="activeView === 'Plans'"
                        :style="{
            width: 160,
            height: 40,
            backgroundColor: $root.$data.appOpts.colorStyle.color4,
            justifyContent: 'center'}"
                        :onPress="() => changeView('Exercises')">
        <Text :style="{
          color: $root.$data.appOpts.colorStyle.color3,
          textAlign: 'center',
          fontSize: 20,
          }">Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity v-if="activeView === 'Plans'"
                        :style="{
            width: 160,
            height: 40,
            backgroundColor: $root.$data.appOpts.colorStyle.color2,
            justifyContent: 'center',
      }"
                    :onPress="() => changeView('Plans')">
        <Text :style="{
          textAlign: 'center',
          color: $root.$data.appOpts.colorStyle.color3,
          fontSize: 20,
        }">Plans</Text>
      </TouchableOpacity>
    </view>
      <AppExerciseList v-if="activeView === 'Exercises'"
                       :title="'Your exercises'"
                       :list="$root.$data.clientExercises"
                       :headerColor="$root.$data.appOpts.colorStyle.color3"
                       :bgColor="$root.$data.appOpts.colorStyle.color4"
                       :itemTextColor="$root.$data.appOpts.colorStyle.color2"
                       :dividerColor="$root.$data.appOpts.colorStyle.color1"
                       :onItemLongPress="onExerciseItemLongPress"/>
      <MainMenuButton v-if="activeView === 'Exercises'"
                      :bgColor="$root.$data.appOpts.colorStyle.color2"
                      :fontColor="$root.$data.appOpts.colorStyle.color3"
                      title="Add new exercise"
                      :onClick="addNewExercise"/>
    <AppExerciseList v-if="activeView === 'Plans'"
                     :title="'Your plans'"
                     :list="$root.$data.clientPlans"
                     :headerColor="$root.$data.appOpts.colorStyle.color3"
                     :bgColor="$root.$data.appOpts.colorStyle.color4"
                     :itemTextColor="$root.$data.appOpts.colorStyle.color2"
                     :dividerColor="$root.$data.appOpts.colorStyle.color1"
                     :onItemLongPress="onPlanItemLongPress"/>
    <MainMenuButton v-if="activeView === 'Plans'"
                    :bgColor="$root.$data.appOpts.colorStyle.color2"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Create new plan"
                    :onClick="addNewPlan"/>

  </view>
</template>
<script>
import { Alert, ScrollView, TouchableOpacity, Text} from 'react-native';
import MainMenuButton from "./MainMenuButton";
import AppExerciseList from "./AppExerciseList";
import axios from 'axios';

export default {
  name: 'App_ExercisesAndPlans',
  components:  { ScrollView, MainMenuButton, AppExerciseList, TouchableOpacity, Text},
  data() {
    return {
      activeView: 'Exercises',
    }
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    changeView(view) {
      this.activeView = view;
    },
    onExerciseItemLongPress(value) {
      Alert.alert('Choose action for ', ''.concat(value["name"].toString()),[
        {
          text: 'Delete exercise',
          onPress: async () => this.deleteExercise([value["id"]]),
          style: 'default',
        },
        {
          text: 'Edit exercise',
          onPress: () => this.navigation.navigate('ExerciseScreen', {item: value}),
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }]);
    },
    onPlanItemLongPress(value) {
      Alert.alert('Choose action for ', ''.concat(value["name"].toString()),[
        {
          text: 'Delete plan',
          onPress: async () => this.deletePlan([value["id"]]),
          style: 'default',
        },
        {
          text: 'Edit plan',
          onPress: () => this.navigation.navigate('PlanScreen', {item: value, isUpdate: true}),
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }]);
    },
    addNewExercise() {
      this.navigation.navigate('ExerciseScreen', {item: null});
    },
    addNewPlan() {
      this.navigation.navigate('PlanScreen', {item: null, isUpdate: false});
    },
    async deleteExercise(exerciseId) {
      await axios.put(this.$root.backend_url.concat('/exercise/', exerciseId, '/delete')).then(async (response) => {
        if (response.data === 'OK') {
          Alert.alert('Exercise removing', 'Exercise has been removed');
          await this.$root.updateExerciseList();
          this.navigation.navigate('ExercisesAndPlansScreen');
        } else {
          Alert.alert(response.data);
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
    },
    async deletePlan(planId) {
      await axios.put(this.$root.backend_url.concat('/plan/', planId, '/delete')).then((response) => {
        if (response.data === 'OK') {
          Alert.alert('Plan delete', 'Plan has been deleted');
          this.$root.updatePlanList();
          this.navigation.navigate('ExercisesAndPlansScreen');
        }
      }).catch((error) => {
        Alert.alert(error.message);
      })
    }
  },
}
</script>
<style>

</style>