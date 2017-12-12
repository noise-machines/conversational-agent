/* -----------------------------------------------------------------------------
See package.json.

Inspired By:
+ http://docs.botframework.com/builder/node/guides/understanding-natural-language/
+ https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/demo-Search
----------------------------------------------------------------------------- */

'use strict'
require('dotenv').config()
const _ = require('lodash')
const builder = require('botbuilder')
const botBuilderAzure = require('botbuilder-azure')
const restify = require('restify')
const minutesBetweenPreviousAndCurrentMessage = require('./middleware/minutesBetweenPreviousAndCurrentMessage')
// const {
//   getJoke,
//   getHowAreYou,
//   getYoureWelcome,
//   getCompliment,
//   getThankYou,
//   getIDontKnow,
//   getCool,
//   getHello,
//   getSorry,
//   getGoodbye,
//   searchSynonyms,
//   simpleHelpOptions
// } = require('./utterances')
const useEmulator = process.env.NODE_ENV === 'development'

const connector = useEmulator
  ? new builder.ChatConnector()
  : new botBuilderAzure.BotServiceConnector({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD,
      stateEndpoint: process.env.BOT_STATE_ENDPOINT,
      openIdMetadata: process.env.BOT_OPEN_ID_METADATA
    })

const TIMEOUT_IN_MINUTES = 10
const bot = new builder.UniversalBot(connector)

bot.use({
  botbuilder: [
    // Middleware that intercepts incoming messages once they've been bound to a session
    minutesBetweenPreviousAndCurrentMessage
  ]
})

// Register custom prompts
require('./prompts/railroad')(bot)
require('./prompts/heckleAndMoveOn')(bot)

// Register dialogs
require('./dialogs/welcomeBack')(bot)
require('./dialogs/tutorial')(bot)
require('./dialogs/restartTutorial')(bot)
require('./dialogs/help')(bot)
require('./dialogs/searchConcept')(bot)
require('./dialogs/moreResults')(bot)
require('./dialogs/list')(bot)
require('./dialogs/unrecognizedCommand')(bot)

const trySaveArticle = (session, args) => {
  const queryOptions = args.queryOptions || session.userData.queryOptions
  const savedArticles =
    args.savedArticles || session.userData.savedArticles || []
  session.userData.savedArticles = savedArticles
  session.userData.queryOptions = queryOptions

  const selectedKey = session.message.text
  var hit = null
  if (session.userData.searchResponse) {
    hit = _.find(session.userData.searchResponse.results, { key: selectedKey })
  }
  // Couldn't find the key in the latest search results, so don't save anything.
  if (!hit) {
    return false
  }
  const hitWasAlreadySaved = _.find(savedArticles, { key: hit.key })
  if (hitWasAlreadySaved) {
    session.send(
      `You already saved ${
        hit.title
      }. Say "list" to see the articles you've already saved.`
    )
    return true
  }
  const shouldSaveArticle = !hitWasAlreadySaved
  if (shouldSaveArticle) {
    savedArticles.push(hit)
    session.userData.savedArticles = savedArticles
    session.save()
    const articles = savedArticles.length === 1 ? 'article' : 'articles'
    session.send(
      `Got it. That's ${savedArticles.length} ${articles} saved so far.`
    )
  }
  return shouldSaveArticle
}

const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT)
const intents = new builder.IntentDialog({ recognizers: [recognizer] })
  // .matches('<myIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
  .onBegin((session, args, next) => {
    const didTimeout =
      session.userData.minutesBetweenPreviousAndCurrentMessage >
      TIMEOUT_IN_MINUTES
    if (!session.userData.hasCompletedTutorial) {
      session.beginDialog('tutorial')
    } else if (didTimeout) {
      session.beginDialog('welcomeBack')
      // next()
    } else {
      next()
    }
  })
  .matches('Tutorial', (session, args, next) => {
    session.beginDialog('restartTutorial')
  })
  .matches('Help', (session, args, next) => {
    session.beginDialog('help')
  })
  .matches('SearchConcept', (session, args, next) => {
    session.beginDialog('searchConcept')
  })
  .matches('More', session => {
    session.beginDialog('moreResults')
  })
  .matches('List', session => {
    session.beginDialog('list')
  })
  .onDefault((session, args) => {
    const didSave = trySaveArticle(session, args)
    if (!didSave) {
      session.beginDialog('unrecognizedCommand')
    }
  })

bot.dialog('/', intents)

/*
// Main dialog with LUIS
const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT)
// TODO: Make sure none of these dialogues don't explicitly need an endDialog call
// TODO: Make sure none of the session.sends don't need to be preceded by a return
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
  // .matches('<myIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
  .onBegin((session, args, next) => {
    if (!session.userData.introduced) {
      session.send(getHello() + ' ' + introText)
      session.userData.introduced = true
      session.save()
    } else {
      next()
    }
  })
  .matches('Hello', (session, args, next) => {
    session.send(getHello() + ' ' + introText)
    session.userData.introduced = true
    session.save()
  })
  // TODO: Extract concepts from search query as entities
  // TODO: Show search prompt if no concepts were provided, just search command
  // TODO: Handle multiple search commands like define, find, or what is
  // TODO: Don't find and replace 'search' since someone could say things like "define depth first search"
  .matches('List', session => listAddedItems(session))
  .matches('Help', session => {
    builder.Prompts.choice(
      session,
      "Ok. With me, you've got to keep it simple. Here are some examples of what I can understand:",
      simpleHelpOptions,
      { maxRetries: 0 }
    )
    session.endDialog()
  })
  .matches('Compliment', (session, args) => {
    session.send(getCompliment())
  })
  .matches('HowAreYou?', (session, args) => {
    session.send(getHowAreYou())
  })
  .matches('Joke', (session, args) => {
    session.send(getJoke())
  })
  .matches('YoureWelcome', (session, args) => {
    session.send(getYoureWelcome())
  })
  .matches('Goodbye', (session, args) => {
    session.send(getGoodbye())
  })
  .matches('Sorry', (session, args) => {
    session.send(getSorry())
  })
  .matches('Cool', (session, args) => {
    session.send(getCool())
  })
  .matches('ThankYou', (session, args) => {
    session.send(getThankYou())
  })
  .matches('IDontKnow', (session, args) => {
    session.send(getIDontKnow())
  })
  .matches(
    'WhoAreYou?',
    builder.DialogAction.send(
      "I'm Futurisma, a conversational agent that teaches people about artificial intelligence."
    )
  )

bot.dialog('/', intents)
*/

// Testing
if (useEmulator) {
  var emulatorServer = restify.createServer()
  emulatorServer.listen(3978, () => {
    console.log('Using LUIS endpoint ' + process.env.LUIS_ENDPOINT)
    console.log('Test bot endpoint at http://localhost:3978/api/messages')
  })
  emulatorServer.post('/api/messages', connector.listen())
} else {
  module.exports = { default: connector.listen() }
}
