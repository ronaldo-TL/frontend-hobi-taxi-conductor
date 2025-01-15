<template>
  <q-page class="q-px-md">
    <Titulo
      titulo="Parametros"
      icono="settings"
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
          label="Nuevo parametro"
          rounded
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="settings"
              size="md"
            />
            <div class="text-subtitle1 text-bold">
              {{ entidad.id ? 'Editar' : 'Agregar' }} parametro
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
            <Parametro
              v-model:valores="entidad"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Parametro>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, cambiarEstado }">
        <q-tr>
          <q-td class="text-center">
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            />
          </q-td>
          <q-td>
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado({ registro: row, url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td>{{ row.codigo }}</q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.grupo }}</q-td>
          <q-td>{{ row.descripcion }}</q-td>
          <q-td class="text-center">
            <Estado :estado="row.estado" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import CrudTable from 'components/common/CrudTable.vue'
import Parametro from 'components/Formularios/Parametro.vue'

const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Grupo',
    field: 'grupo',
    type: 'select',
    options: []
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
    sortable: true
  },
  {
    name: 'codigo',
    label: 'Codigo',
    sortable: true
  },
  {
    name: 'nombre',
    label: 'Nombre',
    sortable: true
  },
  {
    name: 'grupo',
    label: 'Grupo',
    sortable: true
  },
  {
    name: 'descripcion',
    label: 'Descripcion',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Parametro },
  name: 'Parametros',
  setup () {
    const _http = inject('http')
    const url = ref('system/parametros')
    const entidad = ref({
      grupo: null,
      nombre: null,
      descripcion: null,
      codigo: null,
      estado: 'ACTIVO'
    })

    onMounted(async () => {
      await getGrupos()
    })

    const getGrupos = async () => {
      const respuesta = await _http.get(`${url.value}/grupos`)
      filters[1].options = respuesta
    }

    const resetForm = () => {
      entidad.value = {
        grupo: null,
        nombre: null,
        descripcion: null,
        codigo: null,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        entidad.value = await _http.get(`${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (entidad.value.id) {
        await _http.put(`${url.value}/${entidad.value.id}`, entidad.value)
      } else {
        await _http.post(`${url.value}`, entidad.value)
      }
      await update()
      closeModal(close)
    }

    return {
      entidad,
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
