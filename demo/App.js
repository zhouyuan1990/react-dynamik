import React from 'react'
import config from './config.json'
import Dynamik, { DefaultComponentDict } from '../src'

const App = () => {
  return <Dynamik initialValues={config.initialValues} fields={config.fields} componentDict={DefaultComponentDict} />
}

export default App
