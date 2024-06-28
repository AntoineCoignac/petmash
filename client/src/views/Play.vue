<script setup>
import { ref, onMounted } from 'vue';
import { ArrowUpIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();


const isLoggedIn = ref(false);

const images = ref([]);
const selectedImages = ref({ for: null, against: null });
const result = ref(null);


const checkLoggedIn = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/auth/isloggedin', {
      withCredentials: true
    });

    if (!response.data.isLoggedIn) {
      console.log(response.data);
      // Redirect to login page if not logged in
      router.push('/login'); // Make sure to import router if using Vue Router
    } else {
      isLoggedIn.value = true; // Set isLoggedIn to true if logged in
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
};

onMounted(() => {
    checkLoggedIn();

    axios.get('http://localhost:8080/api/images/', {
      withCredentials: true
    })
        .then(response => {
            images.value = response.data;
            console.log(images.value);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

const vote = (clickedImageId) => {
    const clickedImage = images.value.find(image => image._id === clickedImageId);
    const otherImage = images.value.find(image => image._id !== clickedImageId);

    console.log(clickedImageId, otherImage._id)

    if (clickedImage && otherImage) {
        axios.post('http://localhost:8080/api/images/vote', {
            for: clickedImageId,
            against: otherImage._id,
        }, {
      withCredentials: true
    })
            .then(response => {
                console.log(response.data)
                result.value = response.data;
                updateProgress();
            })
            .catch(error => {
                console.error('Error posting vote:', error);
            });
    }
};

const updateProgress = () => {
    const forElement = document.getElementById(result.value.forId).parentNode.querySelector('.progress');
    const againstElement = document.getElementById(result.value.againstId).parentNode.querySelector('.progress');
    const nextButton = document.querySelector('.btn.next');

    if (result.value.forDiff > 0) {
        forElement.querySelector('p').textContent = `+${result.value.forDiff}`;
        forElement.querySelector('.icon').classList.add('positive');
        forElement.querySelector('.icon').classList.remove('negative');
        forElement.querySelector('.icon').classList.remove('neutral');
    } else if (result.value.forDiff == 0) {
        forElement.querySelector('p').textContent = `+${result.value.forDiff}`;
        forElement.querySelector('.icon').classList.remove('positive');
        forElement.querySelector('.icon').classList.remove('negative');
        forElement.querySelector('.icon').classList.add('neutral');
    } else {
        forElement.querySelector('p').textContent = `${result.value.forDiff}`;
        forElement.querySelector('.icon').classList.add('negative');
        forElement.querySelector('.icon').classList.remove('positive');
        forElement.querySelector('.icon').classList.remove('neutral');
    }
    forElement.classList.add('active');

    if (result.value.againstDiff > 0) {
        againstElement.querySelector('p').textContent = `+${result.value.againstDiff}`;
        againstElement.querySelector('.icon').classList.add('positive');
        againstElement.querySelector('.icon').classList.remove('negative');
        againstElement.querySelector('.icon').classList.remove('neutral');
    } else if (result.value.againstDiff == 0) {
        againstElement.querySelector('p').textContent = `+${result.value.againstDiff}`;
        againstElement.querySelector('.icon').classList.remove('positive');
        againstElement.querySelector('.icon').classList.remove('negative');
        againstElement.querySelector('.icon').classList.add('neutral');
    } else {
        againstElement.querySelector('p').textContent = `${result.value.againstDiff}`;
        againstElement.querySelector('.icon').classList.add('negative');
        againstElement.querySelector('.icon').classList.remove('positive');
        againstElement.querySelector('.icon').classList.remove('neutral');
    }
    againstElement.classList.add('active');

    nextButton.classList.add('active');
};

const reloadPage = () => {
    window.location.reload();
};
</script>

<template>
    <div class="container p-ctn" id="play">
        <h1 class="title text-center"><span class="bold">Who's hotter?</span> Click to choose</h1>
        <div class="wrapper">
            <div class="item" v-for="(image) in images" :key="image._id">
                <img @click="vote(image._id)" :src="image.path" :alt="image._id" :id="image._id">
                <div class="progress">
                    <ArrowUpIcon class="icon negative" />
                    <p class="title bold"></p>
                </div>
            </div>
            <p class="title bold or">or</p>
        </div>
        <button @click="reloadPage" class="btn primary center next">
            <span>Next</span>
            <ArrowRightIcon class="icon" />
        </button>
    </div>
</template>

<style scoped>
#play {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    max-width: 80%;
    margin: 0 auto;
}

.item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    cursor: pointer;
    position: relative;
    border-radius: 4px ;
    overflow: hidden;
}

.item:nth-child(2) {
    order: 1;
}

.progress {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 10px;
    bottom: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 14px 20px;
    border-radius: 4px ;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);
}

.progress.active {
    display: flex;
}

img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 4px;
    object-fit: cover;
    border: 5px solid transparent;
    transition: ease 0.2s;
}

img.active {
    border: 5px solid black;
}

.item:hover img:not(.active) {
    border: 5px solid var(--grey);
}

.progress .icon.negative {
    transform: rotate(180deg);
}

.progress .icon.neutral {
    transform: rotate(90deg);
}

.next {
    display: none;
}

.next.active {
    display: flex;
}

</style>
