const moment = require('moment')

const minutesBetweenPreviousAndCurrentMessage = (session, next) => {
  const currentMessageAt = moment()
  if (session.userData.currentMessageAt) {
    const previousMessageAt = moment(session.userData.currentMessageAt) // Used to be the current message, now it's the previous message
    session.userData.minutesBetweenPreviousAndCurrentMessage = moment().diff(
      previousMessageAt,
      'minutes'
    )
  } else {
    session.userData.minutesBetweenPreviousAndCurrentMessage = global.Infinity
  }
  session.userData.currentMessageAt = currentMessageAt.toISOString()
  session.save()
  next()
}

module.exports = minutesBetweenPreviousAndCurrentMessage
