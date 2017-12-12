const { searchWithQueryOptions } = require('../search')
const renderSearchResponse = require('../renderSearchResponse')

const moreResults = [
  session => {
    if (session.userData.queryOptions) {
      session.userData.queryOptions.pageNumber++
      session.save()
      searchWithQueryOptions(session.userData.queryOptions).then(response =>
        renderSearchResponse(session, response)
      )
    } else {
      session.send(
        "Sorry. I don't remember you searching for anything so I can't show more results."
      )
    }
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('moreResults', moreResults)
}
