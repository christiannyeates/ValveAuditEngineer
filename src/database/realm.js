import Realm from 'realm';
export const SCANLIST_SCHEMA = "ScanList";
export const SCAN_SCHEMA = "Scan";
// Define your models and their properties
export const ScanSchema = {
    name: SCAN_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',    // primary key
        payload: { type: 'string', indexed: true },
        time: { type: 'int' },
        comments: { type: 'string' }
    }
};
export const ScanListSchema = {
    name: SCANLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',    // primary key
        name: 'string',
        creationDate: 'date',
        Scans: { type: 'list', objectType: SCAN_SCHEMA },
    }
};

const databaseOptions = {
    path: 'scanListApp.realm',
    schema: [ScanListSchema, ScanSchema],
    schemaVersion: 0, //optional    
};
//functions for ScanLists
export const insertNewScanList = newScanList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(SCANLIST_SCHEMA, newScanList);
            resolve(newScanList);
        });
    }).catch((error) => reject(error));
});


export const insertScan = (scanListId, newScan) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let scanList = realm.objectForPrimaryKey(SCANLIST_SCHEMA, scanListId);
        realm.write(() => {
            scanList.Scans.push(newScan);
            resolve(newScan);
        });
    }).catch((error) => {
        reject(error);
    });;
});


// export const updateScanList = ScanList => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let updatingScanList = realm.objectForPrimaryKey(SCANLIST_SCHEMA, ScanList.id);
//             updatingScanList.name = ScanList.name;
//             resolve();
//         });
//     }).catch((error) => reject(error));;
// });


// export const deleteScanList = ScanListId => new Promise((resolve, reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let deletingScanList = realm.objectForPrimaryKey(SCANLIST_SCHEMA, ScanListId);
//             realm.delete(deletingScanList);
//             resolve();
//         });
//     }).catch((error) => reject(error));;
// });


export const deleteAllScanLists = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let allScanLists = realm.objects(SCANLIST_SCHEMA);
            realm.delete(allScanLists);
            resolve();
        });
    }).catch((error) => reject(error));;
});


export const queryAllScanLists = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allScanLists = realm.objects(SCAN_SCHEMA);
        resolve(allScanLists);
    }).catch((error) => {
        reject(error);
    });;
});


export default new Realm(databaseOptions);