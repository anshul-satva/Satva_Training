-- hotel table
CREATE TYPE hotel_type AS ENUM
('Budget', 'Business', 'Luxury', 'Resort', 'Boutique');

CREATE TABLE hotels(
	hotel_id SERIAL PRIMARY KEY,
	hotel_name VARCHAR(200) NOT NULL,
	location_id INT NOT NULL,
	phone VARCHAR(20) NOT NULL,
	email VARCHAR(100),
	hotel_type hotel_type NOT NULL,
	star_rating DECIMAL(2,1) CHECK(star_rating BETWEEN 1 AND 5),
	total_rooms INT NOT NULL,
	FOREIGN KEY (location_id) REFERENCES locations(location_id)
	);

-- location table
CREATE TABLE locations(
	location_id SERIAL PRIMARY KEY,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(100) NOT NULL,
	country VARCHAR(100) NOT NULL,
	zip_code VARCHAR(20)
)

-- guests table
CREATE TABLE guests(
	guest_id SERIAL PRIMARY KEY,
	guest_name VARCHAR(100),
	email VARCHAR(100) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	address TEXT,
	total_bookings INT DEFAULT 0
);

-- rooms table
CREATE TYPE room_type AS ENUM
('Single', 'Double', 'Deluxe', 'Suite', 'Presidential');
CREATE TYPE room_status AS ENUM 
('Available', 'Occupied', 'Cleaning', 'Maintenance');
 
CREATE TABLE rooms(
	room_id SERIAL PRIMARY KEY,
	hotel_id INT NOT NULL,
	room_number VARCHAR(10) NOT NULL,
    room_type room_type NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    room_status room_status DEFAULT 'Available',
	amenities TEXT,
    booked_by INT,

    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (booked_by) REFERENCES guests(guest_id),
    UNIQUE(hotel_id, room_number)
)

-- booking table
CREATE TYPE booking_status AS ENUM ('Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled');
CREATE TYPE payment_status AS ENUM ('Pending', 'Completed', 'Refunded');

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status booking_status DEFAULT 'Confirmed',
    payment_status payment_status DEFAULT 'Pending',
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CHECK (check_out_date > check_in_date)
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    hotel_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    joined_date DATE NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- indexing
CREATE INDEX idx_booking_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX idx_staff_hotel ON staff(hotel_id);

-- inserting into locations
INSERT INTO locations (city, state, country, zip_code) VALUES
('Mumbai', 'Maharashtra', 'India', '400001'),
('Delhi', 'Delhi', 'India', '110001'),
('Bangalore', 'Karnataka', 'India', '560001'),
('Goa', 'Goa', 'India', '403001'),
('Jaipur', 'Rajasthan', 'India', '302001'),
('New York', 'New York', 'USA', '10001'),
('London', 'England', 'UK', 'SW1A 1AA'),
('Paris', 'Île-de-France', 'France', '75001'),
('Dubai', 'Dubai', 'UAE', '00000'),
('Singapore', 'Singapore', 'Singapore', '018956');


-- inserting into hotels
INSERT INTO hotels (hotel_name, location_id, phone, email, hotel_type, star_rating, total_rooms) VALUES
('The Grand Mumbai', 1, '+91-22-12345678', 'grand.mumbai@hotel.com', 'Luxury', 5.0, 150),
('Business Inn Delhi', 2, '+91-11-87654321', 'contact@businessinn.com', 'Business', 4.0, 80),
('Bangalore Comfort', 3, '+91-80-11223344', 'info@blrcomfort.com', 'Budget', 3.5, 50),
('Goa Beach Resort', 4, '+91-832-9988776', 'beach@goaresort.com', 'Resort', 4.5, 120),
('Royal Palace Jaipur', 5, '+91-141-5544332', 'royal@jaipur.com', 'Boutique', 5.0, 60),
('NYC Plaza Hotel', 6, '+1-212-5551234', 'info@nycplaza.com', 'Luxury', 4.8, 200),
('London Bridge Hotel', 7, '+44-20-12345678', 'stay@londonbridge.com', 'Business', 4.2, 90),
('Paris Boutique Stay', 8, '+33-1-23456789', 'hello@parisboutique.fr', 'Boutique', 4.7, 45),
('Dubai Luxury Towers', 9, '+971-4-9876543', 'reservations@dubailuxury.ae', 'Luxury', 5.0, 180),
('Singapore Budget Inn', 10, '+65-6123-4567', 'budget@singapore.sg', 'Budget', 3.0, 70);


