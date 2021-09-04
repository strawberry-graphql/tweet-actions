# Tweet actions

This repository includes a couple of actions that are used by Strawberry GraphQL
to send tweets when release are published to validate tweet messages.

## Read Tweet Action

This action reads a tweet from a file called `TWEET.md` if it exists. We use
this to get the text for the tweet **and** the text for the release card that we
send with the tweet.

If the file does not exist then we use a default message for the tweet and we
use the `changelog` for the release card.

As you can see, this is currently tightly coupled to Strawberry's workflow, but
we are happy to accept pull requests to make this more generic.

### Inputs

- `changelog`: The changelog for the release (in base64)
- `version`: The version of the release
- `contributor`: The name of the contributor of this release

### Outputs

- `tweet`: A base64 encoded text of the tweet. (It is base64 to prevent issues
  with newlines and potential remote code execution). Defaults to a hard-coded
  default message.
- `card-text`: The text that will be used in the tweet card, defaults to the
  `changelog`
- `has-tweet-file`: A boolean indicating if the tweet file exists.

The tweet file should look like this:

```markdown
This is an example tweet. $version was released by $contributor.

URL: $release_url
```

Or like this if we want a custom message inside the card:

```markdown
This is an example tweet. $version was released by $contributor.

URL: $release_url

---

This is the text that will be used in the tweet card.
```

### How to use it

```yaml
name: Validate Tweet

on:
  pull_request:

  read-tweet-md:
    name: Validate
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Validate tweet
        uses: strawberry-graphql/tweet-actions/validate-tweet@v1
        with:
          tweet: "dGhpcyBpcyBhIHR3ZWV0"
```

## Validate Tweet Action

This action validates that the tweet is valid according to Twitter's rules. It
uses [`twitter-text`](https://github.com/twitter/twitter-text) to validate the
tweet.

### Inputs

- `tweet`: The tweet to validate in base64.

### Outputs

This action has no outputs, but it will throw an error if the tweet is not
valid.

### How to use it

```yaml
name: Read Tweet

on:
  pull_request:

  read-tweet-md:
    name: Read TWEET.md
    runs-on: ubuntu-latest

    outputs:
      tweet: ${{ steps.extract.outputs.tweet }}
      card-text: ${{ steps.extract.outputs.card-text }}

    steps:
      - uses: actions/checkout@v2
      - name: Extract tweet message and changelog
        id: extract
        uses: strawberry-graphql/tweet-actions/read-tweet@v1
        with:
          changelog: "dGhpcyBpcyBhbiBleGFtcGxlIGNoYW5nZWxvZw=="
          version: "(next)"
          contributor_name: "Patrick"
```
