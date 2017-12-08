/*-----------------------------------------------------------------------------
See package.json.

Inspired By:
+ http://docs.botframework.com/builder/node/guides/understanding-natural-language/
+ https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/demo-Search
-----------------------------------------------------------------------------*/

'use strict'
require('dotenv').config()
const _ = require('lodash')
const builder = require('botbuilder')
const botBuilderAzure = require('botbuilder-azure')
const restify = require('restify')
const moment = require('moment')
const {
  getJoke,
  getHowAreYou,
  getYoureWelcome,
  getCompliment,
  getThankYou,
  getIDontKnow,
  getCool,
  getHello,
  getSorry,
  getGoodbye,
  searchSynonyms,
  simpleHelpOptions
} = require('./utterances')
const useEmulator = process.env.NODE_ENV === 'development'
console.log('starting neona')
const connector = useEmulator
  ? new builder.ChatConnector()
  : new botBuilderAzure.BotServiceConnector({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD,
      stateEndpoint: process.env.BOT_STATE_ENDPOINT,
      openIdMetadata: process.env.BOT_OPEN_ID_METADATA
    })

const bot = new builder.UniversalBot(connector)

// Register custom prompts
require('./prompts/railroad')(bot)
require('./prompts/heckleAndMoveOn')(bot)

// Register dialogs
require('./dialogs/welcomeBack')(bot)
require('./dialogs/tutorial')(bot)
require('./dialogs/restartTutorial')(bot)

const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT)
const intents = new builder.IntentDialog({ recognizers: [recognizer] })
  // .matches('<myIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
  .onBegin((session, args, next) => {
    if (session.userData.hasCompletedTutorial) {
      session.beginDialog('welcomeBack')
    } else {
      session.userData.firstMeeting = {
        message: session.message,
        dateTime: moment().toISOString()
      }
      session.save()
      session.beginDialog('tutorial')
    }
  })
  .matches('Tutorial', (session, args, next) => {
    console.log('matched tutorial intent')
    session.beginDialog('restartTutorial')
  })

bot.dialog('/', intents)