-- inserting into guests
INSERT INTO guests (guest_name, email, phone, address, total_bookings) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9876543210', 'Andheri, Mumbai, India', 5),
('Priya Sharma', 'priya.sharma@email.com', '+91-9876543211', 'Connaught Place, Delhi, India', 3),
('John Smith', 'john.smith@email.com', '+1-555-0101', '123 Main St, New York, USA', 8),
('Emily Johnson', 'emily.johnson@email.com', '+1-555-0102', '456 Park Ave, New York, USA', 2),
('Mohammed Ali', 'mohammed.ali@email.com', '+971-50-1234567', 'Dubai Marina, Dubai, UAE', 12),
('Sophie Martin', 'sophie.martin@email.com', '+33-6-12345678', '78 Rue de Rivoli, Paris, France', 4),
('David Lee', 'david.lee@email.com', '+65-9123-4567', 'Orchard Road, Singapore', 6),
('Amit Patel', 'amit.patel@email.com', '+91-9876543212', 'Koramangala, Bangalore, India', 1),
('Sarah Brown', 'sarah.brown@email.com', '+44-7700-900123', 'Westminster, London, UK', 7),
('Carlos Rodriguez', 'carlos.rodriguez@email.com', '+34-612-345678', 'Barcelona, Spain', 3),
('Anita Desai', 'anita.desai@email.com', '+91-9876543213', 'Bandra, Mumbai, India', 9),
('Michael Chen', 'michael.chen@email.com', '+86-138-0013-8000', 'Shanghai, China', 4),
('Lisa Anderson', 'lisa.anderson@email.com', '+1-555-0103', 'Los Angeles, USA', 2),
('Vikram Singh', 'vikram.singh@email.com', '+91-9876543214', 'Civil Lines, Jaipur, India', 5),
('Maria Garcia', 'maria.garcia@email.com', '+52-55-1234-5678', 'Mexico City, Mexico', 1);


TRUNCATE TABLE bookings, rooms RESTART IDENTITY CASCADE;
-- inserting into rooms
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, room_status, amenities, booked_by) VALUES
-- The Grand Mumbai (hotel_id = 1) -- room_id will be 1-5
(1, '101', 'Single', 3500.00, 'Available', 'AC, TV, WiFi', NULL),
(1, '102', 'Double', 5500.00, 'Occupied', 'AC, TV, WiFi, Mini Bar', 1),
(1, '201', 'Deluxe', 8500.00, 'Available', 'AC, TV, WiFi, Mini Bar, Balcony', NULL),
(1, '301', 'Suite', 15000.00, 'Occupied', 'AC, TV, WiFi, Mini Bar, Balcony, Jacuzzi', 11),
(1, '401', 'Presidential', 35000.00, 'Available', 'AC, TV, WiFi, Mini Bar, Balcony, Jacuzzi, Kitchen', NULL),

-- Business Inn Delhi (hotel_id = 2) -- room_id will be 6-9
(2, '101', 'Single', 2500.00, 'Available', 'AC, TV, WiFi', NULL),
(2, '102', 'Double', 4000.00, 'Cleaning', 'AC, TV, WiFi, Work Desk', NULL),
(2, '201', 'Deluxe', 6000.00, 'Occupied', 'AC, TV, WiFi, Work Desk, Mini Bar', 2),
(2, '202', 'Suite', 10000.00, 'Available', 'AC, TV, WiFi, Work Desk, Mini Bar, Meeting Room', NULL),

