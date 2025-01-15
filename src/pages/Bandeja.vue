<template>
  <q-page>
    <Titulo
      titulo="Bandeja"
      icono="bandeja"
    ></Titulo>
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-xs-12">
        <q-card style="height:100%">
          <q-card-section>
            <div class="text-weight-bold text-h6">
              Bienvenido!! <br>
              Hola de nuevo {{ usuario?.correoElectronico }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn
              icon="add"
              color="primary"
              @click="solicitudModal = true"
              label="Solicitudes"
              rounded
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 text-subtitle1 text-bold">
        <b>Ingresos del dia</b>
      </div>
      <div class="col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-lg-6 col-md-6 col-sm-4 col-xs-12" v-for="(ingreso,index) in ingresos" :key="index">
              <q-card style="height:100%">
                  <q-card-section class="text-center items-center">
                  <div class="text-weight-bold text-h4 changing-number" :class="`text-${ingreso.color}`">
                      <NumberAnimation
                        :to="ingreso.cantidad"
                        :duration="duracion(ingreso.cantidad)"
                        :format="formatoConteo"
                        easing="linear"
                        autoplay
                      />
                      <span>{{ ingreso.moneda }}</span>
                  </div>
                  <div class="text-weight-bold text-subtitle2" :class="`text-${ingreso.color}`">{{ingreso.titulo}}</div>
                  </q-card-section>
              </q-card>
            </div>
        </div>
      </div>
      <div class="col-xs-12 text-subtitle1 text-bold">
        <b>Ultimas carreras</b>
      </div>
    </div>
    <q-dialog v-model="solicitudModal" persistent>
      <q-card>
        <q-card-section>
          <Solicitud></Solicitud>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cerrar"
            color="negative"
            @click="solicitudModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { computed, ref } from 'vue'
import { useGlobalStore } from 'src/stores/app'
import NumberAnimation from 'vue-number-animation'
import Solicitud from '../components/Solicitudes/ConductorSolicitud.vue'

export default {
  name: 'Bandeja',
  components: {
    NumberAnimation,
    Solicitud
  },
  setup () {
    const store = useGlobalStore()
    const solicitudModal = ref(false)
    const usuario = computed(() => store.usuario)
    const ingresos = ref([
      {
        titulo: 'INGRESOS',
        cantidad: 100,
        moneda: ' Bs.',
        color: 'secondary',
        valor: 'total'
      }
    ])
    const formatoConteo = (value) => {
      return `${value.toFixed(0)}`
    }

    const duracion = (value) => {
      let tiempo = 0.2
      let base = 10
      if (value > 9) {
        while (base < value) {
          base *= 10
          tiempo++
        }
      }
      return tiempo
    }

    return {
      usuario,
      ingresos,
      duracion,
      formatoConteo,
      solicitudModal
    }
  }
}
</script>
