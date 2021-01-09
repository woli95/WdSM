<template>
</template>
<script>
import AnimatedSplash from 'react-native-animated-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
export default {
  name: 'Auth_Loading',
  components: { AnimatedSplash },
  props: {
    navigation: {
      type: Object,
    },
  },
  async created() {
    const savedToken = await AsyncStorage.getItem('@MSGL:TOKEN').catch((error) => {
      Alert.alert(error.message);
      this.navigation.navigate('LoginScreen');
    });
    if (savedToken === null || savedToken.length <= 10) {
      this.navigation.navigate('LoginScreen');
      return;
    }
    await axios.get(this.$root.$data.backend_url.concat('/client/', savedToken.toString(), '/login')).then((response) => {
      if (response.data === 'OK') {
        Alert.alert('Authentication process', 'You are logged in');
        this.navigation.navigate('MainMenuScreen');
      } else if (response.data === 'Token not valid') {
        this.navigation.navigate('LoginScreen');
      } else {
        Alert.alert(response.data);
        this.navigation.navigate('LoginScreen');
      }
    }).catch((error) => {
      Alert.alert(error.message);
      this.navigation.navigate('LoginScreen');
    });
  }
}
</script>
<style>

</style>