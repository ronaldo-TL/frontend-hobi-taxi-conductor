<template>
  <q-page padding>
    <div id="map" class="map-container"></div>
  </q-page>
</template>

<script>
import { GOOGLE_MAPS_API_KEY } from 'src/config.js'

export default {
  name: 'GoogleMap',
  setup () {
  },
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.loadGoogleMapsScript()
      .then(() => {
        this.initMap()
      })
      .catch((error) => {
        console.error('Error al cargar Google Maps:', error)
      })
  },
  methods: {
    loadGoogleMapsScript () {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve() // Si la API ya está cargada, resuelve la promesa
          return
        }

        const existingScript = document.getElementById('google-maps-script')
        if (existingScript) {
          existingScript.onload = resolve
          existingScript.onerror = reject
          return
        }

        const script = document.createElement('script')
        script.id = 'google-maps-script'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
        script.async = true
        script.defer = true

        script.onload = resolve
        script.onerror = reject

        document.head.appendChild(script)
      })
    },
    initMap () {
      const mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      }

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions)
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 200px;
  height: 200px;
}
</style>
