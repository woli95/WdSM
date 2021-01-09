<template>
  <view :style="{
    padding: 20,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: $root.$data.appOpts.colorStyle.color1
  }">
    <ScrollView v-if="trainingList !== null"
          :style="{
            backgroundColor: $root.$data.appOpts.colorStyle.color4,
            paddingLeft: 10,
            paddingRight: 10,
            margin: 5,
          }"
    >
      <view v-for="(training, i) in trainingList" :key="i" :style="{padding: 5, margin: 5,}">
        <TouchableOpacity :style="{backgroundColor: $root.$data.appOpts.colorStyle.color1}"
                          :onLongPress="() => deleteTraining(training.tr.id)"
                          :onPress="() => showTraining(i)">
          <Text :style="styles.listHeader">
            {{ training.tr.training_date.slice(5, 16) }} -- {{ training.tr.duration.slice(17, 25) }} {{"\n"}} "{{training.tr.name}}"
          </Text>
        </TouchableOpacity>
        <view>
          <view v-for="(unit, j) in training.ex" :style="{borderWidth: 1, borderColor: $root.$data.appOpts.colorStyle.color2}">
            <view v-if="visibleElementsArray[i].training === true">
              <TouchableOpacity :onPress="() => showUnits(i, j)"><Text :style="styles.exerciseName">{{j+1}}. {{ unit.unit.name }}</Text></TouchableOpacity>
                <view v-if="visibleElementsArray[i]['units'][j] === true" :style="{backgroundColor: $root.$data.appOpts.colorStyle.color1}">
                  <Text v-for="(ex, k) in unit.sets" :key="k" :style="styles.others">Set {{ex.set_nr}}: Weight: {{ ex.weight }}
                    {{ unit.unit.measure }}: {{ex.measure}}</Text>
                  <Text :style="styles.others" v-if="unit.unit.notes !== ''">Notes: {{unit.unit.notes}}</Text>
                </view>
            </view>
          </view>
        </view>
      </view>
    </ScrollView>
  </view>
</template>

<script>
import { Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';

export default {
  name: "App_History",
  data() {
    return {
      trainingList: [],
      visibleElementsArray: [],
      styles: {
        listHeader: {
          fontSize: 25,
          color: this.$root.$data.appOpts.colorStyle.color2,
          textAlign: 'center',
          padding: 5,
        },
        exerciseName: {
          padding: 5,
          fontSize: 20,
          marginLeft: 10,
          color: this.$root.$data.appOpts.colorStyle.color3,
        },
        others: {
          padding: 5,
          fontSize: 15,
          color: this.$root.$data.appOpts.colorStyle.color3,
        }
      }
    }
  },
  components: { Text, TouchableOpacity, ScrollView },
  methods: {
    async deleteTraining(id) {
      console.log('delete'.concat(id))
    },
    showTraining(index) {
      this.visibleElementsArray[index]["training"] = !this.visibleElementsArray[index]["training"];
    },
    showUnits(i, j) {
      this.visibleElementsArray[i]['units'][j] = !this.visibleElementsArray[i]['units'][j];
      this.$forceUpdate();
    },
    async getTrainingList() {
      let list = [];
      const token = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.get(this.$root.backend_url.concat('/training/', token, '/get_training_list')).then((response) => {
        if (response.data !== 'FAILURE')
          list = response.data
        else
          Alert.alert('Error while getting training list for client', response.data);
      }).catch((error) => {
        Alert.alert('Error while getting training list for client', error.message);
      });
      return list;
    },
    async getTrainingUnits(training_id) {
      let list;
      await axios.get(this.$root.backend_url.concat('/training/', training_id,'/get_training_unit_list')).then((response) => {
        if (response.data !== 'FAILURE')
          list = response.data
        else
          Alert.alert('Error while getting training unit list', response.data);
      }).catch((error) => {
        Alert.alert('Error while getting training unit list', error.message)
      });
      return list;
    },
    async getTrainingSets(unit_id) {
      let list;
      await axios.get(this.$root.backend_url.concat('/training/', unit_id,'/get_training_unit_set_list')).then((response) => {
        if (response.data !== 'FAILURE')
          list = response.data
        else
          Alert.alert('Error while getting training set list', response.data);
      }).catch((error) => {
        Alert.alert('Error while getting training set list', error.message)
      });
      return list;
    },
  },
  async beforeMount() {
    let tmp_trainings = await this.getTrainingList();
    for(var i = 0; i < tmp_trainings.length; i++) {
      this.visibleElementsArray.push({training: false, units: []});
      let units_list = await this.getTrainingUnits(tmp_trainings[i]["id"]);
      let set_list = [];
      let more = [];
      for(var j = 0; j < units_list.length; j++) {
        this.visibleElementsArray[i].units.push(false);
        more.push({
          unit: units_list[j],
          sets: await this.getTrainingSets(units_list[j]["id"])
        })
      }
      this.trainingList.push({
        tr: tmp_trainings[i],
        ex: more
      });
    }
  }
}
</script>

<style scoped>

</style>