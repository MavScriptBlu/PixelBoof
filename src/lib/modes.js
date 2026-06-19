/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Constants for the lenses used in the app.
 * Each key represents a unique mode ID used throughout the app.
 * Modes are grouped into themes via src/lib/themes.js.
 *
 * @type {Object.<string, {name: string, emoji: string, prompt: string}>}
 * @property {string} name - The user-facing name of the style, displayed in the UI.
 * @property {string} emoji - A representative emoji for the UI, adding a visual cue.
 * @property {string} prompt - The specific text prompt sent to the generative AI model to guide the image style.
 */
export default {

  // ─── GAMING THEME ────────────────────────────────────────────────────────── //

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
  },

  // ─── PRIDE THEME ─────────────────────────────────────────────────────────── //

  pride: {
    name: 'Rainbow Royalty',
    emoji: '🌈',
    prompt: `Transform the person in the photo into a vibrant, rainbow-infused celebration character. Weave bold pride flag colors — red, orange, yellow, green, blue, and violet — into their hair, clothing, and accessories in a festive, joyful illustration style full of sparkle and energy.`
  },

  dragqueen: {
    name: 'Slay Queen',
    emoji: '💅',
    prompt: `Transform the person in the photo into a glamorous, over-the-top drag queen character. Give them dramatic eye makeup with bold eyeshadow, a stunning elaborate wig, sequined or feathered costume, and a fierce, fabulous expression. Style it as a bold, detailed high-fashion illustration sticker.`
  },

  pridewarrior: {
    name: 'Pride Warrior',
    emoji: '⚔️',
    prompt: `Transform the person in the photo into a fantasy warrior champion of the rainbow — wearing radiant armor featuring pride flag colors woven into the metal and plating, carrying a glowing banner or sword that radiates rainbow light, with a confident heroic stance. Style it as vibrant fantasy RPG concept art.`
  },

  // ─── SHIP-THEM THEME ─────────────────────────────────────────────────────── //

  shipcouple: {
    name: 'Ship It!',
    emoji: '💑',
    prompt: `There are two people in this photo. Transform BOTH of them into a sweet romantic anime couple sticker — soft pastel color palette, complementary aesthetic outfits, a tender moment between them (holding hands, leaning together, or sharing a smile). Style it as a warm, detailed shoujo manga illustration.`
  },

  fantasymates: {
    name: 'Quest Duo',
    emoji: '⚔️',
    prompt: `There are two people in this photo. Transform BOTH of them into a heroic fantasy adventure duo — complementary armor sets that clearly go together, dynamic back-to-back pose as if ready to face the world together, expressive faces full of trust and determination. Style it as detailed fantasy RPG concept art.`
  },

  moonlightpair: {
    name: 'Moonlight',
    emoji: '🌙',
    prompt: `There are two people in this photo. Transform BOTH of them into an ethereal romantic couple under a glowing full moon — flowing magical clothing with starlight and soft glow effects, warm intimate atmosphere, soft expressions. Style it as a dreamy watercolor illustration sticker.`
  },

  // ─── ANIMATED TV/MOVIE THEME ─────────────────────────────────────────────── //

  mlp: {
    name: 'My Little Pony',
    emoji: '🦄',
    prompt: `Transform the person in the photo into a brand new, original My Little Pony character — a unique pony with flowing mane and tail colored to reflect the person's personality, and a special cutie mark that represents their passion or talent. The art style should match the colorful, expressive, and soft aesthetic of My Little Pony: Friendship is Magic.`
  },

  lilo: {
    name: 'Experiment 626',
    emoji: '👽',
    prompt: `Transform the person in the photo into a brand new alien Experiment character from the Lilo & Stitch universe — give them a unique experiment number, cute alien features (antennae, unusual ears, or extra limbs if it fits), and a mischievous or lovable personality reflected in their expression and design. The style should match the warm, colorful Disney animated film aesthetic.`
  },

  kingdomhearts: {
    name: 'Kingdom Hearts',
    emoji: '🗝️',
    prompt: `Transform the person in the photo into a new, original character from the Kingdom Hearts universe — stylish outfit with distinctive zipper details and subtle keyblade motifs woven into the accessories, combining Disney-inspired warmth with JRPG heroic flair. The style should match Tetsuya Nomura's iconic character design: detailed, fashionable, and expressive.`
  },

  // ─── FURSONA THEME ───────────────────────────────────────────────────────── //

  furAuto: {
    name: 'Spirit Animal',
    emoji: '🐾',
    prompt: `Study the person's features, energy, and personality, then choose the anthropomorphic animal species that best fits their vibe and transform them into that fursona. The art style should be semi-cartoon, semi-realistic with a subtle holographic foil sheen on the fur or scales. Preserve their unique personal details: piercings, glasses, hair color, jewelry, tattoos.`
  },

  furFox: {
    name: 'Fox',
    emoji: '🦊',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic fox fursona character — elegant pointed ears, a full bushy tail with a white tip, and bright expressive eyes that capture the person's personality. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a subtle holographic foil sheen to the fur.`
  },

  furWolf: {
    name: 'Wolf',
    emoji: '🐺',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic wolf fursona character — sharp ears, a powerful but approachable presence, and intense expressive eyes. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a subtle holographic foil sheen to the fur coat.`
  },

  furCat: {
    name: 'Cat',
    emoji: '🐱',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic cat fursona character — soft rounded ears, a sleek tail, and elegant graceful features with bright expressive eyes. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a subtle holographic foil sheen to the fur.`
  },

  furOwl: {
    name: 'Owl',
    emoji: '🦉',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic owl fursona character — large expressive eyes with feathered brows, tufted ears, detailed feather patterns, and a wise yet approachable demeanor. Preserve their unique features: piercings, glasses, jewelry. Add a subtle holographic foil sheen to the plumage.`
  },

  furDragon: {
    name: 'Dragon',
    emoji: '🐉',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic dragon fursona character — elegant curved horns, iridescent scaled skin, expressive eyes with vertical pupils, and a majestic commanding presence. Preserve their unique features: piercings, glasses, jewelry. Add a dramatic holographic foil sheen to the scales.`
  },

  furPanda: {
    name: 'Panda',
    emoji: '🐼',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic giant panda fursona character — the classic black-and-white markings with fluffy rounded ears and a warm, gentle, expressive face. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a soft holographic foil sheen to the fur.`
  },

  furRabbit: {
    name: 'Rabbit',
    emoji: '🐰',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic rabbit fursona character — long expressive ears, a fluffy cottontail, bright eyes, and a sweet yet spirited personality in their expression. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a subtle holographic foil sheen to the fur.`
  },

  furTiger: {
    name: 'Tiger',
    emoji: '🐯',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic tiger fursona character — bold dramatic stripes, fierce but friendly eyes, and a confident powerful presence with a warm undercurrent. Preserve their unique features: piercings, glasses, hair color, jewelry. Add a dramatic holographic foil sheen to the striped coat.`
  },

  furPenguin: {
    name: 'Penguin',
    emoji: '🐧',
    prompt: `Transform the person in the photo into a semi-cartoon, semi-realistic anthropomorphic penguin fursona character — sleek tuxedo-like black and white body, expressive eyes, flipper hands, and an endearingly charming personality. Preserve their unique features: piercings, glasses, accessories. Add a subtle holographic foil sheen to the feathers.`
  },

  // ─── TRADING CARDS THEME ─────────────────────────────────────────────────── //

  pokemoncard: {
    name: 'Pokémon Card',
    emoji: '🃏',
    prompt: `Create a Pokémon-style trading card with the person transformed into a brand new original Pokémon. The card should feature: a colorful type-themed border, the new Pokémon's creative name and HP in the header, a detailed illustration of the Pokémon (designed around the person's features and vibe) in the art area, and two move names in the lower section. Make the Pokémon design feel genuinely creative and inspired.`
  },

  sportcard: {
    name: 'Sports Card',
    emoji: '🏆',
    prompt: `Create a vintage-style sports trading card featuring the person as a professional athlete. The card should include: a bold team color border, a dynamic action-pose illustration of the person in a sports uniform, their name in large bold font, their position, and stats in the lower panel. Style it like an authentic collectible from the golden era of 90s sports cards.`
  },

  codcard: {
    name: 'Operator ID',
    emoji: '🎖️',
    prompt: `Create a Call of Duty Operator ID card featuring the person as a battle-hardened military operator. The card should include: their operator callsign in tactical font, rank insignia, weapon specialty, K/D ratio and total kills, and a gritty high-contrast tactical portrait illustration of the person. Style it as a dark, cinematic operator ID with military typography and a weathered look.`
  },

  holocard: {
    name: 'Holo Foil Card',
    emoji: '✨',
    prompt: `Create a premium holographic foil collector card featuring the person as a legendary rare character. The card should include: a shimmering rainbow prismatic foil border with light-catching effects, a stunning portrait of the person rendered with iridescent lighting and ethereal glow, their character class and power level rating, and a rarity gemstone icon in the corner. The holographic foil effect should be visually dramatic with rainbow prismatic reflections.`
  }
}
