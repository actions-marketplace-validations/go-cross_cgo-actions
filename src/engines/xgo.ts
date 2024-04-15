import { registerEngine } from '../runner'
import { renameSync } from 'fs'
import { $$, TempBinDir, TempBinName } from '../utils'

const targetMap = {
  'darwin-amd64': 'darwin/amd64',
  'darwin-arm64': 'darwin/arm64',
  'linux-386': 'linux/386',
  'linux-amd64': 'linux/amd64',
  'linux-arm-5': 'linux/arm-5',
  'linux-arm-6': 'linux/arm-6',
  'linux-arm-7': 'linux/arm-7',
  'linux-arm64': 'linux/arm64',
  'linux-mips': 'linux/mips',
  'linux-mipsle': 'linux/mipsle',
  'linux-mips64': 'linux/mips64',
  'linux-mips64le': 'linux/mips64le',
  'linux-ppc64le': 'linux/ppc64le',
  'linux-riscv64': 'linux/riscv64',
  'linux-s390x': 'linux/s390x',
  'windows-386': 'windows/386',
  'windows-amd64': 'windows/amd64'
} as Record<string, string>

registerEngine({
  targets: Object.keys(targetMap),
  async prepare(input) {
    // docker pull crazymax/xgo:latest
    await $$`docker pull crazymax/xgo:latest`
    // go install github.com/crazy-max/xgo@latest
    await $$`go install github.com/crazy-max/xgo@latest`
  },
  async run(input) {
    const target = targetMap[input.target]
    await $$({
      cwd: input.dir
    })`xgo -out ${TempBinName} --targets ${target} ${input.flags} ${input.pkg}`
    renameSync(
      `${TempBinName}-${input.target}${input.target.includes('windows') ? '.exe' : ''}`,
      `${TempBinDir}/${TempBinName.replace(input.target, '')}`
    )
  }
})