-- Bangalore Comfort (hotel_id = 3) -- room_id will be 10-12
(3, '101', 'Single', 1500.00, 'Available', 'AC, TV, WiFi', NULL),
(3, '102', 'Double', 2500.00, 'Occupied', 'AC, TV, WiFi', 8),
(3, '201', 'Deluxe', 4000.00, 'Maintenance', 'AC, TV, WiFi, Balcony', NULL),

-- Goa Beach Resort (hotel_id = 4) -- room_id will be 13-16
(4, '101', 'Double', 6000.00, 'Available', 'AC, TV, WiFi, Sea View', NULL),
(4, '102', 'Deluxe', 9000.00, 'Occupied', 'AC, TV, WiFi, Sea View, Balcony', 5),
(4, '201', 'Suite', 15000.00, 'Available', 'AC, TV, WiFi, Sea View, Balcony, Private Pool', NULL),
(4, '301', 'Presidential', 30000.00, 'Occupied', 'AC, TV, WiFi, Sea View, Balcony, Private Pool, Butler Service', 12),

-- Royal Palace Jaipur (hotel_id = 5) -- room_id will be 17-19
(5, '101', 'Deluxe', 7000.00, 'Available', 'AC, TV, WiFi, Heritage Decor', NULL),
(5, '201', 'Suite', 12000.00, 'Occupied', 'AC, TV, WiFi, Heritage Decor, Garden View', 14),
(5, '301', 'Presidential', 25000.00, 'Available', 'AC, TV, WiFi, Heritage Decor, Garden View, Royal Service', NULL),

-- NYC Plaza Hotel (hotel_id = 6) -- room_id will be 20-24
(6, '1001', 'Single', 15000.00, 'Available', 'AC, TV, WiFi, City View', NULL),
(6, '1002', 'Double', 22000.00, 'Occupied', 'AC, TV, WiFi, City View, Work Desk', 3),
(6, '2001', 'Deluxe', 35000.00, 'Available', 'AC, TV, WiFi, City View, Work Desk, Mini Bar', NULL),
(6, '3001', 'Suite', 60000.00, 'Occupied', 'AC, TV, WiFi, Skyline View, Mini Bar, Kitchen', 4),
(6, '4001', 'Presidential', 120000.00, 'Available', 'AC, TV, WiFi, Penthouse, Mini Bar, Kitchen, Butler', NULL),

-- London Bridge Hotel (hotel_id = 7) -- room_id will be 25-27
(7, '101', 'Single', 12000.00, 'Available', 'AC, TV, WiFi', NULL),
(7, '102', 'Double', 18000.00, 'Occupied', 'AC, TV, WiFi, Thames View', 9),
(7, '201', 'Suite', 35000.00, 'Available', 'AC, TV, WiFi, Thames View, Mini Bar', NULL),

-- Paris Boutique Stay (hotel_id = 8) -- room_id will be 28-30
(8, '101', 'Double', 16000.00, 'Available', 'AC, TV, WiFi, French Decor', NULL),
(8, '201', 'Deluxe', 25000.00, 'Occupied', 'AC, TV, WiFi, French Decor, Eiffel View', 6),
(8, '301', 'Suite', 45000.00, 'Available', 'AC, TV, WiFi, French Decor, Eiffel View, Terrace', NULL),

-- Dubai Luxury Towers (hotel_id = 9) -- room_id will be 31-33
(9, '1501', 'Deluxe', 28000.00, 'Available', 'AC, TV, WiFi, Desert View', NULL),
(9, '2001', 'Suite', 50000.00, 'Occupied', 'AC, TV, WiFi, Burj View, Mini Bar', 5),
(9, '2501', 'Presidential', 100000.00, 'Available', 'AC, TV, WiFi, Burj View, Private Pool, Butler', NULL),

