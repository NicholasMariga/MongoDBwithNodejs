const MongoClient = require("mongodb").MongoClient;

const assert = require("assert");

const circulationRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

async function main() {
  //Open client

  const client = new MongoClient(url);
  //connect
  await client.connect();
  try {
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);
    //console.log(results.insertedCount, results.ops);

    const getData = await circulationRepo.get();
    assert.equal(data.length, getData.length);
    
    //filtering
    const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper});
    assert.deepEqual(filterData[0], getData[4]);

    //limit
    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);

    //Getting data by id
    const id =getData[4]._id.toString();
    const gettingById = await circulationRepo.getById(id);
    assert.deepEqual(gettingById, getData[4]);

    //adding item
    const newItem = {
      "Newspaper": "My Newspaper",
      "Daily Circulation, 2004": 211,
      "Daily Circulation, 2013": 238,
      "Change in Daily Circulation, 2004-2013": 113,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 33,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 22,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 51
    }
    const addItem = await circulationRepo.add(newItem);
    //assert(addItem._id);
    const addedItemQuery = await circulationRepo.getById(addItem._id);
    assert.equal(addedItemQuery, newItem);

    //updating an Item
    const updateItem = await circulationRepo.update(addItem._id,{
      "Newspaper": "My New Newspaper",
      "Daily Circulation, 2004": 211,
      "Daily Circulation, 2013": 238,
      "Change in Daily Circulation, 2004-2013": 113,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 33,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 22,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 51
    });

    assert.equal(updateItem.Newspaper, "My New Newspaper");
    
    const newAddedItemQuery = await circulationRepo.getById(addItem._id);
    //assert.equal(newAddedItemQuery.Newspaper, "My New Newspaper");

    //removing an item

    const removeItem = await circulationRepo.remove(addItem._id);
    assert(removeItem);
    
  } catch (error) {
    console.log(error);
  } finally {
    const admin = client.db(dbName).admin();
    //console.log(await admin.serverStatus());
    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());

    client.close();
  }
}

main();
