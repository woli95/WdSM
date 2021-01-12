<template>
  <view :style="{
    padding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1
  }">
    <myHeader title="My Simple Gym Log"
                        :titleColor="$root.$data.appOpts.colorStyle.color3"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color2"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Start Training"
                    :onClick="startButton"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color4"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="History"
                    :onClick="historyButton"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color4"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Exercises and Plans"
                    :onClick="exercisesAndPlansButton"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color4"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Settings"
                    :onClick="settingsButton"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color4"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="About"
                    :onClick="aboutButton"/>
    <MainMenuButton :bgColor="$root.$data.appOpts.colorStyle.color2"
                    :fontColor="$root.$data.appOpts.colorStyle.color3"
                    title="Logout"
                    :onClick="logoutButton"/>
    <ModalAbout :backgroundColor="$root.$data.appOpts.colorStyle.color1"
                :borderColor="$root.$data.appOpts.colorStyle.color2"
                :textColor="$root.$data.appOpts.colorStyle.color3"
                :buttonBackgroundColor="$root.$data.appOpts.colorStyle.color2"
                :buttonTextColor="$root.$data.appOpts.colorStyle.color3"
                :isVisible="modalAboutVisibility"
                :onExit="aboutButton"/>
    <ModalSelectPlan
                :backgroundColor="$root.$data.appOpts.colorStyle.color1"
                :borderColor="$root.$data.appOpts.colorStyle.color2"
                :textColor="$root.$data.appOpts.colorStyle.color3"
                :buttonBackgroundColor="$root.$data.appOpts.colorStyle.color2"
                :buttonTextColor="$root.$data.appOpts.colorStyle.color3"
                :list="$root.$data.clientPlans"
                :listTitle="'Select workout'"
                :listHeaderColor="$root.$data.appOpts.colorStyle.color3"
                :listBackgroundColor="$root.$data.appOpts.colorStyle.color4"
                :listItemTextColor="$root.$data.appOpts.colorStyle.color2"
                :isVisible="modalSelectPlanVisibility"
                :onExit="startButton"
                :onItemLongPress="selectPlanToStart"/>
  </view>
</template>
<script>
import myHeader from "./MyHeader";
import MainMenuButton from './MainMenuButton';
import ModalAbout from './ModalAbout';
import ModalSelectPlan from './ModalSelectPlan';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native';
export default {
  name: 'App_MainMenu',
  data: () => {
    return {
      modalAboutVisibility: false,
      modalSelectPlanVisibility: false,
    }
  },
  components: {
    MainMenuButton, ModalAbout, ModalSelectPlan, myHeader
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    startButton() {
      this.modalSelectPlanVisibility = !this.modalSelectPlanVisibility;
    },
    selectPlanToStart(planSelected) {
      this.modalSelectPlanVisibility = false;
      this.navigation.navigate('TrainingScreen', {plan: planSelected})
    },
    historyButton() {
      this.navigation.navigate('HistoryScreen');
    },
    exercisesAndPlansButton() {
      this.navigation.navigate('ExercisesAndPlansScreen');
    },
    settingsButton() {
      this.navigation.navigate('SettingsScreen');
    },
    aboutButton() {
      this.modalAboutVisibility = !this.modalAboutVisibility;
    },
    async logoutButton() {
      const token = await AsyncStorage.getItem('@MSGL:TOKEN');
      this.$root.logout(token).then((response) => {
        if (response === true) {
          this.navigation.navigate('LoginScreen');
        } else {
          Alert.alert('cant logout')
        }
      }).catch((error) => {
        Alert.alert('cant logout', error.message)
      });
    },
  },
  async beforeMount() {
    await this.$root.updateExerciseList();
    await this.$root.updatePlanList();
  }
}
</script>
<style>

</style>