-- Singapore Budget Inn (hotel_id = 10) -- room_id will be 34-36
(10, '101', 'Single', 5000.00, 'Available', 'AC, TV, WiFi', NULL),
(10, '102', 'Double', 7500.00, 'Occupied', 'AC, TV, WiFi', 7),
(10, '201', 'Deluxe', 12000.00, 'Available', 'AC, TV, WiFi, Marina View', NULL);


-- inserting into bookings
INSERT INTO bookings (guest_id, hotel_id, room_id, check_in_date, check_out_date, total_amount, booking_status, payment_status) VALUES
-- Active bookings (using correct room_id sequence)
(1, 1, 2, '2026-02-10', '2026-02-15', 27500.00, 'Checked-In', 'Completed'),      
(11, 1, 4, '2026-02-12', '2026-02-18', 90000.00, 'Checked-In', 'Completed'),     
(2, 2, 8, '2026-02-11', '2026-02-14', 18000.00, 'Checked-In', 'Completed'),      
(8, 3, 11, '2026-02-13', '2026-02-16', 7500.00, 'Checked-In', 'Completed'),      
(5, 4, 14, '2026-02-08', '2026-02-15', 63000.00, 'Checked-In', 'Completed'),     
(12, 4, 16, '2026-02-10', '2026-02-17', 210000.00, 'Checked-In', 'Completed'),   
(14, 5, 18, '2026-02-09', '2026-02-14', 60000.00, 'Checked-In', 'Completed'),    
(3, 6, 21, '2026-02-12', '2026-02-16', 88000.00, 'Checked-In', 'Completed'),     
(4, 6, 23, '2026-02-11', '2026-02-15', 240000.00, 'Checked-In', 'Completed'),    
(9, 7, 26, '2026-02-10', '2026-02-13', 54000.00, 'Checked-In', 'Completed'),     
(6, 8, 29, '2026-02-11', '2026-02-16', 125000.00, 'Checked-In', 'Completed'),    
(5, 9, 32, '2026-02-09', '2026-02-16', 350000.00, 'Checked-In', 'Completed'),    
(7, 10, 35, '2026-02-12', '2026-02-15', 22500.00, 'Checked-In', 'Completed'),    

-- Future confirmed bookings
(3, 1, 1, '2026-02-20', '2026-02-25', 17500.00, 'Confirmed', 'Pending'),
(6, 4, 15, '2026-02-25', '2026-03-02', 105000.00, 'Confirmed', 'Pending'),
(9, 6, 22, '2026-03-01', '2026-03-05', 140000.00, 'Confirmed', 'Pending'),
(10, 5, 17, '2026-02-28', '2026-03-03', 35000.00, 'Confirmed', 'Pending'),

-- Past completed bookings
(1, 1, 2, '2026-01-15', '2026-01-20', 27500.00, 'Checked-Out', 'Completed'),
(2, 2, 8, '2026-01-10', '2026-01-13', 18000.00, 'Checked-Out', 'Completed'),
(3, 6, 21, '2026-01-20', '2026-01-25', 110000.00, 'Checked-Out', 'Completed'),
(5, 9, 32, '2025-12-25', '2026-01-02', 400000.00, 'Checked-Out', 'Completed'),
(11, 1, 4, '2025-12-20', '2025-12-27', 105000.00, 'Checked-Out', 'Completed'),
(7, 10, 35, '2026-01-05', '2026-01-08', 22500.00, 'Checked-Out', 'Completed'),
(14, 5, 18, '2025-11-10', '2025-11-15', 60000.00, 'Checked-Out', 'Completed'),

-- Cancelled bookings
(13, 1, 5, '2026-02-15', '2026-02-20', 175000.00, 'Cancelled', 'Refunded'),
(10, 8, 30, '2026-02-18', '2026-02-22', 180000.00, 'Cancelled', 'Refunded'),
(15, 6, 24, '2026-03-10', '2026-03-15', 600000.00, 'Cancelled', 'Pending');


