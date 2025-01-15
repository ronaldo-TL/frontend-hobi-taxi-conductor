export const constants = {
  AMBIENTES: {
    development: 'PRUEBAS',
    local: 'LOCAL',
    production: 'PRODUCCION'
  },
  ROLES: {
    ROL_ADMINISTRADOR: '7a16f88b-10bb-4a07-9bc2-3458124af968',
    ROL_CONDUCTOR: '3d12cb09-91f2-43aa-be60-bbf322116a07',
    ROL_CLIENTE: '70796247-01c3-469f-9fae-cd6082ebad86'
  },
  MARCAS: [
    'HONDA',
    'YAMAHA',
    'SUZUKI',
    'BAJAJ',
    'KAWASAKI',
    'HERO',
    'TVS',
    'SYM',
    'VENTO',
    'RATO',
    'LONCIN',
    'KEEWAY',
    'LIFAN',
    'ZONGSHEN',
    'MOTOMEL',
    'JIANSHE',
    'BERMUDA',
    'GIANT',
    'HAOJUE',
    'BETA'
  ],
  PROP_DIALOG: {
    title: '<div class="text-grey text-subtitle1">Confirmación</div>',
    message: '¿Esta seguro?',
    html: true,
    ok: {
      color: 'primary',
      label: 'Aceptar',
      rounded: true
    },
    cancel: {
      color: 'negative',
      'text-color': 'negative',
      label: 'Cancelar',
      flat: true,
      rounded: true
    },
    persistent: true
  }
}
