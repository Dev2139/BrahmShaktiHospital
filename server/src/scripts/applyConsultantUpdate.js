import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { newDoctors, newDoctorLeaves, newDepartments, additionalDoctorUsers } from '../data/newConsultants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Update server/src/data/seedData.js
const serverSeedPath = path.join(__dirname, '../data/seedData.js');
let serverContent = fs.readFileSync(serverSeedPath, 'utf8');

// Replace departmentsData
const deptStart = serverContent.indexOf('export const departmentsData = [');
const deptEnd = serverContent.indexOf('export const doctorsData = [');
if (deptStart !== -1 && deptEnd !== -1) {
  const newDeptStr = `export const departmentsData = ${JSON.stringify(newDepartments, null, 2)};\n\n`;
  serverContent = serverContent.substring(0, deptStart) + newDeptStr + serverContent.substring(deptEnd);
}

// Replace doctorsData
const docStart = serverContent.indexOf('export const doctorsData = [');
const docEnd = serverContent.indexOf('export const patientsData = [');
if (docStart !== -1 && docEnd !== -1) {
  const newDocStr = `export const doctorsData = ${JSON.stringify(newDoctors, null, 2)};\n\n`;
  serverContent = serverContent.substring(0, docStart) + newDocStr + serverContent.substring(docEnd);
}

// Append doctorLeavesData if not present
if (!serverContent.includes('export const doctorLeavesData =')) {
  serverContent += `\n\nexport const doctorLeavesData = ${JSON.stringify(newDoctorLeaves, null, 2)};\n`;
}

// Add doctor users to usersData if not present
if (!serverContent.includes('skgoyal@brahmshaktihospital.com')) {
  const usersStart = serverContent.indexOf('export const usersData = [');
  if (usersStart !== -1) {
    const usersInsertIdx = usersStart + 'export const usersData = ['.length;
    const additionalUsersStr = '\n' + additionalDoctorUsers.map(u => '  ' + JSON.stringify(u, null, 2)).join(',\n') + ',';
    serverContent = serverContent.substring(0, usersInsertIdx) + additionalUsersStr + serverContent.substring(usersInsertIdx);
  }
}

fs.writeFileSync(serverSeedPath, serverContent, 'utf8');
console.log('✓ Successfully updated server/src/data/seedData.js with 20 real consultants & leaves!');

// 2. Also update client/src/data/seedData.js
const clientSeedPath = path.resolve(__dirname, '../../../client/src/data/seedData.js');
if (fs.existsSync(clientSeedPath)) {
  let clientContent = fs.readFileSync(clientSeedPath, 'utf8');
  
  // Replace departmentsData
  const cDeptStart = clientContent.indexOf('export const departmentsData = [');
  const cDeptEnd = clientContent.indexOf('export const doctorsData = [');
  if (cDeptStart !== -1 && cDeptEnd !== -1) {
    const newDeptStr = `export const departmentsData = ${JSON.stringify(newDepartments, null, 2)};\n\n`;
    clientContent = clientContent.substring(0, cDeptStart) + newDeptStr + clientContent.substring(cDeptEnd);
  }
  
  // Replace doctorsData
  const cDocStart = clientContent.indexOf('export const doctorsData = [');
  const cDocEnd = clientContent.indexOf('export const patientServices = [') !== -1 
    ? clientContent.indexOf('export const patientServices = [') 
    : (clientContent.indexOf('export const hospitalStats = [') !== -1 ? clientContent.indexOf('export const hospitalStats = [') : clientContent.length);
  
  if (cDocStart !== -1) {
    const newDocStr = `export const doctorsData = ${JSON.stringify(newDoctors, null, 2)};\n\n`;
    clientContent = clientContent.substring(0, cDocStart) + newDocStr + clientContent.substring(cDocEnd);
  }

  // Append doctorLeavesData
  if (!clientContent.includes('export const doctorLeavesData =')) {
    clientContent += `\n\nexport const doctorLeavesData = ${JSON.stringify(newDoctorLeaves, null, 2)};\n`;
  }

  fs.writeFileSync(clientSeedPath, clientContent, 'utf8');
  console.log('✓ Successfully updated client/src/data/seedData.js!');
}