-- inserting into staff
INSERT INTO staff (name, phone, address, hotel_id, position, salary, joined_date) VALUES
-- The Grand Mumbai staff
('Ramesh Gupta', '+91-9876501001', 'Dadar, Mumbai', 1, 'Manager', 85000.00, '2020-01-15'),
('Sunita Rao', '+91-9876501002', 'Andheri, Mumbai', 1, 'Front Desk', 35000.00, '2021-03-20'),
('Karan Mehta', '+91-9876501003', 'Bandra, Mumbai', 1, 'Chef', 55000.00, '2019-06-10'),
('Neha Shah', '+91-9876501004', 'Thane, Mumbai', 1, 'Housekeeping', 28000.00, '2022-02-14'),

-- Business Inn Delhi staff
('Suresh Kumar', '+91-9876502001', 'Rohini, Delhi', 2, 'Manager', 75000.00, '2019-08-01'),
('Pooja Verma', '+91-9876502002', 'Dwarka, Delhi', 2, 'Receptionist', 32000.00, '2021-11-05'),
('Rahul Singh', '+91-9876502003', 'Noida, UP', 2, 'Maintenance', 30000.00, '2020-05-20'),

-- Bangalore Comfort staff
('Ganesh Reddy', '+91-9876503001', 'Whitefield, Bangalore', 3, 'Manager', 60000.00, '2021-01-10'),
('Lakshmi Iyer', '+91-9876503002', 'Indiranagar, Bangalore', 3, 'Front Desk', 30000.00, '2022-07-15'),
('Vijay Kumar', '+91-9876503003', 'HSR Layout, Bangalore', 3, 'Chef', 45000.00, '2020-09-01'),

-- Goa Beach Resort staff
('Carlos Souza', '+91-9876504001', 'Panjim, Goa', 4, 'Manager', 90000.00, '2018-03-01'),
('Maria Fernandes', '+91-9876504002', 'Calangute, Goa', 4, 'Front Desk', 38000.00, '2021-05-20'),
('John Dias', '+91-9876504003', 'Candolim, Goa', 4, 'Chef', 60000.00, '2019-07-15'),
('Rita Pereira', '+91-9876504004', 'Mapusa, Goa', 4, 'Spa Manager', 50000.00, '2020-02-10'),

-- Royal Palace Jaipur staff
('Mahendra Singh', '+91-9876505001', 'Civil Lines, Jaipur', 5, 'Manager', 80000.00, '2019-04-01'),
('Priyanka Rathore', '+91-9876505002', 'Malviya Nagar, Jaipur', 5, 'Receptionist', 35000.00, '2021-08-12'),
('Arjun Sharma', '+91-9876505003', 'Vaishali Nagar, Jaipur', 5, 'Heritage Guide', 40000.00, '2020-11-20'),

-- NYC Plaza Hotel staff
('Robert Johnson', '+1-555-6001', 'Manhattan, NY', 6, 'General Manager', 550000.00, '2018-01-15'),
('Jennifer Williams', '+1-555-6002', 'Brooklyn, NY', 6, 'Front Desk Manager', 280000.00, '2020-03-10'),
('Michael Davis', '+1-555-6003', 'Queens, NY', 6, 'Executive Chef', 350000.00, '2019-05-20'),
('Amanda Wilson', '+1-555-6004', 'Manhattan, NY', 6, 'Concierge', 220000.00, '2021-07-01'),

-- London Bridge Hotel staff
('James Thompson', '+44-7700-901001', 'Westminster, London', 7, 'Manager', 320000.00, '2019-02-01'),
('Emma Roberts', '+44-7700-901002', 'Camden, London', 7, 'Receptionist', 180000.00, '2021-06-15'),
('Oliver Harris', '+44-7700-901003', 'Shoreditch, London', 7, 'Chef', 240000.00, '2020-04-10'),

