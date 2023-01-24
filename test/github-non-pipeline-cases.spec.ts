import { beforeAll, describe, expect, test } from "@jest/globals"
import { CompletedRequest, MockedEndpoint, requestHandlerDefinitions } from "mockttp"
import { ensureDefined } from "opstooling-js"

import { getRestFixtures } from "./fixtures"
import { getIssueCommentPayload } from "./fixtures/github/issueComments"
import { DetachedExpectation, triggerWebhook } from "./helpers"
import { initRepo, startGitDaemons } from "./setup/gitDaemons"
import { getMockServers } from "./setup/mockServers"

const restFixtures = getRestFixtures({
  github: {
    org: "paritytech-stg",
    repo: "command-bot-test",
    prAuthor: "somedev123",
    headBranch: "prBranch1",
    comments: [],
  },
  gitlab: { cmdBranch: "cmd-bot/4-1" },
})

const jsonResponseHeaders = { "content-type": "application/json" }

const mockedEndpoints: Record<string, MockedEndpoint> = {}

type CommandDataProviderItem = {
  suitName: string
  commandLine: string
  expected: {
    startMessage: string
  }
}
const commandsDataProvider: CommandDataProviderItem[] = [
  {
    suitName: "[help] command",
    commandLine: "bot help",
    expected: { startMessage: "Here's a [link to docs](http://localhost:3000/static/docs/" },
  },
  {
    suitName: "[wrong] command",
    commandLine: "bot hrlp", // intentional typo
    expected: {
      startMessage:
        '@somedev123 Could not find matching configuration for command "hrlp"; Available ones are bench, fmt, sample, try-runtime. Refer to [help docs](http://localhost:3000/static/docs/',
    },
  },
  {
    suitName: "[cancel] command for no jobs",
    commandLine: "bot cancel",
    expected: { startMessage: "@somedev123 No task is being executed for this pull request" },
  },
]

beforeAll(async () => {
  const gitDaemons = await startGitDaemons()

  await initRepo(gitDaemons.gitHub, "paritytech-stg", "command-bot-test.git", [])
  await initRepo(gitDaemons.gitHub, "somedev123", "command-bot-test.git", ["prBranch1"])
  await initRepo(gitDaemons.gitLab, "paritytech-stg", "command-bot-test.git", [])

  const mockServers = ensureDefined(getMockServers())

  await mockServers.gitHub
    .forPost("/app/installations/25299948/access_tokens")
    .thenReply(200, restFixtures.github.appInstallationToken, jsonResponseHeaders)

  await mockServers.gitHub.forGet("/organizations/123/members/somedev123").thenReply(204)

  await mockServers.gitHub
    .forGet("/repos/paritytech-stg/command-bot-test/pulls/4")
    .thenReply(200, restFixtures.github.pullRequest, jsonResponseHeaders)

  mockedEndpoints.pipeline = await mockServers.gitLab
    .forGet(/\/api\/v4\/projects\/paritytech-stg%2Fcommand-bot-test\/repository\/branches\/cmd-bot%2F4-\d+/)
    .thenReply(200, restFixtures.gitlab.branches, jsonResponseHeaders)
})

describe.each(commandsDataProvider)(
  "$suitName: Non pipeline scenario (GitHub webhook)",
  ({ suitName, commandLine, expected }) => {
    let commentThatBotLeft: {
      author: string
      body: string
      id: number
    } | null = null

    test("cmd-bot creates comment or ignores", async () => {
      const mockServers = ensureDefined(getMockServers())

      const de = new DetachedExpectation()

      mockedEndpoints.botComments = await mockServers.gitHub
        .forPost("/repos/paritytech-stg/command-bot-test/issues/4/comments")
        .thenCallback(async (request: CompletedRequest): Promise<requestHandlerDefinitions.CallbackResponseResult> => {
          const comment = (await request.body.getJson()) as { body: string }
          commentThatBotLeft = { author: "cmd-bot", body: comment.body, id: 555 }

          de.expect(() => {
            expect(commentThatBotLeft?.body).toMatch(expected?.startMessage || "")
          })

          return {
            body: getIssueCommentPayload({
              org: "paritytech-stg",
              repo: "command-bot-test",
              comment: commentThatBotLeft,
            }),
            headers: jsonResponseHeaders,
            status: 201,
          }
        })

      mockedEndpoints.botUpdatesComment = await mockServers.gitHub
        .forPatch("/repos/paritytech-stg/command-bot-test/issues/comments/555")
        .thenCallback(async (request: CompletedRequest) => {
          const comment = (await request.body.getJson()) as { body: string }
          const existingComment = ensureDefined(commentThatBotLeft)
          existingComment.body = comment.body
          return {
            body: getIssueCommentPayload({ org: "paritytech-stg", repo: "command-bot-test", comment: existingComment }),
            headers: jsonResponseHeaders,
            status: 200,
          }
        })

      await triggerWebhook("startCommandComment", { body: commandLine })
      await de.promise
    })
  },
)