import yargs from 'yargs'

import { run } from './src/migration'
import { setup } from './src/versioning'

import { getEnvironment } from './src/contentful';

type RunArgv = {
  /** Non-option arguments */
  _: Array<string | number>;
  /** The script name or node command */
  $0: string;
} & {
  folder: string
}

const runCommand = (argv: RunArgv) => (async function () {

  const { CONTENT_MANAGEMENT_TOKEN, SPACE_ID, ENVIRONMENT_ID } = process.env;

  if (CONTENT_MANAGEMENT_TOKEN === undefined) {
    throw new Error('The environment variable "CONTENT_MANAGEMENT_TOKEN" is missing')
  }

  if (SPACE_ID === undefined) {
    throw new Error('The environment variable "SPACE_ID" is missing')
  }

  if (ENVIRONMENT_ID === undefined) {
    throw new Error('The environment variable "ENVIRONMENT_ID" is missing')
  }

  const environment = await getEnvironment(ENVIRONMENT_ID)

  if (environment === undefined) {
    throw new Error(`Environment ${ENVIRONMENT_ID} not found`)
  }

  await setup(environment)
  await run({
    accessToken: CONTENT_MANAGEMENT_TOKEN,
    spaceId: SPACE_ID,
    environment,
  }, argv.folder)

}()).catch((error) => {
  console.error(error)
  process.exit(1)
})

yargs
  .command('run <folder>', 'Run migrations', (yargs) => {
    yargs.positional('folder', {
      type: 'string',
      describe: 'Migration folder path'
    })
  }, runCommand)
  .help().alias('help', 'h')
  .demandCommand(1, '')
  .argv
