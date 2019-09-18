const JWT_SECRET = "myjwtsecret";

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

module.exports = {
  checkValidFields,
  JWT_SECRET
};
