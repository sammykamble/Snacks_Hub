require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const menuItems = [
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
  { name: 'Veg Burger', description: 'Crispy veg patty with lettuce, tomato and mayo', price: 50, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
  { name: 'Cheese Burger', description: 'Veg patty with melted cheese and special sauce', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { name: 'Veg Sandwich', description: 'Fresh vegetables with green chutney in bread', price: 40, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
  { name: 'Grilled Sandwich', description: 'Grilled sandwich with vegetables and cheese', price: 60, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=400' },
  { name: 'Cheese Sandwich', description: 'Loaded with cheese and grilled to perfection', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400' },
  { name: 'Toast Sandwich', description: 'Toasted bread with butter and vegetables', price: 40, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400' },
  { name: 'Frankie Roll', description: 'Spicy vegetable filling wrapped in roti', price: 50, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
  { name: 'Paneer Roll', description: 'Paneer tikka wrapped in soft roti with sauce', price: 80, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { name: 'Veg Wrap', description: 'Healthy wrap with fresh veggies and hummus', price: 60, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
  { name: 'Noodles Roll', description: 'Hakka noodles wrapped in crispy roll', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { name: 'Veg Noodles', description: 'Stir-fried noodles with fresh vegetables', price: 60, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { name: 'Schezwan Noodles', description: 'Spicy Schezwan sauce noodles with vegetables', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { name: 'Hakka Noodles', description: 'Indo-Chinese style hakka noodles', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { name: 'Fried Rice', description: 'Classic fried rice with mixed vegetables', price: 60, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { name: 'Schezwan Rice', description: 'Spicy Schezwan fried rice', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { name: 'Manchurian Dry', description: 'Crispy veg balls tossed in dry manchurian sauce', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { name: 'Manchurian Gravy', description: 'Veg balls in spicy manchurian gravy', price: 80, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { name: 'Paneer Chilli', description: 'Spicy paneer cubes with bell peppers and sauce', price: 100, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
  { name: 'Veg Chilli', description: 'Mixed vegetables in spicy chilli sauce', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { name: 'Triple Rice', description: 'Combination of fried rice, noodles and manchurian', price: 110, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { name: 'Veg Pizza', description: 'Loaded with fresh vegetables and cheese', price: 100, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { name: 'Cheese Pizza', description: 'Extra cheese pizza with herbs', price: 120, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { name: 'Mini Pizza', description: 'Small personal pizza with toppings', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1573140401552-388e3496f4e4?w=400' },
  { name: 'Cheese Garlic Bread', description: 'Garlic bread topped with melted cheese', price: 80, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1573140401552-388e3496f4e4?w=400' },
  { name: 'Veg Patty', description: 'Flaky pastry with spiced vegetable filling', price: 25, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { name: 'Cream Roll', description: 'Sweet cream filled pastry roll', price: 25, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400' },
  { name: 'Cup Cake', description: 'Soft and fluffy cupcake with frosting', price: 40, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400' },
  { name: 'Pastry', description: 'Fresh cream pastry with chocolate topping', price: 50, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400' },
  { name: 'Cake Slice', description: 'Delicious cake slice of the day', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { name: 'Veg Thali', description: 'Complete meal with dal, sabzi, roti, rice and salad', price: 80, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { name: 'Dal Rice', description: 'Steamed rice with yellow dal tadka', price: 50, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { name: 'Rajma Rice', description: 'Kidney beans curry with steamed rice', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { name: 'Chole Rice', description: 'Spicy chickpea curry with rice', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { name: 'Pulao', description: 'Fragrant basmati rice with vegetables and spices', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { name: 'Jeera Rice', description: 'Cumin flavored basmati rice', price: 50, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { name: 'Roti Sabzi', description: 'Indian flatbread with vegetable curry', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { name: 'Extra Roti', description: 'Additional Indian flatbread', price: 10, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
  { name: 'Plain Rice', description: 'Steamed basmati rice', price: 40, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { name: 'Curd', description: 'Fresh homemade yogurt', price: 20, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1571212515416-fca2ce42e9b2?w=400' },
  { name: 'Tea', description: 'Hot Indian chai with milk and spices', price: 20, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1597318181409-cf64992eec8b?w=400' },
  { name: 'Coffee', description: 'Hot filter coffee', price: 30, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400' },
  { name: 'Cold Coffee', description: 'Chilled coffee with ice cream and milk', price: 60, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400' },
  { name: 'Lemon Juice', description: 'Fresh lemon juice with mint', price: 15, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400' },
  { name: 'Buttermilk', description: 'Refreshing spiced buttermilk', price: 15, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  { name: 'Lassi', description: 'Thick and creamy yogurt drink', price: 40, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  { name: 'Soft Drink', description: 'Chilled carbonated soft drink', price: 30, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400' },
  { name: 'Fruit Juice', description: 'Fresh seasonal fruit juice', price: 40, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
  { name: 'Milkshake', description: 'Thick milkshake in various flavors', price: 60, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
  { name: 'Mineral Water', description: 'Packaged drinking water bottle', price: 20, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
];

async function addToSupabase() {
  console.log('🍛 Adding 60 items to Supabase database...\n');

  try {
    // Try to insert items
    const { data, error } = await supabase
      .from('menu')
      .insert(menuItems)
      .select();

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Solution: Go to Supabase Dashboard and run the SQL file instead:');
      console.log('   1. Open: https://supabase.com/dashboard/project/vsepqxxnrdhudmlntaye/editor');
      console.log('   2. Click "SQL Editor" → "New Query"');
      console.log('   3. Copy content from: indian-canteen-menu.sql');
      console.log('   4. Paste and click "Run"');
      process.exit(1);
    }

    console.log(`✅ Successfully added ${data.length} items!\n`);
    console.log('🎉 Refresh your browser to see all items!');
    console.log('   http://localhost:3000/menu');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

addToSupabase();
