<template>
  <q-page>
    <Titulo
      titulo="Roles y Permisos"
      icono="shield"
    >
      <template v-slot:otro>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 text-rigth">
            <q-tabs
              v-model="tab"
              class="text-white q-px-md"
              active-color="orange"
              indicator-color="orange"
              inline-label
              narrow-indicator
              align="right"
            >
              <q-tab name="roles" icon="visibility"  label="Roles" class="q-mx-sm q-py-sm" />
              <q-tab name="permisos" icon="shield" label="Permisos" class="q-mx-md q-py-sm"/>
          </q-tabs>
          </div>
        </div>
      </template>
    </Titulo>
    <div class="row">
        <div class="col-xs-12 q-px-md">
            <q-tab-panels v-model="tab" animated class="transparent">
                <q-tab-panel  name="roles" class="q-px-none" >
                  <Roles />
                </q-tab-panel>
                <q-tab-panel  name="permisos" class="q-px-none">
                  <Permisos />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import Roles from 'components/System/Roles.vue'
import Permisos from 'components/System/Permisos.vue'

export default {
  components: { Roles, Permisos },
  setup () {
    const tab = ref('roles')

    return {
      tab

    }
  }
}
</script>