-- Paris Boutique Stay staff
('Pierre Dubois', '+33-6-20001001', 'Marais, Paris', 8, 'Manager', 280000.00, '2020-01-20'),
('Isabelle Laurent', '+33-6-20001002', 'Montmartre, Paris', 8, 'Receptionist', 160000.00, '2021-09-05'),
('Antoine Bernard', '+33-6-20001003', 'Latin Quarter, Paris', 8, 'Chef', 220000.00, '2019-11-15'),

-- Dubai Luxury Towers staff
('Ahmed Al Maktoum', '+971-50-7001001', 'Dubai Marina, Dubai', 9, 'General Manager', 650000.00, '2018-06-01'),
('Fatima Hassan', '+971-50-7001002', 'Jumeirah, Dubai', 9, 'Front Desk Manager', 320000.00, '2020-08-10'),
('Youssef Ibrahim', '+971-50-7001003', 'Downtown Dubai, Dubai', 9, 'Executive Chef', 450000.00, '2019-03-20'),
('Layla Abdullah', '+971-50-7001004', 'Palm Jumeirah, Dubai', 9, 'Concierge', 280000.00, '2021-02-14'),

-- Singapore Budget Inn staff
('Tan Wei Ming', '+65-9001-1001', 'Orchard, Singapore', 10, 'Manager', 180000.00, '2021-05-01'),
('Lim Hui Ling', '+65-9001-1002', 'Bugis, Singapore', 10, 'Receptionist', 95000.00, '2022-01-10'),
('Chen Jia Wei', '+65-9001-1003', 'Chinatown, Singapore', 10, 'Housekeeping Supervisor', 85000.00, '2021-08-20');


-- Queries

-- 1) query to fetch room details where room_status is Available
SELECT hotel_id, room_number, room_type, amenities, price_per_night 
FROM rooms 
WHERE room_status = 'Available'

-- 2)  Retrieve all hotels located in India with a star rating of 4.0 or above
SELECT htl.hotel_name, htl.location_id, htl.phone, htl.email, htl.hotel_type, htl.star_rating, htl.total_rooms,
loc.city
FROM hotels htl 
INNER JOIN locations loc ON htl.location_id = loc.location_id
WHERE loc.country = 'India' AND htl.star_rating > 4.0
ORDER BY htl.star_rating

-- 3) List all guests who have made more than 5 bookings, showing their name, email, and total bookings.
SELECT g.guest_name, g.email, COUNT(b.booking_id) AS total_bookings
FROM guests g 
INNER JOIN bookings b ON g.guest_id = b.guest_id
WHERE g.total_bookings > 5 
GROUP BY guest_name, email
ORDER BY total_bookings DESC

-- 4) Find all available rooms with a price per night less than ₹10,000, ordered by price (lowest first).
SELECT * FROM rooms 
WHERE price_per_night > 10000
ORDER BY price_per_night

-- 5) Display all bookings with 'Pending' payment status along with the guest name and total amount.
SELECT htl.hotel_name, bkng.room_id, bkng.payment_status, gst.guest_name, bkng.total_amount
FROM bookings bkng 
INNER JOIN guests gst ON gst.guest_id = bkng.guest_id
INNER JOIN hotels htl ON htl.hotel_id = bkng.hotel_id
WHERE bkng.payment_status = 'Pending'

-- 6) Find all staff members working at 'The Grand Mumbai' hotel with a salary greater than ₹50,000.
SELECT staff.name AS "Staff Name"
FROM staff INNER JOIN hotels ON hotels.hotel_id = staff.hotel_id
WHERE staff.salary > 50000 
AND hotels.hotel_name = 'The Grand Mumbai'

-- 7) Display all rooms along with their booking information. Include rooms that are not currently booked.
SELECT * FROM rooms
LEFT JOIN bookings ON rooms.room_id = bookings.room_id

