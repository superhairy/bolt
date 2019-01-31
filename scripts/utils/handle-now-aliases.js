const shell = require('shelljs');
const { TRAVIS } = require('./travis-vars');
let setCheckRun;

if (TRAVIS) {
  setCheckRun = require('../check-run');
}

let { NOW_TOKEN } = process.env;
const baseNowArgs = ['--platform-version=1', '--team=boltdesignsystem'];

if (NOW_TOKEN) baseNowArgs.push(`--token=${NOW_TOKEN}`);

async function aliasNowUrl(originalUrl, prefix) {
  console.log(
    'Creating now.sh alias off of the ' + originalUrl + ' deployment URL.',
  );
  const deployedUrl = originalUrl.trim();

  let aliasedUrl = `https://boltdesignsystem.com`;

  // passing an empty prefix will deploy to the main boltdesignsystem.com site
  if (prefix) {
    const normalizedUrlPrefix = prefix
      .replace(/\//g, '-') // `/` => `-`
      .replace('--', '-') // `--` => `-` now.sh subdomains can't have `--` for some reason
      .replace(/\./g, '-'); // `.` => `-`
    const normalizedUrlFull = `${encodeURIComponent(
      normalizedUrlPrefix,
    )}.boltdesignsystem`;

    aliasedUrl = `https://${normalizedUrlFull}.com`;
  }

  console.log(`Attempting to alias ${originalUrl} to ${aliasedUrl}...`);

  const aliasOutput = shell.exec(
    `now alias ${deployedUrl} ${aliasedUrl} --platform-version=1 --team=boltdesignsystem --token=${NOW_TOKEN}`,
  );

  if (aliasOutput.code !== 0) {
    console.log('Error aliasing:');
    console.log(aliasOutput.stdout, aliasOutput.stderr);

    if (setCheckRun) {
      await setCheckRun({
        status: 'completed',
        name: 'Deploy - now.sh',
        conclusion: 'failure',
        output: {
          title: 'Now.sh Deploy failure',
          summary: `
${aliasOutput.stdout}
${aliasOutput.stderr}
          `.trim(),
        },
      });
    }

    process.exit(1);
  } else {
    // console.log('Success Aliasing!');
    console.log(aliasOutput.stdout);
    // console.log(deployedUrl);
    // console.log(aliasedUrl);
    if (setCheckRun) {
      await setCheckRun({
        status: 'completed',
        name: 'Deploy - now.sh',
        conclusion: 'success',
        output: {
          title: 'Now.sh Deploy',
          summary: `
    - ${deployedUrl}
    - ${aliasedUrl}
          `.trim(),
        },
      });
    }
  }
}

module.exports = {
  aliasNowUrl,
};
