<template>
  <div class="row justify-center">
    <div class="col-lg-5 col-md-6 col-sm-10 col-xs-12">
      <q-card class="q-mb-xs" style="border-radius: 10px;">
        <q-card-section class="q-px-none q-py-xs">
          <q-tabs
            class="text-grey-7 caption"
            no-caps
            :narrow-indicator="false"
            indicator-color="white"
            dense
          >
        <template v-if="!selectedObject || (selectedObject && selectedObject.type!=='i-text')">
          <q-tab >
            <q-icon @click.stop="addText" name="title" size="sm" />
            <div @click.stop="addText">Texto</div>
          </q-tab>
          <q-tab v-if="!tieneLogo" @click.stop="addImg" >
            <q-icon name="fitbit" size="sm" />
            <div>Logo</div>
          </q-tab>
          <q-tab>
            <q-icon @click.stop="adjustImg" name="transform" size="sm" />
            <div @click.stop="adjustImg">Ajustar</div>
          </q-tab>
          <q-tab v-if="!!selectedObject">
            <q-icon @click.stop="deleteObject" name="delete" size="sm" color="negative" />
            <div @click.stop="deleteObject">Eliminar</div>
          </q-tab>
        </template>
        <template v-if="selectedObject && selectedObject.type==='i-text'">
          <q-tab>
              <input type="color" v-model="textColor"  @input="changeTextColor"/>
              <div>Color</div>
          </q-tab>
          <q-tab>
            <q-icon name="text_format" size="lg" />
            <div>{{ textFont }}</div>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  v-for="(fuente,index) in fuentes"
                  :key="index"
                  clickable
                  v-close-popup
                  @click="changeFontFamily(fuente.valor)"
                >
                  <q-item-section :style="`font-family: ${fuente.valor};`">{{ fuente.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-tab>
          <q-tab icon="delete" color="negative" label="Eliminar" @click.stop="deleteObject" />
        </template>
      </q-tabs>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div class="row justify-center">
    <div class="col-lg-5 col-md-6 col-sm-10 col-xs-12">
        <canvas id="editor" ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { fabric } from 'fabric'

export default {
  name: 'FabricCanvas',
  props: {
    valor: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const canvasRef = ref(null)
    const Storage = inject('storage')
    const fuentes = [
      { valor: 'Arial', label: 'Arial' },
      // { valor: 'Helvetica', label: 'Helvetica' },
      // { valor: 'Times New Roman', label: 'Times New Roman' },
      // { valor: 'Courier New', label: 'Courier New' },
      // { valor: 'Verdana', label: 'Verdana' },
      // { valor: 'Georgia', label: 'Georgia' },
      // { valor: 'Roboto', label: 'Roboto' }
      { valor: 'Gotham', label: 'Gotham' },
      { valor: 'Cubano', label: 'Cubano' },
      { valor: 'Quicksand', label: 'Quicksand' },
      { valor: 'Bemio', label: 'Bemio' },
      { valor: 'Kaolin', label: 'Kaolin' },
      { valor: 'Lilita One', label: 'Lilita One' },
      { valor: 'Regular Brush', label: 'Regular Brush' },
      { valor: 'Montserrat', label: 'Montserrat' },
      { valor: 'Avenir Next Heavy', label: 'Avenir Next Heavy' },
      { valor: 'Big Caskib Black', label: 'BigCaskib Black' },
      { valor: 'Playlist', label: 'Playlist' },
      { valor: 'Georgia', label: 'Georgia' },
      { valor: 'Poppins', label: 'Poppins' },
      { valor: 'Roboto Condensed', label: 'Roboto Condensed' },
      { valor: 'Bodoni', label: 'Bodoni' },
      { valor: 'Sunflower', label: 'Sunflower' },
      { valor: 'AftikaRegular', label: 'AftikaRegular' },
      { valor: 'Autophobia', label: 'Autophobia' },
      { valor: 'Caviar Dreams Bold', label: 'Caviar Dreams Bold' },
      { valor: 'Helvetica', label: 'Helvetica' },
      { valor: 'Oduda Bold', label: 'Oduda Bold' },
      { valor: 'Roboto', label: 'Roboto' },
      { valor: 'Breakfast', label: 'Breakfast' },
      { valor: 'ananda', label: 'ananda' },
      { valor: 'Blancha', label: 'Blancha' },
      { valor: 'Bebas', label: 'Bebas' },
      { valor: 'awakening', label: 'awakening' },
      { valor: 'Fair Prosper', label: 'Fair Prosper' }
    ]
    const textColor = ref('#ffffff')
    const textFont = ref('Arial')
    const selectedObject = ref(null)
    const scaleRatio = ref(1)
    const originalWidth = ref(props.valor.tamanio.ancho)
    const originalHeight = ref(props.valor.tamanio.alto)
    const canvasWidth = ref(0)
    const canvasHeight = ref(0)
    const transform = ref('vertical')
    const tieneLogo = ref(false)
    let canvas = null

    onMounted(async () => {
      await initCanvas()
      makeCanvasResponsive()
      window.addEventListener('resize', makeCanvasResponsive)
      window.addEventListener('keydown', handleKeyDown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', makeCanvasResponsive)
      window.removeEventListener('keydown', handleKeyDown)
    })

    const handleKeyDown = (event) => {
      const objetoSeleccionado = canvas.getActiveObject()
      if (objetoSeleccionado && objetoSeleccionado.type === 'i-text' && !objetoSeleccionado.isEditing) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          canvas.remove(objetoSeleccionado)
          canvas.requestRenderAll()
        }
      }
      if (objetoSeleccionado && objetoSeleccionado.id === 'logo') {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          canvas.remove(objetoSeleccionado)
          tieneLogo.value = false
          canvas.requestRenderAll()
        }
      }
    }

    const makeCanvasResponsive = () => {
      const container = canvasRef.value.parentElement.parentElement
      const containerWidth = container.offsetWidth
      const tmp = containerWidth / originalWidth.value
      if (scaleRatio.value !== tmp) {
        scaleRatio.value = tmp
        canvasWidth.value = originalWidth.value * scaleRatio.value
        canvasHeight.value = originalHeight.value * scaleRatio.value
        canvas.setDimensions({
          width: canvasWidth.value,
          height: canvasHeight.value
        })
        canvas.getObjects().forEach((obj) => {
          obj.scaleX = obj.scaleX * scaleRatio.value
          obj.scaleY = obj.scaleY * scaleRatio.value
          obj.left = obj.left * scaleRatio.value
          obj.top = obj.top * scaleRatio.value
          obj.setCoords()
        })
        canvas.renderAll()
      }
    }

    const initCanvas = () => {
      if (canvasRef.value) {
        canvas = new fabric.Canvas(canvasRef.value, {
          width: props.valor.tamanio.ancho,
          height: props.valor.tamanio.alto,
          backgroundColor: '#f5f5f5'
        })

        if (props.valor.imagen) {
          fabric.Image.fromURL(props.valor.imagen, function (img) {
            // const imgWidth = img.width
            const imgHeight = img.height
            const canvasWidth = canvas.width
            const canvasHeight = canvas.height

            const scaleFactor = canvasHeight / imgHeight

            img.set({
              scaleX: scaleFactor,
              scaleY: scaleFactor,
              originX: 'center',
              originY: 'center',
              left: canvasWidth / 2,
              top: canvasHeight / 2,
              selectable: false
            })
            canvas.add(img)
          })
        }

        if (props.valor) {
          if (props.valor.plantilla && props.valor.plantilla !== '') {
            fabric.Image.fromURL(props.valor.plantilla.ruta, function (img) {
              const imgHeight = img.height
              const canvasHeight = canvas.height

              const scaleFactor = canvasHeight / imgHeight
              img.set({
                scaleX: scaleFactor,
                scaleY: scaleFactor,
                left: 0,
                top: 0,
                angle: 0,
                selectable: false,
                evented: false,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true
              })

              canvas.add(img)
            })
          }
        }

        canvas.on('selection:created', (e) => {
          const selectedObjects = e.selected
          if (selectedObjects.length > 0) {
            selectedObject.value = selectedObjects[0]
          }
        })

        // canvas.on('selection:updated', (e) => {
        //   selectedObject.value = e.selected[0]
        // })

        canvas.on('selection:cleared', (e) => {
          selectedObject.value = null
        })
      }
    }

    const adjustImg = () => {
      try {
        const objetoExistente = canvas.item(0)
        canvas.remove(objetoExistente)
        fabric.Image.fromURL(props.valor.imagen, function (img) {
          const imgWidth = img.width
          const imgHeight = img.height
          const canvasWidth = canvas.width
          const canvasHeight = canvas.height
          transform.value = transform.value === 'vertical' ? 'horizontal' : 'vertical'
          let scaleFactor = canvasWidth / imgWidth
          if (transform.value === 'vertical') {
            scaleFactor = canvasHeight / imgHeight
          }

          img.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            originX: 'center',
            originY: 'center',
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            selectable: false
          })

          // Añadir la imagen al canvas
          canvas.insertAt(img, 0)
          canvas.requestRenderAll()
        })
      } catch (e) {
        console.log('------------------------------------')
        console.log(e)
        console.log('------------------------------------')
      }
    }

    const deleteObject = () => {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        if (activeObject.id === 'logo') {
          tieneLogo.value = false
        }
        canvas.remove(activeObject)
        canvas.renderAll()
        selectedObject.value = null
      }
    }

    const addImg = async () => {
      const restaurante = Storage.get('restaurante')
      const response = await fetch(restaurante.logo)
      const blob = await response.blob()
      const urlLocal = URL.createObjectURL(blob)
      fabric.Image.fromURL(urlLocal, function (img) {
        const recorte = img.width > 350 ? img.width > 450 ? 230 : 150 : 70
        img.scaleToWidth((img.width - recorte) * scaleRatio.value)
        img.scaleToHeight((img.height - recorte) * scaleRatio.value)

        img.set({
          crossOrigin: 'anonymous',
          top: 15,
          left: 15,
          clipPath: new fabric.Rect({
            width: img.width,
            height: img.height,
            rx: 30,
            ry: 30,
            originX: 'center',
            originY: 'center'
          })
        })
        img.set('id', 'logo')
        tieneLogo.value = true
        canvas.add(img)
        canvas.setActiveObject(img)
      })
    }

    const addText = (textContent, left, top) => {
      const text = new fabric.IText('Texto aquí', {
        left: canvas.width - 180,
        top: 20,
        fill: textColor.value,
        fontFamily: textFont.value,
        fontSize: 100 * scaleRatio.value,
        editable: true
      })
      canvas.add(text)
      canvas.setActiveObject(text)
    }

    // CUADRADO 1200X1200
    // VERTICAL 1080X1920

    const downloadImage = (download = true) => {
      try {
        canvas.setDimensions({
          width: originalWidth.value * 1,
          height: originalHeight.value * 1
        })

        canvas.getObjects().forEach((obj) => {
          obj.scaleX = obj.scaleX * (originalWidth.value / canvasWidth.value)
          obj.scaleY = obj.scaleY * (originalHeight.value / canvasHeight.value)
          obj.left = obj.left * (originalWidth.value / canvasWidth.value)
          obj.top = obj.top * (originalHeight.value / canvasHeight.value)
          obj.setCoords()
        })

        canvas.renderAll()
        const dataURL = canvas.toDataURL({
          format: 'image/png',
          width: props.valor.tamanio.ancho,
          height: props.valor.tamanio.alto
        })
        if (download) {
          const link = document.createElement('a')
          link.href = dataURL
          link.download = 'canvas_image.png'
          link.click()
        }
        scaleRatio.value = 1
        makeCanvasResponsive()
        return dataURL
      } catch (e) {
        console.log('------------------------------------')
        console.log(e)
        console.log('------------------------------------')
      }
    }

    const changeTextColor = () => {
      if (selectedObject.value && selectedObject.value.type === 'i-text') {
        selectedObject.value.set('fill', textColor.value)
        canvas.renderAll() // Renderizar el canvas
      }
    }

    const changeFontFamily = (font) => {
      if (selectedObject.value && selectedObject.value.type === 'i-text') {
        selectedObject.value.set('fontFamily', font) // Cambiar la fuente del texto
        textFont.value = font
        canvas.renderAll() // Renderizar el canvas
      }
    }

    const enviarAtras = () => {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        canvas.sendBackwards(activeObject)
        setTimeout(() => {
          canvas.renderAll()
        }, 500)
      }
    }

    return {
      canvasRef,
      addText,
      textColor,
      fuentes,
      textFont,
      downloadImage,
      selectedObject,
      changeTextColor,
      changeFontFamily,
      addImg,
      enviarAtras,
      deleteObject,
      adjustImg,
      tieneLogo
    }
  }
}
</script>

<style>
canvas {
  display: block;
  max-width: 100%; /* Ajustar el canvas al ancho disponible */
}
</style>
