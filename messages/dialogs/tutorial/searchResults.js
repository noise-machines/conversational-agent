const firstResults = [
  {
    key: 'fce9449f-980b-4d10-9877-68642e97f6b8',
    title: 'Leaf AI',
    description:
      'The Leaf Project is a group robot development program whose objective is to develop a robot platform that supports experiments with artificial intelligence, vision, navigation, etc.'
  },
  {
    key: 'a72f93d5-6e3d-467c-826c-3afe5db89ab8',
    title: 'Applications of AI',
    description:
      "Artificial intelligence, defined as intelligence exhibited by machines, has many applications in today's society."
  },
  {
    key: '84dd13f5-f96e-4bc7-b31e-60d8af34e282',
    title: 'AGI',
    description:
      'Artificial general intelligence (AGI) is the intelligence of a machine that could successfully perform any intellectual task that a human being can.'
  }
]

const moreResults = [
  {
    key: '565e06e4-fe84-466e-a4a5-70161d606508',
    title: 'Weak AI',
    description:
      'Weak artificial intelligence (weak AI), also known as narrow AI, is artificial intelligence that is focused on one narrow task.'
  },
  {
    key: 'eca086df-f4e0-4b2c-99e3-38290d89a8e9',
    title: 'AI-complete',
    description:
      'In the field of artificial intelligence, the most difficult problems are informally known as AI-complete or AI-hard, implying that the difficulty of these computational problems is equivalent to that of solving the central artificial intelligence problem—making computers as intelligent as people, or strong AI.'
  },
  {
    key: '45a61af8-1ee2-4202-b4d3-7a2c7961a6f6',
    title: 'Nouvelle AI',
    description:
      'Nouvelle artificial intelligence (AI) is an approach to artificial intelligence pioneered in the 1980s by Rodney Brooks, who was then part of MIT artificial intelligence laboratory.'
  }
]

const allResults = [...firstResults, ...moreResults]

module.exports = {
  firstResults,
  moreResults,
  allResults
}
