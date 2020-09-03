const { GettextExtractor, JsExtractors, HtmlExtractors } = require('gettext-extractor');
const { writeFileSync, readFileSync, existsSync, readdirSync } = require('fs');
const { parseFileSync } = require('po2json');
const { parse } = require('path');

const defautLanguage = 'en';
const defaultJsonFile = `./i18n/${defautLanguage}.json`;
const defaultPotFile = `./i18n/template.pot`;

const updatePoFromJson = false;

const languages = [];

readdirSync('./i18n').forEach(file => {
  if (parse(file).ext === '.po') {
    languages.push(parse(file).name);
  }
});

let extractor = new GettextExtractor();

extractor
  .createJsParser([
    JsExtractors.callExpression('getText', {
      arguments: {
        text: 0,
        context: 1,
      },
    }),
  ])
  .parseFilesGlob('./src/**/*.@(ts|js|tsx|jsx)');

const messages = extractor.getMessages().reduce((all, cur) => {
  all[cur.text] = cur.text;
  return all;
}, {});

writeFileSync(defaultJsonFile, JSON.stringify(messages, null, 4));
extractor.savePotFile(defaultPotFile);
extractor.printStats();

for (let l = 0; l < languages.length; l++) {
  const lang = languages[l];
  const jsonFile = `./i18n/${lang}.json`;
  const poFile = `./i18n/${lang}.po`;

  let existsJsonData = null;
  let existsPoAsJsonData = null;

  if (existsSync(poFile)) {
    existsPoAsJsonData = convertPoJsonToNormalJson(parseFileSync(poFile));
  }
  if (existsSync(jsonFile)) {
    existsJsonData = JSON.parse(readFileSync(jsonFile));
  }
  if (!existsPoAsJsonData) {
    extractor.savePotFile(poFile);
    existsPoAsJsonData = messages;
  }
  if (existsJsonData && updatePoFromJson) {
    const keys = Object.keys(existsPoAsJsonData);
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      if (Object.getOwnPropertyDescriptor(existsJsonData, key)) {
        existsPoAsJsonData[key] = existsJsonData[key];
      }
    }
  }
  writeFileSync(jsonFile, JSON.stringify(existsPoAsJsonData, null, 4));
}

function convertPoJsonToNormalJson(data) {
  const newObject = {};
  if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    keys.forEach(key => {
      if (key && data[key] && Array.isArray(data[key]) && data[key].length === 2) {
        newObject[key] = data[key][1];
      } else {
        if (key) {
          newObject[key] = data[key];
        }
      }
    });
  }
  return newObject;
}
