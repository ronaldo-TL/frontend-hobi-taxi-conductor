<template>
  <q-page>
    <Titulo
      titulo="Usuarios"
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
          label="Nuevo usuario"
          rounded
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="form-dialog">
            <q-icon name="person" size="sm"/>
            <div class="text-subtitle1 text-bold q-pl-sm">
              {{ usuario.id ? 'Editar' : 'Agregar' }} usuario
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
            <Usuario
              v-model:valores="usuario"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Usuario>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, update }">
        <q-tr class="text-center">
          <q-td>
            <q-btn
              v-if="!row.sistema"
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            >
              <q-tooltip>Editar usuario</q-tooltip>
            </q-btn>
            <q-btn
              v-if="!row.sistema"
              class="q-pa-xs"
              flat
              round
              icon="lock_reset"
              color="orange-7"
              @click="restaurarContrasena(row)"
            >
              <q-tooltip>Restaurar la contraseña</q-tooltip>
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
            <div>{{ row.usuario }}</div>
            <div class="text-grey text-bold">{{ row.rol?.nombre }}</div>
          </q-td>
          <q-td class="text-left">{{ row.numeroDocumento }}</q-td>
          <q-td class="text-left">{{ row.nombres }} {{ row.primerApellido }} {{ row.segundoApellido }}</q-td>
          <q-td class="text-left">{{ row.celular }}</q-td>
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
import Usuario from 'components/Formularios/Usuario.vue'
import { useQuasar } from 'quasar'
import { constants } from 'src/constants/app'

const filters = [
  {
    label: 'Usuario',
    field: 'usuario',
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
    name: 'nombre',
    label: 'Nombre Usuario',
    sortable: false
  },
  {
    name: 'numeroDocumento',
    label: 'Numero Documento',
    sortable: false
  },
  {
    name: 'nombrePersona',
    label: 'Nombre Persona',
    sortable: false
  },
  {
    name: 'celular',
    label: 'Celular',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Usuario },
  name: 'UsuariosPage',
  setup () {
    const $q = useQuasar()
    const _http = inject('http')
    const url = ref('system/usuarios')
    const _message = inject('message')
    const usuario = ref({
      celular: null,
      correoElectronico: null,
      tipoDocumento: null,
      nombres: null,
      numeroDocumento: null,
      primerApellido: null,
      rolId: null,
      segundoApellido: null,
      usuario: null,
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      usuario.value = {
        celular: null,
        correoElectronico: null,
        tipoDocumento: null,
        nombres: null,
        numeroDocumento: null,
        primerApellido: null,
        rolId: null,
        segundoApellido: null,
        usuario: null,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        usuario.value = await _http.get(`${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (usuario.value.id) {
        await _http.put(`${url.value}/${usuario.value.id}`, usuario.value)
      } else {
        await _http.post(`${url.value}`, usuario.value)
      }
      await update()
      closeModal(close)
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    const cambiarEstado = async (registro, update) => {
      const estadoOriginal = registro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
      const configuracion = constants.PROP_DIALOG
      configuracion.message = `¿Esta seguro de que quiere ${registro.estado === 'ACTIVO' ? 'inactivar' : 'activar'} el registro de usuario ${registro.usuario}?`
      $q.dialog(configuracion).onOk(async () => {
        await _http.patch(`system/usuarios/${registro.id}/estado`, { estado: registro.estado })
        _message.success(`Se ${registro.estado === 'ACTIVO' ? 'activo' : 'inactivo'} el registro de usuario de manera exitosa.`)
        await update()
      }).onCancel(() => {
        registro.estado = estadoOriginal
      })
    }

    const restaurarContrasena = async (registro) => {
      const configuracion = constants.PROP_DIALOG
      configuracion.message = `¿Esta seguro de restarurar la contraseña del usuario ${registro.usuario}?. esta accion usara el numero documento como contraseña por defecto`
      $q.dialog(configuracion).onOk(async () => {
        await _http.patch(`system/usuarios/${registro.id}/reset-contrasena`)
        _message.success('Contraseña restaurada de manera exitosa.')
      })
    }

    return {
      usuario,
      filters,
      columns,
      url,
      closeModal,
      openModal,
      getNombreCompleto,
      cambiarEstado,
      guardar,
      restaurarContrasena
    }
  }
}
</script>
