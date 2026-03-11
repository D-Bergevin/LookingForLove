import { MongoClient } from "mongodb";

const initDatabase = async (connectionString) => {
    try {
        const context = new MongoClient(connectionString);
        await context.connect();
        console.warn(`Database connected.`);
        return context;
    }
    catch (e) {
        console.error(e);
    }
}

const insertDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).insertOne(document);
}

const insertDocuments = (context, database, collection, documentArray) => {
    return context.db(database).collection(collection).insertMany(documentArray);
}

const updateDocument = (context, database, collection, criteria, updateData) => {
    return context.db(database).collection(collection).updateOne(criteria, { $set: updateData });
}

const deleteDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).deleteOne(document);
}

const deleteCollection = (context, database, collection) => {
    return context.db(database).collection(collection).drop();
}

const deleteDatabase = (context, database) => {
    return context.db(database).dropDatabase();
}

export {
    initDatabase,
    insertDocument,
    insertDocuments,
    deleteDocument,
    deleteCollection,
    deleteDatabase
};