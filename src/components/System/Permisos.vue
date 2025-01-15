<template>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nuevo permiso"
        />
      </template>
      <template v-slot:form="{ close, update }">
        <q-card style="width: 900px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="shield"
              size="md"
            />
            <q-toolbar-title>
              {{ permiso.id ? 'Editar' : 'Agregar' }} Permiso
            </q-toolbar-title>
            <q-space />
            <q-btn
              flat
              round
              icon="close"
              @click="closeModal(close)"
            />
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <Permiso
              v-model:valores="permiso"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Permiso>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, cambiarEstado }">
        <q-tr>
          <q-td>
            <!-- <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            /> -->
          </q-td>
          <q-td class="text-center">
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado({ registro: row, url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td class="text-center">{{ row.tipo }}</q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.descripcion }}</q-td>
          <q-td class="text-center">
            <Estado :estado="row.estado" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
</template>

<script>
import { ref, inject } from 'vue'
import CrudTable from 'components/common/CrudTable.vue'
import Permiso from 'components/Formularios/Permiso.vue'

const filters = [
  {
    label: 'Tipo',
    field: 'tipo',
    type: 'select',
    options: [
      { label: 'SISTEMA', value: 'SISTEMA' },
      { label: 'INTEROPERABILIDAD', value: 'INTEROPERABILIDAD' }
    ]
  },
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Descripcion',
    field: 'descripcion',
    type: 'input'
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: [
      { label: 'ACTIVO', value: 'ACTIVO' },
      { label: 'INACTIVO', value: 'INACTIVO' }
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
    name: 'tipo',
    label: 'Tipo',
    sortable: false
  },
  {
    name: 'nombre',
    label: 'Nombre',
    sortable: false
  },
  {
    name: 'descripcion',
    label: 'Descripcion',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Permiso },
  name: 'Permisos',
  setup () {
    const _http = inject('http')
    const url = ref('system/permisos')
    const permiso = ref({
      nombre: null,
      descripcion: null,
      tipo: 'SISTEMA',
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      permiso.value = {
        nombre: null,
        descripcion: null,
        tipo: 'SISTEMA',
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        permiso.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (permiso.value.id) {
        await _http.put(`/${url.value}/${permiso.value.id}`, permiso.value)
      } else {
        await _http.post(`/${url.value}`, permiso.value)
      }
      await update()
      closeModal(close)
    }

    return {
      permiso,
      filters,
      columns,
      url,
      closeModal,
      openModal,
      guardar
    }
  }
}
</script>
