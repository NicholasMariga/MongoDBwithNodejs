
const { MongoClient, ObjectID } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);


        let items = await db.collection('newspapers').find(query);

        if(limit > 0){
          items = items.limit(limit);
        }


        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getById(id){
  return new Promise(async (resolve, reject) => {
    const client = new MongoClient(url);
    try{

      await client.connect();
      const db = client.db(dbName);
      const item = await db.collection('newspapers').findOne({_id: ObjectID(id)});

      resolve(item);
      client.close();
    }catch(error){
      reject(error);
    }
  });
  }
  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        //open connection
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection('newspapers').insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function add(item){

    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try{
  
        await client.connect();
        const db = client.db(dbName);
        const addItem = await db.collection('newspapers').insertOne(item);
        resolve(addItem);
        client.close();
      }catch(error){
        reject(error);
      }
    });
  }
  function update(id, newItem){

    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try{
  
        await client.connect();
        const db = client.db(dbName);
        const updateItem = await db.collection('newspapers')
          .findOneAndReplace({_id: ObjectID(id)}, newItem, {returnOriginal:false});
        resolve(updateItem.value);
        client.close();
      }catch(error){
        reject(error);
      }
    });
  }
  function remove(id){

    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try{
  
        await client.connect();
        const db = client.db(dbName);
        const removeItem = await db.collection('newspapers').deleteOne({_id: ObjectID(id)});
        resolve(removeItem.deletedCount === 1);
        client.close();
      }catch(error){
        reject(error);
      }
    });
  }
  return { loadData, get, getById, add, update, remove };
}

module.exports = circulationRepo();
