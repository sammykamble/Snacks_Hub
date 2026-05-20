-- Add More Menu Items to Snacks Hub
-- Run this in Supabase SQL Editor

-- More Burgers
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Classic Cheese Burger', 'Juicy beef patty with melted cheddar, lettuce, tomato and special sauce', 10.00, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'),
('Chicken Crispy Burger', 'Crispy fried chicken breast with coleslaw and mayo', 11.50, 'Burgers', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400'),
('Veggie Delight Burger', 'Plant-based patty with avocado, lettuce and vegan mayo', 9.50, 'Burgers', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400'),
('BBQ Bacon Burger', 'Double beef patty with crispy bacon, BBQ sauce and onion rings', 13.50, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400');

-- More Drinks
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Fresh Orange Juice', 'Freshly squeezed orange juice, no added sugar', 4.00, 'Drinks', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'),
('Mango Smoothie', 'Thick mango smoothie with yogurt and honey', 5.50, 'Drinks', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400'),
('Cold Coffee', 'Chilled coffee with milk and ice cream', 5.00, 'Drinks', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Lemon Iced Tea', 'Refreshing iced tea with fresh lemon and mint', 3.50, 'Drinks', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'),
('Chocolate Milkshake', 'Rich chocolate milkshake topped with whipped cream', 6.00, 'Drinks', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'),
('Strawberry Smoothie', 'Fresh strawberries blended with yogurt and ice', 5.50, 'Drinks', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400');

-- More Snacks
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Loaded Nachos', 'Crispy nachos with cheese sauce, jalapeños and sour cream', 7.50, 'Snacks', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400'),
('Chicken Wings', '6 pieces of spicy buffalo wings with ranch dip', 8.50, 'Snacks', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400'),
('Mozzarella Sticks', '5 pieces of crispy fried mozzarella with marinara sauce', 6.50, 'Snacks', 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400'),
('Onion Rings', 'Golden crispy onion rings with spicy mayo', 4.50, 'Snacks', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'),
('Garlic Bread', '4 slices of toasted bread with garlic butter and herbs', 4.00, 'Snacks', 'https://images.unsplash.com/photo-1573140401552-388e3496f4e4?w=400'),
('Spring Rolls', '4 pieces of crispy vegetable spring rolls with sweet chili sauce', 5.50, 'Snacks', 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400');

-- Pizza Items
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella and fresh basil', 11.00, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'),
('Pepperoni Pizza', 'Loaded with pepperoni, mozzarella and Italian herbs', 13.00, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'),
('Veggie Supreme Pizza', 'Bell peppers, mushrooms, olives, onions and tomatoes', 12.00, 'Pizza', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400'),
('BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce, onions and cheese', 14.00, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
('Four Cheese Pizza', 'Mozzarella, cheddar, parmesan and blue cheese blend', 13.50, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400');

-- More Healthy Options
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Greek Salad', 'Fresh lettuce, cucumber, tomatoes, olives and feta cheese', 8.50, 'Healthy', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400'),
('Caesar Salad', 'Romaine lettuce, croutons, parmesan with Caesar dressing', 9.00, 'Healthy', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'),
('Grilled Chicken Salad', 'Mixed greens with grilled chicken, cherry tomatoes and balsamic', 11.00, 'Healthy', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400'),
('Fruit Bowl', 'Fresh seasonal fruits - watermelon, pineapple, grapes and berries', 6.50, 'Healthy', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'),
('Protein Bowl', 'Quinoa, grilled chicken, avocado, chickpeas and tahini dressing', 13.00, 'Healthy', 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400'),
('Veggie Wrap', 'Whole wheat wrap with hummus, veggies and falafel', 8.00, 'Healthy', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400');

-- Coffee Items
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Espresso', 'Strong double shot of Italian espresso', 3.50, 'Coffee', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
('Cappuccino', 'Espresso with steamed milk and foam', 4.50, 'Coffee', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'),
('Americano', 'Espresso with hot water', 4.00, 'Coffee', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'),
('Mocha', 'Espresso with chocolate, steamed milk and whipped cream', 5.50, 'Coffee', 'https://images.unsplash.com/photo-1578374173705-0a5c3e0b2d2e?w=400'),
('Vanilla Latte', 'Espresso with vanilla syrup and steamed milk', 5.00, 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
('Iced Americano', 'Chilled espresso with cold water and ice', 4.50, 'Coffee', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400');

-- Desserts (New Category)
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Chocolate Brownie', 'Warm chocolate brownie with vanilla ice cream', 5.50, 'Desserts', 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400'),
('Cheesecake', 'Classic New York style cheesecake with berry compote', 6.50, 'Desserts', 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400'),
('Apple Pie', 'Homemade apple pie with cinnamon and vanilla ice cream', 5.00, 'Desserts', 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400'),
('Tiramisu', 'Italian coffee-flavored dessert with mascarpone', 6.00, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'),
('Ice Cream Sundae', 'Three scoops with chocolate sauce, nuts and cherry', 5.50, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'),
('Chocolate Chip Cookie', 'Freshly baked warm cookie with chocolate chips', 2.50, 'Desserts', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400');

-- Breakfast Items (New Category)
INSERT INTO menu (name, description, price, category, image_url) VALUES
('Pancakes', 'Stack of 3 fluffy pancakes with maple syrup and butter', 7.00, 'Breakfast', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'),
('French Toast', 'Golden French toast with berries and powdered sugar', 7.50, 'Breakfast', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400'),
('Breakfast Burrito', 'Scrambled eggs, bacon, cheese and salsa in tortilla', 8.50, 'Breakfast', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'),
('Omelette', 'Three egg omelette with cheese, mushrooms and peppers', 8.00, 'Breakfast', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400'),
('Bagel with Cream Cheese', 'Toasted bagel with cream cheese and smoked salmon', 6.50, 'Breakfast', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'),
('Granola Bowl', 'Greek yogurt with granola, honey and fresh berries', 6.00, 'Breakfast', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400');

-- Total: 48 new items added!
-- Categories: Burgers (4), Drinks (6), Snacks (6), Pizza (5), Healthy (6), Coffee (6), Desserts (6), Breakfast (6)
