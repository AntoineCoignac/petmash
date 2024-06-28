<script setup>
import { onMounted } from 'vue';
import maplibregl from 'maplibre-gl';

// Importer le style de base de MapLibre
import 'maplibre-gl/dist/maplibre-gl.css';

onMounted(() => {
  // Initialiser la carte lorsque le composant est monté
  const map = new maplibregl.Map({
    container: 'map', // ID de l'élément dans lequel la carte sera rendue
    style: 'https://api.maptiler.com/maps/streets/style.json?key=NazFHMGxkCo7F6o0D50x', // URL du style de la carte
    center: [-83.23, 42.318], // Position centrale de la carte [longitude, latitude]
    zoom: 15 // Niveau de zoom initial
  });
});
</script>

<template>
    <div class="container p-ctn" id="about">
        <h1>We are on <span class="bold">fire 🔥</span></h1>
        <p>Welcome to Who's Hotter?, the wackiest and funniest site at the University of Michigan-Dearborn! 🌟
            <br><br>
            Created on June 27, 2024, by a bunch of merry pranksters, our site answers a burning question
            that no one dared to ask: who is hotter between two images? Yes, this includes both humans and our animal
            friends! 🐱🐶
        </p>
        <img class="banner" src="http://localhost:5173/images/us.webp" alt="us">
        <p>Think your cat is sexier than a supermodel? Or that your dog could rival Hollywood actors? This is the
            perfect place to test your hypotheses and laugh at the hilarious results from our users.
            <br><br>
            So, ready to join the hottest game of the year? Click, vote, and have a blast! 🔥
        </p>
        <div id="map" class="map"></div>
    </div>
</template>

<style>
#about {
    display: flex;
    flex-direction: column;
    gap: 45px;
}

.banner {
    border-radius: 20px;
    aspect-ratio: 2/1;
    object-fit: cover;
    filter: brightness(1.2);
}

.map {
    width: 100%;
    height: 500px; /* Vous pouvez ajuster la hauteur selon vos besoins */
    border-radius: 20px;
    margin-top: 20px; /* Ajout de marge pour espacer la carte du texte */
}
</style>
