import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Using passkit-generator is the most common Node approach.
import { PKPass } from 'passkit-generator';

const repoRoot = path.resolve(process.cwd());
const walletDir = path.join(repoRoot, 'wallet');

const configPath = path.join(walletDir, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('Missing wallet/config.json. Create it by copying wallet/config.example.json');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const modelDir = path.join(walletDir, 'pass-model');
const certDir = path.join(walletDir, 'certs');

const passP12Path = path.join(certDir, 'pass.p12');
const wwdrPemPath = path.join(certDir, 'wwdr.pem');

if (!fs.existsSync(passP12Path)) {
  console.error('Missing wallet/certs/pass.p12 (Pass Type ID certificate exported as .p12)');
  process.exit(1);
}
if (!fs.existsSync(wwdrPemPath)) {
  console.error('Missing wallet/certs/wwdr.pem (Apple WWDR certificate PEM)');
  process.exit(1);
}

const p12Password = process.env.PASS_P12_PASSWORD || '';

// Output location inside the static site.
const outDir = path.join(repoRoot, 'static', 'passes');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'business-card.pkpass');

const pass = await PKPass.from(
  {
    model: modelDir,
    certificates: {
      wwdr: fs.readFileSync(wwdrPemPath),
      signerCert: fs.readFileSync(passP12Path),
      signerKey: fs.readFileSync(passP12Path),
      signerKeyPassphrase: p12Password
    }
  },
  {
    passTypeIdentifier: cfg.passTypeIdentifier,
    teamIdentifier: cfg.teamIdentifier,
    organizationName: cfg.organizationName,
    description: cfg.description,
    serialNumber: cfg.serialNumber,
    foregroundColor: cfg.foregroundColor,
    backgroundColor: cfg.backgroundColor,
    labelColor: cfg.labelColor
  }
);

// Simple generic pass layout
pass.primaryFields.push(
  { key: 'name', label: 'NAME', value: cfg.contact.name },
);
pass.secondaryFields.push(
  { key: 'title', label: 'TITLE', value: cfg.contact.title },
  { key: 'company', label: 'COMPANY', value: cfg.contact.company }
);
pass.auxiliaryFields.push(
  { key: 'phone', label: 'PHONE', value: cfg.contact.phone },
  { key: 'email', label: 'EMAIL', value: cfg.contact.email }
);

pass.barcodes = [
  {
    message: cfg.barcodeMessage,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1'
  }
];

pass.webServiceURL = cfg.webServiceURL || undefined;
pass.authenticationToken = cfg.authenticationToken || undefined;

const buffer = pass.getAsBuffer();
fs.writeFileSync(outPath, buffer);
console.log('Wrote:', path.relative(repoRoot, outPath));
