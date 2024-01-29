import fs from 'fs';

export default function replaceValueInJsonFile(
  filePath: string,
  keyToReplace: string,
  newValue: string
) {
  fs.readFile(filePath, 'utf8', (_, data) => {
    const jsonData = JSON.parse(data);
    jsonData[keyToReplace] = newValue;
    const updatedJson = JSON.stringify(jsonData, null, 2);
    fs.writeFile(filePath, updatedJson, 'utf8', (writeErr) => {});
  });
}

export function getJsonValue(filePath: string, key: string) {
  let value = '';
  fs.readFile(filePath, 'utf8', (_, data) => {
    const jsonData = JSON.parse(data);
    value = jsonData[key as string];
  });
  return value;
}
