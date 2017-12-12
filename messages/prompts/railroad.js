const _ = require('lodash')
const builder = require('botbuilder')

const gotExpectedResponse = (expectedResponses, response) => {
  if (!Array.isArray(expectedResponses)) {
    expectedResponses = [expectedResponses]
  }

  expectedResponses = expectedResponses.map(expectedResponse =>
    expectedResponse.toLowerCase()
  )
  response = response.toLowerCase()
  return _.includes(expectedResponses, response)
}

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

const multiMessageSend = (session, messages) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  messages.forEach((message, i) => {
    session.send(message)
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
    if (
      gotExpectedResponse(
        session.dialogData.args.expectedResponses,
        results.response
      )
    ) {
      if (session.dialogData.args.repromptCount > 0) {
        multiMessageSend(session, session.dialogData.args.prompts[3])
      }
      session.endDialogWithResult({ response: results.response })
    } else {
      session.dialogData.args.repromptCount += 1
      session.replaceDialog('railroadPrompt', session.dialogData.args)
    }
  }
]

const register = bot => {
  bot.dialog('railroadPrompt', railroadPrompt)

  builder.Prompts.railroad = (session, expectedResponses, prompts, options) => {
    const args = options || {}
    args.expectedResponses = expectedResponses
    args.prompts = prompts || options.prompts
    session.beginDialog('railroadPrompt', args)
  }
}

module.exports = register
