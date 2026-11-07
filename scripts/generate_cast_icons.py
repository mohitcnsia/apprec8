#!/usr/bin/env python3
"""
Generate vector SVGs and transparent PNGs for all 6 Apprec8 characters in 4 moods.
Output sizes: 256px, 128px, 64px.
Characters:
  1. chamku (Star host)
  2. kurma (Wise tortoise)
  3. chiku (Playful monkey)
  4. madhu (Spelling bee)
  5. cheenu (Teamwork ant)
  6. veda (Storyteller owl)
Moods:
  1. happy
  2. thinking
  3. cheering
  4. oops
"""

import os
import subprocess

OUT_DIR = "docs/release/brand/cast/icons"
os.makedirs(OUT_DIR, exist_ok=True)

# ----------------- SVG DEFINITIONS -----------------

def get_chamku_svg(mood):
    # Base star: golden #FFD23F, shadow #F59E0B, eyes #1E293B, cheeks #FF8BA7
    if mood == "happy":
        body = """
        <!-- Star Body -->
        <polygon points="128,24 158,92 232,96 174,146 194,218 128,176 62,218 82,146 24,96 98,92"
                 fill="#FFD23F" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round"/>
        <!-- Soft Inner Glow / Gradient -->
        <polygon points="128,38 152,94 212,98 166,138 182,196 128,162 74,196 90,138 44,98 104,94"
                 fill="#FFE66D" opacity="0.6"/>
        <!-- Cheeks -->
        <ellipse cx="86" cy="138" rx="14" ry="9" fill="#FF8BA7" opacity="0.8"/>
        <ellipse cx="170" cy="138" rx="14" ry="9" fill="#FF8BA7" opacity="0.8"/>
        <!-- Big Expressive Eyes -->
        <ellipse cx="100" cy="118" rx="14" ry="18" fill="#1E293B"/>
        <ellipse cx="156" cy="118" rx="14" ry="18" fill="#1E293B"/>
        <circle cx="95" cy="112" r="6" fill="#FFFFFF"/>
        <circle cx="104" cy="124" r="2.5" fill="#FFFFFF"/>
        <circle cx="151" cy="112" r="6" fill="#FFFFFF"/>
        <circle cx="160" cy="124" r="2.5" fill="#FFFFFF"/>
        <!-- Joyful Open Smile -->
        <path d="M 112 136 Q 128 158 144 136 Z" fill="#E11D48"/>
        <path d="M 116 142 Q 128 154 140 142" fill="#FDA4AF"/>
        <!-- Cute Little Waving Hands -->
        <path d="M 52 134 Q 30 120 28 106" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M 204 134 Q 226 120 234 102" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" fill="none"/>
        """
    elif mood == "thinking":
        body = """
        <!-- Star Body tilted -->
        <g transform="rotate(8 128 128)">
          <polygon points="128,24 158,92 232,96 174,146 194,218 128,176 62,218 82,146 24,96 98,92"
                   fill="#FFD23F" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round"/>
          <polygon points="128,38 152,94 212,98 166,138 182,196 128,162 74,196 90,138 44,98 104,94"
                   fill="#FFE66D" opacity="0.6"/>
          <!-- Cheeks -->
          <ellipse cx="86" cy="138" rx="12" ry="7" fill="#FF8BA7" opacity="0.6"/>
          <ellipse cx="170" cy="138" rx="12" ry="7" fill="#FF8BA7" opacity="0.6"/>
          <!-- Thinking Eyes (looking up-right) -->
          <ellipse cx="102" cy="116" rx="13" ry="17" fill="#1E293B"/>
          <ellipse cx="158" cy="116" rx="13" ry="17" fill="#1E293B"/>
          <circle cx="104" cy="110" r="5.5" fill="#FFFFFF"/>
          <circle cx="160" cy="110" r="5.5" fill="#FFFFFF"/>
          <!-- Raised Eyebrow -->
          <path d="M 90 98 Q 102 92 114 96" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M 146 94 Q 160 88 172 96" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Curious Pursed Mouth -->
          <path d="M 122 142 Q 130 148 136 142" stroke="#1E293B" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Hand to Chin -->
          <path d="M 188 156 Q 160 162 142 152" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" fill="none"/>
        </g>
        <!-- Little Sparkle Idea Bubble -->
        <polygon points="216,40 220,52 232,56 220,60 216,72 212,60 200,56 212,52" fill="#FDE047"/>
        """
    elif mood == "cheering":
        body = """
        <!-- Star Body jumping -->
        <g transform="translate(0, -10)">
          <polygon points="128,24 158,92 232,96 174,146 194,218 128,176 62,218 82,146 24,96 98,92"
                   fill="#FFD23F" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round"/>
          <polygon points="128,38 152,94 212,98 166,138 182,196 128,162 74,196 90,138 44,98 104,94"
                   fill="#FFE66D" opacity="0.6"/>
          <!-- Cheeks -->
          <ellipse cx="84" cy="134" rx="15" ry="10" fill="#FF8BA7" opacity="0.9"/>
          <ellipse cx="172" cy="134" rx="15" ry="10" fill="#FF8BA7" opacity="0.9"/>
          <!-- Joyful Laughing Closed Eyes ^ ^ -->
          <path d="M 88 118 Q 102 102 114 118" stroke="#1E293B" stroke-width="6" stroke-linecap="round" fill="none"/>
          <path d="M 142 118 Q 156 102 168 118" stroke="#1E293B" stroke-width="6" stroke-linecap="round" fill="none"/>
          <!-- Big Cheering Open Mouth -->
          <path d="M 106 130 Q 128 168 150 130 Z" fill="#E11D48"/>
          <path d="M 114 142 Q 128 162 142 142" fill="#FDA4AF"/>
          <!-- Hands Up Cheering! -->
          <path d="M 58 126 Q 36 96 30 76" stroke="#F59E0B" stroke-width="8" stroke-linecap="round" fill="none"/>
          <path d="M 198 126 Q 220 96 226 76" stroke="#F59E0B" stroke-width="8" stroke-linecap="round" fill="none"/>
        </g>
        <!-- Confetti / Mini Stars -->
        <polygon points="36,44 40,52 48,54 40,58 36,66 32,58 24,54 32,52" fill="#38BDF8"/>
        <polygon points="220,44 224,52 232,54 224,58 220,66 216,58 208,54 216,52" fill="#F43F5E"/>
        <circle cx="128" cy="16" r="5" fill="#A855F7"/>
        """
    else: # oops
        body = """
        <!-- Star Body slight slump -->
        <polygon points="128,34 156,98 226,104 170,150 188,220 128,180 68,220 86,150 30,104 100,98"
                 fill="#FFD23F" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="128,46 150,100 206,106 162,142 176,198 128,166 80,198 94,142 50,106 106,100"
                 fill="#FFE66D" opacity="0.6"/>
        <!-- Bashful Cheeks -->
        <ellipse cx="86" cy="144" rx="16" ry="10" fill="#FF8BA7" opacity="0.85"/>
        <ellipse cx="170" cy="144" rx="16" ry="10" fill="#FF8BA7" opacity="0.85"/>
        <!-- Oops Eyes (wide, slightly bashful) -->
        <ellipse cx="98" cy="124" rx="13" ry="16" fill="#1E293B"/>
        <ellipse cx="158" cy="124" rx="13" ry="16" fill="#1E293B"/>
        <circle cx="94" cy="120" r="5" fill="#FFFFFF"/>
        <circle cx="154" cy="120" r="5" fill="#FFFFFF"/>
        <!-- Worried / Cute Wavy Mouth -->
        <path d="M 114 148 Q 122 142 128 148 Q 134 154 142 148" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <!-- Blue Sweatdrop -->
        <path d="M 188 94 Q 194 80 198 94 Q 198 104 188 104 Q 178 104 188 94 Z" fill="#38BDF8"/>
        <!-- Hand Scratching Head -->
        <path d="M 76 148 Q 62 136 68 116" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M 180 148 Q 196 130 182 110" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" fill="none"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

def get_kurma_svg(mood):
    # Tortoise: shell #2E6B4F, skin #52B788, belly #D8F3DC, glasses #F59E0B
    specs = """
    <!-- Golden Spectacles -->
    <circle cx="106" cy="98" r="16" fill="none" stroke="#F59E0B" stroke-width="4"/>
    <circle cx="150" cy="98" r="16" fill="none" stroke="#F59E0B" stroke-width="4"/>
    <line x1="122" y1="98" x2="134" y2="98" stroke="#F59E0B" stroke-width="4"/>
    <line x1="90" y1="96" x2="76" y2="92" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    <line x1="166" y1="96" x2="180" y2="92" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    """
    if mood == "happy":
        body = f"""
        <!-- Back Feet -->
        <ellipse cx="78" cy="204" rx="20" ry="14" fill="#40916C"/>
        <ellipse cx="178" cy="204" rx="20" ry="14" fill="#40916C"/>
        <!-- Big Round Shell -->
        <ellipse cx="128" cy="154" rx="76" ry="62" fill="#2D6A4F" stroke="#1B4332" stroke-width="5"/>
        <!-- Shell Scutes Pattern -->
        <polygon points="128,114 154,132 144,164 112,164 102,132" fill="#40916C" stroke="#1B4332" stroke-width="3"/>
        <polygon points="128,114 102,132 72,130 84,106 112,106" fill="#52B788" stroke="#1B4332" stroke-width="2.5" opacity="0.8"/>
        <polygon points="128,114 154,132 184,130 172,106 144,106" fill="#52B788" stroke="#1B4332" stroke-width="2.5" opacity="0.8"/>
        <!-- Front Feet / Flippers -->
        <ellipse cx="64" cy="180" rx="18" ry="14" fill="#52B788" stroke="#2D6A4F" stroke-width="3"/>
        <path d="M 188 170 Q 212 152 216 136" stroke="#52B788" stroke-width="12" stroke-linecap="round" fill="none"/>
        <!-- Friendly Head -->
        <circle cx="128" cy="98" r="38" fill="#52B788" stroke="#2D6A4F" stroke-width="4"/>
        <!-- Eyes Behind Specs -->
        <ellipse cx="106" cy="98" rx="8" ry="10" fill="#1E293B"/>
        <ellipse cx="150" cy="98" rx="8" ry="10" fill="#1E293B"/>
        <circle cx="103" cy="94" r="3" fill="#FFFFFF"/>
        <circle cx="147" cy="94" r="3" fill="#FFFFFF"/>
        {specs}
        <!-- Gentle Warm Smile -->
        <path d="M 116 118 Q 128 128 140 118" stroke="#1B4332" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="92" cy="114" rx="7" ry="5" fill="#FF8BA7" opacity="0.6"/>
        <ellipse cx="164" cy="114" rx="7" ry="5" fill="#FF8BA7" opacity="0.6"/>
        """
    elif mood == "thinking":
        body = f"""
        <!-- Back Feet -->
        <ellipse cx="78" cy="204" rx="20" ry="14" fill="#40916C"/>
        <ellipse cx="178" cy="204" rx="20" ry="14" fill="#40916C"/>
        <!-- Big Round Shell -->
        <ellipse cx="128" cy="154" rx="76" ry="62" fill="#2D6A4F" stroke="#1B4332" stroke-width="5"/>
        <polygon points="128,114 154,132 144,164 112,164 102,132" fill="#40916C" stroke="#1B4332" stroke-width="3"/>
        <!-- Head tilted slightly -->
        <g transform="rotate(-6 128 98)">
          <circle cx="128" cy="98" r="38" fill="#52B788" stroke="#2D6A4F" stroke-width="4"/>
          <!-- Eyes Looking Upwards -->
          <ellipse cx="106" cy="94" rx="8" ry="10" fill="#1E293B"/>
          <ellipse cx="150" cy="94" rx="8" ry="10" fill="#1E293B"/>
          <circle cx="104" cy="88" r="3" fill="#FFFFFF"/>
          <circle cx="148" cy="88" r="3" fill="#FFFFFF"/>
          {specs}
          <!-- Thoughtful Pursed Mouth -->
          <path d="M 120 120 Q 128 122 134 118" stroke="#1B4332" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Tapping Glasses with Flipper -->
          <path d="M 174 150 Q 186 118 166 98" stroke="#52B788" stroke-width="10" stroke-linecap="round" fill="none"/>
        </g>
        <!-- Idea twinkle -->
        <circle cx="196" cy="54" r="6" fill="#FBBF24"/>
        <circle cx="210" cy="42" r="3" fill="#FBBF24"/>
        """
    elif mood == "cheering":
        body = f"""
        <!-- Back Feet -->
        <ellipse cx="78" cy="204" rx="20" ry="14" fill="#40916C"/>
        <ellipse cx="178" cy="204" rx="20" ry="14" fill="#40916C"/>
        <!-- Shell -->
        <ellipse cx="128" cy="154" rx="76" ry="62" fill="#2D6A4F" stroke="#1B4332" stroke-width="5"/>
        <polygon points="128,114 154,132 144,164 112,164 102,132" fill="#40916C" stroke="#1B4332" stroke-width="3"/>
        <!-- Flippers in the Air! -->
        <path d="M 68 152 Q 44 118 40 96" stroke="#52B788" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M 188 152 Q 212 118 216 96" stroke="#52B788" stroke-width="12" stroke-linecap="round" fill="none"/>
        <!-- Head -->
        <circle cx="128" cy="94" r="38" fill="#52B788" stroke="#2D6A4F" stroke-width="4"/>
        <!-- Joyful Arched Eyes -->
        <path d="M 98 96 Q 106 86 114 96" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 142 96 Q 150 86 158 96" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none"/>
        {specs}
        <!-- Broad Proud Smile -->
        <path d="M 114 114 Q 128 132 142 114 Z" fill="#E11D48"/>
        <!-- Cheeks -->
        <ellipse cx="92" cy="110" rx="8" ry="6" fill="#FF8BA7" opacity="0.8"/>
        <ellipse cx="164" cy="110" rx="8" ry="6" fill="#FF8BA7" opacity="0.8"/>
        """
    else: # oops
        body = f"""
        <!-- Back Feet -->
        <ellipse cx="78" cy="204" rx="20" ry="14" fill="#40916C"/>
        <ellipse cx="178" cy="204" rx="20" ry="14" fill="#40916C"/>
        <!-- Big Shell -->
        <ellipse cx="128" cy="154" rx="76" ry="62" fill="#2D6A4F" stroke="#1B4332" stroke-width="5"/>
        <polygon points="128,114 154,132 144,164 112,164 102,132" fill="#40916C" stroke="#1B4332" stroke-width="3"/>
        <!-- Head Tucked 35% into Shell -->
        <g transform="translate(0, 22)">
          <circle cx="128" cy="98" r="36" fill="#52B788" stroke="#2D6A4F" stroke-width="4"/>
          <!-- Eyes Looking Mildly Surprised / Apologetic -->
          <ellipse cx="106" cy="98" rx="8" ry="9" fill="#1E293B"/>
          <ellipse cx="150" cy="98" rx="8" ry="9" fill="#1E293B"/>
          <circle cx="104" cy="94" r="3" fill="#FFFFFF"/>
          <circle cx="148" cy="94" r="3" fill="#FFFFFF"/>
          {specs}
          <!-- Cute Wavy Apologetic Smile -->
          <path d="M 118 116 Q 124 112 128 116 Q 132 120 138 116" stroke="#1B4332" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        </g>
        <!-- Blue Sweatdrop -->
        <path d="M 182 82 Q 188 70 192 82 Q 192 90 182 90 Q 172 90 182 82 Z" fill="#38BDF8"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

