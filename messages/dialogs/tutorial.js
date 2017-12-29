const builder = require('botbuilder')
const _ = require('lodash')
const searchHitAsCard = require('../searchHitAsCard')
const moment = require('moment')

const firstResults = [
  {
    key: 'fce9449f-980b-4d10-9877-68642e97f6b8',
    title: 'Leaf AI',
    description:
      'The Leaf Project is a group robot development program whose objective is to develop a robot platform that supports experiments with artificial intelligence, vision, navigation, etc.'
  },
  {
    key: 'a72f93d5-6e3d-467c-826c-3afe5db89ab8',
    title: 'Applications of AI',
    description:
      "Artificial intelligence, defined as intelligence exhibited by machines, has many applications in today's society."
  },
  {
    key: '84dd13f5-f96e-4bc7-b31e-60d8af34e282',
    title: 'AGI',
    description:
      'Artificial general intelligence (AGI) is the intelligence of a machine that could successfully perform any intellectual task that a human being can.'
  }
]

const moreResults = [
  {
    key: '565e06e4-fe84-466e-a4a5-70161d606508',
    title: 'Weak AI',
    description:
      'Weak artificial intelligence (weak AI), also known as narrow AI, is artificial intelligence that is focused on one narrow task.'
  },
  {
    key: 'eca086df-f4e0-4b2c-99e3-38290d89a8e9',
    title: 'AI-complete',
    description:
      'In the field of artificial intelligence, the most difficult problems are informally known as AI-complete or AI-hard, implying that the difficulty of these computational problems is equivalent to that of solving the central artificial intelligence problem—making computers as intelligent as people, or strong AI.'
  },
  {
    key: '45a61af8-1ee2-4202-b4d3-7a2c7961a6f6',
    title: 'Nouvelle AI',
    description:
      'Nouvelle artificial intelligence (AI) is an approach to artificial intelligence pioneered in the 1980s by Rodney Brooks, who was then part of MIT artificial intelligence laboratory.'
  }
]

const allSearchResults = [...firstResults, ...moreResults]

const tutorial = [
  session => {
    if (!session.userData.hasCompletedTutorial) {
      session.userData.firstMeeting = {
        message: session.message,
        dateTime: moment().toISOString()
      }
      session.save()
    }
    session.send({
      text: "Hi, I'm Neona. I simulate non-corporeal consciousness.",
      attachments: [
        {
          contentType: 'image/jpeg',
          contentUrl: 'https://i.imgur.com/Y4VYJaL.jpg',
          name: 'Neona'
        }
      ]
    })
    session.send('My purpose is to help you learn about A.I.')
    session.beginDialog('getName')
  },
  (session, results) => {
    session.userData.name = results.response
    session.save()
    session.send(
      `Okay ${
        session.userData.name
      }, let's do a tutorial real quick. I know it's annoying, but I'm going to railroad you for this part, so play along if you don't mind.`
    )
    builder.Prompts.heckleAndMoveOn(session, 'search ai', [
      'Try saying "search ai."',
      "I'm going to assume that was your best attempt at following my request."
    ])
  },
  session => {
    const cards = firstResults.map(searchResult =>
      searchHitAsCard(session, false, searchResult)
    )
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .text("Here's what my knowledge base has about A.I.")
      .attachments(cards)
    session.send(message)
    session.send(
      "I'll let you know when there are more results. Like now. There are more results."
    )
    session.send('')
    builder.Prompts.heckleAndMoveOn(session, 'more results', [
      'You can see them by saying "more results".',
      `Was that "more results"? Let's pretend it was.`
    ])
  },
  (session, results) => {
    const cards = moreResults.map(searchResult =>
      searchHitAsCard(session, true, searchResult)
    )
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments(cards)
    session.send(message)

    const expectedResponses = _.map(moreResults, 'key')
    builder.Prompts.railroad(session, expectedResponses, [
      'Try hitting save on one of those.',
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
        `We're still in the tutorial, so this is the part where you play along and say "list".`
      ],
      `Say "list", if you don't mind.`,
      'Thank you.'
    ])
  },
  session => {
    const isSavedResult = result =>
      result.key === session.dialogData.savedResultKey
    const savedResult = _.find(allSearchResults, isSavedResult)
    const card = searchHitAsCard(session, false, savedResult)
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments([card])
    session.send(message)
    session.send(
      "Okay, that's it. Feel free to search, save, and list to your heart's content."
    )
    session.send(
      'Oh, and say "help" to see my pre-recorded help message. If you want to do that all again, say "tutorial".'
    )
    session.userData.hasCompletedTutorial = true
    session.save()
    session.endDialog()
  }
]

module.exports = bot => {
  require('./getName')(bot)
  bot.dialog('tutorial', tutorial)
}
