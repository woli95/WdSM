<template>
  <view :style="{
    padding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1
  }">
<!--HEADER CONTENT-->
    <view :style="{
      flex: 1,
      width: 300,
    }">
     <AppTrainingHeader v-if="planExercisesList !== null"
         :planName="navigation.state.params.plan['name']"
         :currentyExercise="planExercisesList[currentExerciseNumber]"
         :colors="$root.$data.appOpts.colorStyle"
         :abandonWorkout="backToMainMenu"
         :trainingTimeUpdate="updateTrainingTime"
     />
    </view>
<!--BODY CONTENT-->
    <view :style="{
      flex: 3,
      width: 370,
      height: 700,
    }">
      <ProgressBar :progress="progressIndicator" :color="$root.$data.appOpts.colorStyle.color2"/>
      <AppTrainingBody v-if="planExercisesList !== null"
                       :colors="$root.$data.appOpts.colorStyle"
                       :currentExercise="planExercisesList[currentExerciseNumber]"
                       :onExerciseSubmit="submitExercise"
                       :sounds="$root.$data.appOpts.sounds"
                       :vibrations="$root.$data.appOpts.vibrations"
                       :exerciseBreak="plan['break_between_exercises']"

      />
    </view>
  </view>
</template>

<script>
import { Text, Alert } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AppTrainingHeader from "./AppTrainingHeader";
import AppTrainingBody from "./AppTrainingBody";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default {
  name: "App_Training",
  data: () => {
    return {
      plan: null,
      planExercisesList: null,
      currentExerciseNumber: 0,
      trainingTimer: '',
      progressIndicator: 0,
      submittedExercisesArray: [],
      submittedExercisesNotesArray: [],
    }
  },
  props: {
    navigation: {
      type: Object,
    }
  },
  methods: {
    updateTrainingTime(h, m, s) {
      this.trainingTimer = h.concat(':', m, ':', s);
    },
    backToMainMenu() {
      this.navigation.navigate('MainMenuScreen');
    },
    async getExercisesListForWorkout() {
      let result = null;
      await axios.get(this.$root.backend_url.concat('/plan/', this.plan["id"], '/get_exercises')).then((response) => {
        if (response.data !== 'FAILURE') {
          result = response.data;
        } else {
          Alert.alert('Error while loading plan exercise list ', response.data);
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
      return result;
    },
    async submitExercise(data, note) {
      for (var i=0; i < data.length; i++) {
        if (data[i].measure === '' || data[i].weight === '') {
          Alert.alert('Empty data provided');
          return;
        }
      }
      this.submittedExercisesArray.push(data);
      if (note !== null)
        this.submittedExercisesNotesArray.push(note);
      else
        this.submittedExercisesNotesArray.push(' ');
      if (this.currentExerciseNumber + 1 < this.planExercisesList.length) {
        this.currentExerciseNumber += 1
        this.progressIndicator = this.currentExerciseNumber / this.planExercisesList.length;
      } else {
        await this.submitTraining();
      }
    },
    async submitTraining() {
      const token = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.post(this.$root.backend_url.concat('/training/',token,'/create'), {
        sets_data: this.submittedExercisesArray,
        plan: this.planExercisesList,
        notes: this.submittedExercisesNotesArray,
        duration: this.trainingTimer,
        workoutName: this.plan["name"]
      }).then((response) => {
        if (response.data === 'OK') {
          Alert.alert('Hell yea !', 'You finished your training');
          this.navigation.navigate('MainMenuScreen');
        } else {
          Alert.alert('Error while creating training '.concat(response.data));
        }
      }).catch((error) => {
        Alert.alert('Error while creating training '.concat(error.message));
      });
      this.submittedExercisesArray = [];
      this.submittedExercisesNotesArray = [];
    }
    ////////////

  },
  components: { Text, AppTrainingHeader, AppTrainingBody, ProgressBar },
  async beforeMount() {
    this.plan = this.navigation.state.params.plan;
    this.planExercisesList = await this.getExercisesListForWorkout();
    this.currentExerciseNumber = 0
  }
}
</script>

<style scoped>

</style>