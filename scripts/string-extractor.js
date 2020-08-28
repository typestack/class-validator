const { GettextExtractor, JsExtractors, HtmlExtractors } = require('gettext-extractor');
const { writeFileSync } = require('fs');

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

writeFileSync('./i18n/messages-en.json', JSON.stringify(messages));
extractor.savePotFile('./i18n/messages.pot');
extractor.printStats();
