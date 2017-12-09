const searchHitAsCard = require('../searchHitAsCard')
const builder = require('botbuilder')

const list = [
  session => {
    const savedArticles = session.userData.savedArticles || []
    if (savedArticles.length === 0) {
      session.send("You haven't saved anything yet.")
    } else {
      const cards = savedArticles.map(article =>
        searchHitAsCard(session, false, article)
      )
      const message = new builder.Message(session)
        .attachments(cards)
        .attachmentLayout(builder.AttachmentLayout.list)
      session.send(message)
      session.endDialog()
    }
  }
]

module.exports = bot => {
  bot.dialog('list', list)
}
