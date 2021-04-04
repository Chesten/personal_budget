<template>
  <div id="spending">
   <section>
    <h3>Add expense Category</h3>
    <table class = "spendingInput">
        <tr>
            <td>Amount</td>
            <td><input type = "number" v-model.number="spendingAmount"></td>
        </tr>
         <tr>
            <td>Date</td>
            <td><input type = "date" v-model="spendingDate"></td>
        </tr>
        <tr>
            <td>Where</td>
            <td><input type = "text" v-model="spendingPlace"></td>
        </tr>
        <tr>
            <td>Category</td>
            <td><select v-model="spendingCategory">
                <option v-for="(c,pos) in allCategories" :value="c.name" :key="pos">{{c.name}}</option>
            </select></td>
        </tr>
        <tr>
        
            <td></td>
            <td><button v-on:click="saveCategory()">Save</button></td>
        </tr>
    </table>
   </section>
   <section>
    <h3>Expense</h3>
    <table class="expenses">
        
        <thead>
            <tr>
                <td>Date</td>
                <td>Category</td>
                <td>Place of Purchase</td>
                <td>Amount</td>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(z,pos) in allExpenses" :key="pos">
            <td>{{z.date}}</td>
            <td>{{z.category}}</td>
            <td>{{z.place}}</td>
            <td>${{Number(z.amount).toFixed(2)}}</td>
        </tr>
        </tbody>
    </table>
   </section>
   <section>
    <h3>Spending Summary</h3>
    <table class="sumTotals">
        <thead>
            <tr>
                <td>Category</td>
                <td>Total</td>
                <td>Monthly Allocation</td>
                <td>Message</td>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(z,pos) in expenseByCategory" :key="pos">
            <td>{{z.category}}</td>
            <td>${{Number(z.amount).toFixed(2)}}</td>
            <td>${{Number(z.limit).toFixed(2)}}</td>
            <td>{{message(z.amount, z.limit)}}</td>
        </tr>
        </tbody>
    </table>
   </section>
   <section>
    <ApexChart width="260" type="donut" :options="{
        labels: expenseByCategory.map(forDonut => forDonut.category),
        series: expenseByCategory.map(sweets => sweets.amount) 
    }">{{testFunction()}}</ApexChart>
   </section>
   <router-link to="/category" replace>Add New Category</router-link>
  </div>
</template>
        
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {FirebaseFirestore, QuerySnapshot, 
        QueryDocumentSnapshot} from "@firebase/firestore-types"
import ApexChart from "vue-apexcharts";
import { FirebaseAuth } from "@firebase/auth-types";

@Component({components: {ApexChart}})

export default class MyExpense extends Vue {
 @Prop() 
  private spendingAmount = 10;
  private spendingDate = ""
  private spendingPlace = ""
  private spendingCategory = "" 

  readonly $appAuth!: FirebaseAuth;
  private uid = "none"

  readonly $appDB!: FirebaseFirestore;
  private allCategories: any[] = [];
  private allExpenses: any[]=[];
  
  groupedTotal = new Map<string, number>()
  private expenseByCategory: any[]=[];

    testFunction():void{
        this.expenseByCategory.forEach(element => {
            console.log("element cat: " + element.category)
            console.log("element amount: " + element.amount)
            console.log("element limit: " + element.limit)
        });
    }

    message(total:number, limit:number): string{
        if(total > limit){
            return "over Budget"
        }else return "OK"
    }

    saveCategory(): void {
        this.$appDB
        .collection(`users/${this.uid}/expenses`)
        .add({amount: this.spendingAmount, date: this.spendingDate, 
              place: this.spendingPlace, category: this.spendingCategory})
    }
    mounted(): void {
        this.uid = this.$appAuth.currentUser?.uid ?? "none";
        //setting up allCategories
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
        //setting up allExpenses
        this.$appDB
            .collection(`users/${this.uid}/expenses`)
            .orderBy("date")       // Sort by category name
            .onSnapshot((qs: QuerySnapshot) => {
            this.groupedTotal.clear()
            this.allExpenses.splice(0);  // remove old data
            this.expenseByCategory.splice(0);  // remove old data
            qs.forEach((qds: QueryDocumentSnapshot) => {
                        
                if (qds.exists) {
                const expData = qds.data();
                this.allExpenses.push({
                    date: expData.date,
                    amount: expData.amount,
                    place: expData.place, 
                    category: expData.category
                });
                }
            });
        //mapping expenses

            
        this.allExpenses.forEach((ex: any) => {
            const { category, amount } = ex;
            console.log("raw " + category)
            console.log("raw " + amount)
            if (this.groupedTotal.has(category)) {
            // This category has been recorded earlier, get the old total
            const oldTotal = this.groupedTotal.get(category) as number;
            this.groupedTotal.set(category, oldTotal + amount as number);
            console.log("map " + category + " at " + (this.groupedTotal.get(category) as number))
            } else {
            // This is a new category
            this.groupedTotal.set(category, amount);
            console.log("First map " + category + " at " + (this.groupedTotal.get(category) as number))
            }
            });
            

            //expenses by category filling
            this.groupedTotal.forEach((spTotal: number, spCat: string) => {
            // locate the this category within the `allCategories` array
            const pos = this.allCategories.findIndex((d: any) => d.name === spCat);
            this.expenseByCategory.push({
                category: spCat,
                amount: spTotal,
                limit: this.allCategories[pos].limit,
            });
            });

        });

  
                

        }

}


</script>

<style>
.spendingInput{
  border: 3px solid blue ;
  border-radius: 8px;
  
}
.display, .expenses, .sumTotals{
    border: 1px solid black ;
    
}

#spending{
      display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-areas: "input summary" "donut expenses";
}
#spending > section:nth-child(1) {
  grid-area: input;
}
#spending > section:nth-child(2) {
  grid-area: expenses;
}
#spending > section:nth-child(3) {
  grid-area: summary;
}
#spending > :nth-child(4) {
  grid-area: donut;
}
</style>