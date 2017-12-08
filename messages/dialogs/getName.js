const builder = require('botbuilder')
const isProbablyAmericanName = require('is-probably-american-name')

const getName = [
  session => {
    console.log('Prompting for name')
    builder.Prompts.text(session, 'Name, please?')
  },
  (session, results, next) => {
    const name = results.response
    console.log(name)
    const firstName = name.split(' ')[0]
    session.dialogData.name = name
    if (isProbablyAmericanName(firstName)) {
      session.dialogData.isProbablyAmericanName = true
      next()
    } else {
      builder.Prompts.confirm(
        session,
        `Just want to confirm. Your name is ${name}?`
      )
    }
  },
  (session, results) => {
    const userConfirmedName = results.response
    if (session.dialogData.isProbablyAmericanName || userConfirmedName) {
      session.endDialogWithResult({ response: session.dialogData.name })
    } else {
      session.send('Okay, no problem.')
      session.dialogData.name = null
      session.replaceDialog('getName')
    }
  }
]

module.exports = bot => {
  bot.dialog('getName', getName)
}