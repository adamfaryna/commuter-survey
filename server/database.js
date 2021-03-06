'use strict';

var fs = require('fs');
var loki = require('lokijs');

module.exports = (dbPath) => {
  var filepath = dbPath + '/db.json';
  var db = initDB();
  var surveys = db.getCollection('survey');
  var transportTypes = db.getCollection('transportTypes');

  function initDB() {
    deleteOldDBIfExists();
    var db = new loki(filepath);

    initCollection('survey');
    initCollection('transportTypes');

    function deleteOldDBIfExists() {
      try {
        fs.accessSync(filepath, fs.F_OK)
        fs.unlinkSync(filepath);

      } catch (e) {
        // do nothing
      }
    }

    function initCollection(collectionName) {
      var collection = db.addCollection(collectionName);
      var data = fs.readFileSync(__dirname + '/data/' + collectionName + '.json', 'utf8');
      data = JSON.parse(data);

      data.forEach((elem) => {
        collection.insert(elem);
      });
    }

    return db;
  }

  return {
    insertSurvey: (survey) => {
      surveys.insert(survey);
    },

    listSurveys: () => {
      return surveys.data;
    },

    listTransportTypes: () => {
      return transportTypes.data;
    }
  };
};