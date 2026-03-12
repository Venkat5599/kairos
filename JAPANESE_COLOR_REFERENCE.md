# Kairos - Japanese Color Palette Reference (和の色彩)

## Complete Color System

### Primary Colors - 主要色

#### Sakura (桜色) - Cherry Blossom
```
HEX: #FFB7C5
RGB: 255, 183, 197
HSL: 349°, 100%, 86%
CMYK: 0, 28, 23, 0

Meaning: Beauty, renewal, fleeting moments
Use: Primary buttons, highlights, brand identity
Pairs with: Beni, Moegi, Shiro
```

#### Beni (紅色) - Deep Crimson
```
HEX: #D7003A
RGB: 215, 0, 58
HSL: 344°, 100%, 42%

Meaning: Passion, energy, life force
Use: CTAs, important actions, alerts
Pairs with: Sakura, Sumi, Kinari
```

#### Ai (藍色) - Indigo
```
HEX: #165E83
RGB: 22, 94, 131
HSL: 200°, 71%, 30%

Meaning: Tradition, depth, wisdom
Use: Secondary actions, backgrounds
Pairs with: Murasaki, Mizu, Shiro
```

#### Murasaki (紫) - Imperial Purple
```
HEX: #884898
RGB: 136, 72, 152
HSL: 288°, 36%, 44%

Meaning: Nobility, spirituality, mystery
Use: Premium features, special states
Pairs with: Ai, Sakura, Gin
```

---

### Accent Colors - アクセント色

#### Mizu (水色) - Water Blue
```
HEX: #81C7D4
RGB: 129, 199, 212
HSL: 189°, 49%, 67%

Meaning: Tranquility, flow, clarity
Use: Links, info states, calm actions
Icon: 💧
```

#### Moegi (萌葱色) - Fresh Green
```
HEX: #7FC97F
RGB: 127, 201, 127
HSL: 120°, 41%, 64%

Meaning: Growth, success, harmony
Use: Success states, completed tasks
Icon: 🌱
```

#### Yamabuki (山吹色) - Golden Yellow
```
HEX: #F8B500
RGB: 248, 181, 0
HSL: 44°, 100%, 49%

Meaning: Prosperity, brightness, hope
Use: Pending states, warnings, highlights
Icon: 🌼
```

#### Shu (朱色) - Vermillion
```
HEX: #E83929
RGB: 232, 57, 41
HSL: 5°, 81%, 54%

Meaning: Energy, urgency, protection
Use: Errors, urgent actions, alerts
Icon: 🔴
```

---

### Neutral Colors - 中性色

#### Sumi (墨色) - Ink Black
```
HEX: #1A1A2E
RGB: 26, 26, 46
HSL: 240°, 28%, 14%

Meaning: Depth, elegance, foundation
Use: Main background
```

#### Kuro (黒紺) - Navy Black
```
HEX: #16213E
RGB: 22, 33, 62
HSL: 224°, 48%, 16%

Meaning: Sophistication, stability
Use: Card backgrounds, surfaces
```

#### Hai (灰色) - Ash Gray
```
HEX: #4A5568
RGB: 74, 85, 104
HSL: 218°, 17%, 35%

Meaning: Balance, neutrality
Use: Borders, dividers
```

#### Shiro (白) - Pure White
```
HEX: #F7F7F7
RGB: 247, 247, 247
HSL: 0°, 0%, 97%

Meaning: Purity, clarity, space
Use: Primary text, highlights
```

#### Kinari (生成り) - Natural Cream
```
HEX: #FFF8E7
RGB: 255, 248, 231
HSL: 42°, 100%, 95%

Meaning: Warmth, naturalness
Use: Warm backgrounds, paper texture
```

---

### Seasonal Colors - 四季の色

#### Spring (春) - Haru
```
Uguisu (鶯色) - Nightingale Green
HEX: #6C8D2F
Use: Spring theme, nature elements
Icon: 🐦

Toki (鴇色) - Ibis Pink
HEX: #EEA9A9
Use: Soft accents, gentle highlights
Icon: 🌸
```