def get_chiku_svg(mood):
    # Monkey: fur #A06138, face/belly #FDE2B8, ears #FFAAA6, vest #EF4444
    ears = """
    <circle cx="62" cy="100" r="24" fill="#A06138" stroke="#78350F" stroke-width="4"/>
    <circle cx="62" cy="100" r="14" fill="#FFAAA6"/>
    <circle cx="194" cy="100" r="24" fill="#A06138" stroke="#78350F" stroke-width="4"/>
    <circle cx="194" cy="100" r="14" fill="#FFAAA6"/>
    """
    if mood == "happy":
        body = f"""
        <!-- Tail -->
        <path d="M 80 180 Q 30 190 28 150 Q 26 120 48 110" stroke="#A06138" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Body & Vest -->
        <ellipse cx="128" cy="180" rx="46" ry="50" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 94 154 Q 128 174 162 154 L 166 210 Q 128 220 90 210 Z" fill="#EF4444"/>
        <!-- Ears -->
        {ears}
        <!-- Head -->
        <circle cx="128" cy="106" r="48" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <!-- Face Mask Shape (classic heart-muzzle) -->
        <path d="M 96 86 Q 112 76 128 88 Q 144 76 160 86 Q 172 106 166 128 Q 148 144 128 144 Q 108 144 90 128 Q 84 106 96 86 Z" fill="#FDE2B8"/>
        <!-- Eyes -->
        <ellipse cx="110" cy="102" rx="10" ry="14" fill="#1E293B"/>
        <ellipse cx="146" cy="102" rx="10" ry="14" fill="#1E293B"/>
        <circle cx="107" cy="96" r="4" fill="#FFFFFF"/>
        <circle cx="143" cy="96" r="4" fill="#FFFFFF"/>
        <!-- Nose -->
        <ellipse cx="128" cy="116" rx="5" ry="3.5" fill="#78350F"/>
        <!-- Big Grin -->
        <path d="M 112 124 Q 128 142 144 124 Z" fill="#E11D48"/>
        <!-- Bouncy Arm Wave -->
        <path d="M 86 166 Q 58 150 52 134" stroke="#A06138" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path d="M 170 166 Q 198 150 204 134" stroke="#A06138" stroke-width="10" stroke-linecap="round" fill="none"/>
        """
    elif mood == "thinking":
        body = f"""
        <!-- Tail Curling like Question Mark ? -->
        <path d="M 80 180 Q 20 180 30 130 Q 40 100 66 110" stroke="#A06138" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Body & Vest -->
        <ellipse cx="128" cy="180" rx="46" ry="50" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 94 154 Q 128 174 162 154 L 166 210 Q 128 220 90 210 Z" fill="#EF4444"/>
        {ears}
        <!-- Head -->
        <circle cx="128" cy="106" r="48" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 96 86 Q 112 76 128 88 Q 144 76 160 86 Q 172 106 166 128 Q 148 144 128 144 Q 108 144 90 128 Q 84 106 96 86 Z" fill="#FDE2B8"/>
        <!-- Eyes looking sideways/up -->
        <ellipse cx="112" cy="100" rx="10" ry="13" fill="#1E293B"/>
        <ellipse cx="148" cy="100" rx="10" ry="13" fill="#1E293B"/>
        <circle cx="115" cy="94" r="4" fill="#FFFFFF"/>
        <circle cx="151" cy="94" r="4" fill="#FFFFFF"/>
        <!-- Eyebrows (one raised high) -->
        <path d="M 100 86 Q 112 84 120 88" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 136 82 Q 148 76 160 84" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="128" cy="116" rx="5" ry="3.5" fill="#78350F"/>
        <!-- Quizzical Pursed Mouth -->
        <ellipse cx="132" cy="128" rx="6" ry="7" fill="#1E293B"/>
        <!-- Finger on Temple -->
        <path d="M 172 170 Q 194 140 178 106" stroke="#A06138" stroke-width="10" stroke-linecap="round" fill="none"/>
        """
    elif mood == "cheering":
        body = f"""
        <!-- Tail high and proud -->
        <path d="M 80 170 Q 20 150 36 90 Q 50 60 70 70" stroke="#A06138" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Body jumping -->
        <ellipse cx="128" cy="172" rx="46" ry="50" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 94 146 Q 128 166 162 146 L 166 202 Q 128 212 90 202 Z" fill="#EF4444"/>
        {ears}
        <!-- Head -->
        <circle cx="128" cy="98" r="48" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 96 78 Q 112 68 128 80 Q 144 68 160 78 Q 172 98 166 120 Q 148 136 128 136 Q 108 136 90 120 Q 84 98 96 78 Z" fill="#FDE2B8"/>
        <!-- Big Joyful Laughing Eyes -->
        <path d="M 102 96 Q 112 84 122 96" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 134 96 Q 144 84 154 96" stroke="#1E293B" stroke-width="5" stroke-linecap="round" fill="none"/>
        <ellipse cx="128" cy="108" rx="5" ry="3.5" fill="#78350F"/>
        <!-- Huge Open Laughing Mouth -->
        <path d="M 108 116 Q 128 148 148 116 Z" fill="#E11D48"/>
        <path d="M 116 126 Q 128 144 140 126" fill="#FDA4AF"/>
        <!-- Arms Thrown High in Victory -->
        <path d="M 86 150 Q 52 110 44 70" stroke="#A06138" stroke-width="11" stroke-linecap="round" fill="none"/>
        <path d="M 170 150 Q 204 110 212 70" stroke="#A06138" stroke-width="11" stroke-linecap="round" fill="none"/>
        """
    else: # oops
        body = f"""
        <!-- Tail drooping -->
        <path d="M 80 180 Q 40 200 48 230" stroke="#A06138" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Body -->
        <ellipse cx="128" cy="180" rx="46" ry="50" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 94 154 Q 128 174 162 154 L 166 210 Q 128 220 90 210 Z" fill="#EF4444"/>
        {ears}
        <!-- Head -->
        <circle cx="128" cy="106" r="48" fill="#A06138" stroke="#78350F" stroke-width="4"/>
        <path d="M 96 86 Q 112 76 128 88 Q 144 76 160 86 Q 172 106 166 128 Q 148 144 128 144 Q 108 144 90 128 Q 84 106 96 86 Z" fill="#FDE2B8"/>
        <!-- Cheeky Wink & Wide Eye (> ‿ O) -->
        <path d="M 100 102 L 120 102" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="146" cy="102" rx="10" ry="13" fill="#1E293B"/>
        <circle cx="143" cy="98" r="4" fill="#FFFFFF"/>
        <ellipse cx="128" cy="114" rx="5" ry="3.5" fill="#78350F"/>
        <!-- Playful Tongue Out! -->
        <path d="M 116 122 Q 128 132 140 122" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 124 126 Q 128 142 136 126 Z" fill="#FF8BA7"/>
        <!-- Cute Little Bandage on Cheek -->
        <rect x="88" y="118" width="16" height="8" rx="2" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" transform="rotate(-15 96 122)"/>
        <!-- Hand Behind Head Scratching -->
        <path d="M 172 166 Q 206 130 186 96" stroke="#A06138" stroke-width="10" stroke-linecap="round" fill="none"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

def get_madhu_svg(mood):
    # Bee: yellow #FACC15, brown stripes #3E2723, wings #E0F2FE with #38BDF8 outline, glasses #475569
    wings = """
    <!-- Delicate Translucent Wings -->
    <ellipse cx="74" cy="94" rx="38" ry="24" fill="#E0F2FE" fill-opacity="0.65" stroke="#38BDF8" stroke-width="3" transform="rotate(-25 74 94)"/>
    <ellipse cx="182" cy="94" rx="38" ry="24" fill="#E0F2FE" fill-opacity="0.65" stroke="#38BDF8" stroke-width="3" transform="rotate(25 182 94)"/>
    """
    antennae = """
    <!-- Antennae with Bobbles -->
    <path d="M 112 76 Q 96 46 86 52" stroke="#3E2723" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="84" cy="52" r="7" fill="#FACC15" stroke="#3E2723" stroke-width="3"/>
    <path d="M 144 76 Q 160 46 170 52" stroke="#3E2723" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="172" cy="52" r="7" fill="#FACC15" stroke="#3E2723" stroke-width="3"/>
    """
    if mood == "happy":
        body = f"""
        {wings}
        <!-- Fuzzy Oval Bee Body -->
        <ellipse cx="128" cy="142" rx="58" ry="68" fill="#FACC15" stroke="#CA8A04" stroke-width="5"/>
        <!-- Dark Stripes -->
        <path d="M 72 126 Q 128 140 184 126 L 186 142 Q 128 158 70 142 Z" fill="#3E2723"/>
        <path d="M 74 162 Q 128 176 182 162 L 178 178 Q 128 192 78 178 Z" fill="#3E2723"/>
        {antennae}
        <!-- Tiny Stinger at bottom -->
        <polygon points="124,210 132,210 128,224" fill="#3E2723"/>
        <!-- Glasses -->
        <circle cx="108" cy="104" r="14" fill="none" stroke="#475569" stroke-width="3.5"/>
        <circle cx="148" cy="104" r="14" fill="none" stroke="#475569" stroke-width="3.5"/>
        <line x1="122" y1="104" x2="134" y2="104" stroke="#475569" stroke-width="3.5"/>
        <!-- Eyes Behind Glasses -->
        <ellipse cx="108" cy="104" rx="7" ry="9" fill="#1E293B"/>
        <ellipse cx="148" cy="104" rx="7" ry="9" fill="#1E293B"/>
        <circle cx="105" cy="100" r="3" fill="#FFFFFF"/>
        <circle cx="145" cy="100" r="3" fill="#FFFFFF"/>
        <!-- Cheeks -->
        <ellipse cx="90" cy="114" rx="8" ry="6" fill="#FF8BA7" opacity="0.8"/>
        <ellipse cx="166" cy="114" rx="8" ry="6" fill="#FF8BA7" opacity="0.8"/>
        <!-- Sweet Smile -->
        <path d="M 118 122 Q 128 132 138 122" stroke="#3E2723" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        """
    elif mood == "thinking":
        body = f"""
        {wings}
        <!-- Bee Body tilted -->
        <g transform="rotate(8 128 142)">
          <ellipse cx="128" cy="142" rx="58" ry="68" fill="#FACC15" stroke="#CA8A04" stroke-width="5"/>
          <path d="M 72 126 Q 128 140 184 126 L 186 142 Q 128 158 70 142 Z" fill="#3E2723"/>
          <path d="M 74 162 Q 128 176 182 162 L 178 178 Q 128 192 78 178 Z" fill="#3E2723"/>
          {antennae}
          <polygon points="124,210 132,210 128,224" fill="#3E2723"/>
          <circle cx="108" cy="104" r="14" fill="none" stroke="#475569" stroke-width="3.5"/>
          <circle cx="148" cy="104" r="14" fill="none" stroke="#475569" stroke-width="3.5"/>
          <line x1="122" y1="104" x2="134" y2="104" stroke="#475569" stroke-width="3.5"/>
          <!-- Eyes Looking Up-Right -->
          <ellipse cx="110" cy="100" rx="7" ry="9" fill="#1E293B"/>
          <ellipse cx="150" cy="100" rx="7" ry="9" fill="#1E293B"/>
          <circle cx="112" cy="96" r="3" fill="#FFFFFF"/>
          <circle cx="152" cy="96" r="3" fill="#FFFFFF"/>
          <!-- Curious "o" mouth -->
          <circle cx="128" cy="122" r="5" fill="#3E2723"/>
          <!-- Magnifying Glass / Little Hand -->
          <circle cx="178" cy="130" r="12" fill="none" stroke="#0284C7" stroke-width="3"/>
          <line x1="170" y1="138" x2="158" y2="150" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
        </g>
        """
    elif mood == "cheering":
        body = f"""
        <!-- Fluttering Motion Wings -->
        <ellipse cx="64" cy="80" rx="42" ry="26" fill="#E0F2FE" fill-opacity="0.8" stroke="#38BDF8" stroke-width="3" transform="rotate(-40 64 80)"/>
        <ellipse cx="192" cy="80" rx="42" ry="26" fill="#E0F2FE" fill-opacity="0.8" stroke="#38BDF8" stroke-width="3" transform="rotate(40 192 80)"/>
        <!-- Bee Body -->
        <ellipse cx="128" cy="142" rx="58" ry="68" fill="#FACC15" stroke="#CA8A04" stroke-width="5"/>
        <path d="M 72 126 Q 128 140 184 126 L 186 142 Q 128 158 70 142 Z" fill="#3E2723"/>
        <path d="M 74 162 Q 128 176 182 162 L 178 178 Q 128 192 78 178 Z" fill="#3E2723"/>
        {antennae}
        <polygon points="124,210 132,210 128,224" fill="#3E2723"/>
        <!-- Happy Arched Eyes -->
        <path d="M 100 102 Q 108 92 116 102" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M 140 102 Q 148 92 156 102" stroke="#1E293B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <!-- Broad Cheering Mouth -->
        <path d="M 116 116 Q 128 136 140 116 Z" fill="#E11D48"/>
        <!-- Golden Confetti / Sparkles around -->
        <polygon points="46,40 50,48 58,50 50,54 46,62 42,54 34,50 42,48" fill="#F59E0B"/>
        <polygon points="214,40 218,48 226,50 218,54 214,62 210,54 202,50 210,48" fill="#F59E0B"/>
        """
    else: # oops
        body = f"""
        {wings}
        <!-- Bee Body -->
        <ellipse cx="128" cy="142" rx="58" ry="68" fill="#FACC15" stroke="#CA8A04" stroke-width="5"/>
        <path d="M 72 126 Q 128 140 184 126 L 186 142 Q 128 158 70 142 Z" fill="#3E2723"/>
        <path d="M 74 162 Q 128 176 182 162 L 178 178 Q 128 192 78 178 Z" fill="#3E2723"/>
        <!-- Dizzy Swirl Antennae -->
        <path d="M 112 76 Q 90 40 80 56 Q 76 66 86 64" stroke="#3E2723" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 144 76 Q 166 40 176 56 Q 180 66 170 64" stroke="#3E2723" stroke-width="4" stroke-linecap="round" fill="none"/>
        <polygon points="124,210 132,210 128,224" fill="#3E2723"/>
        <!-- Eyes (wide & apologetic) -->
        <ellipse cx="108" cy="106" rx="8" ry="10" fill="#1E293B"/>
        <ellipse cx="148" cy="106" rx="8" ry="10" fill="#1E293B"/>
        <circle cx="105" cy="102" r="3" fill="#FFFFFF"/>
        <circle cx="145" cy="102" r="3" fill="#FFFFFF"/>
        <!-- Shy Wavy Mouth -->
        <path d="M 118 126 Q 124 122 128 126 Q 132 130 138 126" stroke="#3E2723" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Sweatdrop -->
        <path d="M 184 96 Q 190 84 194 96 Q 194 104 184 104 Q 174 104 184 96 Z" fill="#38BDF8"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

