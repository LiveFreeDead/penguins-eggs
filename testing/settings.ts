/**
 * run with: pnpx ts-node
 * #!/usr/bin/pnpx ts-node
 */

import yaml from 'js-yaml'
import fs from 'node:fs'

import Utils from '../src/classes/utils'
import {ISettings} from '../src/interfaces/i-settings'

Utils.titles('settings')



main()

async function main() {
  let configRoot = '/etc/penguins-eggs.d/krill/'
  if (fs.existsSync('/etc/calamares/settings.conf')) {
    configRoot = '/etc/calamares/'
   }

  const settingsVar: string = fs.readFileSync(`${configRoot}settings.conf`, 'utf8')
  const settingsYaml = yaml.load(settingsVar) as ISettings

  console.log()

  const execSequence = settingsYaml.sequence[1]
  console.log(execSequence.exec)
  const steps = execSequence.exec
  for (const step of steps){
    if (step.includes('bliss-')) {
      console.log(`- ${step}`)
    }
  }

  // console.log()
  // console.log(settingsYaml.sequence[2])
}
