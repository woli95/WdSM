<template>
  <AuthNavigator/>
</template>
<script>
import Auth_Login from './Components/Auth_Login';
import Auth_Register from './Components/Auth_Register';
import Auth_PasswordReset from './Components/Auth_PasswordReset';
import Auth_Loading from './Components/Auth_Loading';
import App_MainMenu from './Components/App_MainMenu';
import App_Settings from './Components/App_Settings';
import App_ExercisesAndPlans from './Components/App_ExercisesAndPlans'
import { createAppContainer, createStackNavigator } from 'vue-native-router';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import App_Exercise from './Components/App_Exercise';
import App_Plan from "./Components/App_Plan";
import App_PlanAdvanced from "./Components/App_PlanAdvanced";
import App_Training from "./Components/App_Training";
import App_History from "./Components/App_History";

const AuthStackNavigator = createStackNavigator(
    {
      LoginScreen: Auth_Login,
      RegisterScreen: Auth_Register,
      PasswordResetScreen: Auth_PasswordReset,
      AuthLoadingScreen: Auth_Loading,
      MainMenuScreen: {
        screen: App_MainMenu,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SettingsScreen: App_Settings,
      ExercisesAndPlansScreen: App_ExercisesAndPlans,
      ExerciseScreen: App_Exercise,
      PlanScreen: App_Plan,
      PlanAdvancedScreen: App_PlanAdvanced,
      TrainingScreen: {
        screen: App_Training,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      HistoryScreen: App_History,
    }, {
      initialRouteName: 'AuthLoadingScreen',
      headerMode: 'none',
    });
const AuthNavigator = createAppContainer(AuthStackNavigator);

export default {
  name: 'App',
  components: {
    AuthNavigator
  },
  data: () => {
    return {
      backend_url: 'http://msgl.hopto.org:4500',
      appOpts: {
        sounds: false,
        vibrations: false,
        colorStyle: {
          name: 'loading',
          color1: 'aqua',
          color2: 'aqua',
          color3: 'aqua',
          color4: 'aqua',
          color5: 'aqua',
        }
      },
      clientExercises: null,
      clientPlans: null,
    }
  },
  methods: {
    async login(username, password) {
      let redirectToMainMenuFlag = false;
      let token;
      await axios.post(this.backend_url.concat('/client/login'), {
        username: username,
        password: password
      }).then (async (response) => {
        if (response.data === 'Invalid credentials') {
          Alert.alert('Authentication process', 'Invalid password or username');
        } else {
          token = response.data;
          await AsyncStorage.setItem('@MSGL:TOKEN', token);
          Alert.alert('Authentication process', 'You are logged in');
          redirectToMainMenuFlag = true;
        }
      }).catch((error) => {
        Alert.alert('Something gone wrong', error.message);
      });
      if(redirectToMainMenuFlag === true) {
        return token;
      } else {
        return false;
      }
    },
    async register(username, email, password) {
      let redirectToLoginFlag = false;
      await axios.post(this.backend_url.concat('/client/register'), {
        username: username,
        email: email,
        password: password
      }).then ((response) => {
        if (response.data === 'Login is used') {
          Alert.alert('Register process', 'This login is used by someone else');
        } else if (response.data === 'Email is used') {
          Alert.alert('Register process', 'Account with this email address currently exists');
        } else if (response.data === 'OK') {
          Alert.alert('Register process', 'Account has been created. You are able to log in');
          redirectToLoginFlag = true;
        }
      }).catch((error) => {
        Alert.alert('Something gone wrong', error.message);
      });
      return redirectToLoginFlag === true;
    },
    async resetPassword(email) {
      let flagToRedirectToLogin = false;
      await axios.get(this.backend_url.concat('/mail/', email, '/send/link')).then((response) => {
        if (response.data === 'OK') {
          Alert.alert('Password restore process', 'Email with link to reset the password has been sento your address');
          flagToRedirectToLogin = true;
        } else {
          Alert.alert(response.data);
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
      return flagToRedirectToLogin === true;
    },
    async logout(token) {
      let flagToRedirectToLogin = false;
      await axios.get(this.backend_url.concat('/client/', token,'/logout')).then(async(response) => {
        if (response.data === 'OK') {
          await AsyncStorage.removeItem('@MSGL:TOKEN');
          Alert.alert('Authentication process', 'You are logged out');
          flagToRedirectToLogin = true;
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
      return flagToRedirectToLogin === true;
    },
    async updateAppOpts() {
      const sounds = await AsyncStorage.getItem('@MSGL:Sounds').catch((error) => {
        Alert.alert(error.message);
      });
      if (sounds !== null) {
        if (sounds === 'true')
          this.appOpts.sounds = true;
        else if (sounds === 'false')
          this.appOpts.sounds = false;
      }
      const vibrations = await AsyncStorage.getItem('@MSGL:Vibrations').catch((error) => {
        Alert.alert(error.message);
      });
      if (vibrations !== null) {
        if (vibrations === 'true')
          this.appOpts.vibrations = true;
        else if (vibrations === 'false')
          this.appOpts.vibrations = false;
      }
      const style = await AsyncStorage.getItem('@MSGL:VisualStyle').catch((error) => {
        Alert.alert(error.message);
      });
      if (style === null || style === 'Default dark') {
        this.appOpts.colorStyle = {
          name: 'Default dark',
          color1: '#909090',
          color2: 'orange',
          color3: '#FFFFFF',
          color4: '#A6A6A6',
          color5: '#000000',
        }
      } else if (style === 'Default light') {
        this.appOpts.colorStyle = {
          name: 'Default light',
          color1: 'red',
          color2: 'blue',
          color3: 'brown',
          color4: 'green',
          color5: 'white',
        }
      }
    },
    async updateExerciseList() {
      let token = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.get(this.$root.backend_url.concat('/exercise/getlist/', token)).then((response) => {
        if (response.data !== null && response.data !== 'FAILURE') {
          this.clientExercises = response.data;
        } else if (response.data === 'FAILURE') {
          Alert.alert('Error while loading exercise list' );
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
    },
    async updatePlanList() {
      let token = await AsyncStorage.getItem('@MSGL:TOKEN');
      await axios.get(this.backend_url.concat('/plan/getlist/', token)).then((response) => {
        if (response.data !== null && response.data !== 'FAILURE') {
          this.clientPlans = response.data;
        } else if (response.data === 'FAILURE') {
          Alert.alert('Error while loading plan list');
        }
      }).catch((error) => {
        Alert.alert(error.message);
      });
    }
  },
  async created() {
    await this.updateAppOpts();
  }
};
</script>
<style>

</style>