def get_cheenu_svg(mood):
    # Ant: amber-red #D9532F, dark #9A3412, eyes #1E293B, bandana/badge #06B6D4
    antennae = """
    <!-- Ant Antennae -->
    <path d="M 116 66 Q 96 34 84 40" stroke="#9A3412" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="82" cy="40" r="5" fill="#D9532F"/>
    <path d="M 140 66 Q 160 34 172 40" stroke="#9A3412" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="174" cy="40" r="5" fill="#D9532F"/>
    """
    legs = """
    <!-- Middle & Back Legs -->
    <path d="M 90 148 Q 50 156 42 186" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M 166 148 Q 206 156 214 186" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M 96 190 Q 64 210 58 234" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M 160 190 Q 192 210 198 234" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
    """
    if mood == "happy":
        body = f"""
        {legs}
        <!-- 3-Segment Body: Abdomen, Thorax, Head -->
        <ellipse cx="128" cy="194" rx="42" ry="34" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="144" rx="28" ry="24" fill="#EA580C" stroke="#9A3412" stroke-width="4"/>
        <!-- Teamwork Cyan Badge -->
        <circle cx="128" cy="144" r="10" fill="#06B6D4"/>
        <path d="M 124 144 L 127 148 L 133 140" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Front Little Arms Waving -->
        <path d="M 104 136 Q 74 122 66 106" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 152 136 Q 182 122 190 106" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Head -->
        <ellipse cx="128" cy="88" rx="36" ry="32" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        {antennae}
        <!-- Big Round Expressive Eyes -->
        <ellipse cx="112" cy="86" rx="10" ry="13" fill="#1E293B"/>
        <ellipse cx="144" cy="86" rx="10" ry="13" fill="#1E293B"/>
        <circle cx="109" cy="81" r="4" fill="#FFFFFF"/>
        <circle cx="141" cy="81" r="4" fill="#FFFFFF"/>
        <!-- Cheerful Smile -->
        <path d="M 118 100 Q 128 112 138 100" stroke="#9A3412" stroke-width="4" stroke-linecap="round" fill="none"/>
        """
    elif mood == "thinking":
        body = f"""
        {legs}
        <ellipse cx="128" cy="194" rx="42" ry="34" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="144" rx="28" ry="24" fill="#EA580C" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="88" rx="36" ry="32" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        {antennae}
        <!-- Eyes looking upwards thoughtfully -->
        <ellipse cx="114" cy="84" rx="10" ry="13" fill="#1E293B"/>
        <ellipse cx="146" cy="84" rx="10" ry="13" fill="#1E293B"/>
        <circle cx="116" cy="79" r="4" fill="#FFFFFF"/>
        <circle cx="148" cy="79" r="4" fill="#FFFFFF"/>
        <!-- Chin resting on front arms -->
        <path d="M 104 140 Q 94 116 116 108" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 152 140 Q 162 116 140 108" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Pursed Mouth -->
        <circle cx="128" cy="104" r="3.5" fill="#9A3412"/>
        """
    elif mood == "cheering":
        body = f"""
        {legs}
        <ellipse cx="128" cy="194" rx="42" ry="34" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="144" rx="28" ry="24" fill="#EA580C" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="88" rx="36" ry="32" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        {antennae}
        <!-- Super-Strength Arms Lifting High! -->
        <path d="M 104 136 Q 74 90 60 56" stroke="#9A3412" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M 152 136 Q 182 90 196 56" stroke="#9A3412" stroke-width="7" stroke-linecap="round" fill="none"/>
        <!-- Holding Giant Star -->
        <polygon points="128,14 138,38 164,40 144,58 150,84 128,70 106,84 112,58 92,40 118,38" fill="#FACC15" stroke="#EAB308" stroke-width="2"/>
        <!-- Joyful Cheering Face -->
        <path d="M 106 86 Q 114 74 122 86" stroke="#1E293B" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 134 86 Q 142 74 150 86" stroke="#1E293B" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 118 96 Q 128 114 138 96 Z" fill="#E11D48"/>
        """
    else: # oops
        body = f"""
        {legs}
        <ellipse cx="128" cy="194" rx="42" ry="34" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="144" rx="28" ry="24" fill="#EA580C" stroke="#9A3412" stroke-width="4"/>
        <ellipse cx="128" cy="88" rx="36" ry="32" fill="#D9532F" stroke="#9A3412" stroke-width="4"/>
        {antennae}
        <!-- Dropping a tiny leaf / pebble -->
        <circle cx="168" cy="160" r="10" fill="#65A30D"/>
        <!-- Hands in cute 'whoops' surprise -->
        <path d="M 104 136 Q 78 120 86 102" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 152 136 Q 176 130 168 116" stroke="#9A3412" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Eyes wide in mild surprise -->
        <ellipse cx="112" cy="86" rx="9" ry="11" fill="#1E293B"/>
        <ellipse cx="144" cy="86" rx="9" ry="11" fill="#1E293B"/>
        <circle cx="110" cy="82" r="3.5" fill="#FFFFFF"/>
        <circle cx="142" cy="82" r="3.5" fill="#FFFFFF"/>
        <!-- Wavy little smile -->
        <path d="M 120 102 Q 124 98 128 102 Q 132 106 136 102" stroke="#9A3412" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Sweatdrop -->
        <path d="M 174 76 Q 180 64 184 76 Q 184 84 174 84 Q 164 84 174 76 Z" fill="#38BDF8"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

def get_veda_svg(mood):
    # Owl: feathers #5D4037, cream tummy #FFF8E1, beak #F59E0B, glasses #334155
    specs = """
    <!-- Scholarly Round Spectacles -->
    <circle cx="104" cy="106" r="18" fill="none" stroke="#334155" stroke-width="4"/>
    <circle cx="152" cy="106" r="18" fill="none" stroke="#334155" stroke-width="4"/>
    <line x1="122" y1="106" x2="134" y2="106" stroke="#334155" stroke-width="4"/>
    """
    ears = """
    <!-- Feather Ear Tufts -->
    <polygon points="80,54 94,84 66,78" fill="#5D4037" stroke="#3E2723" stroke-width="3"/>
    <polygon points="176,54 190,78 162,84" fill="#5D4037" stroke="#3E2723" stroke-width="3"/>
    """
    if mood == "happy":
        body = f"""
        <!-- Owl Body -->
        <ellipse cx="128" cy="148" rx="64" ry="74" fill="#5D4037" stroke="#3E2723" stroke-width="5"/>
        {ears}
        <!-- Wings folded cosy -->
        <path d="M 66 120 Q 56 160 80 196" stroke="#3E2723" stroke-width="6" stroke-linecap="round" fill="#4E342E"/>
        <path d="M 190 120 Q 200 160 176 196" stroke="#3E2723" stroke-width="6" stroke-linecap="round" fill="#4E342E"/>
        <!-- Cream Scalloped Breast -->
        <ellipse cx="128" cy="162" rx="42" ry="46" fill="#FFF8E1"/>
        <!-- Subtle Scallops -->
        <path d="M 112 152 Q 120 160 128 152 Q 136 160 144 152" stroke="#D7CCC8" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 116 172 Q 124 180 132 172 Q 140 180 148 172" stroke="#D7CCC8" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Little Yellow Talons -->
        <ellipse cx="110" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <ellipse cx="146" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <!-- Huge Luminous Scholarly Eyes -->
        <circle cx="104" cy="106" r="22" fill="#FEF08A"/>
        <circle cx="152" cy="106" r="22" fill="#FEF08A"/>
        <ellipse cx="104" cy="106" rx="11" ry="14" fill="#1E293B"/>
        <ellipse cx="152" cy="106" rx="11" ry="14" fill="#1E293B"/>
        <circle cx="100" cy="100" r="4.5" fill="#FFFFFF"/>
        <circle cx="148" cy="100" r="4.5" fill="#FFFFFF"/>
        {specs}
        <!-- Beak -->
        <polygon points="122,118 134,118 128,132" fill="#F59E0B"/>
        <!-- Soft smile under beak -->
        <path d="M 120 136 Q 128 142 136 136" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        """
    elif mood == "thinking":
        body = f"""
        <ellipse cx="128" cy="148" rx="64" ry="74" fill="#5D4037" stroke="#3E2723" stroke-width="5"/>
        {ears}
        <ellipse cx="128" cy="162" rx="42" ry="46" fill="#FFF8E1"/>
        <ellipse cx="110" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <ellipse cx="146" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <!-- Head tilted 15 degrees -->
        <g transform="rotate(12 128 106)">
          <circle cx="104" cy="106" r="22" fill="#FEF08A"/>
          <circle cx="152" cy="106" r="22" fill="#FEF08A"/>
          <ellipse cx="106" cy="102" rx="11" ry="14" fill="#1E293B"/>
          <ellipse cx="154" cy="102" rx="11" ry="14" fill="#1E293B"/>
          <circle cx="108" cy="96" r="4.5" fill="#FFFFFF"/>
          <circle cx="156" cy="96" r="4.5" fill="#FFFFFF"/>
          {specs}
          <polygon points="122,118 134,118 128,132" fill="#F59E0B"/>
          <!-- Wing touching glasses -->
          <path d="M 180 160 Q 196 130 170 110" stroke="#3E2723" stroke-width="7" stroke-linecap="round" fill="#4E342E"/>
        </g>
        """
    elif mood == "cheering":
        body = f"""
        <!-- Wings Spread Wide! -->
        <path d="M 70 148 Q 24 100 20 74 Q 46 96 76 124" fill="#4E342E" stroke="#3E2723" stroke-width="4"/>
        <path d="M 186 148 Q 232 100 236 74 Q 210 96 180 124" fill="#4E342E" stroke="#3E2723" stroke-width="4"/>
        <ellipse cx="128" cy="148" rx="64" ry="74" fill="#5D4037" stroke="#3E2723" stroke-width="5"/>
        {ears}
        <ellipse cx="128" cy="162" rx="42" ry="46" fill="#FFF8E1"/>
        <ellipse cx="110" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <ellipse cx="146" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <!-- Eyes Joyful Golden Star Gaze -->
        <circle cx="104" cy="106" r="22" fill="#FEF08A"/>
        <circle cx="152" cy="106" r="22" fill="#FEF08A"/>
        <polygon points="104,96 107,103 114,106 107,109 104,116 101,109 94,106 101,103" fill="#1E293B"/>
        <polygon points="152,96 155,103 162,106 155,109 152,116 149,109 142,106 149,103" fill="#1E293B"/>
        {specs}
        <polygon points="122,116 134,116 128,130" fill="#F59E0B"/>
        <!-- Open Happy Hoot -->
        <ellipse cx="128" cy="136" rx="8" ry="6" fill="#E11D48"/>
        <!-- Flying Musical Note / Star -->
        <circle cx="216" cy="50" r="5" fill="#38BDF8"/>
        <line x1="221" y1="50" x2="221" y2="34" stroke="#38BDF8" stroke-width="2.5"/>
        """
    else: # oops
        body = f"""
        <ellipse cx="128" cy="148" rx="64" ry="74" fill="#5D4037" stroke="#3E2723" stroke-width="5"/>
        {ears}
        <ellipse cx="128" cy="162" rx="42" ry="46" fill="#FFF8E1"/>
        <ellipse cx="110" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <ellipse cx="146" cy="222" rx="10" ry="6" fill="#F59E0B"/>
        <!-- Eyes wide in mild surprise -->
        <circle cx="104" cy="106" r="22" fill="#FEF08A"/>
        <circle cx="152" cy="106" r="22" fill="#FEF08A"/>
        <ellipse cx="104" cy="106" rx="8" ry="11" fill="#1E293B"/>
        <ellipse cx="152" cy="106" rx="8" ry="11" fill="#1E293B"/>
        <circle cx="102" cy="102" r="3.5" fill="#FFFFFF"/>
        <circle cx="150" cy="102" r="3.5" fill="#FFFFFF"/>
        {specs}
        <polygon points="122,118 134,118 128,132" fill="#F59E0B"/>
        <!-- Gentle reassuring smile -->
        <path d="M 120 138 Q 128 144 136 138" stroke="#1E293B" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Soft blue sweatdrop -->
        <path d="M 194 84 Q 200 72 204 84 Q 204 92 194 92 Q 184 92 194 84 Z" fill="#38BDF8"/>
        """

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      {body}
    </svg>"""

