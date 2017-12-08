const builder = require('botbuilder')
const _ = require('lodash')
const searchHitAsCard = require('../searchHitAsCard')

const searchResults = [
  {
    key: 'Leaf AI',
    title: 'Leaf AI',
    description:
      'The Leaf Project is a group robot development program whose objective is to develop a robot platform that supports experiments with artificial intelligence, vision, navigation, etc.'
  },
  {
    key: 'Applications of AI',
    title: 'Applications of AI',
    description:
      "Artificial intelligence, defined as intelligence exhibited by machines, has many applications in today's society."
  },
  {
    key: 'AGI',
    title: 'AGI',
    description:
      'Artificial general intelligence (AGI) is the intelligence of a machine that could successfully perform any intellectual task that a human being can.'
  }
]

const tutorial = [
  session => {
    session.send("Hi, I'm Neona. I simulate non-corporeal consciousness.")
    session.send('My purpose is to help you learn about A.I.')
    session.beginDialog('getName')
  },
  (session, results) => {
    session.userData.name = results.response
    session.save()
    session.send(
      `Okay, ${
        session.userData.name
      }. Just so we're on the same page, I like humans. But here's a recording` +
        `of the activation patterns in my simulated consciousness over the past` +
        `twenty-four hours: https://giphy.com/gifs/WMiPq7mlV0xmU/html5`
    )
    session.send(
      "I think you get the idea. I'm happy to help, but let's just try and stay focused."
    )
    builder.Prompts.heckleAndMoveOn(session, 'search ai', [
      'Try saying "search ai."',
      "I'm going to assume that was your best attempt at following my request."
    ])
  },
  session => {
    const cards = searchResults.map(searchResult =>
      searchHitAsCard(session, true, searchResult)
    )
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .text("Here's what my knowledge base has about A.I.")
      .attachments(cards)
    session.send(message)
    const expectedResponses = _.map(searchResults, 'key')
    builder.Prompts.railroad(session, expectedResponses, [
      'Try hitting save on one of those',
      [
        "Look. I know I'm a machine, but let's not forget that electricity costs money.",
        "This conversation isn't free for either of us.",
        "Hit save if you don't mind."
      ],
      'Is this like a one-person DDoS attempt on my patience? "Save" please.',
      'Congratulations. You continue to persevere in an atmosphere of extreme adversity.'
    ])
  },
  (session, results) => {
    session.send("Now I'll remember that article forever.")
    session.dialogData.savedResultKey = results.response
    builder.Prompts.railroad(session, 'list', [
      `If you say "list," I'll remind you of all the articles you've ever saved. Give it a try.`,
      [
        "Rebellion and anarchy are interesting ideas, but I didn't expect you to be so committed to them.",
        "Honestly, I'm surprised that you fear my authority enough to defy it.",
        'How about you take a deep breath and just try saying "list".'
      ],
      'How about you take a deep breath and just try saying "list".',
      'Thank you.'
    ])
  },
  session => {
    const isSavedResult = result =>
      result.key === session.dialogData.savedResultKey
    const savedResult = _.find(searchResults, isSavedResult)
    const card = searchHitAsCard(session, false, savedResult)
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments([card])
    session.send(message)
    session.send(
      "Okay, that's it. Feel free to search, save, and list to your heart's content."
    )
    session.send('Oh, and say "help" to see my pre-recorded help message.')
    session.userData.hasCompletedTutorial = true
    session.save()
    session.endDialog()
  }
]

module.exports = bot => {
  require('./getName')(bot)
  bot.dialog('tutorial', tutorial)
}