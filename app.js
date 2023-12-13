import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const allowedFormats = ['png', 'jpg', 'webp', 'svg', 'gif']

const patchImages = join(__dirname, '..')
const optimizePath = join(__dirname, 'optimize')
const jsonFilePath = join(__dirname, 'optimized_images.json')

let optimizedImages = []
if (existsSync(jsonFilePath)) {
  const jsonContent = readFileSync(jsonFilePath, 'utf-8')
  optimizedImages = JSON.parse(jsonContent)
}

readdirSync(patchImages, { withFileTypes: true }).forEach((file) => {
  if (file.isFile()) {
    const fileExtension = extname(file.name).toLowerCase().slice(1)
    if (allowedFormats.includes(fileExtension)) {
      const filePath = join(patchImages, file.name)
      const optimizedFilePath = join(optimizePath, 'resize' + file.name)

      if (!optimizedImages.includes(file.name)) {
        sharp(filePath).toFile(optimizedFilePath, (err) => {
          if (err) {
            console.error(`Error al optimizar la imagen ${file.name}:`, err)
          } else {
            console.log(`Imagen ${file.name} optimizada correctamente.`)
            optimizedImages.push(file.name)

            writeFileSync(jsonFilePath, JSON.stringify(optimizedImages, null, 2))
          }
        })
      }
    }
  }
})
