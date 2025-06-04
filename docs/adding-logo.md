# Adding Your Logo

## 📁 Where to Place Your Logo

Put your logo file in the `public/images/` directory:

```
public/
└── images/
    ├── logo.png        (recommended)
    ├── logo.svg        (vector format - best for scaling)
    └── logo@2x.png     (high-res version for retina displays)
```

## 🎨 Recommended Logo Specifications

### For the Header/Menu Badge:

- **Size**: 40x40px (or square ratio)
- **Format**: PNG, SVG, or WebP
- **Background**: Transparent
- **Colors**: Works well on dark backgrounds

### For Social Sharing:

- **Size**: 1200x630px
- **Format**: PNG or JPG
- **Use**: Open Graph images, social media

## 🔧 How to Update Components

Once you've added your logo, you can replace the "HM" initials in:

### Header Component (`src/components/Header.astro`)

```astro
<!-- Replace this: -->
<div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
  <span class="text-white font-bold text-lg">HM</span>
</div>

<!-- With this: -->
<div class="w-10 h-10 flex items-center justify-center">
  <img src="/images/logo.png" alt="Notes by Hash Milhan" class="w-10 h-10 object-contain" />
</div>
```

### Menu Component (`src/components/Menu.vue`)

```vue
<!-- Replace this: -->
<div
  class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
  <span class="text-white font-bold text-sm">HM</span>
</div>

<!-- With this: -->
<div class="w-8 h-8 flex items-center justify-center">
  <img src="/images/logo.png" alt="Notes by Hash Milhan" class="w-8 h-8 object-contain" />
</div>
```

## 🚀 Quick Setup

1. **Add your logo file** to `public/images/logo.png`
2. **Test it works** by visiting `http://localhost:4321/images/logo.png`
3. **Update the components** (see examples above)
4. **Refresh your browser** to see the changes

## 💡 Tips

- **SVG format** is best for logos (scales perfectly, small file size)
- **Keep it simple** - the logo appears small in the header
- **Ensure good contrast** against dark backgrounds
- **Test on different screen sizes** to ensure visibility

That's it! Your logo will now appear in the header and menu instead of the "HM" initials.
