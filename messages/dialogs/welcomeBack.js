const moment = require('moment')

const countSavedArticles = ({ userData: { savedArticles } }) => {
  if (savedArticles) {
    return savedArticles.length
  } else {
    return 0
  }
}

const welcomeBack = [
  session => {
    const dayOfTheWeek = moment().format('dddd')
    session.send(
      `Hi ${session.userData.name}. Hope you're having a nice ${dayOfTheWeek}.`
    )
    session.send(
      `You have ${countSavedArticles(
        session
      )} articles saved. Remember you can "search" for new topics or "list" your saved articles.`
    )
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('welcomeBack', welcomeBack)
}
