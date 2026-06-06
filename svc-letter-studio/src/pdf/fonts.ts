import { Font } from '@react-pdf/renderer';

// ─── Font Registration ────────────────────────────────────────────────────────────
// Files PRESENT in public/fonts/ (verified):
//   public/fonts/Montserrat-Regular.ttf
//   public/fonts/Montserrat-Italic.ttf
//   public/fonts/Montserrat-SemiBold.ttf
//   public/fonts/Montserrat-Bold.ttf
//   public/fonts/PlayfairDisplaySC-Bold.ttf
//
// Files NOT present (do not register):
//   PlayfairDisplay-Regular.ttf
//   PlayfairDisplay-Bold.ttf

const base = window.location.origin;

// ─── Montserrat — multi-weight family ─────────────────────────────────────────
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: `${base}/fonts/Montserrat-Regular.ttf`,  fontWeight: 400, fontStyle: 'normal' },
    { src: `${base}/fonts/Montserrat-Italic.ttf`,   fontWeight: 400, fontStyle: 'italic' },
    { src: `${base}/fonts/Montserrat-SemiBold.ttf`, fontWeight: 600, fontStyle: 'normal' },
    { src: `${base}/fonts/Montserrat-Bold.ttf`,     fontWeight: 700, fontStyle: 'normal' },
    // fontWeight 800 has no dedicated file — map to Bold (700) as closest match
    { src: `${base}/fonts/Montserrat-Bold.ttf`,     fontWeight: 800, fontStyle: 'normal' },
  ],
});

// ─── Montserrat-SemiBold — alias family (used via FONTS.bodySemiBold in brand.ts) ─────
// Some components reference fontFamily: 'Montserrat-SemiBold' directly.
// Register it as its own family so react-pdf never throws "not registered".
Font.register({
  family: 'Montserrat-SemiBold',
  fonts: [
    { src: `${base}/fonts/Montserrat-SemiBold.ttf`, fontWeight: 400, fontStyle: 'normal' },
    { src: `${base}/fonts/Montserrat-SemiBold.ttf`, fontWeight: 600, fontStyle: 'normal' },
    { src: `${base}/fonts/Montserrat-SemiBold.ttf`, fontWeight: 700, fontStyle: 'normal' },
  ],
});

// ─── Playfair Display SC — brand wordmark only ───────────────────────────────
Font.register({
  family: 'Playfair Display SC',
  fonts: [
    { src: `${base}/fonts/PlayfairDisplaySC-Bold.ttf`, fontWeight: 700, fontStyle: 'normal' },
  ],
});

// ─── Hyphenation ────────────────────────────────────────────────────────────
// Disable auto-hyphenation for cleaner business document text.
Font.registerHyphenationCallback(word => [word]);
