const searchHitAsCard = require('./searchHitAsCard')
const builder = require('botbuilder')

const renderSearchResponse = (session, response) => {
  if (response.results.length === 0) {
    session.send("Sorry, I didn't find any matches.")
  } else {
    // Save state
    const searchResponses = session.userData.searchResponses || []
    session.userData.searchResponses = [response, ...searchResponses]
    session.userData.queryOptions = response.queryOptions
    session.save()

    // Display results
    const cards = response.results.map(searchResult =>
      searchHitAsCard(session, true, searchResult)
    )
    const reply = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments(cards)
    session.send(reply)
    if (response.remainingResults > 0) {
      session.send(
        `There are ${
          response.remainingResults
        } more results. Say "more results" to see them.`
      )
    }
  }
}

module.exports = renderSearchResponse
