<template>
  <q-form
    ref="parametro"
    class="row q-col-gutter-sm"
    @submit="guardar"
  >
    <div class="col-xs-4 text-center">
      <q-avatar size="140px">
        <q-img
            :src="fotoUrl"
            spinner-color="primary"
            spinner-size="82px"
        />
        <q-btn
            class="btn-foto"
            color="primary"
            icon="photo_camera"
            round
            size="sm"
            @click="actualiarFoto"
        />
      </q-avatar>
    </div>
    <div class="col-xs-8">
      <div class="row q-col-gutter-md" v-if="!valoresModel.id">
        <q-input
          v-model="valoresModel.numeroDocumento"
          type="text"
          label="Numero documento"
          class="required col-xs-6"
          filled
          :rules="valoresRules.requerido"
          :readonly="!!valoresModel.id"
        />
        <q-input
          v-model="valoresModel.nombres"
          type="text"
          label="Nombres"
          class="required col-xs-6"
          filled
          :rules="valoresRules.requerido"
          :readonly="!!valoresModel.id"
        />
        <q-input
            v-model="valoresModel.primerApellido"
            type="text"
            label="Primer Apellido"
            class="col-xs-6"
            filled
            :rules="[]"
            :readonly="!!valoresModel.id"
        />
        <q-input
            v-model="valoresModel.segundoApellido"
            type="text"
            label="Segundo Apellido"
            class="col-xs-6"
            filled
            :rules="[]"
            :readonly="!!valoresModel.id"
        />
      </div>

      <div class="row q-col-gutter-md" v-else>
        <q-input
          :model-value="valoresModel.usuario?.numeroDocumento"
          type="text"
          label="Numero documento"
          class="required col-xs-6"
          filled
          :rules="valoresRules.requerido"
          readonly
        />
        <q-input
          :model-value="valoresModel.usuario?.nombres"
          type="text"
          label="Nombres"
          class="required col-xs-6"
          filled
          :rules="valoresModel.usuario?.requerido"
          readonly
        />
        <q-input
            :model-value="valoresModel.usuario?.primerApellido"
            type="text"
            label="Primer Apellido"
            class="col-xs-6"
            filled
            :rules="[]"
            readonly
        />
        <q-input
            :model-value="valoresModel.usuario?.segundoApellido"
            type="text"
            label="Segundo Apellido"
            class="col-xs-6"
            filled
            :rules="[]"
            readonly
        />
      </div>
    </div>
    <div class="col-xs-12 text-subtitle2 text-accent text-bold">
      Datos de contacto
    </div>
    <q-input
        v-model="valoresModel.celular"
        type="text"
        label="Celular"
        class="required col-xs-6"
        filled
        :rules="valoresRules.requerido"
    />
    <q-input
        v-model="valoresModel.correoElectronico"
        type="text"
        label="Correo"
        class="required col-xs-6"
        filled
        :rules="valoresRules.requerido"
    />
    <q-input
        v-model="valoresModel.direccionResidencial"
        type="text"
        label="Direccion Residencia"
        class="col-xs-12 required"
        filled
        :rules="valoresRules.requerido"
    />
    <div class="col-xs-12 text-subtitle2 text-accent text-bold">
      Datos de la moto
    </div>
    <q-select
        class="required col-xs-4"
        filled
        :options="marcas"
        v-model="valoresModel.marca"
        label="Marca"
        :rules="valoresRules.requerido"
        map-options
        option-label="nombre"
        option-value="nombre"
        emit-value
    />
    <q-input
        v-model="valoresModel.modelo"
        type="text"
        label="Modelo"
        class="required col-xs-4"
        filled
        :rules="valoresRules.requerido"
    />
    <q-input
        v-model="valoresModel.placa"
        type="text"
        label="Placa"
        class="required col-xs-4"
        filled
        :rules="valoresRules.requerido"
    />
    <q-file
      style="display:none"
      ref="foto"
      filled
      v-model="valoresModel.fotoUrl"
      accept="image/*"
      label="Fotografia"
      class="col-xs-12"
      counter
      @update:model-value="previewImage"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <q-file
      ref="licencia"
      filled
      v-model="valoresModel.licenciaUrl"
      accept="image/*"
      label="Imagen licencia de conducir"
      class="col-xs-12"
      counter
      @update:model-value="previewLicencia"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <div class="col-xs-12 text-center" v-if="licenciaUrl">
      <q-img
          :src="licenciaUrl"
          spinner-color="primary"
          spinner-size="82px"
          width="350px"
      />
    </div>
    <div class="col-xs-12 q-mt-md text-right">
      <q-btn
        flat
        rounded
        color="negative"
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        @click="$emit('cancelar')"
      />
      <q-btn
        rounded
        class="q-ml-sm"
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { onMounted, ref, inject } from 'vue'
import validaciones from '../../common/validations'
// import { constants } from 'src/constants/app'

