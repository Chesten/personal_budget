<template>
  <div class="expense">
    <b>Add expense Category</b>
    <table class = "input">
        <tr>
            <td>Category</td>
            <td><input type = "text" v-model="budgetCategory"></td>
        </tr>
         <tr>
            <td>Monthly Budget</td>
            <td><input type = "number" v-model.number="budgetLimit"></td>
        </tr>
        <tr>
            <td></td>
            <td><button v-on:click="saveCategory()">Add Category</button></td>
        </tr>
    </table>

    <table class="display">
        <thead>
            <tr>
                <td>Catigory</td>
                <td>Monthly Limit</td>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(z,pos) in allCategories" :key="pos">
            <td>{{z.name}}</td>
            <td>${{z.limit.toFixed(2)}}</td>
        </tr>
        </tbody>
    </table>

    <router-link to="/expenses" replace>Add Expense Details</router-link>

  </div>
</template>
        
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {FirebaseFirestore,  QuerySnapshot, 
        QueryDocumentSnapshot} from "@firebase/firestore-types"
import { FirebaseAuth } from "@firebase/auth-types";

@Component
export default class BudgetCategory extends Vue {

  private budgetCategory = "";
  private budgetLimit = 50
  readonly $appDB!: FirebaseFirestore;
  private allCategories: any[] = [];
  readonly $appAuth!: FirebaseAuth;
  private uid = "none"
 
    saveCategory(): void {
        this.$appDB
        .collection(`users/${this.uid}/categories`)
        .add({name: this.budgetCategory, monthlyLimit: this.budgetLimit})
    }

    mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
    this.$appDB
        .collection(`users/${this.uid}/categories`)
        .orderBy("name")       // Sort by category name
        .onSnapshot((qs: QuerySnapshot) => {
        this.allCategories.splice(0);  // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
            if (qds.exists) {
            const catData = qds.data();
            this.allCategories.push({
                name: catData.name,
                limit: catData.monthlyLimit,
            });
            }
        });
        });
    }



}
</script>

<style>
.input{
  border: 3px solid orange ;
  border-radius: 8px;
  
}
.display, thead{
    border: 1px solid black ;
    
}
.expense{
    float: left;
}
</style>