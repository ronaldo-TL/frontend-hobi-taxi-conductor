<template>
  <q-page>
    <Titulo
      titulo="Comisiones"
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
          label="Nueva comision"
          rounded
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 600px; max-width: 90vw;">
          <q-toolbar class="form-dialog">
            <q-icon name="person" size="sm"/>
            <div class="text-subtitle1 text-bold q-pl-sm">
              {{ comision.id ? 'Editar' : 'Agregar' }} comision
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
            <Comision
              v-model:valores="comision"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Comision>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row }">
        <q-tr class="text-center">
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="negative"
              icon="picture_as_pdf"
              @click="verPdf(row.id)"
            >
              <q-tooltip>Editar usuario</q-tooltip>
            </q-btn>
          </q-td>
          <q-td  class="text-center">
            {{ row.fecha }}
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
          <q-td class="text-center">{{ row.fechaInicio }} - {{  row.fechaFin }}</q-td>
          <q-td class="text-right">{{ row.monto }}</q-td>
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
import Comision from 'components/Formularios/Comision.vue'
// import { useQuasar } from 'quasar'
// import { constants } from 'src/constants/app'

const filters = [
  {
    label: 'Conductor',
    field: 'idConductor',
    type: 'input'
  },
  {
    label: 'Fecha Inicio',
    field: 'fechaIncio',
    type: 'date'
  },
  {
    label: 'Fecha Fin',
    field: 'fechaFin',
    type: 'date'
  }
  // {
  //   label: 'Estado',
  //   field: 'estado',
  //   type: 'select',
  //   options: [
  //     {
  //       label: 'ACTIVO',
  //       value: 'ACTIVO'
  //     },
  //     {
  //       label: 'INACTIVO',
  //       value: 'INACTIVO'
  //     }
  //   ]
  // }
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
    name: 'conductor',
    label: 'Conductor',
    sortable: false
  },
  {
    name: 'rango',
    label: 'Rango',
    sortable: false
  },
  {
    name: 'monto',
    label: 'Monto',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Comision },
  name: 'Comisiones',
  setup () {
    // const $q = useQuasar()
    const _http = inject('http')
    const url = ref('jobi/comisiones')
    const _message = inject('message')
    const comision = ref({})

    const resetForm = () => {
      comision.value = {}
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        comision.value = await _http.get(`${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`
    }

    const guardar = async (update, close) => {
      await _http.post(`${url.value}`, comision.value)
      await update()
      closeModal(close)
    }

    const verPdf = async (id) => {
      const url = await _http.getFile(`jobi/comisiones/${id}/pdf`)
      if (url) {
        window.open(url, '_blank')
      } else {
        _message.error('Error al generar el pdf')
      }
    }

    return {
      filters,
      columns,
      url,
      comision,
      closeModal,
      openModal,
      guardar,
      getNombreCompleto,
      verPdf
    }
  }
}
</script>
