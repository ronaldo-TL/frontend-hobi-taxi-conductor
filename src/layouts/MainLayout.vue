<template>
  <q-layout view="lHh lpR lff">
    <q-header :class="{ 'bg-background': ! $q.dark.isActive,'q-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          class="q-mr-md"
          icon="menu"
          color="orange-9"
          @click="toggleLeftDrawer"
        />
        <q-btn
          color="primary"
          :icon="miniState?'chevron_right':'chevron_left'"
          @click="miniState=!miniState"
          flat
          round
        />
        <div class="text-orange-9 text-h6 text-bold" v-if="restaurante">{{ restaurante.nombre }}</div>
        <div v-if="isDevelopment" class="baner-development">{{tituloAmbiente}}</div>
        <q-space />
        <q-space />
        <q-toggle
          v-model="darkMode"
          icon="dark_mode"
          @click="darkModeChange"
        />
        <q-item
          clickable
          v-ripple
        >
          <q-item-section v-if="usuario">
            <q-avatar
              color="secondary text-white"
              v-if="usuario.usuario"
            >
              {{
                  usuario?.foto_perfil
                    ? ""
                    : usuario?.usuario.toUpperCase().charAt(0)
              }}
            </q-avatar>
          </q-item-section>
          <q-menu
            anchor="bottom right"
            self="top right"
            class="dialog"
          >
            <q-list style="min-width: 300px">
              <q-item class="text-secondary">
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-xs-2 column justify-center">
                      <q-avatar
                        color="primary text-white"
                        style="vertical-align: middle"
                        v-if="usuario.usuario"
                      >
                        {{usuario.foto_perfil? "": usuario?.usuario.toUpperCase().charAt(0)}}
                        <img
                          v-if="usuario.foto_perfil"
                          :src="`${rutaImagen}/Src/Uploads/${usuario.foto_perfil}`"
                          style="max-width: 80px"
                        />
                      </q-avatar>
                    </div>
                    <div class="col-xs-10 q-pl-md">
                      <p class="text-weight-regular text-subtitle2">
                        <q-icon name="people" /> {{ usuario.usuario }}
                      </p>
                      <p v-if="usuario.correoElectronico" class="text-weight-regular">
                        <q-icon name="email" />
                        {{ usuario.correoElectronico }}
                      </p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <!-- <q-item
                clickable
                v-ripple
                @click="$router.replace('/app/perfil')"
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="person_outline"
                  />
                </q-item-section>
                <q-item-section>Mi cuenta</q-item-section>
              </q-item> -->
              <q-item
                clickable
                v-ripple
                v-close-popup
                @click="logout"
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="exit_to_app"
                  />
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
      </q-toolbar>
      <q-drawer
        show-if-above
        v-model="leftDrawerOpen"
        side="left"
        :breakpoint="900"
        :width="250"
        :mini="miniState"
        class="nab-bar"
        fixed
      >
        <div class="text-center">
         <div class="text-center q-mt-lg q-pb-md" :class="{'q-pa-xs q-my-lg':miniState}">
              <q-img
                v-if="!miniState"
                src="/img/logo_jobi_white.png"
                style="max-width:150px"
              />
              <q-img
                v-if="miniState"
                src="/img/logo_jobi_white.png"
                style="width:100%"
              />
            </div>
          <div class="text-center q-pa-md" v-if="!miniState">
            <q-avatar
              v-if="usuario?.usuario"
              size="64px"
              font-size="42px"
              color="secondary"
              text-color="white"
            >
              {{ usuario?.usuario[0]?.toUpperCase() }}
            </q-avatar>
            <div class="text-weight-bold text-white q-mt-sm">{{ usuario?.usuario }}</div>
            <div class="text-weight-bold text-white">{{ usuario?.correoElectronico }}</div>
          </div>
        </div>

        <q-list
          padding
          v-if="menu?.length"
        >
          <q-item-label v-if="!miniState" header class="text-white text-bold q-ml-md q-pb-none">Menus</q-item-label>
          <q-item
            v-for="item in menu"
            :key="item.ruta"
            :active="esSeleccionado(item)"
            clickable
            active-class="bg-background text-secondary"
            @click="$router.push(`/app/${item.ruta}`)"
            :class="{'mini-item':miniState}"
          >
            <q-item-section avatar>
              <q-icon
                size="md"
                :name="item.icono"
                :color="esSeleccionado(item) ? 'secondary' : 'white'"
                class="q-mr-sm"
              />
            </q-item-section>
            <q-item-section class="text-bold">
              {{ item.nombre }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <q-page-container>
      <!-- <div class="row q-col-gutter-md justify-center q-mx-md" v-if="alerta">
        <div class="col-xs-12 ">
          <div class="alert alert--warning">
            <q-icon name="error_outline" size="md" class="q-pr-sm" /> {{alerta}}
          </div>
        </div>
      </div> -->
      <div class="row">
        <div class="col-xs-12" :class="{'q-px-lg':$q.screen.gt.sm, 'q-px-sm':$q.screen.lt.md}">
          <router-view/>
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, inject, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { constants } from '../constants/app'
import { useGlobalStore } from 'src/stores/app'

export default defineComponent({
  name: 'MainLayout',
  setup (props, context) {
    const _auth = inject('auth')
    const store = useGlobalStore()

    onMounted(async () => {
      _auth.initStore()
    })

    const $q = useQuasar()
    const darkMode = ref($q.dark.isActive)
    const leftDrawerOpen = ref(false)
    const route = useRoute()
    const miniState = ref(false)
    const isDevelopment = ['development', 'local'].includes(process.env.AMBIENTE)
    const tituloAmbiente = constants.AMBIENTES[process.env.AMBIENTE] || null
    const usuario = computed(() => store.usuario)
    // const rol = computed(() => store.rol)
    const restaurante = computed(() => store.restaurante)
    const menu = computed(() => store.menu)

    const logout = async () => {
      await _auth.logout()
    }

    return {
      logout,
      darkMode,
      darkModeChange () {
        $q.dark.set(!$q.dark.isActive)
      },
      menu,
      usuario,
      // rol,
      restaurante,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      esSeleccionado (item) {
        return (route.path.includes(item.ruta) && item.ruta !== '') || (item.ruta === '' && route.path === '/')
      },
      isDevelopment,
      tituloAmbiente,
      miniState
    }
  }
})
</script>

<style lang="scss">
$aside: $primary;
$aside-dark: #3c3c3c;
$height: 190px;
$radius: 40px;

.q-drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.nab-bar{
  background-color: $primary;
  border-radius: 0 30px 30px 0;

  .q-item {
    margin: 20px 0px 0px 15px;
    padding: 5px 30px;
    min-height: 46px;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    color: white;
    transition: none !important;

    .q-item__section--avatar {
      padding-right: 10px;
      min-width: 40px;
    }

    &.q-hoverable:hover {
      & > .q-focus-helper {
        opacity: 0 ;
      }
    }
    &.q-item--active.q-hoverable:hover {
      & > .q-focus-helper {
        opacity: 0 !important;
      }
    }
    &.mini-item{
      margin-left: 8px;
    }
  }

  .q-item.q-item--active.q-item--dark{
    color: white !important;
    background-color:  $dark !important;
  }

  .q-item.q-item--active:before,
  .q-item.q-item--active:after{
    content: '';
    position: absolute;
    width: $radius;
    height: $radius;
    right: 0;
  }

  .q-item.q-item--active.mini-item:before,
  .q-item.q-item--active.mini-item:after{
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    right: 0;
  }

  .q-item.q-item--active:before {
    top: -$radius;
    border-bottom-right-radius: $radius;
    box-shadow: 12px 12px 0 12px $background;
    background: transparent;
  }

  .q-item.q-item--active.q-item--dark:before {
    box-shadow: 12px 12px 0 12px $dark !important;
  }

  .q-item.q-item--active.mini-item:before {
    top: -20px;
    border-bottom-right-radius: 20px;
    box-shadow: 5px 5px 0 5px $background;
  }

  .q-item.q-item--active:after {
    bottom:-$radius;
    border-top-right-radius: $radius;
    box-shadow: 12px -12px 0 12px $background;
  }

  .q-item.q-item--active.q-item--dark:after{
    box-shadow: 12px -12px 0 12px $dark !important;
  }

  .q-item.q-item--active.mini-item::after {
    bottom: -20px;
    border-top-right-radius: 30px;
    box-shadow: 5px -5px 0 5px $background;
  }

}

aside.q-drawer {
    background-color: transparent;
}

.drawer-footer-principal {
  margin-top: auto;
  padding-bottom:40px;
  text-align: center;
}
.q-toolbar-restaurante{
  background-color: #eeee;
}
</style>
