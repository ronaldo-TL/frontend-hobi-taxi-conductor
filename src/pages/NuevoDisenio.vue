<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-xs-12 col-md-10 col-lg-10">
        <q-stepper
          style="width: 100%;"
          v-model="step"
          vertical
          color="primary"
          animated
          header-nav
        >
          <q-step
            :name="1"
            title="1. Escoge una imagen"
            icon="looks_one"
            :done="step > 1"
            class="text-bold"
            :header-nav="step > 1"
          >
            <div>
              <div class="row justify-center">
                <div class="col-xs-12">
                  <q-btn  v-if="!model.imagen" color="secondary" icon="photo" label="Subir o tomar imagen" @click="actualiarFoto" class="q-mr-sm" />
                  <!-- <q-btn color="secondary" icon="camera" label="Tomar foto" class="q-mt-sm"/> -->
                  <q-file
                    style="display:none"
                    ref="foto"
                    filled
                    v-model="model.imagen"
                    label="Fotografia"
                    class="col-xs-12"
                    counter
                    @update:model-value="previewImage"
                  />
                </div>
                <div class="col-xs-12" v-if="imagenUrl">
                  <q-img
                      class="foto"
                      :src="imagenUrl"
                      spinner-color="primary"
                      spinner-size="82px"
                      style="max-width: 100%;width:250px;height: auto;"
                  />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn @click="pasoSiguiente" color="primary" label="Continuar" class="q-mr-xs" />
              <q-btn v-if="model.imagen" color="secondary" icon="photo" label="Subir o tomar imagen" @click="actualiarFoto" class="q-mr-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="2. Escoge un tamaño"
            icon="fit_screen"
            :done="step > 2"
            class="text-bold"
            :header-nav="step > 2"
          >
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-4" v-for="(tamanio, index) in tamanios" :key="index">
                <q-item tag="label" v-ripple class="q-px-none">
                  <q-item-section avatar>
                    <q-radio v-model="model.size" :val="tamanio.value" color="primary"  @update:model-value="actualizarOpciones"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ tamanio.nombre }}</q-item-label>
                    <q-item-label caption>{{ tamanio.ancho }} X {{ tamanio.alto }} px</q-item-label>
                    <div class="image-container-preview" :class="{'tall':tamanio.alto===1920}">
                        <img :src="imagenUrl" alt="Imagen de fondo">
                    </div>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn @click="pasoSiguiente" color="primary" label="Continuar" />
              <q-btn flat @click="step = 1" color="primary" label="Átras" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="3"
            title="3. Elige linea grafica"
            icon="assignment"
            :done="step > 3"
            class="text-bold"
            :header-nav="step > 3"
          >
            <div class="row q-col-gutter-xs">
              <div class="col-xs-6 col-sm-4 col-md-3" v-for="(opcion, index) in opciones" :key="index">
                <q-item tag="label" v-ripple class="q-px-none">
                  <q-item-section avatar top>
                    <q-radio v-model="model.plantilla" :val="opcion.value" color="primary"/>
                  </q-item-section>
                  <q-item-section>
                    <div class="image-container-preview" :class="{'tall':model.size==='vertical'}">
                      <img :src="imagenUrl" alt="Imagen de fondo">
                      <img v-if="opcion.ruta!==''" :src="opcion.ruta" class="overlay-image">
                    </div>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn @click="pasoSiguiente" color="primary" label="Continuar" />
              <q-btn flat @click="step = 2" color="primary" label="Atras" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="4"
            title="4. Adiciona texto"
            icon="add_comment"
            class="text-bold"
            :header-nav="step > 4"
          >
          <div class="row">
            <div class="col-xs-12">
              <ImageEditor ref="editor" :valor="nuevaPlantilla" />
            </div>
          </div>

            <q-stepper-navigation>
              <!-- <q-btn v-if="model.size==='cuadrado'" color="blue-10" label="Facebook" @click="publicarFacebook" class="q-mr-xs" /> -->
              <q-btn color="positive" icon="download" label="descargar" @click="descargar" />
              <q-btn flat @click="step = 3" color="primary" label="ATRAS" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from 'quasar'
import ImageEditor from 'src/components/ImageEditor.vue'
import { constants } from 'src/constants/app'
import { ref } from 'vue'

export default {
  components: { ImageEditor },
  setup () {
    const $q = useQuasar()
    const step = ref(1)
    const imagenUrl = ref(null)
    const tamanios = structuredClone(constants.TAMANIOS_DISPONIBLES)
    const foto = ref(null)
    const model = ref({
      imagen: null,
      size: null
    })
    const opciones = ref([])
    const nuevaPlantilla = ref({})
    const editor = ref(null)
    const load = ref(false)

    const actualizarOpciones = (value) => {
      if (value) {
        opciones.value = tamanios[value].imagenes
      }
    }

    const actualiarFoto = () => {
      foto.value.pickFiles()
    }

    const previewImage = async () => {
      try {
        imagenUrl.value = null
        if (model.value.imagen) {
          imagenUrl.value = URL.createObjectURL(model.value.imagen)
        }
      } catch (error) {
        imagenUrl.value = null
        console.log('------------------------------------')
        console.log(error)
        console.log('------------------------------------')
      }
    }

    const pasoSiguiente = () => {
      if (step.value === 1) {
        if (!model.value.imagen) {
          $q.notify({
            type: 'negative',
            position: 'top',
            message: 'Debes subir o tomar una imagen'
          })
          return
        }
      }
      if (step.value === 2) {
        if (!model.value.size) {
          $q.notify({
            type: 'negative',
            position: 'top',
            message: 'Debes seleccionar un tamaño'
          })
          return
        }
        if (!model.value.plantilla || model.value.plantilla === null) {
          model.value.plantilla = 0
        }
      }
      if (step.value === 3) {
        nuevaPlantilla.value = {
          imagen: imagenUrl.value,
          tamanio: tamanios[model.value.size],
          plantilla: tamanios[model.value.size].imagenes.find(e => e.value === model.value.plantilla)

        }
      }
      step.value++
    }

    const descargar = () => {
      if (editor.value) {
        editor.value.downloadImage()
      }
    }

    const publicarFacebook = async () => {
      // const respuesta = await _http.post('system/us')
      console.log('------------------------------------')
      console.log(editor.value.downloadImage(false))
      console.log('------------------------------------')
    }

    return {
      step,
      tamanios,
      foto,
      actualiarFoto,
      imagenUrl,
      model,
      opciones,
      actualizarOpciones,
      previewImage,
      pasoSiguiente,
      nuevaPlantilla,
      editor,
      descargar,
      load,
      publicarFacebook
    }
  }
}
</script>
<style>
.image-container {
  position: relative;
  width: 100%;  /* Ajusta el tamaño del contenedor */
  height: auto; /* Ajusta el tamaño del contenedor */
}

.image-container-preview{
  position: relative;
  width: 100%; /* El contenedor se ajusta al ancho del contenedor padre */
  max-width: 1200px; /* Limita el ancho máximo si es necesario */
  aspect-ratio: 1 / 1; /* Proporción de 1200x1200 o ajusta según tu necesidad */
  overflow: hidden; /* Oculta lo que se desborda */
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container-preview.tall {
    aspect-ratio: 9 / 16; /* Proporción de 1080x1920 */
}

.image-container-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* La imagen se ajusta cubriendo todo el contenedor */
    object-position: center; /* Centra la imagen dentro del contenedor */
}

.overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: auto;
  height: auto;
}
</style>
