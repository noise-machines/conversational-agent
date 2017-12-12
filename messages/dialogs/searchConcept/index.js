const builder = require('botbuilder')
const searchSynonyms = require('./searchSynonyms')
const renderSearchResponse = require('../../renderSearchResponse')
const { searchWithText } = require('../../search')

// TODO: Make sure not to replace things like 'search' if the user types 'find depth first search'
const cleanSearchText = searchText => {
  searchText = searchText.trim().toLowerCase()
  searchSynonyms.forEach(searchSynonym => {
    if (searchText.includes(searchSynonym)) {
      // Remove the search command so just the search terms are there
      searchText = searchText.replace(searchSynonym + ' ', '')
    }
  })
  return searchText.trim()
}

const searchPrompt = session => {
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
      searchWithText(searchText).then(response =>
        renderSearchResponse(session, response)
      )
      session.endDialog()
    } else {
      // No valid terms were given so ask for an exact string
      searchPrompt(session)
    }
  },
  (session, results) => {
    if (results && results.response) {
      const text = cleanSearchText(results.response)
      searchWithText(text).then(response =>
        renderSearchResponse(session, response)
      )
    }
    session.endDialog()
  }
]

module.exports = bot => {
  bot.dialog('searchConcept', searchConcept)
}
