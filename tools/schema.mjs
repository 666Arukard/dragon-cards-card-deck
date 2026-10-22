import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entry=process.env.DRAGON_CARDS_AJV_ENTRY
 ? pathToFileURL(path.resolve(process.env.DRAGON_CARDS_AJV_ENTRY)).href
 : 'ajv/dist/2020.js';
const {default:Ajv}=await import(entry);
const ajv=new Ajv({strict:true,allErrors:true,allowUnionTypes:true});
const schema=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.schema.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));
const validate=ajv.compile(schema);
if(!validate(catalog))throw Error(JSON.stringify(validate.errors,null,2));
const report={checkedOn:'2026-10-22',draft:'2020-12',validator:'Ajv 8.17.1',schemaValid:true,catalogValid:true};
fs.writeFileSync(path.join(root,'docs/schema-validation-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
