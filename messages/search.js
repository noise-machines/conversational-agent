const AzureSearch = require('./SearchProviders/azure-search')
var AzureSearchHelper = require('./SearchProviders/azure-search-helper')

const defaultQueryOptions = {
  pageNumber: 1,
  pageSize: 5,
  filters: []
}

const AzureSearchClient = AzureSearch.create(
  'futurisma',
  process.env.AZURE_SEARCH_API_KEY,
  'aiconcept'
)

// Maps the AzureSearch Job Document into a SearchHit that the Search Library can use
const conceptToSearchHit = concept => ({
  key: concept.id,
  title: concept.title,
  description: concept.extract
})

const conceptsResultsMapper = AzureSearchHelper.defaultResultsMapper(
  conceptToSearchHit
)

const searchWithQueryOptions = queryOptions => {
  queryOptions = Object.assign({}, defaultQueryOptions, queryOptions)
  return AzureSearchClient.search(queryOptions)
    .then(conceptsResultsMapper)
    .then(response => {
      return Object.assign({}, response, { queryOptions: queryOptions })
    })
}

const searchWithText = searchText => {
  return searchWithQueryOptions({
    searchText: searchText.trim()
  })
}

module.exports.searchWithQueryOptions = searchWithQueryOptions
module.exports.searchWithText = searchWithText
