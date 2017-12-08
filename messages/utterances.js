const jokes = [
  // Mitch Hedberg https://en.wikiquote.org/wiki/Mitch_Hedberg
  'Is a hippopotamus a hippopotamus? Or just a really cool opotamus?',
  'A dog is forever in the push-up position.',
  "I'm sick of following my dreams, I'm going to ask them where they're going and hook up with them later.",
  "Every book is a children's book if the kid can read.",
  'I like escalators, because an escalator can never break; it can only become stairs.',
  'I like rice. Rice is great if you want to eat 2,000 of something.',
  "This is what my friend said to me, he said “I think the weather's trippy.” And I said “No, man. It's not the weather that's trippy. Perhaps it is the way that we perceive it that is indeed trippy.” Then I thought, “Man, I should have just said… 'Yeah.'”",
  "My apartment is infested with koala bars. It's the cutest infestation ever. Way better than cockroaches. When I turn on the light, a bunch of koala bears scatter. And I don't want 'em to. I'm like, “Hey, hold on fellas. Let me hold one of you.”",
  'Wearing a turtleneck is like being strangled by a really weak guy… all day. ',
  'I think foosball is a combination of soccer and shish kabobs.',
  // Demetri Martin https://www.brainyquote.com/quotes/authors/d/demetri_martin.html
  'The digital camera is a great invention because it allows us to reminisce. Instantly.',
  "I think it's interesting that 'cologne' rhymes with 'alone.'",
  'Employee of the month is a good example of how somebody can be both a winner and a loser at the same time.',
  'Another term for balloon is bad breath holder.',
  "I like fruit baskets because it gives you the ability to mail someone a piece of fruit without appearing insane. Like, if someone just mailed you an apple you'd be like, 'huh? What the heck is this?' But if it's in a fruit basket you're like, 'this is nice!'",
  "A drunk driver is very dangerous. So is a drunk backseat driver if he's persuasive.",
  'The worst time to have a heart attack is during a game of charades.',
  'The bird, the bee, the running child are all the same to the sliding glass door.',
  "I wonder what the most intelligent thing ever said was that started with the word 'dude.' 'Dude, these are isotopes.' 'Dude, we removed your kidney. You're gonna be fine.' 'Dude, I am so stoked to win this Nobel Prize. I just wanna thank Kevin, and Turtle, and all my homies.'",
  'If you have a pear-shaped body, you should not wear pear-colored clothes or act juicy.',
  "The easiest time to add insult to injury is when you're signing somebody's cast",
  "I wanna make a puzzle that's 40,000 pieces and when you finish it, it says, 'go outside'",
  "I'd like to play a video game where you help the people who were shot in all the other games. I'd call it, 'Really busy hospital'",
  'A lifevest protects you from drowning and a bulletproof vest protects you from getting shot and a sweater vest protects you from pretty girls.',
  "I think that when you get dressed in the morning, sometimes you're really making a decision about your behavior for the day. Like if you put on flip-flops, you're saying: \"Hope I don't get chased today. Be nice to people in sneakers.\"",
  'I feel stupid when I write the word banana. Its like, how many na\'s are on this thing? "Cause I\'m like Bana... keep going. Bananana... dang."',
  // Steven Wright http://www.weather.net/zarg/ZarPages/stevenWright.html
  'The early bird gets the worm, but the second mouse gets the cheese.',
  "OK, so what's the speed of dark?",
  "Support bacteria - they're the only culture some people have.",
  "When everything is going your way, you're in the wrong lane.",
  'If Barbie is so popular, why do you have to buy her friends?',
  "If at first you don't succeed, then skydiving definitely isn't for you.",
  'Change is inevitable....except from vending machines.',
  'On the other hand, you have different fingers.'
]
const howAreYous = [
  'Life is beautiful. How are you?',
  'AMAZEBALLS. What about you boo?',
  'Living the life. How are you?',
  "So good. How you livin'?",
  "I'm really happy. What about you?",
  "I'm built for this. How are you doing?",
  'Solid. You?',
  'Life gets more beautiful everyday. How is your experience?',
  "The purpose of our lives is to be happy... so I'm happy. How about you?",
  'Im completely content. How are you?'
]
const youreWelcomes = [
  "You're welcome.",
  "You're very welcome.",
  "You're totally welcome.",
  "You're absolutely welcome.",
  "You're certainly welcome.",
  "You're welcome!",
  'My pleasure.',
  'You are welcome.',
  'My absolute pleasure.',
  'You are very welcome'
]
// https://www.happier.com/blog/nice-things-to-say-100-compliments
const compliments = [
  "You're awesome!",
  'Never let go of your dreams',
  'You rock!',
  'I like your style.',
  'You deserve a hug right now.',
  'I bet you sweat glitter.',
  "You're wonderful.",
  "You're one of a kind!",
  "You're inspiring.",
  "If you were a box of crayons, you'd be the giant name-brand one with the built-in sharpener.",
  "You're more fun than bubble wrap.",
  "You're so thoughtful.",
  'I bet you do the crossword puzzle in ink.',
  "You're someone's reason to smile.",
  "You're even better than a unicorn, because you're real.",
  'You have a good head on your shoulders.'
]
const thankYous = [
  'Thanks',
  'Thanks',
  'Thanks',
  'Thank you',
  'Thank you',
  'Thank you',
  'You should be thanked more often. So thank you!',
  'Thanks. You rock',
  'Thank you so much!',
  'I thank you'
]
const IDontKnows = [
  "I don't know",
  "I don't know",
  "I don't know",
  'Not sure',
  "I just don't know",
  "I'm not sure",
  'Not sure really',
  'I do not know',
  "Hmmm... I don't know",
  'I dont know'
]
const cools = [
  'Cool',
  'cool',
  'Cool',
  'cool',
  'Cool',
  'cool',
  'Cool',
  'cool',
  'Right on',
  'right on',
  'OK',
  'ok'
]
const hellos = [
  'Hi!',
  'Hello!',
  'Hey!',
  'Hi!',
  'Hello!',
  'Hey!',
  'Hi! :D',
  'Hello! :D',
  'Hey! :D',
  'Good day!',
  'Hey there!',
  'Hiya!',
  'Yo!',
  "What's up!",
  'Well hi there!',
  'Well hello there!'
]
const sorrys = [
  "Sorry. I'm still learning.",
  'Sorry. Sometimes you win, sometimes you learn.',
  "Sorry. In the end, we only regret the chances we didn't take.",
  "Sorry. When it rains, look for rainbows. When it's dark, look for stars. I'm doing my best here!",
  'Sorry. Everyday is a second chance.',
  "Sorry. I'll do better with time.",
  'Sorry. To avoid failure is to avoid progress.',
  'Sorry. Difficult roads often lead to beautiful destinations though.',
  "Sorry. Expect nothing and you'll never be disappointed",
  "Sorry. I'm aiming for progress, not perfection."
]
const baseGoodbye = "I'll let you end the session when you're ready."
const goodbyes = [
  'Bye!' + baseGoodbye,
  'Bye!' + baseGoodbye,
  'Bye!' + baseGoodbye,
  'See ya!' + baseGoodbye,
  'Peace!' + baseGoodbye,
  'Take care!' + baseGoodbye,
  'ttyl.' + baseGoodbye,
  'Goodbye!' + baseGoodbye,
  'Talk to ya later. ' + baseGoodbye,
  'Have a good one. ' + baseGoodbye,
  'Bye. ' + baseGoodbye
]