const valoresRules = {
  requerido: [
    validaciones.requerido
  ]
}

const defaultFoto = `${process.env.BACKEND_URL}/conductores/foto_default.jpg`
// const marcas = constants.MARCAS

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const _http = inject('http')
    const _message = inject('message')
    const valoresModel = useVModel(props, 'valores')
    const backendUrl = process.env.BACKEND_URL
    const url = ref('jobi/conductores')
    const foto = ref(null)
    const fotoUrl = ref(defaultFoto)
    const licenciaUrl = ref(null)
    const marcas = ref([])

    onMounted(async () => {
      if (props.valores.rutaImagenFoto) {
        fotoUrl.value = `${backendUrl}/${props.valores.rutaImagenFoto}`
      }
      if (props.valores.rutaImagenLicencia) {
        licenciaUrl.value = `${backendUrl}/${props.valores.rutaImagenLicencia}`
      }
      await getMarcas()
    })

    const actualiarFoto = () => {
      foto.value.pickFiles()
    }

    const getMarcas = async () => {
      const { rows } = await _http.get('system/parametros?grupo=MARCA&limit=100')
      marcas.value = rows
    }

    const guardar = async () => {
      let respuesta = null
      const formData = new FormData()
      if (valoresModel.value.fotoUrl) {
        formData.append('fotoUrl', valoresModel.value.fotoUrl)
      }
      if (valoresModel.value.licenciaUrl) {
        formData.append('licenciaUrl', valoresModel.value.licenciaUrl)
      }
      for (const [key, value] of Object.entries(valoresModel.value)) {
        if (!['fotoUrl', 'licenciaUrl'].includes(key)) {
          formData.append(key, value)
        }
      }
      respuesta = await _http.post(url.value, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (respuesta) {
        emit('actualizar')
      }
    }

    const previewImage = async () => {
      const originalUrl = fotoUrl.value
      let respuesta = false
      try {
        fotoUrl.value = null
        if (valoresModel.value.id) {
          const formData = new FormData()
          if (!valoresModel.value.fotoUrl) {
            fotoUrl.value = originalUrl
            throw new Error('Error en actualizar la foto')
          }
          formData.append('fotoUrl', valoresModel.value.fotoUrl)
          formData.append('_method', 'PATCH')
          respuesta = await _http.post(`${url.value}/${valoresModel.value.id}/foto`, formData,
            { headers: { 'Content-Type': 'multipart/form-data' } })
        }
        if (valoresModel.value.fotoUrl) {
          fotoUrl.value = URL.createObjectURL(valoresModel.value.fotoUrl)
          if (respuesta) {
            _message.success('Fotografia actualizada correctamente')
          }
        }
      } catch (error) {
        fotoUrl.value = originalUrl
        _message.error(error.message)
      }
    }

    const previewLicencia = async () => {
      let respuesta = false
      try {
        licenciaUrl.value = null
        if (valoresModel.value.id) {
          const formData = new FormData()
          if (!valoresModel.value.licenciaUrl) {
            throw new Error('Error en actualizar la licencia')
          }
          formData.append('licenciaUrl', valoresModel.value.licenciaUrl)
          formData.append('_method', 'PATCH')
          respuesta = await _http.post(`${url.value}/${valoresModel.value.id}/licencia`, formData,
            { headers: { 'Content-Type': 'multipart/form-data' } })
        }
        if (valoresModel.value.licenciaUrl) {
          licenciaUrl.value = URL.createObjectURL(valoresModel.value.licenciaUrl)
          if (respuesta) {
            _message.success('Licencia actualizada correctamente')
          }
        }
      } catch (error) {
        _message.error(error.message)
      }
    }

    return {
      foto,
      fotoUrl,
      licenciaUrl,
      marcas,
      valoresModel,
      valoresRules,
      actualiarFoto,
      previewImage,
      previewLicencia,
      guardar
    }
  }
}
</script>
<style scoped>
.btn-foto{
    position: absolute;
    right: 0;
    bottom: 5px;
}
</style>
