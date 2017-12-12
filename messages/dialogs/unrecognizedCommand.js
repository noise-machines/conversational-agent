const unrecognizedCommand = [
  session => {
    session.send(
      "Sorry, didn't catch that. Was working on a cost function for Calvinball: https://xkcd.com/1002/"
    )
    session.send('Maybe we can play some later.')
    session.send(
      `Don't forget you can use "search" to search for A.I. topics, or "list" to see the articles you've saved.`
    )
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('unrecognizedCommand', unrecognizedCommand)
}
