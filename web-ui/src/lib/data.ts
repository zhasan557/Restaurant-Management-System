import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

export const readData = (filename: string) => {
  const filePath = path.join(dataDir, filename)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const fileData = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileData)
}

export const writeData = (filename: string, data: any) => {
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}
