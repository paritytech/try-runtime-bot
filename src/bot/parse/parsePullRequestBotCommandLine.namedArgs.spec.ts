import { jest } from "@jest/globals";

import { CancelCommand, CleanCommand, GenericCommand, HelpCommand, ParsedCommand } from "src/bot/parse/ParsedCommand";
import { parsePullRequestBotCommandLine } from "src/bot/parse/parsePullRequestBotCommandLine";
import { SkipEvent } from "src/bot/types";
import { logger } from "src/logger";

jest.mock("src/command-configs/fetchCommandsConfiguration");
jest.mock("src/db");

logger.options.minLogLevel = "fatal";

type DataProvider = {
  suitName: string;
  commandLine: string;
  expectedResponse: SkipEvent | ParsedCommand | Error;
};

const dataProvider: DataProvider[] = [
  {
    suitName: "bench-bot",
    commandLine: "bot bench polkadot-pallet --pallet=pallet_referenda",
    expectedResponse: new GenericCommand(
      "bench",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/bench/bench.sh"'],
        gitlab: { job: { tags: ["bench-bot"], variables: {} } },
      },
      {},
      '"$PIPELINE_SCRIPTS_DIR/commands/bench/bench.sh" --subcommand=runtime --runtime=polkadot --dir=polkadot --pallet=pallet_referenda',
    ),
  },
  {
    suitName: "unrelated to bot comment returns nothing (ignores)",
    commandLine: "something from comments",
    expectedResponse: new SkipEvent("Not a command"),
  },
  {
    suitName: "try-runtime-bot with default preset mentioned explicitly",
    commandLine: "bot try-runtime -v RUST_LOG=remote-ext=debug,runtime=trace -v SECOND=val default --network=kusama",
    expectedResponse: new GenericCommand(
      "try-runtime",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh"'],
        gitlab: { job: { tags: ["linux-docker-vm-c2"], variables: {} } },
      },
      { RUST_LOG: "remote-ext=debug,runtime=trace", SECOND: "val" },
      '"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh" --network=kusama',
    ),
  },
  {
    suitName: "try-runtime-bot testing default without mentioning preset name",
    commandLine: "bot try-runtime -v RUST_LOG=remote-ext=debug,runtime=trace -v SECOND=val --network=kusama",
    expectedResponse: new GenericCommand(
      "try-runtime",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh"'],
        gitlab: { job: { tags: ["linux-docker-vm-c2"], variables: {} } },
      },
      { RUST_LOG: "remote-ext=debug,runtime=trace", SECOND: "val" },
      '"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh" --network=kusama',
    ),
  },
  {
    suitName: "try-runtime-bot testing default without any args",
    commandLine: "bot try-runtime",
    expectedResponse: new GenericCommand(
      "try-runtime",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh"'],
        gitlab: { job: { tags: ["linux-docker-vm-c2"], variables: {} } },
      },
      {},
      '"$PIPELINE_SCRIPTS_DIR/commands/try-runtime/try-runtime.sh" --network=polkadot',
    ),
  },
  {
    suitName: "fmt, no args should be allowed and return config",
    commandLine: "bot fmt",
    expectedResponse: new GenericCommand(
      "fmt",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/fmt/fmt.sh"'],
        gitlab: { job: { tags: ["linux-docker-vm-c2"], variables: {} } },
      },
      {},
      '"$PIPELINE_SCRIPTS_DIR/commands/fmt/fmt.sh"',
    ),
  },
  {
    suitName: "fmt, no args should be allowed and return config",
    commandLine: "bot fmt -v RUST_LOG=remote-ext=debug,runtime=trace -v SECOND=val",
    expectedResponse: new GenericCommand(
      "fmt",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/fmt/fmt.sh"'],
        gitlab: { job: { tags: ["linux-docker-vm-c2"], variables: {} } },
      },
      { RUST_LOG: "remote-ext=debug,runtime=trace", SECOND: "val" },
      '"$PIPELINE_SCRIPTS_DIR/commands/fmt/fmt.sh"',
    ),
  },
  {
    suitName: "command, with dev branch should add properly",
    commandLine: "bot sample -v PIPELINE_SCRIPTS_REF=dev-branch -v SECOND=val --input=bla",
    expectedResponse: new GenericCommand(
      "sample",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/sample/sample.sh"'],
        gitlab: { job: { tags: ["kubernetes-parity-build"], variables: {} } },
      },
      { SECOND: "val", PIPELINE_SCRIPTS_REF: "dev-branch" },
      '"$PIPELINE_SCRIPTS_DIR/commands/sample/sample.sh" --input=bla',
    ),
  },
  {
    suitName: "command, with dev branch should add properly",
    commandLine: "bot sample -v SECOND=val --input=bla",
    expectedResponse: new GenericCommand(
      "sample",
      {
        commandStart: ['"$PIPELINE_SCRIPTS_DIR/commands/sample/sample.sh"'],
        gitlab: { job: { tags: ["kubernetes-parity-build"], variables: {} } },
      },
      { SECOND: "val" },
      '"$PIPELINE_SCRIPTS_DIR/commands/sample/sample.sh" --input=bla',
    ),
  },

  /*
    Help cases
   */
  {
    suitName: "help",
    commandLine: "bot help",
    expectedResponse: new HelpCommand("http://cmd-bot.docs.com/static/docs/latest.html"),
  },
  { suitName: "clean", commandLine: "bot clean", expectedResponse: new CleanCommand() },
  { suitName: "clear", commandLine: "bot clear", expectedResponse: new CleanCommand() },

  /*
    Cancel cases
   */
  { suitName: "cancel no-taskId", commandLine: "bot cancel", expectedResponse: new CancelCommand("") },
  { suitName: "cancel with taskId", commandLine: "bot cancel 123123", expectedResponse: new CancelCommand("123123") },

  /*
     Ignore cases
      */
  {
    suitName: "empty command line returns nothing (ignores)",
    commandLine: "",
    expectedResponse: new SkipEvent("Not a command"),
  },
  { suitName: "no subcommand - ignore", commandLine: "bot ", expectedResponse: new SkipEvent("Not a command") },
  { suitName: "ignored command", commandLine: "bot merge", expectedResponse: new SkipEvent("Ignored command: merge") },
  {
    suitName: "ignored command 2",
    commandLine: "bot rebase",
    expectedResponse: new SkipEvent("Ignored command: rebase"),
  },

  /*
    Expected Error cases
   */
  {
    suitName: "bench-bot, no args when not allowed, should return error",
    commandLine: "bot bench",
    expectedResponse: new Error(
      `Missing arguments for command "bench". Refer to [help docs](http://cmd-bot.docs.com/static/docs/latest.html) and/or [source code](https://github.com/paritytech/command-bot-scripts).`,
    ),
  },
  {
    suitName: "sample without required arg should return error",
    commandLine: "bot sample",
    expectedResponse: new Error("required option '--input <value>' not specified"),
  },
  {
    suitName: "check wrong set -v, validation should trigger error",
    commandLine: "bot bench -v SOME_VAR runtime ",
    expectedResponse: new Error(
      `option '-v, --variable [value]' argument 'SOME_VAR' is invalid. SOME_VAR is not in KEY=value format`,
    ),
  },
  {
    suitName: "nonexistent command, should return proper error",
    commandLine: "bot nope 123123",
    expectedResponse: new Error(
      'Unknown command "nope"; Available ones are bench-all, bench-vm, bench, fmt, merge, rebase, sample, try-runtime. Refer to [help docs](http://cmd-bot.docs.com/static/docs/latest.html) and/or [source code](https://github.com/paritytech/command-bot-scripts).',
    ),
  },
  {
    suitName: "not provided command, returns proper error",
    commandLine: "bot $",
    expectedResponse: new Error(
      'Unknown command "$"; Available ones are bench-all, bench-vm, bench, fmt, merge, rebase, sample, try-runtime. Refer to [help docs](http://cmd-bot.docs.com/static/docs/latest.html) and/or [source code](https://github.com/paritytech/command-bot-scripts).',
    ),
  },
  {
    suitName: "non existed config must return error with explanation",
    commandLine: "bot xz",
    expectedResponse: new Error(
      `Unknown command "xz"; Available ones are bench-all, bench-vm, bench, fmt, merge, rebase, sample, try-runtime. Refer to [help docs](http://cmd-bot.docs.com/static/docs/latest.html) and/or [source code](https://github.com/paritytech/command-bot-scripts).`,
    ),
  },
  {
    suitName: "non existed config must return error with explanation",
    commandLine: "bot bench $ pallet dev some_pallet",
    expectedResponse: new Error(
      `Positioned arguments are not supported anymore. \nUse \`bot help\` to find out how to run your command. \nI guess you meant \`bench polkadot-pallet --pallet=pallet_name\``,
    ),
  },
  {
    suitName: "non existed config must return error with explanation",
    commandLine: "bot bench $ overhead kusama-dev",
    expectedResponse: new Error(
      `Positioned arguments are not supported anymore. \nUse \`bot help\` to find out how to run your command. \nI guess you meant \`bench polkadot-overhead\``,
    ),
  },
];

describe("parsePullRequestBotCommandLine", () => {
  for (const { suitName, commandLine, expectedResponse } of dataProvider) {
    test(`test commandLine: ${commandLine} [${suitName}]`, async () => {
      const res = await parsePullRequestBotCommandLine(commandLine, { logger }, "polkadot");
      expect(res).toEqual(expectedResponse);
    });
  }
});
