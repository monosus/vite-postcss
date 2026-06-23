import { exec } from 'node:child_process';

function runCommand(command: string, commandName: string): Promise<void> {
  console.log(`Running command: ${commandName}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error (${commandName}): ${stdout} ${error}`);
        reject({ error, stdout, stderr });
        return;
      }
      if (stderr) {
        console.error(`Standard error (${commandName}): ${stderr}`);
        reject({ error: new Error(stderr), stdout, stderr });
        resolve();
        return;
      }
      console.log(`Standard output (${commandName}): ${stdout}`);
      resolve();
    });
  });
}

async function main() {
  const results = await Promise.allSettled([
    runCommand('bunx ls-lint -config ./lint-tools/.ls-lint.yml', 'ls-lint'),
    runCommand('bunx biome check --write .', 'biome'),
    runCommand(
      "bunx stylelint  'src/**/*.css' --config lint-tools/.stylelintrc.json --fix --allow-empty-input",
      'stylelint-fix',
    ),
    runCommand("bunx stylelint  'src/**/*.css' --config lint-tools/.stylelintrc.json --allow-empty-input", 'stylelint'),
    runCommand('bunx tsc --noEmit -p tsconfig.json', 'tsc'),
    runCommand('bunx markuplint --config lint-tools/.markuplintrc.yml "src/**/*.pug"', 'markuplint'),
    runCommand('bunx cspell --quiet -c ./lint-tools/cspell.jsonc src/**/*', 'cspell'),
    // runCommand(
    // 	"bunx markdownlint-cli2 --config \"./.markdownlint-cli2.jsonc\" \"./**/*.{md,mdx}\" --fix",
    // 	"markdownlint",
    // ),
  ]);

  const errors = results.filter((result) => result.status === 'rejected');

  if (errors.length > 0) {
    console.error('An error occurred:');
    for (const [index, error] of errors.entries()) {
      if ('reason' in error) {
        // console.log({...error.reason})
        const commandName = error.reason.error.cmd.split(' ')[1] || 'Unknown command'; // Get command name
        const fileName =
          error.reason.stderr.split('\n')[0] ||
          error.reason.stdout.split('\n')[0] ||
          error.reason.stderr.replace(/\n/g, '') ||
          'Unknown file'; // Get filename
        console.error(`Error ${index + 1}: Type: ${commandName}, Filename: ${fileName}`);
      }
    }
    process.exit(1); // Exits with a non-zero exit code if there are errors
  } else {
    console.log('ok 👍');
  }
}

main();