/*
const searchQuestionText =
  "You can say *search* followed by the A.I. concept you're interested in and I'll see what I can find."
const introText =
  "I'm a really simple bot that defines artificial intelligence concepts. " +
  searchQuestionText

// Main dialog with LUIS
const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT)
// TODO: Make sure none of the se dialogues don't explicitly need an endDialog call
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
  .matches('SearchConcept', [
    function(session) {
      // Remove 'search' from in front of the actual search terms
      var searchText = cleanSearchText(session.message.text)
      // Handle case where someone enters in just 'search' should go to search prompt
      if (searchSynonyms.includes(searchText)) {
        searchPrompt(session)
        // If anything greater than a single character is left after replacements
      } else if (searchText && searchText.length > 1) {
        performSearchWithText(session, searchText)
      } else {
        // No valid terms were given so ask for an exact string
        searchPrompt(session)
      }
    },
    function(session, results) {
      if (results && results.response) {
        performSearchWithText(session, cleanSearchText(results.response))
      }
    }
  ])
  .matches('More', session => {
    if (session.userData.query) {
      session.send('Let me see what else I can find...')
      // Next Page
      session.userData.query.pageNumber++
      performSearchWithQuery(session, session.userData.query)
    } else {
      session.send(
        "Sorry. I don't remember you searching for anything so I can't show more results."
      )
    }
  })
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
  .onDefault((session, args) => {
    var query = args.query || session.userData.query || emptyQuery()
    var selection = args.selection || session.userData.selection || []
    session.userData.selection = selection
    session.userData.query = query

    var selectedKey = session.message.text
    var hit = null
    if (session.userData.searchResponse) {
      hit = _.find(session.userData.searchResponse.results, [
        'key',
        selectedKey
      ])
    }
    if (!hit) {
      // Un-recognized selection
      session.send(
        "Sorry, I did not understand '%s'. Type 'help' if you need assistance.",
        session.message.text
      )
    } else {
      // Add selection
      if (!_.find(selection, ['key', hit.key])) {
        selection.push(hit)
        session.userData.selection = selection
        // TODO: Test that this persists no matter what dialogues are called.
        session.save()
      }

      // Multi-select -> Continue?
      session.send('%s was added to your list!', hit.title)
    }
  })

bot.dialog('/', intents)
// Search
// TODO: Store keys in env variables
var AzureSearch = require('./SearchProviders/azure-search')
var AzureSearchClient = AzureSearch.create(
  'futurisma',
  'AB6A49BC44C7E4DD94615981EC60DB64',
  'aiconcept'
)
var AzureSearchHelper = require('./SearchProviders/azure-search-helper')

var conceptsResultsMapper = AzureSearchHelper.defaultResultsMapper(
  conceptToSearchHit
)
var searchSettings = {
  pageSize: 5,
  search: query => AzureSearchClient.search(query).then(conceptsResultsMapper)
}

function emptyQuery() {
  return { pageNumber: 1, pageSize: searchSettings.pageSize, filters: [] }
}

// TODO: Make sure not to replace things like 'search' if the user types 'find depth first search'
function cleanSearchText(searchText) {
  searchText = searchText.trim().toLowerCase()
  searchSynonyms.forEach(function(searchSynonym) {
    if (searchText.includes(searchSynonym)) {
      // Remove the search command so just the search terms are there
      searchText = searchText.replace(searchSynonym + ' ', '')
    }
  })
  return searchText.trim()
}

function performSearchWithText(session, searchText) {
  var query = Object.assign({}, emptyQuery(), { searchText: searchText.trim() })
  session.userData.query = query
  session.save()
  performSearchWithQuery(session, query)
}

function performSearchWithQuery(session, query) {
  searchSettings.search(query).then(response => {
    if (response.results.length === 0) {
      // No Results
      session.send("Sorry, I didn't find any matches.")
    } else {
      // Save state
      session.userData.searchResponse = response
      session.userData.query = query
      session.save()

      // Display results
      var results = response.results
      var reply = new builder.Message(session)
        .text('Here are a few good options I found:')
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(results.map(searchHitAsCard.bind(null, true)))
      session.send(reply)
      session.send(
        "You can select one or more to add to your list to study later, *list* what you've selected so far, see *more* results, or *search* again."
      )
    }
  })
}

function searchPrompt(session) {
  var prompt = 'What concept would you like to search for?'
  builder.Prompts.text(session, prompt)
}

function listAddedItems(session) {
  var selection = session.userData.selection || []
  if (selection.length === 0) {
    session.send('You have not added anything yet.')
  } else {
    var actions = selection.map(hit =>
      builder.CardAction.imBack(session, hit.title)
    )
    var message = new builder.Message(session)
      .text("Here's what you've added to your list so far:")
      .attachments(selection.map(searchHitAsCard.bind(null, false)))
      .attachmentLayout(builder.AttachmentLayout.list)
    session.send(message)
  }
}

function searchHitAsCard(showSave, searchHit) {
  var buttons = showSave
    ? [
        new builder.CardAction()
          .type('imBack')
          .title('Save')
          .value(searchHit.key)
      ]
    : []

  var card = new builder.HeroCard().title(searchHit.title).buttons(buttons)

  if (searchHit.description) {
    card.subtitle(searchHit.description)
  }

  if (searchHit.imageUrl) {
    card.images([new builder.CardImage().url(searchHit.imageUrl)])
  }

  return card
}

// Maps the AzureSearch Job Document into a SearchHit that the Search Library can use
function conceptToSearchHit(concept) {
  return {
    key: concept.id,
    title: concept.title,
    description: concept.extract
  }
}
*/
// Testing
if (useEmulator) {
  var emulatorServer = restify.createServer()
  emulatorServer.listen(3978, function() {
    console.log('using LUIS at ' + process.env.LUIS_ENDPOINT)
    console.log('test bot endpoint at http://localhost:3978/api/messages')
  })
  emulatorServer.post('/api/messages', connector.listen())
} else {
  module.exports = { default: connector.listen() }
}
