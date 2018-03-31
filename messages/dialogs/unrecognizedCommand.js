const { searchWithText } = require('../search')
const builder = require('botbuilder')
const renderSearchResponse = require('../renderSearchResponse')

const handleSearchResponse = (session, response) => {
  const countResults = response.results.length
  if (countResults > 0) {
    session.dialogData.searchResponse = response
    const entries = countResults === 1 ? 'entry' : 'entries'
    builder.Prompts.confirm(
      session,
      `I'm not sure what you meant, but my knowledge base has ${countResults} ${entries} related to "${
        session.message.text
      }". Should I show them?`
    )
  } else {
    session.send({
      text:
        "Sorry, I didn't understand. Too busy thinking about a cost function for Calvinball.",
      attachments: [
        {
          contentType: 'image/png',
          contentUrl: 'https://imgs.xkcd.com/comics/game_ais.png',
          name: 'XKCD: Game AIs'
        }
      ]
    })
    session.send('Maybe we can play some later.')
    session.send(
      `Don't forget you can use "search" to search for A.I. topics, or "list" to see the articles you've saved.`
    )
    session.endDialog()
  }
}

const unrecognizedCommand = [
  session => {
    searchWithText(session.message.text).then(response => {
      handleSearchResponse(session, response)
    })
  },
  (session, results) => {
    if (results.response) {
      // User said to show search results
      renderSearchResponse(session, session.dialogData.searchResponse)
    } else {
      session.send(
        `Okay. Don't forget you can use "search" to search for A.I. topics, or "list" to see the articles you've saved.`
      )
    }
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('unrecognizedCommand', unrecognizedCommand)
}
