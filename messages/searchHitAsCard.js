const builder = require('botbuilder')

const truncate = (text, maxLength = 140) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3).trim() + '...'
  } else {
    return text
  }
}

module.exports = function searchHitAsCard(session, showSave, searchHit) {
  const buttons = showSave
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
    card.subtitle(truncate(searchHit.description))
  }

  if (searchHit.imageUrl) {
    card.images([builder.CardImage.create(session, searchHit.imageUrl)])
  }

  return card
}
