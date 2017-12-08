const builder = require('botbuilder')
const AzureSearch = require('./SearchProviders/azure-search')
var AzureSearchHelper = require('./SearchProviders/azure-search-helper')
const searchHitAsCard = require('./searchHitAsCard')

var AzureSearchClient = AzureSearch.create(
  'futurisma',
  process.env.AZURE_SEARCH_API_KEY,
  'aiconcept'
)

// Maps the AzureSearch Job Document into a SearchHit that the Search Library can use
function conceptToSearchHit(concept) {
  return {
    key: concept.id,
    title: concept.title,
    description: concept.extract
  }
}

var conceptsResultsMapper = AzureSearchHelper.defaultResultsMapper(
  conceptToSearchHit
)

const search = query =>
  AzureSearchClient.search(query).then(conceptsResultsMapper)

function performSearchWithQuery(session, query) {
  search(query).then(response => {
    if (response.results.length === 0) {
      session.send("Sorry, I didn't find any matches.")
    } else {
      // Save state
      session.userData.searchResponse = response
      session.userData.query = query
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
  })
}

module.exports = performSearchWithQuery
