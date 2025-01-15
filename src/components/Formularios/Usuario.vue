<template>
  <q-form
    ref="usuario"
    @submit="$emit('guardar')"
    class="row q-col-gutter-md"
  >
    <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
      Datos personales
    </div>
    <q-select
      filled
      class="col-xs-12 col-sm-4 col-md-4 required"
      label="Tipo Documento"
      v-model="valoresModel.tipoDocumento"
      :options="tiposDocumentos"
      :rules="valoresRules.numeroDocumento"
      emit-value
      map-options
    ></q-select>
    <q-input
      filled
      class="col-xs-6 col-sm-4 col-md-4 required"
      label="Cedula de identidad"
      v-model="valoresModel.numeroDocumento"
      :rules="valoresRules.numeroDocumento"
    ></q-input>
    <q-input
      filled
      class="col-xs-6 col-sm-4 col-md-4"
      label="Fecha Nacimiento"
      type="date"
      stack-label
      v-model="valoresModel.fechaNacimiento"
    ></q-input>
    <q-input
      filled
      label="Nombres"
      class="col-xs-12 col-sm-4 col-md-4 required"
      v-model="valoresModel.nombres"
      :rules="valoresRules.numeroDocumento"
    ></q-input>
    <q-input
      filled
      label="Primer apellido"
      class="col-xs-12 col-sm-4 col-md-4"
      v-model="valoresModel.primerApellido"
    ></q-input>
    <q-input
      class="col-xs-12 col-sm-4 col-md-4"
      filled
      label="Segundo apellido"
      v-model="valoresModel.segundoApellido"
    ></q-input>
    <q-input
      filled
      class="col-xs-6 col-sm-4 col-md-4 required"
      label="Celular"
      v-model="valoresModel.celular"
      :rules="valoresRules.celular"
    ></q-input>
    <q-input
      filled
      class="col-xs-6 col-sm-6 col-md-6 required"
      label="Correo electronico"
      v-model="valoresModel.correoElectronico"
      :rules="valoresRules.correoElectronico"
    ></q-input>
    <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
      Datos de usuario
    </div>
    <q-input
      filled
      label="Nombre Usuario"
      v-model="valoresModel.usuario"
      class="col-xs-12 col-md-4 required"
      :rules="valoresRules.usuario"
    ></q-input>
    <q-input
      filled
      v-if="!valoresModel.id"
      label="Contraseña"
      class="col-xs-12 col-md-4 required"
      v-model="valoresModel.contrasena"
      :rules="valoresRules.contrasena"
    ></q-input>
    <q-input
      filled
      v-if="!valoresModel.id"
      class="col-xs-12 col-md-4 required"
      label="Confirmacion de contraseña"
      v-model="valoresModel.confirmarContrasena"
      :rules="valoresRules.contrasena"
    ></q-input>
    <q-select
      v-model="valoresModel.rolId"
      filled
      class="col-xs-12 col-md-4 required"
      :options="roles"
      label="Rol"
      option-value="id"
      option-label="nombre"
      use-chips
      emit-value
      map-options
      :rules="valoresRules.id_rol"
    />
    <div class="col-xs-12 text-right q-gutter-sm q-mt-md">
      <q-btn
        icon="close"
        label="Cancelar"
        @click="$emit('cancelar')"
        rounded
        flat
        color="negative"
      />
      <q-btn
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
        rounded
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { ref, onMounted, inject } from 'vue'
import validaciones from '../../common/validations'

const valoresRules = {
  numeroDocumento: [
    validaciones.requerido
  ],
  nombre: [
    validaciones.requerido
  ],
  descripcion: [
    validaciones.requerido
  ],
  celular: [
    validaciones.requerido
  ]
}

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')
    const roles = ref([])
    const tiposDocumentos = [
      { label: 'CEDULA DE IDENTIDAD', value: 'CI' },
      { label: 'CEDULA DE IDENTIDAD DE EXTRANJERO', value: 'CE' }
    ]

    onMounted(async () => {
      roles.value = await getRoles()
      valoresModel.value.roles = props.valores.roles.map(x => x.id)
    })

    async function getRoles () {
      const { rows } = await _http.get('system/roles')
      return rows
    }

    return {
      valoresModel,
      valoresRules,
      roles,
      tiposDocumentos
    }
  }
}
</script>
