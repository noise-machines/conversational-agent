const builder = require('botbuilder')
const searchSynonyms = require('./searchSynonyms')

const performSearchWithQuery = require('../../performSearchWithQuery')
const emptyQuery = {
  pageNumber: 1,
  pageSize: 5,
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
      session.endDialog()
    } else {
      // No valid terms were given so ask for an exact string
      searchPrompt(session)
    }
  },
  (session, results) => {
    if (results && results.response) {
      performSearchWithText(session, cleanSearchText(results.response))
    }
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('searchConcept', searchConcept)
}
