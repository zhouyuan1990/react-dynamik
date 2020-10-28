import * as yup from 'yup'
import get from 'lodash/get'

function getDisplaySchema({ dependencyType, strict = true, required = true, rules = [] }) {
  if (!yup[dependencyType] && rules.length === 0) {
    return null
  }

  let validator = yup[dependencyType] ? yup[dependencyType]() : yup.mixed()
  if (strict) {
    validator = validator.strict()
  }
  if (required) {
    validator = validator.required()
  }

  rules.forEach((rule) => {
    const { type, params = [] } = rule
    if (validator[type]) {
      validator = validator[type](...params)
    } else if (type === 'exactIs') {
      validator = validator.oneOf([params[0]])
    } else if (type === 'exactNot') {
      validator = validator.notOneOf([params[0]])
    }
  })

  return validator
}

export function getConvertedFields(fields) {
  return fields.map((field) => {
    const { displays, ...params } = field
    let displayCheckers
    if (displays && displays.length > 0) {
      displayCheckers = displays.map(({ dependency, dependencyType, strict, required, rules }) => {
        return {
          dependency,
          checker: getDisplaySchema({
            dependencyType,
            strict,
            required,
            rules,
          }),
        }
      })
    }
    return {
      ...params,
      displayCheckers,
    }
  })
}

function checkDisplay(displayCheckers, values) {
  if (!displayCheckers) return true
  for (let i = 0; i < displayCheckers.length; i++) {
    const { dependency, checker } = displayCheckers[i]
    const dependencyValue = get(values, dependency)
    const displayFlag = checker.isValidSync(dependencyValue)
    if (!displayFlag) return false
  }
  return true
}

export function getDisplayedFields(fields, values) {
  return fields.filter((field) => {
    return checkDisplay(field.displayCheckers, values)
  })
}

function createYupSchema(customSchema, schema, config) {
  const { name, subFields, required, validationType, validationParams = [], validations = [] } = config
  if (subFields) {
    subFields.reduce(createYupSchema, schema)
  } else {
    if (!yup[validationType] && !required && !customSchema[validationType]) {
      return schema
    }

    let validator
    if (yup[validationType]) {
      validator = yup[validationType]()
      if (validationType === 'string' && required) {
        // add trim for string if required
        validator = validator.trim()
      }
    } else if (customSchema[validationType]) {
      validator = customSchema[validationType](...validationParams)
    } else {
      validator = yup.mixed()
    }

    if (!customSchema[validationType]) {
      // skip validations for customSchema
      if (!(validator._exclusive && validator._exclusive.required) && required) {
        validator = validator.required('Required')
      }

      validations.forEach((validation) => {
        const { type, params = [] } = validation
        if (!validator[type]) {
          return
        }
        validator = validator[type](...params)
      })
    }
    schema[name] = validator
  }
  return schema
}

export function getValidationSchema(configs, customSchema = {}) {
  const schema = {}
  const createYupSchemaWithCustomSchema = createYupSchema.bind(null, customSchema)
  configs.reduce(createYupSchemaWithCustomSchema, schema)
  return yup.object().shape(schema)
}