CHARACTERS = {
    "chamku": get_chamku_svg,
    "kurma": get_kurma_svg,
    "chiku": get_chiku_svg,
    "madhu": get_madhu_svg,
    "cheenu": get_cheenu_svg,
    "veda": get_veda_svg,
}

MOODS = ["happy", "thinking", "cheering", "oops"]

print("Writing SVGs and generating PNG icons...")

for char_name, svg_func in CHARACTERS.items():
    for mood in MOODS:
        base_name = f"{char_name}_{mood}"
        svg_content = svg_func(mood)
        svg_path = os.path.join(OUT_DIR, f"{base_name}.svg")
        with open(svg_path, "w") as f:
            f.write(svg_content)

        # Create temporary HTML wrapper for Chrome rendering
        html_wrapper = f"""<!DOCTYPE html>
<html>
<head><style>body,html {{ margin:0; padding:0; background:transparent; overflow:hidden; }}</style></head>
<body>
{svg_content}
</body>
</html>"""
        html_path = f"/tmp/{base_name}.html"
        with open(html_path, "w") as f:
            f.write(html_wrapper)

        # Render 256px PNG with Headless Chrome
        png_256 = os.path.join(OUT_DIR, f"{base_name}_256.png")
        cmd_chrome = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "--headless=new",
            "--disable-gpu",
            f"--screenshot={png_256}",
            "--window-size=256,256",
            "--default-background-color=00000000",
            f"file://{html_path}"
        ]
        subprocess.run(cmd_chrome, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Scale down to 128px and 64px with sips (native macOS tool, fast & maintains alpha)
        png_128 = os.path.join(OUT_DIR, f"{base_name}_128.png")
        png_64 = os.path.join(OUT_DIR, f"{base_name}_64.png")
        subprocess.run(["sips", "-z", "128", "128", png_256, "--out", png_128], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        subprocess.run(["sips", "-z", "64", "64", png_256, "--out", png_64], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        print(f"Generated: {base_name} [256, 128, 64]")

print("\nAll 24 character mood icons (72 PNGs + 24 SVGs) successfully created!")