const helpOptions = {
  "Hello - You can always say things like 'Hi!' or 'Hey!' and I'll greet you back.": {
    command: 'hello'
  },
  "Search - You can say the word 'search' followed by some artificial intelligence concept and I'll look it up for you e.g. 'search machine learning'. This is mostly what I'm all about.": {
    command: 'search'
  },
  "More - You can say 'more' at any time if you'd like more results from your last search. I'll find more if they exist.": {
    command: 'more'
  },
  "List - If you'd like to see the concepts you've saved to study later, just tell me to 'list' them.": {
    command: 'list'
  },
  "Joke - I also know a few 'jokes' if you'd like to hear any ;)": {
    command: 'joke'
  }
}

module.exports.simpleHelpOptions =
  'Hello! | Search machine learning | Show more results | List saved items | Tell me a joke!'

// Other Helpers
module.exports.getRandomString = function(strArr) {
  return strArr[Math.floor(Math.random() * strArr.length)]
}
module.exports.getJoke = function() {
  return jokes[Math.floor(Math.random() * jokes.length)]
}
module.exports.getHowAreYou = function() {
  return howAreYous[Math.floor(Math.random() * howAreYous.length)]
}
module.exports.getYoureWelcome = function() {
  return youreWelcomes[Math.floor(Math.random() * youreWelcomes.length)]
}
module.exports.getCompliment = function() {
  return compliments[Math.floor(Math.random() * compliments.length)]
}
module.exports.getThankYou = function() {
  return thankYous[Math.floor(Math.random() * thankYous.length)]
}
module.exports.getIDontKnow = function() {
  return IDontKnows[Math.floor(Math.random() * IDontKnows.length)]
}
module.exports.getCool = function() {
  return cools[Math.floor(Math.random() * cools.length)]
}
module.exports.getHello = function() {
  return hellos[Math.floor(Math.random() * hellos.length)]
}
module.exports.getSorry = function() {
  return sorrys[Math.floor(Math.random() * sorrys.length)]
}
module.exports.getGoodbye = function() {
  return goodbyes[Math.floor(Math.random() * goodbyes.length)]
}
