<template>
  <q-page>
    <Titulo
      titulo="Dashboard"
      icono="dashboard"
    ></Titulo>
    <div class="row q-col-gutter-lg justify-center">
      <div class="col-xs-12 text-subtitle1 text-bold text-grey-7">
        Conductores
      </div>
      <div class="col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6" v-for="(conductor,index) in conductores" :key="index">
              <q-card style="height:100%">
                  <q-card-section class="text-center items-center">
                  <div class="text-weight-bold text-h4 changing-number" :class="`text-${conductor.color}`">
                      <NumberAnimation
                        :to="conductor.cantidad"
                        :duration="duracion(conductor.cantidad)"
                        :format="formatoConteo"
                        easing="linear"
                        autoplay
                      />
                  </div>
                  <div class="text-weight-bold text-subtitle2" :class="`text-${conductor.color}`">{{conductor.titulo}}</div>
                  </q-card-section>
              </q-card>
            </div>
        </div>
      </div>
      <div class="col-xs-12 text-subtitle1 text-bold text-grey-7 q-mt-md">
        Carreras
        <div class="text-body2 text-accent text-bold">
          hoy
          <q-menu auto-close class="dialog">
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>dia</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>semana</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>mes</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>año</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="row q-col-gutter-md">
          <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6" v-for="(carrera,index) in carreras" :key="index">
              <q-card style="height:100%">
                  <q-card-section class="text-center items-center">
                  <div class="text-weight-bold text-h4 changing-number" :class="`text-${carrera.color}`">
                      <NumberAnimation
                        :to="carrera.cantidad"
                        :duration="duracion(carrera.cantidad)"
                        :format="formatoConteo"
                        easing="linear"
                        autoplay
                      />
                  </div>
                  <div class="text-weight-bold text-subtitle2" :class="`text-${carrera.color}`">{{carrera.titulo}}</div>
                  </q-card-section>
              </q-card>
            </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { computed, ref } from 'vue'
import { useGlobalStore } from 'src/stores/app'
import NumberAnimation from 'vue-number-animation'

export default {
  name: 'Dashboard',
  components: {
    NumberAnimation
  },
  setup () {
    const store = useGlobalStore()
    const rol = computed(() => store.usuario.rol)
    const parametros = computed(() => store.parametros)
    const conductores = ref([
      {
        titulo: 'TOTAL',
        cantidad: 50,
        color: 'secondary',
        valor: 'total'
      },
      {
        titulo: 'ACTIVOS',
        cantidad: 30,
        color: 'info',
        valor: 'activo'
      },
      {
        titulo: 'INACTIVOS',
        cantidad: 20,
        color: 'negative',
        valor: 'inactivo'
      },
      {
        titulo: 'EN LINEA',
        cantidad: 2,
        color: 'accent',
        valor: 'en_linea'
      }
    ])
    const carreras = ref([
      {
        titulo: 'TOTAL',
        cantidad: 5,
        color: 'secondary',
        valor: 'total'
      },
      {
        titulo: 'COMPLETADAS',
        cantidad: 1,
        color: 'positive',
        valor: 'activo'
      },
      {
        titulo: 'ACEPTADAS',
        cantidad: 2,
        color: 'blue-9',
        valor: 'inactivo'
      },
      {
        titulo: 'RECHAZADAS',
        cantidad: 2,
        color: 'negative',
        valor: 'en_linea'
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
      rol,
      parametros,
      conductores,
      carreras,
      duracion,
      formatoConteo
    }
  }
}
</script>
