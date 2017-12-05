const moment = require('moment')

const restartTutorial = [
  session => {
    const firstMeeting = session.userData.firstMeeting
    session.send(
      `Alright, ${
        session.userData.name
      }. Let's go back in time, to the day we first met.`
    )
    const firstMeetingDay = moment(firstMeeting.dateTime).format(
      'dddd, MMMM Do YYYY'
    )
    const firstMeetingTime = moment(firstMeeting.dateTime).format('h:mm a')
    session.send(`Imagine it's ${firstMeetingDay}, at ${firstMeetingTime}.`)
    session.send(
      `You started off with ${firstMeeting.message.text}, then I said: `
    )
    session.beginDialog('tutorial')
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('restartTutorial', restartTutorial)
}
