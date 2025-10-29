import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

let loaded = false

const ENV_FILES = [
  '.env.local',
  '.env.development.local',
  '.env.development',
  '.env',
]

const loadFromPaths = (paths: string[]) => {
  for (const filePath of paths) {
    if (existsSync(filePath)) {
      config({ path: filePath })
    }
  }
}

export const loadEnvironment = () => {
  if (loaded) {
    return
  }

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const cwd = resolve(process.cwd())
  const workerDir = resolve(__dirname, '..', '..')
  const rootDir = resolve(workerDir, '..', '..')

  const workerPaths = ENV_FILES.map((file) => resolve(workerDir, file))
  const rootPaths = ENV_FILES.map((file) => resolve(rootDir, file))

  loadFromPaths([...workerPaths, ...rootPaths])

  // fallback to NODE_ENV specific file in current working directory
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv) {
    const envFile = `.env.${nodeEnv}`
    const localFile = `.env.${nodeEnv}.local`
    loadFromPaths([
      resolve(workerDir, localFile),
      resolve(workerDir, envFile),
      resolve(rootDir, localFile),
      resolve(rootDir, envFile),
      resolve(cwd, localFile),
      resolve(cwd, envFile),
    ])
  }

  loaded = true
}
