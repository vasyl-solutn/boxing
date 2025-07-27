# Boxing Game

A simple boxing game built with Phaser 3 where you fight against an NPC opponent.

## How to Run

1. Open `index.html` in your web browser
2. The game will start automatically

## How to Play

### Controls
- **Punch Button**: Attack the NPC
- **Block Button**: Defend against NPC attacks (lasts 1 second)
- **Reset Button**: Start a new fight

### Game Mechanics

#### Player Stats
- **Health**: 100 (reduces when hit)
- **Power**: 50 (damage dealt when punching)
- **Protection**: 30 (damage reduction when blocking)

#### NPC Stats
- **Health**: 100 (reduces when hit)
- **Power**: 50 (damage dealt when punching)
- **Protection**: 30 (damage reduction when blocking)

#### Combat System
- **Punching**: Deals damage equal to your power
- **Blocking**: Reduces incoming damage by your protection value
- **NPC AI**: Randomly punches (70% chance) or blocks (30% chance) every 2 seconds
- **Visual Feedback**: Characters flash red when hit, green when blocking

### Game Features
- Real-time health display
- Damage numbers with animations
- Visual feedback for hits and blocks
- Game over screen with winner announcement
- Reset functionality for new fights

## Technical Details

- Built with Phaser 3.60.0
- Uses simple colored rectangles for characters
- Physics system for potential future enhancements
- Responsive UI with CSS styling

## Future Enhancements

This is a simple starting point. You can easily extend it with:
- Character sprites and animations
- Sound effects
- More complex AI behavior
- Different attack types
- Power-ups and special moves
- Multiple rounds
- Character customization
