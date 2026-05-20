require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const indianMenuItems = [
  { name: 'Samosa', description: 'Crispy fried pastry filled with spiced potatoes and peas', price: 20, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { name: 'Veg Puff', description: 'Flaky puff pastry stuffed with mixed vegetables', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { name: 'Paneer Puff', description: 'Golden puff pastry filled with spiced paneer', price: 35, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { name: 'Bread Pakora', description: 'Bread slices dipped in gram flour batter and deep fried', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
  { name: 'Aloo Vada', description: 'Spiced potato fritters coated in chickpea batter', price: 15, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { name: 'Batata Vada', description: 'Mumbai style potato vada with spicy chutney', price: 15, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { name: 'Veg Cutlet', description: 'Crispy vegetable patties with breadcrumb coating', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
  { name: 'Poha', description: 'Flattened rice cooked with onions, peanuts and spices', price: 20, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
  { name: 'Misal Pav', description: 'Spicy sprouts curry served with soft bread rolls', price: 50, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400' },
  { name: 'Pav Bhaji', description: 'Spiced mashed vegetables served with buttered pav', price: 70, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
];

async function addIndianMenu() {
  console.log('🍛 Adding Indian canteen items to Supabase...\n');

  // First, delete all existing items
  console.log('🗑️  Clearing existing menu items...');
  const { error: deleteError } = await supabase
    .from('menu')
    .delete()
    .neq('id', 0); // Delete all rows

  if (deleteError) {
    console.error('❌ Error clearing menu:', deleteError.message);
  } else {
    console.log('✅ Existing menu cleared\n');
  }

  // Add new Indian items
  console.log('➕ Adding Indian canteen items...');
  const { data, error } = await supabase
    .from('menu')
    .insert(indianMenuItems)
    .select();

  if (error) {
    console.error('❌ Error adding items:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully added ${data.length} items!\n`);
  console.log('📋 Items added:');
  data.forEach(item => {
    console.log(`   • ${item.name} - ₹${item.price} (${item.category})`);
  });

  console.log('\n🎉 Done! Refresh your browser to see the new menu.');
  process.exit(0);
}

addIndianMenu();