-- 8) Display each hotel's name, location (city), and total revenue from completed bookings.
SELECT hotels.hotel_name, locations.city, 
SUM(bookings.total_amount) AS "Total Revenue"
FROM hotels INNER JOIN locations on hotels.location_id = locations.location_id
INNER JOIN bookings ON hotels.hotel_id = bookings.booking_id
GROUP BY hotels.hotel_name, locations.city
ORDER BY "Total Revenue" DESC

-- 9) Find all hotels that have at least one 'Presidential' room type.
SELECT hotels.hotel_name AS  "Hotels with Presidential Rooms"
FROM hotels 
WHERE hotel_id IN(
SELECT hotel_id FROM rooms 
WHERE room_type = 'Presidential')

-- 10) Get the average price per night for each room type across all hotels.
SELECT subQ.hotel_name, CAST(subQ."Avg Price Per Night" AS DECIMAL(10,2))
FROM (
SELECT hotel_name, AVG(rooms.price_per_night) AS "Avg Price Per Night"
  FROM rooms INNER JOIN hotels
  ON rooms.hotel_id = hotels.hotel_id
  GROUP BY hotels.hotel_id
) AS subQ

-- 11) Find all hotels that have at least one booking with status 'Cancelled'.
SELECT * FROM bookings WHERE booking_status = 'Cancelled'

SELECT hotels.hotel_name
FROM hotels 
WHERE EXISTS (
SELECT 1 FROM bookings
WHERE bookings.hotel_id = hotels.hotel_id AND booking_status = 'Cancelled'
)

-- 12)  Create a view called active_bookings_view that shows booking_id, guest name, hotel name, room number, check-in date, check-out date for all bookings with status 'Checked-In' or 'Confirmed'.
CREATE VIEW active_bookings_view 
AS
SELECT bookings.booking_id, guests.guest_name, hotels.hotel_name, rooms.room_number, 
bookings.check_in_date, bookings.check_out_date, bookings.booking_status
FROM hotels 
INNER JOIN bookings ON bookings.hotel_id = hotels.hotel_id
INNER JOIN guests ON guests.guest_id = bookings.guest_id
INNER JOIN rooms ON rooms.room_id = bookings.room_id
WHERE bookings.booking_status IN ('Checked-In','Confirmed')

SELECT * FROM active_bookings_view

-- 13) Create a view called hotel_revenue_summary showing hotel_id, hotel_name, total_bookings, and total_revenue (only from completed payments).
CREATE VIEW hotel_revenue_summary
AS
SELECT hotels.hotel_id, hotels.hotel_name, locations.city, hotels.hotel_type, 
SUM(bookings.total_amount)
FROM hotels 
INNER JOIN bookings ON bookings.hotel_id = hotels.hotel_id
INNER JOIN locations ON hotels.location_id = locations.location_id
WHERE bookings.payment_status ='Completed'
GROUP BY hotels.hotel_id, hotels.hotel_name, locations.city, hotels.hotel_type

SELECT * FROM hotel_revenue_summary

-- 14) Create a function called calculate_booking_nights that takes check_in_date and check_out_date as parameters and returns the number of nights.
CREATE FUNCTION calculate_booking_nights (
       check_in DATE,
	   check_out DATE)
RETURNS INTEGER AS $$
BEGIN 
    RETURN check_out - check_in;
END
$$ LANGUAGE plpgsql;

SELECT calculate_booking_nights('25-08-2005','13-02-2026')


-- 15) using function
SELECT hotels.hotel_id,hotels.hotel_name, guests.guest_name, 
calculate_booking_nights(bookings.check_in_date,bookings.check_out_date) AS "Total nights"
FROM hotels 
INNER JOIN bookings ON hotels.hotel_id = bookings.hotel_id
INNER JOIN guests ON guests.guest_id = bookings.guest_id

-- 16) Create index for faster date range queries
CREATE INDEX idx_bookings_date_range 
ON bookings(check_in_date, check_out_date);

