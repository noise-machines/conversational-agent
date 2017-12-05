const builder = require('botbuilder')

// Sends all messages in messages, with the last one treated as a text prompt.
const multiMessageTextPrompt = (session, messages) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }

  messages.forEach((message, i) => {
    const isLast = i === messages.length - 1
    if (isLast) {
      builder.Prompts.text(session, message)
    } else {
      session.send(message)
    }
  })
}

const railroadPrompt = [
  (session, args) => {
    if (args.repromptCount == null) {
      args.repromptCount = 0
    }
    session.dialogData.args = args

    if (args.repromptCount === 0) {
      multiMessageTextPrompt(session, args.prompts[0])
    } else if (args.repromptCount === 1) {
      multiMessageTextPrompt(session, args.prompts[1])
    } else {
      multiMessageTextPrompt(session, args.prompts[2])
    }
  },
  (session, results) => {
    console.log(JSON.stringify(results))
    if (results.response === session.dialogData.args.expectedResponse) {
      session.endDialog()
    } else {
      session.dialogData.args.repromptCount += 1
      session.replaceDialog('railroadPrompt', session.dialogData.args)
    }
  }
]

const register = bot => {
  // Add your prompt as a dialog to your bot
  bot.dialog('railroadPrompt', railroadPrompt)

  // Add function for calling your prompt from anywhere
  builder.Prompts.railroad = (session, expectedResponse, prompts, options) => {
    var args = options || {}
    args.expectedResponse = expectedResponse
    args.prompts = prompts || options.prompts
    session.beginDialog('railroadPrompt', args)
  }
}

module.exports = register
