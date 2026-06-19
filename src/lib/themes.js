/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Defines the available themes for the photo booth.
 * Each theme groups a set of mode keys from modes.js, shown in the ModeSelector.
 * The ThemeSelector screen lets users pick a theme before each session.
 *
 * @type {Object.<string, {name: string, emoji: string, description: string, modes: string[]}>}
 */
export default {
  gaming: {
    name: 'Retro Gaming',
    emoji: '🎮',
    description: 'Classic video game characters & pixel art styles',
    modes: [
      'custom',
      'mario',
      'zelda',
      'streetfighter',
      'sonic',
      'megaman',
      'pacman',
      'finalfantasy',
      'castlevania',
      'bubsy',
      'tombraider',
      'artifactprotocol',
      '8bit',
      'donkeykong',
      'pokemon',
      'chronotrigger',
      'mortalkombat',
      'kirby',
      'metalgear',
      'metroid',
      'earthbound'
    ]
  },

  pride: {
    name: 'Pride',
    emoji: '🌈',
    description: 'Rainbow celebration, queer joy & fabulousness',
    modes: [
      'pride',
      'dragqueen',
      'pridewarrior'
    ]
  },

  ship: {
    name: 'Ship Them',
    emoji: '💑',
    description: 'Couple & duo art — best with 2 people in frame',
    modes: [
      'shipcouple',
      'fantasymates',
      'moonlightpair'
    ]
  },

  animated: {
    name: 'Animated',
    emoji: '✨',
    description: 'TV & movie cartoon character transformations',
    modes: [
      'mlp',
      'lilo',
      'kingdomhearts'
    ]
  },

  fursona: {
    name: 'Fursona',
    emoji: '🦊',
    description: 'Anthropomorphic animal characters with holographic flair',
    modes: [
      'furAuto',
      'furFox',
      'furWolf',
      'furCat',
      'furOwl',
      'furDragon',
      'furPanda',
      'furRabbit',
      'furTiger',
      'furPenguin'
    ]
  },

  cards: {
    name: 'Trading Cards',
    emoji: '🃏',
    description: 'Pokémon cards, sports cards, holo foil & operator IDs',
    modes: [
      'pokemoncard',
      'sportcard',
      'codcard',
      'holocard'
    ]
  }
}
