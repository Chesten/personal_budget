<template>
    <div class="logIn">
        <table class=logIn-inpuut-table>
            <tr>
                <td>Email</td>
                <td><input type="text" v-model="userEmail"></td>
            </tr>
            <tr>
                <td>Password</td>
                <td><input type="password" v-model="userPassword"></td>
            </tr>
            <tr>
                <td><button :disabled="noInput" v-on:click="SignIn()">SignIn</button></td>
                <td><button :disabled="noInput" v-on:click="SignUp()">SignUp</button></td>
            </tr>
        </table>
        <div>{{message}}</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";


@Component
export default class AppLogin extends Vue {
   @Prop() 
    private message="";
    readonly $appAuth!: FirebaseAuth;
    private userEmail="";
    private userPassword="";
  $router: any;



    get noInput(): boolean {
         return this.userEmail.length === 0 || this.userPassword.length === 0;
    }
    SignIn(): void{
        this.$appAuth
            .signInWithEmailAndPassword(this.userEmail, this.userPassword)
            .then((u: UserCredential) => {
            this.showMessage(`Login successful UID ${u.user?.uid}`);
            this.$router.push({ path: "/expenses" });
            })
            .catch((err: any) => {
            this.showMessage(`Unable to login ${err}`);
            });
    }
    SignUp(): void{
        this.$appAuth
            .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
            .then((u: UserCredential) => {
            this.showMessage(`User create UID ${u.user?.uid}`);
            this.$router.push({ path: "/category" });
            })
            .catch((err: any) => {
            this.showMessage(`Unable to create account ${err}`);
            });    
    }
    showMessage(m: string): void {
        this.message = m;
        setTimeout(() => {    // Auto disappear after 5 seconds
            this.message = "";
        }, 5000);
    }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
