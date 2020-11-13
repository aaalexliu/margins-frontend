import ObjectID from 'bson-objectid';

export function generateObjectId() {
  let id = new ObjectID();
  return id.toHexString();
}