#### Summer (夏) - Natsu
```
Asagi (浅葱色) - Light Blue-Green
HEX: #33A6B8
Use: Summer theme, water elements
Icon: 🌊

Natsu Orange (夏橙)
HEX: #FF6F3C
Use: Vibrant accents, energy
Icon: ☀️
```

#### Autumn (秋) - Aki
```
Kaki (柿色) - Persimmon Orange
HEX: #ED6D3D
Use: Autumn theme, warm accents
Icon: 🍂

Enji (臙脂) - Deep Maroon
HEX: #B94047
Use: Rich accents, depth
Icon: 🍁
```

#### Winter (冬) - Fuyu
```
Kon (紺色) - Deep Navy
HEX: #223A70
Use: Winter theme, cool depth
Icon: ❄️

Gin (銀色) - Silver
HEX: #C0C0C0
Use: Metallic accents, elegance
Icon: ✨
```

---

## Color Combinations

### Primary Gradients

**Sakura Sunset**
```css
background: linear-gradient(135deg, #FFB7C5 0%, #D7003A 100%);
/* Cherry blossom to crimson */
```

**Indigo Night**
```css
background: linear-gradient(135deg, #165E83 0%, #884898 100%);
/* Indigo to purple */
```

**Water Flow**
```css
background: linear-gradient(135deg, #81C7D4 0%, #165E83 100%);
/* Water blue to indigo */
```

**Golden Dawn**
```css
background: linear-gradient(135deg, #F8B500 0%, #FFB7C5 100%);
/* Gold to sakura */
```

### Complementary Pairs

```
Sakura + Moegi:    Pink + Green (Spring harmony)
Beni + Ai:         Red + Indigo (Bold contrast)
Yamabuki + Murasaki: Gold + Purple (Imperial elegance)
Mizu + Shu:        Blue + Vermillion (Dynamic balance)
```

### Triadic Combinations

```
Sakura + Moegi + Mizu:     Pink + Green + Blue (Fresh, natural)
Beni + Yamabuki + Ai:      Red + Gold + Indigo (Rich, traditional)
Murasaki + Moegi + Shu:    Purple + Green + Vermillion (Vibrant)
```

---

## Usage Guidelines

### Backgrounds
```
Primary:   Sumi (#1A1A2E)
Secondary: Kuro (#16213E)
Elevated:  Kuro with 5% Sakura tint
Overlay:   Sumi with 80% opacity
```

### Text
```
Primary:   Shiro (#F7F7F7) - Main content
Secondary: #A0AEC0 - Supporting text
Tertiary:  #718096 - Subtle text
Accent:    Sakura (#FFB7C5) - Highlights
```

### Borders
```
Default:   rgba(255, 183, 197, 0.15) - Sakura tint
Hover:     rgba(255, 183, 197, 0.3) - Stronger sakura
Focus:     rgba(255, 183, 197, 0.5) - Prominent sakura
Divider:   rgba(74, 85, 104, 0.2) - Subtle gray
```

### Buttons

**Primary (Main Actions)**
```css
background: linear-gradient(135deg, #FFB7C5 0%, #D7003A 100%);
color: #F7F7F7;
border: none;
box-shadow: 0 4px 12px rgba(215, 0, 58, 0.3);
```

**Secondary (Supporting Actions)**
```css
background: linear-gradient(135deg, #165E83 0%, #884898 100%);
color: #F7F7F7;
border: none;
box-shadow: 0 4px 12px rgba(22, 94, 131, 0.3);
```

**Tertiary (Subtle Actions)**
```css
background: transparent;
color: #81C7D4;
border: 1px solid rgba(129, 199, 212, 0.3);
```

### Status Colors

```
Success:   Moegi (#7FC97F) - Completed, success
Warning:   Yamabuki (#F8B500) - Pending, caution
Error:     Shu (#E83929) - Failed, error
Info:      Mizu (#81C7D4) - Information, neutral
```

