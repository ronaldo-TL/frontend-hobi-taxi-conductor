<template>
  <q-page>
    <Titulo
      titulo="Conductores"
      icono="person"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="primary"
          @click="openModal(open)"
          label="Nuevo conductor"
          rounded
        />
      </template>
      <template v-slot:form="{ update,close}">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="form-dialog">
            <q-icon name="sports_motorsports" size="sm"/>
            <div class="text-subtitle1 text-bold q-pl-sm">
              {{ conductor.id ? 'Editar' : 'Agregar' }} conductor
            </div>
            <q-space />
            <q-btn
              flat
              round
              icon="close"
              @click="closeModal(close)"
            />
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <Conductor
              v-model:valores="conductor"
              @actualizar="actualizar(update, close)"
              @cancelar="closeModal(close)"/>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, update }">
        <q-tr class="text-center">
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            >
              <q-tooltip>Editar usuario</q-tooltip>
            </q-btn>
          </q-td>
          <q-td  class="text-center">
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado(row,update)"
            />
          </q-td>
          <q-td class="text-left">
            <div class="row items-center">
              <div class="col-xs-3">
                <q-avatar size="60px">
                  <q-img
                    :src="`${backendUrl}/${row.rutaImagenFoto}`"
                    spinner-color="primary"
                    spinner-size="65px"
                  />
                </q-avatar>
              </div>
              <div class="col-xs-9">
                <div class="text-bold text-subtitle2">{{ getNombreCompleto(row.usuario) }}</div>
                <div>{{ row.usuario?.numeroDocumento }}</div>
              </div>
            </div>
          </q-td>
          <q-td class="text-left">{{ row.celular }}</q-td>
          <q-td class="text-left">{{ row.direccionResidencial }}</q-td>
          <q-td class="text-left">
            <div>{{ row.marca }} - {{ row.modelo }}</div>
            <div class="text-grey text-bold">{{ row.placa }}</div>
          </q-td>
          <q-td class="text-center">
            <Estado :estado="row.estado" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject } from 'vue'
import CrudTable from 'components/common/CrudTable.vue'
import Conductor from 'components/Formularios/Conductor.vue'
import { useQuasar } from 'quasar'
import { constants } from 'src/constants/app'

const filters = [
  {
    label: 'Numero documento',
    field: 'numeroDocumento',
    type: 'input'
  },
  {
    label: 'Nombres',
    field: 'nombres',
    type: 'input'
  },
  {
    label: 'Primer Apellido',
    field: 'primerApellido',
    type: 'input'
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: [
      {
        label: 'ACTIVO',
        value: 'ACTIVO'
      },
      {
        label: 'INACTIVO',
        value: 'INACTIVO'
      }
    ]
  }
]

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'activo',
    label: 'Activo',
    sortable: false
  },
  {
    name: 'nombrePersona',
    label: 'Nombre Completo',
    sortable: false
  },
  {
    name: 'celular',
    label: 'Celular',
    sortable: false
  },
  {
    name: 'direccion',
    label: 'Residencia',
    sortable: false
  },
  {
    name: 'moto',
    label: 'Moto',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Conductor },
  name: 'Conductores',
  setup () {
    const $q = useQuasar()
    const _http = inject('http')
    const url = ref('jobi/conductores')
    const backendUrl = process.env.BACKEND_URL
    const ROL_CONDUCTOR = constants.ROLES.ROL_CONDUCTOR
    const _message = inject('message')
    const conductor = ref({
      rolId: constants.ROLES.ROL_CONDUCTOR,
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      conductor.value = {
        rolId: constants.ROLES.ROL_CONDUCTOR,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        conductor.value = await _http.get(`${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const actualizar = async (update, close) => {
      closeModal(close)
      await update()
    }

    const guardar = async (update, close) => {
      if (conductor.value.id) {
        await _http.put(`${url.value}/${conductor.value.id}`, conductor.value)
      } else {
        await _http.post(`${url.value}`, conductor.value)
      }
      await update()
      closeModal(close)
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`
    }

    const cambiarEstado = async (registro, update) => {
      const estadoOriginal = registro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
      const configuracion = structuredClone(constants.PROP_DIALOG)
      configuracion.message = `¿Esta seguro de que quiere ${estadoOriginal === 'ACTIVO' ? 'inactivar' : 'activar'} el registro del conductor ${registro.usuario?.nombres}?`
      $q.dialog(configuracion).onOk(async () => {
        await _http.patch(`${url.value}/${registro.id}/estado`, { estado: registro.estado })
        _message.success(`Se ${registro.estado === 'ACTIVO' ? 'activo' : 'inactivo'} el registro de usuario de manera exitosa.`)
        await update()
      }).onCancel(() => {
        registro.estado = estadoOriginal
      })
    }

    return {
      conductor,
      filters,
      columns,
      url,
      ROL_CONDUCTOR,
      backendUrl,
      closeModal,
      openModal,
      getNombreCompleto,
      cambiarEstado,
      actualizar,
      guardar
    }
  }
}
</script>
