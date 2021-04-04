import Vue from 'vue'
import App from './App.vue'
import firebase from "firebase/app"
import "firebase/firestore"
import VueApexCharts from "vue-apexcharts";
import "firebase/auth";
import { AppRouter } from "./app-routing";

Vue.use(VueApexCharts);

const firebaseConfig = {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

    apiKey: "AIzaSyDj62thJYxIQjprUW4H5NQ9t0E_dzCj9uM",
    authDomain: "personal-budgeting-app-78600.firebaseapp.com",
    projectId: "personal-budgeting-app-78600",
    storageBucket: "personal-budgeting-app-78600.appspot.com",
    messagingSenderId: "10547314207",
    appId: "1:10547314207:web:272d968233e42a49dd1f2a",
    measurementId: "G-FCH720EB2X"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.prototype.$appAuth = firebase.auth();

Vue.prototype.$appDB = firebase.firestore();
Vue.config.productionTip = false

new Vue({
  router: AppRouter, 
  render: h => h(App),
}).$mount('#app')
