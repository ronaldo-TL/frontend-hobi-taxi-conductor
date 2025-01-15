<template>
    <q-dialog v-model="dialog" persistent>
        <q-card style="width: 900px; max-width: 90vw;">
            <q-toolbar class="form-dialog">
                <q-icon name="description" size="sm"/>
                <div class="text-subtitle1 text-bold q-pl-sm">
                  Documento
                </div>
                <q-space />
                <q-btn flat round dense icon="close" color="negative"  @click="$emit('cerrar')" />
            </q-toolbar>
            <q-card-section>
                <div class="row">
                    <div class="col-xs-12" v-if="editar">
                        <q-file
                            :style="model?'display:none':''"
                            ref="fileRef"
                            filled
                            v-model="file"
                            label="Documento"
                            class="col-xs-12"
                            counter
                            @update:model-value="updateDocumento"
                            accept="application/pdf"
                            >
                            <template v-slot:prepend>
                                <q-icon name="attach_file" />
                            </template>
                        </q-file>
                    </div>
                    <div class="col-xs-12" v-if="model">
                        <iframe :src="model" style="width: 100%; height:60vh;"></iframe>
                        <q-btn
                            v-if="editar"
                            class="btn-update-file"
                            color="orange"
                            icon="upload_file"
                            round
                            size="lg"
                            @click="actualiarFoto"
                        >
                          <q-tooltip>Presiona para modificar el documento</q-tooltip>
                        </q-btn>

                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="cerrar" rounded color="negative" @click="$emit('cerrar')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
import { inject, onMounted, ref } from 'vue'
export default {
  props: {
    url: {
      type: String,
      default: null
    },
    urlPut: {
      type: String,
      default: null
    },
    editar: {
      type: Boolean,
      default: true
    },
    privado: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cerrar'],
  setup (props, { emit }) {
    const _http = inject('http')
    const _message = inject('message')
    const dialog = ref(true)
    const fileRef = ref(null)
    const model = ref(null)
    const file = ref(null)

    onMounted(() => {
      if (!props.privado && props.url) {
        model.value = `${process.env.BACKEND_URL}/${props.url}`
      }
    })

    const updateDocumento = async () => {
      if (props.editar) {
        const originalFile = model.value
        try {
          model.value = URL.createObjectURL(file.value)
          const formData = new FormData()
          formData.append('documento', file.value)
          formData.append('_method', 'patch')
          const respuesta = await _http.post(props.urlPut, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          if (respuesta) {
            emit('actualizado')
            _message.success('Documento actualizado correctamente')
          }
        } catch (e) {
          model.value = originalFile
          file.value = null
        }
      }
    }

    const actualiarFoto = () => {
      fileRef.value.pickFiles()
    }

    return {
      dialog,
      model,
      file,
      updateDocumento,
      fileRef,
      actualiarFoto
    }
  }
}
</script>
<style scoped>
.btn-update-file{
    position: absolute;
    right: 40px;
    bottom: 40px;
}
</style>
