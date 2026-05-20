# How to Add Custom Images to Your Menu

## Option 1: Use Local Images (Your Own Photos)

### Step 1: Create Images Folder
Create this folder structure:
```
public/
  images/
    menu/
      samosa.jpg
      tea.jpg
      veg-burger.jpg
      ... (add all your images)
```

### Step 2: Update Image URLs
In your SQL file or when adding items via admin panel, use:
```
/images/menu/samosa.jpg
/images/menu/tea.jpg
/images/menu/veg-burger.jpg
```

### Step 3: Image Requirements
- Format: JPG, PNG, or WebP
- Size: 400x400 pixels (recommended)
- File size: Under 200KB for fast loading
- Name: Use lowercase with hyphens (e.g., `paneer-puff.jpg`)

---

## Option 2: Use Unsplash (Free Stock Photos) - ALREADY DONE ✅

I've already added Unsplash images for all 60 items. These are:
- Free to use
- High quality
- Load from CDN (fast)
- No download needed

Current format:
```
https://images.unsplash.com/photo-XXXXXX?w=400
```

---

## Option 3: Upload to Supabase Storage

### Step 1: Upload Images
1. Go to: https://supabase.com/dashboard/project/vsepqxxnrdhudmlntaye/storage
2. Create a bucket called `menu-images`
3. Make it public
4. Upload your images

### Step 2: Get URLs
After upload, copy the public URL:
```
https://vsepqxxnrdhudmlntaye.supabase.co/storage/v1/object/public/menu-images/samosa.jpg
```

### Step 3: Update Database
Run SQL:
```sql
UPDATE menu 
SET image_url = 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/menu-images/samosa.jpg'
WHERE name = 'Samosa';
```

---

## Option 4: Use Image URLs from Internet

Find images online and use their direct URLs:
```
https://example.com/food-images/samosa.jpg
```

⚠️ Warning: Make sure you have permission to use these images!

---

## Current Status

✅ All 60 items already have Unsplash images
✅ Images load automatically
✅ No action needed unless you want custom images

## To Change Images via Admin Panel

1. Go to: http://localhost:3000/admin-login
2. Login: admin@college.edu / admin123
3. Click "Edit" on any item
4. Update the "Image URL" field
5. Save

---

## Recommended Image Names

If using local images, use these names:

**Snacks:**
- samosa.jpg
- veg-puff.jpg
- paneer-puff.jpg
- bread-pakora.jpg
- aloo-vada.jpg
- batata-vada.jpg
- veg-cutlet.jpg

**Breakfast:**
- poha.jpg
- misal-pav.jpg
- pav-bhaji.jpg

**Fast Food:**
- veg-burger.jpg
- cheese-burger.jpg
- veg-sandwich.jpg
- grilled-sandwich.jpg
- cheese-sandwich.jpg
- toast-sandwich.jpg
- frankie-roll.jpg
- paneer-roll.jpg
- veg-wrap.jpg
- noodles-roll.jpg

**Chinese:**
- veg-noodles.jpg
- schezwan-noodles.jpg
- hakka-noodles.jpg
- fried-rice.jpg
- schezwan-rice.jpg
- manchurian-dry.jpg
- manchurian-gravy.jpg
- paneer-chilli.jpg
- veg-chilli.jpg
- triple-rice.jpg

**Pizza & Bakery:**
- veg-pizza.jpg
- cheese-pizza.jpg
- mini-pizza.jpg
- garlic-bread.jpg
- cheese-garlic-bread.jpg
- veg-patty.jpg
- cream-roll.jpg
- cup-cake.jpg
- pastry.jpg
- cake-slice.jpg

**Indian Meals:**
- veg-thali.jpg
- dal-rice.jpg
- rajma-rice.jpg
- chole-rice.jpg
- pulao.jpg
- jeera-rice.jpg
- roti-sabzi.jpg
- extra-roti.jpg
- plain-rice.jpg
- curd.jpg

**Beverages:**
- tea.jpg
- coffee.jpg
- cold-coffee.jpg
- lemon-juice.jpg
- buttermilk.jpg
- lassi.jpg
- soft-drink.jpg
- fruit-juice.jpg
- milkshake.jpg
- mineral-water.jpg
