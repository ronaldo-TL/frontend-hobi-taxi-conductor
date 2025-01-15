<template>
  <q-page class="q-px-md">
    <Titulo
      titulo="Carreras"
      icono="settings"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="">
      </template>
      <template v-slot:row="{ row }">
        <q-tr>
          <q-td class="text-center">
            <!-- <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            /> -->
          </q-td>
          <q-td class="text-center">{{ row.fecha }}</q-td>
          <q-td>{{ row.origen }}</q-td>
          <q-td>{{ row.destino }}</q-td>
          <q-td class="text-center">
            <Estado :estado="row.estado" />
          </q-td>
          <q-td>
            <div class="row items-center">
              <div class="col-xs-12">
                <div class="text-bold text-subtitle2">{{ getNombreCompleto(row.solicitante) }}</div>
                <div>{{ row.solicitante?.numeroDocumento }}</div>
                <div>{{ row.conductor?.celular }}</div>
              </div>
            </div>
          </q-td>
          <q-td>
            <div class="row items-center">
              <div class="col-xs-3">
                <q-avatar size="55px">
                  <q-img
                    :src="`${backendUrl}/${row.conductor?.rutaImagenFoto}`"
                    spinner-color="primary"
                    spinner-size="60px"
                  />
                </q-avatar>
              </div>
              <div class="col-xs-9">
                <div class="text-bold text-subtitle2">{{ getNombreCompleto(row.conductor?.usuario) }}</div>
                <div>{{ row.conductor?.usuario?.numeroDocumento }}</div>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import CrudTable from 'components/common/CrudTable.vue'

const filters = [
  {
    label: 'Fecha Inicio',
    field: 'fechaInicio',
    type: 'date'
  },
  {
    label: 'Fecha Fin',
    field: 'fechaFin',
    type: 'date'
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: ['NUEVO', 'PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'COMPLETADO']
  }
]

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'fecha',
    label: 'Fecha',
    sortable: false
  },
  {
    name: 'origen',
    label: 'Origen',
    sortable: false
  },
  {
    name: 'destino',
    label: 'Destino',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  },
  {
    name: 'cliente',
    label: 'Cliente',
    sortable: false
  },
  {
    name: 'conductor',
    label: 'Conductor',
    sortable: false
  }
]

export default {
  components: { CrudTable },
  name: 'Carreras',
  setup () {
    // const _http = inject('http')
    const url = ref('jobi/carreras')
    const backendUrl = process.env.BACKEND_URL

    onMounted(() => {})

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`
    }

    return {
      filters,
      columns,
      url,
      backendUrl,
      getNombreCompleto
    }
  }
}
</script>
