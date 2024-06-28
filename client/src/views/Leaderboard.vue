<template>
    <div class="container p-ctn" id="leaderboard">
        <h1>Who’s hottest? 🏆 <span class="bold">Leaderboard</span></h1>
        <div class="wrapper">
            <div class="item" v-for="(item, index) in items" :key="item._id">
                <p class="rank title grey bold">{{ index == 0 ? "🌋" :
                                                (  index == 1 ? "🔥" :
                                                (  index == 2 ? "🌶️" :  index + 1)) }}</p>
                <img :src="item.path" :alt="item._id">
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Leaderboard',
    data() {
        return {
            items: []
        };
    },
    mounted() {
        fetch('http://localhost:8080/api/images/leaderboard')
            .then(response => response.json())
            .then(data => {
                this.items = data;
                console.log(this.items);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
};
</script>
  
  <style scoped>
    #leaderboard{
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

    .wrapper{
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .item{
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .rank{
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img{
      width: 100px;
      height: 100px;
      border-radius: 4px;
      object-fit: cover;
    }
  </style>
  