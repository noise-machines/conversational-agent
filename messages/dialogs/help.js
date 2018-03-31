const help = [
  session => {
    session.send(
      `If you say "search machine learning" I'll show you concepts related to machine learning. You can search for other things too, of course.`
    )
    session.send(`You can also say "list" and I'll show your saved articles.`)
    session.send(
      `Or say "tutorial" and I'll be slightly miffed that you don't even remember the first time we met.`
    )
    session.send(
      'I also know how to handle a little small talk. I can respond to compliments, thank yous, and the like. I can also tell jokes.'
    )
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('help', help)
}
