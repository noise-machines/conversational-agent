const performSearchWithQuery = require('../performSearchWithQuery')

const moreResults = [
  session => {
    if (session.userData.query) {
      session.userData.query.pageNumber++
      session.save()
      performSearchWithQuery(session, session.userData.query)
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
