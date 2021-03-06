const JWT_SECRET = process.env.JWT_SECRET;

const MAX_AVATAR_FILE_SIZE = 1000000;

const checkValidFields = (schema, doc) => {
  const schemaProps = Object.keys(schema.obj);
  const docProps = Object.keys(doc);
  const invalidFieldsMap = docProps.map(docProp => {
    return {
      name: docProp,
      valid: schemaProps.includes(docProp)
    };
  }).filter(prop => !prop.valid);

  // Invalid Fields Count
  const ifc = invalidFieldsMap.length;
  if (ifc) {
    throw new Error(`Invalid fields: [${invalidFieldsMap.map(prop => `${prop.name}`).join(', ')}]`);
  }
};

export {
  checkValidFields,
  JWT_SECRET,
  MAX_AVATAR_FILE_SIZE
};
