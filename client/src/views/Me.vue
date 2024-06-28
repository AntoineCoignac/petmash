<script>
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/vue/24/outline'; // Adjusted import path

export default {
    data() {
        return {
            profileForm: {
                firstName: localStorage.getItem('firstName') || '',
                lastName: localStorage.getItem('lastName') || '',
                username: localStorage.getItem('username') || '',
            },
            errorUpdate: null,
            successUpdate: null
        };
    },
    methods: {
        async saveProfile() {

            if (!this.profileForm.firstName || !this.profileForm.lastName) {
                this.errorUpdate = "Fields can't be empty.";
                this.successUpdate = null;
            } else {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('No user ID found in local storage.');
                    return;
                }

                try {
                    const response = await axios.put(`http://localhost:8080/api/users/${userId}`, {
                        firstname: this.profileForm.firstName,
                        lastname: this.profileForm.lastName
                    }, { withCredentials: true });

                    if (response.status === 200) {
                        this.errorUpdate = null;
                        this.successUpdate = "Informations saved.";
                        console.log('Profile updated successfully:', response.data);
                        localStorage.setItem('firstName', this.profileForm.firstName);
                        localStorage.setItem('lastName', this.profileForm.lastName);
                        this.$router.go();
                    } else {
                        console.error('Failed to update profile:', response.data);
                    }
                } catch (error) {
                    console.error('Error during profile update:', error);
                }
            }
        },
        logout() {
            console.log('User logged out');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            this.$router.push('/login');
        },
    },
    components: {
        ArrowRightIcon // Register ArrowRightIcon component locally
    }
};
</script>

<template>
    <div class="container p-ctn" id="edit">
        <h1>Glad to see you 👋 <span class="bold">{{ profileForm.firstName }} {{ profileForm.lastName }}</span></h1>
        <form class="form edit-form">
            <h2 class="title bold">Edit</h2>
            <div class="fields-2">
                <div class="field">
                    <label>First Name</label>
                    <input type="text" v-model="profileForm.firstName" placeholder="Antoine" />
                </div>
                <div class="field">
                    <label>Last Name</label>
                    <input type="text" v-model="profileForm.lastName" placeholder="Coignac" />
                </div>
            </div>
            <button type="button" @click="saveProfile" class="btn primary full save-button">
                <span>Save</span>
                <ArrowRightIcon class="icon" />
            </button>
            <p v-if="errorUpdate" class="error">{{ errorUpdate }}</p>
            <p v-if="successUpdate" class="success">{{ successUpdate }}</p>
        </form>
    </div>
</template>

<style scoped>
#edit {
    display: flex;
    flex-direction: column;
    gap: 60px;
}
</style>
