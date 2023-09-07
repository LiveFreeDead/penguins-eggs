'use strict'

import Utils from "../classes/utils"
import fs from 'fs'
import { exec } from "./utils"

/**
 *  
 */
export default async function killMeSoftly(eggsRoot = `/home/eggs`, eggsMnt = '/home/eggs/mnt') {
  const echo = Utils.setEcho(false)
  const liveFs = `${eggsMnt}filesystem.squashfs`

  /**
   * refuse if /home/eggs/mnt/filesystem.squashfs
   */
  if (haveBindedDirs(liveFs)) {
    Utils.warning(`You have binded dirs under ${liveFs}, kill is not possible!`)
    process.exit(1)
  }

  /**
   * if eggsMnt is mountpoint
   */
  if (Utils.isMountpoint(eggsMnt)) {
    // Just delete
    await exec(`rm -rf ${eggsMnt}efi-work`)
    await exec(`rm -rf ${eggsMnt}iso`)
    await exec(`rm -rf ${eggsMnt}memdiskDir`)
    await exec(`rm -rf ${eggsRoot}ovarium`)

    // double check !haveBindedDirs
    if (!haveBindedDirs(liveFs)) {
      await exec(`rm -rf ${liveFs}`)
    }
    process.exit(0)
  }
  await exec(`rm ${eggsRoot} -rf`, echo)
}

/**
 * 
 * @param path 
 * @returns 
 */
function haveBindedDirs(path: string): Boolean {
  let retVal = false
  const dirs = [
    'bin',
    'boot',
    'etc',
    'lib',
    'lib32',
    'lib64',
    'libx32',
    'opt',
    'root',
    'sbin',
    'srv',
    'usr',
    'var'
  ]

  for (const dir of dirs) {
    const dirToCheck = `${path}/${dir}`
    if (fs.existsSync(dirToCheck)) {
      if (Utils.isMountpoint(dirToCheck)) {
        console.log(`Warning: ${dirToCheck}, is a mountpoint!`)
        retVal = true
      }
    }
  }
  return retVal
}
