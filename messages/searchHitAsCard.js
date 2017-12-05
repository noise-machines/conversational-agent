const builder = require('botbuilder')

module.exports = function searchHitAsCard(session, showSave, searchHit) {
  var buttons = showSave
    ? [
        new builder.CardAction()
          .type('imBack')
          .title('Save')
          .value(searchHit.key)
      ]
    : []

  var card = new builder.HeroCard(session)
    .title(searchHit.title)
    .buttons(buttons)

  if (searchHit.description) {
    card.subtitle(searchHit.description)
  }

  if (searchHit.imageUrl) {
    card.images([builder.CardImage.create(session, searchHit.imageUrl)])
  }

  return card
}
