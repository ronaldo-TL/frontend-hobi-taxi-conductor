<template>
  <q-page>
    <Titulo
      titulo="Menus"
      icono="menu"
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
          label="Nuevo menu"
          rounded
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="menu"
              size="md"
            />
            <q-toolbar-title class="text-h6 text-bold">
              {{ menu.id ? 'Editar' : 'Agregar' }} menu
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
            <NuevoMenu
              v-model:valores="menu"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></NuevoMenu>
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
          <q-td class="text-center">
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado({ registro: row, url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.ruta }}</q-td>
          <q-td class="text-center">
            <q-icon
              size="md"
              :name="row.icono"
            />
          </q-td>
          <q-td class="text-center">{{ row.orden }}</q-td>
          <!-- <q-td>
            <q-icon
              size="xs"
              :name="row.menuSuperior?.icono"
            /> {{ row.menuSuperior?.nombre }}
          </q-td> -->
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
import NuevoMenu from 'components/Formularios/Menu.vue'

const filters = [
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
    name: 'nombre',
    label: 'Nombre',
    sortable: true
  },
  {
    name: 'ruta',
    label: 'Ruta',
    sortable: true
  },
  {
    name: 'icono',
    label: 'Icono',
    sortable: false
  },
  {
    name: 'orden',
    label: 'Orden',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, NuevoMenu },
  name: 'Menus',
  setup () {
    const _http = inject('http')
    const _message = inject('message')

    const url = ref('system/menus')
    const menu = ref({
      grupo: null,
      nombre: null,
      descripcion: null,
      codigo: null,
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      menu.value = {
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
        menu.value = await _http.get(`${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      let mennsaje = 'Menu creado de manera exitosa.'
      if (menu.value.id) {
        mennsaje = 'Menu actualizado de manera exitosa.'
        await _http.put(`${url.value}/${menu.value.id}`, menu.value)
      } else {
        await _http.post(`${url.value}`, menu.value)
      }
      _message.success(mennsaje)
      await update()
      closeModal(close)
    }

    return {
      menu,
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
