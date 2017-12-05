const builder = require('botbuilder')

const heckleAndMoveOnPrompt = [
  (session, args) => {
    session.dialogData.args = args
    builder.Prompts.text(session, args.prompts[0])
  },
  (session, results) => {
    const gotExpectedResponse =
      results.response.toLowerCase() ===
      session.dialogData.args.expectedResponse.toLowerCase()
    if (gotExpectedResponse) {
      session.endDialog()
    } else {
      session.send(session.dialogData.args.prompts[1])
      session.endDialog()
    }
  }
]

const register = bot => {
  bot.dialog('heckleAndMoveOnPrompt', heckleAndMoveOnPrompt)

  // Add function for calling your prompt from anywhere
  builder.Prompts.heckleAndMoveOn = (
    session,
    expectedResponse,
    prompts,
    options
  ) => {
    var args = options || {}
    args.expectedResponse = expectedResponse
    args.prompts = prompts || options.prompts
    session.beginDialog('heckleAndMoveOnPrompt', args)
  }
}

module.exports = register
