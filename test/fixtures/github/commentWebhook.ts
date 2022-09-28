// There are duplicated string literals here, but they aren't related to each other and aren't magic strings
/* eslint-disable sonarjs/no-duplicate-string */
export type CommentWebhookParams = { body: string; login: string; org: string; repo: string }
export function getCommentWebhookPayload(params: CommentWebhookParams): string {
  return JSON.stringify({
    action: "created",
    issue: {
      url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4`,
      repository_url: `https://api.github.com/repos/${params.org}/${params.repo}`,
      labels_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4/labels{/name}`,
      comments_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4/comments`,
      events_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4/events`,
      html_url: `https://github.com/${params.org}/${params.repo}/pull/4`,
      id: 1359117232,
      node_id: "PR_kwDOHQICPM4-OcPh",
      number: 4,
      title: "Test PR",
      user: {
        login: params.login,
        id: 588262,
        node_id: "MDQ6VXNlcjU4ODI2Mg==",
        avatar_url: "https://avatars.githubusercontent.com/u/588262?v=4",
        gravatar_id: "",
        url: `https://api.github.com/users/${params.login}`,
        html_url: `https://github.com/${params.login}`,
        followers_url: `https://api.github.com/users/${params.login}/followers`,
        following_url: `https://api.github.com/users/${params.login}/following{/other_user}`,
        gists_url: `https://api.github.com/users/${params.login}/gists{/gist_id}`,
        starred_url: `https://api.github.com/users/${params.login}/starred{/owner}{/repo}`,
        subscriptions_url: `https://api.github.com/users/${params.login}/subscriptions`,
        organizations_url: `https://api.github.com/users/${params.login}/orgs`,
        repos_url: `https://api.github.com/users/${params.login}/repos`,
        events_url: `https://api.github.com/users/${params.login}/events{/privacy}`,
        received_events_url: `https://api.github.com/users/${params.login}/received_events`,
        type: "User",
        site_admin: false,
      },
      labels: [],
      state: "open",
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 2,
      created_at: "2022-09-01T16:32:21Z",
      updated_at: "2022-09-01T16:46:52Z",
      closed_at: null,
      author_association: "MEMBER",
      active_lock_reason: null,
      draft: false,
      pull_request: {
        url: `https://api.github.com/repos/${params.org}/${params.repo}/pulls/4`,
        html_url: `https://github.com/${params.org}/${params.repo}/pull/4`,
        diff_url: `https://github.com/${params.org}/${params.repo}/pull/4.diff`,
        patch_url: `https://github.com/${params.org}/${params.repo}/pull/4.patch`,
        merged_at: null,
      },
      body: null,
      reactions: {
        url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4/reactions`,
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      timeline_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4/timeline`,
      performed_via_github_app: null,
      state_reason: null,
    },
    comment: {
      url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/comments/1234532076`,
      html_url: `https://github.com/${params.org}/${params.repo}/pull/4#issuecomment-1234532076`,
      issue_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/4`,
      id: 1234532076,
      node_id: "IC_kwDOHQICPM5JlXbs",
      user: {
        login: `${params.login}`,
        id: 588262,
        node_id: "MDQ6VXNlcjU4ODI2Mg==",
        avatar_url: "https://avatars.githubusercontent.com/u/588262?v=4",
        gravatar_id: "",
        url: `https://api.github.com/users/${params.login}`,
        html_url: `https://github.com/${params.login}`,
        followers_url: `https://api.github.com/users/${params.login}/followers`,
        following_url: `https://api.github.com/users/${params.login}/following{/other_user}`,
        gists_url: `https://api.github.com/users/${params.login}/gists{/gist_id}`,
        starred_url: `https://api.github.com/users/${params.login}/starred{/owner}{/repo}`,
        subscriptions_url: `https://api.github.com/users/${params.login}/subscriptions`,
        organizations_url: `https://api.github.com/users/${params.login}/orgs`,
        repos_url: `https://api.github.com/users/${params.login}/repos`,
        events_url: `https://api.github.com/users/${params.login}/events{/privacy}`,
        received_events_url: `https://api.github.com/users/${params.login}/received_events`,
        type: "User",
        site_admin: false,
      },
      created_at: "2022-09-01T16:46:51Z",
      updated_at: "2022-09-01T16:46:51Z",
      author_association: "CONTRIBUTOR",
      body: params.body,
      reactions: {
        url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/comments/1234532076/reactions`,
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
      },
      performed_via_github_app: null,
    },
    repository: {
      id: 486670908,
      node_id: "R_kgDOHQICPA",
      name: `${params.repo}`,
      full_name: `${params.org}/${params.repo}`,
      private: true,
      owner: {
        login: `${params.org}`,
        id: 104585557,
        node_id: "O_kgDOBjvZVQ",
        avatar_url: "https://avatars.githubusercontent.com/u/104585557?v=4",
        gravatar_id: "",
        url: `https://api.github.com/users/${params.org}`,
        html_url: `https://github.com/${params.org}`,
        followers_url: `https://api.github.com/users/${params.org}/followers`,
        following_url: `https://api.github.com/users/${params.org}/following{/other_user}`,
        gists_url: `https://api.github.com/users/${params.org}/gists{/gist_id}`,
        starred_url: `https://api.github.com/users/${params.org}/starred{/owner}{/repo}`,
        subscriptions_url: `https://api.github.com/users/${params.org}/subscriptions`,
        organizations_url: `https://api.github.com/users/${params.org}/orgs`,
        repos_url: `https://api.github.com/users/${params.org}/repos`,
        events_url: `https://api.github.com/users/${params.org}/events{/privacy}`,
        received_events_url: `https://api.github.com/users/${params.org}/received_events`,
        type: "Organization",
        site_admin: false,
      },
      html_url: `https://github.com/${params.org}/${params.repo}`,
      description: null,
      fork: false,
      url: `https://api.github.com/repos/${params.org}/${params.repo}`,
      forks_url: `https://api.github.com/repos/${params.org}/${params.repo}/forks`,
      keys_url: `https://api.github.com/repos/${params.org}/${params.repo}/keys{/key_id}`,
      collaborators_url: `https://api.github.com/repos/${params.org}/${params.repo}/collaborators{/collaborator}`,
      teams_url: `https://api.github.com/repos/${params.org}/${params.repo}/teams`,
      hooks_url: `https://api.github.com/repos/${params.org}/${params.repo}/hooks`,
      issue_events_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/events{/number}`,
      events_url: `https://api.github.com/repos/${params.org}/${params.repo}/events`,
      assignees_url: `https://api.github.com/repos/${params.org}/${params.repo}/assignees{/user}`,
      branches_url: `https://api.github.com/repos/${params.org}/${params.repo}/branches{/branch}`,
      tags_url: `https://api.github.com/repos/${params.org}/${params.repo}/tags`,
      blobs_url: `https://api.github.com/repos/${params.org}/${params.repo}/git/blobs{/sha}`,
      git_tags_url: `https://api.github.com/repos/${params.org}/${params.repo}/git/tags{/sha}`,
      git_refs_url: `https://api.github.com/repos/${params.org}/${params.repo}/git/refs{/sha}`,
      trees_url: `https://api.github.com/repos/${params.org}/${params.repo}/git/trees{/sha}`,
      statuses_url: `https://api.github.com/repos/${params.org}/${params.repo}/statuses/{sha}`,
      languages_url: `https://api.github.com/repos/${params.org}/${params.repo}/languages`,
      stargazers_url: `https://api.github.com/repos/${params.org}/${params.repo}/stargazers`,
      contributors_url: `https://api.github.com/repos/${params.org}/${params.repo}/contributors`,
      subscribers_url: `https://api.github.com/repos/${params.org}/${params.repo}/subscribers`,
      subscription_url: `https://api.github.com/repos/${params.org}/${params.repo}/subscription`,
      commits_url: `https://api.github.com/repos/${params.org}/${params.repo}/commits{/sha}`,
      git_commits_url: `https://api.github.com/repos/${params.org}/${params.repo}/git/commits{/sha}`,
      comments_url: `https://api.github.com/repos/${params.org}/${params.repo}/comments{/number}`,
      issue_comment_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues/comments{/number}`,
      contents_url: `https://api.github.com/repos/${params.org}/${params.repo}/contents/{+path}`,
      compare_url: `https://api.github.com/repos/${params.org}/${params.repo}/compare/{base}...{head}`,
      merges_url: `https://api.github.com/repos/${params.org}/${params.repo}/merges`,
      archive_url: `https://api.github.com/repos/${params.org}/${params.repo}/{archive_format}{/ref}`,
      downloads_url: `https://api.github.com/repos/${params.org}/${params.repo}/downloads`,
      issues_url: `https://api.github.com/repos/${params.org}/${params.repo}/issues{/number}`,
      pulls_url: `https://api.github.com/repos/${params.org}/${params.repo}/pulls{/number}`,
      milestones_url: `https://api.github.com/repos/${params.org}/${params.repo}/milestones{/number}`,
      notifications_url: `https://api.github.com/repos/${params.org}/${params.repo}/notifications{?since,all,participating}`,
      labels_url: `https://api.github.com/repos/${params.org}/${params.repo}/labels{/name}`,
      releases_url: `https://api.github.com/repos/${params.org}/${params.repo}/releases{/id}`,
      deployments_url: `https://api.github.com/repos/${params.org}/${params.repo}/deployments`,
      created_at: "2022-04-28T16:32:02Z",
      updated_at: "2022-04-28T16:32:02Z",
      pushed_at: "2022-09-01T16:32:22Z",
      git_url: `git://github.com/${params.org}/${params.repo}.git`,
      ssh_url: `git@github.com:${params.org}/${params.repo}.git`,
      clone_url: `https://github.com/${params.org}/${params.repo}.git`,
      svn_url: `https://github.com/${params.org}/${params.repo}`,
      homepage: null,
      size: 4,
      stargazers_count: 0,
      watchers_count: 0,
      language: null,
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 3,
      license: null,
      allow_forking: false,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [],
      visibility: "private",
      forks: 0,
      open_issues: 3,
      watchers: 0,
      default_branch: "main",
    },
    organization: {
      login: `${params.org}`,
      id: 104585557,
      node_id: "O_kgDOBjvZVQ",
      url: `https://api.github.com/orgs/${params.org}`,
      repos_url: `https://api.github.com/orgs/${params.org}/repos`,
      events_url: `https://api.github.com/orgs/${params.org}/events`,
      hooks_url: `https://api.github.com/orgs/${params.org}/hooks`,
      issues_url: `https://api.github.com/orgs/${params.org}/issues`,
      members_url: `https://api.github.com/orgs/${params.org}/members{/member}`,
      public_members_url: `https://api.github.com/orgs/${params.org}/public_members{/member}`,
      avatar_url: "https://avatars.githubusercontent.com/u/104585557?v=4",
      description: null,
    },
    sender: {
      login: `${params.login}`,
      id: 588262,
      node_id: "MDQ6VXNlcjU4ODI2Mg==",
      avatar_url: "https://avatars.githubusercontent.com/u/588262?v=4",
      gravatar_id: "",
      url: `https://api.github.com/users/${params.login}`,
      html_url: `https://github.com/${params.login}`,
      followers_url: `https://api.github.com/users/${params.login}/followers`,
      following_url: `https://api.github.com/users/${params.login}/following{/other_user}`,
      gists_url: `https://api.github.com/users/${params.login}/gists{/gist_id}`,
      starred_url: `https://api.github.com/users/${params.login}/starred{/owner}{/repo}`,
      subscriptions_url: `https://api.github.com/users/${params.login}/subscriptions`,
      organizations_url: `https://api.github.com/users/${params.login}/orgs`,
      repos_url: `https://api.github.com/users/${params.login}/repos`,
      events_url: `https://api.github.com/users/${params.login}/events{/privacy}`,
      received_events_url: `https://api.github.com/users/${params.login}/received_events`,
      type: "User",
      site_admin: false,
    },
    installation: { id: 25299948, node_id: "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uMjUyOTk5NDg=" },
  })
}
