import assert from "assert"

import { botPullRequestCommentMention, botPullRequestIgnoreCommands } from "src/bot"
import { CancelCommand, GenericCommand, HelpCommand, ParsedCommand } from "src/bot/parse/ParsedCommand"
import { parseVariables } from "src/bot/parse/parseVariables"
import { fetchCommandsConfiguration, PIPELINE_SCRIPTS_REF } from "src/command-configs/fetchCommandsConfiguration"
import { LoggerContext } from "src/logger"
import { validateSingleShellCommand } from "src/shell"

export const parsePullRequestBotCommandLine = async (
  rawCommandLine: string,
  ctx: LoggerContext,
): Promise<undefined | Error | ParsedCommand> => {
  let commandLine = rawCommandLine.trim()

  // Add trailing whitespace so that bot can be differentiated from /cmd-[?]
  if (!commandLine.startsWith(`${botPullRequestCommentMention} `)) {
    return
  }

  // remove "bot "
  commandLine = commandLine.slice(botPullRequestCommentMention.length).trim()

  // get first word as a subcommand
  const subcommand = commandLine.split(" ")[0]

  if (!subcommand) {
    return new Error(`Must provide a subcommand in line ${rawCommandLine}.`)
  }

  // ignore some commands
  if (botPullRequestIgnoreCommands.includes(subcommand)) {
    return
  }

  commandLine = commandLine.slice(subcommand.length).trim()

  switch (subcommand) {
    case "help": {
      const str = commandLine.trim()
      const variables = await parseVariables(ctx, str)
      if (variables instanceof Error) {
        return variables
      }

      const { commitHash: commandsConfigsCommitHash } = await fetchCommandsConfiguration(
        ctx,
        variables[PIPELINE_SCRIPTS_REF],
      )

      return new HelpCommand(commandsConfigsCommitHash)
    }
    case "cancel": {
      return new CancelCommand(commandLine.trim())
    }
    default: {
      const commandStartSymbol = "$ "
      const [botOptionsLinePart, commandLinePart] = commandLine.split(commandStartSymbol)

      const variables = await parseVariables(ctx, botOptionsLinePart)

      if (variables instanceof Error) {
        return variables
      }

      const { commandConfigs: commandsConfiguration } = await fetchCommandsConfiguration(
        ctx,
        variables[PIPELINE_SCRIPTS_REF],
      )
      const configuration = commandsConfiguration[subcommand]?.command?.configuration

      if (typeof configuration === "undefined" || !Object.keys(configuration).length) {
        return new Error(
          `Could not find matching configuration ${subcommand}; available ones are ${Object.keys(
            commandsConfiguration,
          ).join(", ")}.`,
        )
      }

      // if presets has nothing - then it means that the command doesn't need any arguments and runs as is
      if (Object.keys(commandsConfiguration[subcommand]?.command?.presets || [])?.length === 0) {
        configuration.optionalCommandArgs = true
      }

      if (!commandLinePart && configuration.optionalCommandArgs !== true) {
        return new Error(`Could not find start of command ("${commandStartSymbol}")`)
      }

      assert(configuration.commandStart, "command start should exist")

      const command = await validateSingleShellCommand(ctx, [...configuration.commandStart, commandLinePart].join(" "))
      if (command instanceof Error) {
        return command
      }

      return new GenericCommand(subcommand, configuration, variables, command)
    }
  }
}