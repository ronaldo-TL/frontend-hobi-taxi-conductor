<template>
  <q-page>
    <div id="map" class="map-container"></div>
  </q-page>
</template>

<script>
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS } from 'src/config.js'

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
    this.cargarGoogleMapsScript()
      .then(() => {
        this.initMap()
      })
      .catch((error) => {
        console.error('Error al cargar Google Maps:', error)
      })
  },
  methods: {
    cargarGoogleMapsScript () {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve()
          return
        }

        const scriptExistente = document.getElementById('google-maps-script')
        if (scriptExistente) {
          scriptExistente.onload = resolve
          scriptExistente.onerror = reject
          return
        }

        const script = document.createElement('script')
        script.id = 'google-maps-script'
        script.src = `${GOOGLE_MAPS}/api/js?key=${GOOGLE_MAPS_API_KEY}`
        script.async = true
        script.defer = true
        script.setAttribute('loading', 'async')
        script.onload = resolve
        script.onerror = reject

        document.head.appendChild(script)
      })
    },
    initMap () {
      const mapOptions = {
        center: { lat: -16.5035401, lng: -68.1319137 },
        zoom: 16
      }

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions)
    }
  }
}
</script>

<style scoped>
.map-container {
  margin: 10px;
  padding: 20px;
  width: 400px;
  height: 400px;
}
</style>
