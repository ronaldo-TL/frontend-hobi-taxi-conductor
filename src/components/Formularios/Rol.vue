<template>
  <q-stepper
    header-class="text-center"
    v-model="step"
    ref="stepper"
    color="info"
    animated
    flat
    class="no-padding"
    done-color="positive"
    inactive-color="grey"
  >
    <q-step
      :name="1"
      title="Datos Generales"
      caption="Informacion del Rol."
      icon="settings"
      :done="step > 1"
    >
      <q-form
        ref="formRol"
        class="row q-col-gutter-md"
        v-if="!loading"
      >
        <q-input
          filled
          class="col-xs-12 col-md-6"
          label="Nombre"
          v-model="valoresModel.nombre"
          :rules="valoresRules.nombre"
        >
        </q-input>
        <q-input
          filled
          class="col-xs-12 col-md-6"
          label="Descripcion"
          v-model="valoresModel.descripcion"
          :rules="valoresRules.descripcion"
        ></q-input>
        <!-- <q-select
          filled
          v-model="valoresModel.idEntidad"
          :options="entidades"
          option-value="id"
          option-label="nombre"
          label="Entidad"
          map-options
          emit-value
          class="col-xs-12"
          :rules="valoresRules.idEntidad"
        /> -->
        <q-select
          filled
          multiple
          use-chips
          v-model="valoresModel.menus"
          :options="menus"
          option-value="id"
          option-label="nombre"
          label="Menus"
          map-options
          emit-value
          class="col-xs-12"
          :rules="valoresRules.menus"
        />
      </q-form>
      <div class="row"  v-else>
        <div class="col-xs-12 text-center">
          <q-circular-progress
            indeterminate
            rounded
            size="50px"
            class="q-ma-md"
          />
        </div>
      </div>
    </q-step>
    <q-step
      :name="2"
      title="Permisos"
      caption="Permisos del sistema"
      icon="create_new_folder"
      :done="step > 2"
    >
      <div class="row q-col-gutter-md">

        <q-input
          label="Buscar permiso"
          filled
          class="col-xs-12"
          v-model="filtro"
          @update:model-value="filtrarPermisos"
        >
          <template v-slot:before>
            <q-icon
              name="search"
              color="primary"
            />
          </template>
          <template v-slot:after>
            <q-btn
              flat
              round
              size="xl"
              icon="toggle_off"
              color="negative"
              @click="cambiarTodos(false)"
            >
              <q-tooltip class="bg-negative text-body2">
                Desmarcar todos
              </q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              size="xl"
              icon="toggle_on"
              color="positive"
              @click="cambiarTodos(true)"
            >
              <q-tooltip class="bg-positive text-body2">
                Marcar todos
              </q-tooltip>
            </q-btn>
            <div class="text-caption">Seleccionados:
              <div class="text-body2 text-bold">{{valoresModel?.permisos?.length}}</div>
            </div>
          </template>
        </q-input>
        <div
          class="col-xs-12"
          v-if="permisos.length > 0"
        >
          <div class="row">
            <div
              class="col-xs-12 col-sm-6 col-md-4"
              v-for="(permiso, index) of permisos"
              :key="index"
            >
              <q-toggle
                v-model="permiso.permitido"
                checked-icon="check"
                color="positive"
                unchecked-icon="clear"
                :label="permiso.nombre"
                size="sm"
                @update:model-value="actualizarPermiso(permiso)"
              />
            </div>
          </div>
        </div>
      </div>
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation
        align="right"
        class="row q-gutter-md"
      >
        <q-btn
          @click="$emit('cancelar')"
          label="Cancelar"
          icon="close"
          class="q-ml-sm"
          color="negative"
          rounded
          flat
        />
        <q-space />
        <q-btn
          v-if="step > 1"
          @click="anterior"
          label="anterior"
          icon="navigate_before"
          class="q-ml-sm"
          rounded
        />
        <q-btn
          @click="siguiente(props)"
          color="primary"
          :icon="step === 2 ? 'save' : 'navigate_next'"
          :label="step === 2 ? 'Guardar' : 'Siguiente'"
          rounded
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>
<script>
import { useVModel } from '../../composables/useVModel.js'
import { ref, onMounted, inject } from 'vue'
import validaciones from '../../common/validations'

const valoresRules = {
  nombre: [
    validaciones.requerido
  ],
  descripcion: [
    validaciones.requerido
  ]
  // ,
  // idEntidad: [
  //   validaciones.requerido
  // ]
}

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const _http = inject('http')

    const step = ref(1)
    const valoresModel = useVModel(props, 'valores')
    const formRol = ref(null)
    const menus = ref([])
    const filtro = ref(null)
    // const entidades = ref([])
    const permisos = ref([])
    const permisosTemp = ref([])
    const loading = ref(false)

    onMounted(async () => {
      // entidades.value = await getEntidades()
      loading.value = true
      menus.value = await getMenus()
      permisos.value = await getPermisos()
      loading.value = false
      valoresModel.value.permisos = (JSON.parse(JSON.stringify(permisos.value))).filter(e => e.permitido)
      permisosTemp.value = JSON.parse(JSON.stringify(permisos.value))
    })

    // async function getEntidades () {
    //   const { rows } = await _http.get('/system/entidades')
    //   return rows
    // }

    async function getMenus () {
      const { rows } = await _http.get('system/menus')
      return rows
    }
    async function getPermisos () {
      let url = 'system/permisos?tipo=SISTEMA'
      if (props.valores.id) {
        url = `system/roles/${props.valores.id}/permisos`
      }
      const rows = await _http.get(url)
      return rows.rows || rows
    }

    const anterior = () => {
      step.value--
    }

    const siguiente = async () => {
      if (step.value === 1) {
        const validacion = await formRol.value.validate()
        if (validacion) {
          step.value++
        }
      } else {
        const permisos = []
        for (const permiso of valoresModel.value.permisos) {
          if (permiso.permitido) {
            permisos.push(permiso.id)
          }
        }
        valoresModel.value.permisos = permisos
        await emit('guardar')
      }
    }

    function filtrarPermisos (val) {
      if (!val || val === '') {
        permisos.value = JSON.parse(JSON.stringify(permisosTemp.value))
        return
      }

      const needle = val.toLowerCase()
      permisos.value = permisosTemp.value.filter(v => v.nombre.toLowerCase().includes(needle))
    }

    function cambiarTodos (value) {
      const permisosAll = JSON.parse(JSON.stringify(permisosTemp.value))
      for (const permiso of permisosAll) {
        permiso.permitido = value
      }
      permisos.value = [...permisosAll]
      valoresModel.value.permisos = permisosAll.filter(e => e.permitido) || []
    }

    function actualizarPermiso (permiso) {
      const _existe = valoresModel.value.permisos.findIndex(e => e.id === permiso.id)
      if (_existe > -1) {
        valoresModel.value.permisos.splice(_existe, 1)
      } else {
        valoresModel.value.permisos.push(permiso)
      }
    }

    return {
      step,
      // entidades,
      menus,
      valoresModel,
      valoresRules,
      formRol,
      siguiente,
      permisos,
      anterior,
      filtro,
      filtrarPermisos,
      cambiarTodos,
      actualizarPermiso,
      loading
    }
  }
}
</script>
