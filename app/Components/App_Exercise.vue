<template>
  <ScrollView :style="{
    padding: 40,
    backgroundColor: $root.$data.appOpts.colorStyle.color1}">
    <SettingsEditText
        title="Exercise name"
        dialogDescription="Enter exercise name"
        negativeButtonTitle="Cancel"
        positiveButtonTitle="Save"
        :onValueChange="exerciseNameChange"
        :value="exercise.name"
        :containerStyle="{
          borderWidth: 1,
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
    <SettingsPicker
        title="Measure type"
        dialogDescription="Choose exercise measure type"
        :options="[{label: 'Time - seconds', value:'seconds'}, {label: 'Distance - meters', value: 'meters'}, {label: 'Amount - repeats', value: 'repeats'}]"
        :onValueChange="measureTypeChange"
        :value="exercise.measureType"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :containerStyle="{
          borderWidth: 1,
          borderColor: $root.$data.appOpts.colorStyle.color2,
          margin: 5,
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          color: $root.$data.appOpts.colorStyle.color3,
          fontWeight: 'bold',
        }"
        :modalStyle="{
          header: {
              wrapper: {
                backgroundColor: $root.$data.appOpts.colorStyle.color2,
              },
          },
        }"
    />
    <SettingsPicker
        title="Category type"
        dialogDescription="Choose exercise measure type"
        :options="[
            {label: 'Cardio', value:'Cardio'},
            {label: 'Strength', value: 'Strength'},
            {label: 'Mobility', value: 'Mobility'},
            ]"
        :onValueChange="categoryChange"
        :value="exercise.category"
        :valueStyle="{
          color: $root.$data.appOpts.colorStyle.color3
        }"
        :containerStyle="{
          borderWidth: 1,
          borderColor: $root.$data.appOpts.colorStyle.color2,
          margin: 5,
          backgroundColor: $root.$data.appOpts.colorStyle.color4
        }"
        :titleStyle="{
          color: $root.$data.appOpts.colorStyle.color3,
          fontWeight: 'bold',
        }"
        :modalStyle="{
          header: {
              wrapper: {
                backgroundColor: $root.$data.appOpts.colorStyle.color2,
              },
          },
        }"
    />
    <MainMenuButton v-if="navigation.state.params.item === null"
                    :bgColor="$root.$data.appOpts.colorStyle.color2"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Create"
                    :onClick="addExercise"/>
  </ScrollView>
</template>

<script>
import { SettingsEditText, SettingsPicker } from "react-native-settings-components";
import { ScrollView, Alert } from 'react-native';
import MainMenuButton from "./MainMenuButton";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default {
  name: 'App_Exercise.vue',
  components: { SettingsEditText, SettingsPicker, ScrollView, MainMenuButton },
  data() {
    return {
      exercise: {
        name: '',
        measureType: '',
        category: '',
      },
    }
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    async exerciseNameChange(value) {
      this.exercise.name = value;
      if (this.navigation.state.params.item !== null)
        await this.updateExercise('name', value);
    },
    async measureTypeChange(value) {
      this.exercise.measureType = value;
      if (this.navigation.state.params.item !== null)
        await this.updateExercise('measure', value);
    },
    async categoryChange(value) {
      this.exercise.category = value;
      if (this.navigation.state.params.item !== null)
        await this.updateExercise('category', value);
    },
    async addExercise() {
      if (this.exercise.name === '') {
        Alert.alert('Exercise creation error', 'Enter exercise name');
      } else if (this.exercise.measureType === '') {
        Alert.alert('Exercise creation error', 'Choose exercise measure type');
      } else if (this.exercise.category === '') {
        Alert.alert('Exercise creation error', 'Choose exercise category');
      } else {
        let token = await AsyncStorage.getItem('@MSGL:TOKEN');
        await axios.post(this.$root.backend_url.concat('/exercise/create/', token), {
          name: this.exercise.name,
          measure: this.exercise.measureType,
          category: this.exercise.category
        }).then(async (response) => {
          if (response.data === 'OK') {
            Alert.alert('Exercise create', 'Exercise has been created');
            await this.$root.updateExerciseList();
            this.navigation.navigate('ExercisesAndPlansScreen');
          } else {
            Alert.alert(response.data);
          }
        }).catch((error) => {
          Alert.alert(error.message);
        })
      }
    },
    async updateExercise(attribute, value) {
      await axios.put(this.$root.backend_url.concat('/exercise/', this.navigation.state.params.item["id"].toString(), '/update'), {
        what: attribute,
        newValue: value,
      }).then(async (response) => {
        if (response.data === 'OK') {
          await this.$root.updateExerciseList();
          Alert.alert('Exercise update', attribute.concat(' has been changed'))
          this.navigation.navigate('ExerciseScreen', {item: this.navigation.state.params.item });
        } else {
          Alert.alert(response.data);
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
    },
  },
  async created() {
    if (this.navigation.state.params.item !== null) {
      this.exercise.name = this.navigation.state.params.item["name"];
      this.exercise.measureType = this.navigation.state.params.item["measure"];
      this.exercise.category = this.navigation.state.params.item["category"];
    }
  }
}
</script>

<style scoped>

</style>