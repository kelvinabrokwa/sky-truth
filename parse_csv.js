import parse from 'csv-parse';

export default function parseCSV(csv) {
  return new Promise((resolve) => {
    var data = [];
    var header = false;
    var parser = parse();
    parser.on('readable', () => {
      var record;
      while (record = parser.read()) {
        if (!header) {
          header = true;
          return;
        }
        data.push(record);
      }
    });
    parser.on('finish', () => {
      resolve(data);
    });
    parser.write(csv);
    parser.end();
  });
}
