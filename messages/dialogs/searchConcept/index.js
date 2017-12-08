const builder = require('botbuilder')
const searchSynonyms = require('./searchSynonyms')
const AzureSearch = require('./SearchProviders/azure-search')
var AzureSearchHelper = require('./SearchProviders/azure-search-helper')
const searchHitAsCard = require('../../searchHitAsCard')
// Maps the AzureSearch Job Document into a SearchHit that the Search Library can use
function conceptToSearchHit(concept) {
  return {
    key: concept.id,
    title: concept.title,
    description: concept.extract
  }
}

// Search
// TODO: Store keys in env variables
var AzureSearchClient = AzureSearch.create(
  'futurisma',
  process.env.AZURE_SEARCH_API_KEY,
  'aiconcept'
)

var conceptsResultsMapper = AzureSearchHelper.defaultResultsMapper(
  conceptToSearchHit
)

var searchSettings = {
  pageSize: 5,
  search: query => AzureSearchClient.search(query).then(conceptsResultsMapper)
}

const emptyQuery = {
  pageNumber: 1,
  pageSize: searchSettings.pageSize,
  filters: []
}

// TODO: Make sure not to replace things like 'search' if the user types 'find depth first search'
function cleanSearchText(searchText) {
  searchText = searchText.trim().toLowerCase()
  searchSynonyms.forEach(function(searchSynonym) {
    if (searchText.includes(searchSynonym)) {
      // Remove the search command so just the search terms are there
      searchText = searchText.replace(searchSynonym + ' ', '')
    }
  })
  return searchText.trim()
}

function performSearchWithText(session, searchText) {
  const query = Object.assign({}, emptyQuery, {
    searchText: searchText.trim()
  })
  session.userData.query = query
  session.save()
  performSearchWithQuery(session, query)
}

function performSearchWithQuery(session, query) {
  searchSettings.search(query).then(response => {
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

function searchPrompt(session) {
  builder.Prompts.text(session, 'What do you want to search for?')
}

const searchConcept = [
  session => {
    // Remove 'search' from in front of the actual search terms
    const searchText = cleanSearchText(session.message.text)
    // Handle case where someone enters in just 'search'. Should go to search prompt
    if (searchSynonyms.includes(searchText)) {
      searchPrompt(session)
      // If anything greater than a single character is left after replacements
    } else if (searchText && searchText.length > 1) {
      performSearchWithText(session, searchText)
    } else {
      // No valid terms were given so ask for an exact string
      searchPrompt(session)
    }
  },
  (session, results) => {
    if (results && results.response) {
      performSearchWithText(session, cleanSearchText(results.response))
    }
  }
]

module.exports = bot => {
  bot.dialog('searchConcept', searchConcept)
}
