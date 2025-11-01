/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Constants for the lenses used in the app.
 * Each key represents a unique mode ID used throughout the app.
 *
 * @type {Object.<string, {name: string, emoji: string, prompt: string}>}
 * @property {string} name - The user-facing name of the style, displayed in the UI.
 * @property {string} emoji - A representative emoji for the UI, adding a visual cue.
 * @property {string} prompt - The specific text prompt sent to the generative AI model to guide the image style.
 */
export default {
  custom: {
    name: 'Custom',
    emoji: '✏️',
    prompt: ''
  },

  mario: {
    name: 'Pipe Panic',
    emoji: '🍄',
    prompt: `Transform the person in the photo into a new, original character that would fit into the Super Mario universe, in a cartoon sticker style. No overalls, plumber hats, or Mushrooms.`
  },

  zelda: {
    name: 'Chronicles of the Hero',
    emoji: '🛡️',
    prompt: `Transform the person in the photo into a new, original character from The Legend of Zelda universe, in a classic anime sticker style. No green tunics.`
  },

  streetfighter: {
    name: 'Sidewalk Showdown',
    emoji: '🥊',
    prompt: `Transform the person in the photo into a new, original Street Fighter character, in a vibrant, dynamic 90s arcade sticker style.`
  },

  sonic: {
    name: 'Speedster Spin',
    emoji: '🌀',
    prompt: `Transform the person in the photo into an original character from the Sonic the Hedgehog universe, capturing the fast, energetic, and rebellious attitude of the 90s games. The character should have large, expressive eyes, and resemble a cartoon animal.`
  },

  megaman: {
    name: 'Armor Ace',
    emoji: '🤖',
    prompt: `Transform the person in the photo into a new, original 'Robot Master' character from the Mega Man universe, in a classic anime sticker style.`
  },

  pacman: {
    name: 'Maze-Muncher',
    emoji: '🟡',
    prompt: `Create a new, original ghost character for the Pac-Man universe based on the person in the photo.`
  },

  finalfantasy: {
    name: 'Last Dream',
    emoji: '🧙',
    prompt: `Transform the person in the photo into a new, original character from the Final Fantasy universe, in the detailed and ornate illustrative style of classic 90s concept art. The character should have flowing hair and intricate, fantasy-inspired clothing.`
  },

  castlevania: {
    name: 'Draculight',
    emoji: '🦇',
    prompt: `Transform the person in the photo into a new, original gothic vampire hunter from the Castlevania universe, in a dark, dramatic anime sticker style.`
  },

  bubsy: {
    name: 'Whiskers',
    emoji: '😼',
    prompt: `Transform the person in the photo into a new, original character from the Bubsy the Bobcat universe, a wisecracking bobcat with a t-shirt and a sassy attitude. The style should be a vibrant 90s cartoon sticker.`
  },

  tombraider: {
    name: 'Artifact Protocol',
    emoji: '💎',
    prompt: `Transform the person in the photo into a new, original rugged adventurer in the style of Tomb Raider, with practical gear for exploring ancient ruins and a confident, determined expression. No green tank tops, or long brown hair in a pony tail - long brown hair must be worn down.`
  },

  artifactprotocol: {
    name: 'Artifact Protocol PS1',
    emoji: '⛏️',
    prompt: `Transform the person in the photo into a new, original character from the Tomb Raider universe, in the style of a 1990s PlayStation 1 video game. The character should have a blocky, low-polygon 3D model look with pixelated textures, ready for an adventure in ancient ruins. No green tank tops`
  },

  '8bit': {
    name: '8-bit',
    emoji: '🎮',
    prompt: `Transform the person's face into an 8-bit pixel art character sprite. The final image should be a die-cut sticker of the sprite with a thick white border, isolated on a flat black background.`
  },

  donkeykong: {
    name: 'Banana Brawl',
    emoji: '🦍',
    prompt: `Transform the person in the photo into a new, original cartoon animal character from the Donkey Kong Country universe, such as a primate or reptile.`
  },

  pokemon: {
    name: 'Tall Grass Adventurers',
    emoji: '⚡',
    prompt: `Turn the person in the photo into a new, original Pokémon trainer, complete with a cap with a unique emblam (not a pokeball or circular) and fingerless gloves. No half-split colored circular icons. Do not include Poké Balls, red-and-white spheres, or any recognizable capture devices. Avoid circular emblems that resemble Poké Balls on hats, lanyards, or clothing.`
  },

  chronotrigger: {
    name: 'Time Jolt',
    emoji: '⏳',
    prompt: `Transform the person in the photo into a new, original character from the Chrono Trigger universe, in Akira Toriyama's distinct 90s anime style.`
  },

  mortalkombat: {
    name: 'Fatal Conflict',
    emoji: '🐉',
    prompt: `Transform the person in the photo into a new, original warrior from the Mortal Kombat universe. The style should be gritty and realistic, like the digitized sprites from the original arcade games, with a dynamic fighting pose.`
  },

  kirby: {
    name: 'Puff Pal',
    emoji: '💖',
    prompt: `Transform the person in the photo into a new, original cute, round, friendly creature. The style should be soft, pastel, and cheerful, with a simple, bubbly design.`
  },

  metalgear: {
    name: 'Tin Tactics',
    emoji: '📦',
    prompt: `Transform the person in the photo into a new, original tactical espionage operative from the Metal Gear Solid universe. The style should be gritty and detailed, in the style of Yoji Shinkawa's iconic concept art, with heavy ink strokes and a muted color palette.`
  },

  metroid: {
    name: 'Robo-tron',
    emoji: '👽',
    prompt: `Transform the person in the photo into a new, original bounty hunter from the Metroid universe, encased in unique, futuristic power armor. The style should be dark, atmospheric, and sci-fi, reminiscent of classic 16-bit concept art.`
  },

  earthbound: {
    name: 'Home-bound',
    emoji: '🌎',
    prompt: `Transform the person in the photo into a new, original quirky character from the world of Earthbound. The art style should be simple, charming, and clay-like, with a vibrant, offbeat color palette.`
  }
}
