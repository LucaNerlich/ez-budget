import React, {memo} from 'react'
import packageJson from '../../package.json'

function AppVersion(props) {
  const {
    builtBy,
  } = props

  const appVersion = `v${packageJson.version}`

  return (
    <p>{appVersion}{builtBy && <span> - built by <a target='_blank'
                                                    rel='noreferrer'
                                                    href='https://pnn-it.de'>pnn-it.de</a></span>}</p>
  )
}

export default memo(AppVersion)
