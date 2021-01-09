<template>
  <view :style="{
    flex: 1,
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1}">
    <AppPlanAdvancedTable
                          :list="navigation.state.params.plan.exerciseList"
                          :tableBackgroundColor="$root.$data.appOpts.colorStyle.color4"
                          :headerBackgroundColor="$root.$data.appOpts.colorStyle.color2"
                          :textColor="$root.$data.appOpts.colorStyle.color3"
                          :borderColor="$root.$data.appOpts.colorStyle.color5"
                          :textEditableItemColor="$root.$data.appOpts.colorStyle.color2"
                          :textNotEditableItemColor="$root.$data.appOpts.colorStyle.color3"
                          :buttonBackgroundColor="$root.$data.appOpts.colorStyle.color2"
                          :button2BackgroundColor="$root.$data.appOpts.colorStyle.color1"
                          :buttonTextColor="$root.$data.appOpts.colorStyle.color3"
                          :backendURL="$root.$data.backend_url"
                          :name="navigation.state.params.plan.name"
                          :addPlan="addPlan"
                          :isUpdate="navigation.state.params.isUpdate"
                          :break_between_exercises="navigation.state.params.plan.break_between_exercises"
    />
  </view>
</template>

<script>
import AppPlanAdvancedTable from "./AppPlanAdvancedTable";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
export default {
  name: 'App_PlanAdvanced',
  components: { AppPlanAdvancedTable },
  props: {
    navigation: {
      Type: Object
    }
  },
  methods: {
    async addPlan(plan_name, plan_exercise_list, break_between_exercises, plan_exercise_data, isUpdate) {
      const token = await AsyncStorage.getItem('@MSGL:TOKEN');
      if (isUpdate === false) {
        await axios.post(this.$root.backend_url.concat('/plan/create/', token), {
          name: plan_name,
          exerciseList: plan_exercise_list,
          setsAndBreaks: plan_exercise_data,
          break_time: break_between_exercises,
        }).then(async (response) => {
          if (response.data === 'OK') {
            Alert.alert('Plan has been created');
            await this.$root.updatePlanList();
            this.navigation.navigate('ExercisesAndPlansScreen');
          } else {
            Alert.alert('Plan creation error', response.data);
          }
        }).catch((error) => {
          Alert.alert(error.message);
        });
      } else if (isUpdate === true) {
          await axios.put(this.$root.backend_url.concat('/plan/', this.navigation.state.params.plan.planId, '/update'), {
            name: this.navigation.state.params.plan.name,
            exerciseList: plan_exercise_list,
            setsAndBreaks: plan_exercise_data,
            break_time: break_between_exercises
          }).then(async (response) => {
            if (response.data === 'OK') {
              Alert.alert('Plan has been updated');
              await this.$root.updatePlanList();
              this.navigation.navigate('ExercisesAndPlansScreen');
            } else {
              Alert.alert('Plan update error', response.data);
            }
          }).catch((error) => {
              Alert.alert(error.message);
          });
      }
    }
  }
}
</script>

<style scoped>

</style>