-- 
EXPLAIN ANALYZE
SELECT bookings.booking_id, guests.guest_name, hotels.hotel_name,
bookings.check_in_date,bookings.check_out_date, bookings.total_amount, bookings.booking_status
FROM bookings 
INNER JOIN guests ON guests.guest_id = bookings.guest_id
INNER JOIN hotels ON hotels.hotel_id = bookings.hotel_id
WHERE bookings.check_in_date >= '2026-02-01' AND 
bookings.check_out_date <= '2026-02-28'
ORDER BY bookings.check_in_date;

-- 17) Show all rooms grouped by status (demonstrates ENUM)
SELECT 
    room_status,
    COUNT(*) AS room_count,
    ROUND(AVG(price_per_night), 2) AS avg_price
FROM rooms
GROUP BY room_status
ORDER BY room_count DESC;

--- REVIEW queries:
--1) All hotels in mumbai, all bookings 
SELECT hotels.hotel_name, bookings.booking_id, guests.guest_name, locations.city
FROM bookings 
INNER JOIN hotels ON bookings.hotel_id = hotels.hotel_id
INNER JOIN guests ON bookings.guest_id = guests.guest_id
INNER JOIN locations ON locations.location_id = hotels.location_id
WHERE locations.city = 'Mumbai'

--2) Available rooms per city
SELECT locations.city , COUNT(rooms.room_id) AS "Available Rooms"
FROM rooms INNER JOIN hotels ON rooms.hotel_id = hotels.hotel_id
INNER JOIN locations ON locations.location_id = hotels.location_id
WHERE rooms.room_status = 'Available'
GROUP BY locations.city
ORDER BY "Available Rooms"

--3) Total Bookings of guests per Hotel
SELECT hotels.hotel_name , guests.guest_name, COUNT(bookings.booking_id) AS "Total Bookings per Hotel"
FROM bookings 
INNER JOIN guests ON bookings.guest_id = guests.guest_id
INNER JOIN hotels ON bookings.hotel_id = hotels.hotel_id
GROUP BY hotels.hotel_name, guests.guest_name

--4) AVg earning per hotel
SELECT hotels.hotel_name, ROUND(AVG(bookings.total_amount),2) AS "Avg Revenue"
FROM bookings 
INNER JOIN hotels ON bookings.hotel_id = hotels.hotel_id
GROUP BY hotels.hotel_name
ORDER BY "Avg Revenue" DESC

--5) same 4th but earnings per month
SELECT hotels.hotel_name,EXTRACT(Month FROMCOUNT) ROUND(AVG(bookings.total_amount),2) AS "Avg Revenue"
FROM bookings 
INNER JOIN hotels ON bookings.hotel_id = hotels.hotel_id
GROUP BY hotels.hotel_name
ORDER BY "Avg Revenue" DESC



CREATE TYPE booking_status2 AS ENUM (
'Pending', 'Confirmed', 'cancelled'
)

CREATE TABLE bookings2 (
	booking_id SERIAL PRIMARY KEY,
	customner_name TEXT,
	status booking_status2,
	booking_date DATE
)

select * from bookings2
ALTER TABLE bookings2 RENAME customner_name TO customer_name

INSERT INTO bookings2 (customer_name, status, booking_date)
VALUES
('Rahul', 'Confirmed', '2026-02-10'),
('Anita', 'Pending', '2026-02-11'),
('Vijay', 'cancelled', '2026-02-12');

SELECT booking_id, customer_name, status
FROM bookings2
WHERE status = 'Confirmed';

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_name TEXT,
    order_details JSONB
);

INSERT INTO orders(customer_name, order_details)
VALUES (
	'Rohit',
 	'{
	 	"product": "Laptop",
		 "price": 65000,
		 "payment":{
				"method": "credit card",
				"status": "paid"
		 },
		"items":1
	 }'
)

INSERT INTO orders (customer_name, order_details)
VALUES (
    'Amit',
    '{
        "product": "Laptop",
        "price": 65000,
        "payment": {
            "method": "Credit Card",
            "status": "Paid"
        },
        "items": 1
    }'
);