---

## Accessibility

### Contrast Ratios (WCAG AA)

**Text on Sumi Background**
```
Shiro (#F7F7F7):     15.8:1 ✓ AAA
Sakura (#FFB7C5):    8.2:1  ✓ AA
Mizu (#81C7D4):      6.1:1  ✓ AA
Yamabuki (#F8B500):  9.4:1  ✓ AAA
```

**Text on Kuro Background**
```
Shiro (#F7F7F7):     13.2:1 ✓ AAA
Sakura (#FFB7C5):    6.8:1  ✓ AA
Moegi (#7FC97F):     5.2:1  ✓ AA
```

### Color Blind Safe Combinations
```
✓ Sakura + Moegi (Pink + Green)
✓ Beni + Mizu (Red + Blue)
✓ Yamabuki + Murasaki (Yellow + Purple)
✓ Ai + Shu (Blue + Red)
```

---

## Japanese Design Patterns

### Seigaiha (青海波) - Blue Ocean Waves
```
Pattern: Overlapping semicircles
Colors: Mizu, Ai, Shiro
Use: Background texture, decorative element
```

### Asanoha (麻の葉) - Hemp Leaf
```
Pattern: Six-pointed geometric star
Colors: Moegi, Uguisu, Shiro
Use: Borders, dividers, backgrounds
```

### Sakura (桜) - Cherry Blossom
```
Pattern: Five-petaled flowers
Colors: Sakura, Toki, Shiro
Use: Decorative accents, success animations
```

### Kikko (亀甲) - Tortoise Shell
```
Pattern: Hexagonal tessellation
Colors: Yamabuki, Kin, Hai
Use: Premium features, special sections
```

---

## Implementation

### Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary
        sakura: '#FFB7C5',
        beni: '#D7003A',
        ai: '#165E83',
        murasaki: '#884898',
        
        // Accent
        mizu: '#81C7D4',
        moegi: '#7FC97F',
        yamabuki: '#F8B500',
        shu: '#E83929',
        
        // Neutral
        sumi: '#1A1A2E',
        kuro: '#16213E',
        hai: '#4A5568',
        shiro: '#F7F7F7',
        kinari: '#FFF8E7',
        
        // Seasonal
        uguisu: '#6C8D2F',
        toki: '#EEA9A9',
        asagi: '#33A6B8',
        kaki: '#ED6D3D',
        enji: '#B94047',
        kon: '#223A70',
        gin: '#C0C0C0',
      },
      backgroundImage: {
        'sakura-sunset': 'linear-gradient(135deg, #FFB7C5 0%, #D7003A 100%)',
        'indigo-night': 'linear-gradient(135deg, #165E83 0%, #884898 100%)',
        'water-flow': 'linear-gradient(135deg, #81C7D4 0%, #165E83 100%)',
        'golden-dawn': 'linear-gradient(135deg, #F8B500 0%, #FFB7C5 100%)',
      },
    },
  },
}
```

### CSS Variables
```css
:root {
  /* Primary */
  --sakura: #FFB7C5;
  --beni: #D7003A;
  --ai: #165E83;
  --murasaki: #884898;
  
  /* Accent */
  --mizu: #81C7D4;
  --moegi: #7FC97F;
  --yamabuki: #F8B500;
  --shu: #E83929;
  
  /* Neutral */
  --sumi: #1A1A2E;
  --kuro: #16213E;
  --hai: #4A5568;
  --shiro: #F7F7F7;
  --kinari: #FFF8E7;
}
```

---

## Inspiration Sources

- Traditional Japanese color names (伝統色)
- Ukiyo-e woodblock prints
- Kimono fabric patterns
- Seasonal festivals (matsuri)
- Japanese gardens
- Anime aesthetics (Studio Ghibli, Makoto Shinkai)

---

**Remember**: These colors tell a story. Each one has centuries of cultural meaning. Use them with intention and respect for their heritage.

和の美学 - The Aesthetics of Wa (Japanese Harmony)
